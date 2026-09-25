"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FinderPanel } from "@/components/finder/FinderPanel";
import { exampleQuestions } from "@/data/finder-knowledge";
import { Reticle } from "@/components/ui/Icons";

function Panel() {
  const q = useSearchParams().get("q") ?? undefined;
  return <FinderPanel listen scrollTargetId="finder-top" initialQuery={q} suggestions={exampleQuestions.slice(0, 6)} autoFocus={!q} />;
}

export function FinderPage({ counts }: { counts: { capabilities: number; materials: number; markets: number } }) {
  return (
    <div className="blueprint min-h-screen bg-navy text-white">
      <div id="finder-top" className="container-x scroll-mt-20 pb-24 pt-28 lg:pt-36">
        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="label flex items-center gap-2 text-blue-bright">
              <Reticle size={16} /> Capability Finder
            </p>
            <h1 className="display mt-5 text-[clamp(2.4rem,7vw,6rem)]">
              Can Right
              <br />
              <span className="text-gray">build it?</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="leading-relaxed text-white/75">
              Describe the part, material or challenge in your own words. The Finder identifies parts, materials, features, markets and production stage, then matches them to Right&apos;s published capabilities and explains each match.
            </p>
            <dl className="mt-6 grid grid-cols-3 border-t border-white/10 pt-4">
              {[
                [counts.capabilities, "Capabilities"],
                [counts.materials, "Material families"],
                [counts.markets, "Markets"],
              ].map(([v, l]) => (
                <div key={l as string}>
                  <dt className="label text-[0.6rem] text-gray">{l}</dt>
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
            How the Capability Finder works
          </h2>
          {[
            ["01", "Understands the request", "Reads the part type, material, features like bends, welds, holes and hardware, the market and the quantity, and remembers them for follow-up questions."],
            ["02", "Matches verified data", "Scores every published capability and explains each point. Equipment, materials and processes come only from Right's own records."],
            ["03", "Says what it doesn't know", "Tolerances, certifications and unlisted processes are flagged for an engineer to confirm, never guessed."],
          ].map(([n, t, b]) => (
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
