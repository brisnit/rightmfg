import type { ProductionNeed } from "./types";

/**
 * Capability Finder knowledge base (beyond the capability/material/market data).
 *
 * - partTypes: what people say they're making → which verified processes it usually involves
 * - rules:     combinations that strengthen or redirect a match
 * - needs:     production-stage language
 * - flags:     things Right does NOT publish (or only mentions loosely) — the
 *              Finder says so instead of inventing an answer
 *
 * All capability ids referenced here must exist in data/capabilities.ts.
 */

export interface PartType {
  id: string;
  label: string;
  terms: string[];
  /** Implied material form. */
  form?: "tube" | "sheet";
  boosts: Record<string, number>;
  reason: string;
}

export const partTypes: PartType[] = [
  {
    id: "frame",
    label: "Frame / structure",
    terms: ["frame", "frames", "tubular frame", "tube frame", "chassis frame", "structure", "support structure", "equipment support", "weldment", "skeleton", "stand", "base frame"],
    form: "tube",
    boosts: { "mandrel-tube-bending": 3, "tig-welding": 2, "mig-welding": 1.5, "tube-cutoff": 1.5, assembly: 1 },
    reason: "Frames are usually bent tube joined by welds. Bending removes joints, and welding closes the structure.",
  },
  {
    id: "cart",
    label: "Cart",
    terms: ["cart", "carts", "trolley", "dolly", "rolling stand", "workstation"],
    form: "tube",
    boosts: { "mandrel-tube-bending": 3, "tig-welding": 2.5, "cnc-press-brake": 2, "hardware-installation": 2.5, assembly: 3, "powder-coating": 1.5 },
    reason: "Carts are among the medical solutions Right lists: a bent tube frame, formed sheet shelves and installed hardware.",
  },
  {
    id: "handle-rail",
    label: "Handle / rail",
    terms: ["handle", "handles", "handlebar", "grab bar", "rail", "rails", "handrail", "guard rail", "railing", "hoop", "roll bar", "bar"],
    form: "tube",
    boosts: { "mandrel-tube-bending": 3.5, "tube-cutoff": 1.5, "tube-punching": 1, "powder-coating": 0.5 },
    reason: "Handles and rails are classic mandrel-bent tube. A die library matched to the tube size keeps bends clean and repeatable.",
  },
  {
    id: "bracket",
    label: "Bracket / tab / mount",
    terms: ["bracket", "brackets", "mounting bracket", "mounting brackets", "tab", "tabs", "mounting tab", "mounting tabs", "mount", "mounts", "gusset", "clip", "clips", "angle", "l bracket", "z bracket"],
    form: "sheet",
    boosts: { "cnc-turret-punching": 2, "cnc-press-brake": 3, shearing: 1 },
    reason: "Brackets and tabs are typically punched flat, then formed on a CNC press brake.",
  },
  {
    id: "enclosure",
    label: "Enclosure / housing",
    terms: ["enclosure", "enclosures", "housing", "housings", "box", "cabinet", "chassis", "case", "cover", "covers", "shroud", "guard", "control box", "electrical box"],
    form: "sheet",
    boosts: { "cnc-turret-punching": 3, "cnc-press-brake": 3, "spot-welding": 1.5, "hardware-installation": 2.5, "powder-coating": 1.5, assembly: 1 },
    reason: "Enclosures are punched flat patterns formed on press brakes, often spot welded, with hardware installed and a coated finish.",
  },
  {
    id: "panel",
    label: "Panel",
    terms: ["panel", "panels", "door", "doors", "shelf", "shelves", "tray", "trays", "plate", "cladding", "facade panel", "perforated panel"],
    form: "sheet",
    boosts: { shearing: 1.5, "cnc-turret-punching": 2.5, "cnc-press-brake": 2.5, "powder-coating": 1 },
    reason: "Panels, doors and shelves are sheared, punched and formed from flat sheet.",
  },
  {
    id: "display",
    label: "Monitor / display component",
    terms: ["monitor", "monitor mount", "monitor arm", "display", "screen mount", "display component", "display components"],
    boosts: { "cnc-press-brake": 2.5, "mandrel-tube-bending": 1.5, "tig-welding": 1, "hardware-installation": 1.5, "powder-coating": 1 },
    reason: "Monitor display components are among the medical solutions Right lists: formed sheet and tube with hardware and finish.",
  },
  {
    id: "rack",
    label: "Rack / cage",
    terms: ["rack", "racks", "roof rack", "cage", "roll cage", "guard", "bumper", "grille", "headache rack", "ladder rack"],
    form: "tube",
    boosts: { "mandrel-tube-bending": 3, "3d-bending": 1.5, "mig-welding": 2.5, "tig-welding": 1, "powder-coating": 2.5 },
    reason: "Racks and cages are bent tube structures, usually welded and powder coated for outdoor use.",
  },
  {
    id: "channel",
    label: "Formed channel",
    terms: ["channel", "channels", "c channel", "u channel", "hat channel", "profile", "profiles"],
    boosts: { "3d-bending": 2.5, "cnc-press-brake": 1.5 },
    reason: "Right lists 3D bending of channels alongside tube.",
  },
  {
    id: "extrusion",
    label: "Extrusion",
    terms: ["extrusion", "extrusions", "extruded", "extruded profile", "custom extrusion"],
    boosts: { "tube-cutoff": 2, "cnc-machining": 2.5, "mandrel-tube-bending": 1 },
    reason: "Right processes custom extruded shapes: cut to length, machined on HAAS mills and bent where needed.",
  },
  {
    id: "assembly-unit",
    label: "Multi-part assembly",
    terms: ["assembly", "assemblies", "unit", "system", "product", "kit", "complete unit", "finished product", "turnkey"],
    boosts: { assembly: 2, "hardware-installation": 1.5, "packaging-logistics": 1 },
    reason: "Multi-part products need hardware, assembly and packaging as well as the fabricated parts.",
  },
];

