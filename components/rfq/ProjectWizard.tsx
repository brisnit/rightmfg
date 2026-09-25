"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { runFinder } from "@/lib/finder/engine";
import { openFinderDialog } from "@/lib/finder/events";
import { capabilityById } from "@/data/capabilities";
import { markets } from "@/data/markets";
import { company } from "@/data/company";
import { ArrowRight, Check, Close, File as FileIcon, Reticle, Upload } from "@/components/ui/Icons";

const HELP = ["Prototype", "Production", "Fabrication", "Forming", "Welding", "Assembly", "Finishing", "Not sure"] as const;
const MATERIALS = [
  { id: "aluminum", label: "Aluminum alloys" },
  { id: "stainless-steel", label: "Stainless steel" },
  { id: "carbon-steel", label: "Carbon steel" },
  { id: "unsure", label: "Not sure yet" },
];
const QTY = ["1 – 10", "10 – 100", "100 – 1,000", "1,000 – 10,000", "10,000+"];
const TIMELINE = [
  { id: "rush", label: "Rush", note: "48-hr turnaround on select prototypes" },
  { id: "2-4w", label: "2 – 4 weeks", note: "" },
  { id: "1-3m", label: "1 – 3 months", note: "" },
  { id: "3m+", label: "3+ months", note: "" },
  { id: "budget", label: "Budgeting / planning", note: "" },
];
const ACCEPT = ".pdf,.dwg,.dxf,.step,.stp,.igs,.iges,.sldprt,.sldasm,.x_t,.zip,.png,.jpg";

