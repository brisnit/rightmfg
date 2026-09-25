import { lang } from "next/root-params";
import { isLocale, localeMeta, type Locale } from "./config";
import { dicts, getContent } from "./registry";

/** Resolve the active locale in Server Components (no prop drilling). */
export async function getLocale(): Promise<Locale> {
  const l = await lang();
  return isLocale(l) ? l : "en";
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, meta: localeMeta[locale], dict: dicts[locale], content: getContent(locale) };
}
