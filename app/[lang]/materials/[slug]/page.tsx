import type { Metadata } from "next";
import Link from "@/components/ui/LocaleLink";
import { notFound } from "next/navigation";
import { materials as baseMaterials } from "@/data/materials";
import { serviceHref } from "@/data/services";
import { getI18n } from "@/lib/i18n/server";
import { alternatesFor, localizeHref } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/format";
import { PageHero, titleSize } from "@/components/site/PageHero";
import { Button } from "@/components/ui/Button";
import { BlockTitle } from "@/components/ui/BlockTitle";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList } from "@/components/site/FaqList";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/JsonLd";
import { CanRightBuildIt } from "@/components/capability/CanRightBuildIt";
import { CtaBand } from "@/components/site/CtaBand";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

export function generateStaticParams() {
  return baseMaterials.map((m) => ({ slug: m.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/materials/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dict, content } = await getI18n();
  const m = content.materials.find((x) => x.id === slug);
  if (!m) return {};
  return { title: t(dict.meta.materialTitle, { name: m.name }), description: m.description, alternates: alternatesFor(locale, `/materials/${m.id}`) };
}

export default async function MaterialPage({ params }: PageProps<"/[lang]/materials/[slug]">) {
  const { slug } = await params;
  const { locale, dict, content } = await getI18n();
  const d = dict.materialPage;
  const { materials, tubeShapes, categoryLabels, materialFaqs } = content;
  const m = materials.find((x) => x.id === slug);
  if (!m) notFound();
  const capabilityById = Object.fromEntries(content.capabilities.map((c) => [c.id, c]));
  const lc = (x: string) => (locale === "en" ? x.toLowerCase() : x);
  const procs = m.processes.map((id) => capabilityById[id]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: localizeHref(locale, "/") },
          { name: dict.common.capabilities, path: localizeHref(locale, "/capabilities") },
          { name: m.name, path: localizeHref(locale, `/materials/${m.id}`) },
        ])}
      />
      <PageHero
        compact
        crumbs={[{ label: dict.common.home, href: "/" }, { label: dict.common.capabilities, href: "/capabilities" }, { label: dict.common.materials }, { label: m.name }]}
        eyebrow={d.eyebrow}
        title={m.name}
        size={titleSize(m.name)}
        intro={m.description}
        image={m.image}
        actions={<Button href={`/start-a-project?mat=${m.id}`}>{dict.common.startProject}</Button>}
      />
      <div className="bg-paper">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="min-w-0 space-y-20 lg:col-span-8">
            <section aria-labelledby="cons">
              <BlockTitle index="01" label={d.considerations} title={d.when} id="cons" />
              <ul className="mt-8 border-t border-navy/15">
                {m.considerations.map((c, i) => (
                  <Reveal as="li" key={c} delay={i * 60} className="flex gap-5 border-b border-navy/15 py-5">
                    <span className="label tabular text-blue">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[1.05rem] text-graphite">{c}</span>
                  </Reveal>
                ))}
              </ul>
            </section>

            <section aria-labelledby="procs">
              <BlockTitle index="02" label={d.processes} title={t(d.processesFor, { name: lc(m.short) })} id="procs" />
              <ul className="mt-8 grid border-s border-t border-navy/15 sm:grid-cols-2">
                {procs.map((c) => (
                  <li key={c.id} className="border-b border-e border-navy/15 bg-paper">
                    <Link href={serviceHref(c.service)} className="group flex items-start justify-between gap-4 p-5 hover:bg-white">
                      <span>
                        <span className="label text-[0.62rem] text-blue">{categoryLabels[c.category]}</span>
                        <span className="heading mt-1 block text-lg uppercase text-navy">{c.name}</span>
                        <span className="label mt-2 block text-[0.62rem] text-steel">{c.evidence[0]}</span>
                      </span>
                      <ArrowUpRight size={17} className="mt-1 shrink-0 text-steel-400 group-hover:text-blue" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="forms">
              <BlockTitle index="03" label={d.forms} title={d.formsTitle} id="forms" />
              <ul className="mt-8 grid border-s border-t border-navy/15 sm:grid-cols-2 lg:grid-cols-3">
                <li className="border-b border-e border-navy/15 bg-paper p-5">
                  <p className="heading uppercase text-navy">{d.sheet}</p>
                  <p className="mt-1 text-sm text-steel">{d.sheetNote}</p>
                </li>
                {tubeShapes.map((t) => (
                  <li key={t.id} className="border-b border-e border-navy/15 bg-paper p-5">
                    <p className="heading uppercase text-navy">{t.name}</p>
                    {t.note && <p className="mt-1 text-sm text-steel">{t.note}</p>}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="mfaq">
              <BlockTitle index="04" label={d.questions} title={d.faq} id="mfaq" />
              <div className="mt-8">
                <FaqList faqs={materialFaqs} />
              </div>
            </section>

            <nav aria-label={d.others} className="flex flex-wrap gap-3">
              {materials
                .filter((x) => x.id !== m.id)
                .map((x) => (
                  <Link key={x.id} href={`/materials/${x.id}`} className="label inline-flex items-center gap-2 border border-navy/20 px-4 py-3 text-navy hover:border-blue hover:text-blue">
                    {x.name} <ArrowRight size={14} />
                  </Link>
                ))}
            </nav>
          </div>
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <CanRightBuildIt context={m.id} questions={[t(d.q1, { name: m.short }), t(d.q2, { name: lc(m.short) }), d.q3]} />
            </div>
          </div>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
