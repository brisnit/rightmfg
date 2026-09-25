import type { ImageRef } from "./types";

/** Verified company facts — rightmfg.com (Home, About, Markets, Contact) and the RIGHT/APC brochure. */
export const company = {
  name: "Right Manufacturing",
  legalName: "Right Manufacturing LLC",
  founded: "1990s",
  location: "San Diego, California",
  address: {
    street: "7949 Stromesa Ct., Suite G",
    city: "San Diego",
    region: "CA",
    postal: "92126",
    country: "US",
  },
  phone: "858-566-7002",
  phoneHref: "tel:+18585667002",
  fax: "203-583-4131",
  email: "sales@rightmfg.com",
  brochure: "https://www.rightmfg.com/wp-content/themes/rightmanufng095/pdf/RIGHTAPC-Brochure.pdf",
  leadership: [
    { name: "Greg Lyon", role: "General Manager" },
    { name: "Karra Lyon", role: "Customer Service Manager" },
    { name: "LH Byrd", role: "Production Manager" },
  ],
  mission:
    "Founded nearly three decades ago with a service-first mission. That mission continues today through a 35-person company that averages 20+ years of experience.",
  values: [
    "People are our most valuable asset.",
    "Protecting natural resources and promoting environmental stewardship.",
    "A service-first, customer-first attitude.",
  ],
} as const;

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  display?: string;
  label: string;
  detail: string;
}

export const headlineStats: Stat[] = [
  { value: 25, suffix: "+", label: "Years in the industry", detail: "Founded in the 1990s in San Diego's industrial core." },
  { value: 20, suffix: "K", label: "Sq. ft. facility", detail: "San Diego, California." },
  { value: 10000, display: "10K", suffix: "+", label: "Precision parts / year", detail: "Manufactured annually." },
  { value: 98, suffix: "%", label: "Client retention", detail: "Customers who keep coming back." },
];

export const teamStats: Stat[] = [
  { value: 35, label: "Person team", detail: "Operators, engineers and customer service." },
  { value: 20, suffix: "+", label: "Years average experience", detail: "Across the team." },
  { value: 48, suffix: "HR", label: "Turnaround", detail: "On select prototypes and rush orders." },
];

/** Named equipment, as published on the Sheet Metal and Tube pages and in the brochure. */
export const equipment = [
  { count: 2, name: "Pull-type mandrel tube benders", detail: "100+ bending dies for round and square tube · plane-of-bend control · pressure die assist", service: "tube-bending" },
  { count: 3, name: "Wiedemann C2500 & C3000", detail: "CNC turret punch machines", service: "sheet-metal" },
  { count: 4, name: "Cincinnati CNC press brakes", detail: "60, 90 and 135 ton", service: "sheet-metal" },
  { count: 6, name: "Bliss punch presses", detail: "5 to 60 tons", service: "sheet-metal" },
  { count: 3, name: "HAAS CNC vertical mills", detail: "Machining of formed and fabricated parts", service: "assembly" },
  { count: 2, name: "Cut-off saws", detail: "Tube and profile cut-off", service: "tube-bending" },
] as const;

export const customers: { id: string; name: string; logo: string; w: number; h: number }[] = [
  { id: "bd", name: "BD", logo: "/images/customers/c1.png", w: 288, h: 130 },
  { id: "covidien", name: "Covidien", logo: "/images/customers/c12.png", w: 300, h: 96 },
  { id: "kinetico", name: "Kinetico Water Systems", logo: "/images/customers/c7.png", w: 320, h: 72 },
  { id: "axeon", name: "Axeon", logo: "/images/customers/c8.png", w: 383, h: 126 },
  { id: "valmark", name: "Valmark Interface Solutions", logo: "/images/customers/c3.png", w: 296, h: 205 },
  { id: "watkins", name: "Watkins Wellness", logo: "/images/customers/c5.png", w: 480, h: 119 },
  { id: "pulltarps", name: "Pulltarps", logo: "/images/customers/c9.png", w: 631, h: 157 },
  { id: "amcan", name: "AMCAN Truck Parts", logo: "/images/customers/c2.png", w: 408, h: 161 },
  { id: "killion", name: "Killion Industries", logo: "/images/customers/c4.png", w: 200, h: 150 },
  { id: "jmark", name: "J-Mark Manufacturing", logo: "/images/customers/c6.png", w: 225, h: 95 },
  { id: "euramco", name: "Euramco Safety", logo: "/images/customers/c11.png", w: 563, h: 117 },
  { id: "mbarc", name: "MbarC Construction", logo: "/images/customers/c10.png", w: 430, h: 90 },
];

