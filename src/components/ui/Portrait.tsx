"use client";

import Image from "next/image";
import { useState } from "react";
import { profile } from "@/content/profile";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/utils";

/**
 * Owner portrait.
 *
 * Tries each candidate filename in turn, so the photo can be dropped in as
 * .jpg, .png or .webp without touching any code. If every candidate fails the
 * monogram renders instead — a missing file degrades to a designed state, never
 * a broken-image icon.
 */
export function Portrait({ className }: { className?: string }) {
  const [attempt, setAttempt] = useState(0);
  const sources = profile.portrait;
  const src = sources[attempt];

  return (
    /* No width here on purpose — the caller owns it. A `w-full` baked in would
       collide with a narrower class passed through `className`, and which one
       wins depends on stylesheet order rather than intent. */
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden rounded-sm border border-hairline bg-paper-sunken",
        className,
      )}
    >
      {src ? (
        <Image
          key={src}
          src={asset(src)}
          alt={`${profile.name} — ${profile.role}`}
          fill
          /* Widths the portrait actually occupies: a small thumbnail beside the
             caption below `lg`, a full grid column above it. */
          sizes="(max-width: 640px) 7rem, (max-width: 1024px) 9rem, 22vw"
          className="object-cover"
          style={{ objectPosition: profile.portraitPosition }}
          onError={() => setAttempt((i) => i + 1)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[linear-gradient(160deg,#ffffff_0%,#f4f3ef_50%,#e8e7e0_100%)] p-3 text-center">
          <span className="text-[clamp(1.75rem,7cqw,4rem)] font-medium leading-none tracking-[-0.05em] text-ink/25">
            {profile.initials}
          </span>
        </div>
      )}

      {/* Registration marks — same instrument language as the hero visual */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 border border-white/20 mix-blend-overlay sm:inset-3"
      />
    </div>
  );
}
