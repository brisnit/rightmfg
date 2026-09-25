import { capabilities, capabilityById, categoryLabels, categoryOrder } from "@/data/capabilities";
import { materials } from "@/data/materials";
import { markets } from "@/data/markets";
import { serviceHref } from "@/data/services";
import { flags as flagDefs, needs as needDefs, partTypes, rules, sheetFormTerms, tubeFormTerms } from "@/data/finder-knowledge";
import type { CapabilityCategory, MarketId, MaterialId } from "@/data/types";
import { intents, type Intent } from "./intents";
import { Haystack, isQuestion } from "./text";
import type {
  DetectedEntity,
  FinderContext,
  FinderFlag,
  FinderRequest,
  FinderResult,
  MatchReason,
  MatchedCapability,
} from "./types";

/**
 * Local knowledge engine for the Capability Finder.
 *
 * 1. Extract entities (parts, materials, markets, needs, explicit processes,
 *    features) and flags (unpublished/unsupported requests) from the query.
 * 2. Merge with conversation context when the query refers back ("it", "this part").
 * 3. Score every capability: direct keywords + part archetypes + inference rules
 *    + market relevance, keeping a reason for every point awarded.
 * 4. Detect conversational intents and compose answers from /data.
 *
 * Deterministic, synchronous and dependency-free, so it runs client-side for instant
 * results or behind /api/capability-finder. An LLM provider can replace it
 * as long as it returns FinderResult.
 */

const KEYWORD_W = 4;
const SYNONYM_W = 1.1;
const SYNONYM_CAP = 2.5;
const THRESHOLD = 2.5;

const PROCESS_ORDER = [
  "engineering-support",
  "prototyping",
  "tube-cutoff",
  "shearing",
  "cnc-turret-punching",
  "tube-punching",
  "tube-drill-milling",
  "mandrel-tube-bending",
  "3d-bending",
  "cnc-press-brake",
  "punch-press",
  "cnc-machining",
  "tig-welding",
  "mig-welding",
  "spot-welding",
  "hardware-installation",
  "assembly",
  "surface-prep",
  "powder-coating",
  "part-marking",
  "production-manufacturing",
  "packaging-logistics",
];

/** Every `term:` referenced by a rule, so we only test what matters. */
const RULE_TERMS = Array.from(
  new Set(rules.flatMap((r) => [...(r.all ?? []), ...(r.any ?? []), ...(r.none ?? [])]).filter((k) => k.startsWith("term:")).map((k) => k.slice(5))),
);

const FEATURE_LABELS: Record<string, string> = {
  "multiple bends": "Multiple bends",
  "several bends": "Multiple bends",
  "many bends": "Multiple bends",
  "compound bends": "Compound bends",
  compound: "Compound bends",
  "complex geometry": "Complex geometry",
  "3d": "3D geometry",
  bend: "Bends",
  bent: "Bends",
  bending: "Bends",
  welded: "Welded",
  weld: "Welded",
  welding: "Welded",
  holes: "Holes / features",
  "hole pattern": "Hole pattern",
  slots: "Slots",
  outdoor: "Outdoor use",
  corrosion: "Corrosion resistance",
  tapped: "Tapped features",
  threaded: "Threaded features",
  machined: "Machined features",
};

/** Conversational phrases that contain capability words but aren't requirements. */
const STOP_PHRASES = ["can you handle", "could you handle", "do you handle", "you handle", "we handle", "handle it", "handle this", "handle that", "what can you do", "can you do", "what do you do"];

const REFERENTIAL = /\b(it|this|that|these|those|same|the part|the frame|my part|our part|the design|instead|also|too)\b/;

interface Signals {
  entities: Map<string, DetectedEntity>;
  terms: Set<string>;
  /** capability id → matched keyword terms (strong) */
  capKeywords: Map<string, string[]>;
  capSynonyms: Map<string, string[]>;
  flags: FinderFlag[];
}

function emptySignals(): Signals {
  return { entities: new Map(), terms: new Set(), capKeywords: new Map(), capSynonyms: new Map(), flags: [] };
}

function add(sig: Signals, e: DetectedEntity) {
  if (!sig.entities.has(e.key)) sig.entities.set(e.key, e);
}

