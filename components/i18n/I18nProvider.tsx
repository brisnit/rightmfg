"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/locales/en/dict";
import type { SiteContent } from "@/lib/i18n/content";

interface I18n {
  locale: Locale;
  dict: Dict;
  content: SiteContent;
}

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ value, children }: { value: I18n; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}
