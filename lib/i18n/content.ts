/**
 * Localized site content.
 *
 * /data holds the English source of truth (facts, ids, relationships).
 * `englishContent()` extracts every translatable string into a ContentText
 * overlay; each locale ships the same shape, and `buildContent()` merges it
 * back onto the data so pages receive fully-typed, localized objects.
 */
import { apc, company, customers, equipment, headlineStats, images, teamStats } from "@/data/company";
import { capabilities, categoryLabels, categoryOrder } from "@/data/capabilities";
import { services } from "@/data/services";
import { materials, tubeShapes } from "@/data/materials";
import { markets } from "@/data/markets";
import { processSteps } from "@/data/processes";
import { faqs, glossary, materialFaqs, whyRight } from "@/data/faqs";
import { capabilityTiles } from "@/data/home";
import { capabilityMenu } from "@/data/navigation";
import { exampleQuestions, suggestedSearches } from "@/data/finder-knowledge";
import type { Capability, CapabilityCategory, Faq, ImageRef, Market, MarketId, Material, MaterialId, Service } from "@/data/types";

type ImageKey = keyof typeof images;

export function englishContent() {
  return {
    company: {
      location: "San Diego, California",
      mission: company.mission,
      values: [...company.values],
      leadershipRoles: company.leadership.map((l) => l.role),
    },
    headlineStats: headlineStats.map((s) => ({ label: s.label, detail: s.detail })),
    teamStats: teamStats.map((s) => ({ label: s.label, detail: s.detail })),
    equipment: equipment.map((e) => ({ name: e.name, detail: e.detail })),
    apc: { summary: apc.summary, lines: apc.lines.map((l) => ({ ...l })), services: [...apc.services] },
    images: Object.fromEntries(Object.entries(images).map(([k, v]) => [k, v.alt])) as Record<ImageKey, string>,
    categoryLabels: { ...categoryLabels } as Record<CapabilityCategory, string>,
    capabilities: Object.fromEntries(
      capabilities.map((c) => [c.id, { name: c.name, description: c.description, evidence: [...c.evidence], applications: [...c.applications] }]),
    ) as Record<string, { name: string; description: string; evidence: string[]; applications: string[] }>,
    services: Object.fromEntries(
      services.map((s) => [
        s.id,
        {
          name: s.name,
          eyebrow: s.eyebrow,
          headline: [...s.headline] as [string, string],
          summary: s.summary,
          overview: [...s.overview],
          equipment: s.equipment.map((e) => ({ ...e })),
          specs: s.specs.map((g) => ({ label: g.label, items: [...g.items] })),
          questions: [...s.questions],
          faqs: s.faqs.map((f) => ({ ...f })),
        },
      ]),
    ) as Record<string, { name: string; eyebrow: string; headline: [string, string]; summary: string; overview: string[]; equipment: { label: string; value: string }[]; specs: { label: string; items: string[] }[]; questions: string[]; faqs: Faq[] }>,
    materials: Object.fromEntries(
      materials.map((m) => [m.id, { name: m.name, short: m.short, description: m.description, considerations: [...m.considerations] }]),
    ) as Record<MaterialId, { name: string; short: string; description: string; considerations: string[] }>,
    tubeShapes: Object.fromEntries(tubeShapes.map((t) => [t.id, { name: t.name, note: t.note }])) as Record<string, { name: string; note: string }>,
    markets: Object.fromEntries(
      markets.map((m) => [
        m.id,
        { name: m.name, short: m.short, headline: m.headline, summary: m.summary, why: m.why, sourceNotes: [...m.sourceNotes], applications: [...m.applications], questions: [...m.questions] },
      ]),
    ) as Record<MarketId, { name: string; short: string; headline: string; summary: string; why: string; sourceNotes: string[]; applications: string[]; questions: string[] }>,
    processSteps: processSteps.map((p) => ({ title: p.title, body: p.body, source: p.source, tags: [...p.tags] })),
    faqs: faqs.map((f) => ({ ...f })),
    materialFaqs: materialFaqs.map((f) => ({ ...f })),
    glossary: glossary.map((g) => ({ ...g })),
    whyRight: whyRight.map((w) => ({ ...w })),
    capabilityTiles: capabilityTiles.map((t) => ({ title: t.title, subtitle: t.subtitle, subs: [...t.subs] })),
    capabilityMenu: capabilityMenu.map((c) => ({ title: c.title, links: c.links.map((l) => l.label) })),
    suggestedSearches: [...suggestedSearches],
    exampleQuestions: [...exampleQuestions],
  };
}

