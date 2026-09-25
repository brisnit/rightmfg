import { runFinder } from "./engine";
import type { FinderRequest, FinderResult } from "./types";

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
export async function askFinder(req: FinderRequest): Promise<FinderResult> {
  if (process.env.NEXT_PUBLIC_FINDER_MODE === "api") {
    const res = await fetch("/api/capability-finder", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`Finder request failed: ${res.status}`);
    return res.json();
  }
  return runFinder(req);
}
