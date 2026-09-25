"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@/components/ui/Icons";

/**
 * Background footage from Right's own shop floor. Muted, looping, with a visible
 * pause control (WCAG 2.2.2). Reduced-motion users get the still poster.
 */
export function HeroVideo({ poster, src, srcMobile, label }: { poster: string; src: string; srcMobile: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Poster paints first (preload="none"); footage only loads when motion is allowed.
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover photo-grade"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
      >
        <source src={srcMobile} type="video/mp4" media="(max-width: 767px)" />
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="label absolute right-4 top-[5.25rem] z-20 flex h-10 items-center gap-2 border border-white/25 bg-ink/50 px-3 text-[0.66rem] text-white/80 hover:text-white sm:right-8 lg:right-12 lg:top-44"
        aria-label={playing ? `Pause background video: ${label}` : `Play background video: ${label}`}
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
        <span className="hidden sm:inline">{playing ? "Pause" : "Play"}</span>
      </button>
    </>
  );
}
