/** Locale configuration. English (US) is the default and lives at unprefixed URLs. */
export const locales = ["en", "ar", "zh", "nl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeMeta: Record<Locale, { label: string; native: string; short: string; htmlLang: string; dir: "ltr" | "rtl"; ogLocale: string }> = {
  en: { label: "English (USA)", native: "English (US)", short: "EN", htmlLang: "en-US", dir: "ltr", ogLocale: "en_US" },
  ar: { label: "Arabic", native: "العربية", short: "ع", htmlLang: "ar", dir: "rtl", ogLocale: "ar_AR" },
  zh: { label: "Chinese (Simplified)", native: "简体中文", short: "中文", htmlLang: "zh-Hans", dir: "ltr", ogLocale: "zh_CN" },
  nl: { label: "Dutch", native: "Nederlands", short: "NL", htmlLang: "nl", dir: "ltr", ogLocale: "nl_NL" },
};

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && (locales as readonly string[]).includes(v);
}

/** Strip a locale prefix from a pathname: "/ar/markets" → "/markets". */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (isLocale(seg)) {
    const rest = pathname.slice(seg.length + 1);
    return rest === "" ? "/" : rest;
  }
  return pathname || "/";
}

/** Localize an internal href. External, hash-only, file and API links pass through. */
export function localizeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/api/") || /\.[a-z0-9]{2,5}($|[?#])/i.test(href.split("?")[0])) return href;
  const [path, suffix = ""] = splitSuffix(href);
  const bare = stripLocale(path);
  if (locale === defaultLocale) return bare + suffix;
  return (bare === "/" ? `/${locale}` : `/${locale}${bare}`) + suffix;
}

function splitSuffix(href: string): [string, string] {
  const i = href.search(/[?#]/);
  return i === -1 ? [href, ""] : [href.slice(0, i), href.slice(i)];
}

export const SITE_URL = "https://www.rightmfg.com";

/** Canonical + hreflang alternates for a locale-neutral path. */
export function alternatesFor(locale: Locale, path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].htmlLang] = localizeHref(l, path);
  languages["x-default"] = localizeHref(defaultLocale, path);
  return { canonical: localizeHref(locale, path), languages };
}
