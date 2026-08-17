"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { ArrowUp } from "lucide-react";
import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Icon } from "@/components/ui/Icon";
import { footer, links, navigation, profile } from "@/content/profile";

/**
 * Closing frame: the name at display scale, clipped by the viewport edge, with
 * the practical links folded underneath. Deliberately not a sitemap.
 */
export function Footer() {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], ["22%", "0%"]);

  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="relative isolate overflow-hidden border-t border-hairline">
      <div className="shell pt-16 sm:pt-20">
        {/* Utility row */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-[34ch]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-emerald-500/60 animate-pulse-ring" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="type-label text-ink-60">
                {profile.available ? "Available for new work" : "Currently booked"}
              </span>
            </div>
            <p className="type-body mt-5 text-ink-60">{footer.note}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:gap-x-16">
            <div>
              <p className="type-label mb-4 text-ink-40">Index</p>
              <ul className="flex flex-col">
                {navigation.slice(1, 5).map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="link-underline inline-flex min-h-11 items-center text-[0.875rem] text-ink-60 transition-colors hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="type-label mb-4 text-ink-40">More</p>
              <ul className="flex flex-col">
                {navigation.slice(5).map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="link-underline inline-flex min-h-11 items-center text-[0.875rem] text-ink-60 transition-colors hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="type-label mb-4 text-ink-40">Elsewhere</p>
              <ul className="flex flex-col">
                {[
                  { label: "Google Play", href: links.playStore, icon: "store", external: true },
                  { label: "LinkedIn", href: links.linkedin, icon: "linkedin", external: true },
                  { label: "GitHub", href: links.github, icon: "github", external: true },
                  {
                    label: "Email",
                    href: `mailto:${links.email}`,
                    icon: "mail",
                    external: false,
                  },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      data-cursor={item.external ? "OPEN" : "EMAIL"}
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group inline-flex min-h-11 items-center gap-2.5 text-[0.875rem] text-ink-60 transition-colors hover:text-ink"
                    >
                      <Icon name={item.icon} className="size-3.5 text-ink-40 transition-colors group-hover:text-signal" />
                      <span className="link-underline">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-meta text-ink-40">
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="type-meta text-ink-40">{footer.colophon}</p>
          <Magnetic strength={0.25} className="sm:ml-auto">
            <a
              href="#index"
              data-cursor="TOP"
              aria-label="Back to top"
              className="group flex items-center gap-2.5 text-ink-60 transition-colors hover:text-ink"
            >
              <span className="type-label">Back to top</span>
              <span className="flex size-8 items-center justify-center rounded-sm border border-hairline-strong transition-colors group-hover:border-ink/40">
                <ArrowUp className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5" />
              </span>
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Wordmark, clipped by the page edge */}
      {/* Closing wordmark. Opacity is a viewport reveal rather than a
          scroll-linked value — at the very end of the document the scroll
          progress can never complete, which would leave it permanently dim. */}
      <motion.div
        aria-hidden="true"
        style={{ y: reduce ? 0 : nameY }}
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none mt-8 select-none overflow-hidden"
      >
        {/* Sized to fill the viewport width without spilling — `overflow-x:
            clip` on <html> is the belt-and-braces guard. */}
        <span className="block whitespace-nowrap text-center text-[clamp(2.75rem,13.4vw,13.5rem)] font-medium leading-[0.82] tracking-[-0.05em] text-ink/[0.13]">
          {profile.name}
        </span>
      </motion.div>
      <div aria-hidden="true" className="h-4 sm:h-6" />
    </footer>
  );
}
