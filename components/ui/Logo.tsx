import Link from "next/link";

/**
 * Typographic rebuild of the existing RIGHT MANUFACTURING wordmark
 * (wide, heavy "RIGHT" over tracked "MANUFACTURING"), so it scales crisply
 * and works on dark and light grounds.
 */
export function Logo({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const color = tone === "light" ? "text-white" : "text-navy";
  return (
    <Link href="/" aria-label="Right Manufacturing home" className={`group inline-flex flex-col leading-none ${color} ${className}`}>
      <span
        className="block text-[1.55rem] font-[900] tracking-[0.02em]"
        style={{ fontStretch: "125%", fontVariationSettings: '"wdth" 125', lineHeight: 0.82 }}
      >
        RIGHT
      </span>
      <span
        className="mt-[3px] block text-[0.56rem] font-medium tracking-[0.305em]"
        style={{ fontStretch: "125%", fontVariationSettings: '"wdth" 125' }}
      >
        MANUFACTURING
      </span>
    </Link>
  );
}
