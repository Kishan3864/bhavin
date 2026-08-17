# Bhavin Solanki — Android Developer Portfolio

A single-page portfolio for a native Android / mobile developer. Static by
design — no backend, no CMS, no database. Next.js 16 (App Router) · React 19 ·
TypeScript · Tailwind CSS v4 · Framer Motion.

```bash
npm install
npm run dev        # http://localhost:3000/bhavin/   ← note the base path
npm run build      # static export → out/
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Deploying to GitHub Pages

Target: **https://kishan3864.github.io/bhavin/**

`npm run build` emits a fully static `out/` directory — no Node server is
involved anywhere. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds and publishes on every push to `main`.

**One-time setup**

1. Push this repository to GitHub, named **`bhavin`** (the repo name *is* the
   URL sub-path).
2. Repo → **Settings → Pages → Source: GitHub Actions**. Not "Deploy from a
   branch" — the workflow publishes an artifact.

That's it. The workflow lints, typechecks, builds, asserts the export is
correct, and deploys.

**What makes the sub-path work**

| Piece | Why |
|---|---|
| `output: "export"` in `next.config.ts` | Static HTML, no server runtime |
| `basePath` / `assetPrefix` = `/bhavin` | Rewrites every `/_next/*` URL |
| `images.unoptimized: true` | The Image Optimization API needs a server |
| [`src/lib/assets.ts`](src/lib/assets.ts) → `asset()` | **`basePath` is not applied to `next/image` when `unoptimized` is set** — image sources are emitted verbatim, so `public/` paths must be prefixed by hand. Every app icon goes through this helper. |
| `env.NEXT_PUBLIC_BASE_PATH` in `next.config.ts` | Inlines the same value into the client bundle so `asset()` can never drift from `basePath` |
| `public/.nojekyll` | Without it Pages drops `_next/` — leading-underscore directories are Jekyll-ignored |
| `dynamic = "force-static"` in `robots.ts`, `sitemap.ts`, `opengraph-image.tsx` | Required by `output: "export"`; the build errors without it |
| `trailingSlash: true` | Directory URLs resolve to `index.html` |

**Deploying somewhere else** — a custom domain, or a `<user>.github.io` root
repo — build with `NEXT_PUBLIC_BASE_PATH=""` and update `site.url` in
`profile.ts`. Nothing else changes.

## Editing the content

**Everything the visitor reads lives in [`src/content/profile.ts`](src/content/profile.ts).**
No copy is hardcoded in components.

Every fact in that file is tagged with its source:

| Tag | Meaning |
|---|---|
| `[PLAY]` | Taken from the live Google Play listing — `play.google.com/store/apps/developer?id=Smart+Codies` |
| `[LINKEDIN]` | Taken from `linkedin.com/in/bhavin-solanki-20896115b` |
| `[OWNER]` | Supplied directly by Bhavin |
| `// CONFIRM` | The **only** values still needing a check — exact employment dates |

Nothing is invented. The eight app names, categories, descriptions, install
counts, package ids and icons are the real store listings; the four impact
figures are Bhavin's own published numbers, and the section links to the
developer page so a visitor can verify them.

| Export | What it drives |
|---|---|
| `profile` / `links` | Identity, hero headline, email, LinkedIn, GitHub, Play Store |
| `platforms` | Android / cross-platform / iOS reach shown in the hero and contact |
| `about` | LinkedIn summary, working principles, fact rail |
| `metrics` | The four-figure impact band under the hero |
| `expertise` | Six capability rows |
| `stackGroups` | Mobile Core · Android Deep-Dive · Cloud & Backend · Tools & DevOps |
| `apps` | The eight published Play Store titles |
| `experience` / `clientWork` / `education` | Career track and in-house apps |
| `process` | The five-stage delivery deck |
| `contact` / `footer` | Closing CTA and colophon |

### Adding a ninth app

1. Drop the store icon into `public/apps/<id>.webp`.
2. Add an entry to `apps` in `profile.ts` with its real `packageId`, `href`,
   `category`, `description` and `installs`.
3. Set `featured: true` to give it the large device treatment, or leave it off
   for the grid. Featured cards cycle through three compositions automatically.

## Contact form

Validates on the client, then either:

- **POSTs** `{ name, email, message }` as JSON to `NEXT_PUBLIC_CONTACT_ENDPOINT`
  (Formspree, Getform, a Resend-backed Route Handler — anything accepting that
  shape), or
- **hands off** to the visitor's mail client when no endpoint is configured.

It never reports a success that did not happen. Copy `.env.example` to
`.env.local` to switch modes. Logic lives in [`src/lib/contact.ts`](src/lib/contact.ts).

## Design system

Tokens are declared once in the `@theme` block of
[`src/app/globals.css`](src/app/globals.css) — surface, ink scale, accent,
hairlines, easing curves, radii, shadows — plus the fluid `type-*` scale and
the `.shell` / `.section-pad` layout primitives.

Every ink step from `ink` down to `ink-40` clears 4.5:1 contrast against
`paper`; `ink-20` and below are decorative only and must never carry text.

### Corner radius

Deliberately minimal — 1–8px across the whole project. The `--radius-*` tokens
**override Tailwind's own scale**, so every `rounded-*` utility inherits it;
there is no per-component radius to keep in sync.

Two categories opt out on purpose:

- **True circles** — status dots, pulse rings, the timeline node, and skeleton
  bars whose radius is clamped by their own height. These keep `rounded-full`.
- **Depicted hardware** — phone bezels in the hero and app cards, and the app
  icon tiles on the device home screen. These are reduced (≈0.4–0.85rem) rather
  than flattened, because a square-cornered phone stops reading as a phone.

### Focus indicator

Form fields replace the default outline with a 2px accent underline plus a
faint field tint — 6.3:1 against paper, spanning the full control. This is a
real WCAG 2.4.11 indicator, not a removal; the automated focus sweep in the QA
pass fails if any focusable element loses its ring.

### Owner portrait

`public/bhavin.jpg` holds the real headshot, deliberately stripped of EXIF/GPS
metadata and re-encoded to 720px — the frame never renders larger than ~362px.
If you swap it, strip metadata again. The aspect ratio is 4:5; [`Portrait.tsx`](src/components/ui/Portrait.tsx)
falls back to the initials monogram if the file is missing or fails to load.
Set `profile.portrait` to `null` to use the monogram deliberately.

### Cursor

Fine-pointer devices get a sharpened arrow bound straight to the pointer with
no spring at all — any smoothing reads as lag on the thing you aim with — plus
a label plate that trails slightly and appears over any
element carrying `data-cursor="LABEL"`. The native cursor is only hidden once
the custom one has actually mounted, so a JS failure cannot leave a visitor
without a pointer.

## Icons and graphics

- [`components/ui/Icon.tsx`](src/components/ui/Icon.tsx) — a name → component
  registry, so `profile.ts` can reference an icon by string and stay free of JSX.
- [`components/ui/BrandIcons.tsx`](src/components/ui/BrandIcons.tsx) — hand-drawn
  Android, Google Play, Flutter, Kotlin, Firebase, iOS, LinkedIn and GitHub
  marks (Lucide dropped brand icons).
- [`components/visuals/HeroVisual.tsx`](src/components/visuals/HeroVisual.tsx) —
  the hero device: an SVG Android phone whose home grid holds the eight real
  Play Store icons, orbited by measurement rings.
- Featured app cards render SVG/CSS device mock-ups — no fabricated screenshots.

## Motion

- [`components/motion/Reveal.tsx`](src/components/motion/Reveal.tsx) — the one
  scroll-entry primitive (`Reveal`, `Stagger`, `StaggerItem`)
- [`components/motion/SplitText.tsx`](src/components/motion/SplitText.tsx) —
  masked word and line reveals
- [`components/motion/Magnetic.tsx`](src/components/motion/Magnetic.tsx) —
  pointer-magnetic wrapper

Reduced motion is read through `usePrefersReducedMotion` in
[`hooks/useMediaQuery.ts`](src/hooks/useMediaQuery.ts) rather than Framer's own
hook, so the preference can never break hydration. When it is on, every
decorative animation collapses to its final state.

`Reveal` with `direction="left" | "right"` translates the element outside its
parent's box until it enters the viewport — any ancestor using those must carry
`overflow-x: clip`.

## Notes

- Smooth scrolling (Lenis) is skipped entirely on touch devices and under
  reduced motion; native scrolling is better there.
- The custom cursor mounts only on fine pointers and hides the native cursor
  only once it is actually running, so a JS failure cannot leave the visitor
  without one. Add `data-cursor="LABEL"` to any element to give it a label.
- SEO: metadata, a JSON-LD `Person` node **and** an `ItemList` of
  `SoftwareApplication` entries (one per published app), `sitemap.ts`,
  `robots.ts` and a generated `opengraph-image` — all read from `profile.ts`.
