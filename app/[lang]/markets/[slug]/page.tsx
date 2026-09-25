import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/ui/LocaleLink";
import { notFound } from "next/navigation";
import { markets as baseMarkets } from "@/data/markets";
import { serviceHref } from "@/data/services";
import { getI18n } from "@/lib/i18n/server";
import { alternatesFor, localizeHref } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/format";
import { PageHero, titleSize } from "@/components/site/PageHero";
import { Button } from "@/components/ui/Button";
import { BlockTitle } from "@/components/ui/BlockTitle";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/JsonLd";
import { CanRightBuildIt } from "@/components/capability/CanRightBuildIt";
import { CtaBand } from "@/components/site/CtaBand";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

export function generateStaticParams() {
  return baseMarkets.map((m) => ({ slug: m.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/markets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dict, content } = await getI18n();
  const m = content.markets.find((x) => x.id === slug);
  if (!m) return {};
  return {
    title: t(dict.meta.marketTitle, { name: m.name }),
    description: `${m.summary} ${m.headline}`,
    alternates: alternatesFor(locale, `/markets/${m.id}`),
  };
}

export default async function MarketPage({ params }: PageProps<"/[lang]/markets/[slug]">) {
  const { slug } = await params;
  const { locale, dict, content } = await getI18n();
  const d = dict.marketPage;
  const { markets, customers, images, processSteps, categoryLabels } = content;
  const m = markets.find((x) => x.id === slug);
  if (!m) notFound();
  const capabilityById = Object.fromEntries(content.capabilities.map((c) => [c.id, c]));
  const lc = (x: string) => (locale === "en" ? x.toLowerCase() : x);

  const caps = m.capabilityIds.map((id) => capabilityById[id]);
  const custs = customers.filter((c) => m.customerIds?.includes(c.id));
  const others = markets.filter((x) => x.id !== m.id);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: localizeHref(locale, "/") },
          { name: dict.common.markets, path: localizeHref(locale, "/markets") },
          { name: m.name, path: localizeHref(locale, `/markets/${m.id}`) },
        ])}
      />
      <PageHero
        crumbs={[{ label: dict.common.home, href: "/" }, { label: dict.common.markets, href: "/markets" }, { label: m.name }]}
        eyebrow={t(d.eyebrow, { name: m.name })}
        title={
          <>
            {m.short}
            <span className="mt-2 block text-[0.62em] text-gray">{d.manufacturing}</span>
          </>
        }
        size={titleSize(m.short)}
        intro={<p className="heading text-[clamp(1.2rem,2.2vw,1.7rem)] leading-snug text-white">{m.headline}</p>}
        image={m.image}
        actions={
          <>
            <Button href={`/start-a-project?market=${m.id}`}>{t(d.startProject, { name: lc(m.short) })}</Button>
            <Button href="#capabilities" variant="ghost-light" arrow={false}>
              {d.relevant}
            </Button>
          </>
        }
      />

      <div className="bg-paper">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="min-w-0 space-y-20 lg:col-span-8 lg:space-y-28">
            {/* 01 What Right builds */}
            <section aria-labelledby="builds-title">
              <BlockTitle index="01" label={d.applications} title={t(d.builds, { name: lc(m.short) })} id="builds-title" />
              <Reveal className="mt-8">
                <p className="text-[1.1rem] leading-relaxed text-steel">{m.summary}</p>
              </Reveal>
              <ul className="mt-10 grid border-t border-navy/15 sm:grid-cols-2">
                {m.applications.map((a, i) => (
                  <Reveal as="li" key={a} delay={i * 50} className="flex items-baseline gap-4 border-b border-navy/15 py-5 pe-4 sm:[&:nth-child(even)]:border-s sm:[&:nth-child(even)]:ps-6">
                    <span className="label tabular text-blue">{String(i + 1).padStart(2, "0")}</span>
                    <span className="heading text-xl uppercase text-navy">{a}</span>
                  </Reveal>
                ))}
              </ul>
            </section>

            {/* 02 Why it matters */}
            <section aria-labelledby="why-title">
              <BlockTitle index="02" label={d.why} title={d.whyTitle} id="why-title" />
              <Reveal className="mt-8 grid gap-10 md:grid-cols-5">
                <p className="text-[1.05rem] leading-relaxed text-graphite md:col-span-3">{m.why}</p>
                <figure className="border-s-2 border-blue ps-5 md:col-span-2">
                  <p className="label text-[0.66rem] text-steel">{d.fromPage}</p>
                  {m.sourceNotes.map((n) => (
                    <blockquote key={n} className="mt-3 text-[0.98rem] leading-relaxed text-navy">
                      {n}
                    </blockquote>
                  ))}
                </figure>
              </Reveal>
            </section>

            {/* 03 Capabilities */}
            <section id="capabilities" aria-labelledby="caps-title" className="scroll-mt-24">
              <BlockTitle index="03" label={d.capabilities} title={d.connected} id="caps-title" />
              <ul className="mt-10 grid border-s border-t border-navy/15 sm:grid-cols-2">
                {caps.map((c, i) => (
                  <Reveal as="li" key={c.id} delay={(i % 2) * 60} className="border-b border-e border-navy/15 bg-paper">
                    <Link href={serviceHref(c.service)} className="group flex h-full flex-col p-6 transition-colors hover:bg-white">
                      <span className="label text-[0.66rem] text-blue">
                        {categoryLabels[c.category]}
                        {c.partner ? ` · ${dict.common.viaApc}` : ""}
                      </span>
                      <span className="heading mt-2 text-xl uppercase text-navy">{c.name}</span>
                      <span className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-steel">{c.description}</span>
                      <span className="label mt-4 text-[0.64rem] text-steel-400">{c.evidence[0]}</span>
                      <ArrowUpRight size={18} className="mt-4 text-steel-400 transition-colors group-hover:text-blue" />
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </section>

            {/* 04 Process */}
            <section aria-labelledby="route-title">
              <BlockTitle index="04" label={d.howRuns} title={d.route} id="route-title" />
              <Reveal className="relative mt-10 overflow-hidden bg-ink p-6 text-white sm:p-10">
                <Image src={images.brakeWide.src} alt="" fill sizes="60vw" className="object-cover opacity-25" />
                <ol className="relative grid grid-cols-2 gap-x-6 gap-y-8 xl:grid-cols-4">
                  {processSteps.map((p) => (
                    <li key={p.n} className="border-t border-white/20 pt-4">
                      <span className="label tabular text-blue-bright">{p.n}</span>
                      <p className="heading mt-2 text-[0.88rem] uppercase sm:text-base">{p.title}</p>
                    </li>
                  ))}
                </ol>
                <Link href="/#process-title" className="label relative mt-8 inline-flex items-center gap-2 text-white/80 hover:text-white">
                  {d.seeSteps} <ArrowRight size={14} />
                </Link>
              </Reveal>
            </section>

            {custs.length > 0 && (
              <section aria-labelledby="cust-title">
                <BlockTitle index="05" label={d.customers} title={dict.common.customersInclude} id="cust-title" />
                <ul className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-8">
                  {custs.map((c) => (
                    <li key={c.id}>
                      <Image src={c.logo} alt={c.name} width={c.w} height={c.h} className="h-10 w-auto max-w-[10rem] object-contain opacity-70 mix-blend-multiply grayscale" />
                    </li>
                  ))}
                </ul>
                <p className="label mt-6 text-[0.62rem] text-steel-400">{dict.common.asListed}</p>
              </section>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <CanRightBuildIt questions={m.questions} context={m.id} />
              <nav aria-label={d.others} className="border border-navy/15 bg-white p-5">
                <p className="label text-steel">{d.others}</p>
                <ul className="mt-3">
                  {others.map((o) => (
                    <li key={o.id} className="border-b border-navy/10 last:border-b-0">
                      <Link href={`/markets/${o.id}`} className="group flex items-center justify-between py-3 text-navy hover:text-blue">
                        <span className="heading uppercase">{o.name}</span>
                        <ArrowRight size={15} className="text-steel-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <CtaBand title={t(dict.cta.marketTitle, { name: lc(m.short) })} />
    </>
  );
}
