"use client";

import Link from "@/components/ui/LocaleLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight, ChevronDown, Close, Menu, Minus, Plus, Reticle, Search } from "@/components/ui/Icons";
import { primaryNav } from "@/data/navigation";
import { openFinderDialog } from "@/lib/finder/events";
import { stripLocale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/format";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LanguageRow, LanguageSelector } from "./LanguageSelector";

type MenuId = "capabilities" | "markets" | null;

export function Header() {
  const { dict, content } = useI18n();
  const d = dict.nav;
  const rawPath = usePathname();
  const pathname = stripLocale(rawPath);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>("capabilities");
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const navLabel: Record<string, string> = { Capabilities: d.capabilities, Markets: d.markets, "Why Right": d.whyRight, About: d.about, Resources: d.resources };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation (adjust state during render rather than in an effect).
  const [prevPath, setPrevPath] = useState(rawPath);
  if (rawPath !== prevPath) {
    setPrevPath(rawPath);
    setMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMenu = (id: MenuId) => {
    clearTimeout(closeTimer.current);
    setMenu(id);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };

  const solid = scrolled || menu !== null || mobileOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? "border-b border-white/10 bg-ink" : "border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent"}`}
      onMouseLeave={scheduleClose}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <Logo preload />

        <nav aria-label={dict.a11y.primary} className="hidden lg:block">
          <ul className="flex items-center">
            {primaryNav.map((item) => {
              const base = item.href.split("#")[0];
              const active = !item.href.includes("#") && (pathname === base || (base !== "/" && pathname.startsWith(base)));
              const label = navLabel[item.label] ?? item.label;
              if (item.menu) {
                const open = menu === item.menu;
                return (
                  <li key={item.label} onMouseEnter={() => openMenu(item.menu)}>
                    <div className="flex items-center">
                      <Link href={item.href} className={`label px-3 py-3 text-[0.78rem] transition-colors xl:px-4 ${active || open ? "text-white" : "text-white/75 hover:text-white"}`}>
                        {label}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`menu-${item.menu}`}
                        aria-label={t(open ? d.closeSubmenu : d.openSubmenu, { name: label })}
                        onClick={() => setMenu(open ? null : item.menu)}
                        className="-ms-2 flex h-8 w-6 items-center justify-center text-white/60 hover:text-white"
                      >
                        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </li>
                );
              }
              return (
                <li key={item.label} onMouseEnter={() => openMenu(null)}>
                  <Link href={item.href} className={`label px-3 py-3 text-[0.78rem] transition-colors xl:px-4 ${active ? "text-white" : "text-white/75 hover:text-white"}`}>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <button type="button" onClick={() => openFinderDialog()} className="flex h-11 items-center gap-2 px-2.5 text-white/80 transition-colors hover:text-white" aria-label={d.searchLabel}>
            <Search size={19} />
            <span className="label hidden text-[0.68rem] text-white/45 xl:inline" dir="ltr">
              ⌘K
            </span>
          </button>
          <Link href="/start-a-project" className="label ms-1 hidden h-11 items-center gap-3 bg-blue px-5 text-[0.76rem] text-white transition-colors hover:bg-blue-600 sm:inline-flex">
            {dict.common.startProject} <ArrowRight size={15} />
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-white lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? d.closeMenu : d.openMenu}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <Close size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Capabilities mega menu */}
      <div id="menu-capabilities" hidden={menu !== "capabilities"} onMouseEnter={() => openMenu("capabilities")} className="absolute inset-x-0 top-full hidden border-b border-white/10 bg-ink lg:block">
        <div className="container-x grid grid-cols-12 gap-8 py-10">
          <div className="col-span-8 grid grid-cols-4 gap-8">
            {content.capabilityMenu.map((col) => (
              <div key={col.title}>
                <p className="label border-b border-white/15 pb-3 text-blue-bright">{col.title}</p>
                <ul className="mt-3 space-y-0.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="block py-1.5 text-[0.95rem] text-white/80 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link href="/capabilities" className="label col-span-4 inline-flex items-center gap-2 text-white/70 hover:text-white">
              {d.allCapabilities} <ArrowRight size={14} />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => {
              setMenu(null);
              openFinderDialog();
            }}
            className="group relative col-span-4 flex min-h-56 flex-col justify-end overflow-hidden border border-white/10 p-6 text-start"
          >
            <Image src={content.images.mandrel.src} alt="" fill sizes="30vw" className="object-cover opacity-45 transition-transform duration-700 group-hover:scale-[1.03]" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
            <span className="relative">
              <span className="label flex items-center gap-2 text-blue-bright">
                <Reticle size={16} /> {d.finderEyebrow}
              </span>
              <span className="heading mt-2 block text-2xl uppercase text-white">{d.finderTitle}</span>
              <span className="mt-2 block text-sm text-white/70">{d.finderBody}</span>
            </span>
          </button>
        </div>
      </div>

      {/* Markets menu */}
      <div id="menu-markets" hidden={menu !== "markets"} onMouseEnter={() => openMenu("markets")} className="absolute inset-x-0 top-full hidden border-b border-white/10 bg-ink lg:block">
        <div className="container-x grid grid-cols-6 gap-px bg-white/10 py-px">
          {content.markets.map((m) => (
            <Link key={m.id} href={`/markets/${m.id}`} className="group relative flex h-44 flex-col justify-end overflow-hidden bg-ink p-5">
              <Image src={m.image.src} alt="" fill sizes="16vw" className="object-cover opacity-35 photo-grade transition-[transform,opacity] duration-700 group-hover:scale-[1.03] group-hover:opacity-50" />
              <span className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
              <span className="heading relative text-lg uppercase text-white">{m.short}</span>
              <span className="label relative mt-1 flex items-center gap-1 text-[0.66rem] text-white/60 group-hover:text-white">
                {d.explore} <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile drawer */}
      <div id="mobile-nav" hidden={!mobileOpen} className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto overscroll-contain bg-ink lg:hidden">
        <div className="container-x flex min-h-full flex-col py-5">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openFinderDialog();
            }}
            className="flex h-14 items-center gap-3 border border-white/20 px-4 text-start text-white/70"
          >
            <Reticle size={20} className="text-blue-bright" />
            <span className="flex-1">{d.mobileAsk}</span>
            <ArrowRight size={18} />
          </button>

          <nav aria-label={dict.a11y.mobile} className="mt-4">
            <ul className="border-t border-white/10">
              {[
                { id: "capabilities", label: d.capabilities },
                { id: "markets", label: d.markets },
              ].map((sec) => {
                const open = mobileSection === sec.id;
                return (
                  <li key={sec.id} className="border-b border-white/10">
                    <button type="button" className="flex w-full items-center justify-between py-5 text-start" aria-expanded={open} onClick={() => setMobileSection(open ? null : sec.id)}>
                      <span className="heading text-2xl uppercase text-white">{sec.label}</span>
                      {open ? <Minus size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
                    </button>
                    {open && sec.id === "capabilities" && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-6">
                        {content.capabilityMenu.map((col) => (
                          <div key={col.title}>
                            <p className="label text-blue-bright">{col.title}</p>
                            <ul className="mt-2">
                              {col.links.map((l) => (
                                <li key={l.label}>
                                  <Link href={l.href} className="block py-2 text-[0.95rem] text-white/80">
                                    {l.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <Link href="/capabilities" className="label col-span-2 flex items-center gap-2 text-white">
                          {d.allCapabilitiesShort} <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                    {open && sec.id === "markets" && (
                      <ul className="grid grid-cols-2 gap-2 pb-6">
                        {content.markets.map((m) => (
                          <li key={m.id}>
                            <Link href={`/markets/${m.id}`} className="block border border-white/10 px-3 py-3 text-[0.95rem] text-white/85">
                              {m.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              {primaryNav
                .filter((n) => !n.menu)
                .map((n) => (
                  <li key={n.label} className="border-b border-white/10">
                    <Link href={n.href} className="heading block py-5 text-2xl uppercase text-white">
                      {navLabel[n.label] ?? n.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="mt-8">
            <LanguageRow />
          </div>

          <div className="mt-auto space-y-3 pt-8">
            <Link href="/start-a-project" className="label flex h-14 items-center justify-center gap-3 bg-blue text-white">
              {dict.common.startProject} <ArrowRight size={16} />
            </Link>
            <a href={content.company.phoneHref} className="label flex h-14 items-center justify-center border border-white/20 text-white">
              {t(d.callNumber, { phone: content.company.phone })}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
