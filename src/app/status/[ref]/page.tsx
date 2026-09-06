import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { prisma } from "@/lib/db";
import { BRAND, packLabel } from "@/lib/brand";
import { normalizeRef } from "@/lib/ref";
import { getPaymentInstructions, prettyDate } from "@/lib/schedule";
import ReportView from "@/components/ReportView";

export const dynamic = "force-dynamic";

const STATUS_TEXT: Record<string, string> = {
  NEW: "Received — we are reviewing your file.",
  IN_PROGRESS: "In progress — a recruiter is working on it.",
  DELIVERED: "Delivered — check your inbox.",
  CANCELLED: "Cancelled.",
};

const BOOKING_TEXT: Record<string, string> = {
  PENDING: "Requested — we confirm once payment is received.",
  CONFIRMED: "Confirmed — the link is in your email.",
  COMPLETED: "Done — your feedback report is below.",
  CANCELLED: "Cancelled.",
};

export default async function StatusPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref: raw } = await params;
  const ref = normalizeRef(decodeURIComponent(raw));

  let order = null;
  try {
    order = await prisma.order.findUnique({
      where: { ref },
      include: { booking: { include: { report: true } } },
    });
  } catch {
    order = null;
  }
  if (!order) redirect("/status?notfound=1");

  const payInstructions = await getPaymentInstructions();
  const report = order.booking?.report;
  const showReport = report?.published;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      <SiteHeader />
      <main className="wrap" style={{ paddingTop: 36, paddingBottom: 64, maxWidth: 900 }}>
        <div className="eyebrow">Reference {order.ref}</div>
        <h1
          className="serif"
          style={{ fontSize: "clamp(26px,6vw,42px)", margin: "12px 0 6px", letterSpacing: "-0.02em" }}
        >
          {packLabel(order.pack)}
        </h1>
        <p style={{ fontSize: 16.5, color: "#56544C", margin: 0 }}>
          {order.name} · {order.email}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))",
            gap: 20,
            marginTop: 28,
            alignItems: "start",
          }}
        >
          <section className="card pad-card">
            <h2 className="serif" style={{ fontSize: 21, margin: "0 0 14px" }}>
              Where things stand
            </h2>
            <Row label="File" value={STATUS_TEXT[order.status] ?? order.status} />
            <Row
              label="Payment"
              value={
                order.payment === "PAID"
                  ? `Received — ${order.amountDt} dt`
                  : order.payment === "REFUNDED"
                    ? "Refunded"
                    : `Pending — ${order.amountDt} dt`
              }
            />
            {order.booking && (
              <>
                <Row
                  label="Session"
                  value={`${prettyDate(order.booking.date)}, ${order.booking.time} · ${
                    order.booking.language === "EN" ? "English" : "Français"
                  } · ${BRAND.tzLabel}`}
                />
                <Row label="Status" value={BOOKING_TEXT[order.booking.status] ?? order.booking.status} />
                {order.booking.meetingUrl && order.booking.status === "CONFIRMED" && (
                  <div style={{ marginTop: 16 }}>
                    <a className="btn btn-primary btn-block-sm" href={order.booking.meetingUrl} target="_blank" rel="noreferrer">
                      Join the session
                    </a>
                  </div>
                )}
              </>
            )}
          </section>

          {order.payment !== "PAID" && order.status !== "CANCELLED" && (
            <section
              className="card pad-card"
              style={{ background: "#F1EFE7", borderLeft: "4px solid #FFD22F" }}
            >
              <h2 className="serif" style={{ fontSize: 21, margin: "0 0 12px" }}>
                Paying for this
              </h2>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.62,
                  color: "#3D3B34",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                }}
              >
                {payInstructions}
              </p>
              <p style={{ fontSize: 14, color: "#56544C", marginTop: 14 }}>
                Mention your reference <strong>{order.ref}</strong> when you pay, and write to{" "}
                <a href={`mailto:${BRAND.email}`} style={{ borderBottom: "2px solid #FFD22F" }}>
                  {BRAND.email}
                </a>
                .
              </p>
            </section>
          )}
        </div>

        {showReport && report && order.booking && (
          <div style={{ marginTop: 28 }}>
            <ReportView report={report} booking={order.booking} targetRole={order.targetRole} />
          </div>
        )}

        {order.booking?.status === "COMPLETED" && !showReport && (
          <p style={{ fontSize: 15, color: "#56544C", marginTop: 24 }}>
            Your feedback report is being written. It lands here within 48 hours of the session.
          </p>
        )}

        <p style={{ fontSize: 14, color: "#86837A", marginTop: 32 }}>
          Bookmark this page — it is the live state of your file.{" "}
          <Link href="/" style={{ borderBottom: "2px solid #FFD22F" }}>
            Back to the site
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="kv" style={{ borderTop: "1px solid #EDEBE3" }}>
      <span>{label}</span>
      <span style={{ color: "#26251F" }}>{value}</span>
    </div>
  );
}
