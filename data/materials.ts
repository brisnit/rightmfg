import type { Material, MaterialId } from "./types";
import { images } from "./company";

/** Materials from the Material page, FAQs and brochure: aluminum alloys (all), carbon steel, stainless steel, in sheet and tube. */
export const materials: Material[] = [
  {
    id: "aluminum",
    name: "Aluminum Alloys",
    short: "Aluminum",
    description:
      "Right works across aluminum alloys in sheet, tube and extruded profiles — the choice when weight matters and corrosion resistance is needed.",
    keywords: ["aluminum", "aluminium", "alu", "al"],
    synonyms: ["6061", "5052", "6063", "3003", "extrusion", "extruded", "extrusions", "lightweight", "light weight"],
    processes: ["mandrel-tube-bending", "3d-bending", "cnc-turret-punching", "cnc-press-brake", "tig-welding", "mig-welding", "cnc-machining", "powder-coating"],
    considerations: [
      "Lighter than steel with good natural corrosion resistance.",
      "Steel is usually stronger; aluminum is recommended where weight matters.",
      "Welded on Right's MIG and TIG processes.",
    ],
    image: images.extrusions,
  },
  {
    id: "stainless-steel",
    name: "Stainless Steel",
    short: "Stainless",
    description:
      "Stainless steel sheet and tube for parts that must resist moisture, chemicals and repeated cleaning.",
    keywords: ["stainless", "stainless steel", "ss", "inox"],
    synonyms: ["304", "316", "304l", "316l", "corrosion resistant", "washdown", "sanitary", "hygienic"],
    processes: ["mandrel-tube-bending", "3d-bending", "cnc-turret-punching", "cnc-press-brake", "tig-welding", "spot-welding", "cnc-machining"],
    considerations: [
      "Holds up to moisture and weather when properly finished.",
      "Often selected when strength and corrosion resistance both matter.",
      "Welded on Right's MIG, TIG and spot welding processes.",
    ],
    image: images.brackets,
  },
  {
    id: "carbon-steel",
    name: "Carbon Steel",
    short: "Carbon Steel",
    description:
      "Carbon steel for strength-driven structures, frames and brackets — typically powder coated for protection and appearance.",
    keywords: ["carbon steel", "steel", "mild steel", "cold rolled", "hot rolled", "crs", "hrs"],
    synonyms: ["a36", "1018", "1020", "galvanized", "galvanneal", "strong", "heavy duty", "heavy-duty", "structural"],
    processes: ["mandrel-tube-bending", "3d-bending", "cnc-turret-punching", "cnc-press-brake", "punch-press", "mig-welding", "tig-welding", "spot-welding", "powder-coating"],
    considerations: [
      "Usually the stronger choice for heavy-duty applications.",
      "Pairs naturally with powder coating through APC.",
      "Welded on Right's MIG, TIG and spot welding processes.",
    ],
    image: images.cartFrame,
  },
];

export const materialById = Object.fromEntries(materials.map((m) => [m.id, m])) as Record<MaterialId, Material>;

/** Material forms Right lists (Tube page). */
export const tubeShapes = [
  { id: "round", name: "Round tube", note: "Identified by outside diameter + wall (gauge)" },
  { id: "pipe", name: "Pipe", note: "Identified by inside diameter + wall (schedule)" },
  { id: "square", name: "Square tube", note: "Covered by the 100+ die library" },
  { id: "rectangular", name: "Rectangular tube", note: "" },
  { id: "extruded", name: "Custom extruded shapes", note: "" },
];
