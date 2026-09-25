/**
 * Shared types for the Right Manufacturing knowledge base.
 *
 * Every fact in /data is sourced from rightmfg.com or the RIGHT/APC brochure.
 * The Capability Finder, the Capabilities Explorer and every page read from
 * these structures — nothing capability-related is hardcoded in components.
 */

export type CapabilityCategory =
  | "tube"
  | "sheet-metal"
  | "joining"
  | "secondary"
  | "finishing"
  | "engineering";

export type ProductionNeed = "prototype" | "rush" | "low-volume" | "production";

export type MaterialId = "aluminum" | "stainless-steel" | "carbon-steel";

export type MarketId =
  | "medical"
  | "automotive"
  | "military"
  | "industrial"
  | "architectural"
  | "decorative";

export interface Capability {
  id: string;
  name: string;
  category: CapabilityCategory;
  /** Service page this capability lives on, e.g. "tube-bending". */
  service: ServiceId;
  /** One-line, plain description. */
  description: string;
  /** Verified equipment / process facts used in Finder explanations. */
  evidence: string[];
  /** Words and phrases that directly indicate this capability. */
  keywords: string[];
  /** Looser language customers use for the same thing. */
  synonyms: string[];
  /** Example requests that should surface this capability. */
  searchTerms: string[];
  materials: MaterialId[];
  markets: MarketId[];
  needs: ProductionNeed[];
  relatedCapabilities: string[];
  applications: string[];
  /** Performed by a partner rather than in Right's own facility. */
  partner?: "APC";
}

export type ServiceId =
  | "tube-bending"
  | "sheet-metal"
  | "welding"
  | "assembly"
  | "machining"
  | "finishing"
  | "engineering";

export interface Service {
  id: ServiceId;
  name: string;
  eyebrow: string;
  headline: [string, string];
  summary: string;
  overview: string[];
  image: ImageRef;
  gallery: ImageRef[];
  video?: { src: string; poster: string };
  equipment: { label: string; value: string }[];
  specs: { label: string; items: string[] }[];
  capabilityIds: string[];
  materials: MaterialId[];
  markets: MarketId[];
  questions: string[];
  faqs: Faq[];
  partner?: "APC";
}

export interface Material {
  id: MaterialId;
  name: string;
  short: string;
  description: string;
  keywords: string[];
  synonyms: string[];
  processes: string[];
  considerations: string[];
  image: ImageRef;
}

export interface Market {
  id: MarketId;
  name: string;
  short: string;
  headline: string;
  summary: string;
  why: string;
  /** Verified statements from Right's own market copy. */
  sourceNotes: string[];
  applications: string[];
  capabilityIds: string[];
  keywords: string[];
  image: ImageRef;
  customerIds?: string[];
}

export interface ImageRef {
  src: string;
  alt: string;
  /** CSS object-position for intentional crops. */
  position?: string;
}

export interface Faq {
  q: string;
  a: string;
}
