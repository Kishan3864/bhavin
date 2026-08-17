/**
 * Resolve a path in `public/` against the deployment base path.
 *
 * Next rewrites `/_next/*` assets for `basePath` automatically, and it rewrites
 * `next/image` sources too — but only when they go through the optimizer route.
 * This build sets `images.unoptimized` (a static host has no optimizer), so an
 * image src is emitted exactly as written and has to be prefixed by hand.
 *
 * The value is inlined at build time via `env` in next.config.ts, so it always
 * matches the `basePath` the bundle was compiled with.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path)) return path;
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
