"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import type { ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Word-level reveal with a clip mask — each word rises out of its own
 * overflow-hidden line box, which reads far cleaner than per-character motion
 * at editorial sizes and creates a fraction of the DOM nodes.
 *
 * The full sentence stays in the accessibility tree via `aria-label`; the
 * animated spans are hidden from screen readers.
 */
export function SplitWords({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.035,
  duration = 0.9,
  amount = 0.6,
  once = true,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
}) {
  const reduce = usePrefersReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
        style={{ display: "inline" }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-flex",
              overflow: "hidden",
              verticalAlign: "top",
              paddingBottom: "0.12em",
              marginBottom: "-0.12em",
            }}
          >
            <motion.span
              className={wordClassName}
              style={{ display: "inline-block", willChange: "transform, opacity" }}
              variants={{
                hidden: { y: "108%", opacity: 0 },
                visible: { y: "0%", opacity: 1, transition: { duration, ease: EASE } },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * Line-level reveal for headline stacks. Each array entry is one visual line,
 * masked and lifted with a staged delay.
 */
export function SplitLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.11,
  duration = 1.1,
  animateOnMount = false,
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  animateOnMount?: boolean;
}) {
  const reduce = usePrefersReducedMotion();

  if (reduce) {
    return (
      <span className={className}>
        {lines.map((line) => (
          <span key={line} className={lineClassName} style={{ display: "block" }}>
            {line}
          </span>
        ))}
      </span>
    );
  }

  const animationProps = animateOnMount
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };

  return (
    <motion.span
      className={className}
      aria-label={lines.join(" ")}
      initial="hidden"
      {...animationProps}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      style={{ display: "block" }}
    >
      {lines.map((line) => (
        <span
          key={line}
          aria-hidden="true"
          style={{
            display: "block",
            overflow: "hidden",
            paddingBottom: "0.08em",
            marginBottom: "-0.08em",
          }}
        >
          <motion.span
            className={lineClassName}
            style={{ display: "block", willChange: "transform, opacity" }}
            variants={{
              hidden: { y: "104%", opacity: 0 },
              visible: { y: "0%", opacity: 1, transition: { duration, ease: EASE } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
