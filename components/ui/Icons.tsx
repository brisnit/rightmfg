import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...rest }: P) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    "aria-hidden": true,
    ...rest,
  };
}

export const ArrowRight = (p: P) => (
  <svg {...base({ ...p, className: `flip-rtl ${p.className ?? ""}` })}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
export const ArrowUpRight = (p: P) => (
  <svg {...base({ ...p, className: `flip-rtl ${p.className ?? ""}` })}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const Search = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);
export const Close = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
);
export const Plus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v16M4 12h16" />
  </svg>
);
export const Minus = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h16" />
  </svg>
);
export const Check = (p: P) => (
  <svg {...base(p)}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);
export const Menu = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </svg>
);
export const ChevronDown = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const Upload = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
  </svg>
);
export const File = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3h8l4 4v14H6zM14 3v4h4" />
  </svg>
);
export const Phone = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
  </svg>
);
export const Mail = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 5h18v14H3zM3 6l9 7 9-7" />
  </svg>
);
export const Download = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v12M6 10l6 6 6-6M4 20h16" />
  </svg>
);
export const Play = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 5v14l11-7z" />
  </svg>
);
export const Pause = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 5v14M16 5v14" />
  </svg>
);
export const Alert = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 2 20h20zM12 10v4M12 17v.5" />
  </svg>
);
/** Crosshair / registration mark — used as the Finder's glyph instead of AI sparkles. */
export const Reticle = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="7" />
    <path d="M12 2v5M12 17v5M2 12h5M17 12h5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);
export const Return = (p: P) => (
  <svg {...base({ ...p, className: `flip-rtl ${p.className ?? ""}` })}>
    <path d="M20 5v7H6M10 8l-4 4 4 4" />
  </svg>
);
export const Globe = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </svg>
);
