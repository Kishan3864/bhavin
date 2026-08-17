"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Returns `false` on the server and during the
 * first client render, then settles after mount — so markup never mismatches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True only for devices with a real hovering pointer (mouse / trackpad). */
export function useHasPointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/**
 * Reduced-motion preference, read *after* mount.
 *
 * Framer's own `useReducedMotion` reports the real value on the very first
 * client render, which for a visitor with the preference on means the client
 * tree no longer matches the server tree and React throws out the whole
 * hydration. This version reports `false` through hydration and settles
 * immediately after — same end state, no mismatch. Use it everywhere instead.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
