"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FinderPanel } from "@/components/finder/FinderPanel";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Reticle } from "@/components/ui/Icons";

function Panel() {
  const q = useSearchParams().get("q") ?? undefined;
  const { content } = useI18n();
  return <FinderPanel listen scrollTargetId="finder-top" initialQuery={q} suggestions={content.exampleQuestions.slice(0, 6)} autoFocus={!q} />;
}

export function FinderPage({ counts }: { counts: { capabilities: number; materials: number; markets: number } }) {
  const { dict } = useI18n();
  const d = dict.finderPage;
  return (
    <div className="blueprint min-h-screen bg-navy text-white">
      <div id="finder-top" className="container-x scroll-mt-20 pb-24 pt-28 lg:pt-36">
        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="label flex items-center gap-2 text-blue-bright">
              <Reticle size={16} /> {dict.finder.dialogTitle}
            </p>
            <h1 className="display mt-5 text-[clamp(2.4rem,7vw,6rem)]">
              {d.title1}
              <br />
              <span className="text-gray">{d.title2}</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="leading-relaxed text-white/75">
              {d.intro}
            </p>
            <dl className="mt-6 grid grid-cols-3 border-t border-white/10 pt-4">
              {[
                [counts.capabilities, d.countCapabilities],
                [counts.materials, d.countMaterials],
                [counts.markets, d.countMarkets],
              ].map(([v, l]) => (
                <div key={l as string}>
                  <dt className="label text-[0.6rem] text-gray hyphens-auto [overflow-wrap:anywhere]">{l}</dt>
                  <dd className="display mt-1 text-3xl">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-10">
          <Suspense>
            <Panel />
          </Suspense>
        </div>

        <section aria-labelledby="how" className="mt-24 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          <h2 id="how" className="sr-only">
            {d.howTitle}
          </h2>
          {d.how.map((h, i) => [String(i + 1).padStart(2, "0"), h.t, h.b]).map(([n, t, b]) => (
            <div key={n} className="bg-navy p-6 lg:p-8">
              <p className="label text-blue-bright">{n}</p>
              <p className="heading mt-3 text-xl uppercase">{t}</p>
              <p className="mt-3 leading-relaxed text-white/70">{b}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
