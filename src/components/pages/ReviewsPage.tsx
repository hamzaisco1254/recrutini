import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { prisma } from "@/lib/db";
import ReviewForm from "@/components/ReviewForm";
import ReviewCard, { type PublicReview } from "@/components/ReviewCard";
import { localePath, t, type Locale } from "@/lib/i18n";

export function reviewsMetadata(locale: Locale): Metadata {
  const c = t(locale).reviewsPage;
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: {
      canonical: localePath(locale, "/reviews"),
      languages: { en: "/reviews", fr: "/fr/reviews", "x-default": "/reviews" },
    },
  };
}

export default async function ReviewsPage({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Promise<{ ref?: string }>;
}) {
  const c = t(locale).reviewsPage;
  const { ref } = await searchParams;

  let reviews: PublicReview[] = [];
  try {
    reviews = await prisma.review.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: { id: true, name: true, role: true, rating: true, body: true, verified: true, createdAt: true },
    });
  } catch {
    reviews = [];
  }

  const average =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      <SiteHeader locale={locale} />
      <main className="wrap" style={{ paddingTop: 36, paddingBottom: 64, maxWidth: 900 }}>
        <div className="eyebrow">{c.eyebrow}</div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(26px,6vw,42px)",
            margin: "12px 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          {c.h1}
        </h1>
        <p style={{ fontSize: 17, color: "#56544C", maxWidth: "56ch", margin: "0 0 8px" }}>{c.lead}</p>
        {average !== null && (
          <p style={{ fontSize: 15, color: "#56544C", margin: "0 0 4px" }}>
            {c.average(average.toFixed(1).replace(".", locale === "fr" ? "," : "."), reviews.length)}
          </p>
        )}

        <div style={{ marginTop: 28 }}>
          <ReviewForm initialRef={ref ?? ""} locale={locale} />
        </div>

        {reviews.length > 0 && (
          <>
            <h2 className="serif" style={{ fontSize: 26, margin: "48px 0 20px" }}>
              {c.listTitle}
            </h2>
            <div className="review-grid">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} locale={locale} />
              ))}
            </div>
          </>
        )}
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
