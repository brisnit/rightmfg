import type { Locale } from "@/lib/i18n/config";
import type { SiteContent } from "@/lib/i18n/content";
import type { FinderText } from "./finder-en";
import { runFinder } from "./engine";
import type { FinderRequest, FinderResult } from "./types";

/** Finder vocabulary/text per locale, code-split so only the active language loads. */
export function loadFinderText(locale: Locale): Promise<FinderText> {
  switch (locale) {
    case "ar":
      return import("@/lib/i18n/locales/ar/finder").then((m) => m.finder);
    case "zh":
      return import("@/lib/i18n/locales/zh/finder").then((m) => m.finder);
    case "nl":
      return import("@/lib/i18n/locales/nl/finder").then((m) => m.finder);
    default:
      return import("@/lib/i18n/locales/en/finder").then((m) => m.finder);
  }
}

/**
 * Swap point for the Capability Finder.
 *
 *   NEXT_PUBLIC_FINDER_MODE=local (default)  → runs the knowledge engine in the browser
 *   NEXT_PUBLIC_FINDER_MODE=api              → POSTs to /api/capability-finder
 *
 * To move to an LLM/RAG implementation, change the API route to retrieve from
 * /data (capabilities, materials, markets, services, faqs), call the model with a
 * strict JSON schema matching FinderResult, and set the mode to "api".
 * The UI doesn't change.
 */
export async function askFinder(req: FinderRequest, locale: Locale, content: SiteContent): Promise<FinderResult> {
  if (process.env.NEXT_PUBLIC_FINDER_MODE === "api") {
    const res = await fetch("/api/capability-finder", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...req, locale }),
    });
    if (!res.ok) throw new Error(`Finder request failed: ${res.status}`);
    return res.json();
  }
  const text = await loadFinderText(locale);
  return runFinder(req, { locale, content, text });
}
