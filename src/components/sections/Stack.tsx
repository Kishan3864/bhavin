"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { stackGroups, type StackGroup } from "@/content/profile";
import { cn } from "@/lib/utils";

type Filter = "All" | (typeof stackGroups)[number]["id"];

const LEVEL_LABEL: Record<string, string> = {
  core: "Daily",
  strong: "Fluent",
  working: "Working",
};

const total = stackGroups.reduce((sum, group) => sum + group.items.length, 0);

/**
 * Technology matrix, grouped the way the work is actually organised.
 *
 * Filtering dims rather than removes — the full breadth stays visible, nothing
 * reflows, and there is no layout animation to drop frames.
 */
export function Stack() {
  const [filter, setFilter] = useState<Filter>("All");

  return (
    <section id="stack" className="section-pad relative" aria-labelledby="stack-heading">
      <div className="shell">
        <SectionHeader
          index="03"
          eyebrow="Technology stack"
          icon="cpu"
          aside={<span className="type-meta text-ink-40">{total} technologies</span>}
        />

        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 lg:mt-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="stack-heading" className="type-headline max-w-[13ch] text-balance">
              Deep technical <span className="type-editorial text-ink-60">versatility</span>
            </h2>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <p className="type-body max-w-[46ch] text-ink-60">
                A stack built around native Android and everything a shipped app touches — the UI
                layer, the data layer, the cloud behind it and the pipeline that gets it to the
                Play Store.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div
                role="group"
                aria-label="Filter technologies by group"
                className="mt-7 flex flex-wrap gap-2"
              >
                <FilterChip label="All" active={filter === "All"} onClick={() => setFilter("All")} />
                {stackGroups.map((group) => (
                  <FilterChip
                    key={group.id}
                    label={group.title}
                    icon={group.icon}
                    active={filter === group.id}
                    onClick={() => setFilter(group.id)}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Groups */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 xl:grid-cols-4">
          {stackGroups.map((group, index) => (
            <StackCard
              key={group.id}
              group={group}
              index={index}
              dimmed={filter !== "All" && filter !== group.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- parts */

function FilterChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "type-label inline-flex min-h-11 items-center gap-2 rounded-sm border px-4 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
        active
          ? "border-ink bg-ink text-paper-raised"
          : "border-hairline-strong text-ink-60 hover:border-ink/40 hover:text-ink",
      )}
    >
      {icon ? <Icon name={icon} className="size-3.5" /> : null}
      {label}
    </button>
  );
}

function StackCard({
  group,
  index,
  dimmed,
}: {
  group: StackGroup;
  index: number;
  dimmed: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Reveal
      delay={index * 0.06}
      className={cn(
        "h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        dimmed ? "opacity-30 saturate-0" : "opacity-100",
      )}
    >
      <article className="panel group/card relative flex h-full flex-col overflow-hidden rounded-2xl p-5 sm:p-6">
        {/* Accent wash */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_15%_0%,rgba(44,63,232,0.08)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        />

        <div className="relative flex items-start justify-between gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-ink/[0.045] text-ink-80 ring-1 ring-inset ring-ink/[0.07] transition-colors duration-500 group-hover/card:bg-signal/[0.09] group-hover/card:text-signal group-hover/card:ring-signal/20">
            <Icon name={group.icon} className="size-[1.15rem]" />
          </span>
          <span className="type-label tabular-nums text-ink-20 transition-colors duration-500 group-hover/card:text-ink-40">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="relative mt-5 text-[1.0625rem] font-medium tracking-[-0.02em]">
          {group.title}
        </h3>
        <p className="type-meta relative mt-1.5 text-[0.6875rem] text-ink-40">{group.caption}</p>

        <ul className="relative mt-5 flex flex-1 flex-wrap content-start gap-1.5">
          {group.items.map((item) => (
            <li key={item.name}>
              <span
                onPointerEnter={() => setHovered(item.name)}
                onPointerLeave={() => setHovered((cur) => (cur === item.name ? null : cur))}
                className={cn(
                  "type-label inline-flex cursor-default items-center gap-1.5 rounded-sm border px-2.5 py-1.5 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  item.level === "core"
                    ? "border-hairline-strong bg-paper-raised text-ink-80"
                    : "border-hairline bg-paper-raised/60 text-ink-60",
                )}
              >
                {item.level === "core" && (
                  <span aria-hidden="true" className="size-1 rounded-full bg-signal" />
                )}
                {item.name}
              </span>
            </li>
          ))}
        </ul>

        {/* Readout strip — fixed height so cards never resize on hover */}
        <div className="relative mt-5 flex h-8 items-center border-t border-hairline pt-3">
          <AnimatePresence mode="wait">
            <motion.span
              key={hovered ?? "idle"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="type-meta text-[0.6875rem] text-ink-40"
            >
              {hovered
                ? `${hovered} — ${LEVEL_LABEL[group.items.find((i) => i.name === hovered)?.level ?? "core"]}`
                : `${group.items.length} technologies`}
            </motion.span>
          </AnimatePresence>
        </div>
      </article>
    </Reveal>
  );
}
