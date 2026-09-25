"use client";

import Link from "next/link";
import { CompactFinder } from "@/components/finder/CompactFinder";
import { askFinder } from "@/lib/finder/events";
import { company } from "@/data/company";
import { ArrowRight, Phone, Reticle } from "@/components/ui/Icons";

/** Sticky sidebar tool on capability, market and material pages. */
export function CanRightBuildIt({ questions, prefix = "", context }: { questions: string[]; prefix?: string; context: string }) {
  return (
    <aside aria-label="Can Right build it?" className="border border-navy/15 bg-white">
      <div className="border-b border-navy/10 bg-navy px-5 py-4 text-white">
        <p className="label flex items-center gap-2">
          <Reticle size={16} className="text-blue-bright" />
          Can Right build it?
        </p>
      </div>
      <div className="p-5">
        <CompactFinder
          id={`sidebar-finder-${context}`}
          tone="light"
          label="Describe your requirement"
          placeholder="e.g. 6061 frame, 4 bends, welded tabs"
          button="Ask Capability Finder"
          stacked
          prefix={prefix}
        />
        <p className="label mt-6 text-[0.66rem] text-steel">Engineers also ask</p>
        <ul className="mt-2">
          {questions.map((q) => (
            <li key={q} className="border-b border-navy/10 last:border-b-0">
              <button type="button" onClick={() => askFinder(q)} className="group flex w-full items-start justify-between gap-3 py-3 text-left text-[0.95rem] text-navy hover:text-blue">
                <span>{q}</span>
                <ArrowRight size={15} className="mt-1 shrink-0 text-steel-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-2 border-t border-navy/10">
        <a href={company.phoneHref} className="label flex items-center justify-center gap-2 py-4 text-[0.68rem] text-navy hover:bg-mist">
          <Phone size={14} /> Call
        </a>
        <Link href="/start-a-project" className="label flex items-center justify-center gap-2 border-l border-navy/10 bg-blue py-4 text-[0.68rem] text-white hover:bg-blue-600">
          Start RFQ <ArrowRight size={14} />
        </Link>
      </div>
    </aside>
  );
}
