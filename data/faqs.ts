import type { Faq } from "./types";

/** Company FAQs — rightmfg.com/…-faqs and Material page, lightly edited for clarity. */
export const faqs: Faq[] = [
  {
    q: "What services does Right Manufacturing offer?",
    a: "Precision metal fabrication and forming: sheet metal, tube bending, welding and assembly. Also material sourcing, prototyping, hardware integration and scalable production, with finishing through sister company Action Powder Coating.",
  },
  {
    q: "What industries do you serve?",
    a: "Medical, automotive / off road, industrial, military, architectural / construction, and indoor and outdoor decorative metal work.",
  },
  {
    q: "What materials do you work with?",
    a: "Aluminum alloys, carbon steel and stainless steel, in sheet and tube. Each material is chosen for strength, formability and the application, and the team checks that material and design specification are compatible.",
  },
  {
    q: "Can I request a custom prototype before production?",
    a: "Yes. Prototype development validates designs and tests function before full production. Prototypes get the same attention to precision as large orders, and select prototypes and rush orders can turn in 48 hours.",
  },
  {
    q: "How do I get started with a project?",
    a: "Start a project online or contact the team directly with technical drawings and requirements. Right reviews your specifications and returns a detailed quote and timeline.",
  },
  {
    q: "Is aluminum stronger than steel?",
    a: "Steel is usually stronger, but aluminum is lighter and resists corrosion well. Right recommends aluminum where weight matters and steel for heavy-duty strength.",
  },
  {
    q: "How do I pick a metal for my project?",
    a: "It depends on how the part is used, the stress it handles and the finish it needs. Right's team helps match the metal to the job.",
  },
];

/** Material page FAQs (Material page + FAQs). */
export const materialFaqs: Faq[] = [
  { q: "Is aluminum stronger than steel?", a: "Steel is usually stronger, but aluminum is lighter and resists corrosion well. Right recommends aluminum where weight matters and steel for heavy-duty strength." },
  { q: "How do I choose a metal for my project?", a: "It depends on how the part will be used, the stress it handles and the finish it needs. Right's team looks at strength, corrosion resistance, weight and weldability to match the metal to the job." },
  { q: "Do you stock material?", a: "Right keeps a consistent inventory to support fast turnaround and scalable production, and checks material compatibility for both function and finish." },
];

/** Plain-language definitions of terms used on this site. */
export const glossary: { t: string; d: string }[] = [
  { t: "Mandrel tube bending", d: "Bending tube around a die while an internal mandrel supports the wall, so the tube keeps its shape through tighter bends." },
  { t: "3D bending", d: "Bends in more than one plane on a single part: tube or channel rotated between bends to create multi-plane geometry." },
  { t: "Plane of bend", d: "The rotational orientation of each bend relative to the previous one. Controlling it keeps 3D parts repeatable." },
  { t: "Pressure die assist", d: "A pressure die that pushes the tube forward during bending to help control the wall through the bend." },
  { t: "Pipe vs. tube", d: "Pipe is identified by inside diameter plus wall (schedule). Tube is identified by outside diameter plus wall (gauge)." },
  { t: "CNC turret punch", d: "A CNC machine that punches holes, slots and shapes into flat sheet from a turret of interchangeable tools." },
  { t: "CNC press brake", d: "A hydraulic press that drives die-sets into flat sheet to form bends, radii and curls. CNC controls sequence, pressure, dwell and part position." },
  { t: "MIG welding", d: "Wire-fed arc welding: fast, strong welds for structural and production work." },
  { t: "TIG welding", d: "Tungsten arc welding with a separately fed filler rod, giving detailed control for visible, thin or stainless and aluminum work." },
  { t: "Spot welding", d: "Resistance welding that joins overlapping sheet at discrete points without filler metal." },
  { t: "Powder coating", d: "A dry powder applied to prepared metal and cured into a hard, durable finish." },
  { t: "Cerakote", d: "A thin-film ceramic coating used where a durable, thin finish is needed." },
];

/** "Why Right" reasons (About page). */
export const whyRight: { t: string; b: string }[] = [
  { t: "Prototype through production", b: "The same engineers, operators and equipment build your first part and your ten-thousandth. Select prototypes and rush orders turn in 48 hours." },
  { t: "People with decades on the floor", b: "35 people averaging 20+ years of experience. Engineers with 30+ years help with product design, fabrication and assembly." },
  { t: "Equipment on record", b: "2 pull-type mandrel tube benders, 3 Wiedemann turret punches, 4 Cincinnati CNC press brakes, 6 Bliss punch presses, and more." },
  { t: "Fewer vendors", b: "Forming, welding, hardware, machining, assembly and packaging, with finishing through APC. Less outsourcing means fewer delays." },
  { t: "Customers stay", b: "98% client retention with OEMs including BD, Covidien, Kinetico and Axeon." },
  { t: "Rooted in San Diego", b: "20,000 sq. ft. in the design, manufacturing and technology hub of Southern California, with a consistent material inventory for fast turnaround." },
];
