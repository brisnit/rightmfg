import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { markets } from "@/data/markets";
import { materials } from "@/data/materials";
import { SITE_URL, alternatesFor, locales, localizeHref } from "@/lib/i18n/config";

/** Every page in every language, with hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/capabilities",
    ...services.map((s) => `/capabilities/${s.id}`),
    ...materials.map((m) => `/materials/${m.id}`),
    "/markets",
    ...markets.map((m) => `/markets/${m.id}`),
    "/capability-finder",
    "/about",
    "/resources",
    "/start-a-project",
  ];
  return locales.flatMap((l) =>
    paths.map((p) => ({
      url: SITE_URL + localizeHref(l, p),
      changeFrequency: "monthly" as const,
      priority: p === "/" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(Object.entries(alternatesFor(l, p).languages).map(([k, v]) => [k, SITE_URL + v])) },
    })),
  );
}
