import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { apc, images } from "@/data/company";

export function FinishingPartner() {
  return (
    <section aria-labelledby="apc-title" className="bg-mist py-20 lg:py-28">
      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal plain className="flex items-center gap-4">
            <span className="label tabular text-blue">08</span>
            <span className="label text-steel">Finishing · Action Powder Coating</span>
            <span className="rule-draw h-px flex-1 bg-navy/15" aria-hidden />
          </Reveal>
          <Reveal>
            <h2 id="apc-title" className="display mt-8 text-[clamp(2rem,3.6vw,3.3rem)] text-navy">
              Finished through a 35-year partnership.
            </h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-steel">{apc.summary}</p>
          </Reveal>
          <Reveal delay={100} className="mt-8 grid grid-cols-2 gap-px bg-navy/12">
            {apc.lines.map((l) => (
              <div key={l.name} className="bg-mist py-4 pr-4 [&:nth-child(2)]:pl-4">
                <p className="heading text-navy">{l.name}</p>
                <p className="mt-1 text-sm text-steel">{l.detail}</p>
              </div>
            ))}
          </Reveal>
          <Reveal delay={160}>
            <ul className="mt-8 grid grid-cols-1 gap-x-6 border-t border-navy/12 xs:grid-cols-2">
              {apc.services.map((s) => (
                <li key={s} className="flex items-center gap-3 border-b border-navy/10 py-2.5 text-[0.95rem] text-graphite">
                  <span className="h-1.5 w-1.5 shrink-0 bg-blue" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
            <Button href="/capabilities/finishing" variant="ghost-dark" className="mt-8">
              Finishing capabilities
            </Button>
          </Reveal>
        </div>
        <Reveal delay={80} className="grid grid-cols-5 gap-3 lg:col-span-7">
          <div className="relative col-span-3 aspect-[3/4] overflow-hidden bg-ink">
            <Image src={images.powderPortrait.src} alt={images.powderPortrait.alt} fill sizes="(min-width:1024px) 35vw, 60vw" className="object-cover" />
          </div>
          <div className="col-span-2 grid gap-3">
            <div className="relative overflow-hidden bg-ink">
              <Image src={images.powderLine.src} alt={images.powderLine.alt} fill sizes="25vw" className="object-cover" />
            </div>
            <div className="relative overflow-hidden bg-ink">
              <Image src={images.powderParts.src} alt={images.powderParts.alt} fill sizes="25vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
