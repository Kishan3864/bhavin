/* ============================================================================
 * SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
 * ----------------------------------------------------------------------------
 * Everything the visitor reads lives in this file. No copy is hardcoded in
 * components.
 *
 * SOURCES — every fact below is traceable:
 *   [PLAY]     play.google.com/store/apps/developer?id=Smart+Codies
 *   [LINKEDIN] linkedin.com/in/bhavin-solanki-20896115b
 *   [OWNER]    supplied directly by Bhavin
 *
 * Nothing here is invented. To show a start year on the current role, set
 * `period` on the first `experience` entry (e.g. "2022 — Present").
 * ==========================================================================*/

export const site = {
  /** Canonical origin + base path. Must match `basePath` in next.config.ts. */
  url: "https://kishan3864.github.io/bhavin/",
  locale: "en_IN",
} as const;

export const profile = {
  name: "Bhavin Solanki", // [LINKEDIN]
  shortName: "Bhavin",
  initials: "BS",
  role: "Android Developer", // [LINKEDIN]
  discipline: "Kotlin · Jetpack Compose · Firebase", // [LINKEDIN headline]
  location: "Surat, Gujarat, India", // [OWNER]
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST",
  available: true,
  availabilityNote: "Open for collaboration",

  /**
   * Owner photo. Drop the file into `public/` as any one of these names —
   * they are tried in order and the first that loads wins, so the format does
   * not matter. Set to `[]` to force the initials monogram instead.
   */
  portrait: ["/bhavin.jpg", "/bhavin.png", "/bhavin.webp", "/bhavin.jpeg"] as string[],

  /**
   * How the photo is cropped inside the 4:5 frame. Headshots are usually taller
   * than 4:5, so the crop is biased upward to keep the face centred rather than
   * slicing the top of the head. Nudge the second value if your photo differs.
   */
  portraitPosition: "50% 12%",

  /** Hero headline, one array entry per visual line. */
  headline: ["Native Android,", "built to ship."],

  statement:
    "Android developer with 4+ years building scalable mobile apps in Kotlin, Java and the Android SDK — eight of them live on Google Play, published and maintained end to end.", // [LINKEDIN]

  summary:
    "Bhavin Solanki — Android developer with 4+ years building scalable mobile applications in Kotlin, Jetpack Compose, Firebase and AWS. 8 apps published on Google Play.",
} as const;

export const links = {
  email: "bhavinsolanki0815@gmail.com", // [OWNER]
  linkedin: "https://www.linkedin.com/in/bhavin-solanki-20896115b", // [LINKEDIN]
  github: "https://github.com/bhavien", // [OWNER]
  playStore: "https://play.google.com/store/apps/developer?id=Smart+Codies", // [PLAY]
} as const;

/* ---------------------------------------------------------------- navigation */

export const navigation = [
  { id: "index", label: "Index", index: "00" },
  { id: "about", label: "About", index: "01" },
  { id: "expertise", label: "Expertise", index: "02" },
  { id: "stack", label: "Stack", index: "03" },
  { id: "apps", label: "Apps", index: "04" },
  { id: "experience", label: "Experience", index: "05" },
  { id: "process", label: "Process", index: "06" },
  { id: "contact", label: "Contact", index: "07" },
] as const;

/* -------------------------------------------------------------- the platforms */

/** Platform reach. Ordered by depth — Android is the primary discipline. */
export const platforms = [
  {
    name: "Android",
    icon: "android",
    level: "Primary platform",
    detail: "Kotlin, Java and the Android SDK — 8 apps shipped to Google Play.",
  },
  {
    name: "Cross-platform",
    icon: "layers",
    level: "Flutter · Dart",
    detail: "Single codebase delivery when a product needs both stores at once.",
  },
  {
    name: "iOS",
    icon: "apple",
    level: "Swift",
    detail: "Swift for the Apple side of cross-platform mobile products.",
  },
] as const;

/* --------------------------------------------------------------------- about */