/** Deeply widen literal types from `as const` data so translations type-check. */
type Widen<T> = T extends string ? string : T extends readonly (infer U)[] ? Widen<U>[] : T extends object ? { -readonly [K in keyof T]: Widen<T[K]> } : T;

export type ContentText = Widen<ReturnType<typeof englishContent>>;

export interface SiteContent {
  company: typeof company & { location: string; mission: string; values: string[]; leadership: { name: string; role: string }[] };
  headlineStats: typeof headlineStats;
  teamStats: typeof teamStats;
  equipment: { count: number; name: string; detail: string; service: string }[];
  apc: typeof apc;
  images: Record<ImageKey, ImageRef>;
  customers: typeof customers;
  categoryLabels: Record<CapabilityCategory, string>;
  categoryOrder: CapabilityCategory[];
  capabilities: Capability[];
  services: Service[];
  materials: Material[];
  tubeShapes: { id: string; name: string; note: string }[];
  markets: Market[];
  processSteps: { n: string; title: string; body: string; source: string; tags: string[] }[];
  faqs: Faq[];
  materialFaqs: Faq[];
  glossary: { t: string; d: string }[];
  whyRight: { t: string; b: string }[];
  capabilityTiles: (typeof capabilityTiles)[number][];
  capabilityMenu: { title: string; links: { label: string; href: string }[] }[];
  suggestedSearches: string[];
  exampleQuestions: string[];
}

/** Merge a ContentText overlay onto the English data. */
export function buildContent(t: ContentText): SiteContent {
  const img = Object.fromEntries(Object.entries(images).map(([k, v]) => [k, { ...v, alt: t.images[k as ImageKey] ?? v.alt }])) as Record<ImageKey, ImageRef>;
  const imgFor = (ref: ImageRef) => {
    const key = (Object.keys(images) as ImageKey[]).find((k) => images[k].src === ref.src);
    return key ? img[key] : ref;
  };
  return {
    company: {
      ...company,
      location: t.company.location,
      mission: t.company.mission,
      values: t.company.values,
      leadership: company.leadership.map((l, i) => ({ name: l.name, role: t.company.leadershipRoles[i] ?? l.role })),
    } as SiteContent["company"],
    headlineStats: headlineStats.map((s, i) => ({ ...s, ...t.headlineStats[i] })),
    teamStats: teamStats.map((s, i) => ({ ...s, ...t.teamStats[i] })),
    equipment: equipment.map((e, i) => ({ ...e, ...t.equipment[i] })),
    apc: { ...apc, summary: t.apc.summary, lines: t.apc.lines, services: t.apc.services },
    images: img,
    customers,
    categoryLabels: t.categoryLabels,
    categoryOrder: [...categoryOrder],
    capabilities: capabilities.map((c) => ({ ...c, ...t.capabilities[c.id] })),
    services: services.map((s) => ({ ...s, ...t.services[s.id], headline: t.services[s.id].headline as [string, string], image: imgFor(s.image), gallery: s.gallery.map(imgFor) })),
    materials: materials.map((m) => ({ ...m, ...t.materials[m.id], image: imgFor(m.image) })),
    tubeShapes: tubeShapes.map((s) => ({ ...s, ...t.tubeShapes[s.id] })),
    markets: markets.map((m) => ({ ...m, ...t.markets[m.id], image: imgFor(m.image) })),
    processSteps: processSteps.map((p, i) => ({ n: p.n, ...t.processSteps[i] })),
    faqs: t.faqs,
    materialFaqs: t.materialFaqs,
    glossary: t.glossary,
    whyRight: t.whyRight,
    capabilityTiles: capabilityTiles.map((c, i) => ({ ...c, ...t.capabilityTiles[i], image: imgFor(c.image) })),
    capabilityMenu: capabilityMenu.map((c, i) => ({ title: t.capabilityMenu[i].title, links: c.links.map((l, j) => ({ href: l.href, label: t.capabilityMenu[i].links[j] ?? l.label })) })),
    suggestedSearches: t.suggestedSearches,
    exampleQuestions: t.exampleQuestions,
  };
}
