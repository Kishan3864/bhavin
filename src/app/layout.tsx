import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { apps, education, links, profile, site } from "@/content/profile";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const editorial = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-editorial",
  display: "swap",
});

const title = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  /* Origin only, NOT `site.url`. Next already prefixes `basePath` onto static
     metadata files, so a metadataBase that also carried `/bhavin` resolved
     og:image to `…/bhavin/bhavin/opengraph-image.png`. Absolute values below
     (canonical, og:url) are unaffected either way. */
  metadataBase: new URL("/", site.url),
  title: {
    default: title,
    template: `%s — ${profile.name}`,
  },
  description: profile.summary,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  keywords: [
    profile.name,
    "Android developer",
    "mobile app developer",
    "Kotlin developer",
    "Jetpack Compose",
    "Android developer India",
    "Android developer Surat",
    "Flutter developer",
    "iOS developer",
    "Google Play developer",
    "Smart Codies",
  ],
  /* Absolute, not "/" — with a base-path deployment a relative canonical
     resolves against the origin and silently drops `/bhavin`. */
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: profile.name,
    title,
    description: profile.summary,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.summary,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#f4f3ef" },
  ],
};

/**
 * Structured data. A Person node plus one SoftwareApplication per published
 * title — every field is drawn from the live Play Store listing, so search
 * engines get the same verifiable facts a visitor sees.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.summary,
  url: site.url,
  email: `mailto:${links.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Surat",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
  sameAs: [links.linkedin, links.github, links.playStore],
  knowsAbout: [
    "Android development",
    "Kotlin",
    "Java",
    "Jetpack Compose",
    "MVVM",
    "Clean Architecture",
    "Room DB",
    "Retrofit",
    "Firebase",
    "AWS Amplify",
    "Google Play Console",
    "In-app purchases",
    "Flutter",
    "Swift",
  ],
};

const appsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Android applications by ${profile.name}`,
  numberOfItems: apps.length,
  itemListElement: apps.map((app, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SoftwareApplication",
      name: app.name,
      description: app.description,
      applicationCategory: "MobileApplication",
      operatingSystem: "Android",
      url: app.href,
      author: { "@type": "Person", name: profile.name },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${editorial.variable}`}>
      <body className="antialiased">
        <a
          href="#about"
          className="sr-only rounded-sm bg-ink px-5 py-3 text-paper-raised focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appsSchema) }}
        />
      </body>
    </html>
  );
}
