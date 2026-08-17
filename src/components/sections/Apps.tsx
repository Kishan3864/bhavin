"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppScreenMock } from "@/components/visuals/AppScreens";
import { apps, links, type PlayApp } from "@/content/profile";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Play Store portfolio — the strongest section on the page.
 *
 * Each featured title gets a device running its *own* interface mock-up, on a
 * stage washed in the colour sampled from that app's real store icon, so no two
 * cards look alike. Every icon is the real store artwork and every link points
 * at the live listing.
 */
export function Apps() {
  const featured = apps.filter((app) => app.featured);
  const rest = apps.filter((app) => !app.featured);

  return (
    <section id="apps" className="section-pad relative" aria-labelledby="apps-heading">
      <div className="shell">
        <SectionHeader
          index="04"
          eyebrow="Live on Google Play"
          icon="store"
          aside={
            <span className="type-meta text-ink-40">
              {String(apps.length).padStart(2, "0")} published
            </span>
          }
        />

        <div className="mt-10 flex flex-col gap-6 lg:mt-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2 id="apps-heading" className="type-headline max-w-[14ch] text-balance">
            Play Store <span className="type-editorial text-ink-60">portfolio</span>
          </h2>
          <div className="max-w-[42ch]">
            <Reveal delay={0.1}>
              <p className="type-body text-ink-60">
                Eight published Android applications, built and maintained under the{" "}
                <span className="font-medium text-ink">Smart Codies</span> developer account —
                every one owned from first commit through to post-launch updates.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <a
                href={links.playStore}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="OPEN"
                className="group mt-5 inline-flex min-h-11 items-center gap-2.5 text-[0.875rem] font-medium text-ink transition-colors hover:text-signal"
              >
                <Icon name="store" className="size-4" />
                <span className="link-underline">View the developer page</span>
                <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ featured */}
      <div className="mt-14 flex flex-col gap-14 sm:mt-20 sm:gap-20">
        {featured.map((app, index) => (
          <FeaturedApp key={app.id} app={app} index={index} />
        ))}
      </div>

      {/* ---------------------------------------------------------- the others */}
      <div className="shell mt-20 sm:mt-28">
        <Reveal direction="none" blur={false}>
          <div className="flex items-center gap-4 border-t border-hairline pt-4">
            <span className="type-label text-ink-40">Also published</span>
            <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
            <span className="type-meta text-ink-40">{rest.length} titles</span>
          </div>
        </Reveal>

        <Stagger
          as="ul"
          amount={0.1}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {rest.map((app) => (
            <StaggerItem as="li" key={app.id} className="h-full">
              <AppCard app={app} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ featured */

function FeaturedApp({ app, index }: { app: PlayApp; index: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = usePrefersReducedMotion();
  const reversed = index % 2 === 1;

  return (
    <article ref={ref} className="group/app relative">
      <div className="shell">
        <div className="grid grid-cols-1 items-stretch gap-y-6 lg:grid-cols-12 lg:gap-x-10">
          {/* ------------------------------------------------------- stage */}
          <div
            className={cn(
              "relative",
              reversed ? "lg:col-span-7 lg:col-start-6 lg:row-start-1" : "lg:col-span-7",
            )}
          >
            <motion.div
              initial={reduce ? undefined : { clipPath: "inset(8% 8% 8% 8% round 6px)" }}
              whileInView={reduce ? undefined : { clipPath: "inset(0% 0% 0% 0% round 6px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease: EASE }}
              className="relative h-full min-h-[23rem] overflow-hidden rounded-sm border border-hairline sm:min-h-[30rem]"
            >
              {/* Tinted ambience, sampled from the app's own icon */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(158deg, ${app.tint}22 0%, ${app.tint}0b 44%, rgba(244,243,239,0.92) 100%)`,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 tech-dots opacity-[0.55] [mask-image:radial-gradient(75%_75%_at_50%_45%,#000,transparent)]"
              />
              <div
                aria-hidden="true"
                className="absolute -left-[15%] -top-[25%] size-[65%] rounded-full blur-[60px]"
                style={{ background: `${app.tint}33` }}
              />

              {/* Oversized index, ghosted into the stage. Always top-left —
                  the category plate owns the top-right corner. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 left-3 select-none font-mono text-[clamp(4.5rem,11vw,9rem)] font-medium leading-none tracking-tighter sm:-top-5 sm:left-6"
                style={{ color: `${app.tint}20` }}
              >
                {app.index}
              </span>

              <DeviceStage app={app} index={index} reduce={reduce} />

              {/* Category plate */}
              <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-2 rounded-sm border border-white/70 bg-paper-raised/80 px-3 py-1.5 backdrop-blur-md sm:right-5 sm:top-5">
                <span className="size-1.5 rounded-full" style={{ background: app.tint }} />
                <span className="type-label text-ink-60">{app.category}</span>
              </div>

              {/* Reflection sweep */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-[220%] skew-x-[-14deg] bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/app:translate-x-[460%] motion-reduce:hidden"
              />
            </motion.div>
          </div>

          {/* -------------------------------------------------------- copy */}
          <div
            className={cn(
              "relative flex flex-col justify-center overflow-x-clip",
              reversed
                ? "lg:col-span-5 lg:col-start-1 lg:row-start-1"
                : "lg:col-span-5 lg:col-start-8",
            )}
          >
            <Reveal direction={reversed ? "right" : "left"} duration={0.9}>
              <div className="flex items-center gap-4">
                <span
                  className="relative size-16 shrink-0 overflow-hidden rounded-[0.35rem] ring-1 ring-ink/[0.08] sm:size-[4.5rem]"
                  style={{ boxShadow: `0 8px 22px -10px ${app.tint}99` }}
                >
                  <Image
                    src={asset(app.icon)}
                    alt={`${app.name} app icon`}
                    width={144}
                    height={144}
                    className="size-full object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <span className="type-label block" style={{ color: app.tint }}>
                    {app.category}
                  </span>
                  <h3 className="type-title mt-2 text-[clamp(1.375rem,2.4vw,2rem)]">{app.name}</h3>
                </div>
              </div>

              <p className="type-body mt-6 max-w-[46ch] text-ink-60">{app.description}</p>

              {/* Stat rail */}
              <dl className="mt-7 grid grid-cols-2 overflow-hidden rounded-sm border-l border-t border-hairline bg-paper-raised">
                <div className="border-b border-r border-hairline px-4 py-3.5">
                  <dt className="type-label text-ink-40">Installs</dt>
                  <dd className="mt-2 flex items-center gap-1.5 text-[0.9375rem] font-medium tracking-[-0.01em]">
                    <Download className="size-3.5" style={{ color: app.tint }} aria-hidden="true" />
                    {app.installs}
                  </dd>
                </div>
                <div className="border-b border-r border-hairline px-4 py-3.5">
                  <dt className="type-label text-ink-40">Platform</dt>
                  <dd className="mt-2 flex items-center gap-1.5 text-[0.9375rem] font-medium tracking-[-0.01em]">
                    <Icon name="android" className="size-3.5 text-ink-40" />
                    Android
                  </dd>
                </div>
              </dl>

              <ul className="mt-6 flex flex-wrap gap-2">
                {app.highlights.map((item) => (
                  <li
                    key={item}
                    className="type-label rounded-sm border px-3 py-1.5 text-ink-60"
                    style={{ borderColor: `${app.tint}38`, background: `${app.tint}0d` }}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              {/* Store CTA */}
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="GET IT"
                  className="group/link relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-sm px-5 text-[0.875rem] font-medium text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985]"
                  style={{ background: app.tint }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -translate-x-[220%] skew-x-[-18deg] bg-white/25 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-[420%] motion-reduce:hidden"
                  />
                  <Icon name="store" className="relative size-4" />
                  <span className="relative">Get it on Google Play</span>
                  <ArrowUpRight className="relative size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
                <p className="type-meta text-ink-40">{app.packageId}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Device render for a featured app.
 *
 * Three compositions, cycled by index — a straight hero device, a rotated pair
 * showing the app beside its own store listing, and a tilted device against an
 * oversized ghost of its icon. Repeating one treatment would read as a list.
 */
function DeviceStage({ app, index, reduce }: { app: PlayApp; index: number; reduce: boolean }) {
  const layout = index % 3;

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6 py-10">
      {/* Oversized ghost icon behind the tilted composition */}
      {layout === 2 && (
        <motion.div
          aria-hidden="true"
          initial={reduce ? undefined : { opacity: 0, scale: 0.86 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute size-[13rem] overflow-hidden rounded-[10px] opacity-[0.14] blur-[1px] sm:size-[17rem]"
        >
          <Image
            src={asset(app.icon)}
            alt=""
            width={512}
            height={512}
            className="size-full object-cover"
          />
        </motion.div>
      )}

      {/* Trailing device of the pair — the store listing view */}
      {layout === 1 && (
        <motion.div
          aria-hidden="true"
          initial={reduce ? undefined : { opacity: 0, x: 34, rotate: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0, rotate: 8 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: 0.28, ease: EASE }}
          className="absolute translate-x-[4.2rem] sm:translate-x-[6rem]"
        >
          <Phone size="sm">
            <StoreListing app={app} />
          </Phone>
        </motion.div>
      )}

      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 24, rotate: layout === 2 ? -9 : -2 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: layout === 2 ? -6 : 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
        className={cn("relative", layout === 1 && "-translate-x-10 sm:-translate-x-14")}
      >
        <Phone size="lg" tint={app.tint}>
          <AppScreenMock screen={app.screen} tint={app.tint} />
        </Phone>

        {/* Install counter tag. Suppressed on the paired layout, where the
            second device already occupies the space to the right. */}
        {layout !== 1 && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.8 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.62, ease: EASE }}
            className="glass absolute left-full top-8 ml-3 hidden items-center gap-2 whitespace-nowrap rounded-sm px-3 py-2 sm:flex lg:ml-4"
          >
            <Download className="size-3.5" style={{ color: app.tint }} aria-hidden="true" />
            <span className="type-label text-ink-80">{app.installs}</span>
          </motion.div>
        )}

        {/* Platform tag */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.8 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.78, ease: EASE }}
          className="glass absolute bottom-12 right-full mr-3 hidden items-center gap-2 whitespace-nowrap rounded-sm px-3 py-2 sm:flex lg:mr-4"
        >
          <Icon name="android" className="size-3.5 text-ink-80" />
          <span className="type-label text-ink-80">Android</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------- primitives */

/** Shared device shell so every phone in the section has identical hardware. */
function Phone({
  children,
  size,
  tint,
}: {
  children: React.ReactNode;
  size: "sm" | "lg";
  tint?: string;
}) {
  const box =
    size === "lg"
      ? "h-[15.5rem] w-[7.6rem] rounded-[0.7rem] p-[4px] sm:h-[19.5rem] sm:w-[9.6rem] sm:rounded-[0.85rem] sm:p-[5px]"
      : "h-[12.5rem] w-[6.1rem] rounded-[0.6rem] p-[3px] sm:h-[16rem] sm:w-[7.9rem] sm:rounded-[0.7rem] sm:p-[4px]";

  return (
    <div
      className={cn(
        "relative bg-[linear-gradient(140deg,#2a2a31_0%,#0c0c0f_48%,#31313a_100%)]",
        box,
      )}
      style={{
        boxShadow: tint
          ? `0 22px 48px -20px ${tint}80, 0 8px 20px -12px rgba(12,12,15,0.5)`
          : "0 14px 32px -16px rgba(12,12,15,0.5)",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[0.5rem] bg-[linear-gradient(180deg,#ffffff_0%,#fafaf8_60%,#f2f1ec_100%)] sm:rounded-[0.6rem]">
        {/* Status bar */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-2 pt-1.5">
          <span className="h-[2px] w-3 rounded-full bg-ink/20" />
          <span className="size-[3px] rounded-full bg-ink/60" />
          <span className="h-[2px] w-3 rounded-full bg-ink/20" />
        </div>
        {children}
        {/* Home indicator */}
        <span className="absolute bottom-1 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-ink/20" />
      </div>
    </div>
  );
}

/** A miniature Play Store listing — the second device of the pair. */
function StoreListing({ app }: { app: PlayApp }) {
  return (
    <div className="flex h-full flex-col px-2.5 pt-5">
      <div className="flex items-center gap-1.5">
        <span className="size-[18px] shrink-0 overflow-hidden rounded-[3px]">
          <Image
            src={asset(app.icon)}
            alt=""
            width={72}
            height={72}
            className="size-full object-cover"
          />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className="block h-[4px] w-[80%] rounded-[1px] bg-ink/25" />
          <span
            className="block h-[3px] w-[50%] rounded-[1px]"
            style={{ background: `${app.tint}88` }}
          />
        </span>
      </div>

      <div
        className="mt-2 flex h-[13px] items-center justify-center rounded-[2px]"
        style={{ background: app.tint }}
      >
        <span className="font-mono text-[4px] uppercase tracking-[0.14em] text-white">Install</span>
      </div>

      {/* Screenshot strip */}
      <div className="mt-2 flex gap-[3px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[34px] flex-1 rounded-[2px]"
            style={{ background: `${app.tint}${["26", "1a", "12"][i]}` }}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-col gap-[4px]">
        <span className="block h-[2.5px] w-full rounded-[1px] bg-ink/10" />
        <span className="block h-[2.5px] w-[86%] rounded-[1px] bg-ink/10" />
        <span className="block h-[2.5px] w-[64%] rounded-[1px] bg-ink/10" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- grid card */

function AppCard({ app }: { app: PlayApp }) {
  return (
    <a
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="GET IT"
      className="group/card relative flex h-full flex-col overflow-hidden rounded-sm border border-hairline bg-paper-raised p-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 motion-reduce:hover:translate-y-0"
    >
      {/* Tinted wash + top accent rule, both keyed to the app's own colour */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background: `radial-gradient(85% 70% at 18% 0%, ${app.tint}1f 0%, transparent 72%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-x-100"
        style={{ background: app.tint }}
      />

      <div className="relative flex items-start gap-4">
        <span
          className="size-14 shrink-0 overflow-hidden rounded-[0.35rem] ring-1 ring-ink/[0.08] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.06] motion-reduce:group-hover/card:scale-100"
          style={{ boxShadow: `0 6px 16px -8px ${app.tint}80` }}
        >
          <Image
            src={asset(app.icon)}
            alt={`${app.name} app icon`}
            width={112}
            height={112}
            loading="lazy"
            className="size-full object-cover"
          />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-[1.0625rem] font-medium leading-tight tracking-[-0.02em]">
            {app.name}
          </h3>
          <span
            className="type-label mt-2 inline-flex rounded-sm px-2 py-1"
            style={{ background: `${app.tint}14`, color: app.tint }}
          >
            {app.category}
          </span>
        </div>

        <ArrowUpRight className="size-4 shrink-0 text-ink-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-ink" />
      </div>

      <p className="type-body relative mt-4 flex-1 text-[0.875rem] text-ink-60">
        {app.description}
      </p>

      <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-hairline pt-4">
        <span className="flex items-center gap-1.5">
          <Download className="size-3.5" style={{ color: app.tint }} aria-hidden="true" />
          <span className="type-label text-ink-80">{app.installs}</span>
        </span>
        <span className="flex items-center gap-1.5 text-ink-40 transition-colors duration-500 group-hover/card:text-ink-60">
          <Icon name="store" className="size-3.5" />
          <span className="type-label">Google Play</span>
        </span>
      </div>
    </a>
  );
}
