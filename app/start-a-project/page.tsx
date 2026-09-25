import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectWizard } from "@/components/rfq/ProjectWizard";

export const metadata: Metadata = {
  title: "Start a Project: Request a Quote",
  description: "Send drawings and requirements for tube bending, sheet metal, welding, hardware and assembly. Right Manufacturing returns a detailed quote and timeline.",
  alternates: { canonical: "/start-a-project" },
};

export default function StartProjectPage() {
  return (
    <>
      <section className="blueprint relative bg-ink pb-10 pt-28 text-white lg:pb-14 lg:pt-36">
        <div className="container-x">
          <p className="label text-blue-bright">Start a project</p>
          <h1 className="display mt-4 text-[clamp(2.3rem,6.4vw,5.4rem)]">
            Let&apos;s build it
            <span className="text-gray">, right.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/75">
            Seven short steps, about two minutes. An engineer reviews every request and follows up with a detailed quote and timeline.
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
