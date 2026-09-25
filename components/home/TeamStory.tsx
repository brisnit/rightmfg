import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getI18n } from "@/lib/i18n/server";

export async function TeamStory() {
  const { dict, content } = await getI18n();
  const d = dict.team;
  const { company, images } = content;
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
          <div className="absolute -bottom-2 end-4 hidden w-[34%] border-8 border-paper sm:block lg:-end-8">
            <div className="relative aspect-square overflow-hidden bg-ink">
              <Image src={images.surfacePrep.src} alt={images.surfacePrep.alt} fill sizes="25vw" className="object-cover" style={{ objectPosition: images.surfacePrep.position }} />
            </div>
          </div>
          <p className="label mt-4 text-[0.66rem] text-steel">{d.figure}</p>
        </Reveal>

        <div className="lg:col-span-5 lg:pt-6">
          <Reveal plain className="flex items-center gap-4">
            <span className="label tabular text-blue">06</span>
            <span className="label text-steel">{d.label}</span>
            <span className="rule-draw h-px flex-1 bg-navy/15" aria-hidden />
          </Reveal>
          <Reveal>
            <h2 id="people-title" className="display mt-8 text-[clamp(2.1rem,4.6vw,4rem)] text-navy">
              {d.title}
            </h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-steel">
              {d.p1}
            </p>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-steel">
              {d.p2}
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 grid grid-cols-3 border-y border-navy/12">
            {[
              ["35", d.stat1],
              ["20+", d.stat2],
              ["30+", d.stat3],
            ].map(([v, l], i) => (
              <div key={l} className={`py-5 ${i ? "border-s border-navy/12 ps-4" : ""}`}>
                <p className="display text-[2.4rem] text-navy">{v}</p>
                <p className="label mt-2 text-[0.66rem] text-steel">{l}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={160} className="mt-8">
            <p className="label text-steel">{d.leadership}</p>
            <ul className="mt-3">
              {company.leadership.map((p) => (
                <li key={p.name} className="flex items-baseline justify-between gap-4 border-b border-navy/10 py-3">
                  <span className="heading text-lg text-navy">{p.name}</span>
                  <span className="label text-end text-[0.68rem] text-steel">{p.role}</span>
                </li>
              ))}
            </ul>
            <Button href="/about" variant="text-dark" className="mt-8">
              {d.aboutLink}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
