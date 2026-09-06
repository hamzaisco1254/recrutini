export type PublicReview = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  body: string;
  verified: boolean;
  createdAt: Date;
};

export function Stars({ value, small = false }: { value: number; small?: boolean }) {
  return (
    <span className={`stars${small ? " stars-sm" : ""}`} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" data-on={n <= value}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewCard({ review }: { review: PublicReview }) {
  const when = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "Africa/Tunis",
  }).format(review.createdAt);

  return (
    <figure className="review">
      <Stars value={review.rating} />
      <blockquote className="review-body">{review.body}</blockquote>
      <figcaption className="review-by">
        <span className="review-name">{review.name}</span>
        {review.role ? <span className="review-role">{review.role}</span> : null}
        <span className="review-meta">
          {when}
          {review.verified ? (
            <>
              {" · "}
              <span className="review-verified">Verified client</span>
            </>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}
