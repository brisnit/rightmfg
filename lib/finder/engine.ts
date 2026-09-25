import { serviceHref } from "@/data/services";
import { flags as flagDefs, needs as needDefs, partTypes as basePartTypes, rules, sheetFormTerms, tubeFormTerms } from "@/data/finder-knowledge";
import type { Capability, CapabilityCategory, MarketId, MaterialId } from "@/data/types";
import type { SiteContent } from "@/lib/i18n/content";
import { FEATURE_TERMS, type FinderText } from "./finder-en";
import { buildAnswer, fill, intents, type Intent } from "./intents";
import { Haystack, containsAny, isQuestion } from "./text";
import type { DetectedEntity, FinderContext, FinderFlag, FinderRequest, FinderResult, MatchReason, MatchedCapability } from "./types";

/**
 * Local knowledge engine for the Capability Finder.
 *
 * 1. Extract entities (parts, materials, markets, needs, explicit processes,
 *    features) and flags (unpublished/unsupported requests) from the query,
 *    using English vocabulary plus the active locale's vocabulary.
 * 2. Merge with conversation context when the query refers back ("it", "this part").
 * 3. Score every capability: direct keywords + part archetypes + inference rules
 *    + market relevance, keeping a reason for every point awarded.
 * 4. Detect conversational intents and compose answers from localized /data.
 *
 * Deterministic, synchronous and dependency-free, so it runs client-side for instant
 * results or behind /api/capability-finder. An LLM provider can replace it
 * as long as it returns FinderResult.
 */

export interface Knowledge {
  locale: string;
  content: SiteContent;
  text: FinderText;
}

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

/** Every `term:` referenced by a rule, plus feature terms. */
const RULE_TERMS = Array.from(
  new Set([
    ...rules.flatMap((r) => [...(r.all ?? []), ...(r.any ?? []), ...(r.none ?? [])]).filter((k) => k.startsWith("term:")).map((k) => k.slice(5)),
    ...Object.keys(FEATURE_TERMS),
  ]),
);

/** Conversational phrases that contain capability words but aren't requirements. */
const STOP_PHRASES = ["can you handle", "could you handle", "do you handle", "you handle", "we handle", "handle it", "handle this", "handle that", "what can you do", "can you do", "what do you do"];
const REFERENTIAL = /\b(it|this|that|these|those|same|the part|the frame|my part|our part|the design|instead|also|too)\b/;
const SERVICES_Q = /what (services|processes)|what can you do|what would (i|we) need/;
const QTY = /\b(\d{1,3}(?:[,.]\d{3})+|\d{2,})\s*(?:pcs|pieces|units|parts|per|a month|\/mo|ea|each|sets|qty|stuks?|stuk|件|个|套|قطعه|قطعة|وحده|وحدة)/i;

interface Signals {
  entities: Map<string, DetectedEntity>;
  terms: Set<string>;
  /** English rule term → the phrase the user actually typed (any language). */
  termHits: Map<string, string>;
  capKeywords: Map<string, string[]>;
  capSynonyms: Map<string, string[]>;
  flags: FinderFlag[];
}

function add(sig: Signals, e: DetectedEntity) {
  if (!sig.entities.has(e.key)) sig.entities.set(e.key, e);
}

function firstHit(h: Haystack, terms: string[], fuzzy = false) {
  for (const t of terms) {
    const hit = h.find(t, fuzzy);
    if (hit) return hit;
  }
  return null;
}

