import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { prisma } from "@/lib/db";
import ReviewForm from "./ReviewForm";
import ReviewCard, { type PublicReview } from "@/components/ReviewCard";

export const dynamic = "force-dynamic";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
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
      <SiteHeader />
      <main className="wrap" style={{ paddingTop: 36, paddingBottom: 64, maxWidth: 900 }}>
        <div className="eyebrow">Reviews</div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(26px,6vw,42px)",
            margin: "12px 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          How did it go?
        </h1>
        <p style={{ fontSize: 17, color: "#56544C", maxWidth: "56ch", margin: "0 0 8px" }}>
          If we worked on your CV, your LinkedIn or an interview, tell other candidates what it was
          actually like. Good or bad.
        </p>
        {average !== null && (
          <p style={{ fontSize: 15, color: "#56544C", margin: "0 0 4px" }}>
            <strong style={{ color: "#26251F" }}>{average.toFixed(1)} / 5</strong> from{" "}
            {reviews.length} published review{reviews.length === 1 ? "" : "s"}.
          </p>
        )}

        <div style={{ marginTop: 28 }}>
          <ReviewForm initialRef={ref ?? ""} />
        </div>

        {reviews.length > 0 && (
          <>
            <h2 className="serif" style={{ fontSize: 26, margin: "48px 0 20px" }}>
              What candidates said
            </h2>
            <div className="review-grid">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