/** Action Powder Coating — sister company / partner (Partnership page + brochure). */
export const apc = {
  name: "Action Powder Coating",
  short: "APC",
  years: 35,
  summary:
    "Right Manufacturing and APC have partnered for 35 years, both located in the heart of San Diego's industrial complex. APC applies highly durable powder coatings that are both attractive and environmentally friendly.",
  lines: [
    { name: "Automatic conveyor line", detail: "High-volume products at cost-competitive pricing." },
    { name: "Batch application", detail: "Larger units and smaller volumes." },
  ],
  services: [
    "Sand blasting",
    "Masking",
    "Ionic multi-stage substrate wash",
    "Cerakote & powder coating",
    "Refurbishment and reclamation",
    "Assembly, finishing",
    "Laser engraving / part marking",
  ],
};

export const images = {
  hero: { src: "/images/hero-poster.jpg", alt: "Operator loading sheet stock into a CNC press brake" },
  mandrel: { src: "/images/mandrel-bender.jpg", alt: "Gloved hands setting tube in a pull-type mandrel bender", position: "50% 45%" },
  mandrelBw: { src: "/images/mandrel-bender-bw.jpg", alt: "Mandrel tube bender tooling and bend die" },
  tubeStock: { src: "/images/square-tube-stock.jpg", alt: "Stacked punched square aluminum tube", position: "50% 50%" },
  extrusions: { src: "/images/extrusions.jpg", alt: "Custom aluminum extrusions with protective film staged for processing" },
  turret: { src: "/images/turret-punch.jpg", alt: "CNC turret punch table with sheet clamps" },
  turret2: { src: "/images/turret-punch-bw-2.jpg", alt: "CNC turret punch machine bed" },
  mill: { src: "/images/cnc-mill.jpg", alt: "HAAS CNC vertical mill machining aluminum profiles under coolant", position: "50% 55%" },
  brackets: { src: "/images/formed-brackets.jpg", alt: "Formed sheet metal brackets with punched slots assembled to a frame" },
  surfacePrep: { src: "/images/surface-prep.jpg", alt: "Fabricator finishing a formed panel with an orbital sander", position: "50% 35%" },
  surfacePrepDetail: { src: "/images/surface-prep-detail.jpg", alt: "Close-up of orbital sanding on a metal panel" },
  brakeDetail: { src: "/images/press-brake-detail.jpg", alt: "Gloved hand positioning a formed part in a press brake", position: "60% 50%" },
  brakeWide: { src: "/images/press-brake-wide.jpg", alt: "Operator feeding sheet into a press brake" },
  brakeOperator: { src: "/images/press-brake-operator.jpg", alt: "Right Manufacturing operator forming a perforated sheet on a press brake", position: "35% 40%" },
  brakeOperator2: { src: "/images/press-brake-operator-2.jpg", alt: "Experienced operator aligning a part against the press brake backgauge", position: "30% 40%" },
  weldingWide: { src: "/images/welding-wide.jpg", alt: "Welder joining a fabricated tube frame", position: "85% 50%" },
  welding: { src: "/images/welding.jpg", alt: "Welder joining a fabricated tube frame" },
  powderLine: { src: "/images/powder-coat-line.jpg", alt: "Formed tube parts hanging on the APC powder coating line" },
  powderParts: { src: "/images/powder-coat-parts.jpg", alt: "Coated sheet metal parts on racks" },
  powderBooth: { src: "/images/powder-coat-booth.jpg", alt: "Powder coating technician in a spray booth" },
  powderPortrait: { src: "/images/powder-coat-portrait.jpg", alt: "Technician applying powder coat to racked parts" },
  panels: { src: "/images/formed-panels.jpg", alt: "Formed sheet metal panels with large punched openings", position: "50% 50%" },
  partDetail: { src: "/images/formed-part-detail.jpg", alt: "Black coated formed part with punched slots" },
  cartFrame: { src: "/images/cart-frame.jpg", alt: "Red coated bent tube cart frame" },
  tubePoster: { src: "/images/tube-bending-poster.jpg", alt: "Mandrel bender forming a tube" },
} satisfies Record<string, ImageRef>;