function extract(query: string, k: Knowledge): Signals {
  const { content: c, text: ft } = k;
  const sig: Signals = { entities: new Map(), terms: new Set(), termHits: new Map(), capKeywords: new Map(), capSynonyms: new Map(), flags: [] };
  const h = new Haystack(query);
  for (const p of [...STOP_PHRASES, ...ft.stopPhrases]) h.mask(p);

  // Flags first; unlisted mentions are masked so they don't trigger capability matches.
  for (const f of flagDefs) {
    const local = ft.flags[f.id];
    const hit = firstHit(h, [...f.terms, ...(local?.terms ?? [])]);
    if (hit) {
      sig.flags.push({ term: hit, level: f.level, message: local?.message ?? f.message });
      if (f.level === "unlisted") h.mask(hit);
    }
  }

  for (const m of c.materials) {
    const hit = firstHit(h, [...m.keywords, ...m.synonyms, ...(ft.materialTerms[m.id] ?? [])], true);
    if (hit) add(sig, { key: `mat:${m.id}`, kind: "material", label: m.name, term: hit });
  }
  // "stainless steel" / "roestvast staal" / "不锈钢" contain "steel" / "staal" / "钢": keep only the most specific material.
  const ss = sig.entities.get("mat:stainless-steel");
  const cs = sig.entities.get("mat:carbon-steel");
  if (ss && cs && (cs.term === "steel" || normalizeTerm(ss.term).includes(normalizeTerm(cs.term)) || !stripAll(query, ss.term).includes(normalizeTerm(cs.term)))) {
    sig.entities.delete("mat:carbon-steel");
  }

  for (const m of c.markets) {
    const hit = firstHit(h, [...m.keywords, ...(ft.marketTerms[m.id] ?? [])]);
    if (hit) add(sig, { key: `mkt:${m.id}`, kind: "market", label: m.name, term: hit });
  }

  for (const p of basePartTypes) {
    const local = ft.partTypes[p.id];
    const hit = firstHit(h, [...p.terms, ...(local?.terms ?? [])]);
    if (hit) {
      add(sig, { key: `part:${p.id}`, kind: "part", label: local?.label ?? p.label, term: hit });
      if (p.form) add(sig, { key: `form:${p.form}`, kind: "form", label: p.form === "tube" ? ft.ui.formTube : ft.ui.formSheet, term: hit });
    }
  }

  for (const n of needDefs) {
    const local = ft.needs[n.id];
    const hit = firstHit(h, [...n.terms, ...(local?.terms ?? [])]);
    if (hit) add(sig, { key: `need:${n.id}`, kind: "need", label: local?.label ?? n.label, term: hit });
  }
  // Plain quantities ("500 units", "2000 pcs", "500 件") imply production volume.
  const qty = query.match(QTY) ?? query.match(/\bqty\.?\s*(\d+)/i);
  if (qty) {
    const n = Number(qty[1].replace(/[,.]/g, ""));
    const id = n >= 50 ? "production" : "low-volume";
    add(sig, { key: `need:${id}`, kind: "need", label: ft.needs[id]?.label ?? id, term: qty[0] });
  }

  const tubeHit = firstHit(h, [...tubeFormTerms, ...ft.tubeFormTerms]);
  if (tubeHit) add(sig, { key: "form:tube", kind: "form", label: ft.ui.formTube, term: tubeHit });
  const sheetHit = firstHit(h, [...sheetFormTerms, ...ft.sheetFormTerms]);
  if (sheetHit) add(sig, { key: "form:sheet", kind: "form", label: ft.ui.formSheet, term: sheetHit });

  for (const cap of c.capabilities) {
    const kw = [...cap.keywords, ...(ft.capabilityTerms[cap.id] ?? [])].map((t) => h.find(t)).filter((x): x is string => !!x);
    const syn = cap.synonyms.map((t) => h.find(t)).filter((x): x is string => !!x);
    if (kw.length) {
      sig.capKeywords.set(cap.id, kw);
      add(sig, { key: `cap:${cap.id}`, kind: "process", label: cap.name, term: kw[0] });
      if (cap.category === "tube") add(sig, { key: "form:tube", kind: "form", label: ft.ui.formTube, term: kw[0] });
      if (cap.category === "sheet-metal") add(sig, { key: "form:sheet", kind: "form", label: ft.ui.formSheet, term: kw[0] });
    }
    if (syn.length) sig.capSynonyms.set(cap.id, syn);
  }

  for (const t of RULE_TERMS) {
    const hit = firstHit(h, [t, ...(ft.termAliases[t] ?? [])]);
    if (!hit) continue;
    sig.terms.add(t);
    sig.termHits.set(t, hit);
    const fid = FEATURE_TERMS[t];
    const label = fid ? ft.featureLabels[fid] : undefined;
    if (label && ![...sig.entities.values()].some((e) => e.kind === "feature" && e.label === label)) {
      add(sig, { key: `feat:${fid}`, kind: "feature", label, term: hit });
    }
  }
  return sig;
}

function normalizeTerm(t: string) {
  return t.toLowerCase().replace(/\s+/g, " ").trim();
}

/** The query with every occurrence of `term` removed (to see if a shorter term appears on its own). */
function stripAll(query: string, term: string) {
  return normalizeTerm(query).split(normalizeTerm(term)).join(" ");
}

