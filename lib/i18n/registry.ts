import type { Locale } from "./config";
import { buildContent, type SiteContent } from "./content";
import type { Dict } from "./locales/en/dict";
import { dict as en } from "./locales/en/dict";
import { dict as ar } from "./locales/ar/dict";
import { dict as zh } from "./locales/zh/dict";
import { dict as nl } from "./locales/nl/dict";
import { content as enC } from "./locales/en/content";
import { content as arC } from "./locales/ar/content";
import { content as zhC } from "./locales/zh/content";
import { content as nlC } from "./locales/nl/content";

export const dicts: Record<Locale, Dict> = { en, ar, zh, nl };
const texts = { en: enC, ar: arC, zh: zhC, nl: nlC };
const cache = new Map<Locale, SiteContent>();

export function getContent(locale: Locale): SiteContent {
  let c = cache.get(locale);
  if (!c) {
    c = buildContent(texts[locale]);
    cache.set(locale, c);
  }
  return c;
}