function extract(query: string): Signals {
  const sig = emptySignals();
  const h = new Haystack(query);
  for (const p of STOP_PHRASES) h.mask(p);

  // Flags first; unlisted mentions are masked so they don't trigger capability matches.
  for (const f of flagDefs) {
    for (const t of f.terms) {
      const hit = h.find(t);
      if (hit) {
        sig.flags.push({ term: t, level: f.level, message: f.message });
        if (f.level === "unlisted") h.mask(t);
        break;
      }
    }
  }

  for (const m of materials) {
    for (const t of [...m.keywords, ...m.synonyms]) {
      const hit = h.find(t, true);
      if (hit) {
        add(sig, { key: `mat:${m.id}`, kind: "material", label: m.name, term: hit });
        break;
      }
    }
  }
  // "stainless steel" also contains "steel": keep only the most specific material.
  if (sig.entities.has("mat:stainless-steel") && sig.entities.get("mat:carbon-steel")?.term === "steel") {
    sig.entities.delete("mat:carbon-steel");
  }

  for (const m of markets) {
    for (const t of m.keywords) {
      const hit = h.find(t);
      if (hit) {
        add(sig, { key: `mkt:${m.id}`, kind: "market", label: m.name, term: hit });
        break;
      }
    }
  }

  for (const p of partTypes) {
    for (const t of p.terms) {
      const hit = h.find(t);
      if (hit) {
        add(sig, { key: `part:${p.id}`, kind: "part", label: p.label, term: hit });
        if (p.form) add(sig, { key: `form:${p.form}`, kind: "form", label: p.form === "tube" ? "Tube" : "Sheet", term: hit });
        break;
      }
    }
  }

  for (const n of needDefs) {
    for (const t of n.terms) {
      const hit = h.find(t);
      if (hit) {
        add(sig, { key: `need:${n.id}`, kind: "need", label: n.label, term: hit });
        break;
      }
    }
  }
  // Plain quantities ("500 units", "qty 2000") imply production volume.
  const qty = query.match(/\b(\d{1,3}(?:,\d{3})+|\d{2,})\s*(?:pcs|pieces|units|parts|per|a month|\/mo|ea|each|sets|qty)\b/i) ?? query.match(/\bqty\.?\s*(\d+)/i);
  if (qty) {
    const n = Number(qty[1].replace(/,/g, ""));
    if (n >= 50) add(sig, { key: "need:production", kind: "need", label: "Production", term: qty[0] });
    else if (n > 0) add(sig, { key: "need:low-volume", kind: "need", label: "Low volume / high mix", term: qty[0] });
  }

  for (const t of tubeFormTerms) {
    const hit = h.find(t);
    if (hit) {
      add(sig, { key: "form:tube", kind: "form", label: "Tube", term: hit });
      break;
    }
  }
  for (const t of sheetFormTerms) {
    const hit = h.find(t);
    if (hit) {
      add(sig, { key: "form:sheet", kind: "form", label: "Sheet", term: hit });
      break;
    }
  }

  for (const c of capabilities) {
    const kw = c.keywords.map((t) => h.find(t)).filter((x): x is string => !!x);
    const syn = c.synonyms.map((t) => h.find(t)).filter((x): x is string => !!x);
    if (kw.length) {
      sig.capKeywords.set(c.id, kw);
      add(sig, { key: `cap:${c.id}`, kind: "process", label: c.name, term: kw[0] });
      if (c.category === "tube") add(sig, { key: "form:tube", kind: "form", label: "Tube", term: kw[0] });
      if (c.category === "sheet-metal") add(sig, { key: "form:sheet", kind: "form", label: "Sheet", term: kw[0] });
    }
    if (syn.length) sig.capSynonyms.set(c.id, syn);
  }

  for (const t of RULE_TERMS) {
    const hit = h.find(t);
    if (hit) {
      sig.terms.add(t);
      const label = FEATURE_LABELS[t];
      if (label && ![...sig.entities.values()].some((e) => e.kind === "feature" && e.label === label)) {
        add(sig, { key: `feat:${t}`, kind: "feature", label, term: hit });
      }
    }
  }
  return sig;
}

