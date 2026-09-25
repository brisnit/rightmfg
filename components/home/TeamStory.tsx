import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { company, images } from "@/data/company";

export function TeamStory() {
  return (
    <section aria-labelledby="people-title" className="bg-paper py-20 lg:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="relative self-start lg:sticky lg:top-28 lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-ink lg:aspect-[5/4]">
            <Image
              src={images.brakeOperator2.src}
              alt={images.brakeOperator2.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover photo-grade"
              style={{ objectPosition: images.brakeOperator2.position }}
            />
          </div>
          <div className="absolute -bottom-2 right-4 hidden w-[34%] border-8 border-paper sm:block lg:-right-8">
            <div className="relative aspect-square overflow-hidden bg-ink">
              <Image src={images.surfacePrep.src} alt={images.surfacePrep.alt} fill sizes="25vw" className="object-cover" style={{ objectPosition: images.surfacePrep.position }} />
            </div>
          </div>
          <p className="label mt-4 text-[0.66rem] text-steel">Fig. 01 — Forming on the press brake, San Diego</p>
        </Reveal>

        <div className="lg:col-span-5 lg:pt-6">
          <Reveal plain className="flex items-center gap-4">
            <span className="label tabular text-blue">06</span>
            <span className="label text-steel">People</span>
            <span className="rule-draw h-px flex-1 bg-navy/15" aria-hidden />
          </Reveal>
          <Reveal>
            <h2 id="people-title" className="display mt-8 text-[clamp(2.1rem,4.6vw,4rem)] text-navy">
              Built by people who know the process.
            </h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-steel">
              Right was founded in the 1990s with a service-first mission. Today it&apos;s a 35-person San Diego company whose team averages more than 20 years of experience. The engineers who review your drawings have spent 30+ years helping customers with product design, fabrication and assembly.
            </p>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-steel">
              Programming a press brake means choosing bend order, pressure, dwell and part position. That judgment comes from the operators, and it&apos;s why 98% of clients stay.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 grid grid-cols-3 border-y border-navy/12">
            {[
              ["35", "Person team"],
              ["20+", "Yrs avg. experience"],
              ["30+", "Yrs engineering"],
            ].map(([v, l], i) => (
              <div key={l} className={`py-5 ${i ? "border-l border-navy/12 pl-4" : ""}`}>
                <p className="display text-[2.4rem] text-navy">{v}</p>
                <p className="label mt-2 text-[0.66rem] text-steel">{l}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={160} className="mt-8">
            <p className="label text-steel">Leadership</p>
            <ul className="mt-3">
              {company.leadership.map((p) => (
                <li key={p.name} className="flex items-baseline justify-between gap-4 border-b border-navy/10 py-3">
                  <span className="heading text-lg text-navy">{p.name}</span>
                  <span className="label text-right text-[0.68rem] text-steel">{p.role}</span>
                </li>
              ))}
            </ul>
            <Button href="/about" variant="text-dark" className="mt-8">
              About Right Manufacturing
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
