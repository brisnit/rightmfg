import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function BlockTitle({ index, label, title, id, tone = "light" }: { index: string; label: string; title?: ReactNode; id?: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div>
      <Reveal plain className="flex items-center gap-4">
        <span className={`label tabular ${dark ? "text-blue-bright" : "text-blue"}`}>{index}</span>
        <span className={`label ${dark ? "text-white/70" : "text-steel"}`}>{label}</span>
        <span className={`rule-draw h-px flex-1 ${dark ? "bg-white/15" : "bg-navy/15"}`} aria-hidden />
      </Reveal>
      {title && (
        <Reveal>
          <h2 id={id} className={`display mt-6 text-[clamp(1.8rem,3.6vw,3rem)] ${dark ? "text-white" : "text-navy"}`}>
            {title}
          </h2>
        </Reveal>
      )}
    </div>
  );
}
