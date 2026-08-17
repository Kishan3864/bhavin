"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { expertise } from "@/content/profile";
import { useHasPointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Capability rows that open on hover (pointer devices) or tap (touch).
 *
 * One row is open at a time, so the section never becomes a wall of text and
 * the layout shift is bounded and predictable.
 */
export function Expertise() {
  const hasPointer = useHasPointer();
  const reduce = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section id="expertise" className="section-pad relative" aria-labelledby="expertise-heading">
      <div className="shell">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader index="02" eyebrow="Expertise" icon="layers" />
            <h2 id="expertise-heading" className="type-headline mt-8 max-w-[14ch] text-balance">
              <span className="block">What I</span>
              <span className="type-editorial block text-ink-60">actually build</span>
            </h2>
            <Reveal delay={0.15}>
              <p className="type-body mt-7 max-w-[44ch] text-ink-60">
                Six disciplines that overlap on every app. Nothing gets handed off — the same
                person owns the architecture, the screens and the store release.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 lg:col-span-7 lg:mt-0">
            <ul className="border-t border-hairline">
              {expertise.map((item, index) => {
                const isOpen = active === index;
                return (
                  <li key={item.index} className="border-b border-hairline">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`expertise-panel-${item.index}`}
                      onPointerEnter={() => hasPointer && setActive(index)}
                      onFocus={() => setActive(index)}
                      onClick={() => setActive(isOpen && !hasPointer ? -1 : index)}
                      className="group relative flex w-full items-start gap-4 py-6 text-left sm:gap-6 sm:py-7"
                    >
                      {/* Hover wash — inset, never touches the hairlines */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute inset-x-[-1rem] inset-y-0 -z-10 rounded-xl bg-ink/[0.028] transition-opacity duration-500",
                          isOpen ? "opacity-100" : "opacity-0",
                        )}
                      />

                      <span
                        className={cn(
                          "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-all duration-500",
                          isOpen
                            ? "bg-signal/[0.09] text-signal ring-signal/20"
                            : "bg-ink/[0.045] text-ink-60 ring-ink/[0.07]",
                        )}
                      >
                        <Icon name={item.icon} className="size-[1.05rem]" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-3">
                          <span
                            className={cn(
                              "type-label tabular-nums transition-colors duration-500",
                              isOpen ? "text-signal" : "text-ink-40",
                            )}
                          >
                            {item.index}
                          </span>
                          <span
                            className={cn(
                              "type-title block text-[clamp(1.1875rem,2.2vw,1.75rem)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                              isOpen && !reduce ? "translate-x-1" : "translate-x-0",
                            )}
                          >
                            {item.title}
                          </span>
                        </span>
                        <span className="type-body mt-2 block max-w-[46ch] text-ink-60">
                          {item.summary}
                        </span>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.span
                              id={`expertise-panel-${item.index}`}
                              key="panel"
                              initial={reduce ? false : { height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={reduce ? undefined : { height: 0, opacity: 0 }}
                              transition={{ duration: 0.55, ease: EASE }}
                              className="block overflow-hidden"
                            >
                              <span className="block pt-5">
                                <span className="type-body block max-w-[54ch] border-l border-signal/30 pl-5 text-ink-80">
                                  {item.detail}
                                </span>
                                <span className="mt-5 flex flex-wrap gap-2">
                                  {item.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="type-label rounded-sm border border-hairline bg-paper-raised/80 px-3 py-1.5 text-ink-60"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </span>
                              </span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>

                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-2 flex size-7 shrink-0 items-center justify-center rounded-sm border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          isOpen
                            ? "rotate-45 border-ink bg-ink text-paper-raised"
                            : "border-hairline-strong text-ink-40",
                        )}
                      >
                        <Plus className="size-3.5" />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