export const about = {
  eyebrow: "Identity",
  /** Condensed from the LinkedIn summary — his own framing, his own words. */
  statement:
    "I build Android apps that reach real users — architected properly, measured honestly, and maintained long after launch day.",
  paragraphs: [
    "Android developer with 4+ years of experience building scalable mobile applications using Kotlin, Java and the Android SDK. Experienced in MVVM, Clean Architecture, Jetpack Compose, Room DB and REST API integration.", // [LINKEDIN]
    "Proficient with AWS services — Amplify, Cognito, Lambda and DynamoDB — alongside SQL databases. Skilled in Play Console management, in-app purchases, performance optimisation, and tools like Git, Android Studio, Postman and JIRA.", // [LINKEDIN]
    "Eight applications are published under the Smart Codies developer account, each one taken from first commit to store listing to ongoing updates. Focused on delivering smooth user experiences and scalable mobile solutions.", // [LINKEDIN + PLAY]
  ],
  principles: [
    {
      index: "01",
      icon: "layout",
      title: "Architecture before UI",
      body: "MVVM and Clean Architecture from the first commit — because the structure is what survives four years of updates.",
    },
    {
      index: "02",
      icon: "gauge",
      title: "Performance is user-visible",
      body: "Startup time, frame pacing and memory are budgeted during development, not profiled after a bad review.",
    },
    {
      index: "03",
      icon: "store",
      title: "Shipping is the job",
      body: "Play Console, releases, in-app purchases and post-launch support are part of the work, not somebody else's problem.",
    },
  ],
  facts: [
    { label: "Based in", value: "Surat, Gujarat" }, // [OWNER]
    { label: "Focus", value: "Native Android" },
    { label: "Play account", value: "Smart Codies" }, // [PLAY]
    { label: "Education", value: "GTU" }, // [LINKEDIN]
  ],
} as const;

/* ------------------------------------------------------------------- metrics */

/** All four are Bhavin's own published figures. No estimates. */
export const metrics = [
  { icon: "download", value: "3K+", label: "Total downloads", note: "Across all Play Store titles" },
  { icon: "users", value: "1K+", label: "Active users", note: "Currently installed and in use" },
  { icon: "smartphone", value: "8", label: "Apps published", note: "Live under Smart Codies" },
  { icon: "calendar", value: "4+", label: "Years on Android", note: "Professional experience" },
] as const;

/* ----------------------------------------------------------------- expertise */

export const expertise = [
  {
    index: "01",
    icon: "smartphone",
    title: "Native Android development",
    summary: "Kotlin and Java against the Android SDK, from Activity to Play release.",
    detail:
      "Modern Android built on Kotlin with Jetpack Compose for UI and XML where a legacy surface demands it. Lifecycle-aware components, WorkManager for background jobs, and behaviour that holds up across API levels and OEM skins.",
    tags: ["Kotlin", "Java", "Jetpack Compose", "Android SDK"],
  },
  {
    index: "02",
    icon: "layout",
    title: "App architecture",
    summary: "MVVM and Clean Architecture applied from the first commit.",
    detail:
      "Clear separation between UI, domain and data. ViewModels holding state, repositories owning sources of truth, dependency injection wiring it together — so a feature can be added without unpicking three other ones.",
    tags: ["MVVM", "MVI", "Clean Architecture", "Dependency Injection"],
  },
  {
    index: "03",
    icon: "database",
    title: "Data & APIs",
    summary: "Room, Retrofit and REST integration that survives a bad network.",
    detail:
      "Room for local persistence and offline-first behaviour, Retrofit for REST integration, Coroutines and Flow for asynchronous work. Cached reads, retries and states that reflect what actually happened on the wire.",
    tags: ["Room DB", "Retrofit", "Coroutines", "Flow"],
  },
  {
    index: "04",
    icon: "cloud",
    title: "Cloud & backend services",
    summary: "Firebase and AWS wired into mobile products.",
    detail:
      "Firebase for authentication, Firestore, Cloud Messaging, Crashlytics and Analytics. On AWS: Amplify, Cognito, Lambda and DynamoDB, plus SQL databases where a relational model fits better.",
    tags: ["Firebase", "AWS Amplify", "Cognito", "Lambda", "DynamoDB"],
  },
  {
    index: "05",
    icon: "store",
    title: "Play Console & release",
    summary: "Store listings, in-app purchases and the release train.",
    detail:
      "Play Console management end to end — signing, staged rollouts, policy compliance, store listings and ASO. Google Play Billing for in-app purchases and subscriptions, with Crashlytics watching every release.",
    tags: ["Play Console", "In-App Purchases", "Billing", "Staged rollout"],
  },
  {
    index: "06",
    icon: "gauge",
    title: "Performance & quality",
    summary: "Profiled on real devices, not just the emulator.",
    detail:
      "Startup time, jank, memory and APK size treated as features. Android Studio Profiler, Baseline Profiles, R8 shrinking, and JUnit coverage over the logic that matters — measured on low-end hardware, not a flagship.",
    tags: ["Profiling", "Baseline Profiles", "R8", "JUnit"],
  },
] as const;

