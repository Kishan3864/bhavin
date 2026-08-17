"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { process } from "@/content/profile";

/**
 * Sticky card deck.
 *
 * Each step pins a little lower than the one before, so the five stages
 * physically stack as you scroll — the section demonstrates a sequence rather
 * than listing one. Implemented with `position: sticky` alone: no scroll
 * listeners, no per-frame work.
 */
export function Process() {
  return (
    <section id="process" className="section-pad relative" aria-labelledby="process-heading">
      <div className="shell">
        <SectionHeader index="06" eyebrow="Process" icon="rocket" />

        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 lg:mt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <h2 id="process-heading" className="type-headline max-w-[12ch] text-balance">
                How an app <span className="type-editorial text-ink-60">gets shipped</span>
              </h2>
              <Reveal delay={0.1}>
                <p className="type-body mt-6 max-w-[38ch] text-ink-60">
                  Five stages, in order. From scope to store listing — the same route every app takes.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <ol className="mt-8 hidden flex-col gap-2 lg:flex">
                  {process.map((step) => (
                    <li key={step.index} className="flex items-center gap-3">
                      <span className="type-label w-6 text-ink-40 tabular-nums">
                        {step.index}
                      </span>
                      <span className="type-label text-ink-40">{step.title}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ol className="relative flex flex-col gap-5">
              {process.map((step, index) => (
                <li
                  key={step.index}
                  className="sticky"
                  style={{ top: `calc(7rem + ${index * 1.1}rem)`, zIndex: index + 1 }}
                >
                  <Reveal amount={0.2} duration={0.75}>
                    <article className="panel overflow-hidden rounded-[5px] p-6 backdrop-blur-xl sm:p-8">
                      <div className="flex items-start gap-4 sm:gap-6">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink/[0.045] text-ink-80 ring-1 ring-inset ring-ink/[0.07]">
                          <Icon name={step.icon} className="size-[1.15rem]" />
                        </span>
                        <div className="min-w-0">
                          <span className="type-label text-signal tabular-nums">{step.index}</span>
                          <h3 className="type-title mt-2 text-[clamp(1.375rem,2.4vw,2rem)]">
                            {step.title}
                          </h3>
                          <p className="type-body mt-3 max-w-[56ch] text-ink-60">{step.body}</p>
                        </div>
                        <span
                          aria-hidden="true"
                          className="ml-auto hidden font-mono text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-none tracking-tighter text-ink/[0.06] sm:block"
                        >
                          {step.index}
                        </span>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>

            {/* Tail space so the last card can settle before the next section */}
            <div aria-hidden="true" className="h-24 sm:h-32" />
          </div>
        </div>
      </div>
    </section>
  );
}