const STEPS = ["Project", "Scope", "Material", "Quantity", "Timeline", "Files", "Contact"] as const;

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
      className={`flex min-h-14 items-center justify-between gap-3 border px-4 py-3 text-left text-[1rem] transition-colors ${selected ? "border-blue bg-blue-soft text-navy" : "border-navy/20 bg-white text-graphite hover:border-navy/50"}`}
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
      className={`flex min-h-14 w-full items-center gap-4 border px-4 py-3 text-left transition-colors ${selected ? "border-blue bg-blue-soft" : "border-navy/20 bg-white hover:border-navy/50"}`}
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
    const parts = [s.description, s.materials.filter((m) => m !== "unsure").map((m) => m.replace("-", " ")).join(" "), s.help.filter((h) => h !== "Not sure").join(" "), s.market && markets.find((m) => m.id === s.market)?.short].filter(Boolean).join(". ");
    if (parts.trim().length < 8) return null;
    const r = runFinder({ query: parts });
    return r.sequence.length ? r : null;
  }, [s.description, s.materials, s.help, s.market]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email);
  const valid = [s.description.trim().length >= 10, true, true, true, true, true, s.name.trim().length > 1 && emailOk][step];
  const errorMsg = step === 0 ? "Describe the part or project in a sentence or two." : step === 6 ? (!s.name.trim() ? "Add your name." : "Add a valid email address.") : "";

  const next = () => {
    setTouched(true);
    if (!valid) return;
    setTouched(false);
    if (step < STEPS.length - 1) setStep(step + 1);
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
    ["Project", s.description],
    ["Market", markets.find((m) => m.id === s.market)?.name ?? "—"],
    ["Help needed", s.help.join(", ") || "—"],
    ["Material", [...s.materials.map((m) => MATERIALS.find((x) => x.id === m)?.label), s.materialOther].filter(Boolean).join(", ") || "—"],
    ["Quantity", s.qty ? `${s.qty}${s.recurring ? " (recurring)" : ""}` : "—"],
    ["Timeline", TIMELINE.find((t) => t.id === s.timeline)?.label ?? "—"],
    ["Files", s.files.map((f) => f.name).join(", ") || "None attached"],
    ["Contact", [s.name, s.companyName, s.email, s.phone].filter(Boolean).join(" · ")],
  ];
  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(`RFQ: ${s.description.slice(0, 60)}`)}&body=${encodeURIComponent(summary.map(([k, v]) => `${k}: ${v}`).join("\n") + (s.notes ? `\nNotes: ${s.notes}` : ""))}`;

  if (submitted) {
    const ref = `RM-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${String(s.description.length * 37 + s.email.length).padStart(4, "0")}`;
    return (
      <div className="mx-auto max-w-3xl py-8">
        <p className="label flex items-center gap-2 text-blue">
          <Check size={16} /> Request prepared · Ref {ref}
        </p>
        <h2 ref={headingRef} tabIndex={-1} className="display mt-5 text-[clamp(2rem,5vw,3.6rem)] text-navy focus:outline-none">
          Thanks, {s.name.split(" ")[0]}. An engineer will review it.
        </h2>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-steel">
          Right&apos;s team reviews your specifications and follows up with a detailed quote and timeline. For anything urgent, call {company.phone}.
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
            Email this summary <ArrowRight size={15} />
          </a>
          <Link href="/" className="label inline-flex h-12 items-center justify-center border border-navy/25 px-6 text-navy hover:border-navy">
            Back to home
          </Link>
        </div>
        <p className="label mt-8 text-[0.62rem] leading-relaxed text-steel-400">
          Prototype note: submission is simulated here. In production this posts to an RFQ endpoint and routes to {company.email}, with files going to secure storage.
        </p>
      </div>
    );
  }

  const title = [
    "What are you building?",
    "What do you need help with?",
    "Which materials?",
    "Approximate quantity?",
    "What's your timeline?",
    "Upload drawings, CAD or specs",
    "Where should we send the quote?",
  ][step];

  return (
    <div className="grid gap-10 pb-28 lg:grid-cols-12 lg:gap-16 lg:pb-0">
      <div className="lg:col-span-8">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between">
            <p className="label text-steel">
              Step <span className="text-navy">{step + 1}</span> of {STEPS.length} · {STEPS[step]}
            </p>
            <button type="button" onClick={() => openFinderDialog(s.description || undefined)} className="label hidden items-center gap-2 text-blue hover:text-blue-600 sm:inline-flex">
              <Reticle size={15} /> Not sure? Ask Capability Finder
            </button>
          </div>
          <ol className="mt-3 grid grid-cols-7 gap-1" aria-label="Progress">
            {STEPS.map((st, i) => (
              <li key={st}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => setStep(i)}
                  aria-label={`Step ${i + 1}: ${st}${i < step ? " (completed)" : i === step ? " (current)" : ""}`}
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
                    Part or product description <span className="text-blue">*</span>
                  </label>
                  <textarea
                    id="desc"
                    rows={5}
                    value={s.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="e.g. Stainless steel tubular frame for a medical cart: multiple bends, welded mounting brackets, powder coated."
                    aria-invalid={touched && !valid}
                    aria-describedby="desc-help"
                    className="mt-2 w-full resize-y border border-navy/20 bg-white p-4 text-[1.05rem] leading-relaxed focus:border-blue focus:outline-none"
                  />
                  <p id="desc-help" className="mt-2 text-sm text-steel">
                    Geometry, features (bends, welds, holes, hardware), finish and where it&apos;s used all help.
                  </p>
                </div>
                <div>
                  <label htmlFor="market" className="label block text-steel">
                    Industry (optional)
                  </label>
                  <select id="market" value={s.market} onChange={(e) => set("market", e.target.value)} className="mt-2 h-14 w-full border border-navy/20 bg-white px-4 text-[1rem] focus:border-blue focus:outline-none sm:w-80">
                    <option value="">Select…</option>
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
                <legend className="sr-only">Select all that apply</legend>
                <p className="mb-4 text-steel">Select all that apply.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {HELP.map((h) => (
                    <Chip key={h} selected={s.help.includes(h)} onClick={() => toggle("help", h)}>
                      {h}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="space-y-5">
                <legend className="sr-only">Materials</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {MATERIALS.map((m) => (
                    <Chip key={m.id} selected={s.materials.includes(m.id)} onClick={() => toggle("materials", m.id)}>
                      {m.label}
                    </Chip>
                  ))}
                </div>
                <div>
                  <label htmlFor="mat-other" className="label block text-steel">
                    Alloy, grade, gauge or other (optional)
                  </label>
                  <input id="mat-other" value={s.materialOther} onChange={(e) => set("materialOther", e.target.value)} placeholder="e.g. 304 SS, 1.25 in OD × 0.065 wall" className="mt-2 h-14 w-full border border-navy/20 bg-white px-4 focus:border-blue focus:outline-none" />
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset className="space-y-5">
                <legend className="sr-only">Quantity</legend>
                <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
                  {QTY.map((q) => (
                    <Radio key={q} selected={s.qty === q} onClick={() => set("qty", q)}>
                      {q} pcs
                    </Radio>
                  ))}
                </div>
                <Chip selected={s.recurring} onClick={() => set("recurring", !s.recurring)}>
                  This is a recurring / annual volume
                </Chip>
              </fieldset>
            )}

            {step === 4 && (
              <div role="radiogroup" aria-label="Timeline" className="grid gap-2 sm:grid-cols-2">
                {TIMELINE.map((t) => (
                  <Radio key={t.id} selected={s.timeline === t.id} onClick={() => set("timeline", t.id)} note={t.note}>
                    {t.label}
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
                  <p className="heading mt-4 text-lg text-navy">Drop drawings here</p>
                  <p className="mt-1 text-sm text-steel">PDF, DWG, DXF, STEP, IGES, SolidWorks, Parasolid or ZIP</p>
                  <button type="button" onClick={() => fileRef.current?.click()} className="label mt-6 inline-flex h-12 items-center gap-2 border border-navy/25 bg-paper px-5 text-navy hover:border-navy">
                    Browse files
                  </button>
                  <input ref={fileRef} type="file" multiple accept={ACCEPT} className="sr-only" onChange={(e) => addFiles(e.target.files)} aria-label="Upload drawings" />
                </div>
                {s.files.length > 0 && (
                  <ul className="mt-4 border-t border-navy/10">
                    {s.files.map((f, i) => (
                      <li key={f.name + i} className="flex items-center gap-3 border-b border-navy/10 py-3">
                        <FileIcon size={18} className="text-blue" />
                        <span className="flex-1 truncate text-graphite">{f.name}</span>
                        <span className="label text-[0.62rem] text-steel">{fmtSize(f.size)}</span>
                        <button type="button" onClick={() => set("files", s.files.filter((_, j) => j !== i))} aria-label={`Remove ${f.name}`} className="p-2 text-steel hover:text-navy">
                          <Close size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 text-sm text-steel">No drawings yet? Skip this step. A sketch or photo works too.</p>
              </div>
            )}

            {step === 6 && (
              <div className="grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["name", "Name", "text", "name", true],
                    ["companyName", "Company", "text", "organization", false],
                    ["email", "Email", "email", "email", true],
                    ["phone", "Phone", "tel", "tel", false],
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
                    Anything else? (optional)
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
                  Back
                </button>
              )}
              <button type="submit" className="label group inline-flex h-14 flex-1 items-center justify-center gap-3 bg-blue px-8 text-white hover:bg-blue-600 lg:flex-none">
                {step === STEPS.length - 1 ? "Submit request" : step === 5 && !s.files.length ? "Skip for now" : "Continue"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Live panel */}
      <aside className="lg:col-span-4" aria-label="Project summary">
        <div className="space-y-4 lg:sticky lg:top-28">
          <div className="border border-navy/15 bg-navy text-white">
            <p className="label flex items-center gap-2 border-b border-white/10 px-5 py-4">
              <Reticle size={15} className="text-blue-bright" /> Likely process
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
                  {match.flags.length > 0 && <p className="mt-3 text-sm text-amber-200">{match.flags.length} item(s) to confirm with engineering</p>}
                  <p className="label mt-4 text-[0.62rem] text-white/45">Updates as you type · confirmed on engineering review</p>
                </>
              ) : (
                <p className="text-sm leading-relaxed text-white/70">Describe your part and this panel suggests the processes Right would typically use.</p>
              )}
            </div>
          </div>
          <button type="button" onClick={() => openFinderDialog(s.description || undefined)} className="flex w-full items-center justify-between border border-navy/15 bg-white p-5 text-left hover:border-blue">
            <span>
              <span className="label block text-blue">Not sure what you need?</span>
              <span className="heading mt-1 block text-navy">Ask Capability Finder</span>
            </span>
            <ArrowRight size={18} className="text-blue" />
          </button>
          <div className="border border-navy/15 bg-white p-5">
            <p className="label text-steel">Prefer to talk?</p>
            <a href={company.phoneHref} className="heading mt-2 block text-xl text-navy hover:text-blue">
              {company.phone}
            </a>
            <a href={`mailto:${company.email}`} className="mt-1 block text-steel hover:text-blue">
              {company.email}
            </a>
            <p className="label mt-4 text-[0.62rem] leading-relaxed text-steel-400">What happens next: drawing review → quote & timeline → prototype or production</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