/* --------------------------------------------------------------------- stack */

export type StackLevel = "core" | "strong" | "working";

export type StackGroup = {
  id: string;
  icon: string;
  title: string;
  caption: string;
  items: { name: string; level: StackLevel }[];
};

/** Groups mirror how the work is actually organised. [OWNER] + [LINKEDIN] */
export const stackGroups: StackGroup[] = [
  {
    id: "mobile-core",
    icon: "smartphone",
    title: "Mobile Core",
    caption: "The languages and UI layer",
    items: [
      { name: "Kotlin", level: "core" },
      { name: "Java", level: "core" },
      { name: "Jetpack Compose", level: "core" },
      { name: "MVVM / MVI", level: "core" },
      { name: "Dependency Injection", level: "core" },
      { name: "Dart", level: "strong" },
      { name: "Swift", level: "working" },
    ],
  },
  {
    id: "android-deep",
    icon: "cpu",
    title: "Android Deep-Dive",
    caption: "The runtime, data and platform APIs",
    items: [
      { name: "Coroutines", level: "core" },
      { name: "Flow", level: "core" },
      { name: "Retrofit", level: "core" },
      { name: "Room DB", level: "core" },
      { name: "Firebase", level: "core" },
      { name: "Performance Tuning", level: "strong" },
      { name: "Security SDKs", level: "strong" },
    ],
  },
  {
    id: "cloud",
    icon: "cloud",
    title: "Cloud & Backend",
    caption: "What the app talks to",
    items: [
      { name: "AWS Amplify", level: "strong" },
      { name: "AWS Cognito", level: "strong" },
      { name: "AWS Lambda", level: "strong" },
      { name: "DynamoDB", level: "strong" },
      { name: "REST APIs", level: "core" },
      { name: "SQL", level: "strong" },
    ],
  },
  {
    id: "tools",
    icon: "terminal",
    title: "Tools & DevOps",
    caption: "How it gets built and released",
    items: [
      { name: "Android Studio", level: "core" },
      { name: "Git", level: "core" },
      { name: "Gradle", level: "core" },
      { name: "Google Play Console", level: "core" },
      { name: "CI/CD", level: "strong" },
      { name: "Jenkins", level: "strong" },
      { name: "Docker", level: "working" },
      { name: "JUnit", level: "strong" },
      { name: "Postman", level: "core" },
      { name: "JIRA", level: "core" },
    ],
  },
];

/* ---------------------------------------------------------------------- apps */

export type AppScreen =
  | "blocklist"
  | "chat"
  | "resize"
  | "inspect"
  | "map"
  | "calc"
  | "game"
  | "notes";

export type PlayApp = {
  id: string;
  index: string;
  name: string;
  category: string;
  description: string;
  installs: string;
  packageId: string;
  href: string;
  icon: string;
  /** Dominant colour sampled from the real store icon — drives the card's
   *  ambient wash so each app carries its own identity. */
  tint: string;
  /** Which in-device UI mock-up to render for this app. */
  screen: AppScreen;
  /** Feature bullets shown on the expanded card. */
  highlights: readonly string[];
  featured?: boolean;
};

/**
 * All eight live titles under the Smart Codies developer account. [PLAY]
 * Names, categories, descriptions, install counts, package ids and icons are
 * taken verbatim from the Play Store listings.
 */
