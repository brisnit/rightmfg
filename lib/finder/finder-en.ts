/**
 * English source for all Capability Finder text + matching vocabulary.
 * Other locales provide the same shape (lib/i18n/locales/<locale>/finder.ts).
 *
 * Placeholders: {phone} {email} {address} {apc} {years} {materials} {n}
 * {name} {market} {summary} {lead} {subject} {steps} {m} {t}
 */
import { capabilities } from "@/data/capabilities";
import { materials } from "@/data/materials";
import { markets } from "@/data/markets";
import { flags, needs, partTypes, rules } from "@/data/finder-knowledge";

export const FEATURE_TERMS: Record<string, string> = {
  "multiple bends": "multipleBends",
  "several bends": "multipleBends",
  "many bends": "multipleBends",
  "compound bends": "compoundBends",
  compound: "compoundBends",
  "complex geometry": "complexGeometry",
  "3d": "geometry3d",
  bend: "bends",
  bent: "bends",
  bending: "bends",
  welded: "welded",
  weld: "welded",
  welding: "welded",
  holes: "holes",
  "hole pattern": "holePattern",
  slots: "slots",
  outdoor: "outdoor",
  corrosion: "corrosion",
  tapped: "tapped",
  threaded: "threaded",
  machined: "machined",
};

export function englishFinder() {
  return {
    /** Extra words in this language that directly indicate a capability. English keywords live in /data. */
    capabilityTerms: Object.fromEntries(capabilities.map((c) => [c.id, [] as string[]])) as Record<string, string[]>,
    materialTerms: Object.fromEntries(materials.map((m) => [m.id, [] as string[]])) as Record<string, string[]>,
    marketTerms: Object.fromEntries(markets.map((m) => [m.id, [] as string[]])) as Record<string, string[]>,
    partTypes: Object.fromEntries(partTypes.map((p) => [p.id, { label: p.label, reason: p.reason, terms: [] as string[] }])) as Record<string, { label: string; reason: string; terms: string[] }>,
    needs: Object.fromEntries(needs.map((n) => [n.id, { label: n.label, detail: n.detail, terms: [] as string[] }])) as Record<string, { label: string; detail: string; terms: string[] }>,
    rules: Object.fromEntries(rules.map((r) => [r.id, r.reason])) as Record<string, string>,
    flags: Object.fromEntries(flags.map((f) => [f.id, { message: f.message, terms: [] as string[] }])) as Record<string, { message: string; terms: string[] }>,
    /** Local-language phrases that mean the same as an English rule/feature term (keys are the English terms). */
    termAliases: {} as Record<string, string[]>,
    featureLabels: {
      multipleBends: "Multiple bends",
      compoundBends: "Compound bends",
      complexGeometry: "Complex geometry",
      geometry3d: "3D geometry",
      bends: "Bends",
      welded: "Welded",
      holes: "Holes / features",
      holePattern: "Hole pattern",
      slots: "Slots",
      outdoor: "Outdoor use",
      corrosion: "Corrosion resistance",
      tapped: "Tapped features",
      threaded: "Threaded features",
      machined: "Machined features",
    } as Record<string, string>,
    tubeFormTerms: [] as string[],
    sheetFormTerms: [] as string[],
    /** Conversational phrases to ignore when matching (e.g. "can you handle"). */
    stopPhrases: [] as string[],
    /** Words that refer back to the part discussed earlier ("it", "this part"). */
    referential: [] as string[],
    /** Words that start a question in this language. */
    questionWords: [] as string[],
    /** Per-intent answer text. `match` = extra local-language trigger phrases (lowercase substrings). */
    intents: {
      servicesNeeded: {
        match: [] as string[],
        title: "Recommended manufacturing route",
        body: "Based on what you've described, this is the route Right would typically use: each process in sequence, with the reason it applies. An engineer confirms the final route when they review your drawing.",
        titleEmpty: "Describe the part and I'll map the route",
        bodyEmpty: "Tell me what you're making, the material, and roughly how many. For example: 'aluminum tube frame with welded tabs, 200 units'. I'll map it to Right's forming, welding, secondary and finishing processes.",
        links: [] as string[],
        bullets: [] as string[],
      },
      prototypes: {
        match: [] as string[],
        title: "Yes. Prototype through production.",
        body: "Right develops prototypes to validate designs and test function before production, with the same attention to precision as large orders. That lets you fine-tune the spec and reduce risk before committing to volume.",
        bullets: ["48-hour turnaround on select prototypes and rush orders", "Engineers with 30+ years of experience help refine the design", "The same equipment and team carry the part into production"],
        links: ["Start a prototype"],
      },
      squareTube: {
        match: [] as string[],
        title: "Yes. Round and square tube.",
        body: "Right's two pull-type mandrel benders run a library of more than 100 bending dies covering a wide variety of round and square tubes. Plane-of-bend control and pressure die assist help hold geometry through the bend.",
        bullets: [] as string[],
        links: ["Tube bending capability"],
      },
      materials: {
        match: [] as string[],
        title: "Aluminum, stainless and carbon steel",
        body: "Right fabricates in {materials}, in sheet and tube, and keeps a consistent material inventory for fast turnaround. Material is chosen for strength, formability and the application.",
        bullets: [] as string[],
        links: [] as string[],
      },
      materialChoice: {
        match: [] as string[],
        title: "Match the metal to the job",
        body: "Steel is usually stronger, but aluminum is lighter and resists corrosion well. Right recommends aluminum where weight matters and steel for heavy-duty strength. Stainless is the choice when strength and corrosion resistance both matter. The team looks at strength, corrosion resistance, weight and weldability for your application.",
        bullets: [] as string[],
        links: ["Compare materials"],
      },
      welding: {
        match: [] as string[],
        title: "Yes. MIG, TIG and spot welding.",
        body: "Right welds steel, stainless steel and aluminum alloys. Experienced technicians use calibrated equipment and process controls, and welds are inspected for strength and finish.",
        bullets: ["MIG: quick, strong welds for structural work", "TIG: detailed control for visible or thin work", "Spot: sheet-to-sheet joints without filler"],
        links: ["Welding capability"],
      },
      bending: {
        match: [] as string[],
        title: "Yes. Tube, channel and sheet.",
        body: "Tube and channel are bent on two pull-type mandrel benders with 100+ dies, including 3D multi-plane bends with plane-of-bend control. Sheet is formed on four Cincinnati CNC press brakes (60, 90 and 135 ton).",
        bullets: [] as string[],
        links: ["Tube bending", "Sheet metal"],
      },
      finishing: {
        match: [] as string[],
        title: "Yes, through sister company APC.",
        body: "Finishing is handled by {apc}, Right's partner for {years} years, also located in the heart of San Diego's industrial complex. An automatic conveyor line handles high-volume parts, and batch application covers larger units and smaller volumes.",
        bullets: [] as string[],
        links: ["Finishing with APC"],
      },
      machining: {
        match: [] as string[],
        title: "Yes. CNC vertical milling.",
        body: "Right runs three HAAS CNC vertical mills for machined features on formed and fabricated parts: drilled, tapped and milled features on sheet, tube and extrusions.",
        bullets: [] as string[],
        links: ["Hardware, assembly & machining"],
      },
      assembly: {
        match: [] as string[],
        title: "Yes. Delivered complete.",
        body: "Right handles hardware installation, component integration, fastener fitting, mid- and high-level assembly, packaging and logistics. Hardware compatibility and alignment are double-checked before delivery.",
        bullets: [] as string[],
        links: ["Hardware & assembly"],
      },
      equipment: {
        match: [] as string[],
        title: "Equipment on Right's floor",
        body: "The published equipment list, from Right's capability pages and brochure:",
        bullets: [] as string[],
        links: ["Sheet metal", "Tube bending"],
      },
      leadTime: {
        match: [] as string[],
        title: "48 hours on select prototypes and rush orders",
        body: "Lead times depend on complexity, material availability, finish and quantity. Simple tube jobs can be same-day or next-day in some cases. Right keeps a consistent material inventory and confirms a timeline once specs are reviewed.",
        bullets: [] as string[],
        links: ["Get a timeline"],
      },
      volume: {
        match: [] as string[],
        title: "From one prototype to production volume",
        body: "Right supports high-mix, lower-volume programs through higher-volume production and manufactures more than 10,000 precision parts a year. Prototypes and production runs use the same team and equipment.",
        bullets: [] as string[],
        links: [] as string[],
      },
      tolerance: {
        match: [] as string[],
        title: "Confirmed on drawing review",
        body: "Right doesn't publish general tolerances, because achievable tolerance depends on geometry, material and process. Send your drawing and the engineering team will confirm what they can hold on your features.",
        bullets: [] as string[],
        links: ["Upload a drawing"],
      },
      certifications: {
        match: [] as string[],
        title: "Ask the team for quality documentation",
        body: "Certifications and registrations aren't published on rightmfg.com, so this tool won't guess. Right's team can tell you exactly what quality documentation your program needs.",
        bullets: [] as string[],
        links: ["Contact the team"],
      },
      industries: {
        match: [] as string[],
        title: "Industries Right serves",
        body: "Right focuses on OEM customers across these markets from its 20,000 sq. ft. San Diego facility:",
        bullets: [] as string[],
        links: ["All markets"],
      },
      location: {
        match: [] as string[],
        title: "San Diego, California",
        body: "A 20,000 sq. ft. facility at {address}, in the heart of San Diego's industrial complex. Finishing partner APC is also based there.",
        bullets: [] as string[],
        links: ["About Right"],
      },
      about: {
        match: [] as string[],
        title: "25+ years. 35 people. 20+ years average experience.",
        body: "Right was founded in the 1990s in San Diego's industrial core with a service-first mission. Today it's a 35-person company whose team averages more than 20 years of experience, led by General Manager Greg Lyon, Customer Service Manager Karra Lyon and Production Manager LH Byrd. 98% of clients stay.",
        bullets: [] as string[],
        links: ["About Right"],
      },
      quote: {
        match: [] as string[],
        title: "Start with a drawing",
        body: "Share technical drawings or a description and your requirements. Right's team reviews your specifications and returns a detailed quote and timeline.",
        bullets: [] as string[],
        links: ["Start a project", "Call {phone}"],
      },
      contact: {
        match: [] as string[],
        title: "Talk to manufacturing",
        body: "Call {phone} or email {email}. Or start a project online and attach your drawings.",
        bullets: [] as string[],
        links: ["Start a project", "Email {email}"],
      },
      apc: {
        match: [] as string[],
        title: "{apc}: a 35-year partner",
        body: "{summary}",
        bullets: [] as string[],
        links: ["Finishing with APC"],
      },
      greeting: {
        match: [] as string[],
        title: "Describe what you need to manufacture",
        body: "Tell me about the part: what it is, the material, the features (bends, welds, holes, hardware, finish) and roughly how many. I'll match it to Right's verified capabilities and explain why each one applies.",
        bullets: [] as string[],
        links: [] as string[],
      },
    },
    ui: {
      leadYes: "Yes, this fits Right's published capabilities.",
      leadLikely: "Likely, with items to confirm.",
      leadPartly: "Partly.",
      /** {lead} {subject} {market} {steps}. {market} is replaced by `forMarket` or "". */
      route: "{lead} {subject}{market} would typically run through {steps}.",
      forMarket: " for {market} use",
      partNoun: "part",
      tubePart: "tube part",
      sheetPart: "sheet metal part",
      and: "and",
      listSeparator: ", ",
      clarify: "I couldn't match that to a specific process yet. Describe the part, the material, and features like bends, welds, holes, hardware or finish.",
      youAskedFor: "You asked for {name}.",
      performedOn: "Performed on {materials}.",
      relevantTo: "Relevant to {market} work: {summary}",
      formTube: "Tube",
      formSheet: "Sheet",
      followUps: {
        materials: "What materials do you work with?",
        prototypes: "Can you handle prototypes?",
        squareTube: "Can you bend square tubing?",
        powderCoat: "Can you powder coat it?",
        assemble: "Can you assemble and package it?",
        services: "What services would I need for this part?",
        quote: "How do I get a quote?",
      },
    },
  };
}

export type FinderText = ReturnType<typeof englishFinder>;
