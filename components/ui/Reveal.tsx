"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from "react";

/** Adds `is-in` once the element scrolls into view. Pair with `.reveal`, `.rule-draw`. */
export function useInView<T extends Element>(opts: IntersectionObserverInit = { rootMargin: "0px 0px -12% 0px" }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, opts);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView] as const;
}

export function Reveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  plain = false,
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Only toggle `is-in` (for children using rule-draw etc.) without fading the wrapper. */
  plain?: boolean;
  id?: string;
  "aria-labelledby"?: string;
}) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`${plain ? "" : "reveal"} ${inView ? "is-in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
