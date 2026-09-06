import { prisma } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import { Stars } from "@/components/ReviewCard";
import { requireAdmin, publishReview, unpublishReview, deleteReview } from "../actions";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  body: string;
  orderRef: string | null;
  verified: boolean;
  status: "PENDING" | "PUBLISHED";
  createdAt: Date;
};

export default async function AdminReviewsPage() {
  const admin = await requireAdmin();

  let reviews: Row[] = [];
  let dbError = false;
  try {
    reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, take: 300 });
  } catch {
    dbError = true;
  }

  const pending = reviews.filter((r) => r.status === "PENDING");
  const published = reviews.filter((r) => r.status === "PUBLISHED");

  return (
    <AdminShell email={admin.email} active="reviews">
      {dbError ? (
        <div className="card" style={{ padding: 22, background: "#F6EEEE", borderColor: "#E3CCCC" }}>
          <strong>Can&apos;t reach the database.</strong> Check DATABASE_URL and run{" "}
          <code>npx prisma db push</code>.
        </div>
      ) : (
        <>
          <p style={{ fontSize: 14.5, color: "#56544C", margin: "0 0 22px", maxWidth: "70ch" }}>
            Nothing appears on the site until you publish it. Publishing puts a review on the landing
            page and the reviews page; deleting removes it for good.
          </p>

          <Section
            title="Waiting for you"
            count={pending.length}
            empty="No new reviews right now."
            rows={pending}
            tone="pending"
          />

          <div style={{ height: 34 }} />

          <Section
            title="Live on the site"
            count={published.length}
            empty="Nothing published yet."
            rows={published}
            tone="published"
          />
        </>
      )}
    </AdminShell>
  );
}

function Section({
  title,
  count,
  empty,
  rows,
  tone,
}: {
  title: string;
  count: number;
  empty: string;
  rows: Row[];
  tone: "pending" | "published";
}) {
  return (
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <h2 className="serif" style={{ fontSize: 22, margin: 0 }}>
          {title}
        </h2>
        <span style={{ fontSize: 13.5, color: "#86837A" }}>
          {count} review{count === 1 ? "" : "s"}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ padding: 22, color: "#86837A", fontSize: 14.5 }}>
          {empty}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {rows.map((r) => (
            <article key={r.id} className="card pad-card admin-review">
              <div className="admin-review-top">
                <div>
                  <Stars value={r.rating} small />
                  <div style={{ fontWeight: 600, color: "#26251F", marginTop: 8 }}>
                    {r.name}
                    {r.role ? (
                      <span style={{ fontWeight: 400, color: "#86837A" }}> · {r.role}</span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 13, color: "#86837A", marginTop: 4 }}>
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Africa/Tunis",
                    }).format(r.createdAt)}
                    {r.orderRef ? ` · ${r.orderRef}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {r.verified && (
                    <span className="badge" data-tone="paid">
                      VERIFIED CLIENT
                    </span>
                  )}
                  <span className="badge" data-tone={tone === "pending" ? "pending" : "delivered"}>
                    {tone === "pending" ? "NOT PUBLISHED" : "LIVE"}
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.62,
                  color: "#3D3B34",
                  margin: "14px 0 0",
                  whiteSpace: "pre-wrap",
                }}
              >
                {r.body}
              </p>

              <div className="admin-review-actions">
                {tone === "pending" ? (
                  <form action={publishReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="btn btn-yellow" style={{ fontSize: 14 }}>
                      Publish
                    </button>
                  </form>
                ) : (
                  <form action={unpublishReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="btn btn-ghost" style={{ fontSize: 14 }}>
                      Hide from site
                    </button>
                  </form>
                )}
                <form action={deleteReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="btn btn-danger" style={{ fontSize: 14 }}>
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
