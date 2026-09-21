import { t, type Locale } from "@/lib/i18n";

export type PublicReview = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  body: string;
  verified: boolean;
  createdAt: Date;
};

export function Stars({ value, small = false, locale = "en" }: { value: number; small?: boolean; locale?: Locale }) {
  return (
    <span className={`stars${small ? " stars-sm" : ""}`} aria-label={`${value} ${t(locale).reviewsPage.outOf}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" data-on={n <= value}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewCard({ review, locale = "en" }: { review: PublicReview; locale?: Locale }) {
  const when = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "Africa/Tunis",
  }).format(review.createdAt);

  return (
    <figure className="review">
      <Stars value={review.rating} locale={locale} />
      <blockquote className="review-body">{review.body}</blockquote>
      <figcaption className="review-by">
        <span className="review-name">{review.name}</span>
        {review.role ? <span className="review-role">{review.role}</span> : null}
        <span className="review-meta">
          {when}
          {review.verified ? (
            <>
              {" · "}
              <span className="review-verified">{t(locale).reviewsPage.verified}</span>
            </>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}
