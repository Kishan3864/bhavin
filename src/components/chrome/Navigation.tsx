"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { navigation, profile } from "@/content/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* The desktop bar drops `index` — the wordmark already returns you there. */
const NAV_ITEMS = navigation.slice(1);

/**
 * ACTIVE STATE — the signal slab.
 *
 * The current section is not marked, it is *taken over*: an opaque accent block
 * the exact size of the item, at the same 36px height and 2px radius as the ink
 * CTA, with the label knocked out of it in paper. The header then reads as two
 * blocks in a hierarchy — blue is where you are, black is what to do.
 *
 * The block's two vertical edges run on different springs, so it never slides:
 * the edge facing the destination leaves first and the block stretches open
 * across the words in between, then the trailing edge closes it onto the new
 * word. Everything it covers at any instant is inverted to paper, so a
 * scroll-spy sweep reads as a beam of light running the row.
 *
 * ONE constant owns the geometry of a label. The real link and its knockout
 * twin both wear it, so the two rows stay per-pixel registered. This is why the
 * active item changes `color` and NOTHING else — a weight or tracking change
 * would resize the word and break the knockout, which is the whole readability
 * guarantee.
 */
const NAV_ROW = "flex items-center gap-2";
const NAV_ITEM =
  "flex h-9 items-center whitespace-nowrap px-3 text-[0.8125rem] tracking-[-0.01em]";

/**
 * Opaque on purpose, with no alpha anywhere. An alpha fill would sample
 * whatever scrolls beneath `backdrop-blur-xl` once the header condenses, so the
 * indicator would change appearance section by section. The centre stop is
 * exactly `--color-signal`; the ±6% ends give it a surface rather than a flat
 * rectangle. One specular top edge and one tight lift, so it sits rather than
 * floats — a wide coloured glow would pull this toward SaaS-button.
 */
const SLAB_SURFACE =
  "bg-[linear-gradient(180deg,#3949ea_0%,#2c3fe8_46%,#2334cf_100%)] " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.30),0_2px_5px_-3px_rgba(28,42,190,0.55)]";

/**
 * Speed reads as heat: a lighter copy of the same gradient, crossfaded over the
 * base by how far the slab is currently stretched past its resting width.
 * Opaque over opaque, so the composite stays 100% opaque at every intermediate
 * alpha. Paper on the palest stop measures 4.86:1, so the label clears AA even
 * at peak heat. It is a pure derivation of live geometry — no keyframe, no
 * timer, nothing to retrigger — which is why a five-step sweep cannot flash it.
 */
const SLAB_HEAT = "bg-[linear-gradient(180deg,#4e5cef_0%,#4453ee_46%,#3a49dd_100%)]";

/** Stretch, as a fraction of the resting width, at which heat saturates. */
const HEAT_SPAN = 0.55;

/* The edge travelling toward the destination leads; the other trails, and that
   lag IS the stretch. Both overdamped — a saturated block that wobbles reads as
   a bug, and stacked retargets during a sweep would compound any overshoot. */
const EDGE_LEAD = { type: "spring", stiffness: 420, damping: 36, mass: 0.55 } as const;
const EDGE_TRAIL = { type: "spring", stiffness: 190, damping: 28, mass: 0.7 } as const;

/* Hover travel, resting width, and silent geometry corrections. Fast and flat:
   it must never read as a second gesture. */
const SNAP = { type: "spring", stiffness: 700, damping: 46, mass: 0.5 } as const;

type NavBox = { left: number; right: number };

