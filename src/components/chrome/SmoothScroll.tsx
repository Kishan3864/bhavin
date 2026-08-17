"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum scrolling.
 *
 * Tuned to take the edge off the wheel without the page coasting. `duration`
 * is how long a wheel impulse takes to settle — measured at ~420ms here, down
 * from ~960ms, which is the difference between "smooth" and "sluggish".
 * `wheelMultiplier` above 1 keeps each notch covering a normal amount of
 * ground so a shorter settle does not mean a shorter scroll.
 *
 * Skipped entirely when the visitor prefers reduced motion or is on a coarse
 * pointer — native scrolling is better on touch and we never override it.
 * Anchor navigation is delegated here so `href="#id"` keeps working.
 */
const SETTLE_SECONDS = 0.42;
const ANCHOR_SECONDS = 0.65;

export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isCoarse) return;

    const lenis = new Lenis({
      duration: SETTLE_SECONDS,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.25,
      touchMultiplier: 1.6,
      autoRaf: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.("a[href^='#']");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -88, duration: ANCHOR_SECONDS });
      history.replaceState(null, "", `#${id}`);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
