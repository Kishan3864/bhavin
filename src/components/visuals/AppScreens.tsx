"use client";

import type { AppScreen } from "@/content/profile";

/**
 * In-device UI mock-ups, one per published app.
 *
 * These are not generic skeleton bars: each screen shows what the app actually
 * does — a blocked-call list, a chat auto-reply, a compression readout — so the
 * showcase communicates the product rather than just its icon. Everything is
 * plain divs and SVG, tinted by the colour sampled from the real store icon.
 */

type Props = { tint: string };

const label = "font-mono uppercase tracking-[0.14em]";

/* ------------------------------------------------------------------ chrome */

function Bar({ w, h = 4, o = 0.1 }: { w: string; h?: number; o?: number }) {
  return (
    <span
      className="block rounded-[1px] bg-ink"
      style={{ width: w, height: h, opacity: o }}
    />
  );
}

function Header({ title, tint }: { title: string; tint: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-ink/[0.07] px-2.5 pb-2">
      <span className="size-2 rounded-[1px]" style={{ background: tint }} />
      <span className={`${label} text-[4.5px] text-ink/55`}>{title}</span>
      <span className="ml-auto flex gap-[2px]">
        <span className="size-[2px] rounded-full bg-ink/25" />
        <span className="size-[2px] rounded-full bg-ink/25" />
        <span className="size-[2px] rounded-full bg-ink/25" />
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------- screens */

/** Call Blocker Plus — an incoming call being screened, plus the block log. */
function BlockList({ tint }: Props) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Blocked" tint={tint} />

      <div
        className="mx-2.5 mt-2.5 rounded-[3px] px-2 py-2"
        style={{ background: `${tint}18`, border: `1px solid ${tint}38` }}
      >
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke={tint} strokeWidth="2.4">
            <path d="M3 3l18 18M9.5 4.5A9 9 0 0 1 19.5 14.5" strokeLinecap="round" />
            <path d="M5 9a16 16 0 0 0 10 10l2-2 3 2v3a1 1 0 0 1-1 1A19 19 0 0 1 2 4a1 1 0 0 1 1-1h3l2 3-2 2" />
          </svg>
          <span className={`${label} text-[4px]`} style={{ color: tint }}>
            Call blocked
          </span>
        </div>
        <div className="mt-1.5 flex flex-col gap-1">
          <Bar w="58%" h={4} o={0.34} />
          <Bar w="38%" h={3} o={0.16} />
        </div>
      </div>

      <div className="mt-2.5 flex flex-1 flex-col gap-[5px] px-2.5">
        {[
          { w: "72%", muted: false },
          { w: "56%", muted: true },
          { w: "64%", muted: false },
          { w: "48%", muted: true },
          { w: "68%", muted: false },
          { w: "52%", muted: true },
          { w: "60%", muted: true },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-[2px] bg-ink/[0.03] px-1.5 py-1.5">
            <span
              className="size-[9px] shrink-0 rounded-[2px]"
              style={{ background: row.muted ? "rgba(12,12,15,0.10)" : `${tint}2e` }}
            />
            <span className="flex flex-1 flex-col gap-[3px]">
              <Bar w={row.w} h={3} o={0.2} />
              <Bar w="30%" h={2} o={0.1} />
            </span>
            <span
              className="h-[7px] w-[7px] shrink-0 rounded-[1px]"
              style={{ background: row.muted ? "rgba(12,12,15,0.08)" : `${tint}55` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Auto Reply Messanger — an inbound message answered automatically. */
function Chat({ tint }: Props) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Auto reply" tint={tint} />

      <div className="flex flex-1 flex-col gap-2 px-2.5 pt-3">
        <div className="w-[74%] rounded-[3px] rounded-tl-[1px] bg-ink/[0.06] px-2 py-1.5">
          <Bar w="90%" h={3} o={0.22} />
          <span className="mt-1 block" />
          <Bar w="60%" h={3} o={0.16} />
        </div>

        <div
          className="ml-auto w-[80%] rounded-[3px] rounded-tr-[1px] px-2 py-1.5"
          style={{ background: tint }}
        >
          <span className="block h-[3px] w-[92%] rounded-[1px] bg-white/70" />
          <span className="mt-1 block h-[3px] w-[70%] rounded-[1px] bg-white/50" />
          <span className={`${label} mt-1.5 block text-[3.5px] text-white/70`}>Auto</span>
        </div>

        <div className="w-[64%] rounded-[3px] rounded-tl-[1px] bg-ink/[0.06] px-2 py-1.5">
          <Bar w="76%" h={3} o={0.2} />
        </div>
      </div>

      {/* Rule toggle */}
      <div className="mx-2.5 mb-2.5 flex items-center gap-1.5 rounded-[3px] border border-ink/[0.08] bg-ink/[0.02] px-2 py-1.5">
        <span className={`${label} text-[4px] text-ink/45`}>While driving</span>
        <span className="ml-auto flex h-[9px] w-[16px] items-center rounded-full px-[2px]" style={{ background: tint }}>
          <span className="ml-auto size-[5px] rounded-full bg-white" />
        </span>
      </div>
    </div>
  );
}

/** Photo Resizer — before / after with the size actually saved. */
function Resize({ tint }: Props) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Compress" tint={tint} />

      <div className="relative mx-2.5 mt-2.5 h-[64px] overflow-hidden rounded-[3px]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#c9d6e8_0%,#e6d9c8_55%,#cfc4dd_100%)]" />
        {/* Split marker */}
        <div className="absolute inset-y-0 left-1/2 w-px" style={{ background: tint }} />
        <div className="absolute left-1/2 top-1/2 flex size-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow">
          <span className="size-1 rounded-full" style={{ background: tint }} />
        </div>
        <span className={`${label} absolute left-1.5 top-1.5 text-[3.5px] text-ink/50`}>4.2 MB</span>
        <span
          className={`${label} absolute right-1.5 top-1.5 rounded-[1px] px-1 py-[1px] text-[3.5px] text-white`}
          style={{ background: tint }}
        >
          380 KB
        </span>
      </div>

      <div className="mt-2.5 flex flex-col gap-1.5 px-2.5">
        {["Resize", "Compress", "Remove bg"].map((row, i) => (
          <div key={row} className="flex items-center gap-1.5">
            <span className={`${label} w-[26px] shrink-0 text-[3.5px] text-ink/40`}>{row}</span>
            <span className="relative h-[3px] flex-1 rounded-full bg-ink/[0.08]">
              <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${[86, 64, 42][i]}%`, background: tint }}
              />
            </span>
          </div>
        ))}
      </div>

      {/* Size presets — fills the panel and shows the passport option */}
      <div className="mt-2.5 px-2.5">
        <span className={`${label} block text-[3.5px] text-ink/40`}>Preset</span>
        <div className="mt-1.5 grid grid-cols-3 gap-[3px]">
          {["Passport", "HD", "Web", "4:5", "1:1", "Custom"].map((preset, i) => (
            <span
              key={preset}
              className="flex h-[11px] items-center justify-center rounded-[2px] text-[3.2px]"
              style={{
                background: i === 0 ? `${tint}22` : "rgba(12,12,15,0.04)",
                color: i === 0 ? tint : "rgba(12,12,15,0.38)",
                border: i === 0 ? `1px solid ${tint}55` : "1px solid transparent",
                fontFamily: "ui-monospace, monospace",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {preset}
            </span>
          ))}
        </div>
      </div>

      <span className="flex-1" />

      <div
        className="mx-2.5 mb-2.5 mt-2 flex h-[14px] items-center justify-center rounded-[2px]"
        style={{ background: tint }}
      >
        <span className={`${label} text-[4px] text-white`}>Save</span>
      </div>
    </div>
  );
}

/** AppInspector — installed packages with detected SDKs and permissions. */
function Inspect({ tint }: Props) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Analyze" tint={tint} />

      <div className="mx-2.5 mt-2.5 flex items-center gap-1.5 rounded-[2px] border border-ink/[0.09] px-1.5 py-1">
        <svg viewBox="0 0 24 24" className="size-2" fill="none" stroke="currentColor" strokeWidth="2.6" style={{ color: `${tint}` }}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" strokeLinecap="round" />
        </svg>
        <Bar w="46%" h={3} o={0.14} />
      </div>

      <div className="mt-2 flex flex-1 flex-col gap-[5px] px-2.5">
        {[3, 5, 2, 4, 3, 4].map((chips, i) => (
          <div key={i} className="rounded-[2px] bg-ink/[0.03] px-1.5 py-1.5">
            <div className="flex items-center gap-1.5">
              <span className="size-[8px] rounded-[2px]" style={{ background: `${tint}${i === 0 ? "cc" : "33"}` }} />
              <Bar w={`${44 + i * 8}%`} h={3} o={0.2} />
              <span className={`${label} ml-auto text-[3px] text-ink/35`}>{chips} SDK</span>
            </div>
            <div className="mt-1 flex gap-[3px]">
              {Array.from({ length: chips }).map((_, c) => (
                <span
                  key={c}
                  className="h-[4px] w-[10px] rounded-[1px]"
                  style={{ background: c === 0 ? `${tint}66` : "rgba(12,12,15,0.08)" }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Find Near Me — a map with pins and the nearest result. */
function MapScreen({ tint }: Props) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Nearby" tint={tint} />

      <div className="relative mx-2.5 mt-2.5 h-[74px] overflow-hidden rounded-[3px] bg-[#eef1ec]">
        {/* Roads */}
        <svg viewBox="0 0 120 90" className="absolute inset-0 size-full">
          <rect width="120" height="90" fill="#eaeee8" />
          <g stroke="#ffffff" strokeWidth="5">
            <path d="M-5 30h130M-5 62h130M32 -5v100M84 -5v100" />
          </g>
          <g fill="#dfe5dc">
            <rect x="4" y="4" width="24" height="22" rx="2" />
            <rect x="38" y="4" width="40" height="22" rx="2" />
            <rect x="90" y="36" width="26" height="22" rx="2" />
            <rect x="4" y="66" width="24" height="20" rx="2" />
          </g>
          {/* Accuracy ring */}
          <circle cx="58" cy="46" r="20" fill={tint} fillOpacity="0.12" />
          <circle cx="58" cy="46" r="20" stroke={tint} strokeOpacity="0.35" fill="none" />
        </svg>

        {/* Pins */}
        {[
          { x: "48%", y: "44%", big: true },
          { x: "22%", y: "24%", big: false },
          { x: "76%", y: "62%", big: false },
        ].map((p, i) => (
          <span key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: p.x, top: p.y }}>
            <svg viewBox="0 0 24 32" className={p.big ? "h-[13px]" : "h-[9px]"} fill={p.big ? tint : "#0c0c0f"} opacity={p.big ? 1 : 0.35}>
              <path d="M12 0a12 12 0 0 0-12 12c0 8 12 20 12 20s12-12 12-20A12 12 0 0 0 12 0Z" />
              <circle cx="12" cy="12" r="4.5" fill="#fff" />
            </svg>
          </span>
        ))}
      </div>

      <div className="mt-2 flex flex-1 flex-col gap-[5px] px-2.5">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-[2px] bg-ink/[0.03] px-1.5 py-1.5">
            <span className="size-[8px] rounded-full" style={{ background: i === 0 ? tint : "rgba(12,12,15,0.12)" }} />
            <span className="flex flex-1 flex-col gap-[3px]">
              <Bar w={i === 0 ? "62%" : "48%"} h={3} o={0.2} />
              <Bar w="28%" h={2} o={0.1} />
            </span>
            <span className={`${label} text-[3px] text-ink/35`}>{i === 0 ? "240 m" : "1.1 km"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Smart Calculator — a GST result over a keypad. */
function Calc({ tint }: Props) {
  return (
    <div className="flex h-full flex-col">
      <Header title="GST" tint={tint} />

      <div className="mx-2.5 mt-2.5 rounded-[3px] bg-ink/[0.04] px-2 py-2 text-right">
        <span className={`${label} block text-[3.5px] text-ink/40`}>Total incl. 18%</span>
        <span className="mt-1 block text-[13px] font-medium leading-none tracking-tight text-ink/80 tabular-nums">
          ₹14,160
        </span>
        <span className={`${label} mt-1 block text-[3.5px]`} style={{ color: tint }}>
          GST ₹2,160
        </span>
      </div>

      <div className="mt-2 grid flex-1 grid-cols-4 gap-[3px] px-2.5 pb-2.5">
        {Array.from({ length: 16 }).map((_, i) => {
          const accent = i % 4 === 3;
          return (
            <span
              key={i}
              className="flex items-center justify-center rounded-[2px]"
              style={{
                background: accent ? `${tint}22` : "rgba(12,12,15,0.04)",
                minHeight: 11,
              }}
            >
              <span
                className="h-[3px] w-[5px] rounded-[1px]"
                style={{ background: accent ? tint : "rgba(12,12,15,0.2)" }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Snake Arena — the live arena with a score row. */
function Game({ tint }: Props) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Arena" tint={tint} />

      <div className="relative mx-2.5 mt-2.5 flex-1 overflow-hidden rounded-[3px] bg-[#101318]">
        <svg viewBox="0 0 120 150" className="absolute inset-0 size-full">
          <defs>
            <pattern id="grid-game" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M12 0H0v12" stroke="#ffffff" strokeOpacity="0.05" fill="none" />
            </pattern>
          </defs>
          <rect width="120" height="150" fill="url(#grid-game)" />
          {/* Player snake */}
          <path
            d="M22 118 C 40 118, 40 92, 58 92 S 76 66, 92 66 S 100 44, 86 34"
            stroke={tint}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="86" cy="34" r="5.5" fill="#ffffff" />
          <circle cx="86" cy="34" r="2" fill={tint} />
          {/* Rival */}
          <path
            d="M96 130 C 80 130, 78 112, 62 112"
            stroke="#ffffff"
            strokeOpacity="0.28"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Pellets */}
          {[
            [30, 44],
            [66, 130],
            [104, 96],
            [46, 70],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.6" fill="#ffffff" fillOpacity={0.55} />
          ))}
        </svg>

        <div className="absolute inset-x-1.5 top-1.5 flex items-center justify-between">
          <span className={`${label} text-[3.5px] text-white/55`}>Rank 3 / 18</span>
          <span className={`${label} text-[3.5px] text-white/80`}>1 240</span>
        </div>
      </div>

      <div className="mx-2.5 mb-2.5 mt-2 flex gap-[3px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[4px] flex-1 rounded-full"
            style={{ background: i === 0 ? tint : "rgba(12,12,15,0.08)" }}
          />
        ))}
      </div>
    </div>
  );
}

/** PaperNote — a checklist with one locked note. */
function Notes({ tint }: Props) {
  return (
    <div className="flex h-full flex-col">
      <Header title="Notes" tint={tint} />

      <div className="mx-2.5 mt-2.5 rounded-[3px] border-l-2 bg-ink/[0.03] px-2 py-1.5" style={{ borderColor: tint }}>
        <Bar w="54%" h={4} o={0.28} />
        <span className="mt-1.5 flex flex-col gap-[3px]">
          <Bar w="88%" h={2.5} o={0.12} />
          <Bar w="72%" h={2.5} o={0.12} />
        </span>
      </div>

      <div className="mt-2 flex flex-1 flex-col gap-[5px] px-2.5">
        {[true, true, false, false].map((done, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="flex size-[8px] shrink-0 items-center justify-center rounded-[1px]"
              style={{
                background: done ? tint : "transparent",
                border: done ? "none" : "1px solid rgba(12,12,15,0.18)",
              }}
            >
              {done && (
                <svg viewBox="0 0 12 12" className="size-[5px]" fill="none" stroke="#fff" strokeWidth="2.6">
                  <path d="M2 6.4 4.6 9 10 3.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <Bar w={`${68 - i * 9}%`} h={3} o={done ? 0.12 : 0.22} />
          </div>
        ))}

        {/* Locked note */}
        <div className="mt-auto mb-2.5 flex items-center gap-1.5 rounded-[2px] bg-ink/[0.04] px-1.5 py-1.5">
          <svg viewBox="0 0 24 24" className="size-[8px]" fill="none" stroke={tint} strokeWidth="2.4">
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          <Bar w="40%" h={3} o={0.16} />
          <span className={`${label} ml-auto text-[3px] text-ink/35`}>Locked</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- dispatcher */

const SCREENS: Record<AppScreen, (props: Props) => React.ReactElement> = {
  blocklist: BlockList,
  chat: Chat,
  resize: Resize,
  inspect: Inspect,
  map: MapScreen,
  calc: Calc,
  game: Game,
  notes: Notes,
};

export function AppScreenMock({ screen, tint }: { screen: AppScreen; tint: string }) {
  const Component = SCREENS[screen] ?? BlockList;
  return (
    <div className="flex h-full flex-col pt-2.5">
      <Component tint={tint} />
    </div>
  );
}
