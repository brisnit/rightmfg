import Image from "next/image";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { customers, headlineStats, teamStats } from "@/data/company";

/** Scale & credibility — numbers as architecture, not cards. */
export function StatsBand() {
  return (
    <section aria-labelledby="trust-title" className="relative bg-paper">
      <h2 id="trust-title" className="sr-only">
        Right Manufacturing by the numbers
      </h2>
      <div className="container-x">
        <Reveal plain className="grid grid-cols-2 lg:grid-cols-4">
          {headlineStats.map((s, i) => (
            <div
              key={s.label}
              className={`relative border-navy/12 py-10 sm:py-14 lg:py-20 ${i % 2 === 1 ? "border-l pl-5 sm:pl-8" : "pr-4"} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""} ${i === 1 || i === 3 ? "" : ""}`}
            >
              <span className="rule-draw absolute left-0 right-0 top-0 h-[3px] bg-blue" style={{ ["--d" as string]: `${i * 120}ms` }} aria-hidden />
              <p className="label tabular text-steel">{String(i + 1).padStart(2, "0")}</p>
              <p className="display mt-4 text-[clamp(3rem,6vw,6.4rem)] leading-[0.85] text-navy">
                <CountUp value={s.value} display={s.display} />
                <span className="text-blue">{s.suffix}</span>
              </p>
              <p className="label mt-5 text-navy">{s.label}</p>
              <p className="mt-2 hidden max-w-[16rem] text-[0.95rem] text-steel sm:block">{s.detail}</p>
            </div>
          ))}
        </Reveal>

        <div className="grid gap-px border-y border-navy/12 bg-navy/12 sm:grid-cols-3">
          {teamStats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-4 bg-paper py-5 sm:px-6 sm:first:pl-0">
              <span className="heading tabular text-3xl text-navy">
                {s.value}
                <span className="text-blue">{s.suffix}</span>
              </span>
              <span>
                <span className="label block text-navy">{s.label}</span>
                <span className="text-sm text-steel">{s.detail}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="py-12 lg:py-16">
          <p className="label text-steel">Trusted by OEMs including</p>
          <ul className="mt-6 grid grid-cols-3 items-center gap-x-5 gap-y-8 sm:grid-cols-4 sm:gap-x-8 lg:grid-cols-6">
            {customers.map((c) => (
              <li key={c.id} className="flex h-12 min-w-0 items-center">
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={c.w}
                  height={c.h}
                  sizes="160px"
                  className="max-h-9 w-auto max-w-full object-contain sm:max-h-10 sm:max-w-[8.5rem] opacity-60 mix-blend-multiply grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
