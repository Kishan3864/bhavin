"use client";

import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { links, metrics } from "@/content/profile";

/**
 * Impact band.
 *
 * Every figure here is Bhavin's own published number, and the Play Store link
 * beneath lets a visitor verify all four in one click.
 */
export function Metrics() {
  return (
    <section aria-label="Impact at scale" className="relative pb-4 sm:pb-8">
      <div className="shell">
        <Stagger
          as="ul"
          amount={0.2}
          className="grid grid-cols-2 overflow-hidden rounded-2xl border-l border-t border-hairline bg-paper-raised lg:grid-cols-4"
        >
          {metrics.map((metric) => (
            <StaggerItem
              as="li"
              key={metric.label}
              className="group relative border-b border-r border-hairline bg-paper-raised p-5 transition-colors duration-500 hover:bg-paper-sunken/40 sm:p-7"
            >
              {/* Corner accent that draws in on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 size-7 origin-bottom-right scale-0 border-b border-r border-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"
              />

              <span className="flex size-10 items-center justify-center rounded-xl bg-ink/[0.045] text-ink-80 ring-1 ring-inset ring-ink/[0.07] transition-colors duration-500 group-hover:bg-signal/[0.09] group-hover:text-signal group-hover:ring-signal/20">
                <Icon name={metric.icon} className="size-[1.1rem]" />
              </span>

              <p className="mt-6 text-[clamp(2.25rem,4.4vw,3.5rem)] font-medium leading-none tracking-[-0.045em] tabular-nums">
                {metric.value}
              </p>
              <p className="type-label mt-3 text-ink-60">{metric.label}</p>
              <p className="type-meta mt-2 text-[0.6875rem] text-ink-40">{metric.note}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <p className="type-meta mt-4 text-ink-40">
          Figures from the Smart Codies developer account —{" "}
          <a
            href={links.playStore}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="OPEN"
            className="link-underline text-ink-60 transition-colors hover:text-ink"
          >
            verify on Google Play
          </a>
          .
        </p>
      </div>
    </section>
  );
}
