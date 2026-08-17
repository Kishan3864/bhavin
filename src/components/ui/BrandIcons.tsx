import type { SVGProps } from "react";

/**
 * Hand-drawn brand marks.
 *
 * Lucide dropped brand icons, and these are the platforms the work is actually
 * about — so they are drawn here as plain SVG paths: no icon-font dependency,
 * they inherit `currentColor`, and they stay sharp at any size.
 */

type Props = SVGProps<SVGSVGElement>;

/** The Android robot — head, body and both arms, so it reads at 14px. */
export function AndroidIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6 18c0 .55.45 1 1 1h1v3.5a1.5 1.5 0 0 0 3 0V19h2v3.5a1.5 1.5 0 0 0 3 0V19h1c.55 0 1-.45 1-1V8H6v10Z" />
      <path d="M3.5 8A1.5 1.5 0 0 0 2 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 3.5 8ZM20.5 8A1.5 1.5 0 0 0 19 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 20.5 8Z" />
      <path d="m15.53 2.16 1.3-1.3a.5.5 0 0 0-.71-.71l-1.48 1.48A6.87 6.87 0 0 0 12 1c-.96 0-1.86.23-2.66.63L7.85.15a.5.5 0 1 0-.71.71l1.31 1.31A5.9 5.9 0 0 0 6 7h12a5.9 5.9 0 0 0-2.47-4.84ZM10 5H9V4h1v1Zm5 0h-1V4h1v1Z" />
    </svg>
  );
}

/** Google Play — the store triangle, drawn as four facets. */
export function GooglePlayIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3.6 2.3a1 1 0 0 0-.6.92v17.56a1 1 0 0 0 .6.92l9.3-9.7-9.3-9.7Z"
        fill="currentColor"
        fillOpacity="0.95"
      />
      <path
        d="m12.9 12 3-3.13-9.98-5.7a1 1 0 0 0-.32-.12l7.3 8.95Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="m12.9 12-7.3 8.95a1 1 0 0 0 .32-.12l9.98-5.7L12.9 12Z"
        fill="currentColor"
        fillOpacity="0.75"
      />
      <path
        d="m15.9 8.87-3 3.13 3 3.13 3.84-2.2a1.06 1.06 0 0 0 0-1.86l-3.84-2.2Z"
        fill="currentColor"
        fillOpacity="0.45"
      />
    </svg>
  );
}

/** Flutter — the folded chevron. */
export function FlutterIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.3 1.5 4 11.8l3.2 3.2L20.7 1.5h-6.4Z" fillOpacity="0.75" />
      <path d="M14.3 12.2 8.5 18l3.2 3.2 3.2-3.2h5.8l-6.4-5.8Z" fillOpacity="0.95" />
      <path d="m8.5 18 3.2-3.2 3.2 3.2-3.2 3.2L8.5 18Z" fillOpacity="0.5" />
    </svg>
  );
}

/** Kotlin — the two-triangle mark. */
export function KotlinIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23 23H1V1h22L12 12l11 11Z" />
    </svg>
  );
}

/** Firebase — the folded flame. */
export function FirebaseIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3.9 18.4 6.2 3.7c.08-.5.75-.62 1-.18l2.47 4.62-5.77 10.26Z" fillOpacity="0.55" />
      <path
        d="M20.1 18.4 18.06 5.8c-.07-.44-.62-.6-.92-.27L3.9 18.4l7.1 3.98a1.7 1.7 0 0 0 1.64 0l7.46-3.98Z"
        fillOpacity="0.95"
      />
      <path d="m13.2 9.5-2.02-3.84-7.28 12.74L13.2 9.5Z" fillOpacity="0.7" />
    </svg>
  );
}

/** iOS — a device silhouette rather than a trademarked fruit. */
export function IosIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M10 5.2h4" strokeLinecap="round" />
      <circle cx="12" cy="18.4" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function GitHubIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-2.13c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.82 1.18 1.85 1.18 3.11 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}
