"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type Direction = "up" | "down" | "left" | "right" | "none";

/**
 * Horizontal directions translate the element outside its parent's box until
 * it enters the viewport. Any ancestor using `left` / `right` must therefore
 * carry `overflow-x: clip` (see `Projects` and `Contact`), or the offset
 * widens the document and, on real mobile browsers, the layout viewport too.
 */
const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 26 },
  down: { x: 0, y: -26 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Motion components are resolved from a static table declared at module scope.
 * Creating them during render would hand React a new component identity on
 * every pass and remount the subtree.
 */
const MOTION: Record<string, ElementType> = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  section: motion.section,
  article: motion.article,
  figure: motion.figure,
  header: motion.header,
};

export type RevealTag = keyof typeof MOTION;

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The single scroll-entry primitive for the whole site.
 *
 * One consistent curve and distance everywhere keeps motion feeling designed
 * rather than accidental. Under `prefers-reduced-motion` it renders the final
 * state immediately, with no transform and no observer.
 */
export function Reveal({
  children,
  as = "div",
  direction = "up",
  delay = 0,
  duration = 0.85,
  amount = 0.3,
  blur = true,
  className,
}: {
  children: ReactNode;
  as?: RevealTag;
  direction?: Direction;
  delay?: number;
  duration?: number;
  amount?: number;
  blur?: boolean;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const Tag = as as ElementType;

  if (reduce) return <Tag className={className}>{children}</Tag>;

  const MotionTag = MOTION[as];
  const { x, y } = OFFSET[direction];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, x, y, filter: blur ? "blur(6px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.03 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};

/** Wraps a list so its `StaggerItem` children cascade on entry. */
export function Stagger({
  children,
  className,
  amount = 0.2,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  as?: RevealTag;
}) {
  const reduce = usePrefersReducedMotion();
  const Tag = as as ElementType;

  if (reduce) return <Tag className={className}>{children}</Tag>;

  const MotionTag = MOTION[as];

  return (
    <MotionTag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: RevealTag;
}) {
  const reduce = usePrefersReducedMotion();
  const Tag = as as ElementType;

  if (reduce) return <Tag className={className}>{children}</Tag>;

  const MotionTag = MOTION[as];

  return (
    <MotionTag className={className} variants={staggerItem}>
      {children}
    </MotionTag>
  );
}
