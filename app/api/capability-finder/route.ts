import { runFinder } from "@/lib/finder/engine";
import { loadFinderText } from "@/lib/finder/provider";
import { isLocale } from "@/lib/i18n/config";
import { getContent } from "@/lib/i18n/registry";
import type { FinderRequest } from "@/lib/finder/types";

/**
 * POST /api/capability-finder
 * Body: { query: string, context?: FinderContext, locale?: "en" | "ar" | "zh" | "nl" }  →  FinderResult
 *
 * Today this wraps the local knowledge engine. Replace the body of this handler
 * with retrieval + LLM generation to upgrade the Finder without touching the UI.
 */
export async function POST(request: Request) {
  let body: FinderRequest & { locale?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body?.query !== "string" || !body.query.trim()) {
    return Response.json({ error: "query is required" }, { status: 400 });
  }
  const locale = isLocale(body.locale) ? body.locale : "en";
  const text = await loadFinderText(locale);
  return Response.json(runFinder({ query: body.query, context: body.context }, { locale, content: getContent(locale), text }));
}
