import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/ui/LocaleLink";
import { getI18n } from "@/lib/i18n/server";
import { alternatesFor } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/format";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { ArrowRight } from "@/components/ui/Icons";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return { title: dict.meta.marketsTitle, description: dict.meta.marketsDescription, alternates: alternatesFor(locale, "/markets") };
}

export default async function MarketsPage() {
  const { dict, content } = await getI18n();
  const d = dict.marketsPage;
  const { markets, customers, images } = content;
  const capabilityById = Object.fromEntries(content.capabilities.map((c) => [c.id, c]));
  return (
    <>
      <PageHero
        crumbs={[{ label: dict.common.home, href: "/" }, { label: dict.common.markets }]}
        eyebrow={dict.common.markets}
        title={
          <>
            {d.title1}
            <br />
            <span className="text-gray">{d.title2}</span>
          </>
        }
        intro={d.intro}
        image={images.powderLine}
        size="md"
      />

      <section aria-labelledby="markets-grid" className="bg-paper py-16 lg:py-24">
        <div className="container-x">
          <SectionHeader index="01" label={d.label} id="markets-grid" title={d.title} />
          <ul className="mt-12 grid gap-px bg-navy/15 md:grid-cols-2">
            {markets.map((m, i) => (
              <Reveal as="li" key={m.id} delay={(i % 2) * 70} className="bg-paper">
                <Link href={`/markets/${m.id}`} className="group block h-full">
                  <div className="relative aspect-[16/9] overflow-hidden bg-ink">
                    <Image src={m.image.src} alt={m.image.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover opacity-85 photo-grade transition-transform duration-700 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                    <span className="label tabular absolute start-5 top-5 text-white/80">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display absolute bottom-5 start-5 end-5 text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">{m.name}</span>
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
                      {t(dict.marketsSection.manufacturing, { name: m.short })} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
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
            {dict.common.customersInclude}
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
