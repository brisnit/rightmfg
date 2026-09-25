"use client";

import { useState, type FormEvent } from "react";
import { askFinder } from "@/lib/finder/events";
import { ArrowRight, Reticle } from "@/components/ui/Icons";

/** Single-line Finder entry used in the hero and on detail-page sidebars. */
export function CompactFinder({
  id,
  label = "What do you need to manufacture?",
  placeholder = "Describe your part, product or manufacturing challenge…",
  suggestions = [],
  tone = "dark",
  button = "Find",
  stacked = false,
  prefix = "",
}: {
  id: string;
  label?: string;
  placeholder?: string;
  suggestions?: string[];
  tone?: "dark" | "light";
  button?: string;
  stacked?: boolean;
  /** Prepended to the query for context, e.g. "Tube bending: ". */
  prefix?: string;
}) {
  const [value, setValue] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) askFinder(prefix + value.trim());
  };
  const dark = tone === "dark";

  return (
    <div>
      <form onSubmit={submit} role="search" aria-label="Capability Finder">
        <label htmlFor={id} className={`label block ${dark ? "text-white" : "text-navy"}`}>
          {label}
        </label>
        <div
          className={`mt-3 flex transition-[border-color,box-shadow,transform] duration-300 ${stacked ? "flex-col" : "items-stretch"} ${
            dark
              ? "border border-white/25 bg-ink/55 focus-within:border-blue-bright focus-within:shadow-[0_0_0_4px_rgb(74_155_240/0.14)]"
              : "border border-navy/20 bg-white focus-within:border-blue focus-within:shadow-[0_0_0_4px_rgb(20_99_201/0.1)]"
          }`}
        >
          <div className="flex flex-1 items-center">
            <Reticle size={20} className={`ml-4 shrink-0 ${dark ? "text-blue-bright" : "text-blue"}`} />
            <input
              id={id}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              autoComplete="off"
              enterKeyHint="search"
              className={`h-14 min-w-0 flex-1 bg-transparent px-3 text-base focus:outline-none sm:h-16 sm:text-[1.05rem] ${dark ? "text-white placeholder:text-white/45" : "text-graphite placeholder:text-steel-400"}`}
            />
          </div>
          <button
            type="submit"
            className={`label flex shrink-0 items-center justify-center gap-2 bg-blue text-white transition-colors hover:bg-blue-600 ${stacked ? "h-12" : "w-14 sm:w-auto sm:px-6"}`}
            aria-label={button}
          >
            <span className={stacked ? "" : "hidden sm:inline"}>{button}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
      {suggestions.length > 0 && (
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => askFinder(s)}
              className={`shrink-0 border px-3 py-2 text-[0.85rem] transition-colors ${
                dark ? "border-white/20 bg-ink/30 text-white/85 hover:border-white hover:text-white" : "border-navy/15 text-navy hover:border-blue hover:text-blue"
              }`}
            >
              &ldquo;{s}&rdquo;
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
