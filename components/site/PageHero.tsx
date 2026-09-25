import Image from "next/image";
import Link from "@/components/ui/LocaleLink";
import type { ReactNode } from "react";
import type { ImageRef } from "@/data/types";
import { getI18n } from "@/lib/i18n/server";

export type TitleSize = "xl" | "lg" | "md";

const TITLE_SIZES: Record<TitleSize, string> = {
  xl: "text-[clamp(2.6rem,9vw,8rem)]",
  lg: "text-[clamp(2.3rem,7vw,6.4rem)]",
  md: "text-[clamp(1.9rem,5.6vw,5rem)]",
};

/** Pick a title size from the longest word so wide display type never overflows (390px → 1440px). */
export function titleSize(text: string): TitleSize {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.replace(/[^A-Za-z0-9]/g, "").length));
  return longest <= 7 ? "xl" : longest <= 10 ? "lg" : "md";
}

export interface Crumb {
  label: string;
  href?: string;
}

/** Inner-page hero: full-bleed photo (or video), breadcrumb, huge title, optional spec strip. */
export async function PageHero({
  crumbs,
  eyebrow,
  title,
  subtitle,
  intro,
  image,
  video,
  actions,
  specs,
  compact = false,
  size = "xl",
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  intro?: ReactNode;
  image?: ImageRef;
  video?: { src: string; poster: string };
  actions?: ReactNode;
  specs?: { label: string; value: string }[];
  compact?: boolean;
  size?: TitleSize;
}) {
  const breadcrumbLabel = (await getI18n()).dict.a11y.breadcrumb;
  return (
    <section className={`relative isolate flex flex-col overflow-hidden bg-ink text-white ${compact ? "min-h-[26rem]" : "min-h-[40rem] lg:min-h-[48rem]"}`}>
      {video ? (
        <video className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70 photo-grade motion-reduce:hidden" poster={video.poster} autoPlay muted loop playsInline preload="metadata" aria-hidden>
          <source src={video.src} type="video/mp4" />
        </video>
      ) : null}
      {image && (
        <Image
          src={video ? video.poster : image.src}
          alt={video ? "" : image.alt}
          fill
          preload
          loading="eager"
          sizes="100vw"
          className={`-z-20 object-cover opacity-70 photo-grade`}
          style={{ objectPosition: image.position ?? "50% 50%" }}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r rtl:bg-gradient-to-l from-ink via-ink/80 to-ink/25" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/60" aria-hidden />
      <div className="blueprint absolute inset-0 -z-10 opacity-50 [mask-image:linear-gradient(to_right,black,transparent_65%)] rtl:[mask-image:linear-gradient(to_left,black,transparent_65%)]" aria-hidden />

      <div className={`container-x flex flex-1 flex-col justify-end pt-32 ${specs ? "pb-12" : "pb-16 lg:pb-20"} lg:pt-40`}>
        <nav aria-label={breadcrumbLabel} className="rise">
          <ol className="label flex flex-wrap items-center gap-2 text-[0.68rem] text-white/60">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {c.label}
                  </span>
                )}
                {i < crumbs.length - 1 && <span className="text-white/30">/</span>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="label rise mt-8 text-blue-bright">{eyebrow}</p>}
        <h1 className={`display rise ${eyebrow ? "mt-4" : "mt-8"} ${TITLE_SIZES[size]} leading-[0.86]`} style={{ ["--d" as string]: "60ms" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="heading rise mt-6 text-[clamp(1.35rem,3vw,2.4rem)] uppercase text-gray" style={{ ["--d" as string]: "120ms" }}>
            {subtitle}
          </p>
        )}
        {intro && (
          <div className="rise mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-white/80 sm:text-lg" style={{ ["--d" as string]: "180ms" }}>
            {intro}
          </div>
        )}
        {actions && (
          <div className="rise mt-8 flex flex-col gap-3 xs:flex-row" style={{ ["--d" as string]: "240ms" }}>
            {actions}
          </div>
        )}
      </div>

      {specs && (
        <div className="border-t border-white/10 bg-ink/70">
          <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
            {specs.map((s, i) => (
              <div key={s.label} className={`border-white/10 py-5 ${i % 2 ? "border-s ps-4 sm:ps-6" : "pe-4"} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-s lg:ps-6" : ""}`}>
                <dt className="label text-[0.66rem] text-white/55">{s.label}</dt>
                <dd className="heading mt-1.5 text-lg text-white sm:text-xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
