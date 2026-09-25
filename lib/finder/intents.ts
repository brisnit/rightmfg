import { apc, company, equipment } from "@/data/company";
import { materials, tubeShapes } from "@/data/materials";
import { markets } from "@/data/markets";
import type { FinderAnswer, DetectedEntity } from "./types";

/**
 * Conversational intents. Each answer is composed from /data so it can never
 * drift from the published facts. `test` receives the lowercased raw query.
 */
export interface Intent {
  id: string;
  /** Only fire when phrased as a question (or when nothing else matched). */
  questionOnly?: boolean;
  test: (q: string) => boolean;
  answer: (ctx: { entities: DetectedEntity[] }) => FinderAnswer;
  /** When true, capability cards are still shown alongside the answer. */
  withMatches?: boolean;
  priority?: number;
}

const matList = materials.map((m) => m.name).join(", ").replace(/, ([^,]*)$/, " and $1");

export const intents: Intent[] = [
  {
    id: "services-needed",
    priority: 10,
    test: (q) => /(what|which) (services|processes|capabilities|operations)\b.*\b(need|require|use)|what (can|could) you do|what would (i|we) need|how would you (make|build)|what('s| is) involved/.test(q),
    withMatches: true,
    answer: ({ entities }) => {
      const has = entities.length > 0;
      return has
        ? {
            title: "Recommended manufacturing route",
            body: "Based on what you've described, this is the route Right would typically use: each process in sequence, with the reason it applies. An engineer confirms the final route when they review your drawing.",
          }
        : {
            title: "Describe the part and I'll map the route",
            body: "Tell me what you're making, the material, and roughly how many. For example: 'aluminum tube frame with welded tabs, 200 units'. I'll map it to Right's forming, welding, secondary and finishing processes.",
          };
    },
  },
  {
    id: "prototypes",
    questionOnly: true,
    test: (q) => /\b(proto|prototype|prototypes|prototyping|first article|samples?|one[- ]offs?)\b/.test(q),
    withMatches: true,
    answer: () => ({
      title: "Yes. Prototype through production.",
      body: "Right develops prototypes to validate designs and test function before production, with the same attention to precision as large orders. That lets you fine-tune the spec and reduce risk before committing to volume.",
      bullets: ["48-hour turnaround on select prototypes and rush orders", "Engineers with 30+ years of experience help refine the design", "The same equipment and team carry the part into production"],
      links: [{ label: "Start a prototype", href: "/start-a-project?need=prototype" }],
    }),
  },
  {
    id: "square-tube",
    test: (q) => /square tub|rectangular tub|rect tub|square profile/.test(q) && /(bend|bent|bending|can you|do you|work)/.test(q),
    withMatches: true,
    answer: () => ({
      title: "Yes. Round and square tube.",
      body: "Right's two pull-type mandrel benders run a library of more than 100 bending dies covering a wide variety of round and square tubes. Plane-of-bend control and pressure die assist help hold geometry through the bend.",
      bullets: tubeShapes.map((s) => s.name + (s.note ? ` — ${s.note.toLowerCase()}` : "")),
      links: [{ label: "Tube bending capability", href: "/capabilities/tube-bending" }],
    }),
  },
  {
    id: "materials",
    questionOnly: true,
    test: (q) => /(what|which).*(materials?|metals?|alloys?)|(materials?|metals?) (do|can) you|work with (what|which)/.test(q) && !/(best|should|recommend)/.test(q),
    answer: () => ({
      title: "Aluminum, stainless and carbon steel",
      body: `Right fabricates in ${matList.toLowerCase()}, in sheet and tube, and keeps a consistent material inventory for fast turnaround. Material is chosen for strength, formability and the application.`,
      bullets: materials.map((m) => `${m.name}: ${m.considerations[0]}`),
      links: materials.map((m) => ({ label: m.name, href: `/materials/${m.id}` })),
    }),
  },
  {
    id: "material-choice",
    questionOnly: true,
    test: (q) => /(which|what) (material|metal).*(should|best|recommend)|aluminum or steel|steel or aluminum|stronger/.test(q),
    answer: () => ({
      title: "Match the metal to the job",
      body: "Steel is usually stronger, but aluminum is lighter and resists corrosion well. Right recommends aluminum where weight matters and steel for heavy-duty strength. Stainless is the choice when strength and corrosion resistance both matter. The team looks at strength, corrosion resistance, weight and weldability for your application.",
      links: [{ label: "Compare materials", href: "/materials/aluminum" }],
    }),
  },
  {
    id: "welding",
    questionOnly: true,
    test: (q) => /\b(weld|welds|welding|welded|mig|tig)\b/.test(q),
    withMatches: true,
    answer: () => ({
      title: "Yes. MIG, TIG and spot welding.",
      body: "Right welds steel, stainless steel and aluminum alloys. Experienced technicians use calibrated equipment and process controls, and welds are inspected for strength and finish.",
      bullets: ["MIG: quick, strong welds for structural work", "TIG: detailed control for visible or thin work", "Spot: sheet-to-sheet joints without filler"],
      links: [{ label: "Welding capability", href: "/capabilities/welding" }],
    }),
  },
  {
    id: "bending",
    questionOnly: true,
    test: (q) => /\b(bend|bending|bent)\b/.test(q) && !/square tub/.test(q),
    withMatches: true,
    answer: () => ({
      title: "Yes. Tube, channel and sheet.",
      body: "Tube and channel are bent on two pull-type mandrel benders with 100+ dies, including 3D multi-plane bends with plane-of-bend control. Sheet is formed on four Cincinnati CNC press brakes (60, 90 and 135 ton).",
      links: [
        { label: "Tube bending", href: "/capabilities/tube-bending" },
        { label: "Sheet metal", href: "/capabilities/sheet-metal" },
      ],
    }),
  },
  {
    id: "finishing",
    questionOnly: true,
    test: (q) => /(powder|coat|coating|paint|finish|finishing|cerakote|sand ?blast|engrav|part mark)/.test(q),
    withMatches: true,
    answer: () => ({
      title: "Yes, through sister company APC.",
      body: `Finishing is handled by ${apc.name}, Right's partner for ${apc.years} years, also located in the heart of San Diego's industrial complex. An automatic conveyor line handles high-volume parts, and batch application covers larger units and smaller volumes.`,
      bullets: apc.services,
      links: [{ label: "Finishing with APC", href: "/capabilities/finishing" }],
    }),
  },
  {
    id: "machining",
    questionOnly: true,
    test: (q) => /(machin|mill|milling|cnc)/.test(q),
    withMatches: true,
    answer: () => ({
      title: "Yes. CNC vertical milling.",
      body: "Right runs three HAAS CNC vertical mills for machined features on formed and fabricated parts: drilled, tapped and milled features on sheet, tube and extrusions.",
      links: [{ label: "Hardware, assembly & machining", href: "/capabilities/assembly" }],
    }),
  },
  {
    id: "assembly",
    questionOnly: true,
    test: (q) => /(assembl|hardware|fastener|package|packaging|install)/.test(q),
    withMatches: true,
    answer: () => ({
      title: "Yes. Delivered complete.",
      body: "Right handles hardware installation, component integration, fastener fitting, mid- and high-level assembly, packaging and logistics. Hardware compatibility and alignment are double-checked before delivery.",
      links: [{ label: "Hardware & assembly", href: "/capabilities/assembly" }],
    }),
  },
  {
    id: "equipment",
    questionOnly: true,
    test: (q) => /(equipment|machines?|press brakes?|turret|benders?|tonnage|what do you run|capacity)/.test(q),
    answer: () => ({
      title: "Equipment on Right's floor",
      body: "The published equipment list, from Right's capability pages and brochure:",
      bullets: equipment.map((e) => `${e.count} × ${e.name}: ${e.detail}`),
      links: [{ label: "Sheet metal", href: "/capabilities/sheet-metal" }, { label: "Tube bending", href: "/capabilities/tube-bending" }],
    }),
  },
  {
    id: "lead-time",
    questionOnly: true,
    test: (q) => /(lead ?time|turnaround|turn around|how (fast|quick|long|soon)|\brush\b|\b48\b)/.test(q),
    answer: () => ({
      title: "48 hours on select prototypes and rush orders",
      body: "Lead times depend on complexity, material availability, finish and quantity. Simple tube jobs can be same-day or next-day in some cases. Right keeps a consistent material inventory and confirms a timeline once specs are reviewed.",
      links: [{ label: "Get a timeline", href: "/start-a-project" }],
    }),
  },
  {
    id: "volume",
    questionOnly: true,
    test: (q) => /(volume|volumes|quantit|how many|production run|scale)/.test(q),
    answer: () => ({
      title: "From one prototype to production volume",
      body: "Right supports high-mix, lower-volume programs through higher-volume production and manufactures more than 10,000 precision parts a year. Prototypes and production runs use the same team and equipment.",
    }),
  },
  {
    id: "tolerance",
    questionOnly: true,
    priority: 5,
    test: (q) => /toleranc|how (accurate|precise)|precision/.test(q),
    answer: () => ({
      title: "Confirmed on drawing review",
      body: "Right doesn't publish general tolerances, because achievable tolerance depends on geometry, material and process. Send your drawing and the engineering team will confirm what they can hold on your features.",
      links: [{ label: "Upload a drawing", href: "/start-a-project" }],
    }),
  },
  {
    id: "certifications",
    questionOnly: true,
    priority: 6,
    test: (q) => /(iso|certif|as ?9100|itar|13485|nadcap|registered|ppap)/.test(q),
    answer: () => ({
      title: "Ask the team for quality documentation",
      body: "Certifications and registrations aren't published on rightmfg.com, so this tool won't guess. Right's team can tell you exactly what quality documentation your program needs.",
      links: [{ label: "Contact the team", href: "/start-a-project" }],
    }),
  },
  {
    id: "industries",
    questionOnly: true,
    test: (q) => /(industr|markets?|sectors?).*(serve|work)|who do you (serve|work)|what (industries|markets)/.test(q),
    answer: () => ({
      title: "Industries Right serves",
      body: "Right focuses on OEM customers across these markets from its 20,000 sq. ft. San Diego facility:",
      bullets: markets.map((m) => m.name),
      links: [{ label: "All markets", href: "/markets" }],
    }),
  },
  {
    id: "location",
    questionOnly: true,
    test: (q) => /(where|located|location|address|facility|square (feet|foot)|sq ?ft|how big)/.test(q),
    answer: () => ({
      title: "San Diego, California",
      body: `A 20,000 sq. ft. facility at ${company.address.street}, ${company.address.city}, ${company.address.region} ${company.address.postal}, in the heart of San Diego's industrial complex. Finishing partner APC is also based there.`,
      links: [{ label: "About Right", href: "/about" }],
    }),
  },
  {
    id: "about",
    questionOnly: true,
    test: (q) => /(how long|experience|history|founded|team|employees|people|who are you|about (you|right))/.test(q),
    answer: () => ({
      title: "25+ years. 35 people. 20+ years average experience.",
      body: "Right was founded in the 1990s in San Diego's industrial core with a service-first mission. Today it's a 35-person company whose team averages more than 20 years of experience, led by General Manager Greg Lyon, Customer Service Manager Karra Lyon and Production Manager LH Byrd. 98% of clients stay.",
      links: [{ label: "About Right", href: "/about" }],
    }),
  },
  {
    id: "quote",
    questionOnly: true,
    test: (q) => /(quote|rfq|pricing|price|cost|how (do|can) i (start|get started|begin)|get started)/.test(q),
    answer: () => ({
      title: "Start with a drawing",
      body: "Share technical drawings or a description and your requirements. Right's team reviews your specifications and returns a detailed quote and timeline.",
      links: [{ label: "Start a project", href: "/start-a-project" }, { label: `Call ${company.phone}`, href: company.phoneHref }],
    }),
  },
  {
    id: "contact",
    questionOnly: true,
    test: (q) => /(phone|email|contact|call|talk to|speak)/.test(q),
    answer: () => ({
      title: "Talk to manufacturing",
      body: `Call ${company.phone} or email ${company.email}. Or start a project online and attach your drawings.`,
      links: [{ label: "Start a project", href: "/start-a-project" }, { label: `Email ${company.email}`, href: `mailto:${company.email}` }],
    }),
  },
  {
    id: "apc",
    test: (q) => /\b(apc|action powder)/.test(q),
    answer: () => ({
      title: `${apc.name}: a 35-year partner`,
      body: apc.summary,
      bullets: apc.services,
      links: [{ label: "Finishing with APC", href: "/capabilities/finishing" }],
    }),
  },
  {
    id: "greeting",
    test: (q) => /^(hi|hello|hey|help|yo|good (morning|afternoon))\b/.test(q.trim()),
    answer: () => ({
      title: "Describe what you need to manufacture",
      body: "Tell me about the part: what it is, the material, the features (bends, welds, holes, hardware, finish) and roughly how many. I'll match it to Right's verified capabilities and explain why each one applies.",
    }),
  },
];