export const tubeFormTerms = ["tube", "tubes", "tubing", "tubular", "pipe", "pipes", "round tube", "square tube", "square tubing", "rectangular tube", "rect tube", "rectangular tubing", "od", "wall thickness", "gauge wall"];
export const sheetFormTerms = ["sheet", "sheet metal", "sheetmetal", "flat stock", "flat pattern", "gauge", "ga", "blank", "blanks", "plate"];

export interface Rule {
  id: string;
  /** Entity keys: cap:<id>, mat:<id>, mkt:<id>, part:<id>, need:<id>, form:tube|sheet, term:<normalized phrase> */
  all?: string[];
  any?: string[];
  none?: string[];
  boosts: Record<string, number>;
  reason: string;
  /** Which capability the reason should attach to (defaults to all boosted). */
  target?: string[];
}

export const rules: Rule[] = [
  { id: "tube-bend", all: ["form:tube"], any: ["term:bend", "term:bends", "term:bent", "term:bending", "term:curve", "term:curved", "term:radius"], boosts: { "mandrel-tube-bending": 4 }, reason: "Bent tube → mandrel bending on 2 pull-type benders with 100+ dies." },
  { id: "tube-compound", all: ["form:tube"], any: ["term:multiple bends", "term:several bends", "term:compound", "term:compound bends", "term:complex", "term:3d", "term:multi plane", "term:many bends", "term:complex bends", "term:complex geometry"], boosts: { "3d-bending": 4.5 }, reason: "Multi-plane bends → 3D bending with plane-of-bend control." },
  { id: "tube-holes", all: ["form:tube"], any: ["term:holes", "term:hole", "term:hole pattern", "term:slots", "term:punched", "term:mounting holes", "term:perforated"], boosts: { "tube-punching": 3.5 }, reason: "Holes and slots in tube → tube punching." },
  { id: "sheet-holes", all: ["form:sheet"], any: ["term:holes", "term:hole", "term:hole pattern", "term:slots", "term:cutouts", "term:punched", "term:perforated", "term:vents", "term:openings"], boosts: { "cnc-turret-punching": 3 }, reason: "Features in flat sheet → CNC turret punching." },
  { id: "sheet-default", all: ["form:sheet"], none: ["cap:cnc-press-brake"], boosts: { "cnc-press-brake": 1.5, "cnc-turret-punching": 1 }, reason: "Sheet parts are usually punched flat and formed on a press brake." },
  { id: "tube-default", all: ["form:tube"], boosts: { "tube-cutoff": 1, "mandrel-tube-bending": 1 }, reason: "Tube work starts with cut-off, then bending." },
  { id: "weld-stainless", all: ["mat:stainless-steel"], any: ["term:weld", "term:welded", "term:welding", "term:welds", "cap:tig-welding", "cap:mig-welding"], boosts: { "tig-welding": 3 }, reason: "Welded stainless → TIG, which gives fine control for clean, visible welds." },
  { id: "weld-aluminum", all: ["mat:aluminum"], any: ["term:weld", "term:welded", "term:welding", "term:welds", "cap:tig-welding", "cap:mig-welding"], boosts: { "tig-welding": 3, "mig-welding": 1 }, reason: "Welded aluminum → TIG for control, MIG where speed matters." },
  { id: "weld-carbon", all: ["mat:carbon-steel"], any: ["term:weld", "term:welded", "term:welding", "term:welds"], boosts: { "mig-welding": 3, "tig-welding": 1 }, reason: "Welded carbon steel → MIG for strong, efficient structural welds." },
  { id: "weld-generic", any: ["term:weld", "term:welded", "term:welding", "term:welds", "term:joined"], none: ["mat:stainless-steel", "mat:aluminum", "mat:carbon-steel"], boosts: { "tig-welding": 2, "mig-welding": 2 }, reason: "Welded assembly → MIG or TIG depending on material and appearance." },
  { id: "sheet-lap-weld", all: ["form:sheet"], any: ["term:weld", "term:welded", "term:welding"], boosts: { "spot-welding": 1.5 }, reason: "Sheet-to-sheet joints can be spot welded without filler." },
  { id: "welded-tabs", any: ["part:bracket"], all: ["form:tube"], boosts: { "tig-welding": 1.5, "cnc-press-brake": 1 }, reason: "Tabs and brackets on a tube frame → formed on the press brake, then welded on." },
  { id: "mounting", any: ["term:mounting", "term:mounted", "term:mount", "term:mounts", "term:fastener", "term:fasteners"], boosts: { "hardware-installation": 2.5 }, reason: "Mounting points usually need installed hardware, fitted and alignment-checked before delivery." },
  { id: "medical-finish", all: ["mkt:medical"], boosts: { "powder-coating": 1.5, "tig-welding": 1, assembly: 1.5 }, reason: "Medical equipment calls for environmentally clean exterior coating." },
  { id: "outdoor", any: ["term:outdoor", "term:outside", "term:weather", "term:corrosion", "term:rust", "term:exterior", "term:marine"], boosts: { "powder-coating": 2.5, "surface-prep": 1 }, reason: "Outdoor or corrosive environments → durable powder coat or Cerakote through APC." },
  { id: "proto", any: ["need:prototype", "need:rush"], boosts: { prototyping: 4, "engineering-support": 1 }, reason: "Prototype → built with production-level precision. 48-hour turnaround on select prototypes and rush orders." },
  { id: "production", any: ["need:production"], boosts: { "production-manufacturing": 4, "packaging-logistics": 1.5 }, reason: "Production → repeatable runs, 10,000+ precision parts a year." },
  { id: "proto-to-prod", all: ["need:prototype", "need:production"], boosts: { "engineering-support": 2 }, reason: "Prototype to production under one supplier." },
  { id: "unsure", any: ["term:not sure", "term:don't know", "term:dont know", "term:help", "term:advice", "term:which process", "term:best way", "term:recommend"], boosts: { "engineering-support": 3.5 }, reason: "Not sure of the process → engineers with 30+ years' experience help with design." },
  { id: "tapped", any: ["term:tapped", "term:threaded", "term:threads", "term:machined", "term:machined features"], boosts: { "cnc-machining": 3 }, reason: "Machined features → HAAS CNC vertical mills." },
];

