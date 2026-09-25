"use client";

import Link from "@/components/ui/LocaleLink";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { runFinder } from "@/lib/finder/engine";
import { loadFinderText } from "@/lib/finder/provider";
import type { FinderText } from "@/lib/finder/finder-en";
import { useI18n } from "@/components/i18n/I18nProvider";
import { t } from "@/lib/i18n/format";
import { openFinderDialog } from "@/lib/finder/events";
import { capabilityById } from "@/data/capabilities";
import { ArrowRight, Check, Close, File as FileIcon, Reticle, Upload } from "@/components/ui/Icons";

const HELP = ["Prototype", "Production", "Fabrication", "Forming", "Welding", "Assembly", "Finishing", "Not sure"] as const;
const MATERIALS = ["aluminum", "stainless-steel", "carbon-steel", "unsure"] as const;
const QTY = ["1 – 10", "10 – 100", "100 – 1,000", "1,000 – 10,000", "10,000+"];
const TIMELINE = ["rush", "2-4w", "1-3m", "3m+", "budget"] as const;
const ACCEPT = ".pdf,.dwg,.dxf,.step,.stp,.igs,.iges,.sldprt,.sldasm,.x_t,.zip,.png,.jpg";

const STEP_COUNT = 7;

interface State {
  description: string;
  market: string;
  help: string[];
  materials: string[];
  materialOther: string;
  qty: string;
  recurring: boolean;
  timeline: string;
  files: { name: string; size: number }[];
  name: string;
  companyName: string;
  email: string;
  phone: string;
  notes: string;
}

const CAT_TO_HELP: Record<string, string> = { tube: "Forming", "sheet-metal": "Fabrication", joining: "Welding", secondary: "Assembly", finishing: "Finishing" };

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onClick}
      className={`flex min-h-14 items-center justify-between gap-3 border px-4 py-3 text-start text-[1rem] transition-colors ${selected ? "border-blue bg-blue-soft text-navy" : "border-navy/20 bg-white text-graphite hover:border-navy/50"}`}
    >
      <span>{children}</span>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center border ${selected ? "border-blue bg-blue text-white" : "border-navy/30"}`}>{selected && <Check size={13} />}</span>
    </button>
  );
}

function Radio({ selected, onClick, children, note }: { selected: boolean; onClick: () => void; children: ReactNode; note?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex min-h-14 w-full items-center gap-4 border px-4 py-3 text-start transition-colors ${selected ? "border-blue bg-blue-soft" : "border-navy/20 bg-white hover:border-navy/50"}`}
    >
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-blue" : "border-navy/30"}`}>{selected && <span className="h-2.5 w-2.5 rounded-full bg-blue" />}</span>
      <span>
        <span className="heading block text-navy">{children}</span>
        {note && <span className="mt-0.5 block text-sm text-steel">{note}</span>}
      </span>
    </button>
  );
}

