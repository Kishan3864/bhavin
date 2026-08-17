/**
 * Paper grain — a single fixed layer over the whole document.
 *
 * Rendered as an inline SVG turbulence data URI so it costs one tiny
 * background image and zero animation frames. Opacity is deliberately low:
 * you should feel it, not see it.
 */
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="180" height="180" filter="url(#n)" opacity="0.5"/></svg>`,
  );

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.035] mix-blend-multiply"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "180px 180px" }}
    />
  );
}

/** Very soft top-left/bottom-right vignette that keeps the off-white alive. */
export function Vignette() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 55%), radial-gradient(100% 60% at 50% 100%, rgba(12,12,15,0.045) 0%, rgba(12,12,15,0) 60%)",
      }}
    />
  );
}
