import type { Market, MarketId } from "./types";
import { images } from "./company";

/**
 * Markets listed on rightmfg.com. `sourceNotes` hold Right's own statements;
 * `why` connects the market to verified capabilities without claiming
 * programs, certifications or customers that aren't published.
 */
export const markets: Market[] = [
  {
    id: "medical",
    name: "Medical",
    short: "Medical",
    headline: "Precision fabrication for products where quality cannot be an afterthought.",
    summary:
      "Carts, monitor display components and equipment support structures for medical device OEMs.",
    why:
      "Medical equipment lives in front of clinicians and patients. Frames have to be straight and repeatable, welds clean, and exterior finishes durable and environmentally clean. Right combines tube bending, sheet metal forming, TIG welding and assembly with APC finishing, so structures arrive complete.",
    sourceNotes: [
      "Advanced medical devices and products require leading-edge technologies and environmentally clean exterior coating.",
      "Right solutions include carts, monitor display components and equipment support structures.",
    ],
    applications: ["Equipment carts", "Monitor & display components", "Equipment support structures", "Welded tube frames", "Formed sheet metal covers and brackets"],
    capabilityIds: ["mandrel-tube-bending", "3d-bending", "cnc-press-brake", "tig-welding", "hardware-installation", "assembly", "powder-coating", "prototyping"],
    keywords: ["medical", "medical device", "medical equipment", "hospital", "clinical", "healthcare", "health care", "patient", "surgical", "lab", "laboratory", "imaging", "iv pole", "diagnostic"],
    image: images.brackets,
    customerIds: ["bd", "covidien"],
  },
  {
    id: "automotive",
    name: "Automotive / Off Road",
    short: "Automotive",
    headline: "Built to last the life of the vehicle.",
    summary:
      "Formed and welded components for automotive and off-road programs that need repeatable quality over the product life cycle.",
    why:
      "Automotive and off-road programs run at higher volumes with lower costs and often a high mix of part numbers, and they need product life-cycle management behind them. Mandrel bending with a 100+ die library, repeatable CNC forming and production welding support that from prototype through volume.",
    sourceNotes: [
      "Automotive and off-road applications demand product life-cycle management to support products over their intended life.",
      "Higher volumes and lower costs with high mix potential characterize this segment.",
    ],
    applications: ["Bent tube components", "Brackets and mounts", "Welded frames and racks", "Truck and trailer parts"],
    capabilityIds: ["mandrel-tube-bending", "3d-bending", "cnc-press-brake", "punch-press", "mig-welding", "tig-welding", "powder-coating", "production-manufacturing"],
    keywords: ["automotive", "auto", "car", "vehicle", "truck", "trailer", "off road", "off-road", "offroad", "atv", "utv", "4x4", "overland", "roll cage", "bumper", "rack", "tonneau", "tarp"],
    image: images.mandrel,
    customerIds: ["amcan", "pulltarps"],
  },
  {
    id: "military",
    name: "Military",
    short: "Military",
    headline: "Fabrication for demanding defense applications.",
    summary:
      "Formed, welded and assembled metal components built to customer drawings and specifications.",
    why:
      "Defense work calls for components built exactly to drawing, with durable finishes and part identification. Right's forming, welding and assembly, together with APC coating and laser part marking, cover the whole route from blank to marked, finished part.",
    sourceNotes: ["Military is one of the markets Right Manufacturing serves."],
    applications: ["Fabricated brackets and enclosures", "Welded frames", "Coated and marked components"],
    capabilityIds: ["cnc-press-brake", "cnc-turret-punching", "mandrel-tube-bending", "tig-welding", "mig-welding", "powder-coating", "part-marking", "assembly"],
    keywords: ["military", "defense", "defence", "dod", "armed forces", "navy", "army", "marine", "air force", "tactical", "rugged", "mil spec", "mil-spec"],
    image: images.partDetail,
  },
  {
    id: "industrial",
    name: "Industrial",
    short: "Industrial",
    headline: "Durable metalwork for high-mix industrial products.",
    summary:
      "Enclosures, frames, brackets and assemblies for industrial equipment built for tough environments.",
    why:
      "Industrial programs tend to be lower volume and higher mix, and demand swings with the market. Parts still have to survive extreme environments. Right's CNC turret punching, press brakes, welding and machining handle frequent changeovers, and a stocked material inventory keeps turnaround short.",
    sourceNotes: [
      "Product and business requirements for industrial applications are often defined by lower volumes, higher mix product focus, and EAQ volumes often fluctuate with market conditions.",
      "All while demanding advanced durable solutions suited for extreme environments.",
    ],
    applications: ["Equipment enclosures", "Machine frames", "Brackets and mounts", "Water-system and process equipment components"],
    capabilityIds: ["cnc-turret-punching", "cnc-press-brake", "spot-welding", "mig-welding", "cnc-machining", "hardware-installation", "assembly", "powder-coating"],
    keywords: ["industrial", "industrial equipment", "machinery", "factory", "plant", "water", "filtration", "hvac", "process equipment", "electrical", "spa", "wellness", "safety"],
    image: images.turret,
    customerIds: ["kinetico", "axeon", "valmark", "killion", "jmark", "euramco", "watkins"],
  },
  {
    id: "architectural",
    name: "Architectural / Construction",
    short: "Architectural",
    headline: "Formed metal for the built environment.",
    summary:
      "Formed and fabricated metal components for architectural and construction projects.",
    why:
      "Architectural and construction metalwork is judged on both fit and appearance. Right's press brakes, turret punching, tube bending and welding, finished through APC, turn out consistent, coated components ready to install.",
    sourceNotes: ["Architectural / Construction is one of the markets Right Manufacturing serves."],
    applications: ["Formed panels", "Railings and bent tube elements", "Brackets and mounting hardware", "Coated metal components"],
    capabilityIds: ["cnc-press-brake", "cnc-turret-punching", "mandrel-tube-bending", "mig-welding", "tig-welding", "powder-coating"],
    keywords: ["architectural", "architecture", "construction", "building", "facade", "façade", "railing", "handrail", "canopy", "signage", "contractor"],
    image: images.panels,
    customerIds: ["mbarc"],
  },
  {
    id: "decorative",
    name: "Decorative Metal Work",
    short: "Decorative",
    headline: "Indoor and outdoor decorative metalwork, built properly.",
    summary:
      "Indoor and outdoor decorative metal work — bent, formed, welded and finished.",
    why:
      "Decorative work is structural work that also has to look right. Clean bends, careful TIG welds and durable powder coat or Cerakote finishes let indoor and outdoor pieces hold up and keep their finish.",
    sourceNotes: ["Indoor and outdoor decorative metal work are markets Right Manufacturing serves."],
    applications: ["Indoor decorative metal work", "Outdoor decorative metal work", "Bent tube features", "Coated fabricated pieces"],
    capabilityIds: ["mandrel-tube-bending", "3d-bending", "cnc-press-brake", "tig-welding", "powder-coating", "surface-prep"],
    keywords: ["decorative", "ornamental", "furniture", "gate", "fence", "sculpture", "art", "interior", "exterior", "outdoor", "indoor", "retail"],
    image: images.powderLine,
  },
];

export const marketById = Object.fromEntries(markets.map((m) => [m.id, m])) as Record<MarketId, Market>;