function fmtSize(n: number) {
  return n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`;
}

export function ProjectWizard() {
  const params = useSearchParams();
  const { locale, dict, content } = useI18n();
  const r = dict.rfq;
  const { markets, company } = content;
  const STEPS = r.steps;
  const [finderText, setFinderText] = useState<FinderText | null>(null);
  useEffect(() => {
    let live = true;
    loadFinderText(locale).then((ft) => live && setFinderText(ft));
    return () => {
      live = false;
    };
  }, [locale]);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // Prefill from Capability Finder / page context (?q, caps, mat, need, market, service).
  const [s, setS] = useState<State>(() => {
    const help = new Set<string>();
    (params.get("caps") ?? "").split(",").filter(Boolean).forEach((id) => {
      const c = capabilityById[id];
      if (c && CAT_TO_HELP[c.category]) help.add(CAT_TO_HELP[c.category]);
      if (id === "prototyping") help.add("Prototype");
      if (id === "production-manufacturing") help.add("Production");
    });
    if (params.get("need") === "prototype") help.add("Prototype");
    const service = params.get("service");
    const serviceHelp: Record<string, string> = { "tube-bending": "Forming", "sheet-metal": "Fabrication", welding: "Welding", assembly: "Assembly", finishing: "Finishing" };
    if (service && serviceHelp[service]) help.add(serviceHelp[service]);
    return {
      description: params.get("q") ?? "",
      market: params.get("market") ?? "",
      help: [...help],
      materials: (params.get("mat") ?? "").split(",").filter(Boolean),
      materialOther: "",
      qty: "",
      recurring: false,
      timeline: "",
      files: [],
      name: "",
      companyName: "",
      email: "",
      phone: "",
      notes: "",
    };
  });

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step, submitted]);

  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));
  const toggle = (k: "help" | "materials", v: string) => setS((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  // Live capability match from what they've told us so far.
  const match = useMemo(() => {
    if (!finderText) return null;
    const parts = [s.description, s.materials.filter((m) => m !== "unsure").map((m) => m.replace("-", " ")).join(" "), s.help.filter((h) => h !== "Not sure").join(" "), s.market].filter(Boolean).join(". ");
    if (parts.trim().length < 8) return null;
    const res = runFinder({ query: parts }, { locale, content, text: finderText });
    return res.sequence.length ? res : null;
  }, [s.description, s.materials, s.help, s.market, finderText, locale, content]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email);
  const valid = [s.description.trim().length >= 10, true, true, true, true, true, s.name.trim().length > 1 && emailOk][step];
  const errorMsg = step === 0 ? r.errDesc : step === 6 ? (!s.name.trim() ? r.errName : r.errEmail) : "";

  const next = () => {
    setTouched(true);
    if (!valid) return;
    setTouched(false);
    if (step < STEP_COUNT - 1) setStep(step + 1);
    else setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setTouched(false);
    setStep((x) => Math.max(0, x - 1));
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    set("files", [...s.files, ...Array.from(list).map((f) => ({ name: f.name, size: f.size }))].slice(0, 10));
  };

  const summary = [
    [r.rows.project, s.description],
    [r.rows.market, markets.find((m) => m.id === s.market)?.name ?? "—"],
    [r.rows.help, s.help.map((h) => r.help[h as keyof typeof r.help] ?? h).join(", ") || "—"],
    [r.rows.material, [...s.materials.map((m) => r.materials[m as keyof typeof r.materials]), s.materialOther].filter(Boolean).join(", ") || "—"],
    [r.rows.quantity, s.qty ? `${s.qty} ${r.pcs}${s.recurring ? ` (${r.recurringShort})` : ""}` : "—"],
    [r.rows.timeline, s.timeline ? r.timeline[s.timeline as keyof typeof r.timeline] : "—"],
    [r.rows.files, s.files.map((f) => f.name).join(", ") || r.none],
    [r.rows.contact, [s.name, s.companyName, s.email, s.phone].filter(Boolean).join(" · ")],
  ];
  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(`RFQ: ${s.description.slice(0, 60)}`)}&body=${encodeURIComponent(summary.map(([k, v]) => `${k}: ${v}`).join("\n") + (s.notes ? `\nNotes: ${s.notes}` : ""))}`;

  if (submitted) {
    const ref = `RM-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${String(s.description.length * 37 + s.email.length).padStart(4, "0")}`;
    return (
      <div className="mx-auto max-w-3xl py-8">
        <p className="label flex items-center gap-2 text-blue">
          <Check size={16} /> {t(r.prepared, { ref })}
        </p>
        <h2 ref={headingRef} tabIndex={-1} className="display mt-5 text-[clamp(2rem,5vw,3.6rem)] text-navy focus:outline-none">
          {t(r.thanks, { name: s.name.split(" ")[0] })}
        </h2>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-steel">
          {t(r.thanksBody, { phone: company.phone })}
        </p>
        <dl className="mt-10 border-t border-navy/15">
          {summary.map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b border-navy/10 py-3 sm:grid-cols-[10rem_1fr]">
              <dt className="label text-[0.66rem] text-steel">{k}</dt>
              <dd className="text-graphite">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={mailto} className="label inline-flex h-12 items-center justify-center gap-3 bg-blue px-6 text-white hover:bg-blue-600">
            {r.emailSummary} <ArrowRight size={15} />
          </a>
          <Link href="/" className="label inline-flex h-12 items-center justify-center border border-navy/25 px-6 text-navy hover:border-navy">
            {r.backHome}
          </Link>
        </div>
        <p className="label mt-8 text-[0.62rem] leading-relaxed text-steel-400">
          {t(r.prototypeNote, { email: company.email })}
        </p>
      </div>
    );
  }

  const title = r.titles[step];

  return (
    <div className="grid gap-10 pb-28 lg:grid-cols-12 lg:gap-16 lg:pb-0">
      <div className="lg:col-span-8">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between">
            <p className="label text-steel">
              {t(r.stepOf, { n: step + 1, total: STEP_COUNT })} · {STEPS[step]}
            </p>
            <button type="button" onClick={() => openFinderDialog(s.description || undefined)} className="label hidden items-center gap-2 text-blue hover:text-blue-600 sm:inline-flex">
              <Reticle size={15} /> {r.notSure}
            </button>
          </div>
          <ol className="mt-3 grid grid-cols-7 gap-1" aria-label={r.progress}>
            {STEPS.map((st, i) => (
              <li key={st}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => setStep(i)}
                  aria-label={`${t(r.stepOf, { n: i + 1, total: STEP_COUNT })}: ${st}${i < step ? ` (${r.completed})` : i === step ? ` (${r.current})` : ""}`}
                  className={`block h-1.5 w-full transition-colors ${i < step ? "bg-navy" : i === step ? "bg-blue" : "bg-navy/12"}`}
                />
                <span className={`label mt-2 hidden text-[0.6rem] md:block ${i === step ? "text-navy" : "text-steel-400"}`}>{st}</span>
              </li>
            ))}
          </ol>
        </div>

        <form
          className="mt-10"
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
          noValidate
        >
          <h2 ref={headingRef} tabIndex={-1} className="display text-[clamp(1.9rem,4.4vw,3.4rem)] text-navy focus:outline-none">
            {title}
          </h2>

          <div key={step} className="rise mt-8">
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="desc" className="label block text-steel">
                    {r.descLabel} <span className="text-blue">*</span>
                  </label>
                  <textarea
                    id="desc"
                    rows={5}
                    value={s.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder={r.descPlaceholder}
                    aria-invalid={touched && !valid}
                    aria-describedby="desc-help"
                    className="mt-2 w-full resize-y border border-navy/20 bg-white p-4 text-[1.05rem] leading-relaxed focus:border-blue focus:outline-none"
                  />
                  <p id="desc-help" className="mt-2 text-sm text-steel">
                    {r.descHelp}
                  </p>
                </div>
                <div>
                  <label htmlFor="market" className="label block text-steel">
                    {r.industry}
                  </label>
                  <select id="market" value={s.market} onChange={(e) => set("market", e.target.value)} className="mt-2 h-14 w-full border border-navy/20 bg-white px-4 text-[1rem] focus:border-blue focus:outline-none sm:w-80">
                    <option value="">{r.select}</option>
                    {markets.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 1 && (
              <fieldset>
                <legend className="sr-only">{r.selectAll}</legend>
                <p className="mb-4 text-steel">{r.selectAll}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {HELP.map((h) => (
                    <Chip key={h} selected={s.help.includes(h)} onClick={() => toggle("help", h)}>
                      {r.help[h]}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="space-y-5">
                <legend className="sr-only">{STEPS[2]}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {MATERIALS.map((m) => (
                    <Chip key={m} selected={s.materials.includes(m)} onClick={() => toggle("materials", m)}>
                      {r.materials[m]}
                    </Chip>
                  ))}
                </div>
                <div>
                  <label htmlFor="mat-other" className="label block text-steel">
                    {r.materialOther}
                  </label>
                  <input id="mat-other" value={s.materialOther} onChange={(e) => set("materialOther", e.target.value)} placeholder={r.materialOtherPlaceholder} className="mt-2 h-14 w-full border border-navy/20 bg-white px-4 focus:border-blue focus:outline-none" />
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset className="space-y-5">
                <legend className="sr-only">{STEPS[3]}</legend>
                <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
                  {QTY.map((q) => (
                    <Radio key={q} selected={s.qty === q} onClick={() => set("qty", q)}>
                      {q} {r.pcs}
                    </Radio>
                  ))}
                </div>
                <Chip selected={s.recurring} onClick={() => set("recurring", !s.recurring)}>
                  {r.recurring}
                </Chip>
              </fieldset>
            )}

            {step === 4 && (
              <div role="radiogroup" aria-label={STEPS[4]} className="grid gap-2 sm:grid-cols-2">
                {TIMELINE.map((id) => (
                  <Radio key={id} selected={s.timeline === id} onClick={() => set("timeline", id)} note={id === "rush" ? r.rushNote : undefined}>
                    {r.timeline[id]}
                  </Radio>
                ))}
              </div>
            )}

            {step === 5 && (
              <div>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    addFiles(e.dataTransfer.files);
                  }}
                  className={`blueprint-light flex flex-col items-center justify-center border-2 border-dashed px-6 py-14 text-center transition-colors ${dragOver ? "border-blue bg-blue-soft" : "border-navy/25 bg-white"}`}
                >
                  <Upload size={28} className="text-blue" />
                  <p className="heading mt-4 text-lg text-navy">{r.drop}</p>
                  <p className="mt-1 text-sm text-steel">{r.fileTypes}</p>
                  <button type="button" onClick={() => fileRef.current?.click()} className="label mt-6 inline-flex h-12 items-center gap-2 border border-navy/25 bg-paper px-5 text-navy hover:border-navy">
                    {r.browse}
                  </button>
                  <input ref={fileRef} type="file" multiple accept={ACCEPT} className="sr-only" onChange={(e) => addFiles(e.target.files)} aria-label={r.uploadAria} />
                </div>
                {s.files.length > 0 && (
                  <ul className="mt-4 border-t border-navy/10">
                    {s.files.map((f, i) => (
                      <li key={f.name + i} className="flex items-center gap-3 border-b border-navy/10 py-3">
                        <FileIcon size={18} className="text-blue" />
                        <span className="flex-1 truncate text-graphite">{f.name}</span>
                        <span className="label text-[0.62rem] text-steel">{fmtSize(f.size)}</span>
                        <button type="button" onClick={() => set("files", s.files.filter((_, j) => j !== i))} aria-label={t(r.remove, { name: f.name })} className="p-2 text-steel hover:text-navy">
                          <Close size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 text-sm text-steel">{r.noDrawings}</p>
              </div>
            )}

            {step === 6 && (
              <div className="grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["name", r.name, "text", "name", true],
                    ["companyName", r.company, "text", "organization", false],
                    ["email", r.email, "email", "email", true],
                    ["phone", r.phone, "tel", "tel", false],
                  ] as const
                ).map(([k, label, type, ac, req]) => (
                  <div key={k}>
                    <label htmlFor={`c-${k}`} className="label block text-steel">
                      {label} {req && <span className="text-blue">*</span>}
                    </label>
                    <input
                      id={`c-${k}`}
                      type={type}
                      autoComplete={ac}
                      value={s[k]}
                      onChange={(e) => set(k, e.target.value)}
                      aria-invalid={touched && req && (k === "email" ? !emailOk : !s[k].trim())}
                      className="mt-2 h-14 w-full border border-navy/20 bg-white px-4 text-[1rem] focus:border-blue focus:outline-none aria-[invalid=true]:border-red-600"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label htmlFor="c-notes" className="label block text-steel">
                    {r.notes}
                  </label>
                  <textarea id="c-notes" rows={3} value={s.notes} onChange={(e) => set("notes", e.target.value)} className="mt-2 w-full border border-navy/20 bg-white p-4 focus:border-blue focus:outline-none" />
                </div>
              </div>
            )}

            {touched && !valid && (
              <p role="alert" className="mt-4 text-sm font-medium text-red-700">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Actions: inline on desktop, sticky app-style bar on mobile */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/15 bg-paper p-3 lg:static lg:mt-12 lg:border-0 lg:bg-transparent lg:p-0">
            <div className="mx-auto flex max-w-3xl gap-3 lg:max-w-none">
              {step > 0 && (
                <button type="button" onClick={back} className="label h-14 border border-navy/25 px-6 text-navy hover:border-navy">
                  {r.back}
                </button>
              )}
              <button type="submit" className="label group inline-flex h-14 flex-1 items-center justify-center gap-3 bg-blue px-8 text-white hover:bg-blue-600 lg:flex-none">
                {step === STEP_COUNT - 1 ? r.submit : step === 5 && !s.files.length ? r.skip : r.continue}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Live panel */}
      <aside className="lg:col-span-4" aria-label={r.summary}>
        <div className="space-y-4 lg:sticky lg:top-28">
          <div className="border border-navy/15 bg-navy text-white">
            <p className="label flex items-center gap-2 border-b border-white/10 px-5 py-4">
              <Reticle size={15} className="text-blue-bright" /> {r.likely}
            </p>
            <div className="p-5">
              {match ? (
                <>
                  <ol>
                    {match.sequence.map((st, i) => (
                      <li key={st.id} className="flex items-center gap-3 border-b border-white/10 py-2.5 last:border-b-0">
                        <span className="label tabular text-blue-bright">{String(i + 1).padStart(2, "0")}</span>
                        <span className="heading uppercase">{st.name}</span>
                      </li>
                    ))}
                  </ol>
                  {match.flags.length > 0 && <p className="mt-3 text-sm text-amber-200">{t(r.toConfirm, { n: match.flags.length })}</p>}
                  <p className="label mt-4 text-[0.62rem] text-white/45">{r.likelyNote}</p>
                </>
              ) : (
                <p className="text-sm leading-relaxed text-white/70">{r.likelyEmpty}</p>
              )}
            </div>
          </div>
          <button type="button" onClick={() => openFinderDialog(s.description || undefined)} className="flex w-full items-center justify-between border border-navy/15 bg-white p-5 text-start hover:border-blue">
            <span>
              <span className="label block text-blue">{r.notSureTitle}</span>
              <span className="heading mt-1 block text-navy">{r.askFinder}</span>
            </span>
            <ArrowRight size={18} className="text-blue" />
          </button>
          <div className="border border-navy/15 bg-white p-5">
            <p className="label text-steel">{r.talk}</p>
            <a href={company.phoneHref} className="heading mt-2 block text-xl text-navy hover:text-blue">
              {company.phone}
            </a>
            <a href={`mailto:${company.email}`} className="mt-1 block text-steel hover:text-blue">
              {company.email}
            </a>
            <p className="label mt-4 text-[0.62rem] leading-relaxed text-steel-400">{r.next}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