export function Navigation() {
  const { scrollY, scrollYProgress } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  const ids = useMemo(() => navigation.map((item) => item.id), []);
  const active = useActiveSection(ids);
  const reduceMotion = usePrefersReducedMotion();

  const rowRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [boxes, setBoxes] = useState<NavBox[]>([]);
  const [hovered, setHovered] = useState(-1);

  /* The slab and its knockout are not two animations kept in sync — they are
     two readers of the same two edge positions, written in one pass of one
     frame loop. There is no pairing that could leave a sliver of ink on blue. */
  const slabL = useMotionValue(0);
  const slabR = useMotionValue(0);
  const slabRest = useMotionValue(0);
  const rowW = useMotionValue(0);

  const hoverL = useMotionValue(0);
  const hoverR = useMotionValue(0);
  const hoverFill = useMotionValue(0);

  /* min/abs rather than l and r-l: a violent scroll reversal that crossed the
     two edges narrows the block to zero instead of inverting it. */
  const slabX = useTransform(() => Math.min(slabL.get(), slabR.get()));
  const slabW = useTransform(() => Math.abs(slabR.get() - slabL.get()));
  const hoverX = useTransform(() => Math.min(hoverL.get(), hoverR.get()));
  const hoverW = useTransform(() => Math.abs(hoverR.get() - hoverL.get()));

  const slabHeat = useTransform(() => {
    const rest = slabRest.get();
    if (rest < 4) return 0;
    const stretch = Math.abs(slabR.get() - slabL.get()) / rest - 1;
    return Math.min(1, Math.max(0, stretch / HEAT_SPAN));
  });

  /* The knockout window, from the same two edges. When the block is collapsed
     the insets meet, the clip is empty, and the paper twin vanishes with it. */
  const knockout = useTransform(() => {
    const left = Math.max(0, Math.min(slabL.get(), slabR.get()));
    const right = Math.max(slabL.get(), slabR.get());
    return `inset(0px ${Math.max(0, rowW.get() - right)}px 0px ${left}px round 2px)`;
  });

  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === active);
  /* No desktop item exists for `index`. Rather than unmounting over the hero —
     a hard cut every time the reader crosses that boundary — the block
     collapses to zero width and wipes back open on the way down. There is
     therefore no opacity fade anywhere on the slab: it is either fully opaque
     or geometrically absent, never semi-transparent over type. */
  const slabIndex = activeIndex < 0 ? 0 : activeIndex;
  const slabOpen = activeIndex >= 0 && boxes.length === NAV_ITEMS.length;

  /* Measured against the row's own rect, never the viewport, so the header's
     700ms condense — which moves the nav but not its internals — costs nothing.
     setBoxes bails when nothing actually moved: the ResizeObserver fires on
     every frame of that transition, and an unguarded new array would re-run the
     placement effect dozens of times mid-scroll. */
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const measure = () => {
      const base = row.getBoundingClientRect();
      if (base.width === 0) return; // display:none below lg
      const els = itemRefs.current;
      if (els.length !== NAV_ITEMS.length || els.some((el) => !el)) return;

      rowW.set(base.width);
      const next = els.map((el) => {
        const rect = el!.getBoundingClientRect();
        return {
          left: Math.round(rect.left - base.left),
          right: Math.round(rect.right - base.left),
        };
      });

      setBoxes((prev) =>
        prev.length === next.length &&
        prev.every((box, i) => box.left === next[i]!.left && box.right === next[i]!.right)
          ? prev
          : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    /* Geist arrives via next/font — metrics shift on swap. */
    document.fonts.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [rowW]);

  const placed = useRef(false);
  const wasOpen = useRef(false);
  const appliedIndex = useRef(-1);
  const running = useRef<{ stop: () => void }[]>([]);

  useEffect(() => {
    const box = boxes[slabIndex];
    if (!box) return;

    const toL = box.left;
    const toR = slabOpen ? box.right : box.left;
    const navigated = appliedIndex.current !== slabIndex;
    const toggled = wasOpen.current !== slabOpen;
    appliedIndex.current = slabIndex;
    wasOpen.current = slabOpen;

    /* First placement must not fly in from x=0, and reduced motion never flies
       at all. Jumping also pins the stretch ratio at exactly 1, which switches
       the heat overlay off for free. framer-motion does not honour
       prefers-reduced-motion itself, hence the explicit branch. */
    if (!placed.current || reduceMotion) {
      placed.current = true;
      slabL.jump(toL);
      slabR.jump(toR);
      slabRest.jump(Math.max(0, toR - toL));
      return;
    }

    /* Crossing the hero boundary wipes open on the destination item itself
       rather than flying the block across the row, so a deep link or a reload
       mid-page reveals in place instead of blooming over four labels. */
    if (toggled) {
      if (slabOpen) {
        slabL.jump(toL);
        slabR.jump(toL);
        slabRest.jump(Math.max(0, box.right - box.left));
        running.current = [animate(slabR, toR, EDGE_LEAD)];
      } else {
        running.current = [
          animate(slabL, toL, SNAP),
          animate(slabR, toR, EDGE_TRAIL),
          animate(slabRest, 0, SNAP),
        ];
      }
      return;
    }

    /* Same section, new geometry (resize, font swap, the row compressing as the
       header condenses): correct it fast, on a spring rather than a jump, so a
       correction landing mid-travel bends the block instead of teleporting it. */
    if (!navigated) {
      running.current = [
        animate(slabL, toL, SNAP),
        animate(slabR, toR, SNAP),
        animate(slabRest, Math.max(0, toR - toL), SNAP),
      ];
      return;
    }

    /* Direction from LIVE GEOMETRY, not index order. useActiveSection picks the
       highest intersectionRatio, which is not monotonic during a fast scroll —
       an index comparison would swap which edge leads midway through a sweep
       and the beam would wobble instead of stretching. */
    const centre = (slabL.get() + slabR.get()) / 2;
    const forward = toL >= centre;

    /* Velocity is handed over explicitly and the in-flight animation is not
       stopped first. During a 650ms anchor scroll the observer retargets these
       five or six times; the block has to accelerate through as one gesture
       rather than restart on each step. The trailing edge is slower than the
       step interval, so it never catches up mid-sweep and the block stays
       elongated — one beam, not seven hops. */
    running.current = [
      animate(slabL, toL, { ...(forward ? EDGE_TRAIL : EDGE_LEAD), velocity: slabL.getVelocity() }),
      animate(slabR, toR, { ...(forward ? EDGE_LEAD : EDGE_TRAIL), velocity: slabR.getVelocity() }),
      animate(slabRest, Math.max(0, toR - toL), SNAP),
    ];
  }, [boxes, slabIndex, slabOpen, reduceMotion, slabL, slabR, slabRest]);

  /* HOVER — the slab's footprint filling from the bottom edge in signal-wash.
     Pale blue is "candidate", saturated is "current". It reveals by geometry
     (scaleY), never by opacity, so the fill is opaque in every frame. Under the
     active item it is completely hidden by the slab, so no special-casing is
     needed — and as the slab leaves a hovered item the plate is revealed
     underneath, which is the hand-off. */
  const hoverPlaced = useRef(false);

  useEffect(() => {
    const box = hovered >= 0 ? boxes[hovered] : undefined;

    if (!box) {
      animate(hoverFill, 0, reduceMotion ? { duration: 0 } : { duration: 0.22, ease: EASE });
      hoverPlaced.current = false;
      return;
    }

    /* Entering the row places the plate; only moving *within* it travels, so it
       never slides in from the item you hovered a minute ago. */
    if (!hoverPlaced.current || reduceMotion) {
      hoverL.jump(box.left);
      hoverR.jump(box.right);
    } else {
      animate(hoverL, box.left, SNAP);
      animate(hoverR, box.right, SNAP);
    }
    hoverPlaced.current = true;
    animate(hoverFill, 1, reduceMotion ? { duration: 0 } : { duration: 0.34, ease: EASE });
  }, [hovered, boxes, reduceMotion, hoverL, hoverR, hoverFill]);

  /* Stop anything still in flight if the header unmounts. */
  useEffect(() => {
    const controls = running;
    return () => {
      for (const control of controls.current) control.stop();
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (value) => {
    setCondensed(value > 72);
  });

  // Lock the page while the mobile sheet is open, without a layout jump.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = previous;
      document.body.style.paddingRight = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Reading progress — a single hairline at the very top edge. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[85] h-px origin-left bg-signal"
        style={{ scaleX: scrollYProgress }}
      />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-[80]">
        <div className="shell pt-3 sm:pt-5">
          <div
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-4 rounded-sm transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              condensed
                ? "border border-white/70 bg-paper-raised/72 px-3 py-2 shadow-[0_1px_1px_rgba(12,12,15,0.03),0_12px_32px_-14px_rgba(12,12,15,0.18)] backdrop-blur-xl backdrop-saturate-150 sm:px-4"
                : "border border-transparent bg-transparent px-1 py-2 shadow-none sm:px-2",
            )}
          >
            {/* Identity */}
            <a
              href="#index"
              className="group flex shrink-0 items-center gap-2.5 rounded-sm pl-1 pr-2"
              aria-label={`${profile.name} — back to top`}
            >
              <span className="relative flex size-7 items-center justify-center rounded-sm bg-ink text-[0.5625rem] font-semibold tracking-tight text-paper-raised">
                {profile.initials}
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[0.8125rem] font-medium tracking-[-0.01em]">
                  {profile.name}
                </span>
                <span className="type-meta mt-1 hidden text-[0.625rem] text-ink-40 sm:block">
                  {profile.role}
                </span>
              </span>
            </a>

            {/* Desktop links. Four layers in one isolated stacking context:
                hover plate (0) → real links (10) → slab (20) → knockout (30).
                The links sit UNDER the opaque slab, so a dark glyph is never
                drawn on top of it — it is occluded by it — and the paper twin
                row above repaints those same words, clipped to the slab's exact
                rect from the same motion values. Dark-on-dark is unreachable
                rather than merely avoided.

                The wrapper exists because a <ul> may only contain <li>: the
                three overlays are its siblings, and it is also the measurement
                origin, so the header's condense transition needs no
                correction. */}
            <nav aria-label="Section navigation" className="hidden lg:block">
              <div
                ref={rowRef}
                className="relative isolate"
                onPointerLeave={() => setHovered(-1)}
              >
                {/* L0 — hover plate. Fills upward from the bottom edge; opaque
                    at every frame because it reveals by scaleY, not alpha. */}
                <motion.span
                  aria-hidden="true"
                  style={{
                    x: hoverX,
                    width: hoverW,
                    scaleY: hoverFill,
                    transformOrigin: "bottom",
                  }}
                  className="pointer-events-none absolute left-0 top-0 z-0 h-9 rounded-sm bg-signal-wash will-change-transform"
                />

                {/* L10 — the real, interactive row. Label colour is driven only
                    by hover and active state; the indicator never touches it, so
                    there is no crossfade to mis-time. `gap-2` is load-bearing,
                    not taste: the global focus ring is 2px at 3px offset, so it
                    sits outside the box and a neighbouring slab would eat it at
                    a tighter gap. */}
                <ul className={cn(NAV_ROW, "relative z-10")}>
                  {NAV_ITEMS.map((item, i) => {
                    const isActive = active === item.id;
                    return (
                      <li key={item.id}>
                        {/* `h-9` pins the box at exactly 36px — matching the CTA
                            and the menu button, so the header keeps its height,
                            and so the slab reads as a control of the same family
                            as "Get in touch". */}
                        <a
                          ref={(el) => {
                            itemRefs.current[i] = el;
                          }}
                          href={`#${item.id}`}
                          aria-current={isActive ? "true" : undefined}
                          onPointerEnter={(event) => {
                            if (event.pointerType !== "touch") setHovered(i);
                          }}
                          onFocus={() => setHovered(i)}
                          onBlur={() => setHovered(-1)}
                          className={cn(
                            NAV_ITEM,
                            "rounded-sm transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            isActive ? "text-ink" : "text-ink-60 hover:text-ink",
                          )}
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>

                {/* L20 — the slab. Two edges, two springs: it stretches open in
                    the direction of travel and closes behind itself. `width` is
                    the one layout property, on a childless out-of-flow box under
                    `contain: layout`, so it can never touch sibling layout. At
                    zero width nothing paints — every shadow layer has negative
                    spread, so the collapsed state leaves no smear. */}
                <motion.span
                  aria-hidden="true"
                  style={{ x: slabX, width: slabW, contain: "layout" }}
                  className={cn(
                    "pointer-events-none absolute left-0 top-0 z-20 h-9 rounded-sm will-change-transform",
                    SLAB_SURFACE,
                  )}
                >
                  {/* Heat. Opacity over an opaque base rather than an animated
                      background-color: the composite stays fully opaque, so the
                      block cannot tint with whatever scrolls under the condensed
                      header's backdrop-blur. */}
                  <motion.span
                    aria-hidden="true"
                    style={{ opacity: slabHeat }}
                    className={cn("absolute inset-0 rounded-[inherit]", SLAB_HEAT)}
                  />
                </motion.span>

                {/* L30 — knockout twin. Same NAV_ROW, same NAV_ITEM, same order,
                    same width, so both flex containers distribute any shrink
                    identically and the two rows stay per-pixel registered.
                    Clipped to the slab from the SAME motion values, so a
                    half-covered word wipes cleanly at a hard vertical edge
                    instead of smearing. */}
                <motion.span
                  aria-hidden="true"
                  style={{ clipPath: knockout }}
                  className={cn(
                    NAV_ROW,
                    "pointer-events-none absolute inset-0 z-30 text-paper-raised",
                  )}
                >
                  {NAV_ITEMS.map((item) => (
                    <span key={item.id} className={NAV_ITEM}>
                      {item.label}
                    </span>
                  ))}
                </motion.span>
              </div>
            </nav>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden items-center gap-2 rounded-sm border border-hairline px-3 py-1.5 md:flex">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full rounded-full bg-emerald-500/70 animate-pulse-ring" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="type-label text-[0.5625rem] text-ink-60">
                  {profile.available ? "Available" : "Booked"}
                </span>
              </div>

              <Magnetic strength={0.24} className="hidden sm:block">
                <a
                  href="#contact"
                  data-cursor="LET'S TALK"
                  className="group/cta relative inline-flex h-9 items-center overflow-hidden rounded-sm bg-ink px-4 text-[0.8125rem] font-medium text-paper-raised transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -translate-x-[220%] skew-x-[-18deg] bg-white/18 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-[420%] motion-reduce:hidden"
                  />
                  <span className="relative">Get in touch</span>
                </a>
              </Magnetic>

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="flex size-9 items-center justify-center rounded-sm border border-hairline-strong bg-paper-raised/70 text-ink transition-colors duration-300 hover:bg-paper-raised lg:hidden"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={open} active={active} onClose={close} />
    </>
  );
}

function MobileMenu({
  open,
  active,
  onClose,
}: {
  open: boolean;
  active: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  /* The sheet covers the page, so it is treated as a modal: focus moves in on
     open, is trapped inside while open, and returns to the trigger on close. */
  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !panel?.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreTo.current?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          key="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-[79] lg:hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-paper/92 backdrop-blur-2xl"
            onClick={onClose}
          />

          <motion.nav
            ref={panelRef}
            aria-label="Mobile navigation"
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative flex h-full flex-col justify-between overflow-y-auto px-[clamp(1.125rem,4.2vw,5rem)] pb-10 pt-28"
          >
            <ul className="flex flex-col">
              {/* NAV_ITEMS, not `navigation` — the sheet was listing the
                  hero's "Index" entry, which is not a real destination. The
                  wordmark above already returns you to the top. */}
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.05 + i * 0.045, ease: EASE }}
                  className="border-b border-hairline"
                >
                  <a
                    href={`#${item.id}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-baseline gap-4 py-4 transition-colors duration-300",
                      active === item.id ? "text-ink" : "text-ink-60",
                    )}
                  >
                    <span className="text-[clamp(1.75rem,8vw,2.5rem)] font-medium leading-none tracking-[-0.035em]">
                      {item.label}
                    </span>
                    {active === item.id && (
                      <span className="ml-auto size-1.5 self-center rounded-full bg-signal" />
                    )}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-10 flex items-center justify-between gap-4"
            >
              <span className="type-meta text-ink-40">{profile.location}</span>
              <span className="type-label text-ink-40">
                {profile.available ? "Available for work" : "Currently booked"}
              </span>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
