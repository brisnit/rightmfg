import type { Service, ServiceId } from "./types";
import { images } from "./company";

/** Service (capability detail) pages. Content drawn from rightmfg.com capability pages and the brochure. */
export const services: Service[] = [
  {
    id: "tube-bending",
    name: "Tube Bending",
    eyebrow: "Capability / Tube Forming",
    headline: ["Complex geometry.", "Repeatable precision."],
    summary:
      "CNC-controlled mandrel bending, 3D bending of tube and channel, cut-off, punching and drilling. Structural and fluid-conveying tubing for medical, automotive, industrial and specialty builds, from the first prototype through full production.",
    overview: [
      "Tube bending shapes tubing into curves and angles without cutting it. Fewer joints means fewer welds, better appearance, and often a stronger frame.",
      "Right runs two pull-type mandrel benders with a library of more than 100 bending dies for round and square tube. Plane-of-bend control keeps multi-plane (3D) parts in orientation from bend to bend. Pressure die assist supports the tube wall through tighter bends.",
      "Tube arrives cut to length on dedicated cut-off saws, then gets punched, drilled or milled as needed, ready for welding, hardware and assembly. The operators running these machines are the core of the tube capability.",
    ],
    image: images.mandrel,
    gallery: [images.tubeStock, images.extrusions, images.mandrelBw, images.powderLine],
    video: { src: "/video/tube-bending.mp4", poster: "/images/tube-bending-poster.jpg" },
    equipment: [
      { label: "Mandrel benders", value: "2 × pull-type" },
      { label: "Bending dies", value: "100+" },
      { label: "Tube profiles", value: "Round & square" },
      { label: "Cut-off saws", value: "2" },
    ],
    specs: [
      { label: "Processes", items: ["Mandrel tube bending", "3D bending — tube & channel", "Tube cut-off", "Tube punching", "Tube drilling & milling"] },
      { label: "Bender features", items: ["Plane-of-bend control", "Pressure die assist", "CNC-controlled"] },
      { label: "Shapes", items: ["Round tube — OD + wall (gauge)", "Pipe — ID + wall (schedule)", "Square tube", "Rectangular tube", "Custom extruded shapes"] },
      { label: "Tubing", items: ["Seamless and welded tubing", "Structural and fluid-conveying"] },
    ],
    capabilityIds: ["mandrel-tube-bending", "3d-bending", "tube-cutoff", "tube-punching", "tube-drill-milling"],
    materials: ["aluminum", "stainless-steel", "carbon-steel"],
    markets: ["medical", "automotive", "industrial", "architectural", "decorative"],
    questions: [
      "Can you bend square tubing?",
      "I need a stainless tube frame with multiple bends and welded brackets",
      "Can you handle prototypes?",
      "Aluminum tubing bent, welded and assembled",
    ],
    faqs: [
      { q: "What is tube bending used for?", a: "Shaping metal tubing into curves or angles without cutting the tube. It's common in automotive, furniture, medical carts and industrial equipment." },
      { q: "What's the difference between tube forming and tube bending?", a: "Tube forming often changes the tube's shape or diameter, such as expanding, reducing or flaring. Bending just curves it." },
      { q: "Is tube bending better than welding joints for frames?", a: "In many cases, yes. Bending avoids seams and can improve strength and appearance, though the best choice depends on the structure." },
      { q: "How long does it take to bend and process tubing?", a: "It depends on complexity and quantity. Simple jobs can be same-day or next-day in some cases, and select prototypes and rush orders can turn in 48 hours. Right confirms timing once specs are reviewed." },
    ],
  },
  {
    id: "sheet-metal",
    name: "Sheet Metal",
    eyebrow: "Capability / Sheet Metal",
    headline: ["Flat stock.", "Formed exactly."],
    summary:
      "Shearing, CNC turret punching, CNC press brake forming and punch press operations. Brackets, enclosures, panels and components made to exact dimensions.",
    overview: [
      "Sheet metal work starts flat. Right shears blanks, then punches holes, slots and cutouts on three Wiedemann CNC turret punch machines.",
      "Four Cincinnati CNC press brakes (60, 90 and 135 ton) use hydraulic pressure to drive die-sets into the sheet, forming bends, radii, curls and folded features. Each part is programmed for bend sequence, pressure, dwell and part position, which is how complex 'origami' shapes stay repeatable.",
      "Six Bliss punch presses from 5 to 60 tons handle repeat operations at production volumes. Formed parts then move to welding, hardware installation, assembly and APC finishing.",
    ],
    image: images.brakeDetail,
    gallery: [images.turret, images.panels, images.brackets, images.brakeOperator],
    equipment: [
      { label: "CNC turret punches", value: "3 × Wiedemann" },
      { label: "CNC press brakes", value: "4 × Cincinnati" },
      { label: "Press brake tonnage", value: "60 / 90 / 135" },
      { label: "Punch presses", value: "6 × Bliss, 5–60 T" },
    ],
    specs: [
      { label: "Processes", items: ["Shearing", "CNC turret punching", "CNC press brake forming", "Punch press operations"] },
      { label: "Turret punches", items: ["Wiedemann C2500", "Wiedemann C3000"] },
      { label: "Forming", items: ["Bends", "Radii", "Curls", "Multi-bend 'origami' shapes"] },
    ],
    capabilityIds: ["shearing", "cnc-turret-punching", "cnc-press-brake", "punch-press"],
    materials: ["aluminum", "stainless-steel", "carbon-steel"],
    markets: ["medical", "industrial", "architectural", "military", "automotive"],
    questions: ["Sheet metal enclosure with hardware and powder coat", "Formed stainless brackets for medical equipment", "What press brakes do you have?"],
    faqs: [
      { q: "What is sheet metal used for?", a: "Enclosures, brackets, panels and covers across construction, automotive, appliances, HVAC and electronics." },
      { q: "Is sheet metal good for outdoor projects?", a: "Yes. Stainless steel or properly finished steel holds up well to moisture and weather." },
      { q: "Can sheet metal be powder coated?", a: "Yes. Powder coating and Cerakote are available through sister company Action Powder Coating." },
      { q: "How long does sheet metal work take?", a: "Lead times depend on complexity, material availability and finish. Right provides an estimate once the design is reviewed." },
    ],
  },
  {
    id: "welding",
    name: "Welding",
    eyebrow: "Capability / Joining",
    headline: ["Clean welds.", "Strong assemblies."],
    summary:
      "MIG, TIG and spot welding on steel, stainless steel and aluminum alloys. Fabricated assemblies with welds inspected for strength and finish.",
    overview: [
      "Welding joins formed tube and sheet into working assemblies. Experienced technicians weld on calibrated equipment with process controls in place.",
      "TIG gives detailed control for visible stainless and aluminum welds. MIG is fast and strong for structural frames. Spot welding joins sheet metal lap joints without filler.",
      "Welding sits in the same flow as forming, punching and machining, so fit-up is planned before the first bend and assemblies move on to hardware, finishing and assembly without leaving the process.",
    ],
    image: images.weldingWide,
    gallery: [images.welding, images.cartFrame, images.brackets, images.tubeStock],
    equipment: [
      { label: "Processes", value: "MIG · TIG · Spot" },
      { label: "Materials", value: "Steel · SS · Al" },
      { label: "Inspection", value: "Strength & finish" },
      { label: "Volumes", value: "Proto → production" },
    ],
    specs: [
      { label: "Processes", items: ["MIG welding", "TIG welding", "Spot welding"] },
      { label: "Materials", items: ["Steel", "Stainless steel", "Aluminum alloys"] },
      { label: "Work types", items: ["Welded tube frames", "Brackets and mounting tabs", "Sheet metal assemblies", "High-mix custom assemblies"] },
    ],
    capabilityIds: ["tig-welding", "mig-welding", "spot-welding"],
    materials: ["aluminum", "stainless-steel", "carbon-steel"],
    markets: ["medical", "automotive", "industrial", "architectural", "decorative", "military"],
    questions: ["Do you do welding?", "TIG welded aluminum frame", "What's the difference between MIG and TIG?"],
    faqs: [
      { q: "What's the difference between MIG, TIG and spot welding?", a: "MIG is quick and clean for structural welds. TIG gives more detailed control for visible or thin work. Spot welding joins overlapping sheet without filler." },
      { q: "How long does welding take?", a: "It depends on the job. Right gives a time estimate before work starts." },
      { q: "Is fabrication different from welding?", a: "Yes. Fabrication is the full process of building a part from metal. Welding is one step that joins the pieces." },
    ],
  },
  {
    id: "assembly",
    name: "Hardware, Assembly & Machining",
    eyebrow: "Capability / Secondary Operations",
    headline: ["Delivered complete.", "Ready to install."],
    summary:
      "Hardware installation, mid- and high-level assembly, CNC machining, packaging and logistics, so parts arrive ready for use or the next manufacturing step.",
    overview: [
      "Right handles component integration, fastener fitting and packaging to keep programs on schedule. Hardware is installed during fabrication, which cuts installation time and the risk of rework or misfit.",
      "Hardware compatibility and alignment are double-checked before delivery. Fasteners, hinges, latches or specialty brackets are chosen or customized to match form tolerances and material.",
      "Three HAAS CNC vertical mills add machined features to formed and fabricated parts, and packaging and logistics bring finished assemblies to your dock ready to use.",
    ],
    image: images.mill,
    gallery: [images.brackets, images.surfacePrep, images.extrusions, images.partDetail],
    equipment: [
      { label: "CNC vertical mills", value: "3 × HAAS" },
      { label: "Assembly", value: "Mid & high level" },
      { label: "Hardware check", value: "Before delivery" },
      { label: "Packaging", value: "& logistics" },
    ],
    specs: [
      { label: "Hardware", items: ["Fasteners", "Hinges", "Latches", "Brackets", "Custom-length pins and load-bearing mounts"] },
      { label: "Assembly", items: ["Component integration", "Fastener fitting", "Mid-level assembly", "High-level assembly"] },
      { label: "Machining", items: ["HAAS CNC vertical mills", "Machined features on formed parts"] },
      { label: "Delivery", items: ["Packaging", "Logistics"] },
    ],
    capabilityIds: ["hardware-installation", "assembly", "cnc-machining", "packaging-logistics"],
    materials: ["aluminum", "stainless-steel", "carbon-steel"],
    markets: ["medical", "industrial", "automotive", "military"],
    questions: ["Can you assemble and package the finished unit?", "Do you install hardware?", "Do you do machining?"],
    faqs: [
      { q: "What is hardware in metal fabrication?", a: "The mechanical parts that connect, secure or support metal structures: fasteners, hinges, latches, brackets and other small components." },
      { q: "Standard or custom hardware?", a: "It depends on the project. Some parts work with off-the-shelf hardware, while unique shapes or loads may need custom components. Right reviews your specs to decide." },
      { q: "What's the difference between hardware and structural parts?", a: "Hardware is the smaller connecting pieces. Structural parts are the main load-bearing sections." },
    ],
  },
  {
    id: "finishing",
    name: "Finishing",
    eyebrow: "Capability / Finishing — with APC",
    headline: ["Finished in San Diego.", "Partnered for 35 years."],
    summary:
      "Powder coating, Cerakote, sand blasting, masking, substrate wash and laser part marking through sister company Action Powder Coating.",
    overview: [
      "Right Manufacturing and Action Powder Coating (APC) have partnered for 35 years. Both are located in the heart of San Diego's industrial complex.",
      "APC applies highly durable powder coatings that are both attractive and environmentally friendly. An automatic conveyor line processes high-volume products at competitive cost, and batch application handles larger units and smaller volumes.",
      "Pre-treatment includes sand blasting, masking and an ionic multi-stage substrate wash. Parts can also be laser engraved or marked, refurbished or reclaimed.",
    ],
    image: images.powderLine,
    gallery: [images.powderBooth, images.powderParts, images.powderPortrait, images.cartFrame],
    equipment: [
      { label: "Partnership", value: "35 years" },
      { label: "Volume line", value: "Auto conveyor" },
      { label: "Large units", value: "Batch" },
      { label: "Coatings", value: "Powder · Cerakote" },
    ],
    specs: [
      { label: "Coatings", items: ["Powder coating", "Cerakote"] },
      { label: "Preparation", items: ["Sand blasting", "Masking", "Ionic multi-stage substrate wash"] },
      { label: "Other services", items: ["Laser engraving / part marking", "Refurbishment and reclamation", "Assembly, finishing"] },
    ],
    capabilityIds: ["powder-coating", "surface-prep", "part-marking"],
    materials: ["aluminum", "stainless-steel", "carbon-steel"],
    markets: ["medical", "automotive", "industrial", "architectural", "decorative", "military"],
    questions: ["Can you powder coat the finished parts?", "Do you offer Cerakote?", "Can you laser mark part numbers?"],
    faqs: [
      { q: "Who performs finishing?", a: "Action Powder Coating (APC), Right's sister company and partner of 35 years, also located in the heart of San Diego's industrial complex." },
      { q: "Can you handle high-volume coating?", a: "Yes. APC's automatic conveyor line is built for high-volume products, with batch application for larger units and smaller volumes." },
    ],
    partner: "APC",
  },
];

export const serviceById = Object.fromEntries(services.map((s) => [s.id, s])) as Record<ServiceId, Service>;

export function serviceHref(id: ServiceId): string {
  if (id === "engineering") return "/start-a-project";
  return `/capabilities/${id}`;
}
