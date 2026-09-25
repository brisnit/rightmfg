import type { Metadata } from "next";
import Image from "next/image";
import { company, customers, equipment, images, apc } from "@/data/company";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata: Metadata = {
  title: "About Right Manufacturing: San Diego Metal Fabrication Since the 1990s",
  description:
    "A 35-person San Diego manufacturer averaging 20+ years of experience. Tube bending, sheet metal, welding and assembly for OEMs, with 98% client retention.",
  alternates: { canonical: "/about" },
};

const reasons = [
  { t: "Prototype through production", b: "The same engineers, operators and equipment build your first part and your ten-thousandth. Select prototypes and rush orders turn in 48 hours." },
  { t: "People with decades on the floor", b: "35 people averaging 20+ years of experience. Engineers with 30+ years help with product design, fabrication and assembly." },
  { t: "Equipment on record", b: `${equipment.map((e) => `${e.count} ${e.name.toLowerCase()}`).slice(0, 4).join(", ")}, and more.` },
  { t: "Fewer vendors", b: "Forming, welding, hardware, machining, assembly and packaging, with finishing through APC. Less outsourcing means fewer delays." },
  { t: "Customers stay", b: "98% client retention with OEMs including BD, Covidien, Kinetico and Axeon." },
  { t: "Rooted in San Diego", b: "20,000 sq. ft. in the design, manufacturing and technology hub of Southern California, with a consistent material inventory for fast turnaround." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About Right Manufacturing"
        title={
          <>
            Service first.
            <br />
            <span className="text-gray">Since the 1990s.</span>
          </>
        }
        intro="Right Manufacturing was founded in the heart of San Diego's industrial complex with one mission: support customers with a service-first focus. Nearly three decades later, the mission hasn't changed."
        image={images.brakeOperator}
        size="lg"
        specs={[
          { label: "Founded", value: "1990s" },
          { label: "Team", value: "35 people" },
          { label: "Avg. experience", value: "20+ years" },
          { label: "Facility", value: "20,000 sq. ft." },
        ]}
      />

      <section aria-labelledby="who" className="bg-paper py-16 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader compact index="01" label="Who we are" id="who" title="Advanced fabrication. Innovative forming." />
            <Reveal className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-steel">
              <p>
                Right Manufacturing engineers, designs and produces precision OEM products and components: 3D bending of tube and channel, sheet metal, welding, hardware and assembly. Customers range from medical device makers to off-road, industrial and architectural OEMs across San Diego, Southern California and beyond.
              </p>
              <p>
                The work is led by General Manager Greg Lyon, Customer Service Manager Karra Lyon and Production Manager LH Byrd. Right believes people are its most valuable asset, and it is committed to protecting natural resources and promoting environmental stewardship.
              </p>
              <p className="border-l-2 border-blue pl-5 text-navy">
                The vision: lead in scalable, high-performance manufacturing throughout Southern California and beyond, through continuous improvement and operational discipline.
              </p>
            </Reveal>
          </div>
          <Reveal delay={100} className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink">
              <Image src={images.surfacePrep.src} alt={images.surfacePrep.alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: images.surfacePrep.position }} />
            </div>
            <dl className="mt-px grid grid-cols-2 gap-px bg-navy/15">
              {[
                { v: 98, s: "%", l: "Client retention" },
                { v: 10000, d: "10K", s: "+", l: "Parts / year" },
              ].map((x) => (
                <div key={x.l} className="bg-paper p-5">
                  <dd className="display text-[2.6rem] text-navy">
                    <CountUp value={x.v} display={x.d} />
                    <span className="text-blue">{x.s}</span>
                  </dd>
                  <dt className="label mt-1 text-[0.66rem] text-steel">{x.l}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section id="why-right" aria-labelledby="why" className="scroll-mt-20 bg-ink py-16 text-white lg:py-28">
        <div className="container-x">
          <SectionHeader tone="dark" index="02" label="Why Right" id="why" title="Six reasons OEMs keep coming back." />
          <ol className="mt-12 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <Reveal as="li" key={r.t} delay={(i % 3) * 70} className="bg-ink p-6 lg:p-8">
                <span className="label tabular text-blue-bright">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display mt-4 text-[1.6rem] leading-[0.95]">{r.t}</h3>
                <p className="mt-4 leading-relaxed text-white/70">{r.b}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="lead" className="bg-paper py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader compact index="03" label="Leadership" id="lead" title="The people accountable." />
          </div>
          <ul className="border-t border-navy/15 lg:col-span-7 lg:mt-20">
            {company.leadership.map((p) => (
              <li key={p.name} className="flex flex-col gap-1 border-b border-navy/15 py-6 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="display text-[clamp(1.6rem,3vw,2.4rem)] text-navy">{p.name}</span>
                <span className="label text-steel">{p.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="partner" className="bg-mist py-16 lg:py-24">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12">
          <div className="relative aspect-[3/2] overflow-hidden bg-ink lg:col-span-6">
            <Image src={images.powderBooth.src} alt={images.powderBooth.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="lg:col-span-6">
            <SectionHeader compact index="04" label="Partnership" id="partner" title={`${apc.years} years with APC.`} />
            <p className="mt-6 leading-relaxed text-steel">{apc.summary}</p>
            <Button href="/capabilities/finishing" variant="ghost-dark" className="mt-8">
              Finishing with APC
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="cust" className="bg-paper py-16">
        <div className="container-x">
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
