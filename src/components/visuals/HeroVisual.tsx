"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useId, type CSSProperties } from "react";
import { apps } from "@/content/profile";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { asset } from "@/lib/assets";

/** Decorative rings rotate about the device centre, not their own box. */
const spinOrigin: CSSProperties = { transformOrigin: "50% 50%" };

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The hero instrument: an Android device rendered in SVG, its home grid filled
 * with the real Play Store icons, orbited by measurement rings and a travelling
 * signal marker.
 *
 * The device, rings and grid are vector; only the eight app icons are raster,
 * and those are the actual store artwork rather than invented mock-ups.
 */
export function HeroVisual({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");

  /* Device geometry inside a 560 × 560 stage. */
  const dev = { x: 186, y: 92, w: 188, h: 376, r: 30 };

  /* 2 × 4 home-screen grid of the real app icons.
     Geometry is checked against the screen box: four rows of
     (tile + label + gap) must finish above the home indicator. */
  const cols = 2;
  const tile = 46;
  const gapX = 24;
  const gapY = 17;
  const gridW = cols * tile + gapX;
  const gridX = dev.x + (dev.w - gridW) / 2;
  const gridY = dev.y + 82;

  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 560 560" fill="none" className="h-full w-full" role="presentation">
        <defs>
          <radialGradient id={`glow-${uid}`} cx="50%" cy="44%" r="52%">
            <stop offset="0%" stopColor="#2c3fe8" stopOpacity="0.15" />
            <stop offset="58%" stopColor="#6d7bf2" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#6d7bf2" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`fade-${uid}`} cx="50%" cy="50%" r="52%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>

          <mask id={`mask-${uid}`}>
            <rect width="560" height="560" fill={`url(#fade-${uid})`} />
          </mask>

          <pattern id={`dots-${uid}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="#0c0c0f" fillOpacity="0.2" />
          </pattern>

          <linearGradient id={`screen-${uid}`} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="52%" stopColor="#f7f6f3" />
            <stop offset="100%" stopColor="#eceae3" />
          </linearGradient>

          <linearGradient id={`bezel-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2a2a31" />
            <stop offset="48%" stopColor="#0c0c0f" />
            <stop offset="100%" stopColor="#31313a" />
          </linearGradient>

          <clipPath id={`screenClip-${uid}`}>
            <rect
              x={dev.x + 7}
              y={dev.y + 7}
              width={dev.w - 14}
              height={dev.h - 14}
              rx={dev.r - 7}
            />
          </clipPath>
        </defs>

        {/* Ambient light + measured field */}
        <circle cx="280" cy="280" r="268" fill={`url(#glow-${uid})`} />
        <rect width="560" height="560" fill={`url(#dots-${uid})`} mask={`url(#mask-${uid})`} />

        {/* Orbit rings */}
        <g mask={`url(#mask-${uid})`} fill="none">
          <circle
            cx="280"
            cy="280"
            r="252"
            stroke="#0c0c0f"
            strokeOpacity="0.17"
            strokeDasharray="2 9"
            style={reduce ? undefined : { ...spinOrigin, animation: "orbit-spin 130s linear infinite" }}
          />
          <circle
            cx="280"
            cy="280"
            r="206"
            stroke="#0c0c0f"
            strokeOpacity="0.13"
            strokeDasharray="1 6"
            style={
              reduce
                ? undefined
                : { ...spinOrigin, animation: "orbit-spin 84s linear infinite reverse" }
            }
          />
          <circle cx="280" cy="280" r="160" stroke="#0c0c0f" strokeOpacity="0.1" />
        </g>

        {/* Orbiting release marker */}
        {!reduce && (
          <g style={{ ...spinOrigin, animation: "orbit-spin 24s linear infinite" }}>
            <circle cx="280" cy="28" r="3.5" fill="#2c3fe8" />
            <circle cx="280" cy="28" r="10" fill="#2c3fe8" fillOpacity="0.12" />
          </g>
        )}

        {/* ------------------------------------------------------------ device */}
        <motion.g
          initial={reduce ? undefined : { opacity: 0, y: 18 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
        >
          {/* Cast shadow */}
          <ellipse cx="280" cy="486" rx="96" ry="14" fill="#0c0c0f" fillOpacity="0.07" />

          {/* Bezel */}
          <rect
            x={dev.x}
            y={dev.y}
            width={dev.w}
            height={dev.h}
            rx={dev.r}
            fill={`url(#bezel-${uid})`}
          />
          {/* Side buttons */}
          <rect x={dev.x + dev.w} y={dev.y + 96} width="3" height="34" rx="1.5" fill="#0c0c0f" />
          <rect x={dev.x + dev.w} y={dev.y + 140} width="3" height="22" rx="1.5" fill="#0c0c0f" />

          {/* Screen */}
          <rect
            x={dev.x + 7}
            y={dev.y + 7}
            width={dev.w - 14}
            height={dev.h - 14}
            rx={dev.r - 7}
            fill={`url(#screen-${uid})`}
          />

          <g clipPath={`url(#screenClip-${uid})`}>
            {/* Status bar */}
            <circle cx={dev.x + dev.w / 2} cy={dev.y + 24} r="4.5" fill="#0c0c0f" fillOpacity="0.82" />
            <rect
              x={dev.x + 22}
              y={dev.y + 21}
              width="26"
              height="5"
              rx="2.5"
              fill="#0c0c0f"
              fillOpacity="0.24"
            />
            <rect
              x={dev.x + dev.w - 48}
              y={dev.y + 21}
              width="26"
              height="5"
              rx="2.5"
              fill="#0c0c0f"
              fillOpacity="0.24"
            />

            {/* Header block */}
            <rect
              x={dev.x + 22}
              y={dev.y + 44}
              width="74"
              height="8"
              rx="4"
              fill="#0c0c0f"
              fillOpacity="0.55"
            />
            <rect
              x={dev.x + 22}
              y={dev.y + 58}
              width="48"
              height="5"
              rx="2.5"
              fill="#0c0c0f"
              fillOpacity="0.2"
            />

            {/* Real app icons on the home grid */}
            {apps.slice(0, 8).map((app, i) => {
              const cx = gridX + (i % cols) * (tile + gapX);
              const cy = gridY + Math.floor(i / cols) * (tile + gapY);
              return (
                <motion.g
                  key={app.id}
                  initial={reduce ? undefined : { opacity: 0, scale: 0.6 }}
                  animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.75 + i * 0.07, ease: EASE }}
                  style={{ transformOrigin: `${cx + tile / 2}px ${cy + tile / 2}px` }}
                >
                  <foreignObject x={cx} y={cy} width={tile} height={tile}>
                    <div
                      style={{
                        width: tile,
                        height: tile,
                        borderRadius: 5,
                        overflow: "hidden",
                        boxShadow: "0 4px 12px -4px rgba(12,12,15,0.35)",
                      }}
                    >
                      <Image
                        src={asset(app.icon)}
                        alt=""
                        width={tile}
                        height={tile}
                        priority={i < 4}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </foreignObject>
                  <rect
                    x={cx + 8}
                    y={cy + tile + 5}
                    width={tile - 16}
                    height="3.5"
                    rx="1.75"
                    fill="#0c0c0f"
                    fillOpacity="0.16"
                  />
                </motion.g>
              );
            })}

            {/* Home indicator */}
            <rect
              x={dev.x + dev.w / 2 - 26}
              y={dev.y + dev.h - 26}
              width="52"
              height="4"
              rx="2"
              fill="#0c0c0f"
              fillOpacity="0.28"
            />
          </g>

          {/* Screen sheen */}
          <path
            d={`M${dev.x + 7} ${dev.y + 7} h${dev.w - 14} v40 L${dev.x + 7} ${dev.y + 150} Z`}
            fill="#ffffff"
            fillOpacity="0.28"
            clipPath={`url(#screenClip-${uid})`}
          />
        </motion.g>

        {/* Connective leaders out to the floating chips */}
        <g stroke="#0c0c0f" strokeOpacity="0.16" strokeDasharray="3 5">
          <path d={`M${dev.x} ${dev.y + 74} H96`} />
          <path d={`M${dev.x + dev.w} ${dev.y + 300} H464`} />
        </g>
        <circle cx="96" cy={dev.y + 74} r="3" fill="#2c3fe8" />
        <circle cx="464" cy={dev.y + 300} r="3" fill="#2c3fe8" />

        {/* Corner registration marks */}
        <g stroke="#0c0c0f" strokeOpacity="0.22" strokeWidth="1">
          <path d="M22 60V22h38" />
          <path d="M538 60V22h-38" />
          <path d="M22 500v38h38" />
          <path d="M538 500v38h-38" />
        </g>
      </svg>
    </div>
  );
}
