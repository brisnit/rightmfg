import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/ui/LocaleLink";
import { notFound } from "next/navigation";
import { services as baseServices } from "@/data/services";
import { getI18n } from "@/lib/i18n/server";
import { alternatesFor, localizeHref, SITE_URL } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/format";
import { PageHero, titleSize } from "@/components/site/PageHero";
import { Button } from "@/components/ui/Button";
import { BlockTitle } from "@/components/ui/BlockTitle";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList, faqJsonLd } from "@/components/site/FaqList";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/JsonLd";
import { CanRightBuildIt } from "@/components/capability/CanRightBuildIt";
import { CtaBand } from "@/components/site/CtaBand";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

export function generateStaticParams() {
  return baseServices.map((s) => ({ slug: s.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/capabilities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dict, content } = await getI18n();
  const s = content.services.find((x) => x.id === slug);
  if (!s) return {};
  return {
    title: t(dict.meta.serviceTitle, { name: s.name }),
    description: s.summary,
    alternates: alternatesFor(locale, `/capabilities/${s.id}`),
    openGraph: { images: [{ url: s.image.src }] },
  };
}

export default async function CapabilityPage({ params }: PageProps<"/[lang]/capabilities/[slug]">) {
  const { slug } = await params;
  const { locale, dict, content } = await getI18n();
  const d = dict.servicePage;
  const s = content.services.find((x) => x.id === slug);
  if (!s) notFound();

  const capabilityById = Object.fromEntries(content.capabilities.map((c) => [c.id, c]));
  const materialById = Object.fromEntries(content.materials.map((m) => [m.id, m]));
  const marketById = Object.fromEntries(content.markets.map((m) => [m.id, m]));
  const apc = content.apc;
  const caps = s.capabilityIds.map((id) => capabilityById[id]);
  const related = content.services.filter((x) => x.id !== s.id);
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.name,
    description: s.summary,
    provider: { "@id": `${SITE_URL}/#org` },
    areaServed: "Southern California and United States",
    url: SITE_URL + localizeHref(locale, `/capabilities/${s.id}`),
    inLanguage: locale,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${s.name} processes`,
      itemListElement: caps.map((c) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: c.name, description: c.description } })),
    },
  };

  return (
    <>
      <JsonLd
        data={[
          serviceLd,
          faqJsonLd(s.faqs),
          breadcrumbJsonLd([
            { name: dict.common.home, path: localizeHref(locale, "/") },
            { name: dict.common.capabilities, path: localizeHref(locale, "/capabilities") },
            { name: s.name, path: localizeHref(locale, `/capabilities/${s.id}`) },
          ]),
        ]}
      />
      <PageHero
        crumbs={[{ label: dict.common.home, href: "/" }, { label: dict.common.capabilities, href: "/capabilities" }, { label: s.name }]}
        eyebrow={s.eyebrow}
        title={s.name}
        size={titleSize(s.name)}
        subtitle={
          <>
            {s.headline[0]}
            <br />
            <span className="text-white">{s.headline[1]}</span>
          </>
        }
        intro={s.summary}
        image={s.image}
        video={s.video}
        actions={
          <>
            <Button href={`/start-a-project?service=${s.id}`}>{d.startProject}</Button>
            <Button href="#processes" variant="ghost-light" arrow={false}>
              {d.viewProcesses}
            </Button>
          </>
        }
        specs={s.equipment}
      />

      <div className="bg-paper">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="min-w-0 space-y-20 lg:col-span-8 lg:space-y-28">
            {/* 01 Overview */}
            <section aria-labelledby="overview">
              <BlockTitle index="01" label={d.overview} />
              <Reveal>
                <p id="overview" className="heading mt-8 text-[clamp(1.4rem,2.6vw,2rem)] leading-snug text-navy">
                  {s.overview[0]}
                </p>
              </Reveal>
              <Reveal delay={80} className="mt-8 grid gap-6 text-[1.05rem] leading-relaxed text-steel md:grid-cols-2">
                {s.overview.slice(1).map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </Reveal>
              {s.partner === "APC" && (
                <p className="label mt-8 border-s-2 border-blue ps-4 text-steel">
                  {t(d.apcNote, { apc: apc.name, short: apc.short, years: apc.years })}
                </p>
              )}
            </section>

            {/* 02 Processes */}
            <section id="processes" aria-labelledby="processes-title" className="scroll-mt-24">
              <BlockTitle index="02" label={d.processes} title={d.included} id="processes-title" />
              <ol className="mt-10 border-t border-navy/15">
                {caps.map((c, i) => (
                  <Reveal as="li" key={c.id} delay={i * 50} className="grid gap-4 border-b border-navy/15 py-8 sm:grid-cols-[4rem_1fr] sm:gap-6">
                    <span className="label tabular text-blue">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="display text-[clamp(1.4rem,2.6vw,2rem)] text-navy">{c.name}</h3>
                      <p className="mt-3 max-w-2xl leading-relaxed text-steel">{c.description}</p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {c.evidence.map((e) => (
                          <li key={e} className="label border border-navy/15 bg-white px-2.5 py-1.5 text-[0.66rem] text-navy">
                            {e}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-sm text-steel">
                        <span className="label me-2 text-[0.66rem] text-steel-400">{dict.common.applications}</span>
                        {c.applications.join(" · ")}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </section>

            {/* 03 Technical */}
            <section id="equipment" aria-labelledby="tech-title" className="scroll-mt-24">
              <BlockTitle index="03" label={d.technical} title={d.onTheFloor} id="tech-title" />
              <Reveal className="mt-10 grid gap-px border border-navy/15 bg-navy/15 sm:grid-cols-2">
                {s.specs.map((g) => (
                  <div key={g.label} className="bg-white p-6">
                    <p className="label text-blue">{g.label}</p>
                    <ul className="mt-4">
                      {g.items.map((it) => (
                        <li key={it} className="flex gap-3 border-b border-navy/10 py-2.5 text-[0.98rem] text-graphite last:border-b-0">
                          <span className="mt-[0.6em] h-px w-3 shrink-0 bg-navy/40" aria-hidden />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Reveal>
              <p className="label mt-3 text-[0.62rem] text-steel-400">{d.specNote}</p>

              <Reveal className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {s.gallery.map((g) => (
                  <figure key={g.src}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                      <Image src={g.src} alt={g.alt} fill sizes="(min-width:1024px) 16vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-[1.02]" />
                    </div>
                    <figcaption className="label mt-2 text-[0.62rem] leading-relaxed text-steel">{g.alt}</figcaption>
                  </figure>
                ))}
              </Reveal>
            </section>

            {/* 04 Materials */}
            <section aria-labelledby="materials-title">
              <BlockTitle index="04" label={d.supported} title={d.materials} id="materials-title" />
              <div className="mt-10 grid gap-px bg-navy/15 sm:grid-cols-3">
                {s.materials.map((id) => {
                  const m = materialById[id];
                  return (
                    <Link key={id} href={`/materials/${id}`} className="group bg-paper p-6 transition-colors hover:bg-white">
                      <p className="display text-[1.35rem] text-navy xl:text-2xl">{m.short}</p>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-steel">{m.considerations[0]}</p>
                      <span className="label mt-5 inline-flex items-center gap-2 text-blue">
                        {m.name} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* 05 Markets */}
            <section aria-labelledby="markets-title">
              <BlockTitle index="05" label={d.markets} title={d.whereUsed} id="markets-title" />
              <ul className="mt-10 border-t border-navy/15">
                {s.markets.map((id) => {
                  const m = marketById[id];
                  return (
                    <li key={id} className="border-b border-navy/15">
                      <Link href={`/markets/${id}`} className="group grid gap-2 py-5 sm:grid-cols-[14rem_1fr_auto] sm:items-center sm:gap-6">
                        <span className="heading text-xl uppercase text-navy group-hover:text-blue">{m.short}</span>
                        <span className="text-[0.95rem] text-steel">{m.summary}</span>
                        <ArrowUpRight size={18} className="hidden text-steel-400 group-hover:text-blue sm:block" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* 06 FAQ */}
            <section aria-labelledby="faq-title">
              <BlockTitle index="06" label={d.questions} title={d.faq} id="faq-title" />
              <div className="mt-10">
                <FaqList faqs={s.faqs} />
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <CanRightBuildIt questions={s.questions} context={s.id} />
              <nav aria-label={d.related} className="border border-navy/15 bg-white p-5">
                <p className="label text-steel">{d.related}</p>
                <ul className="mt-3">
                  {related.map((r) => (
                    <li key={r.id} className="border-b border-navy/10 last:border-b-0">
                      <Link href={`/capabilities/${r.id}`} className="group flex items-center justify-between py-3 text-navy hover:text-blue">
                        <span className="heading uppercase">{r.name}</span>
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

      <CtaBand title={t(dict.cta.serviceTitle, { name: locale === "en" ? s.name.toLowerCase() : s.name })} />
    </>
  );
}
