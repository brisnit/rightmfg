/** Navigation structure. Mega-menu entries map to verified capabilities only. */
export const capabilityMenu = [
  {
    title: "Forming",
    links: [
      { label: "Tube bending", href: "/capabilities/tube-bending" },
      { label: "3D bending — tube & channel", href: "/capabilities/tube-bending#processes" },
      { label: "Sheet metal", href: "/capabilities/sheet-metal" },
      { label: "CNC press brake forming", href: "/capabilities/sheet-metal#processes" },
      { label: "CNC turret punching", href: "/capabilities/sheet-metal#equipment" },
    ],
  },
  {
    title: "Joining",
    links: [
      { label: "MIG welding", href: "/capabilities/welding" },
      { label: "TIG welding", href: "/capabilities/welding" },
      { label: "Spot welding", href: "/capabilities/welding" },
    ],
  },
  {
    title: "Materials",
    links: [
      { label: "Aluminum alloys", href: "/materials/aluminum" },
      { label: "Stainless steel", href: "/materials/stainless-steel" },
      { label: "Carbon steel", href: "/materials/carbon-steel" },
    ],
  },
  {
    title: "Secondary",
    links: [
      { label: "Hardware installation", href: "/capabilities/assembly" },
      { label: "Assembly", href: "/capabilities/assembly" },
      { label: "CNC machining", href: "/capabilities/assembly#equipment" },
      { label: "Packaging & logistics", href: "/capabilities/assembly" },
      { label: "Finishing — with APC", href: "/capabilities/finishing" },
    ],
  },
];

export const primaryNav = [
  { label: "Capabilities", href: "/capabilities", menu: "capabilities" as const },
  { label: "Markets", href: "/markets", menu: "markets" as const },
  { label: "Why Right", href: "/about#why-right" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
];
