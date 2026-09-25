import Link from "next/link";
import type { CSSProperties } from "react";
import type { FinderResult, DetectedEntity } from "@/lib/finder/types";
import { company } from "@/data/company";
import { Alert, ArrowRight, ArrowUpRight, Phone } from "@/components/ui/Icons";

const KIND_LABEL: Record<DetectedEntity["kind"], string> = {
  part: "Part",
  material: "Material",
  market: "Market",
  need: "Stage",
  process: "Process",
  feature: "Feature",
  form: "Form",
};

function d(i: number): CSSProperties {
  return { "--d": `${i * 90}ms` } as CSSProperties;
}

export function Described({ result }: { result: FinderResult }) {
  return (
    <div className="rise" style={d(0)}>
      <p className="label text-blue-bright">You described</p>
      <p className="heading mt-3 max-w-3xl text-xl text-white sm:text-2xl">&ldquo;{result.query}&rdquo;</p>
      {result.described.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Detected requirements">
          {result.described.map((e) => (
            <li
              key={e.key}
              className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-[0.8rem] ${e.fromContext ? "border-dashed border-white/25 text-white/60" : "border-white/20 text-white"}`}
            >
              <span className="label text-[0.66rem] text-gray">{KIND_LABEL[e.kind]}</span>
              <span>{e.label}</span>
              {e.fromContext && <span className="label text-[0.62rem] text-white/45">earlier</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FinderResultView({ result }: { result: FinderResult }) {
  const hasMatches = result.groups.length > 0;
  const capIds = result.groups.flatMap((g) => g.items.map((i) => i.id));
  const rfqHref = `/start-a-project?q=${encodeURIComponent(result.context.thread ?? result.query)}${capIds.length ? `&caps=${capIds.join(",")}` : ""}${result.materials.length ? `&mat=${result.materials.map((m) => m.id).join(",")}` : ""}`;
  const exploreHref = capIds.length ? `/capabilities?caps=${capIds.join(",")}#explorer` : "/capabilities#explorer";
  let step = 1;

  return (
    <div className="mt-8 space-y-6">
      {result.answer && (
        <section className="rise border-l-2 border-blue-bright bg-white/[0.04] p-5 sm:p-7" style={d(step++)} aria-label="Answer">
          <h3 className="heading text-xl text-white sm:text-2xl">{result.answer.title}</h3>
          <p className="mt-3 max-w-3xl leading-relaxed text-white/80">{result.answer.body}</p>
          {result.answer.bullets && (
            <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {result.answer.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[0.95rem] text-white/85">
                  <span className="mt-[0.6em] h-px w-3 shrink-0 bg-blue-bright" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          )}
          {result.answer.links && (
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {result.answer.links.map((l) => (
                <Link key={l.href + l.label} href={l.href} className="label inline-flex items-center gap-2 text-blue-bright hover:text-white">
                  {l.label} <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {hasMatches && (
        <div className="grid gap-px bg-white/10 lg:grid-cols-12">
          {/* Summary column */}
          <section className="rise bg-ink p-5 sm:p-7 lg:col-span-5" style={d(step++)} aria-label="Match summary">
            <div className="lg:sticky lg:top-28">
            {result.coverage && (
              <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <p className="label text-gray">Requirement coverage</p>
                  <p className="display mt-2 text-[4.5rem] leading-none text-white sm:text-[5.5rem]">
                    {result.coverage.percent}
                    <span className="text-blue-bright">%</span>
                  </p>
                </div>
                <p className="label pb-2 text-right text-gray">
                  {result.coverage.matched}/{result.coverage.total}
                  <br />
                  requirements
                  <br />
                  matched
                </p>
              </div>
            )}
            {result.summary && <p className="mt-5 leading-relaxed text-white/85">{result.summary}</p>}

            {result.sequence.length > 0 && (
              <div className="mt-7">
                <p className="label text-gray">Recommended process</p>
                <ol className="mt-3 border-t border-white/10">
                  {result.sequence.map((s, i) => (
                    <li key={s.id} className="rise border-b border-white/10" style={d(step + i)}>
                      <Link href={s.href} className="group flex items-center gap-4 py-3 hover:bg-white/[0.03]">
                        <span className="label tabular w-7 text-blue-bright">{String(i + 1).padStart(2, "0")}</span>
                        <span className="heading flex-1 text-[1.05rem] uppercase text-white">{s.name}</span>
                        <ArrowUpRight size={15} className="text-white/30 transition-colors group-hover:text-white" />
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5">
              {result.materials.length > 0 && (
                <div>
                  <dt className="label text-gray">Material</dt>
                  {result.materials.map((m) => (
                    <dd key={m.id} className="mt-1.5">
                      <Link href={`/materials/${m.id}`} className="heading text-white uppercase hover:text-blue-bright">
                        {m.name}
                      </Link>
                    </dd>
                  ))}
                </div>
              )}
              {result.markets.length > 0 && (
                <div>
                  <dt className="label text-gray">Industry experience</dt>
                  {result.markets.map((m) => (
                    <dd key={m.id} className="mt-1.5">
                      <Link href={m.href} className="heading text-white uppercase hover:text-blue-bright">
                        {m.name}
                      </Link>
                    </dd>
                  ))}
                </div>
              )}
              {result.needs.length > 0 && (
                <div className="col-span-2">
                  <dt className="label text-gray">Stage</dt>
                  {result.needs.map((n) => (
                    <dd key={n.id} className="mt-1.5 text-[0.95rem] text-white/85">
                      <span className="heading uppercase text-white">{n.label}</span> · {n.detail}
                    </dd>
                  ))}
                </div>
              )}
            </dl>
            </div>
          </section>

          {/* Capabilities column */}
          <section className="bg-ink p-5 sm:p-7 lg:col-span-7" aria-label="Matched capabilities">
            <p className="label rise text-gray" style={d(step)}>
              Matched capabilities
            </p>
            <div className="mt-3 space-y-6">
              {result.groups.map((g, gi) => (
                <div key={g.category} className="rise" style={d(step + gi + 1)}>
                  <h4 className="label border-b border-white/10 pb-2 text-blue-bright">{g.label}</h4>
                  <ul>
                    {g.items.map((c) => (
                      <li key={c.id} className="border-b border-white/[0.07] py-4">
                        <div className="flex items-baseline justify-between gap-4">
                          <Link href={c.href} className="heading text-lg uppercase text-white hover:text-blue-bright">
                            {c.name}
                          </Link>
                          {c.partner && <span className="label shrink-0 text-[0.66rem] text-gray">via APC</span>}
                        </div>
                        <div className="mt-2 h-[3px] w-full bg-white/[0.07]" aria-hidden>
                          <div className="meter h-full bg-blue-bright" style={{ width: `${Math.round(c.strength * 100)}%`, ...d(gi + 2) }} />
                        </div>
                        {c.reasons.length > 0 && (
                          <ul className="mt-3 space-y-1.5">
                            {c.reasons.slice(0, 2).map((r) => (
                              <li key={r.text} className="text-[0.92rem] leading-snug text-white/75">
                                {r.term && <span className="mr-2 border border-white/15 px-1.5 py-0.5 font-mono text-[0.72rem] text-white">{r.term}</span>}
                                {r.text}
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="label mt-3 text-[0.7rem] leading-relaxed text-gray">
                          <span className="text-white/45">On record: </span>
                          {c.evidence.join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {result.flags.length > 0 && (
        <section className="rise border border-amber-300/30 bg-amber-300/[0.05] p-5" style={d(step + 3)} aria-label="Items to confirm">
          <p className="label flex items-center gap-2 text-amber-200">
            <Alert size={15} /> Confirm with engineering
          </p>
          <ul className="mt-3 space-y-2">
            {result.flags.map((f) => (
              <li key={f.term} className="text-[0.95rem] text-white/85">
                <span className="mr-2 font-mono text-[0.78rem] text-amber-100">&ldquo;{f.term}&rdquo;</span>
                {f.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.mode === "clarify" && !result.flags.length && (
        <p className="rise max-w-2xl text-white/80" style={d(1)}>
          {result.summary}
        </p>
      )}

      {(hasMatches || result.flags.length > 0) && (
        <div className="rise grid gap-px bg-white/10 sm:grid-cols-3" style={d(step + 4)}>
          <Link href={exploreHref} className="group flex items-center justify-between gap-3 bg-navy-800 px-5 py-4 text-white hover:bg-navy-700">
            <span className="label">Explore these capabilities</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a href={company.phoneHref} className="group flex items-center justify-between gap-3 bg-navy-800 px-5 py-4 text-white hover:bg-navy-700">
            <span className="label">Talk to manufacturing</span>
            <Phone size={16} />
          </a>
          <Link href={rfqHref} className="group flex items-center justify-between gap-3 bg-blue px-5 py-4 text-white hover:bg-blue-600">
            <span className="label">Start an RFQ</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
