import { Button } from "@/components/ui/Button";
import { CompactFinder } from "@/components/finder/CompactFinder";
import { preload } from "react-dom";
import { HeroVideo } from "./HeroVideo";
import { getI18n } from "@/lib/i18n/server";

export async function Hero() {
  const { dict, content } = await getI18n();
  const h = dict.hero;
  preload("/images/hero-poster.jpg", { as: "image", fetchPriority: "high" });
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white">
      <HeroVideo
        poster="/images/hero-poster.jpg"
        src="/video/hero-press-brake-1080.mp4"
        srcMobile="/video/hero-press-brake-540.mp4"
        label={h.videoLabel}
      />
      {/* Grade: left-weighted for legibility, bottom fade into the page */}
      <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-ink/95 via-ink/70 to-ink/20" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/40" aria-hidden />
      <div className="blueprint absolute inset-0 opacity-60 [mask-image:linear-gradient(to_right,black,transparent_70%)] rtl:[mask-image:linear-gradient(to_left,black,transparent_70%)]" aria-hidden />

      {/* Engineering annotation */}
      <div className="pointer-events-none absolute end-4 top-28 hidden text-end lg:end-12 lg:block" aria-hidden>
        <p className="label text-[0.66rem] text-white/55">{h.onTheFloor}</p>
        <p className="label mt-1 text-[0.66rem] text-white">{h.floorProcess}</p>
        <div className="ms-auto mt-3 h-px w-24 bg-white/40" />
      </div>

      <div className="container-x relative z-10 flex flex-1 flex-col justify-end pb-24 pt-32 sm:pb-24 lg:pb-28 lg:pt-40">
        <p className="label rise flex items-center gap-3 text-white/80">
          <span className="h-px w-8 bg-blue-bright" aria-hidden />
          {h.eyebrowCompany} <span className="text-white/35">/</span> {h.eyebrowPlace}
        </p>
        <h1 id="hero-title" className="display rise mt-6 text-[clamp(1.7rem,8vw,6rem)]" style={{ ["--d" as string]: "80ms" }}>
          <span className="block">{h.line1}</span>
          <span className="block text-gray">{h.line2}</span>
        </h1>
        <div className="mt-8 grid items-end gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-6 xl:col-span-7">
            <p className="rise max-w-xl text-[1.05rem] leading-relaxed text-white/80 sm:text-lg" style={{ ["--d" as string]: "160ms" }}>
              {h.body}
            </p>
            <div className="rise mt-8 flex flex-col gap-3 xs:flex-row" style={{ ["--d" as string]: "240ms" }}>
              <Button href="/start-a-project">{dict.common.startProject}</Button>
              <Button href="/capabilities" variant="ghost-light">
                {dict.common.exploreCapabilities}
              </Button>
            </div>
          </div>

          <div className="rise min-w-0 lg:col-span-6 xl:col-span-5" style={{ ["--d" as string]: "340ms" }}>
            <div className="border border-white/15 bg-ink/75 p-5 sm:p-6">
              <CompactFinder id="hero-finder" suggestions={content.suggestedSearches} />
              <p className="label mt-4 text-[0.66rem] text-white/45">{h.finderNote}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spec strip */}
      <div className="relative z-10 border-t border-white/10 bg-ink/60">
        <dl className="container-x grid grid-cols-2 sm:grid-cols-4">
          {[
            [h.specFounded, h.specFoundedValue],
            [h.specFacility, h.specFacilityValue],
            [h.specRange, h.specRangeValue],
            [h.specRush, h.specRushValue],
          ].map(([k, v], i) => (
            <div key={k} className={`py-4 pe-4 ${i % 2 ? "ps-4 sm:ps-6" : "sm:ps-6"} ${i === 0 ? "sm:ps-0" : ""} border-white/10 ${i > 0 ? "sm:border-s" : ""} ${i % 2 ? "border-s" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""}`}>
              <dt className="label text-[0.66rem] text-white/50">{k}</dt>
              <dd className="label mt-1 text-[0.72rem] text-white">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
