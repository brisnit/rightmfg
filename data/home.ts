import { images } from "./company";
import type { ImageRef } from "./types";

/** Homepage capability tiles — each maps to verified sub-capabilities. */
export const capabilityTiles: { title: string; subtitle: string; href: string; image: ImageRef; subs: string[] }[] = [
  { title: "Tube", subtitle: "Mandrel & 3D bending", href: "/capabilities/tube-bending", image: images.mandrel, subs: ["Mandrel tube bending", "3D bending — tube & channel", "100+ bending dies", "Cut-off · punching · drill & mill"] },
  { title: "Sheet Metal", subtitle: "Shear · punch · press", href: "/capabilities/sheet-metal", image: images.turret, subs: ["Shearing", "CNC turret punching — 3 Wiedemann", "6 Bliss punch presses, 5–60 T", "Flat patterns & cutouts"] },
  { title: "Forming", subtitle: "CNC press brakes", href: "/capabilities/sheet-metal#processes", image: images.brakeDetail, subs: ["4 Cincinnati CNC press brakes", "60 · 90 · 135 ton", "Bends, radii & curls", "Complex multi-bend shapes"] },
  { title: "Welding", subtitle: "MIG · TIG · Spot", href: "/capabilities/welding", image: images.welding, subs: ["MIG welding", "TIG welding", "Spot welding", "Steel · stainless · aluminum"] },
  { title: "Materials", subtitle: "Sheet, tube & extrusion", href: "/materials/aluminum", image: images.extrusions, subs: ["Aluminum alloys (all)", "Stainless steel", "Carbon steel", "Consistent stocked inventory"] },
  { title: "Hardware", subtitle: "Installed & checked", href: "/capabilities/assembly", image: images.brackets, subs: ["Fasteners", "Hinges & latches", "Brackets & mounts", "Alignment checked before delivery"] },
  { title: "Assembly", subtitle: "Mid & high level", href: "/capabilities/assembly", image: images.surfacePrep, subs: ["Component integration", "Mid- & high-level assembly", "Packaging", "Logistics"] },
  { title: "Machining", subtitle: "CNC vertical milling", href: "/capabilities/assembly#equipment", image: images.mill, subs: ["3 HAAS CNC vertical mills", "Machined features on formed parts", "Extrusion machining", "Tube drill & mill"] },
];
