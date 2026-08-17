export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation — used by the pointer-following chrome. */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