export const apps: PlayApp[] = [
  {
    id: "callblocker",
    tint: "#1578d6",
    screen: "blocklist",
    index: "01",
    name: "Call Blocker Plus",
    category: "Tools",
    description:
      "Block unknown, private, and unwanted calls with advanced smart-blocking rules that keep spam off your phone.",
    installs: "1K+",
    packageId: "com.smartcodies.callblocker",
    href: "https://play.google.com/store/apps/details?id=com.smartcodies.callblocker",
    icon: "/apps/callblocker.webp",
    highlights: ["Call screening APIs", "Rule-based blocking", "Background service"],
    featured: true,
  },
  {
    id: "autoreply",
    tint: "#1a5cd6",
    screen: "chat",
    index: "02",
    name: "Auto Reply Messanger",
    category: "Communication",
    description:
      "Automatically reply to messages when you're busy, driving, or away, across your favorite messaging apps.",
    installs: "1K+",
    packageId: "com.smartcodies.autoreplymessenger",
    href: "https://play.google.com/store/apps/details?id=com.smartcodies.autoreplymessenger",
    icon: "/apps/autoreplymessenger.webp",
    highlights: ["Notification listener", "Per-app rules", "Scheduling"],
    featured: true,
  },
  {
    id: "photoresizer",
    tint: "#18cae8",
    screen: "resize",
    index: "03",
    name: "Photo Resizer: Reduce Size",
    category: "Photography",
    description:
      "Resize photos, compress file size, and remove backgrounds without losing quality, including passport photos.",
    installs: "1K+",
    packageId: "com.smartcodies.resizephotoandbackgroundremover",
    href: "https://play.google.com/store/apps/details?id=com.smartcodies.resizephotoandbackgroundremover",
    icon: "/apps/photoresizer.webp",
    highlights: ["On-device processing", "Background removal", "Batch compression"],
    featured: true,
  },
  {
    id: "appinspector",
    tint: "#482ca4",
    screen: "inspect",
    index: "04",
    name: "AppInspector: APK Analyzer",
    category: "Developer Tools",
    description:
      "Analyze installed SDKs, export APKs, and audit app permissions and technical details on your device.",
    installs: "100+",
    packageId: "com.smartcodies.appanalyzer",
    href: "https://play.google.com/store/apps/details?id=com.smartcodies.appanalyzer",
    icon: "/apps/appinspector.webp",
    highlights: ["Package manager APIs", "SDK detection", "APK export"],
  },
  {
    id: "findnearme",
    tint: "#107835",
    screen: "map",
    index: "05",
    name: "Find Near Me Places",
    category: "Travel & Local",
    description: "Discover popular places and services near you in just a few simple steps.",
    installs: "100+",
    packageId: "com.smartcodies.findnearme",
    href: "https://play.google.com/store/apps/details?id=com.smartcodies.findnearme",
    icon: "/apps/findnearme.webp",
    highlights: ["Location services", "Places API", "Map integration"],
  },
  {
    id: "calculator",
    tint: "#3a78ea",
    screen: "calc",
    index: "06",
    name: "Smart Calculator – GST EMI",
    category: "Finance",
    description:
      "An all-in-one calculator for GST, EMI, SIP, currency conversion, and everyday financial calculations.",
    installs: "10+",
    packageId: "com.smartcodies.calculatorformultipurpose",
    href: "https://play.google.com/store/apps/details?id=com.smartcodies.calculatorformultipurpose",
    icon: "/apps/calculator.webp",
    highlights: ["Live currency rates", "Financial formulas", "Offline-first"],
  },
  {
    id: "snakearena",
    tint: "#0e5389",
    screen: "game",
    index: "07",
    name: "Snake Arena: Slither.io Battle",
    category: "Games",
    description:
      "A fast-paced multiplayer snake arena. Slither, grow, and battle players from around the world.",
    installs: "10+",
    packageId: "com.smartcodies.snakeio.android",
    href: "https://play.google.com/store/apps/details?id=com.smartcodies.snakeio.android",
    icon: "/apps/snakearena.webp",
    highlights: ["Real-time multiplayer", "Custom game loop", "Canvas rendering"],
  },
  {
    id: "papernote",
    tint: "#d99a05",
    screen: "notes",
    index: "08",
    name: "PaperNote: Notepad & Notes",
    category: "Productivity",
    description:
      "A simple, focused notepad for notes, checklists, to-do lists, sketches, and locked private notes.",
    installs: "New",
    packageId: "com.smartcodies.papernote",
    href: "https://play.google.com/store/apps/details?id=com.smartcodies.papernote",
    icon: "/apps/papernote.webp",
    highlights: ["Room DB", "Biometric lock", "Sketch canvas"],
  },
];

