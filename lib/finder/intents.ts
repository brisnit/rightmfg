import type { SiteContent } from "@/lib/i18n/content";
import type { FinderText } from "./finder-en";
import type { DetectedEntity, FinderAnswer } from "./types";

/**
 * Conversational intents: trigger logic + links only. All wording comes from the
 * locale's FinderText (`text.intents[id]`), and list bullets come from localized
 * content, so answers can never drift from the published facts.
 */
export type IntentId = keyof FinderText["intents"];

export interface Intent {
  id: IntentId;
  /** Only fire when phrased as a question (or when nothing else matched). */
  questionOnly?: boolean;
  /** English trigger (always active; engineers often type English terms). */
  test: (q: string) => boolean;
  /** Link targets, paired by index with `text.intents[id].links` labels. */
  hrefs?: string[];
  /** Bullets computed from localized content (override static bullets). */
  bullets?: (c: SiteContent) => string[];
  withMatches?: boolean;
  priority?: number;
}

export const intents: Intent[] = [
  {
    id: "servicesNeeded",
    priority: 10,
    withMatches: true,
    test: (q) => /(what|which) (services|processes|capabilities|operations)\b.*\b(need|require|use)|what (can|could) you do|what would (i|we) need|how would you (make|build)|what('s| is) involved/.test(q),
  },
  {
    id: "prototypes",
    questionOnly: true,
    withMatches: true,
    test: (q) => /\b(proto|prototype|prototypes|prototyping|first article|samples?|one[- ]offs?)\b/.test(q),
    hrefs: ["/start-a-project?need=prototype"],
  },
  {
    id: "squareTube",
    withMatches: true,
    test: (q) => /square tub|rectangular tub|rect tub|square profile/.test(q) && /(bend|bent|bending|can you|do you|work)/.test(q),
    hrefs: ["/capabilities/tube-bending"],
    bullets: (c) => c.tubeShapes.map((s) => s.name + (s.note ? ` — ${s.note}` : "")),
  },
  {
    id: "materials",
    questionOnly: true,
    test: (q) => /(what|which).*(materials?|metals?|alloys?)|(materials?|metals?) (do|can) you|work with (what|which)/.test(q) && !/(best|should|recommend)/.test(q),
    bullets: (c) => c.materials.map((m) => `${m.name}: ${m.considerations[0]}`),
  },
  {
    id: "materialChoice",
    questionOnly: true,
    priority: 1,
    test: (q) => /(which|what) (material|metal).*(should|best|recommend)|aluminum or steel|steel or aluminum|stronger/.test(q),
    hrefs: ["/materials/aluminum"],
  },
  {
    id: "welding",
    questionOnly: true,
    withMatches: true,
    test: (q) => /\b(weld|welds|welding|welded|mig|tig)\b/.test(q),
    hrefs: ["/capabilities/welding"],
  },
  {
    id: "bending",
    questionOnly: true,
    withMatches: true,
    test: (q) => /\b(bend|bending|bent)\b/.test(q) && !/square tub/.test(q),
    hrefs: ["/capabilities/tube-bending", "/capabilities/sheet-metal"],
  },
  {
    id: "finishing",
    questionOnly: true,
    withMatches: true,
    test: (q) => /(powder|coat|coating|paint|finish|finishing|cerakote|sand ?blast|engrav|part mark)/.test(q),
    hrefs: ["/capabilities/finishing"],
    bullets: (c) => c.apc.services,
  },
  {
    id: "machining",
    questionOnly: true,
    withMatches: true,
    test: (q) => /(machin|mill|milling|cnc)/.test(q),
    hrefs: ["/capabilities/assembly"],
  },
  {
    id: "assembly",
    questionOnly: true,
    withMatches: true,
    test: (q) => /(assembl|hardware|fastener|package|packaging|install)/.test(q),
    hrefs: ["/capabilities/assembly"],
  },
  {
    id: "equipment",
    questionOnly: true,
    test: (q) => /(equipment|machines?|press brakes?|turret|benders?|tonnage|what do you run|capacity)/.test(q),
    hrefs: ["/capabilities/sheet-metal", "/capabilities/tube-bending"],
    bullets: (c) => c.equipment.map((e) => `${e.count} × ${e.name}: ${e.detail}`),
  },
  {
    id: "leadTime",
    questionOnly: true,
    test: (q) => /(lead ?time|turnaround|turn around|how (fast|quick|long|soon)|\brush\b|\b48\b)/.test(q),
    hrefs: ["/start-a-project"],
  },
  {
    id: "volume",
    questionOnly: true,
    test: (q) => /(volume|volumes|quantit|how many|production run|scale)/.test(q),
  },
  {
    id: "tolerance",
    questionOnly: true,
    priority: 5,
    test: (q) => /toleranc|how (accurate|precise)|precision/.test(q),
    hrefs: ["/start-a-project"],
  },
  {
    id: "certifications",
    questionOnly: true,
    priority: 6,
    test: (q) => /(iso|certif|as ?9100|itar|13485|nadcap|registered|ppap)/.test(q),
    hrefs: ["/start-a-project"],
  },
  {
    id: "industries",
    questionOnly: true,
    test: (q) => /(industr|markets?|sectors?).*(serve|work)|who do you (serve|work)|what (industries|markets)/.test(q),
    hrefs: ["/markets"],
    bullets: (c) => c.markets.map((m) => m.name),
  },
  {
    id: "location",
    questionOnly: true,
    test: (q) => /(where|located|location|address|facility|square (feet|foot)|sq ?ft|how big)/.test(q),
    hrefs: ["/about"],
  },
  {
    id: "about",
    questionOnly: true,
    test: (q) => /(how long|experience|history|founded|team|employees|people|who are you|about (you|right))/.test(q),
    hrefs: ["/about"],
  },
  {
    id: "quote",
    questionOnly: true,
    test: (q) => /(quote|rfq|pricing|price|cost|how (do|can) i (start|get started|begin)|get started)/.test(q),
    hrefs: ["/start-a-project", "tel:+18585667002"],
  },
  {
    id: "contact",
    questionOnly: true,
    test: (q) => /(phone|email|contact|call|talk to|speak)/.test(q),
    hrefs: ["/start-a-project", "mailto:sales@rightmfg.com"],
  },
  {
    id: "apc",
    test: (q) => /\b(apc|action powder)/.test(q),
    hrefs: ["/capabilities/finishing"],
    bullets: (c) => c.apc.services,
  },
  {
    id: "greeting",
    test: (q) => /^(hi|hello|hey|help|yo|good (morning|afternoon))\b/.test(q.trim()),
  },
];

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export function buildAnswer(intent: Intent, text: FinderText, content: SiteContent, entities: DetectedEntity[], vars: Record<string, string | number>): FinderAnswer {
  const t = text.intents[intent.id] as FinderText["intents"]["servicesNeeded"];
  if (intent.id === "servicesNeeded" && entities.length === 0) {
    return { title: fill(t.titleEmpty, vars), body: fill(t.bodyEmpty, vars) };
  }
  const bullets = intent.bullets ? intent.bullets(content) : t.bullets;
  const links = (intent.hrefs ?? []).map((href, i) => ({ href, label: fill(t.links?.[i] ?? href, vars) }));
  if (intent.id === "materials") {
    for (const m of content.materials) links.push({ href: `/materials/${m.id}`, label: m.name });
  }
  return {
    title: fill(t.title, vars),
    body: fill(t.body, vars),
    bullets: bullets && bullets.length ? bullets.map((b) => fill(b, vars)) : undefined,
    links: links.length ? links : undefined,
  };
}
