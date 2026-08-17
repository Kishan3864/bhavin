"use client";

import { ArrowUpRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-sm font-medium tracking-[-0.01em] transition-[transform,color,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  solid:
    "bg-ink text-paper-raised shadow-[0_1px_2px_rgba(12,12,15,0.18),0_10px_28px_-14px_rgba(12,12,15,0.5)] hover:shadow-[0_1px_2px_rgba(12,12,15,0.2),0_18px_40px_-16px_rgba(12,12,15,0.55)]",
  outline:
    "border border-hairline-strong bg-paper-raised/60 text-ink backdrop-blur-sm hover:border-ink/45 hover:bg-paper-raised",
  ghost: "text-ink-60 hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.875rem]",
  lg: "h-[3.25rem] px-7 text-[0.9375rem] sm:h-14 sm:px-8",
};

function Inner({
  children,
  arrow,
  variant,
}: {
  children: ReactNode;
  arrow: boolean;
  variant: Variant;
}) {
  return (
    <>
      {/* Light sheen sweep, solid variant only. Pure transform — no repaint. */}
      {variant === "solid" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -translate-x-[220%] skew-x-[-18deg] bg-white/16 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-[420%] motion-reduce:hidden"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {arrow && (
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 motion-reduce:transition-none"
          />
        )}
      </span>
    </>
  );
}

export function Button({
  children,
  variant = "solid",
  size = "md",
  arrow = false,
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
}) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Inner arrow={arrow} variant={variant}>
        {children}
      </Inner>
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "solid",
  size = "md",
  arrow = false,
  external = false,
  className,
  ...props
}: ComponentPropsWithoutRef<"a"> & {
  href: string;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <Inner arrow={arrow} variant={variant}>
        {children}
      </Inner>
    </a>
  );
}
