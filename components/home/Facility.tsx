import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { equipment, images } from "@/data/company";
import { ArrowRight } from "@/components/ui/Icons";

/** Floor-plan style frame with dimension lines. Deliberately abstract: no invented layout. */
function PlanFrame() {
  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-10 top-10 hidden sm:inset-x-8 lg:block xl:inset-x-12" aria-hidden>
      <div className="absolute inset-0 border border-white/15" />
      <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-blue-bright" />
      <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-blue-bright" />
      <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-blue-bright" />
      <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-blue-bright" />
      <div className="absolute -bottom-6 left-0 right-0 flex items-center gap-3">
        <span className="h-3 w-px bg-blue-bright/80" />
        <span className="h-px flex-1 bg-blue-bright/50" />
        <span className="label text-[0.62rem] text-blue-bright">20,000 sq. ft. · San Diego, CA</span>
        <span className="h-px flex-1 bg-blue-bright/50" />
        <span className="h-3 w-px bg-blue-bright/80" />
      </div>
    </div>
  );
}

export function Facility() {
  return (
    <section aria-labelledby="facility-title" className="relative isolate overflow-hidden bg-ink text-white">
      <Image src={images.turret.src} alt={images.turret.alt} fill sizes="100vw" className="-z-10 object-cover opacity-45 photo-grade" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" aria-hidden />
      <div className="blueprint absolute inset-0 -z-10 opacity-70" aria-hidden />

      <div className="container-x relative py-20 lg:py-32">
        <PlanFrame />
        <div className="lg:px-10 lg:py-4">
        <Reveal plain className="flex items-center gap-4">
          <span className="label tabular text-blue-bright">07</span>
          <span className="label text-white/70">Facility</span>
          <span className="rule-draw h-px flex-1 bg-white/15" aria-hidden />
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 id="facility-title" className="display display-wide text-[clamp(3rem,10vw,9rem)] leading-[0.85]">
              20,000
              <span className="block text-[0.42em] text-gray">sq. ft.</span>
            </h2>
            <p className="label mt-6 text-white">San Diego, California · 92126</p>
            <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/80">
              Right serves OEM customers from a 20,000 sq. ft. facility in the design, manufacturing and technology hub of San Diego and Southern California, home to the forming, punching, bending and machining equipment listed here. A consistent material inventory keeps turnaround fast.
            </p>
            <Link href="/about" className="label mt-8 inline-flex items-center gap-2 border-b border-white/40 pb-1 hover:border-white">
              Inside Right <ArrowRight size={14} />
            </Link>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="border border-white/15 bg-ink/80">
              <p className="label flex items-center justify-between border-b border-white/15 px-5 py-4 text-blue-bright">
                <span>Equipment on record</span>
                <span className="text-white/45">Qty</span>
              </p>
              <ul>
                {equipment.map((e) => (
                  <li key={e.name} className="flex items-start gap-4 border-b border-white/10 px-5 py-4 last:border-b-0">
                    <div className="flex-1">
                      <p className="heading text-[1.05rem] text-white">{e.name}</p>
                      <p className="mt-1 text-sm text-white/60">{e.detail}</p>
                    </div>
                    <span className="display tabular text-[1.9rem] leading-none text-white">{String(e.count).padStart(2, "0")}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="label mt-3 text-[0.62rem] text-white/40">Source: Right Manufacturing capability pages & brochure</p>
          </Reveal>
        </div>
        </div>
      </div>
    </section>
  );
}
