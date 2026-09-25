import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { markets } from "@/data/markets";
import { capabilityById } from "@/data/capabilities";
import { customers, images } from "@/data/company";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { ArrowRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Markets: Medical, Automotive, Military, Industrial & Architectural",
  description:
    "Precision metal fabrication for medical equipment, automotive and off-road, military, industrial, architectural/construction and decorative metal work, from San Diego.",
  alternates: { canonical: "/markets" },
};

export default function MarketsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Markets" }]}
        eyebrow="Markets"
        title={
          <>
            Built for
            <br />
            <span className="text-gray">demanding industries.</span>
          </>
        }
        intro="Right focuses on OEM customers in medical, automotive, military and industrial markets, and builds architectural and decorative metalwork too. Each market has its own requirements. Here's how Right's processes meet them."
        image={images.powderLine}
        size="md"
      />

      <section aria-labelledby="markets-grid" className="bg-paper py-16 lg:py-24">
        <div className="container-x">
          <SectionHeader index="01" label="Industries" id="markets-grid" title="Six markets. One fabrication partner." />
          <ul className="mt-12 grid gap-px bg-navy/15 md:grid-cols-2">
            {markets.map((m, i) => (
              <Reveal as="li" key={m.id} delay={(i % 2) * 70} className="bg-paper">
                <Link href={`/markets/${m.id}`} className="group block h-full">
                  <div className="relative aspect-[16/9] overflow-hidden bg-ink">
                    <Image src={m.image.src} alt={m.image.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover opacity-85 photo-grade transition-transform duration-700 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                    <span className="label tabular absolute left-5 top-5 text-white/80">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display absolute bottom-5 left-5 right-5 text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">{m.name}</span>
                  </div>
                  <div className="p-6 lg:p-8">
                    <p className="heading text-lg text-navy">{m.headline}</p>
                    <p className="mt-3 leading-relaxed text-steel">{m.why}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {m.capabilityIds.slice(0, 5).map((id) => (
                        <li key={id} className="label border border-navy/15 px-2 py-1 text-[0.62rem] text-navy">
                          {capabilityById[id].name.split(" —")[0]}
                        </li>
                      ))}
                    </ul>
                    <span className="label mt-6 inline-flex items-center gap-2 text-blue">
                      {m.short} manufacturing <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="cust" className="border-t border-navy/10 bg-paper pb-16 lg:pb-24">
        <div className="container-x pt-12">
          <p id="cust" className="label text-steel">
            Customers include
          </p>
          <ul className="mt-6 grid grid-cols-3 items-center gap-x-5 gap-y-8 sm:grid-cols-4 sm:gap-x-8 lg:grid-cols-6">
            {customers.map((c) => (
              <li key={c.id} className="flex h-12 min-w-0 items-center">
                <Image src={c.logo} alt={c.name} width={c.w} height={c.h} sizes="160px" className="max-h-9 w-auto max-w-full object-contain sm:max-h-10 sm:max-w-[8.5rem] opacity-60 mix-blend-multiply grayscale" />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
