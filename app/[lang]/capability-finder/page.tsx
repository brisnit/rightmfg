import type { Metadata } from "next";
import { FinderPage } from "./FinderPage";
import { getI18n } from "@/lib/i18n/server";
import { alternatesFor } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return { title: dict.meta.finderTitle, description: dict.meta.finderDescription, alternates: alternatesFor(locale, "/capability-finder") };
}

export default async function CapabilityFinderPage() {
  const { content } = await getI18n();
  return <FinderPage counts={{ capabilities: content.capabilities.length, materials: content.materials.length, markets: content.markets.length }} />;
}
