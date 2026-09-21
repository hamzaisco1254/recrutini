import { BRAND, FOUNDER, PACK_LIST, SITE_URL } from "./brand";

/**
 * Structured data. Google reads these to decide whether Recrutini is a real
 * business with real services and a real person behind it — which is the same
 * question a visitor asks, so the answers are the same ones on the page.
 */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND.name,
    url: SITE_URL,
    email: BRAND.email,
    description:
      "Interview practice, CV and LinkedIn rewriting for candidates in Tunisia, run by a recruiter with 800+ interviews conducted across the MENA region, Germany, Spain and France.",
    areaServed: [
      { "@type": "Country", name: "Tunisia" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Spain" },
      { "@type": "Country", name: "France" },
    ],
    availableLanguage: ["fr", "en", "ar"],
    address: { "@type": "PostalAddress", addressLocality: "Tunis", addressCountry: "TN" },
    founder: {
      "@type": "Person",
      name: FOUNDER.name,
      jobTitle: FOUNDER.role,
      sameAs: [FOUNDER.linkedin],
      alumniOf: FOUNDER.credentials.map((c) => ({ "@type": "EducationalOrganization", name: c.org })),
    },
    priceRange: `${Math.min(...PACK_LIST.map((p) => p.price))}–${Math.max(
      ...PACK_LIST.map((p) => p.price),
    )} TND`,
    sameAs: [FOUNDER.linkedin],
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `${BRAND.name} packs`,
    url: `${SITE_URL}/#packs`,
    itemListElement: PACK_LIST.map((p, i) => ({
      "@type": "Offer",
      position: i + 1,
      name: p.title,
      description: p.bullets.join(". "),
      price: p.price,
      priceCurrency: "TND",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/book?pack=${p.key}`,
      seller: { "@id": `${SITE_URL}/#organization` },
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}