function mergeContext(sig: Signals, ctx: FinderContext | undefined, query: string): boolean {
  if (!ctx || ctx.entities.length === 0) return false;
  const q = query.toLowerCase();
  const hasPart = [...sig.entities.keys()].some((k) => k.startsWith("part:"));
  const onlyModifiers = !hasPart && sig.entities.size > 0 && sig.entities.size <= 3;
  const referential = REFERENTIAL.test(q) || /what (services|processes)|what can you do|what would (i|we) need/.test(q);
  if (!referential && !onlyModifiers) return false;

  const newMaterial = [...sig.entities.keys()].some((k) => k.startsWith("mat:"));
  for (const e of ctx.entities) {
    if (newMaterial && e.key.startsWith("mat:")) continue; // "…in aluminum instead"
    if (e.kind === "process") continue; // re-derived from terms
    if (!sig.entities.has(e.key)) sig.entities.set(e.key, { ...e, fromContext: true });
  }
  for (const t of ctx.terms) sig.terms.add(t);
  return true;
}

function has(sig: Signals, key: string) {
  if (key.startsWith("term:")) return sig.terms.has(key.slice(5));
  return sig.entities.has(key);
}

function score(sig: Signals) {
  const scores = new Map<string, number>();
  const reasons = new Map<string, (MatchReason & { pts: number })[]>();
  const bump = (id: string, pts: number, reason?: MatchReason) => {
    if (!capabilityById[id]) return;
    scores.set(id, (scores.get(id) ?? 0) + pts);
    if (reason) {
      const list = reasons.get(id) ?? [];
      const existing = list.find((r) => r.text === reason.text);
      if (existing) existing.pts += pts;
      else list.push({ ...reason, pts });
      reasons.set(id, list);
    }
  };

  for (const [id, terms] of sig.capKeywords) {
    bump(id, KEYWORD_W * Math.min(terms.length, 2), { term: terms[0], text: `You asked for ${capabilityById[id].name.toLowerCase()}.` });
  }
  for (const [id, terms] of sig.capSynonyms) {
    bump(id, Math.min(SYNONYM_W * terms.length, SYNONYM_CAP));
  }

  for (const p of partTypes) {
    const e = sig.entities.get(`part:${p.id}`);
    if (!e) continue;
    for (const [id, pts] of Object.entries(p.boosts)) bump(id, pts, { term: e.term, text: p.reason });
  }

  for (const r of rules) {
    if (r.all && !r.all.every((k) => has(sig, k))) continue;
    if (r.any && !r.any.some((k) => has(sig, k))) continue;
    if (r.none && r.none.some((k) => has(sig, k))) continue;
    const trig = [...(r.any ?? []), ...(r.all ?? [])].find((k) => has(sig, k));
    const term = trig ? (trig.startsWith("term:") ? trig.slice(5) : sig.entities.get(trig)?.term) : undefined;
    for (const [id, pts] of Object.entries(r.boosts)) bump(id, pts, { term, text: r.reason });
  }

  // Market relevance: small nudge toward processes the market typically uses.
  for (const m of markets) {
    if (!sig.entities.has(`mkt:${m.id}`)) continue;
    for (const id of m.capabilityIds) {
      if ((scores.get(id) ?? 0) > 0) bump(id, 0.75, { term: sig.entities.get(`mkt:${m.id}`)?.term, text: `Relevant to ${m.name.toLowerCase()} work: ${m.summary.charAt(0).toLowerCase()}${m.summary.slice(1)}` });
    }
  }

  // Materials are all supported. Note it on weld/form matches for context.
  const mats = materials.filter((m) => sig.entities.has(`mat:${m.id}`));
  if (mats.length) {
    for (const id of scores.keys()) {
      const cap = capabilityById[id];
      const ok = mats.filter((m) => cap.materials.includes(m.id));
      if (ok.length && cap.category !== "engineering") {
        const list = reasons.get(id) ?? [];
        list.push({ text: `Performed on ${ok.map((m) => m.name.toLowerCase()).join(" and ")}.`, pts: 0.1 });
        reasons.set(id, list);
      }
    }
  }
  return { scores, reasons };
}

