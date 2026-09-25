import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { materials, materialById, tubeShapes } from "@/data/materials";
import { capabilityById, categoryLabels } from "@/data/capabilities";
import { serviceHref } from "@/data/services";
import type { MaterialId } from "@/data/types";
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
  return materials.map((m) => ({ slug: m.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/materials/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = materialById[slug as MaterialId];
  if (!m) return {};
  return { title: `${m.name} Fabrication`, description: m.description, alternates: { canonical: `/materials/${m.id}` } };
}

const materialFaqs = [
  { q: "Is aluminum stronger than steel?", a: "Steel is usually stronger, but aluminum is lighter and resists corrosion well. Right recommends aluminum where weight matters and steel for heavy-duty strength." },
  { q: "How do I choose a metal for my project?", a: "It depends on how the part will be used, the stress it handles and the finish it needs. Right's team looks at strength, corrosion resistance, weight and weldability to match the metal to the job." },
  { q: "Do you stock material?", a: "Right keeps a consistent inventory to support fast turnaround and scalable production, and checks material compatibility for both function and finish." },
];

export default async function MaterialPage({ params }: PageProps<"/materials/[slug]">) {
  const { slug } = await params;
  const m = materialById[slug as MaterialId];
  if (!m) notFound();
  const procs = m.processes.map((id) => capabilityById[id]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Capabilities", path: "/capabilities" },
          { name: m.name, path: `/materials/${m.id}` },
        ])}
      />
      <PageHero
        compact
        crumbs={[{ label: "Home", href: "/" }, { label: "Capabilities", href: "/capabilities" }, { label: "Materials" }, { label: m.name }]}
        eyebrow="Material"
        title={m.name}
        size={titleSize(m.name)}
        intro={m.description}
        image={m.image}
        actions={<Button href={`/start-a-project?mat=${m.id}`}>Start a project</Button>}
      />
      <div className="bg-paper">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="min-w-0 space-y-20 lg:col-span-8">
            <section aria-labelledby="cons">
              <BlockTitle index="01" label="Considerations" title="When to specify it" id="cons" />
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
              <BlockTitle index="02" label="Processes" title={`Processes for ${m.short.toLowerCase()}`} id="procs" />
              <ul className="mt-8 grid border-l border-t border-navy/15 sm:grid-cols-2">
                {procs.map((c) => (
                  <li key={c.id} className="border-b border-r border-navy/15 bg-paper">
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
              <BlockTitle index="03" label="Forms" title="Sheet, tube & profile" id="forms" />
              <ul className="mt-8 grid border-l border-t border-navy/15 sm:grid-cols-2 lg:grid-cols-3">
                <li className="border-b border-r border-navy/15 bg-paper p-5">
                  <p className="heading uppercase text-navy">Sheet metal</p>
                  <p className="mt-1 text-sm text-steel">Sheared, punched and press-brake formed</p>
                </li>
                {tubeShapes.map((t) => (
                  <li key={t.id} className="border-b border-r border-navy/15 bg-paper p-5">
                    <p className="heading uppercase text-navy">{t.name}</p>
                    {t.note && <p className="mt-1 text-sm text-steel">{t.note}</p>}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="mfaq">
              <BlockTitle index="04" label="Questions" title="Material FAQs" id="mfaq" />
              <div className="mt-8">
                <FaqList faqs={materialFaqs} />
              </div>
            </section>

            <nav aria-label="Other materials" className="flex flex-wrap gap-3">
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
              <CanRightBuildIt context={m.id} questions={[`${m.short} tube frame with welded brackets`, `Formed ${m.short.toLowerCase()} enclosure with hardware`, "Which material should I use?"]} />
            </div>
          </div>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
