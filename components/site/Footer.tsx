"use client";

import Link from "@/components/ui/LocaleLink";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight } from "@/components/ui/Icons";
import { useI18n } from "@/components/i18n/I18nProvider";
import { t } from "@/lib/i18n/format";

export function Footer() {
  const { dict, content } = useI18n();
  const f = dict.footer;
  const c = content.company;
  return (
    <footer className="brushed relative bg-ink text-white">
      <div className="container-x">
        <div className="grid gap-12 border-b border-white/10 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm leading-relaxed text-white/65">{f.blurb}</p>
            <address className="mt-8 space-y-1 not-italic text-white/80" dir="ltr" style={{ textAlign: "start" }}>
              <p>{c.legalName}</p>
              <p>{c.address.street}</p>
              <p>
                {c.address.city}, {c.address.region} {c.address.postal}
              </p>
            </address>
            <div className="mt-6 space-y-1" dir="ltr">
              <a href={c.phoneHref} className="block text-white hover:text-blue-bright">
                <span className="label me-3 text-gray">T</span>
                {c.phone}
              </a>
              <a href={`mailto:${c.email}`} className="block text-white hover:text-blue-bright">
                <span className="label me-3 text-gray">E</span>
                {c.email}
              </a>
              <p className="text-white/60">
                <span className="label me-3 text-gray">F</span>
                {c.fax}
              </p>
            </div>
          </div>

          <nav aria-label={dict.a11y.footer} className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            <div>
              <p className="label text-blue-bright">{dict.common.capabilities}</p>
              <ul className="mt-4 space-y-2.5">
                {content.services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/capabilities/${s.id}`} className="text-[0.95rem] text-white/70 hover:text-white">
                      {s.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/capability-finder" className="text-[0.95rem] text-white/70 hover:text-white">
                    {f.finder}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="label text-blue-bright">{dict.common.markets}</p>
              <ul className="mt-4 space-y-2.5">
                {content.markets.map((m) => (
                  <li key={m.id}>
                    <Link href={`/markets/${m.id}`} className="text-[0.95rem] text-white/70 hover:text-white">
                      {m.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-blue-bright">{dict.common.materials}</p>
              <ul className="mt-4 space-y-2.5">
                {content.materials.map((m) => (
                  <li key={m.id}>
                    <Link href={`/materials/${m.id}`} className="text-[0.95rem] text-white/70 hover:text-white">
                      {m.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-blue-bright">{f.company}</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  [dict.common.about, "/about"],
                  [f.whyRight, "/about#why-right"],
                  [f.finishingApc, "/capabilities/finishing"],
                  [f.resourcesFaqs, "/resources"],
                  [dict.common.startProject, "/start-a-project"],
                ].map(([l, h]) => (
                  <li key={h}>
                    <Link href={h} className="text-[0.95rem] text-white/70 hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-[0.68rem] text-white/45">{t(f.copyright, { year: new Date().getFullYear() })}</p>
          <Link href="/start-a-project" className="label inline-flex items-center gap-2 text-white hover:text-blue-bright">
            {f.drawingCta} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
