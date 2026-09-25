# Right Manufacturing: website redesign prototype

A speculative, pitch-quality redesign of [rightmfg.com](https://www.rightmfg.com). It repositions Right Manufacturing as a precision OEM manufacturing partner, and its signature feature is the **Capability Finder**, which matches a plain-language part description to Right's verified capabilities.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # all pages prerender statically, except /api/capability-finder
npx tsx scripts/finder-check.ts "stainless medical cart frame" "Can you handle prototypes?"
```

Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS v4. No animation or UI libraries.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Hero (real press-brake footage), stats, capabilities, Finder, prototype → production, markets, people, facility, APC finishing |
| `/capabilities` | Service index, materials, **Capability Explorer** (filter by process / material / market / production need) |
| `/capabilities/[slug]` | `tube-bending` (flagship), `sheet-metal`, `welding`, `assembly`, `finishing` |
| `/materials/[slug]` | `aluminum`, `stainless-steel`, `carbon-steel` |
| `/markets`, `/markets/[slug]` | `medical` (flagship), `automotive`, `military`, `industrial`, `architectural`, `decorative` |
| `/capability-finder` | Full-page Finder (accepts `?q=`) |
| `/start-a-project` | 7-step RFQ wizard; prefilled from Finder via `?q=&caps=&mat=` |
| `/about`, `/resources` | Company, Why Right, leadership; FAQs, brochure, glossary |

Also: `sitemap.xml`, `robots.txt`, Organization / Service / FAQPage / BreadcrumbList JSON-LD.

## Content is data

All facts live in `/data` and every page and the Finder read from there:

- `company.ts`: stats, contact, leadership, equipment, customers, APC, image registry
- `capabilities.ts`: 22 granular capabilities (keywords, synonyms, evidence, materials, markets, needs, applications)
- `services.ts`, `materials.ts`, `markets.ts`, `processes.ts`, `faqs.ts`
- `finder-knowledge.ts`: part archetypes, inference rules, production-stage terms, and **flags** for things Right does *not* publish

## Capability Finder architecture

```
UI (FinderPanel / CompactFinder / FinderDialog)
        │  askFinder(request)                lib/finder/provider.ts
        ├── local: runFinder()               lib/finder/engine.ts   (default)
        └── api:   POST /api/capability-finder  → same FinderResult contract
```

The engine extracts parts, materials, markets, features, quantities and stage. It scores each capability from keywords, part archetypes, rules and market relevance, and keeps a reason for every point. It also detects question intents (`lib/finder/intents.ts`) and keeps conversation context, so follow-ups like "in aluminum instead" or "what services would I need for this part?" work.

**Honesty rules:** tolerances, certifications and unpublished processes (laser cutting, casting, 5-axis, anodizing and so on) are flagged "confirm with engineering" and never answered from invention.

**To move to an LLM/RAG:** implement retrieval over `/data` inside `app/api/capability-finder/route.ts`, have the model return JSON matching `FinderResult` (`lib/finder/types.ts`), and set `NEXT_PUBLIC_FINDER_MODE=api`. The UI does not change.

## Sources and discrepancies to confirm with Right

All content comes from rightmfg.com (all pages, including the Tube / Sheet Metal / Welding / Hardware / Material sub-pages) and the RIGHT/APC brochure PDF. Photography and video are Right's own, re-encoded; the customer logos are the ones Right displays.

- **Facility size:** the website says 20,000 sq. ft. and the brochure says 40,000 sq. ft. The prototype uses 20,000.
- **Phone:** the website says 858-566-7002 and the brochure says (760) 644-3716. The prototype uses the website number.
- **Company age:** the site variously says "25+ years", "nearly three decades" and "more than 3 decades". The prototype uses "25+ years" and "founded in the 1990s".
- **Punch presses:** the Sheet Metal page says "3x, 60 Punch Presses" and the equipment list says "6 Bliss punch presses, 5–60 tons". The prototype uses the equipment list.
- **Left out on purpose:** generic SEO copy on the existing site mentions ISO/ASTM/ASME/AWS standards, robotic and stick welding, laser cutting, titanium and aerospace. None of it appears in Right's own equipment or capability lists, so the prototype doesn't claim it, and the Finder flags it for confirmation instead.
- APC is described as "partnered for 35 years" and "located in the heart of San Diego's industrial complex". The prototype does not claim the two share a building.
- RFQ submission and file upload are UI-only (simulated).
