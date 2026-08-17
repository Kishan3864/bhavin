"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
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
 * ACTIVE STATE — "set marks".
 *
 * The current label is set between two 1px accent rules, one at each end of the
 * word, like a measure being taken. Nothing is filled, so there is no shape and
 * no corner: it cannot regress into the rounded pill this replaced.
 *
 * A *vertical* rule is the whole point. In a horizontal row of type a
 * horizontal underline runs parallel to the dominant axis and merges into it —
 * which is why underlines read as generic — and it would also collide with the
 * 1px accent scroll-progress rule pinned to the top of the viewport. Verticals
 * are orthogonal to the row, so they carry far more salience per pixel of ink.
 *
 * 16px tall inside a 36px box centres the rule on the type's optical middle
 * without depending on the font's metrics: `items-center` centres the line box,
 * so a mark centred on the box is centred on the word whatever Geist's
 * ascent/descent turn out to be.
 */
const MARK = "pointer-events-none absolute top-2.5 h-4 w-px";

/**
 * Both marks are the same fixed 1×16 box on every item, so shared layout
 * resolves each move to a pure translateX — scale stays exactly 1 on both axes
 * and a hairline can never smear mid-flight. One stretching element carrying
 * end ticks would scale its own 1px verticals and back.
 *
 * The mark travelling *toward* the destination gets the stiffer spring, so the
 * pair always opens wider than either word before closing on the new one.
 * Pinning "lead" to a fixed side would invert the gesture on the return trip —
 * the pair would pinch shut instead of opening. Both are overdamped, because a
 * saturated accent that wobbles reads as a bug.
 */
const MARK_LEAD = { type: "spring", stiffness: 520, damping: 40, mass: 0.5 } as const;
const MARK_TRAIL = { type: "spring", stiffness: 260, damping: 30, mass: 0.6 } as const;

export function Navigation() {
  const { scrollY, scrollYProgress } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  const ids = useMemo(() => navigation.map((item) => item.id), []);
  const active = useActiveSection(ids);
  const reduceMotion = usePrefersReducedMotion();

  /* The desktop bar has no item for `index`, so rather than unmounting the
     marks over the hero — which would hard-cut them in and out every time the
     reader crosses that boundary — they park on the first item and fade. They
     are only ever seen travelling. Deliberately local to the desktop bar:
     `active` is also handed to <MobileMenu>, where the Index row must still
     highlight. */
  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === active);
  const markIndex = activeIndex < 0 ? 0 : activeIndex;
  const marksVisible = activeIndex >= 0;

  /* Travel direction decides which mark leads. It has to be known during the
     render that starts the layout animation, so it is derived state adjusted
     in render — React's documented pattern — rather than a ref read during
     render (stale, and a lint error) or an effect (one frame too late, so the
     first move would use the previous direction's springs). */
  const [travel, setTravel] = useState({ index: markIndex, forward: true });
  if (travel.index !== markIndex) {
    setTravel({ index: markIndex, forward: markIndex >= travel.index });
  }
  const forward = travel.forward;

  /* framer-motion does not honour prefers-reduced-motion for layout projection,
     so the collapse to zero duration has to be explicit. */
  const markTransition = (leads: boolean) => ({
    layout: reduceMotion ? { duration: 0 } : leads ? MARK_LEAD : MARK_TRAIL,
    opacity: { duration: reduceMotion ? 0 : 0.28, ease: EASE },
  });

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

            {/* Desktop links — the active label is set between two accent
                rules. No fill, so no shape, so no corner to round. */}
            <nav aria-label="Section navigation" className="hidden lg:block">
              <ul className="flex items-center gap-0.5">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = active === item.id;
                  const carriesMarks = i === markIndex;
                  return (
                    <li key={item.id}>
                      {/* `h-9` pins the box at exactly 36px — matching the CTA
                          and the menu button, so the header keeps its height —
                          and lands every mark offset on a whole device pixel.
                          `py-2` left it at 35.5px, at the mercy of the
                          inherited line-height. */}
                      <a
                        href={`#${item.id}`}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "group relative flex h-9 items-center rounded-sm px-3.5 text-[0.8125rem] tracking-[-0.01em] transition-colors duration-300",
                          isActive ? "text-ink" : "text-ink-60 hover:text-ink",
                        )}
                      >
                        {/* Hover draws the OPENING mark only, in neutral ink: a
                            candidate is marked from, never measured. Same slot,
                            same weight — hover previews the mark, active
                            completes it in the accent. Always mounted, so an
                            item going active under the cursor retracts this as
                            the accent arrives rather than dropping it on a
                            frame. Pure scaleY, so hover can never reflow. */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            MARK,
                            "left-2 origin-center scale-y-0 bg-ink-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                            !isActive &&
                              "group-hover:scale-y-100 group-focus-visible:scale-y-100",
                          )}
                        />

                        {carriesMarks && (
                          <>
                            <motion.span
                              aria-hidden="true"
                              layoutId="nav-mark-open"
                              initial={false}
                              animate={{ opacity: marksVisible ? 1 : 0 }}
                              transition={markTransition(!forward)}
                              className={cn(MARK, "left-2 bg-signal")}
                            />
                            <motion.span
                              aria-hidden="true"
                              layoutId="nav-mark-close"
                              initial={false}
                              animate={{ opacity: marksVisible ? 1 : 0 }}
                              transition={markTransition(forward)}
                              className={cn(MARK, "right-2 bg-signal")}
                            />
                          </>
                        )}

                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
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
              {navigation.map((item, i) => (
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
