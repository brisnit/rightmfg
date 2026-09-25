"use client";

import { useEffect, useRef, useState } from "react";
import { OPEN_EVENT, type AskDetail } from "@/lib/finder/events";
import { Close, Reticle } from "@/components/ui/Icons";
import { FinderPanel } from "./FinderPanel";

/** Site-wide Finder: opened from the header search, ⌘K, or any compact Finder input. */
export function FinderDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [session, setSession] = useState<{ key: number; query?: string } | null>(null);

  useEffect(() => {
    const open = (e: Event) => {
      const q = (e as CustomEvent<AskDetail>).detail?.query;
      setSession({ key: Date.now(), query: q });
      const d = ref.current;
      if (d && !d.open) d.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: {} }));
      }
    };
    window.addEventListener(OPEN_EVENT, open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      onClose={() => {
        document.documentElement.style.overflow = "";
      }}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-label="Capability Finder"
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/80 sm:m-auto sm:h-[min(92dvh,60rem)] sm:w-[min(94vw,76rem)]"
    >
      <div className="blueprint flex h-full flex-col bg-navy text-white sm:border sm:border-white/15">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-8">
          <p className="label flex items-center gap-3 text-white">
            <Reticle size={18} className="text-blue-bright" />
            Capability Finder
            <span className="hidden text-gray sm:inline">/ Can Right build it?</span>
          </p>
          <button type="button" onClick={close} className="flex h-10 w-10 items-center justify-center text-white/70 hover:text-white" aria-label="Close Capability Finder">
            <Close size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8 sm:py-8">
          {session && <FinderPanel key={session.key} initialQuery={session.query} autoFocus={!session.query} />}
        </div>
      </div>
    </dialog>
  );
}
