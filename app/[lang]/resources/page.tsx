import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { alternatesFor } from "@/lib/i18n/config";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqList, faqJsonLd } from "@/components/site/FaqList";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";
import { Download } from "@/components/ui/Icons";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return { title: dict.meta.resourcesTitle, description: dict.meta.resourcesDescription, alternates: alternatesFor(locale, "/resources") };
}

export default async function ResourcesPage() {
  const { dict, content } = await getI18n();
  const d = dict.resourcesPage;
  const { faqs, services, company, equipment, images, glossary } = content;
  const allFaqs = [...faqs, ...services.flatMap((s) => s.faqs)];
  return (
    <>
      <JsonLd data={faqJsonLd(allFaqs)} />
      <PageHero compact crumbs={[{ label: dict.common.home, href: "/" }, { label: dict.common.resources }]} eyebrow={dict.common.resources} title={d.title} size="lg" intro={d.intro} image={images.tubeStock} />

      <section aria-labelledby="dl" className="bg-paper py-16 lg:py-20">
        <div className="container-x grid gap-px border border-navy/15 bg-navy/15 md:grid-cols-2">
          <a href={company.brochure} target="_blank" rel="noopener" className="group flex items-center justify-between gap-6 bg-white p-6 hover:bg-mist lg:p-8">
            <span>
              <span className="label text-blue">{d.download}</span>
              <span id="dl" className="heading mt-2 block text-2xl uppercase text-navy">
                {d.brochure}
              </span>
              <span className="mt-1 block text-steel">{d.brochureBody}</span>
            </span>
            <Download size={26} className="shrink-0 text-blue transition-transform group-hover:translate-y-0.5" />
          </a>
          <div className="bg-white p-6 lg:p-8">
            <span className="label text-blue">{d.equipment}</span>
            <ul className="mt-3">
              {equipment.map((e) => (
                <li key={e.name} className="flex justify-between gap-4 border-b border-navy/10 py-2 text-[0.95rem] last:border-b-0">
                  <span className="text-graphite">{e.name}</span>
                  <span className="heading tabular text-navy">× {e.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq" className="bg-paper pb-16 lg:pb-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader compact index="01" label={d.faqLabel} id="faq" title={d.faqTitle} />
          </div>
          <div className="lg:col-span-8 lg:pt-20">
            <FaqList faqs={allFaqs} />
          </div>
        </div>
      </section>

      <section aria-labelledby="gloss" className="bg-ink py-16 text-white lg:py-24">
        <div className="container-x">
          <SectionHeader tone="dark" index="02" label={d.glossaryLabel} id="gloss" title={d.glossaryTitle} />
          <dl className="mt-12 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {glossary.map((g) => (
              <div key={g.t} className="bg-ink p-6">
                <dt className="heading text-lg uppercase text-white">{g.t}</dt>
                <dd className="mt-2 leading-relaxed text-white/70">{g.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
