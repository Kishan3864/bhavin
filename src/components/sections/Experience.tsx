"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { clientWork, education, experience } from "@/content/profile";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

export function Experience() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 72%", "end 68%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="section-pad relative" aria-labelledby="experience-heading">
      <div className="shell">
        <SectionHeader index="05" eyebrow="Career" icon="briefcase" />

        <div className="mt-10 grid grid-cols-1 gap-x-12 lg:mt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <h2 id="experience-heading" className="type-headline max-w-[11ch] text-balance">
                A working <span className="type-editorial text-ink-60">record</span>
              </h2>
              <Reveal delay={0.1}>
                <p className="type-body mt-6 max-w-[38ch] text-ink-60">
                  Two tracks running in parallel — professional Android work, and the apps
                  published under my own developer account.
                </p>
              </Reveal>

              {/* Education */}
              <Reveal delay={0.15}>
                <div className="panel mt-8 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink/[0.045] text-ink-80 ring-1 ring-inset ring-ink/[0.07]">
                      <Icon name="education" className="size-[1.05rem]" />
                    </span>
                    <div className="min-w-0">
                      <p className="type-label text-ink-40">Education</p>
                      <p className="mt-2 text-[0.9375rem] font-medium tracking-[-0.015em]">
                        {education.institution}
                      </p>
                      <p className="type-meta mt-1.5 text-ink-40">{education.location}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          <div ref={trackRef} className="relative mt-12 lg:col-span-8 lg:mt-0">
            {/* Track: static hairline with a progress rule drawn over it */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-2 hidden h-full w-px bg-hairline sm:block"
            >
              <motion.div
                style={{ scaleY: reduce ? 1 : scaleY }}
                className="h-full w-px origin-top bg-ink"
              />
            </div>

            <ol className="flex flex-col gap-14 sm:gap-16">
              {experience.map((role) => (
                <li key={role.company} className="relative sm:pl-10">
                  <Reveal amount={0.25} delay={0.05}>
                    {/* Node */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-2 hidden size-[9px] -translate-x-[4px] rounded-full border-2 border-paper bg-ink sm:block"
                    />

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="type-label inline-flex items-center gap-2 rounded-sm border border-signal/25 bg-signal/[0.06] px-3 py-1.5 text-signal">
                        <Icon name="calendar" className="size-3" />
                        {role.period}
                      </span>
                      <span aria-hidden="true" className="hidden h-px flex-1 bg-hairline sm:block" />
                      <span className="type-meta text-ink-40">{role.location}</span>
                    </div>

                    <div className="mt-5 flex items-start gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink/[0.045] text-ink-80 ring-1 ring-inset ring-ink/[0.07]">
                        <Icon name={role.icon} className="size-[1.15rem]" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="type-title text-[clamp(1.375rem,2.4vw,2rem)]">{role.role}</h3>
                        <p className="mt-1.5 text-[0.9375rem] font-medium tracking-[-0.01em] text-ink-60">
                          {role.company}
                        </p>
                      </div>
                    </div>

                    <p className="type-body mt-5 max-w-[58ch] text-ink-60">{role.description}</p>

                    <ul className="mt-5 flex flex-col gap-2.5">
                      {role.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] size-1 shrink-0 rounded-full bg-signal/60"
                          />
                          <span className="type-body max-w-[54ch] text-ink-80">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {role.stack.map((tech) => (
                        <li
                          key={tech}
                          className="type-label rounded-sm border border-hairline px-3 py-1.5 text-ink-40"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              ))}
            </ol>

            {/* Applications built in professional roles */}
            <Reveal amount={0.2} className="sm:pl-10">
              <div className="mt-14 border-t border-hairline pt-6">
                <p className="type-label flex items-center gap-2.5 text-ink-40">
                  <Icon name="code" className="size-3.5" />
                  {clientWork.label}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {clientWork.items.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-2 rounded-sm border border-hairline bg-paper-raised/70 px-3.5 py-2 transition-colors duration-500 hover:border-ink/25"
                    >
                      <Icon name="smartphone" className="size-3.5 text-ink-40" />
                      <span className="text-[0.8125rem] tracking-[-0.01em] text-ink-80">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
