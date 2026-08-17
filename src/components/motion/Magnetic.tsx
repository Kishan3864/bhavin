"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useRef, type ReactNode } from "react";
import { useHasPointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Pointer-magnetic wrapper.
 *
 * Reads bounds on pointer *enter* (one layout read per hover, not per move),
 * then drives a spring on the GPU. Inert on touch devices and under
 * `prefers-reduced-motion`, where it renders a plain element with no listeners.
 */
export function Magnetic({
  children,
  strength = 0.32,
  radius = 0.9,
  className,
}: {
  children: ReactNode;
  /** 0 = static, 1 = the element tracks the pointer exactly. */
  strength?: number;
  /** Fraction of the element's half-size the pull is normalised against. */
  radius?: number;
  className?: string;
}) {
  const hasPointer = useHasPointer();
  const reduce = usePrefersReducedMotion();
  const enabled = hasPointer && !reduce;

  const ref = useRef<HTMLDivElement | null>(null);
  const bounds = useRef<DOMRect | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 190, damping: 16, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 190, damping: 16, mass: 0.35 });

  const onEnter = useCallback(() => {
    bounds.current = ref.current?.getBoundingClientRect() ?? null;
  }, []);

  const onMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = bounds.current;
      if (!rect) return;
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      x.set((relX / ((rect.width / 2) * radius)) * (rect.width / 2) * strength);
      y.set((relY / ((rect.height / 2) * radius)) * (rect.height / 2) * strength);
    },
    [radius, strength, x, y],
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
