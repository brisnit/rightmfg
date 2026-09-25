import { SectionHeader } from "@/components/ui/SectionHeader";
import { FinderPanel } from "@/components/finder/FinderPanel";
import { exampleQuestions } from "@/data/finder-knowledge";

export function FinderSection() {
  return (
    <section id="finder" aria-labelledby="finder-title" className="blueprint relative scroll-mt-20 bg-navy py-20 text-white lg:py-32">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/60 to-transparent" aria-hidden />
      <div className="container-x relative">
        <SectionHeader
          tone="dark"
          index="03"
          label="Capability Finder"
          id="finder-title"
          title={
            <>
              Not sure which
              <br />
              process you need?
            </>
          }
          intro="Describe the part, material or manufacturing challenge. The Capability Finder matches your requirements to Right's verified capabilities and explains why each one applies."
        />
        <div className="mt-12 lg:mt-16">
          <FinderPanel listen scrollTargetId="finder" suggestions={exampleQuestions.slice(0, 4)} />
        </div>
      </div>
    </section>
  );
}
