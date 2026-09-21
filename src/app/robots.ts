import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // The admin console and a client's own file page must never be indexed.
      // "?lang=" only ever appears on the language control: it redirects to a
      // clean URL, and keeping it out of the index prevents a crawler from
      // treating it as a second address for the same page.
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/status/", "/api/", "/*?lang=", "/*&lang="],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
