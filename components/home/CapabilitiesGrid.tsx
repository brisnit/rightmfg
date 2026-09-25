import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icons";
import { capabilityTiles } from "@/data/home";

export function CapabilitiesGrid() {
  return (
    <section aria-labelledby="caps-title" className="bg-paper pb-20 pt-6 lg:pb-32">
      <div className="container-x">
        <SectionHeader
          index="02"
          label="Capabilities"
          id="caps-title"
          title={
            <>
              One partner.
              <br />
              <span className="text-blue">More ways to build.</span>
            </>
          }
          intro="From bent tube and sheet metal to welded, hardware-fitted assemblies, OEM teams can take complex components from prototype into repeatable production with one supplier."
        />

        <ul className="mt-12 grid grid-cols-2 gap-px bg-navy/10 lg:mt-16 lg:grid-cols-4">
          {capabilityTiles.map((t, i) => (
            <Reveal as="li" key={t.title} delay={(i % 4) * 70} className="bg-paper">
              <Link href={t.href} className="group relative block aspect-[3/4] overflow-hidden bg-ink sm:aspect-[4/5]">
                <Image
                  src={t.image.src}
                  alt={t.image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover photo-grade transition-transform duration-[900ms] ease-[var(--ease-precise)] group-hover:scale-[1.03]"
                  style={{ objectPosition: t.image.position ?? "50% 50%" }}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/5 transition-colors duration-500 group-hover:via-ink/70" aria-hidden />
                <span className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
                  <span className="label tabular text-white/80">{String(i + 1).padStart(2, "0")}</span>
                  <ArrowUpRight size={18} className="text-white/60 transition-colors group-hover:text-white" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <span className="display block text-[1.15rem] text-white sm:text-[1.6rem] lg:text-[clamp(1.5rem,2.3vw,2.3rem)]">{t.title}</span>
                  <span className="label mt-2 block text-[0.68rem] text-white/70">{t.subtitle}</span>
                  {/* Hover reveal (desktop); always-visible compact list on touch */}
                  <span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[var(--ease-precise)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] [@media(hover:none)]:hidden">
                    <span className="overflow-hidden">
                      <span className="mt-4 block border-t border-white/20 pt-3">
                        {t.subs.map((s) => (
                          <span key={s} className="block py-0.5 text-[0.9rem] text-white/85">
                            {s}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-steel">
            Know exactly what you need? Filter by process, material, market and production stage in the explorer.
          </p>
          <Button href="/capabilities#explorer" variant="ghost-dark">
            Open capability explorer
          </Button>
        </div>
      </div>
    </section>
  );
}
