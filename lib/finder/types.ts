import type { CapabilityCategory, MarketId, MaterialId, ProductionNeed } from "@/data/types";

/**
 * Public contract of the Capability Finder.
 *
 * The UI only depends on these types. The prototype resolves them with a local
 * entity-matching engine (lib/finder/engine.ts); a production build can swap in
 * an LLM/RAG provider that returns the same shape (see lib/finder/provider.ts).
 */

export type EntityKind = "part" | "material" | "market" | "need" | "process" | "feature" | "form";

export interface DetectedEntity {
  key: string; // e.g. "mat:stainless-steel"
  kind: EntityKind;
  label: string;
  /** The user's own words that triggered it. */
  term: string;
  /** Carried over from an earlier turn in the conversation. */
  fromContext?: boolean;
}

export interface MatchReason {
  term?: string;
  text: string;
}

export interface MatchedCapability {
  id: string;
  name: string;
  category: CapabilityCategory;
  categoryLabel: string;
  score: number;
  /** 0–1 relative strength within this result. */
  strength: number;
  reasons: MatchReason[];
  evidence: string[];
  href: string;
  partner?: "APC";
}

export interface FinderFlag {
  term: string;
  level: "confirm" | "unlisted";
  message: string;
}

export interface FinderAnswer {
  title: string;
  body: string;
  bullets?: string[];
  links?: { label: string; href: string }[];
}

export interface FinderContext {
  entities: DetectedEntity[];
  terms: string[];
  turns: number;
  lastQuery?: string;
  /** The request that started the current thread (used for RFQ prefill). */
  thread?: string;
}

export interface FinderResult {
  query: string;
  mode: "match" | "answer" | "mixed" | "clarify";
  summary: string;
  described: DetectedEntity[];
  coverage?: { percent: number; matched: number; total: number };
  groups: { category: CapabilityCategory; label: string; items: MatchedCapability[] }[];
  sequence: { id: string; name: string; href: string }[];
  materials: { id: MaterialId; name: string }[];
  markets: { id: MarketId; name: string; href: string }[];
  needs: { id: ProductionNeed; label: string; detail: string }[];
  flags: FinderFlag[];
  answer?: FinderAnswer;
  followUps: string[];
  context: FinderContext;
  engine: "local-knowledge-v1" | string;
}

export interface FinderRequest {
  query: string;
  context?: FinderContext;
}