function pickIntents(raw: string, question: boolean, hasSignal: boolean): Intent[] {
  const q = raw.toLowerCase();
  const hits = intents.filter((i) => (i.questionOnly ? question || !hasSignal : true) && i.test(q));
  return hits.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

function followUps(sig: Signals, matched: string[]): string[] {
  const out: string[] = [];
  const k = [...sig.entities.keys()];
  if (!k.some((x) => x.startsWith("mat:"))) out.push("What materials do you work with?");
  if (!k.some((x) => x.startsWith("need:"))) out.push("Can you handle prototypes?");
  if (k.includes("form:tube") && !sig.terms.has("square")) out.push("Can you bend square tubing?");
  if (!matched.includes("powder-coating")) out.push("Can you powder coat it?");
  if (matched.length && !matched.includes("assembly")) out.push("Can you assemble and package it?");
  if (matched.length) out.push("What services would I need for this part?");
  out.push("How do I get a quote?");
  return Array.from(new Set(out)).slice(0, 4);
}

function sentenceCase(name: string) {
  return name
    .split(" ")
    .map((w) => (/^[A-Z0-9&]{2,}$/.test(w) || /\d/.test(w) ? w : w.toLowerCase()))
    .join(" ");
}

function sentenceList(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function runFinder(req: FinderRequest): FinderResult {
  const query = req.query.trim().slice(0, 600);
  const sig = extract(query);
  const question = isQuestion(query);
  const usedContext = mergeContext(sig, req.context, query);

  const { scores, reasons } = score(sig);
  const sorted = [...scores.entries()].filter(([, s]) => s >= THRESHOLD).sort((a, b) => b[1] - a[1]);
  const top = sorted[0]?.[1] ?? 1;
  const ranked = sorted.filter(([, s]) => s / top >= 0.25).slice(0, 8);

  const matched: MatchedCapability[] = ranked.map(([id, s]) => {
    const c = capabilityById[id];
    return {
      id,
      name: c.name,
      category: c.category,
      categoryLabel: categoryLabels[c.category],
      score: Math.round(s * 10) / 10,
      strength: Math.max(0.25, s / top),
      reasons: [...(reasons.get(id) ?? [])].sort((a, b) => b.pts - a.pts).slice(0, 3).map(({ term, text }) => ({ term, text })),
      evidence: c.evidence.slice(0, 2),
      href: serviceHref(c.service),
      partner: c.partner,
    };
  });

  const groups = categoryOrder
    .map((cat: CapabilityCategory) => ({ category: cat, label: categoryLabels[cat], items: matched.filter((m) => m.category === cat) }))
    .filter((g) => g.items.length);

  // Route: strongest process per category (weaker alternatives, e.g. MIG next to TIG, stay in the cards).
  const catMax = new Map<CapabilityCategory, number>();
  for (const m of matched) catMax.set(m.category, Math.max(catMax.get(m.category) ?? 0, m.score));
  const sequence = PROCESS_ORDER.filter((id) => matched.some((m) => m.id === id))
    .filter((id) => {
      const m = matched.find((x) => x.id === id)!;
      return m.score >= 0.55 * (catMax.get(m.category) ?? 0);
    })
    .filter((id) => capabilityById[id].category !== "engineering" || sig.capKeywords.has(id))
    .slice(0, 7)
    .map((id) => ({ id, name: capabilityById[id].name, href: serviceHref(capabilityById[id].service) }));

  const entities = [...sig.entities.values()];
  const described = entities.filter((e) => e.kind !== "form" || !entities.some((x) => x.kind === "part"));

  const mats = materials.filter((m) => sig.entities.has(`mat:${m.id}`)).map((m) => ({ id: m.id as MaterialId, name: m.name }));
  const mkts = markets.filter((m) => sig.entities.has(`mkt:${m.id}`)).map((m) => ({ id: m.id as MarketId, name: m.name, href: `/markets/${m.id}` }));
  const nds = needDefs.filter((n) => sig.entities.has(`need:${n.id}`)).map((n) => ({ id: n.id, label: n.label, detail: n.detail }));

  // Coverage: each distinct requirement the user stated, credited if Right publishes it.
  const hasPartEntity = entities.some((e) => e.kind === "part");
  const reqs = entities.filter((e) => ["part", "material", "market", "need", "process", "feature"].includes(e.kind) || (e.kind === "form" && !hasPartEntity));
  const credit = reqs.length + sig.flags.reduce((acc, f) => acc + (f.level === "confirm" ? 0.5 : 0), 0);
  const total = reqs.length + sig.flags.length;
  const coverage = total >= 2 && matched.length ? { percent: Math.round((credit / total) * 100), matched: reqs.length, total } : undefined;

  const hasSignal = matched.length > 0 || reqs.length > 0;
  const hits = pickIntents(query, question, hasSignal);
  const intent = hits[0];
  const answer = intent?.answer({ entities });
  const showMatches = matched.length > 0 && (!intent || intent.withMatches || reqs.filter((e) => e.kind !== "process").length >= 2);

  let mode: FinderResult["mode"];
  if (answer && showMatches) mode = "mixed";
  else if (answer) mode = "answer";
  else if (showMatches) mode = "match";
  else mode = "clarify";

  let summary = "";
  if (showMatches && answer && intent?.id !== "services-needed" && reqs.length < 3) {
    summary = "";
  } else if (showMatches) {
    const part = entities.find((e) => e.kind === "part");
    const mat = mats[0];
    const mkt = mkts[0];
    const matShort = mat ? materials.find((m) => m.id === mat.id)?.short.toLowerCase() : undefined;
    const form = entities.find((e) => e.kind === "form");
    const noun = part?.label.split(" /")[0].toLowerCase() ?? (form ? (form.label === "Tube" ? "tube part" : "sheet metal part") : "part");
    const subject = [matShort, noun].filter(Boolean).join(" ");
    const steps = sequence.slice(0, 5).map((s) => sentenceCase(s.name.split(" —")[0].split(" &")[0]));
    const unlisted = sig.flags.some((f) => f.level === "unlisted");
    const confirm = sig.flags.some((f) => f.level === "confirm");
    const lead = unlisted ? "Partly." : confirm ? "Likely, with items to confirm." : "Yes, this fits Right's published capabilities.";
    summary = steps.length
      ? `${lead} A${/^[aeiou]/.test(subject) ? "n" : ""} ${subject}${mkt ? ` for ${markets.find((m) => m.id === mkt.id)?.short.toLowerCase()} use` : ""} would typically run through ${sentenceList(steps)}.`
      : lead;
  } else if (sig.flags.length) {
    summary = sig.flags[0].message;
  } else if (!answer) {
    summary =
      "I couldn't match that to a specific process yet. Describe the part, the material, and features like bends, welds, holes, hardware or finish.";
  }

  // Conversation memory: a new part starts a new thread; questions and modifiers extend the current one.
  const startsNewThread = !usedContext && entities.some((e) => e.kind === "part" || e.kind === "form");
  const carried = startsNewThread || usedContext ? [] : (req.context?.entities ?? []).filter((e) => !sig.entities.has(e.key));
  const ctxEntities = [...entities, ...carried].filter((e) => e.kind !== "process");
  const context: FinderContext = {
    entities: ctxEntities.map((e) => ({ ...e, fromContext: undefined })),
    terms: Array.from(new Set([...sig.terms, ...(startsNewThread || usedContext ? [] : req.context?.terms ?? [])])),
    turns: (req.context?.turns ?? 0) + 1,
    lastQuery: query,
    thread: startsNewThread || !req.context?.thread ? query : req.context.thread,
  };

  return {
    query,
    mode,
    summary,
    described: usedContext ? described : described.filter((e) => !e.fromContext),
    coverage: showMatches && !(answer && intent?.id !== "services-needed" && reqs.length < 3) ? coverage : undefined,
    groups: showMatches ? groups : [],
    sequence: showMatches ? sequence : [],
    materials: mats,
    markets: mkts,
    needs: nds,
    flags: sig.flags,
    answer,
    followUps: followUps(sig, matched.map((m) => m.id)).filter((f) => f.toLowerCase().replace(/\W/g, "") !== query.toLowerCase().replace(/\W/g, "")),
    context,
    engine: "local-knowledge-v1",
  };
}
