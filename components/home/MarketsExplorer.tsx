"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { markets } from "@/data/markets";
import { capabilityById } from "@/data/capabilities";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

/** Desktop: index list + live preview. Mobile: stacked modules. */
export function MarketsExplorer() {
  const [active, setActive] = useState(0);
  const m = markets[active];

  return (
    <>
      {/* Desktop */}
      <div className="hidden gap-px bg-white/10 lg:grid lg:grid-cols-12">
        <ul className="bg-ink lg:col-span-5" role="list">
          {markets.map((mk, i) => (
            <li key={mk.id} className="border-b border-white/10 last:border-b-0">
              <Link
                href={`/markets/${mk.id}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-current={i === active ? "true" : undefined}
                className="group flex items-center gap-6 px-8 py-7"
              >
                <span className={`label tabular transition-colors ${i === active ? "text-blue-bright" : "text-white/35"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`display flex-1 text-[2rem] transition-colors ${i === active ? "text-white" : "text-white/45 group-hover:text-white/80"}`}>{mk.short}</span>
                <ArrowRight size={20} className={`transition-all duration-300 ${i === active ? "translate-x-0 text-white opacity-100" : "-translate-x-2 opacity-0"}`} />
              </Link>
            </li>
          ))}
        </ul>
        <div className="relative min-h-[36rem] overflow-hidden bg-ink lg:col-span-7" aria-live="polite">
          {markets.map((mk, i) => (
            <Image
              key={mk.id}
              src={mk.image.src}
              alt=""
              fill
              sizes="58vw"
              className={`object-cover photo-grade transition-[opacity,transform] duration-700 ease-[var(--ease-precise)] ${i === active ? "scale-100 opacity-60" : "scale-[1.04] opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/20" aria-hidden />
          <div key={m.id} className="relative flex h-full flex-col justify-end p-10">
            <p className="label rise text-blue-bright">{m.name}</p>
            <p className="heading rise mt-3 max-w-xl text-[1.9rem] text-white" style={{ ["--d" as string]: "60ms" }}>
              {m.headline}
            </p>
            <p className="rise mt-4 max-w-xl leading-relaxed text-white/80" style={{ ["--d" as string]: "120ms" }}>
              {m.why}
            </p>
            <ul className="rise mt-6 flex flex-wrap gap-2" style={{ ["--d" as string]: "180ms" }}>
              {m.capabilityIds.slice(0, 6).map((id) => (
                <li key={id} className="label border border-white/20 bg-ink/40 px-2.5 py-1.5 text-[0.66rem] text-white">
                  {capabilityById[id].name.split(" —")[0]}
                </li>
              ))}
            </ul>
            <Link href={`/markets/${m.id}`} className="label rise mt-8 inline-flex items-center gap-2 self-start border-b border-white/40 pb-1 text-white hover:border-white" style={{ ["--d" as string]: "240ms" }}>
              {m.short} manufacturing <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile / tablet */}
      <ul className="grid gap-px bg-white/10 sm:grid-cols-2 lg:hidden">
        {markets.map((mk, i) => (
          <li key={mk.id} className="bg-ink">
            <Link href={`/markets/${mk.id}`} className="group block">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={mk.image.src} alt={mk.image.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover photo-grade opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                <span className="label tabular absolute left-4 top-4 text-white/80">{String(i + 1).padStart(2, "0")}</span>
                <span className="display absolute bottom-4 left-4 text-[1.8rem] text-white">{mk.short}</span>
                <ArrowUpRight size={20} className="absolute bottom-5 right-4 text-white/70" />
              </div>
              <div className="p-4 pb-6">
                <p className="leading-relaxed text-white/80">{mk.summary}</p>
                <p className="label mt-4 text-[0.66rem] leading-relaxed text-gray">
                  {mk.capabilityIds
                    .slice(0, 4)
                    .map((id) => capabilityById[id].name.split(" —")[0])
                    .join(" · ")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
