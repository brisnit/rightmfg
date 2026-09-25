import Image from "next/image";
import Link from "@/components/ui/LocaleLink";

/**
 * Right Manufacturing wordmark (official artwork, trimmed copies of
 * rmfgwhite.png / rmfgBlue.png). White for dark grounds, navy for light.
 */
export function Logo({ tone = "light", className = "", preload = false }: { tone?: "light" | "dark"; className?: string; preload?: boolean }) {
  const light = tone === "light";
  return (
    <Link href="/" aria-label="Right Manufacturing home" className={`inline-flex shrink-0 ${className}`}>
      <Image
        src={light ? "/images/logo-white.png" : "/images/logo-navy.png"}
        alt="Right Manufacturing"
        width={800}
        height={light ? 145 : 142}
        sizes="160px"
        preload={preload}
        className="h-auto w-[132px] lg:w-[152px]"
      />
    </Link>
  );
}
