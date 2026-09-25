import { Hero } from "@/components/home/Hero";
import { StatsBand } from "@/components/home/StatsBand";
import { CapabilitiesGrid } from "@/components/home/CapabilitiesGrid";
import { FinderSection } from "@/components/home/FinderSection";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { MarketsExplorer } from "@/components/home/MarketsExplorer";
import { TeamStory } from "@/components/home/TeamStory";
import { Facility } from "@/components/home/Facility";
import { FinishingPartner } from "@/components/home/FinishingPartner";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { getI18n } from "@/lib/i18n/server";

export default async function HomePage() {
  const { dict } = await getI18n();
  const d = dict.marketsSection;
  return (
    <>
      <Hero />
      <StatsBand />
      <CapabilitiesGrid />
      <FinderSection />
      <ProcessTimeline />

      <section aria-labelledby="markets-title" className="bg-ink py-20 text-white lg:py-32">
        <div className="container-x">
          <SectionHeader
            tone="dark"
            index="05"
            label={d.label}
            id="markets-title"
            title={d.title}
            intro={d.intro}
          />
          <div className="mt-12 lg:mt-16">
            <MarketsExplorer />
          </div>
          <div className="mt-10">
            <Button href="/markets" variant="ghost-light">
              {d.all}
            </Button>
          </div>
        </div>
      </section>

      <TeamStory />
      <Facility />
      <FinishingPartner />
      <CtaBand />
    </>
  );
}