export const needs: { id: ProductionNeed; label: string; terms: string[]; detail: string }[] = [
  { id: "prototype", label: "Prototype", terms: ["prototype", "prototypes", "prototyping", "proto", "first article", "sample", "samples", "one off", "one-off", "mockup", "mock up", "proof of concept", "pilot", "evt", "dvt", "validation"], detail: "Prototypes validate design before production, and get the same attention to precision as large orders." },
  { id: "rush", label: "Rush", terms: ["rush", "urgent", "asap", "quick turn", "quickturn", "fast", "48 hour", "48 hours", "48-hour", "next week", "tomorrow", "this week", "expedite", "expedited"], detail: "48-hour turnaround on select prototypes and rush orders." },
  { id: "low-volume", label: "Low volume / high mix", terms: ["low volume", "small batch", "small run", "short run", "high mix", "handful", "a few", "dozens", "limited run"], detail: "High-mix, lower-volume programs are core to Right's industrial work." },
  { id: "production", label: "Production", terms: ["production", "production run", "volume", "high volume", "mass production", "thousands", "hundreds", "per month", "per year", "annually", "annual", "ongoing", "recurring", "repeat", "scale", "scaling", "eau", "blanket order"], detail: "Scalable production: 10,000+ precision parts manufactured annually." },
];

export interface Flag {
  terms: string[];
  level: "confirm" | "unlisted";
  message: string;
}

