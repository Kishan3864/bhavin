"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useHasPointer } from "@/hooks/useMediaQuery";

/**
 * Custom pointer: a sharpened arrow that tracks the mouse almost 1:1, plus a
 * lagging label plate that appears over anything carrying `data-cursor`.
 *
 * Position is written to motion values only — React never re-renders on
 * pointer move. Mounted exclusively on fine-pointer devices; the CSS in
 * `globals.css` hides `.cursor-shell` on coarse pointers as a second guard.
 */
export function Cursor() {
  // `useHasPointer` is already false on the server and on the first client
  // render, so it doubles as the mount guard — no extra state needed.
  const hasPointer = useHasPointer();
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  /* The arrow is bound straight to the pointer — no spring. Any smoothing at
     all reads as lag on the thing the user is aiming with, and it costs a
     spring simulation per frame for nothing. Only the label plate trails, so
     the two still feel connected. */
  const plateX = useSpring(x, { stiffness: 1400, damping: 48, mass: 0.18 });
  const plateY = useSpring(y, { stiffness: 1400, damping: 48, mass: 0.18 });

  useEffect(() => {
    if (!hasPointer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only now is it safe to hide the native cursor — see globals.css.
    document.documentElement.setAttribute("data-cursor-active", "");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.("[data-cursor]");
      setLabel(target instanceof HTMLElement ? target.dataset.cursor || null : null);
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.documentElement.removeAttribute("data-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [hasPointer, visible, x, y]);

  if (!hasPointer) return null;

  const active = Boolean(label);

  return (
    <div className="cursor-shell pointer-events-none fixed inset-0 z-[90] hidden md:block motion-reduce:!hidden">
      {/* Label plate — trails the arrow, only over interactive targets */}
      <motion.div
        /* The ring keeps the plate readable when it lands on a dark button. */
        className="absolute left-0 top-0 flex items-center justify-center rounded-sm bg-ink px-2.5 py-1.5 ring-1 ring-inset ring-white/20"
        style={{ x: plateX, y: plateY, translateX: 14, translateY: 16 }}
        initial={false}
        animate={{
          opacity: active && visible ? 1 : 0,
          scale: active ? (pressed ? 0.94 : 1) : 0.8,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence mode="wait">
          {active && (
            <motion.span
              key={label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="type-label whitespace-nowrap text-[0.5rem] leading-none text-paper-raised"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Arrow — the pointer itself */}
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        className="absolute left-0 top-0"
        style={{ x, y, translateX: -2, translateY: -2 }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.82 : active ? 0.86 : 1,
          rotate: active ? -12 : 0,
        }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Paper-coloured casing keeps the mark legible over dark surfaces */}
        <path
          d="M4 2.4 16.4 11.1 10.6 11.9 8.1 17.4Z"
          fill="var(--color-paper-raised)"
          stroke="var(--color-paper-raised)"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path
          d="M4 2.4 16.4 11.1 10.6 11.9 8.1 17.4Z"
          fill="var(--color-ink)"
          stroke="var(--color-ink)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}
