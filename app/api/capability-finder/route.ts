import { runFinder } from "@/lib/finder/engine";
import type { FinderRequest } from "@/lib/finder/types";

/**
 * POST /api/capability-finder
 * Body: { query: string, context?: FinderContext }  →  FinderResult
 *
 * Today this wraps the local knowledge engine. Replace the body of this handler
 * with retrieval + LLM generation to upgrade the Finder without touching the UI.
 */
export async function POST(request: Request) {
  let body: FinderRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body?.query !== "string" || !body.query.trim()) {
    return Response.json({ error: "query is required" }, { status: 400 });
  }
  return Response.json(runFinder({ query: body.query, context: body.context }));
}
