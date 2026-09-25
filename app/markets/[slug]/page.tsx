import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { markets, marketById } from "@/data/markets";
import { capabilityById, categoryLabels } from "@/data/capabilities";
import { serviceHref } from "@/data/services";
import { customers, images } from "@/data/company";
import { processSteps } from "@/data/processes";
import type { MarketId } from "@/data/types";
import { PageHero, titleSize } from "@/components/site/PageHero";
import { Button } from "@/components/ui/Button";
import { BlockTitle } from "@/components/ui/BlockTitle";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/JsonLd";
import { CanRightBuildIt } from "@/components/capability/CanRightBuildIt";
import { CtaBand } from "@/components/site/CtaBand";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

export function generateStaticParams() {
  return markets.map((m) => ({ slug: m.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/markets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = marketById[slug as MarketId];
  if (!m) return {};
  return {
    title: `${m.name} Manufacturing & Metal Fabrication`,
    description: `${m.summary} ${m.headline}`,
    alternates: { canonical: `/markets/${m.id}` },
  };
}

const questionsFor: Record<MarketId, string[]> = {
  medical: ["Stainless medical equipment frame with welded brackets", "Medical cart with bent tube frame and powder coat", "Can you handle prototypes?"],
  automotive: ["Carbon steel roof rack for off-road trucks, 500 per month", "Bent tube bumper with mounting brackets", "Can you bend square tubing?"],
  military: ["Formed aluminum enclosure with laser part marking", "Welded carbon steel frame, powder coated", "Are you ITAR registered?"],
  industrial: ["Sheet metal enclosure with hardware and powder coat", "Stainless machine guard with punched vents", "Machined aluminum extrusion"],
  architectural: ["Perforated aluminum panels, powder coated", "Bent stainless handrail", "Formed steel brackets for facade mounting"],
  decorative: ["Outdoor steel gate with bent tube and Cerakote", "Decorative bent tube feature, TIG welded", "What finishes can you do?"],
};

export default async function MarketPage({ params }: PageProps<"/markets/[slug]">) {
  const { slug } = await params;
  const m = marketById[slug as MarketId];
  if (!m) notFound();

  const caps = m.capabilityIds.map((id) => capabilityById[id]);
  const custs = customers.filter((c) => m.customerIds?.includes(c.id));
  const others = markets.filter((x) => x.id !== m.id);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Markets", path: "/markets" },
          { name: m.name, path: `/markets/${m.id}` },
        ])}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Markets", href: "/markets" }, { label: m.name }]}
        eyebrow={`Market / ${m.name}`}
        title={
          <>
            {m.short}
            <span className="mt-2 block text-[0.62em] text-gray">manufacturing</span>
          </>
        }
        size={titleSize(m.short)}
        intro={<p className="heading text-[clamp(1.2rem,2.2vw,1.7rem)] leading-snug text-white">{m.headline}</p>}
        image={m.image}
        actions={
          <>
            <Button href={`/start-a-project?market=${m.id}`}>Start a {m.short.toLowerCase()} project</Button>
            <Button href="#capabilities" variant="ghost-light" arrow={false}>
              Relevant capabilities
            </Button>
          </>
        }
      />

      <div className="bg-paper">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="min-w-0 space-y-20 lg:col-span-8 lg:space-y-28">
            {/* 01 What Right builds */}
            <section aria-labelledby="builds-title">
              <BlockTitle index="01" label="Applications" title={`What Right builds for ${m.short.toLowerCase()}`} id="builds-title" />
              <Reveal className="mt-8">
                <p className="text-[1.1rem] leading-relaxed text-steel">{m.summary}</p>
              </Reveal>
              <ul className="mt-10 grid border-t border-navy/15 sm:grid-cols-2">
                {m.applications.map((a, i) => (
                  <Reveal as="li" key={a} delay={i * 50} className="flex items-baseline gap-4 border-b border-navy/15 py-5 pr-4 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-6">
                    <span className="label tabular text-blue">{String(i + 1).padStart(2, "0")}</span>
                    <span className="heading text-xl uppercase text-navy">{a}</span>
                  </Reveal>
                ))}
              </ul>
            </section>

            {/* 02 Why it matters */}
            <section aria-labelledby="why-title">
              <BlockTitle index="02" label="Why it matters" title="Requirements, met by process" id="why-title" />
              <Reveal className="mt-8 grid gap-10 md:grid-cols-5">
                <p className="text-[1.05rem] leading-relaxed text-graphite md:col-span-3">{m.why}</p>
                <figure className="border-l-2 border-blue pl-5 md:col-span-2">
                  <p className="label text-[0.66rem] text-steel">From Right&apos;s markets page</p>
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
              <BlockTitle index="03" label="Capabilities" title="Connected capabilities" id="caps-title" />
              <ul className="mt-10 grid border-l border-t border-navy/15 sm:grid-cols-2">
                {caps.map((c, i) => (
                  <Reveal as="li" key={c.id} delay={(i % 2) * 60} className="border-b border-r border-navy/15 bg-paper">
                    <Link href={serviceHref(c.service)} className="group flex h-full flex-col p-6 transition-colors hover:bg-white">
                      <span className="label text-[0.66rem] text-blue">
                        {categoryLabels[c.category]}
                        {c.partner ? " · via APC" : ""}
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
              <BlockTitle index="04" label="How it runs" title="Prototype to production" id="route-title" />
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
                  See each step <ArrowRight size={14} />
                </Link>
              </Reveal>
            </section>

            {custs.length > 0 && (
              <section aria-labelledby="cust-title">
                <BlockTitle index="05" label="Customers" title="Customers include" id="cust-title" />
                <ul className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-8">
                  {custs.map((c) => (
                    <li key={c.id}>
                      <Image src={c.logo} alt={c.name} width={c.w} height={c.h} className="h-10 w-auto max-w-[10rem] object-contain opacity-70 mix-blend-multiply grayscale" />
                    </li>
                  ))}
                </ul>
                <p className="label mt-6 text-[0.62rem] text-steel-400">As listed on rightmfg.com</p>
              </section>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <CanRightBuildIt questions={questionsFor[m.id]} context={m.id} />
              <nav aria-label="Other markets" className="border border-navy/15 bg-white p-5">
                <p className="label text-steel">Other markets</p>
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
      <CtaBand title={`Building for ${m.short.toLowerCase()}? Let's talk.`} />
    </>
  );
}
