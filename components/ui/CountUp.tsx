"use client";

import { useEffect, useState } from "react";
import { useInView } from "./Reveal";

/**
 * Counts to `value` when scrolled into view. The final value is server-rendered,
 * so the number is correct without JS and for crawlers. Reduced motion shows
 * the final value immediately.
 */
export function CountUp({ value, display, prefix = "", suffix = "", className = "" }: { value: number; display?: string; prefix?: string; suffix?: string; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const final = display ?? value.toLocaleString("en-US");
  const [text, setText] = useState(final);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = display ? parseFloat(display) : value;
    const unit = display ? display.replace(/[\d.]/g, "") : "";
    const dur = 1300;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      const n = Math.round(target * eased);
      setText(display ? `${n}${unit}` : n.toLocaleString("en-US"));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, display]);

  return (
    <span ref={ref} className={`tabular ${className}`} aria-label={`${prefix}${final}${suffix}`}>
      <span aria-hidden>
        {prefix}
        {text}
        {suffix}
      </span>
    </span>
  );
}
