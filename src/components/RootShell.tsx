import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";
import { BRAND, SITE_URL } from "@/lib/brand";
import { t, type Locale } from "@/lib/i18n";
import { organizationJsonLd, serviceJsonLd } from "@/lib/seo";

// One typeface, four weights. Headlines are the same face set bold, the way
// a consultancy site reads: quiet, geometric, confident.
const sans = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });

/**
 * Site-wide metadata in the language of the tree it sits on. Each language has
 * its own root layout (app/(en) and app/(fr)), which is the only way to give
 * the <html> element the right lang attribute without making every page
 * dynamic; it also keeps the share cards and the title template per language.
 */
export function rootMetadata(locale: Locale): Metadata {
  const c = t(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: c.meta.title, template: `%s | ${BRAND.name}` },
    description: c.meta.description,
    applicationName: BRAND.name,
    keywords: [
      "préparation entretien Tunisie",
      "entretien blanc Tunisie",
      "refaire son CV Tunisie",
      "CV review Tunisie",
      "optimisation LinkedIn Tunisie",
      "coaching carrière Tunisie",
      "CV étudiant PFE",
      "interview preparation Tunisia",
      "postuler en Allemagne depuis la Tunisie",
    ],
    authors: [{ name: "Hamza Dhia Mrabet" }],
    creator: "Hamza Dhia Mrabet",
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_TN" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US", "ar_TN"] : ["fr_TN", "ar_TN"],
      url: SITE_URL,
      siteName: BRAND.name,
      title: c.meta.title,
      description: c.meta.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${BRAND.name}, ${c.common.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.meta.title,
      description: c.meta.description,
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    category: "career services",
    // Set NEXT_PUBLIC_GSC_VERIFICATION in Vercel to verify Search Console.
    verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
      : undefined,
  };
}

export const rootViewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={sans.variable} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd()) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
