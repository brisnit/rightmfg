import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectWizard } from "@/components/rfq/ProjectWizard";
import { getI18n } from "@/lib/i18n/server";
import { alternatesFor } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return { title: dict.meta.rfqTitle, description: dict.meta.rfqDescription, alternates: alternatesFor(locale, "/start-a-project") };
}

export default async function StartProjectPage() {
  const { dict } = await getI18n();
  const d = dict.rfqPage;
  return (
    <>
      <section className="blueprint relative bg-ink pb-10 pt-28 text-white lg:pb-14 lg:pt-36">
        <div className="container-x">
          <p className="label text-blue-bright">{d.eyebrow}</p>
          <h1 className="display mt-4 text-[clamp(2.3rem,6.4vw,5.4rem)]">
            {d.title1}
            <span className="text-gray">{d.title2}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/75">
            {d.intro}
          </p>
        </div>
      </section>
      <section className="bg-paper py-10 lg:py-16">
        <div className="container-x">
          <Suspense fallback={<div className="h-96 animate-pulse bg-mist" />}>
            <ProjectWizard />
          </Suspense>
        </div>
      </section>
    </>
  );
}