function mergeContext(sig: Signals, ctx: FinderContext | undefined, query: string, ft: FinderText): boolean {
  if (!ctx || ctx.entities.length === 0) return false;
  const q = query.toLowerCase();
  const hasPart = [...sig.entities.keys()].some((key) => key.startsWith("part:"));
  const onlyModifiers = !hasPart && sig.entities.size > 0 && sig.entities.size <= 3;
  const referential = REFERENTIAL.test(q) || SERVICES_Q.test(q) || containsAny(query, ft.referential) || containsAny(query, ft.intents.servicesNeeded.match);
  if (!referential && !onlyModifiers) return false;

  const newMaterial = [...sig.entities.keys()].some((key) => key.startsWith("mat:"));
  for (const e of ctx.entities) {
    if (newMaterial && e.key.startsWith("mat:")) continue; // "…in aluminum instead"
    if (e.kind === "process") continue;
    if (!sig.entities.has(e.key)) sig.entities.set(e.key, { ...e, fromContext: true });
  }
  for (const t of ctx.terms) sig.terms.add(t);
  return true;
}

function has(sig: Signals, key: string) {
  return key.startsWith("term:") ? sig.terms.has(key.slice(5)) : sig.entities.has(key);
}

function score(sig: Signals, k: Knowledge, capById: Record<string, Capability>) {
  const { content: c, text: ft } = k;
  const scores = new Map<string, number>();
  const reasons = new Map<string, (MatchReason & { pts: number })[]>();
  const bump = (id: string, pts: number, reason?: MatchReason) => {
    if (!capById[id]) return;
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
    bump(id, KEYWORD_W * Math.min(terms.length, 2), { term: terms[0], text: fill(ft.ui.youAskedFor, { name: capById[id].name }) });
  }
  for (const [id, terms] of sig.capSynonyms) bump(id, Math.min(SYNONYM_W * terms.length, SYNONYM_CAP));

  for (const p of basePartTypes) {
    const e = sig.entities.get(`part:${p.id}`);
    if (!e) continue;
    const reason = ft.partTypes[p.id]?.reason ?? p.reason;
    for (const [id, pts] of Object.entries(p.boosts)) bump(id, pts, { term: e.term, text: reason });
  }

  for (const r of rules) {
    if (r.all && !r.all.every((key) => has(sig, key))) continue;
    if (r.any && !r.any.some((key) => has(sig, key))) continue;
    if (r.none && r.none.some((key) => has(sig, key))) continue;
    const trig = [...(r.any ?? []), ...(r.all ?? [])].find((key) => has(sig, key));
    const term = trig ? (trig.startsWith("term:") ? sig.termHits.get(trig.slice(5)) : sig.entities.get(trig)?.term) : undefined;
    for (const [id, pts] of Object.entries(r.boosts)) bump(id, pts, { term, text: ft.rules[r.id] ?? r.reason });
  }

  for (const m of c.markets) {
    const e = sig.entities.get(`mkt:${m.id}`);
    if (!e) continue;
    const summary = m.summary.charAt(0).toLowerCase() + m.summary.slice(1);
    for (const id of m.capabilityIds) {
      if ((scores.get(id) ?? 0) > 0) bump(id, 0.75, { term: e.term, text: fill(ft.ui.relevantTo, { market: m.short.toLowerCase(), summary: k.locale === "en" ? summary : m.summary }) });
    }
  }

  const mats = c.materials.filter((m) => sig.entities.has(`mat:${m.id}`));
  if (mats.length) {
    for (const id of scores.keys()) {
      const cap = capById[id];
      const ok = mats.filter((m) => cap.materials.includes(m.id));
      if (ok.length && cap.category !== "engineering") {
        const list = reasons.get(id) ?? [];
        list.push({ text: fill(ft.ui.performedOn, { materials: joinList(ok.map((m) => (k.locale === "en" ? m.name.toLowerCase() : m.name)), ft, k.locale) }), pts: 0.1 });
        reasons.set(id, list);
      }
    }
  }
  return { scores, reasons };
}

/** Scripts written without spaces between words. */
const TIGHT = new Set(["zh"]);

function joinList(items: string[], ft: FinderText, locale = "en") {
  if (items.length <= 1) return items.join("");
  const sp = TIGHT.has(locale) ? "" : " ";
  // Arabic "و" attaches directly to the following word.
  const after = TIGHT.has(locale) || locale === "ar" ? "" : " ";
  return `${items.slice(0, -1).join(ft.ui.listSeparator)}${sp}${ft.ui.and}${after}${items[items.length - 1]}`;
}

function sentenceCase(name: string, locale: string) {
  if (locale !== "en") return name;
  return name
    .split(" ")
    .map((w) => (/^[A-Z0-9&]{2,}$/.test(w) || /\d/.test(w) ? w : w.toLowerCase()))
    .join(" ");
}

