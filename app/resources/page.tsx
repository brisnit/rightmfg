import type { Metadata } from "next";
import { faqs } from "@/data/faqs";
import { services } from "@/data/services";
import { company, equipment, images } from "@/data/company";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqList, faqJsonLd } from "@/components/site/FaqList";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";
import { Download } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Resources: FAQs, Brochure & Fabrication Glossary",
  description: "Answers to common questions about Right Manufacturing's capabilities, materials and prototypes, plus the RIGHT/APC brochure and a glossary of fabrication terms.",
  alternates: { canonical: "/resources" },
};

/** Plain-language definitions of terms used on this site. */
const glossary = [
  { t: "Mandrel tube bending", d: "Bending tube around a die while an internal mandrel supports the wall, so the tube keeps its shape through tighter bends." },
  { t: "3D bending", d: "Bends in more than one plane on a single part: tube or channel rotated between bends to create multi-plane geometry." },
  { t: "Plane of bend", d: "The rotational orientation of each bend relative to the previous one. Controlling it keeps 3D parts repeatable." },
  { t: "Pressure die assist", d: "A pressure die that pushes the tube forward during bending to help control the wall through the bend." },
  { t: "Pipe vs. tube", d: "Pipe is identified by inside diameter plus wall (schedule). Tube is identified by outside diameter plus wall (gauge)." },
  { t: "CNC turret punch", d: "A CNC machine that punches holes, slots and shapes into flat sheet from a turret of interchangeable tools." },
  { t: "CNC press brake", d: "A hydraulic press that drives die-sets into flat sheet to form bends, radii and curls. CNC controls sequence, pressure, dwell and part position." },
  { t: "MIG welding", d: "Wire-fed arc welding: fast, strong welds for structural and production work." },
  { t: "TIG welding", d: "Tungsten arc welding with a separately fed filler rod, giving detailed control for visible, thin or stainless and aluminum work." },
  { t: "Spot welding", d: "Resistance welding that joins overlapping sheet at discrete points without filler metal." },
  { t: "Powder coating", d: "A dry powder applied to prepared metal and cured into a hard, durable finish." },
  { t: "Cerakote", d: "A thin-film ceramic coating used where a durable, thin finish is needed." },
];

export default function ResourcesPage() {
  const allFaqs = [...faqs, ...services.flatMap((s) => s.faqs)];
  return (
    <>
      <JsonLd data={faqJsonLd(allFaqs)} />
      <PageHero compact crumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]} eyebrow="Resources" title="Resources" size="lg" intro="Answers, downloads and the terms engineers use when specifying fabricated parts." image={images.tubeStock} />

      <section aria-labelledby="dl" className="bg-paper py-16 lg:py-20">
        <div className="container-x grid gap-px border border-navy/15 bg-navy/15 md:grid-cols-2">
          <a href={company.brochure} target="_blank" rel="noopener" className="group flex items-center justify-between gap-6 bg-white p-6 hover:bg-mist lg:p-8">
            <span>
              <span className="label text-blue">Download · PDF · 6 pages</span>
              <span id="dl" className="heading mt-2 block text-2xl uppercase text-navy">
                RIGHT / APC Brochure
              </span>
              <span className="mt-1 block text-steel">Equipment, tube bending, welding, finishing and markets.</span>
            </span>
            <Download size={26} className="shrink-0 text-blue transition-transform group-hover:translate-y-0.5" />
          </a>
          <div className="bg-white p-6 lg:p-8">
            <span className="label text-blue">Equipment list</span>
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
            <SectionHeader compact index="01" label="FAQs" id="faq" title="Questions, answered." />
          </div>
          <div className="lg:col-span-8 lg:pt-20">
            <FaqList faqs={allFaqs} />
          </div>
        </div>
      </section>

      <section aria-labelledby="gloss" className="bg-ink py-16 text-white lg:py-24">
        <div className="container-x">
          <SectionHeader tone="dark" index="02" label="Glossary" id="gloss" title="Fabrication terms, defined." />
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
