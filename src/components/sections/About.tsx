"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitText";
import { Icon } from "@/components/ui/Icon";
import { Portrait } from "@/components/ui/Portrait";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { about, education, links, profile } from "@/content/profile";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

export function About() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const markY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <section id="about" className="section-pad relative" aria-labelledby="about-heading">
      <div className="shell">
        <SectionHeader
          index="01"
          eyebrow={about.eyebrow}
          icon="android"
          aside={
            <span className="type-meta text-ink-40">
              {profile.name} — {profile.role}
            </span>
          }
        />

        <h2 id="about-heading" className="sr-only">
          About {profile.name}
        </h2>

        {/* Editorial statement */}
        <div ref={ref} className="relative mt-10 sm:mt-14">
          <SplitWords
            as="p"
            text={about.statement}
            className="type-headline max-w-[22ch] text-balance md:max-w-[26ch]"
            stagger={0.028}
            amount={0.25}
          />

          <motion.span
            aria-hidden="true"
            style={{ y: reduce ? 0 : markY }}
            className="type-editorial pointer-events-none absolute -right-2 -top-6 select-none text-[clamp(7rem,18vw,17rem)] leading-none text-ink/[0.045] lg:-top-16"
          >
            *
          </motion.span>
        </div>

        {/* Body + rail */}
        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 lg:mt-20 lg:grid-cols-12">
          {/* Portrait.
              Two compositions, not one scaled: an identity row (thumbnail +
              details side by side) below `lg`, and a full-column portrait with
              the caption underneath above it. */}
          <div className="lg:col-span-3">
            <Reveal>
              <figure className="flex items-center gap-4 sm:gap-5 lg:block">
                <Portrait className="w-24 shrink-0 sm:w-32 lg:w-full" />

                <figcaption className="min-w-0 flex-1 lg:mt-4 lg:border-t lg:border-hairline lg:pt-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 lg:justify-between">
                    <span className="text-[0.9375rem] font-medium tracking-[-0.015em] sm:text-[1rem] lg:text-[0.875rem]">
                      {profile.name}
                    </span>
                    <span className="type-meta text-ink-40">{profile.timezoneLabel}</span>
                  </div>
                  <p className="type-meta mt-1.5 text-ink-40">{profile.role}</p>
                  <p className="type-meta mt-1 text-ink-40">{profile.location}</p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-5">
            <Stagger className="flex flex-col gap-6">
              {about.paragraphs.map((paragraph) => (
                <StaggerItem key={paragraph.slice(0, 24)}>
                  <p className="type-body max-w-[62ch] text-ink-60">{paragraph}</p>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <dl className="mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border-l border-t border-hairline bg-paper-raised sm:grid-cols-4 lg:grid-cols-2">
                {about.facts.map((fact) => (
                  <div key={fact.label} className="border-b border-r border-hairline px-4 py-4">
                    <dt className="type-label text-ink-40">{fact.label}</dt>
                    <dd className="mt-2 text-[0.875rem] font-medium tracking-[-0.01em]">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Education + profile link */}
            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                <span className="flex items-center gap-2.5 text-ink-60">
                  <Icon name="education" className="size-4 text-ink-40" />
                  <span className="text-[0.8125rem]">
                    {education.institution} ({education.short})
                  </span>
                </span>
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="OPEN"
                  className="group inline-flex min-h-11 items-center gap-2 text-[0.8125rem] text-ink-60 transition-colors hover:text-ink sm:ml-auto"
                >
                  <Icon name="linkedin" className="size-3.5" />
                  <span className="link-underline">Full profile on LinkedIn</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Principles */}
          <div className="lg:col-span-12 xl:col-span-11 xl:col-start-2">
            <Reveal direction="none" blur={false}>
              <p className="type-label mb-6 text-ink-40">How I work</p>
            </Reveal>

            <Stagger className="flex flex-col" amount={0.15}>
              {about.principles.map((principle) => (
                <StaggerItem key={principle.index}>
                  <article className="group relative border-t border-hairline py-6 transition-colors duration-500 last:border-b sm:py-7">
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                    />
                    <div className="flex gap-5 sm:gap-6">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink/[0.045] text-ink-80 ring-1 ring-inset ring-ink/[0.07] transition-colors duration-500 group-hover:bg-signal/[0.09] group-hover:text-signal group-hover:ring-signal/20">
                        <Icon name={principle.icon} className="size-[1.05rem]" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-3">
                          <span className="type-label text-signal tabular-nums">
                            {principle.index}
                          </span>
                          <h3 className="type-title text-[clamp(1.125rem,1.9vw,1.5rem)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0">
                            {principle.title}
                          </h3>
                        </div>
                        <p className="type-body mt-2.5 max-w-[52ch] text-ink-60">
                          {principle.body}
                        </p>
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
