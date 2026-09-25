import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/data/processes";
import { images } from "@/data/company";

export function ProcessTimeline() {
  return (
    <section aria-labelledby="process-title" className="blueprint-light relative bg-paper py-20 lg:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal plain className="flex items-center gap-4">
              <span className="label tabular text-blue">04</span>
              <span className="label text-steel">Prototype → Production</span>
              <span className="rule-draw h-px flex-1 bg-navy/15" aria-hidden />
            </Reveal>
            <Reveal>
              <h2 id="process-title" className="display mt-8 text-[clamp(2.1rem,4vw,3.7rem)] text-navy">
                From first part to full production.
              </h2>
              <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-steel">
                The same engineers, operators and equipment take your part from drawing review to packaged delivery, so nothing is lost between prototype and production.
              </p>
            </Reveal>
            <Reveal delay={120} className="relative mt-10 hidden aspect-[4/3] overflow-hidden bg-ink lg:block">
              <Image src={images.mandrelBw.src} alt={images.mandrelBw.alt} fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/80 to-transparent p-5">
                <span className="label text-white">Pull-type mandrel bender</span>
                <span className="label text-white/60">100+ dies</span>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal plain as="ol" className="relative lg:col-span-7">
          <span className="rule-draw-y absolute bottom-6 left-[1.1rem] top-6 w-px bg-navy/20 sm:left-[1.6rem]" aria-hidden />
          {processSteps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={40} className="relative grid grid-cols-[2.25rem_1fr] gap-4 pb-10 sm:grid-cols-[3.25rem_1fr] sm:gap-8 lg:pb-12">
              <span className="relative z-10 flex h-9 w-9 items-center justify-center border border-navy/25 bg-paper sm:h-[3.25rem] sm:w-[3.25rem]">
                <span className="label tabular text-navy">{s.n}</span>
              </span>
              <div className="border-b border-navy/10 pb-8 lg:pb-10">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="display text-[clamp(1.4rem,2.8vw,2.1rem)] text-navy">{s.title}</h3>
                  <span className="label text-[0.66rem] text-steel-400">Ref · {s.source}</span>
                </div>
                <p className="mt-3 max-w-xl leading-relaxed text-steel">{s.body}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li key={t} className="label border border-navy/15 px-2 py-1 text-[0.66rem] text-navy">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              {i === processSteps.length - 1 && <span className="sr-only">End of process</span>}
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
