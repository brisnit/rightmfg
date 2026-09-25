"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { LOCALE_COOKIE, localeMeta, locales, localizeHref, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Check, ChevronDown, Globe } from "@/components/ui/Icons";

function hrefFor(l: Locale, pathname: string) {
  return localizeHref(l, pathname);
}

/** Remember the choice and carry over query/hash (e.g. an RFQ prefill) to the new language. */
function choose(e: ReactMouseEvent<HTMLAnchorElement>, l: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
  const suffix = window.location.search + window.location.hash;
  if (suffix) {
    e.preventDefault();
    window.location.assign(e.currentTarget.getAttribute("href") + suffix);
  }
}

/**
 * Header language menu: a disclosure button over real links, so each option is
 * crawlable (hreflang) and works without JS. The choice is remembered in a cookie.
 */
export function LanguageSelector() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${dict.nav.languageSelect}: ${localeMeta[locale].native}`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 items-center gap-1.5 px-2.5 text-white/80 transition-colors hover:text-white"
      >
        <Globe size={18} />
        <span className="label text-[0.72rem]">{localeMeta[locale].short}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={id} hidden={!open} className="absolute end-0 top-full z-[60] mt-2 w-64 border border-white/15 bg-ink shadow-[0_24px_48px_-12px_rgb(0_0_0/0.5)]">
        <p className="label border-b border-white/10 px-4 py-3 text-[0.66rem] text-gray">{dict.nav.language}</p>
        <ul>
          {locales.map((l) => {
            const m = localeMeta[l];
            const current = l === locale;
            return (
              <li key={l}>
                <a
                  href={hrefFor(l, pathname)}
                  hrefLang={m.htmlLang}
                  lang={m.htmlLang}
                  aria-current={current ? "true" : undefined}
                  onClick={(e) => choose(e, l)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-white/5 ${current ? "text-white" : "text-white/75"}`}
                >
                  <span>
                    <span className="block text-[1rem]" dir={m.dir}>
                      {m.native}
                    </span>
                    <span className="label mt-0.5 block text-[0.62rem] text-gray" lang="en" dir="ltr">
                      {m.label}
                    </span>
                  </span>
                  {current && <Check size={16} className="text-blue-bright" />}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Compact row for the mobile drawer. */
export function LanguageRow() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  return (
    <nav aria-label={dict.nav.language}>
      <p className="label text-[0.66rem] text-gray">{dict.nav.language}</p>
      <ul className="mt-2 grid grid-cols-2 gap-2">
        {locales.map((l) => {
          const m = localeMeta[l];
          const current = l === locale;
          return (
            <li key={l}>
              <a
                href={hrefFor(l, pathname)}
                hrefLang={m.htmlLang}
                lang={m.htmlLang}
                aria-current={current ? "true" : undefined}
                onClick={(e) => choose(e, l)}
                className={`flex h-12 items-center justify-center border px-3 text-[0.95rem] ${current ? "border-blue-bright text-white" : "border-white/15 text-white/75"}`}
              >
                {m.native}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
