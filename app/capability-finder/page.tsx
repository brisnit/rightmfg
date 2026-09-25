import type { Metadata } from "next";
import { FinderPage } from "./FinderPage";
import { capabilities } from "@/data/capabilities";
import { materials } from "@/data/materials";
import { markets } from "@/data/markets";

export const metadata: Metadata = {
  title: "Capability Finder: Can Right Build It?",
  description:
    "Describe the part you need made. The Capability Finder matches it to Right Manufacturing's verified tube bending, sheet metal, welding, assembly and finishing capabilities, and explains why each applies.",
  alternates: { canonical: "/capability-finder" },
};

export default function CapabilityFinderPage() {
  return (
    <FinderPage
      counts={{ capabilities: capabilities.length, materials: materials.length, markets: markets.length }}
    />
  );
}
