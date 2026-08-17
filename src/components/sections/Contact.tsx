"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitText";
import { ContactForm } from "@/components/sections/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { contact, platforms, profile } from "@/content/profile";

export function Contact() {
  return (
    <section id="contact" className="section-pad relative isolate" aria-labelledby="contact-heading">
      {/* Light bloom behind the closing CTA */}
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full tech-dots opacity-40 [mask-image:radial-gradient(70%_55%_at_50%_40%,#000,transparent)]"
      />

      <div className="shell">
        <SectionHeader
          index="07"
          eyebrow={contact.eyebrow}
          icon="mail"
          aside={
            <span className="type-meta text-ink-40">
              {profile.available ? "Taking new work" : "Currently booked"}
            </span>
          }
        />

        <h2 id="contact-heading" className="type-display mt-10 max-w-[14ch] sm:mt-14">
          <SplitLines lines={contact.heading} stagger={0.09} />
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-14 lg:mt-20 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="type-lead max-w-[46ch] text-ink-60">{contact.body}</p>
            </Reveal>

            {/* Platform reach */}
            <Reveal delay={0.08}>
              <ul className="mt-7 flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <li
                    key={platform.name}
                    className="inline-flex items-center gap-2 rounded-sm border border-hairline bg-paper-raised/70 px-3.5 py-2 backdrop-blur-sm"
                  >
                    <Icon name={platform.icon} className="size-3.5 text-signal" />
                    <span className="type-label text-ink-60">{platform.name}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-10">
              <ContactForm />
            </div>
          </div>

          {/* Channels */}
          {/* `overflow-x-clip` contains the horizontal entry offset below. */}
          <div className="overflow-x-clip lg:col-span-4 lg:col-start-9">
            <Reveal direction="left">
              <p className="type-label text-ink-40">Direct</p>

              <ul className="mt-6 flex flex-col border-t border-hairline">
                {contact.channels.map((channel) => (
                  <li key={channel.label} className="border-b border-hairline">
                    <a
                      href={channel.href}
                      data-cursor={channel.external ? "OPEN" : "EMAIL"}
                      {...(channel.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex items-center gap-4 py-4 transition-colors duration-300"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink/[0.045] text-ink-80 ring-1 ring-inset ring-ink/[0.07] transition-colors duration-500 group-hover:bg-signal/[0.09] group-hover:text-signal group-hover:ring-signal/20">
                        <Icon name={channel.icon} className="size-[1.05rem]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="type-label block text-ink-40">{channel.label}</span>
                        <span className="mt-1.5 block truncate text-[0.9375rem] tracking-[-0.02em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0">
                          {channel.value}
                        </span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-ink-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal direction="left" delay={0.1}>
              <div className="panel mt-8 rounded-2xl p-5">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full rounded-full bg-emerald-500/60 animate-pulse-ring" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="type-label text-ink-60">{profile.availabilityNote}</span>
                </div>
                <p className="type-body mt-4 text-ink-60">
                  Based in {profile.location}, working with teams across time zones. Happy to start
                  with a short call.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