/**
 * Requests Right's published materials don't clearly cover. "confirm" = mentioned
 * loosely on rightmfg.com but not in the core capability lists; "unlisted" = not
 * published at all. Either way the Finder routes to a human instead of guessing.
 */
export const flags: Flag[] = [
  { terms: ["titanium", "inconel", "specialty metal", "specialty metals", "exotic"], level: "confirm", message: "Right's materials page mentions titanium and specialty metals, but its core list is aluminum, stainless and carbon steel. Confirm with engineering." },
  { terms: ["copper", "brass", "bronze"], level: "confirm", message: "Copper and brass appear in Right's materials imagery but not in its published material list. Confirm with engineering." },
  { terms: ["laser cutting", "laser cut", "laser-cut", "fiber laser", "tube laser", "laser cutter"], level: "confirm", message: "Right's published equipment list covers shearing and CNC turret punching; laser cutting isn't listed. Confirm with engineering." },
  { terms: ["robotic welding", "robot weld", "robotic weld", "stick welding", "stick weld", "smaw"], level: "confirm", message: "Right's published welding capabilities are MIG, TIG and spot welding. Confirm other processes with the team." },
  { terms: ["anodize", "anodizing", "anodized", "polish", "polishing", "polished", "plating", "plated", "chrome", "zinc plating", "passivation", "passivate", "e-coat", "galvanize", "galvanizing"], level: "confirm", message: "Published finishing through APC is powder coating, Cerakote, blasting, masking, wash and laser marking. Confirm other finishes with the team." },
  { terms: ["tolerance", "tolerances", "±", "+/-", "thou", "microns", "micron", "tight tolerance", "tight tolerances"], level: "confirm", message: "Right doesn't publish general tolerances. They depend on geometry, material and process and are confirmed on drawing review." },
  { terms: ["iso", "iso 9001", "as9100", "iso 13485", "13485", "itar", "nadcap", "certified", "certification", "certifications", "aws certified", "ppap"], level: "confirm", message: "Certifications and registrations aren't published on rightmfg.com. Ask the team for current quality documentation." },
  { terms: ["casting", "castings", "cast", "die cast", "forging", "forged"], level: "unlisted", message: "Casting and forging aren't among Right's published capabilities." },
  { terms: ["injection molding", "injection molded", "plastic", "plastics", "molded", "urethane", "rubber", "silicone"], level: "unlisted", message: "Right is a metal fabricator. Plastic and molded parts aren't among its published capabilities." },
  { terms: ["3d printing", "3d printed", "additive", "additive manufacturing"], level: "unlisted", message: "Additive manufacturing isn't among Right's published capabilities." },
  { terms: ["5 axis", "5-axis", "five axis", "lathe", "turning", "turned", "swiss", "cnc turning"], level: "unlisted", message: "Right's published machining is CNC vertical milling (3 HAAS mills). Turning and 5-axis aren't listed." },
  { terms: ["waterjet", "water jet", "plasma", "plasma cutting", "edm", "wire edm"], level: "unlisted", message: "Waterjet, plasma and EDM aren't among Right's published cutting processes." },
  { terms: ["roll forming", "roll formed", "deep draw", "deep drawn", "hydroform", "hydroforming", "spinning", "metal spinning"], level: "unlisted", message: "This forming process isn't among Right's published capabilities. Right forms with press brakes, punch presses and mandrel/3D bending." },
  { terms: ["pcb", "circuit board", "wiring harness", "electronics assembly", "cable assembly", "firmware"], level: "unlisted", message: "Electronics and wiring aren't among Right's published capabilities. Right can deliver the metal structure and mechanical assembly." },
  { terms: ["wood", "wooden", "carbon fiber", "carbon fibre", "fiberglass", "glass"], level: "unlisted", message: "Right fabricates metal. Non-metal materials aren't among its published capabilities." },
];

/** Suggested prompts for the Finder UI. */
export const suggestedSearches = [
  "Stainless medical equipment frame",
  "Bent aluminum tubing",
  "Prototype welded assembly",
  "Sheet metal enclosure",
];

export const exampleQuestions = [
  "I need a stainless steel tubular frame for medical equipment with multiple bends and welded mounting brackets.",
  "An aluminum tubular frame with several compound bends and welded mounting tabs",
  "Sheet metal enclosure with hardware installed and black powder coat",
  "Can you bend square tubing?",
  "Can you handle prototypes?",
  "What materials do you work with?",
  "Carbon steel roof rack for off-road trucks, 500 per month",
  "Do you do welding?",
];
