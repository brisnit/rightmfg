import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Locale routing:
 * - "/ar/…", "/zh/…", "/nl/…" are served as-is.
 * - "/en/…" redirects to the unprefixed URL (English is canonical there).
 * - Unprefixed URLs render English, unless the visitor previously picked another
 *   language in the selector (cookie), in which case they're redirected to it.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url);
  }
  if (isLocale(first)) return NextResponse.next();

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved) && saved !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${saved}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API, Next internals and any file with an extension (images, video, icon, sitemap, robots).
  matcher: ["/((?!api|_next|.*\\.[\\w]+$).*)"],
};
