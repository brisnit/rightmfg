import { Button } from "@/components/ui/Button";
import { CompactFinder } from "@/components/finder/CompactFinder";
import { suggestedSearches } from "@/data/finder-knowledge";
import { preload } from "react-dom";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  preload("/images/hero-poster.jpg", { as: "image", fetchPriority: "high" });
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white">
      <HeroVideo
        poster="/images/hero-poster.jpg"
        src="/video/hero-press-brake-1080.mp4"
        srcMobile="/video/hero-press-brake-540.mp4"
        label="CNC press brake forming at Right Manufacturing"
      />
      {/* Grade: left-weighted for legibility, bottom fade into the page */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/20" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/40" aria-hidden />
      <div className="blueprint absolute inset-0 opacity-60 [mask-image:linear-gradient(to_right,black,transparent_70%)]" aria-hidden />

      {/* Engineering annotation */}
      <div className="pointer-events-none absolute right-4 top-28 hidden text-right lg:right-12 lg:block" aria-hidden>
        <p className="label text-[0.66rem] text-white/55">On the floor</p>
        <p className="label mt-1 text-[0.66rem] text-white">CNC press brake forming</p>
        <div className="ml-auto mt-3 h-px w-24 bg-white/40" />
      </div>

      <div className="container-x relative z-10 flex flex-1 flex-col justify-end pb-24 pt-32 sm:pb-24 lg:pb-28 lg:pt-40">
        <p className="label rise flex items-center gap-3 text-white/80">
          <span className="h-px w-8 bg-blue-bright" aria-hidden />
          Right Manufacturing <span className="text-white/35">/</span> San Diego, CA
        </p>
        <h1 id="hero-title" className="display rise mt-6 text-[clamp(1.7rem,8vw,6rem)]" style={{ ["--d" as string]: "80ms" }}>
          <span className="block">Precision manufacturing.</span>
          <span className="block text-gray">Built around your product.</span>
        </h1>
        <div className="mt-8 grid items-end gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-6 xl:col-span-7">
            <p className="rise max-w-xl text-[1.05rem] leading-relaxed text-white/80 sm:text-lg" style={{ ["--d" as string]: "160ms" }}>
              From prototype to production, Right Manufacturing bends tube, forms sheet metal, and welds and assembles components for demanding OEM applications.
            </p>
            <div className="rise mt-8 flex flex-col gap-3 xs:flex-row" style={{ ["--d" as string]: "240ms" }}>
              <Button href="/start-a-project">Start a project</Button>
              <Button href="/capabilities" variant="ghost-light">
                Explore capabilities
              </Button>
            </div>
          </div>

          <div className="rise min-w-0 lg:col-span-6 xl:col-span-5" style={{ ["--d" as string]: "340ms" }}>
            <div className="border border-white/15 bg-ink/75 p-5 sm:p-6">
              <CompactFinder id="hero-finder" suggestions={suggestedSearches} />
              <p className="label mt-4 text-[0.66rem] text-white/45">Capability Finder · matched against Right&apos;s published capabilities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spec strip */}
      <div className="relative z-10 border-t border-white/10 bg-ink/60">
        <dl className="container-x grid grid-cols-2 sm:grid-cols-4">
          {[
            ["Founded", "1990s · San Diego"],
            ["Facility", "20,000 sq. ft."],
            ["Range", "Prototype → production"],
            ["Rush", "48-hr select prototypes"],
          ].map(([k, v], i) => (
            <div key={k} className={`py-4 pr-4 ${i % 2 ? "pl-4 sm:pl-6" : "sm:pl-6"} ${i === 0 ? "sm:pl-0" : ""} border-white/10 ${i > 0 ? "sm:border-l" : ""} ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""}`}>
              <dt className="label text-[0.66rem] text-white/50">{k}</dt>
              <dd className="label mt-1 text-[0.72rem] text-white">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
