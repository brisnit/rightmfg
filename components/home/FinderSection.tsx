import { SectionHeader } from "@/components/ui/SectionHeader";
import { FinderPanel } from "@/components/finder/FinderPanel";
import { getI18n } from "@/lib/i18n/server";

export async function FinderSection() {
  const { dict, content } = await getI18n();
  const d = dict.finderSection;
  return (
    <section id="finder" aria-labelledby="finder-title" className="blueprint relative scroll-mt-20 bg-navy py-20 text-white lg:py-32">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/60 to-transparent" aria-hidden />
      <div className="container-x relative">
        <SectionHeader
          tone="dark"
          index="03"
          label={d.label}
          id="finder-title"
          title={
            <>
              {d.title1}
              <br />
              {d.title2}
            </>
          }
          intro={d.intro}
        />
        <div className="mt-12 lg:mt-16">
          <FinderPanel listen scrollTargetId="finder" suggestions={content.exampleQuestions.slice(0, 4)} />
        </div>
      </div>
    </section>
  );
}
