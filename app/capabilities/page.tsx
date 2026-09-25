import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { services } from "@/data/services";
import { materials } from "@/data/materials";
import { images } from "@/data/company";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CapabilityExplorer } from "@/components/explorer/CapabilityExplorer";
import { CompactFinder } from "@/components/finder/CompactFinder";
import { CtaBand } from "@/components/site/CtaBand";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { suggestedSearches } from "@/data/finder-knowledge";

export const metadata: Metadata = {
  title: "Capabilities: Tube Bending, Sheet Metal, Welding & Assembly",
  description:
    "Mandrel and 3D tube bending, CNC turret punching, CNC press brakes, MIG/TIG/spot welding, hardware installation, CNC machining, assembly and finishing in San Diego.",
  alternates: { canonical: "/capabilities" },
};

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Capabilities" }]}
        eyebrow="Capabilities"
        title={
          <>
            Form. Weld.
            <br />
            <span className="text-gray">Assemble.</span>
          </>
        }
        intro="Tube bending, sheet metal, welding, hardware, machining and assembly, with finishing through APC. Everything below is on Right's published record."
        image={images.brakeDetail}
        size="lg"
        actions={
          <>
            <Button href="#explorer">Open the explorer</Button>
            <Button href="/capability-finder" variant="ghost-light">
              Ask the Capability Finder
            </Button>
          </>
        }
      />

      {/* Service index */}
      <section aria-labelledby="services-title" className="bg-paper py-16 lg:py-24">
        <div className="container-x">
          <SectionHeader index="01" label="Services" id="services-title" title="Capability overview" intro="Each service page covers processes, equipment, materials and markets." />
          <ul className="mt-12 border-t border-navy/15">
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 40} className="border-b border-navy/15">
                <Link href={`/capabilities/${s.id}`} className="group grid items-center gap-5 py-6 sm:grid-cols-[3rem_9rem_1fr_auto] sm:gap-8 lg:grid-cols-[3rem_14rem_1.1fr_1fr_auto]">
                  <span className="label tabular hidden text-blue sm:block">{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative block aspect-[16/9] overflow-hidden bg-ink sm:aspect-[4/3]">
                    <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width:1024px) 14rem, (min-width:640px) 9rem, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" style={{ objectPosition: s.image.position }} />
                  </span>
                  <span>
                    <span className="display block text-[clamp(1.6rem,3vw,2.5rem)] text-navy group-hover:text-blue">{s.name}</span>
                    <span className="label mt-2 block text-[0.66rem] text-steel">{s.headline.join(" ")}</span>
                  </span>
                  <span className="hidden text-[0.95rem] leading-relaxed text-steel lg:block">{s.summary}</span>
                  <ArrowUpRight size={22} className="hidden text-steel-400 transition-colors group-hover:text-blue sm:block" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Materials strip */}
      <section aria-labelledby="mat-title" className="bg-ink py-16 text-white lg:py-24">
        <div className="container-x">
          <SectionHeader tone="dark" index="02" label="Materials" id="mat-title" title="Three metal families. Sheet, tube and extrusion." />
          <ul className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
            {materials.map((m) => (
              <li key={m.id} className="bg-ink">
                <Link href={`/materials/${m.id}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={m.image.src} alt={m.image.alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover opacity-75 photo-grade transition-transform duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                    <span className="display absolute bottom-4 left-5 text-3xl">{m.short}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-[0.95rem] leading-relaxed text-white/75">{m.description}</p>
                    <span className="label mt-4 inline-flex items-center gap-2 text-blue-bright">
                      {m.name} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Explorer */}
      <section id="explorer" aria-labelledby="explorer-title" className="scroll-mt-20 bg-paper py-16 lg:py-24">
        <div className="container-x">
          <SectionHeader
            index="03"
            label="Capability explorer"
            id="explorer-title"
            title="Filter by what you need."
            intro="Know exactly what you need? Filter every published capability by process, material, market and production stage."
          />
          <div className="mt-12">
            <Suspense fallback={<div className="h-40 animate-pulse bg-mist" />}>
              <CapabilityExplorer />
            </Suspense>
          </div>
          <div className="mt-14 grid gap-8 border border-navy/15 bg-white p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="label text-blue">Prefer to describe it?</p>
              <p className="heading mt-2 text-2xl uppercase text-navy">Ask the Capability Finder</p>
              <p className="mt-2 text-steel">Describe the part in plain language. The Finder matches processes and explains why.</p>
            </div>
            <div className="lg:col-span-7">
              <CompactFinder id="caps-finder" tone="light" suggestions={suggestedSearches.slice(0, 3)} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