function pickIntents(raw: string, question: boolean, hasSignal: boolean, ft: FinderText): Intent[] {
  const q = raw.toLowerCase();
  const hits = intents.filter((i) => (i.questionOnly ? question || !hasSignal : true) && (i.test(q) || containsAny(raw, ft.intents[i.id].match)));
  return hits.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

function followUps(sig: Signals, matched: string[], ft: FinderText): string[] {
  const f = ft.ui.followUps;
  const out: string[] = [];
  const keys = [...sig.entities.keys()];
  if (!keys.some((x) => x.startsWith("mat:"))) out.push(f.materials);
  if (!keys.some((x) => x.startsWith("need:"))) out.push(f.prototypes);
  if (keys.includes("form:tube") && !sig.terms.has("square")) out.push(f.squareTube);
  if (!matched.includes("powder-coating")) out.push(f.powderCoat);
  if (matched.length && !matched.includes("assembly")) out.push(f.assemble);
  if (matched.length) out.push(f.services);
  out.push(f.quote);
  return Array.from(new Set(out)).slice(0, 4);
}

const capIndex = new WeakMap<SiteContent, Record<string, Capability>>();

export function runFinder(req: FinderRequest, k: Knowledge): FinderResult {
  const { content: c, text: ft } = k;
  let capById = capIndex.get(c);
  if (!capById) {
    capById = Object.fromEntries(c.capabilities.map((x) => [x.id, x]));
    capIndex.set(c, capById);
  }
  const query = req.query.trim().slice(0, 600);
  const sig = extract(query, k);
  const question = isQuestion(query, ft.questionWords);
  const usedContext = mergeContext(sig, req.context, query, ft);

  const { scores, reasons } = score(sig, k, capById);
  const sorted = [...scores.entries()].filter(([, s]) => s >= THRESHOLD).sort((a, b) => b[1] - a[1]);
  const top = sorted[0]?.[1] ?? 1;
  const ranked = sorted.filter(([, s]) => s / top >= 0.25).slice(0, 8);

  const matched: MatchedCapability[] = ranked.map(([id, s]) => {
    const cap = capById[id];
    return {
      id,
      name: cap.name,
      category: cap.category,
      categoryLabel: c.categoryLabels[cap.category],
      score: Math.round(s * 10) / 10,
      strength: Math.max(0.25, s / top),
      reasons: [...(reasons.get(id) ?? [])].sort((a, b) => b.pts - a.pts).slice(0, 3).map(({ term, text }) => ({ term, text })),
      evidence: cap.evidence.slice(0, 2),
      href: serviceHref(cap.service),
      partner: cap.partner,
    };
  });

  const groups = c.categoryOrder
    .map((cat: CapabilityCategory) => ({ category: cat, label: c.categoryLabels[cat], items: matched.filter((m) => m.category === cat) }))
    .filter((g) => g.items.length);

  // Route: strongest process per category (weaker alternatives, e.g. MIG next to TIG, stay in the cards).
  const catMax = new Map<CapabilityCategory, number>();
  for (const m of matched) catMax.set(m.category, Math.max(catMax.get(m.category) ?? 0, m.score));
  const sequence = PROCESS_ORDER.filter((id) => matched.some((m) => m.id === id))
    .filter((id) => {
      const m = matched.find((x) => x.id === id)!;
      return m.score >= 0.55 * (catMax.get(m.category) ?? 0);
    })
    .filter((id) => capById[id].category !== "engineering" || sig.capKeywords.has(id))
    .slice(0, 7)
    .map((id) => ({ id, name: capById[id].name, href: serviceHref(capById[id].service) }));

  const entities = [...sig.entities.values()];
  const described = entities.filter((e) => e.kind !== "form" || !entities.some((x) => x.kind === "part"));

  const mats = c.materials.filter((m) => sig.entities.has(`mat:${m.id}`)).map((m) => ({ id: m.id as MaterialId, name: m.name }));
  const mkts = c.markets.filter((m) => sig.entities.has(`mkt:${m.id}`)).map((m) => ({ id: m.id as MarketId, name: m.name, href: `/markets/${m.id}` }));
  const nds = needDefs.filter((n) => sig.entities.has(`need:${n.id}`)).map((n) => ({ id: n.id, label: ft.needs[n.id]?.label ?? n.label, detail: ft.needs[n.id]?.detail ?? n.detail }));

  // Coverage: each distinct requirement the user stated, credited if Right publishes it.
  const hasPartEntity = entities.some((e) => e.kind === "part");
  const reqs = entities.filter((e) => ["part", "material", "market", "need", "process", "feature"].includes(e.kind) || (e.kind === "form" && !hasPartEntity));
  const credit = reqs.length + sig.flags.reduce((acc, f) => acc + (f.level === "confirm" ? 0.5 : 0), 0);
  const total = reqs.length + sig.flags.length;
  const coverage = total >= 2 && matched.length ? { percent: Math.round((credit / total) * 100), matched: reqs.length, total } : undefined;

  const hasSignal = matched.length > 0 || reqs.length > 0;
  const intent = pickIntents(query, question, hasSignal, ft)[0];
  const vars = {
    phone: c.company.phone,
    email: c.company.email,
    address: `${c.company.address.street}, ${c.company.address.city}, ${c.company.address.region} ${c.company.address.postal}`,
    apc: c.apc.name,
    years: c.apc.years,
    summary: c.apc.summary,
    materials: joinList(c.materials.map((m) => (k.locale === "en" ? m.name.toLowerCase() : m.name)), ft, k.locale),
  };
  const answer = intent ? buildAnswer(intent, ft, c, entities, vars) : undefined;
  const showMatches = matched.length > 0 && (!intent || intent.withMatches || reqs.filter((e) => e.kind !== "process").length >= 2);
  const answerLeads = !!answer && intent?.id !== "servicesNeeded" && reqs.length < 3;

  let mode: FinderResult["mode"];
  if (answer && showMatches) mode = "mixed";
  else if (answer) mode = "answer";
  else if (showMatches) mode = "match";
  else mode = "clarify";

  let summary = "";
  if (showMatches && !answerLeads) {
    const part = entities.find((e) => e.kind === "part");
    const mat = c.materials.find((m) => m.id === mats[0]?.id);
    const mkt = c.markets.find((m) => m.id === mkts[0]?.id);
    const form = entities.find((e) => e.kind === "form");
    const noun = part ? part.label.split(" /")[0] : form ? (form.key === "form:tube" ? ft.ui.tubePart : ft.ui.sheetPart) : ft.ui.partNoun;
    // Arabic puts the noun before its qualifier ("هيكل الستانلس").
    const parts = k.locale === "ar" ? [noun, mat?.short] : [mat?.short, noun];
    let subject = parts.filter(Boolean).join(TIGHT.has(k.locale) ? "" : " ");
    if (k.locale === "en") {
      subject = subject.toLowerCase();
      subject = `${/^[aeiou]/.test(subject) ? "An" : "A"} ${subject}`;
    }
    const steps = sequence.slice(0, 5).map((s) => sentenceCase(s.name.split(" —")[0].split(" &")[0], k.locale));
    const unlisted = sig.flags.some((f) => f.level === "unlisted");
    const confirm = sig.flags.some((f) => f.level === "confirm");
    const lead = unlisted ? ft.ui.leadPartly : confirm ? ft.ui.leadLikely : ft.ui.leadYes;
    summary = steps.length
      ? fill(ft.ui.route, {
          lead,
          subject,
          market: mkt ? fill(ft.ui.forMarket, { market: k.locale === "en" ? mkt.short.toLowerCase() : mkt.short }) : "",
          steps: joinList(steps, ft, k.locale),
        })
      : lead;
  } else if (!showMatches && sig.flags.length) {
    summary = sig.flags[0].message;
  } else if (!answer) {
    summary = ft.ui.clarify;
  }

  // Conversation memory: a new part starts a new thread; questions and modifiers extend the current one.
  const startsNewThread = !usedContext && entities.some((e) => e.kind === "part" || e.kind === "form");
  const carried = startsNewThread || usedContext ? [] : (req.context?.entities ?? []).filter((e) => !sig.entities.has(e.key));
  const context: FinderContext = {
    entities: [...entities, ...carried].filter((e) => e.kind !== "process").map((e) => ({ ...e, fromContext: undefined })),
    terms: Array.from(new Set([...sig.terms, ...(startsNewThread || usedContext ? [] : req.context?.terms ?? [])])),
    turns: (req.context?.turns ?? 0) + 1,
    lastQuery: query,
    thread: startsNewThread || !req.context?.thread ? query : req.context.thread,
  };

  const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  return {
    query,
    mode,
    summary,
    described: usedContext ? described : described.filter((e) => !e.fromContext),
    coverage: showMatches && !answerLeads ? coverage : undefined,
    groups: showMatches ? groups : [],
    sequence: showMatches ? sequence : [],
    materials: mats,
    markets: mkts,
    needs: nds,
    flags: sig.flags,
    answer,
    followUps: followUps(sig, matched.map((m) => m.id), ft).filter((f) => norm(f) !== norm(query)),
    context,
    engine: "local-knowledge-v2",
  };
}
