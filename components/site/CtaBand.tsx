import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/data/company";
import { ArrowRight, Mail, Phone } from "@/components/ui/Icons";

export function CtaBand({ title = "Have a drawing? Let's build it.", body }: { title?: string; body?: string }) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-blue text-white">
      <div className="blueprint absolute inset-0 opacity-70" aria-hidden />
      <div className="container-x relative grid gap-10 py-16 lg:grid-cols-12 lg:items-end lg:py-24">
        <Reveal className="lg:col-span-7">
          <p className="label text-white/75">Start a project</p>
          <h2 id="cta-title" className="display mt-5 text-[clamp(1.8rem,4.4vw,4rem)]">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/85">
            {body ?? "Send drawings, CAD or a description. Right's team reviews your specifications and returns a detailed quote and timeline."}
          </p>
        </Reveal>
        <Reveal delay={120} className="space-y-3 lg:col-span-5">
          <Link href="/start-a-project" className="group flex h-16 items-center justify-between bg-white px-6 text-navy transition-colors hover:bg-mist">
            <span className="label text-[0.82rem]">Start a project</span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
            <a href={company.phoneHref} className="flex h-14 items-center gap-3 border border-white/40 px-5 transition-colors hover:border-white hover:bg-white/5">
              <Phone size={17} />
              <span className="label text-[0.74rem]">{company.phone}</span>
            </a>
            <a href={`mailto:${company.email}`} className="flex h-14 items-center gap-3 border border-white/40 px-5 transition-colors hover:border-white hover:bg-white/5">
              <Mail size={17} />
              <span className="label text-[0.74rem]">{company.email}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
