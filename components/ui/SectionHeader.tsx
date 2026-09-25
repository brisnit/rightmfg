import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Section opener: index + label on a drawn rule, big display headline, optional intro. */
export function SectionHeader({
  index,
  label,
  title,
  intro,
  tone = "light",
  id,
  aside,
  className = "",
  compact = false,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  id?: string;
  aside?: ReactNode;
  className?: string;
  /** For narrow columns: full-width, smaller headline, no side intro. */
  compact?: boolean;
}) {
  const dark = tone === "dark";
  if (compact) {
    return (
      <div className={className}>
        <Reveal plain className="flex items-center gap-4">
          {index && <span className={`label tabular ${dark ? "text-blue-bright" : "text-blue"}`}>{index}</span>}
          <span className={`label ${dark ? "text-white/70" : "text-steel"}`}>{label}</span>
          <span className={`rule-draw h-px flex-1 ${dark ? "bg-white/15" : "bg-navy/15"}`} aria-hidden />
        </Reveal>
        <Reveal>
          <h2 id={id} className={`display mt-8 text-[clamp(1.9rem,3.2vw,3.1rem)] ${dark ? "text-white" : "text-navy"}`}>
            {title}
          </h2>
        </Reveal>
        {intro && <div className={`mt-5 max-w-md text-[1.05rem] leading-relaxed ${dark ? "text-white/75" : "text-steel"}`}>{intro}</div>}
      </div>
    );
  }
  return (
    <div className={className}>
      <Reveal plain className="relative">
        <div className="flex items-center gap-4">
          {index && <span className={`label tabular ${dark ? "text-blue-bright" : "text-blue"}`}>{index}</span>}
          <span className={`label ${dark ? "text-white/70" : "text-steel"}`}>{label}</span>
          <span className={`rule-draw h-px flex-1 ${dark ? "bg-white/15" : "bg-navy/15"}`} aria-hidden />
        </div>
      </Reveal>
      <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:items-end">
        <Reveal className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          <h2 id={id} className={`display text-[clamp(2.1rem,5.6vw,5rem)] ${dark ? "text-white" : "text-navy"}`}>
            {title}
          </h2>
        </Reveal>
        {(intro || aside) && (
          <Reveal delay={120} className={aside ? "lg:col-span-5" : "lg:col-span-3"}>
            {intro && <div className={`max-w-md text-[1.05rem] leading-relaxed ${dark ? "text-white/75" : "text-steel"}`}>{intro}</div>}
            {aside}
          </Reveal>
        )}
      </div>
    </div>
  );
}
