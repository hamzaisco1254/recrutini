import type { MetadataRoute } from "next";
import { PACK_LIST, SITE_URL } from "@/lib/brand";

/** Both languages, cross-declared with hreflang so Google serves the right one. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pairs: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"],
    ["/book", 0.9, "weekly"],
    ["/sample-report", 0.8, "monthly"],
    ["/reviews", 0.6, "weekly"],
    ["/legal/privacy", 0.3, "yearly"],
    ["/legal/terms", 0.3, "yearly"],
  ];

  const out: MetadataRoute.Sitemap = [];
  for (const [path, priority, changeFrequency] of pairs) {
    const en = `${SITE_URL}${path || "/"}`;
    const fr = `${SITE_URL}/fr${path}`;
    const languages = { en, fr, "x-default": en };
    out.push({ url: en, lastModified: now, changeFrequency, priority, alternates: { languages } });
    out.push({ url: fr, lastModified: now, changeFrequency, priority: priority * 0.95, alternates: { languages } });
  }
  for (const p of PACK_LIST) {
    out.push({
      url: `${SITE_URL}/book?pack=${p.key}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  return out;
}
