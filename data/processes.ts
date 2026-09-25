/**
 * Prototype → production journey. Each step is grounded in a statement from
 * rightmfg.com or the brochure (noted in `source`).
 */
export const processSteps = [
  {
    n: "01",
    title: "Engineering Review",
    body: "Send drawings and requirements. Engineers with 30+ years of experience review specs, help with design and material selection, then return a detailed quote and timeline.",
    source: "FAQs · Sheet Metal",
    tags: ["Drawings", "Material selection", "Quote & timeline"],
  },
  {
    n: "02",
    title: "Prototyping",
    body: "Prototypes validate design and function before production and are built with the same precision as production orders. Select prototypes and rush orders turn in 48 hours.",
    source: "FAQs · Home",
    tags: ["Design validation", "48-hr on select parts"],
  },
  {
    n: "03",
    title: "Process Development",
    body: "Bend sequence, pressure, dwell and part positioning are programmed. Tooling is selected from a library of 100+ bending dies.",
    source: "Sheet Metal · Tube",
    tags: ["CNC programming", "Tooling selection"],
  },
  {
    n: "04",
    title: "Fabrication",
    body: "Shearing, turret punching, press brake forming, mandrel and 3D bending, then MIG, TIG and spot welding on steel, stainless and aluminum.",
    source: "Capabilities",
    tags: ["Form", "Punch", "Bend", "Weld"],
  },
  {
    n: "05",
    title: "Assembly",
    body: "Hardware installation, CNC machining and mid- to high-level assembly. Powder coating and Cerakote through sister company APC.",
    source: "Hardware · APC",
    tags: ["Hardware", "Machining", "Finishing"],
  },
  {
    n: "06",
    title: "Quality",
    body: "Welds are inspected for strength and finish, and hardware compatibility and alignment are double-checked before delivery.",
    source: "Welding · Hardware",
    tags: ["Weld inspection", "Fit & alignment"],
  },
  {
    n: "07",
    title: "Production",
    body: "Repeatable runs from high-mix, lower-volume programs to high volume, backed by a stocked material inventory. More than 10,000 precision parts a year.",
    source: "Home · Material",
    tags: ["Scalable", "High-mix", "10K+ parts / yr"],
  },
  {
    n: "08",
    title: "Packaging / Delivery",
    body: "Parts are packaged and shipped ready for immediate use or the next manufacturing step.",
    source: "Hardware",
    tags: ["Packaging", "Logistics"],
  },
] as const;
