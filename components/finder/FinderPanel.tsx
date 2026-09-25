"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { askFinder as runQuery } from "@/lib/finder/provider";
import { ASK_EVENT, type AskDetail } from "@/lib/finder/events";
import type { FinderContext, FinderResult } from "@/lib/finder/types";
import { capabilities } from "@/data/capabilities";
import { suggestedSearches } from "@/data/finder-knowledge";
import { ArrowRight, Reticle, Return } from "@/components/ui/Icons";
import { Described, FinderResultView } from "./FinderResultView";

interface Turn {
  id: number;
  query: string;
  result?: FinderResult;
  error?: string;
}

const STAGES = ["Parsing requirement", `Matching ${capabilities.length} verified capabilities`, "Checking published equipment & materials"];

function Thinking() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 260);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mt-6 max-w-md" role="status" aria-live="polite">
      {STAGES.map((s, i) => (
        <div key={s} className={`flex items-center gap-3 py-1.5 transition-opacity ${i <= stage ? "opacity-100" : "opacity-25"}`}>
          <span className="label tabular w-6 text-blue-bright">{String(i + 1).padStart(2, "0")}</span>
          <span className="label flex-1 text-white/80">{s}</span>
          <span className="relative h-px w-16 overflow-hidden bg-white/15">
            {i === stage ? <span className="scan-bar absolute inset-y-0 left-0 w-1/3 bg-blue-bright" /> : i < stage ? <span className="absolute inset-0 bg-blue-bright" /> : null}
          </span>
        </div>
      ))}
    </div>
  );
}

export function FinderPanel({
  listen = false,
  initialQuery,
  suggestions = suggestedSearches,
  autoFocus = false,
  scrollTargetId,
}: {
  /** Handle site-wide "ask" events (hero input, header search) inline. */
  listen?: boolean;
  initialQuery?: string;
  suggestions?: string[];
  autoFocus?: boolean;
  scrollTargetId?: string;
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const ctxRef = useRef<FinderContext | undefined>(undefined);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastTurnRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const ranInitial = useRef(false);

  const ask = useCallback(async (q: string, opts: { reset?: boolean } = {}) => {
    const query = q.trim();
    if (!query) return;
    if (opts.reset) ctxRef.current = undefined;
    const id = ++idRef.current;
    setTurns((t) => [...(opts.reset ? [] : t), { id, query }]);
    setValue("");
    setBusy(true);
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      const [result] = await Promise.all([
        runQuery({ query, context: ctxRef.current }),
        new Promise((r) => setTimeout(r, reduce ? 0 : 820)),
      ]);
      ctxRef.current = result.context;
      setTurns((t) => t.map((x) => (x.id === id ? { ...x, result } : x)));
    } catch {
      setTurns((t) => t.map((x) => (x.id === id ? { ...x, error: "Something went wrong. Please try again or call 858-566-7002." } : x)));
    } finally {
      setBusy(false);
    }
  }, []);

  // Scroll new turns into view.
  useEffect(() => {
    if (turns.length === 0) return;
    const el = lastTurnRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top;
    if (top > window.innerHeight * 0.6 || top < 0) {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [turns.length]);

  useEffect(() => {
    if (!listen) return;
    const onAsk = (e: Event) => {
      const detail = (e as CustomEvent<AskDetail>).detail;
      if (!detail?.query) return;
      e.preventDefault();
      if (scrollTargetId) document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      ask(detail.query, { reset: true });
    };
    window.addEventListener(ASK_EVENT, onAsk);
    return () => window.removeEventListener(ASK_EVENT, onAsk);
  }, [listen, ask, scrollTargetId]);

  useEffect(() => {
    if (initialQuery && !ranInitial.current) {
      ranInitial.current = true;
      ask(initialQuery, { reset: true });
    }
  }, [initialQuery, ask]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!busy) ask(value);
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const started = turns.length > 0;
  const last = turns[turns.length - 1];

  const input = (
    <form onSubmit={submit} className="group/f relative" role="search" aria-label="Capability Finder">
      <label htmlFor="finder-input" className="sr-only">
        {started ? "Ask a follow-up or describe another part" : "Describe your part, product or manufacturing challenge"}
      </label>
      <div className="flex items-stretch border border-white/20 bg-ink/60 transition-[border-color,box-shadow] duration-300 focus-within:border-blue-bright focus-within:shadow-[0_0_0_4px_rgb(74_155_240/0.12)]">
        <span className="hidden items-start pl-5 pt-[1.15rem] text-blue-bright sm:flex">
          <Reticle size={22} />
        </span>
        <textarea
          id="finder-input"
          ref={inputRef}
          rows={started ? 1 : 2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          placeholder={started ? "Ask a follow-up… e.g. “Can you powder coat it?”" : "Describe your part, product or manufacturing challenge…"}
          className="min-h-[3.75rem] flex-1 resize-none bg-transparent px-4 py-4 text-[1.05rem] leading-snug text-white placeholder:text-white/40 focus:outline-none sm:px-4 sm:text-lg"
          enterKeyHint="search"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={busy || !value.trim()}
          className="label flex w-14 shrink-0 items-center justify-center gap-2 bg-blue text-white transition-colors hover:bg-blue-600 disabled:bg-blue/40 disabled:text-white/60 sm:w-auto sm:px-7"
          aria-label="Find capabilities"
        >
          <span className="hidden sm:inline">Find</span>
          <ArrowRight size={18} />
        </button>
      </div>
      <p className="label mt-2 hidden text-[0.66rem] text-white/40 sm:block">
        Enter to search · Shift + Enter for a new line · Matches only Right&apos;s published capabilities
      </p>
    </form>
  );

  return (
    <div className="text-white">
      {!started && (
        <>
          {input}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="label mr-1 text-gray">Try</span>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s, { reset: true })}
                className="border border-white/15 px-3 py-2 text-left text-[0.9rem] text-white/85 transition-colors hover:border-blue-bright hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {started && (
        <div className="space-y-14">
          {turns.map((t, i) => (
            <div key={t.id} ref={i === turns.length - 1 ? lastTurnRef : undefined} className="scroll-mt-28">
              {i > 0 && <div className="mb-10 h-px bg-white/10" aria-hidden />}
              {t.result ? (
                <>
                  <Described result={t.result} />
                  <FinderResultView result={t.result} />
                </>
              ) : t.error ? (
                <p className="text-amber-200">{t.error}</p>
              ) : (
                <>
                  <p className="label text-blue-bright">You described</p>
                  <p className="heading mt-3 max-w-3xl text-xl text-white sm:text-2xl">&ldquo;{t.query}&rdquo;</p>
                  <Thinking />
                </>
              )}
            </div>
          ))}

          {!busy && last?.result && (
            <div className="border-t border-white/10 pt-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="label mr-1 text-gray">Follow up</span>
                {last.result.followUps.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => ask(f)}
                    className="border border-white/15 px-3 py-2 text-left text-[0.9rem] text-white/85 transition-colors hover:border-blue-bright hover:text-white"
                  >
                    {f}
                  </button>
                ))}
              </div>
              {input}
              <button
                type="button"
                onClick={() => {
                  setTurns([]);
                  ctxRef.current = undefined;
                  requestAnimationFrame(() => inputRef.current?.focus());
                }}
                className="label mt-4 inline-flex items-center gap-2 text-gray hover:text-white"
              >
                <Return size={14} /> New search
              </button>
            </div>
          )}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {last?.result ? `Results ready for: ${last.query}` : ""}
      </p>
    </div>
  );
}
