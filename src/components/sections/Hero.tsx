"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitLines } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { apps, links, platforms, profile, stackGroups } from "@/content/profile";
import { useHasPointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduce = usePrefersReducedMotion();
  const hasPointer = useHasPointer();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  // Pointer parallax — normalised to [-0.5, 0.5], smoothed, GPU-composited.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const px = useSpring(pointerX, { stiffness: 90, damping: 22, mass: 0.6 });
  const py = useSpring(pointerY, { stiffness: 90, damping: 22, mass: 0.6 });

  const visualShiftX = useTransform(px, [-0.5, 0.5], [20, -20]);
  const visualShiftY = useTransform(py, [-0.5, 0.5], [14, -14]);
  const chipShiftX = useTransform(px, [-0.5, 0.5], [-32, 32]);
  const chipShiftY = useTransform(py, [-0.5, 0.5], [-20, 20]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!hasPointer || reduce) return;
      const rect = event.currentTarget.getBoundingClientRect();
      pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
      pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [hasPointer, reduce, pointerX, pointerY],
  );

  return (
    <section
      id="index"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden pb-6 pt-28 sm:pt-32 lg:pb-8"
      aria-label="Introduction"
    >
      {/* ---------------------------------------------------------- backdrop */}
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10" />
      <motion.div
        aria-hidden="true"
        style={{ y: reduce ? 0 : gridY }}
        className="pointer-events-none absolute inset-x-0 -top-[10%] -z-10 h-[130%] tech-grid opacity-70 [--grid-size:clamp(48px,6vw,96px)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_35%,transparent_0%,var(--color-paper)_78%)]" />
      </motion.div>

      {/* ------------------------------------------------------------ header */}
      <motion.div style={{ opacity: copyOpacity }} className="shell">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-hairline pb-4"
        >
          <span className="type-label flex items-center gap-2 text-ink-40">
            <Icon name="android" className="size-3.5 text-signal" />
            {profile.discipline}
          </span>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-hairline sm:block" />
          <span className="type-meta text-ink-40">{profile.location}</span>
          <LocalClock />
        </motion.div>
      </motion.div>

      {/* ------------------------------------------------------------- stage */}
      <div className="shell relative grid flex-1 grid-cols-1 items-center gap-y-10 py-10 lg:grid-cols-12 lg:gap-x-10 lg:py-6">
        {/* Copy */}
        <motion.div
          style={{ y: reduce ? 0 : copyY, opacity: copyOpacity }}
          className="relative z-10 lg:col-span-7"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-sm border border-hairline bg-paper-raised/70 py-1.5 pl-2 pr-3.5 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-emerald-500/60 animate-pulse-ring" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="type-label text-ink-60">{profile.availabilityNote}</span>
            </span>
            <span className="type-label inline-flex items-center gap-2 rounded-sm border border-hairline bg-paper-raised/70 px-3.5 py-2 text-ink-60 backdrop-blur-sm">
              <Icon name="store" className="size-3.5 text-signal" />
              {apps.length} apps live on Google Play
            </span>
          </motion.div>

          <h1 className="type-display">
            <SplitLines lines={profile.headline} animateOnMount delay={0.25} />
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
            className="type-lead mt-8 max-w-[54ch] text-ink-60 sm:mt-10"
          >
            {profile.statement}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11 sm:gap-4"
          >
            <Magnetic strength={0.2}>
              <ButtonLink href="#apps" size="lg" arrow data-cursor="VIEW APPS">
                See the apps
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.2}>
              <ButtonLink href="#contact" size="lg" variant="outline" data-cursor="LET'S TALK">
                Start a conversation
              </ButtonLink>
            </Magnetic>
            <a
              href={links.playStore}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="OPEN"
              className="group inline-flex min-h-11 items-center gap-2 px-1 text-[0.875rem] text-ink-60 transition-colors hover:text-ink"
            >
              <Icon name="store" className="size-4" />
              <span className="link-underline">Play Store</span>
            </a>
          </motion.div>

          {/* Platform reach */}
          <motion.ul
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
            className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-hairline pt-5 sm:mt-12"
          >
            {platforms.map((platform) => (
              <li key={platform.name} className="flex items-center gap-2.5">
                <Icon name={platform.icon} className="size-4 text-ink-40" />
                <span className="text-[0.8125rem] font-medium tracking-[-0.01em]">
                  {platform.name}
                </span>
                <span className="type-meta text-[0.6875rem] text-ink-40">{platform.level}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Visual */}
        <motion.div
          style={{ y: reduce ? 0 : visualY }}
          /* Capped below `lg`: a full-width square would be ~700px tall on a
             tablet and push the whole hero off the screen. */
          className="relative -mx-2 aspect-square w-full max-w-[26rem] self-center justify-self-center sm:mx-0 lg:col-span-5 lg:max-w-none"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
            style={{ x: reduce ? 0 : visualShiftX, y: reduce ? 0 : visualShiftY }}
            className="absolute inset-0"
          >
            <HeroVisual className="h-full w-full" />
          </motion.div>

          {/* Floating glass readouts.
              Parallax and entrance live on separate elements on purpose: a
              motion value in `style.y` and a keyframe in `animate.y` fight for
              the same transform channel. */}
          <Chip
            className="left-0 top-[12%]"
            delay={1.2}
            reduce={reduce}
            x={chipShiftX}
            y={chipShiftY}
            driftSeconds={11}
            icon="kotlin"
            label="Built with"
            value="Kotlin · Compose"
          />

          <Chip
            className="bottom-[14%] right-0"
            delay={1.35}
            reduce={reduce}
            x={chipShiftY}
            y={chipShiftX}
            driftSeconds={13}
            icon="download"
            label="Downloads"
            value="3K+ worldwide"
          />
        </motion.div>
      </div>

      {/* -------------------------------------------------------------- rail */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.45 }}
        className="shell"
      >
        <div className="flex flex-col gap-4 border-t border-hairline pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <a
            href="#about"
            data-cursor="SCROLL"
            className="group flex shrink-0 items-center gap-3 text-ink-60 transition-colors hover:text-ink"
            aria-label="Scroll to the about section"
          >
            <span className="flex size-8 items-center justify-center rounded-sm border border-hairline-strong transition-colors group-hover:border-ink/40">
              <ArrowDown className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5" />
            </span>
            <span className="type-label">Scroll</span>
          </a>

          <StackMarquee />
        </div>
      </motion.div>
    </section>
  );
}