/* ---------------------------------------------------------------- experience */

/**
 * Company, role and responsibilities come from LinkedIn; the Smart Codies
 * entry is verifiable on Google Play. `period` accepts any label — swap
 * "Present" for "2022 — Present" once you want the start year shown.
 */
export const experience = [
  {
    period: "Present",
    role: "Android Developer",
    company: "Invica Infotech", // [LINKEDIN]
    location: "Gujarat, India",
    icon: "briefcase",
    description:
      "Building scalable Android applications in Kotlin and Java — MVVM and Clean Architecture, Jetpack Compose UI, Room DB and REST API integration.",
    highlights: [
      "Android development with Kotlin, Java and the Android SDK.",
      "AWS integration — Amplify, Cognito, Lambda and DynamoDB — alongside SQL databases.",
      "Play Console management, in-app purchases and release operations.",
      "Performance optimisation across the app lifecycle.",
    ],
    stack: ["Kotlin", "Jetpack Compose", "AWS", "Firebase"],
  },
  {
    period: "Ongoing",
    role: "Independent Publisher",
    company: "Smart Codies — Google Play", // [PLAY]
    location: "Surat, Gujarat",
    icon: "store",
    description:
      "Eight published Android applications owned end to end: concept, architecture, UI, store listing, release and ongoing maintenance.",
    highlights: [
      "8 titles live across Tools, Communication, Photography, Finance, Games and Productivity.",
      "3K+ total downloads and 1K+ active users.",
      "Full Play Console ownership — signing, rollouts, policy compliance and ASO.",
      "Every app maintained and updated after launch.",
    ],
    stack: ["Kotlin", "Room DB", "Firebase", "Play Billing"],
  },
] as const;

/** Applications built in professional roles. [LINKEDIN] */
export const clientWork = {
  label: "Also built in professional roles",
  items: [
    "Contacts",
    "AI Image & Video Generator with Chat",
    "Video Player",
    "Translator",
    "Currency Converter",
    "Notepad & Notes",
    "ChatNotes",
  ],
} as const;

export const education = {
  institution: "Gujarat Technological University", // [LINKEDIN]
  short: "GTU",
  location: "Gujarat, India",
} as const;

/* ------------------------------------------------------------------- process */

export const process = [
  {
    index: "01",
    icon: "target",
    title: "Scope",
    body: "What the app is for, who opens it, and which Android versions and devices have to be supported. Store policy is checked here, not at submission.",
  },
  {
    index: "02",
    icon: "layout",
    title: "Architect",
    body: "Module structure, MVVM layers, data sources and navigation graph. Room schema and API contracts are agreed before a screen gets built.",
  },
  {
    index: "03",
    icon: "code",
    title: "Build",
    body: "Feature by feature in Jetpack Compose, wired through ViewModels and repositories. Coroutines and Flow for anything asynchronous.",
  },
  {
    index: "04",
    icon: "gauge",
    title: "Test & profile",
    body: "JUnit over the logic, manual passes on real low-end hardware, and the Android Studio Profiler on startup, memory and jank before release.",
  },
  {
    index: "05",
    icon: "rocket",
    title: "Release",
    body: "Signed bundle, Play Console listing, staged rollout, Crashlytics watched. Then the part most people skip — the updates after launch.",
  },
] as const;

/* ------------------------------------------------------------------- contact */

export const contact = {
  eyebrow: "Open for collaboration",
  heading: ["Have an app", "to build?"],
  body: "Tell me about the product — the platform, the scope and the timeline. Android, Flutter or a store release that needs rescuing.",
  channels: [
    {
      label: "Email",
      value: links.email,
      href: `mailto:${links.email}`,
      icon: "mail",
      external: false,
    },
    {
      label: "LinkedIn",
      value: "bhavin-solanki",
      href: links.linkedin,
      icon: "linkedin",
      external: true,
    },
    {
      label: "Google Play",
      value: "Smart Codies",
      href: links.playStore,
      icon: "store",
      external: true,
    },
    { label: "GitHub", value: "@bhavien", href: links.github, icon: "github", external: true },
  ],
} as const;

export const footer = {
  note: "Designed and built from scratch — no template, no page builder.",
  colophon: "Next.js · TypeScript · Tailwind CSS · Framer Motion",
} as const;
