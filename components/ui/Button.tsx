import Link from "@/components/ui/LocaleLink";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "./Icons";

type Variant = "primary" | "ghost-light" | "ghost-dark" | "white" | "text-light" | "text-dark";

const styles: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-600 border border-blue hover:border-blue-600",
  white: "bg-white text-navy hover:bg-mist border border-white",
  "ghost-light": "border border-white/35 text-white hover:border-white hover:bg-white/5",
  "ghost-dark": "border border-navy/25 text-navy hover:border-navy hover:bg-navy/[0.03]",
  "text-light": "text-white px-0! h-auto! border-b border-white/40 hover:border-white pb-1",
  "text-dark": "text-navy px-0! h-auto! border-b border-navy/30 hover:border-navy pb-1",
};

interface Props extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({ variant = "primary", arrow = true, className = "", children, ...rest }: Props) {
  return (
    <Link
      {...rest}
      className={`label group/btn inline-flex h-12 items-center justify-center gap-3 px-6 text-[0.78rem] tracking-[0.1em] transition-colors duration-200 ${styles[variant]} ${className}`}
    >
      <span>{children}</span>
      {arrow && <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />}
    </Link>
  );
}