/* --------------------------------------------------------------- sub-parts */

/** Glass readout floating beside the device. */
function Chip({
  className,
  delay,
  reduce,
  x,
  y,
  driftSeconds,
  icon,
  label,
  value,
}: {
  className: string;
  delay: number;
  reduce: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  driftSeconds: number;
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      aria-hidden="true"
      style={reduce ? undefined : { x, y }}
      className={`absolute hidden sm:block ${className}`}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        <div
          className="glass flex animate-drift items-center gap-3 rounded-2xl px-4 py-3"
          style={{ ["--drift-duration" as string]: `${driftSeconds}s` }}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink/[0.05] text-ink-80">
            <Icon name={icon} className="size-4" />
          </span>
          <span className="block">
            <span className="type-label block text-ink-40">{label}</span>
            <span className="mt-1 block text-[0.8125rem] font-medium tracking-[-0.01em]">
              {value}
            </span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Live local time.
 *
 * The wall clock is an external source, so it is read through
 * `useSyncExternalStore`: the server snapshot is `null` (rendering a dash),
 * and React swaps in the real value after hydration — no mismatch, and no
 * setState firing inside an effect.
 */
const CLOCK_TICK = 30_000;

function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, CLOCK_TICK);
  return () => window.clearInterval(id);
}

/** Bucketed so the snapshot is referentially stable between ticks. */
function clockSnapshot() {
  return Math.floor(Date.now() / CLOCK_TICK);
}

function serverClockSnapshot(): number | null {
  return null;
}

function LocalClock() {
  const tick = useSyncExternalStore(subscribeClock, clockSnapshot, serverClockSnapshot);

  const time =
    tick === null
      ? null
      : new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: profile.timezone,
        }).format(new Date());

  return (
    <span className="type-meta tabular-nums text-ink-40">
      {time ? `${time} ${profile.timezoneLabel}` : `—:— ${profile.timezoneLabel}`}
    </span>
  );
}

/** Infinite technology ticker. Two identical halves, translated by -50%. */
function StackMarquee() {
  const reduce = usePrefersReducedMotion();
  const items = stackGroups
    .flatMap((group) => group.items)
    .filter((item) => item.level === "core")
    .map((item) => item.name);
  const sequence = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="mask-fade-r relative w-full overflow-hidden sm:max-w-[min(52vw,44rem)]"
    >
      <div
        className={
          reduce ? "flex gap-8" : "animate-marquee flex w-max gap-8 [--marquee-duration:58s]"
        }
      >
        {sequence.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="type-label flex shrink-0 items-center gap-8 whitespace-nowrap text-ink-40"
          >
            {name}
            <span className="size-1 rounded-full bg-ink-20" />
          </span>
        ))}
      </div>
    </div>
  );
}
