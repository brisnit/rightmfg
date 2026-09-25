import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, serviceById } from "@/data/services";
import { capabilityById } from "@/data/capabilities";
import { materialById } from "@/data/materials";
import { marketById } from "@/data/markets";
import { apc } from "@/data/company";
import type { ServiceId } from "@/data/types";
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
  return services.map((s) => ({ slug: s.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/capabilities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceById[slug as ServiceId];
  if (!s) return {};
  return {
    title: `${s.name} in San Diego, California`,
    description: s.summary,
    alternates: { canonical: `/capabilities/${s.id}` },
    openGraph: { images: [{ url: s.image.src }] },
  };
}

export default async function CapabilityPage({ params }: PageProps<"/capabilities/[slug]">) {
  const { slug } = await params;
  const s = serviceById[slug as ServiceId];
  if (!s) notFound();

  const caps = s.capabilityIds.map((id) => capabilityById[id]);
  const related = services.filter((x) => x.id !== s.id);
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.name,
    description: s.summary,
    provider: { "@id": "https://www.rightmfg.com/#org" },
    areaServed: "Southern California and United States",
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
            { name: "Home", path: "/" },
            { name: "Capabilities", path: "/capabilities" },
            { name: s.name, path: `/capabilities/${s.id}` },
          ]),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Capabilities", href: "/capabilities" }, { label: s.name }]}
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
            <Button href={`/start-a-project?service=${s.id}`}>Start a project</Button>
            <Button href="#processes" variant="ghost-light" arrow={false}>
              View processes
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
              <BlockTitle index="01" label="Overview" />
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
                <p className="label mt-8 border-l-2 border-blue pl-4 text-steel">
                  Performed by {apc.name} ({apc.short}), Right&apos;s sister company and {apc.years}-year partner
                </p>
              )}
            </section>

            {/* 02 Processes */}
            <section id="processes" aria-labelledby="processes-title" className="scroll-mt-24">
              <BlockTitle index="02" label="Processes" title="What's included" id="processes-title" />
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
                        <span className="label mr-2 text-[0.66rem] text-steel-400">Applications</span>
                        {c.applications.join(" · ")}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </section>

            {/* 03 Technical */}
            <section id="equipment" aria-labelledby="tech-title" className="scroll-mt-24">
              <BlockTitle index="03" label="Technical details" title="On the floor" id="tech-title" />
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
              <p className="label mt-3 text-[0.62rem] text-steel-400">Equipment and processes as published by Right Manufacturing. Tolerances are confirmed per drawing.</p>

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
              <BlockTitle index="04" label="Supported materials" title="Materials" id="materials-title" />
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
              <BlockTitle index="05" label="Markets" title="Where it's used" id="markets-title" />
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
              <BlockTitle index="06" label="Questions" title="Frequently asked" id="faq-title" />
              <div className="mt-10">
                <FaqList faqs={s.faqs} />
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <CanRightBuildIt questions={s.questions} context={s.id} />
              <nav aria-label="Related capabilities" className="border border-navy/15 bg-white p-5">
                <p className="label text-steel">Related capabilities</p>
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

      <CtaBand title={`Need ${s.name.toLowerCase()}? Send the drawing.`} />
    </>
  );
}
