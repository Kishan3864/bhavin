"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitText";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Shared section masthead: index marker, icon, hairline rule, eyebrow label
 * and an optional editorial title. Repeating this exact composition is what
 * makes the page read as one system rather than a stack of unrelated blocks.
 */
export function SectionHeader({
  index,
  eyebrow,
  icon,
  title,
  aside,
  className,
}: {
  index: string;
  eyebrow: string;
  icon?: string;
  title?: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <Reveal direction="none" blur={false} duration={0.7}>
        <div className="flex items-center gap-3 border-t border-hairline pt-4 sm:gap-4">
          <span className="type-label text-signal tabular-nums">{index}</span>
          {icon ? (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-ink/[0.05] text-ink-60 ring-1 ring-inset ring-ink/[0.06]">
              <Icon name={icon} className="size-3.5" />
            </span>
          ) : null}
          <span className="type-label text-ink-40">{eyebrow}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
          {aside ? <div className="hidden shrink-0 sm:block">{aside}</div> : null}
        </div>
      </Reveal>

      {title ? (
        <SplitWords
          as="h2"
          text={title}
          className="type-headline mt-8 max-w-[19ch] text-balance sm:mt-10"
          amount={0.4}
        />
      ) : null}
    </div>
  );
}
