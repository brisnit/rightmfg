"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { capabilities, categoryLabels, categoryOrder } from "@/data/capabilities";
import { materials } from "@/data/materials";
import { markets } from "@/data/markets";
import { serviceHref } from "@/data/services";
import type { CapabilityCategory, MarketId, MaterialId, ProductionNeed } from "@/data/types";
import { ArrowUpRight, Close } from "@/components/ui/Icons";

const NEEDS: { id: ProductionNeed; label: string }[] = [
  { id: "prototype", label: "Prototype" },
  { id: "rush", label: "Rush / 48-hr" },
  { id: "low-volume", label: "Low volume / high mix" },
  { id: "production", label: "Production" },
];

type Filters = {
  process: CapabilityCategory | "";
  material: MaterialId | "";
  market: MarketId | "";
  need: ProductionNeed | "";
};

function Select<T extends string>({ id, label, value, onChange, options }: { id: string; label: string; value: T | ""; onChange: (v: T | "") => void; options: { id: T; label: string }[] }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="label block text-[0.66rem] text-steel">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T | "")}
          className={`h-12 w-full appearance-none border bg-white pl-3 pr-9 text-[0.98rem] focus:border-blue focus:outline-none ${value ? "border-blue text-navy" : "border-navy/20 text-steel"}`}
        >
          <option value="">Any</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-steel" aria-hidden>
          ▾
        </span>
      </div>
    </div>
  );
}

export function CapabilityExplorer() {
  const params = useSearchParams();
  const pinned = useMemo(() => (params.get("caps") ?? "").split(",").filter(Boolean), [params]);
  const [f, setF] = useState<Filters>({ process: "", material: "", market: "", need: "" });
  const [usePinned, setUsePinned] = useState(true);

  const results = useMemo(() => {
    return capabilities.filter((c) => {
      if (usePinned && pinned.length && !pinned.includes(c.id)) return false;
      if (f.process && c.category !== f.process) return false;
      if (f.material && !c.materials.includes(f.material)) return false;
      if (f.market && !c.markets.includes(f.market)) return false;
      if (f.need && !c.needs.includes(f.need)) return false;
      return true;
    });
  }, [f, pinned, usePinned]);

  const active = Object.values(f).some(Boolean) || (usePinned && pinned.length > 0);
  const set = <K extends keyof Filters>(k: K) => (v: Filters[K]) => setF((s) => ({ ...s, [k]: v }));

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 border border-navy/15 bg-mist p-4 sm:p-5 lg:grid-cols-[repeat(4,1fr)_auto] lg:items-end">
        <Select id="f-process" label="Process" value={f.process} onChange={set("process")} options={categoryOrder.map((c) => ({ id: c, label: categoryLabels[c] }))} />
        <Select id="f-material" label="Material" value={f.material} onChange={set("material")} options={materials.map((m) => ({ id: m.id, label: m.name }))} />
        <Select id="f-market" label="Market" value={f.market} onChange={set("market")} options={markets.map((m) => ({ id: m.id, label: m.name }))} />
        <Select id="f-need" label="Production need" value={f.need} onChange={set("need")} options={NEEDS} />
        <button
          type="button"
          disabled={!active}
          onClick={() => {
            setF({ process: "", material: "", market: "", need: "" });
            setUsePinned(false);
          }}
          className="label col-span-2 h-12 border border-navy/20 px-4 text-[0.7rem] text-navy hover:border-navy disabled:opacity-40 lg:col-span-1"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="label text-steel" aria-live="polite">
          <span className="text-navy">{results.length}</span> of {capabilities.length} capabilities
        </p>
        {usePinned && pinned.length > 0 && (
          <button type="button" onClick={() => setUsePinned(false)} className="label inline-flex items-center gap-2 border border-blue bg-blue-soft px-3 py-2 text-[0.66rem] text-blue">
            From your Capability Finder match <Close size={12} />
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="mt-6 border border-dashed border-navy/25 p-10 text-center">
          <p className="heading text-xl text-navy">No published capability matches every filter.</p>
          <p className="mt-2 text-steel">Loosen a filter, or describe the part to the Capability Finder so an engineer can take a look.</p>
        </div>
      ) : (
        <ul className="mt-6 grid border-l border-t border-navy/15 md:grid-cols-2 xl:grid-cols-3">
          {results.map((c) => (
            <li key={c.id} className="border-b border-r border-navy/15 bg-paper">
              <Link href={serviceHref(c.service)} className="group flex h-full flex-col p-6 transition-colors hover:bg-white">
                <div className="flex items-start justify-between gap-4">
                  <span className="label text-[0.66rem] text-blue">
                    {categoryLabels[c.category]}
                    {c.partner ? " · via APC" : ""}
                  </span>
                  <ArrowUpRight size={17} className="shrink-0 text-steel-400 transition-colors group-hover:text-blue" />
                </div>
                <h3 className="heading mt-3 text-xl uppercase text-navy">{c.name}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-steel">{c.description}</p>
                <p className="label mt-4 text-[0.64rem] leading-relaxed text-navy">{c.evidence[0]}</p>
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-navy/10 pt-4">
                  {c.materials.map((m) => (
                    <span key={m} className={`label border px-2 py-1 text-[0.6rem] ${f.material === m ? "border-blue text-blue" : "border-navy/15 text-steel"}`}>
                      {materials.find((x) => x.id === m)?.short}
                    </span>
                  ))}
                  {c.needs.map((n) => (
                    <span key={n} className={`label border px-2 py-1 text-[0.6rem] ${f.need === n ? "border-blue text-blue" : "border-navy/15 text-steel"}`}>
                      {NEEDS.find((x) => x.id === n)?.label}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
