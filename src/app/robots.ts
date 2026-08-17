import type { MetadataRoute } from "next";
import { site } from "@/content/profile";

/** Required by `output: "export"` — emits robots.txt as a build artefact. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    /* Resolved, not concatenated — `site.url` ends in a slash, and template
       interpolation produced `…/bhavin//sitemap.xml`, which Pages does not
       collapse, so the declared sitemap 404'd. */
    sitemap: new URL("sitemap.xml", site.url).toString(),
  };
}
