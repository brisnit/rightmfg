import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { markets } from "@/data/markets";
import { materials } from "@/data/materials";

const SITE = "https://www.rightmfg.com";

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
  return paths.map((p) => ({ url: `${SITE}${p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
