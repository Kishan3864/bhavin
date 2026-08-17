import type { NextConfig } from "next";

/**
 * GitHub Pages target: https://kishan3864.github.io/bhavin/
 *
 * Pages serves a project repo from a sub-path named after the repo, so
 * `basePath` has to be baked in at build time — Next then rewrites every
 * `/_next/*` asset, every `next/image` src and every `next/link` href for us.
 * The value MUST match the repository name exactly, case included.
 *
 * Override with NEXT_PUBLIC_BASE_PATH="" to deploy at a domain root instead
 * (a custom domain, or a `<user>.github.io` root repo).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/bhavin";

const nextConfig: NextConfig = {
  /* Emits a fully static `out/` directory — no Node server anywhere. */
  output: "export",

  basePath,
  /* Explicit rather than inherited, so the value is obvious in the build log. */
  assetPrefix: basePath || undefined,

  /* Inlined into the client bundle so `asset()` in src/lib/assets.ts resolves
     to the same value the build was compiled with. `basePath` alone is NOT
     enough: with `images.unoptimized` a next/image src bypasses the optimizer
     route and is emitted verbatim, so `/apps/*.webp` would 404 under the
     sub-path. */
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  /* Directory-style URLs (`/bhavin/` → `index.html`) are what Pages expects. */
  trailingSlash: true,

  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    /* The Image Optimization API needs a running server; a static host has
       none. Icons are already small, correctly sized WebP files. */
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
