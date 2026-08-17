import {
  Braces,
  Briefcase,
  Calendar,
  Cloud,
  Cpu,
  Database,
  Download,
  Gauge,
  GraduationCap,
  Layers,
  LayoutGrid,
  Mail,
  Rocket,
  Smartphone,
  Target,
  Terminal,
  Users,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import {
  AndroidIcon,
  FirebaseIcon,
  FlutterIcon,
  GitHubIcon,
  GooglePlayIcon,
  IosIcon,
  KotlinIcon,
  LinkedInIcon,
} from "@/components/ui/BrandIcons";

/**
 * Name → component registry.
 *
 * Content in `profile.ts` refers to icons by string, so the data file stays
 * free of JSX and a section can gain an icon without touching a component.
 */
const REGISTRY = {
  android: AndroidIcon,
  apple: IosIcon,
  ios: IosIcon,
  flutter: FlutterIcon,
  kotlin: KotlinIcon,
  firebase: FirebaseIcon,
  store: GooglePlayIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,

  smartphone: Smartphone,
  layout: LayoutGrid,
  layers: Layers,
  gauge: Gauge,
  database: Database,
  cloud: Cloud,
  cpu: Cpu,
  terminal: Terminal,
  download: Download,
  users: Users,
  calendar: Calendar,
  briefcase: Briefcase,
  target: Target,
  code: Braces,
  rocket: Rocket,
  mail: Mail,
  education: GraduationCap,
} as const;

export type IconName = keyof typeof REGISTRY;

export function Icon({
  name,
  className,
  ...props
}: { name: string; className?: string } & Omit<LucideProps, "ref" | "name">) {
  const Component = REGISTRY[name as IconName] as ComponentType<{ className?: string }> | undefined;
  if (!Component) return null;
  return <Component className={className} aria-hidden="true" {...props} />;
}

/**
 * Icon in a soft tile — the recurring "chip" used by section headers, feature
 * rows and metric cards so every icon on the page sits in the same frame.
 */
export function IconTile({
  name,
  className,
  size = "md",
  tone = "ink",
}: {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  tone?: "ink" | "signal";
}) {
  const box =
    size === "sm" ? "size-9 rounded-[3px]" : size === "lg" ? "size-14 rounded-2xl" : "size-11 rounded-xl";
  const glyph = size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-[1.15rem]";
  const skin =
    tone === "signal"
      ? "bg-signal/[0.08] text-signal ring-1 ring-inset ring-signal/15"
      : "bg-ink/[0.045] text-ink-80 ring-1 ring-inset ring-ink/[0.07]";

  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${box} ${skin} ${className ?? ""}`}>
      <Icon name={name} className={glyph} />
    </span>
  );
}
