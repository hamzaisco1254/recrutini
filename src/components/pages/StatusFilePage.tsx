import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { prisma } from "@/lib/db";
import { BRAND, languageLabel } from "@/lib/brand";
import { normalizeRef } from "@/lib/ref";
import { getPaymentInstructions, prettyDate } from "@/lib/schedule";
import ReportView from "@/components/ReportView";
import BankDetails from "@/components/BankDetails";
import { hasTrackAccess } from "@/lib/track";
import { getAdmin } from "@/lib/auth";
import { localePath, packTitle, t, type Locale } from "@/lib/i18n";

export default async function StatusFilePage({
  locale,
  params,
}: {
  locale: Locale;
  params: Promise<{ ref: string }>;
}) {
  const c = t(locale).status;
  const { ref: raw } = await params;
  const ref = normalizeRef(decodeURIComponent(raw));

  // A reference alone never opens a file: the visitor must have proved, at
  // /status, that they know the email it was booked with. Admins get in too.
  const allowed = (await hasTrackAccess(ref)) || Boolean(await getAdmin());
  if (!allowed) redirect(localePath(locale, `/status?r=${encodeURIComponent(ref)}`));

  let order = null;
  try {
    order = await prisma.order.findUnique({
      where: { ref },
      include: { booking: { include: { report: true } } },
    });
  } catch {
    order = null;
  }
  if (!order) redirect(localePath(locale, "/status?e=1"));

  const payInstructions = await getPaymentInstructions(locale);
  const report = order.booking?.report;
  const showReport = report?.published;

  const paymentValue =
    order.amountDt === 0
      ? c.payFree
      : order.payment === "PAID"
        ? `${c.payReceived} · ${order.amountDt} dt`
        : order.payment === "REFUNDED"
          ? c.payRefunded
          : `${c.payPending} · ${order.amountDt} dt`;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      <SiteHeader locale={locale} />
      <main className="wrap" style={{ paddingTop: 36, paddingBottom: 64, maxWidth: 900 }}>
        <div className="eyebrow">
          {c.fileEyebrow} {order.ref}
        </div>
        <h1
          className="serif"
          style={{ fontSize: "clamp(26px,6vw,42px)", margin: "12px 0 6px", letterSpacing: "-0.02em" }}
        >
          {packTitle(order.pack, locale)}
        </h1>
        <p style={{ fontSize: 16.5, color: "#56544C", margin: 0 }}>
          {order.name} · {order.email}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
            marginTop: 32,
            alignItems: "start",
          }}
        >
          <section className="card pad-card">
            <h2 className="serif" style={{ fontSize: 21, margin: "0 0 14px" }}>
              {c.where}
            </h2>
            <Row label={c.file} value={c.orderStatus[order.status] ?? order.status} />
            <Row label={c.payment} value={paymentValue} />
            {order.booking && (
              <>
                <Row
                  label={c.session}
                  value={`${prettyDate(order.booking.date, locale)}, ${order.booking.time} · ${languageLabel(
                    order.booking.language,
                  )} · ${BRAND.tzLabel}`}
                />
                <Row label={c.state} value={c.bookingStatus[order.booking.status] ?? order.booking.status} />
                {order.booking.meetingUrl && order.booking.status === "CONFIRMED" && (
                  <div style={{ marginTop: 16 }}>
                    <a className="btn btn-primary btn-block-sm" href={order.booking.meetingUrl} target="_blank" rel="noreferrer">
                      {c.join}
                    </a>
                  </div>
                )}
              </>
            )}
          </section>

          {order.payment !== "PAID" && order.amountDt > 0 && order.status !== "CANCELLED" && (
            <section
              className="card pad-card"
              style={{ background: "#F1EFE7", borderLeft: "4px solid #FFD22F" }}
            >
              <h2 className="serif" style={{ fontSize: 21, margin: "0 0 12px" }}>
                {c.payTitle}
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
              <BankDetails amountDt={order.amountDt} reference={order.ref} locale={locale} />
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#56544C", marginTop: 16 }}>
                {c.payNote1} <strong>{order.ref}</strong> {c.payNote2}{" "}
                <a href={`mailto:${BRAND.email}`} style={{ borderBottom: "2px solid #FFD22F" }}>
                  {BRAND.email}
                </a>
                .
              </p>
            </section>
          )}
        </div>

        {order.isStudent && order.status !== "CANCELLED" && (
          <section
            className="card pad-card"
            style={{
              marginTop: 20,
              background: "#F1EFE7",
              borderLeft: "4px solid #FFD22F",
            }}
          >
            <h2 className="serif" style={{ fontSize: 21, margin: "0 0 10px" }}>
              {c.studentTitle}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.62, color: "#3D3B34", margin: 0 }}>
              {c.studentBody} {order.email}.
            </p>
          </section>
        )}

        {showReport && report && order.booking && (
          <div style={{ marginTop: 28 }}>
            <ReportView report={report} booking={order.booking} targetRole={order.targetRole} locale={locale} />
          </div>
        )}

        {order.booking?.status === "COMPLETED" && !showReport && (
          <p style={{ fontSize: 15, color: "#56544C", marginTop: 24 }}>{c.reportSoon}</p>
        )}

        {(order.status === "DELIVERED" || order.booking?.status === "COMPLETED") && (
          <section
            className="card pad-card"
            style={{ marginTop: 24, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}
          >
            <div>
              <h2 className="serif" style={{ fontSize: 21, margin: "0 0 6px" }}>
                {c.howTitle}
              </h2>
              <p style={{ fontSize: 15, color: "#56544C", margin: 0, maxWidth: "50ch" }}>{c.howBody}</p>
            </div>
            <Link
              href={`${localePath(locale, "/reviews")}?ref=${order.ref}`}
              className="btn btn-primary btn-block-sm"
              style={{ marginLeft: "auto" }}
            >
              {c.leaveReview}
            </Link>
          </section>
        )}

        <p style={{ fontSize: 14, color: "#86837A", marginTop: 32 }}>
          {c.bookmark}{" "}
          <Link href={localePath(locale, "/")} style={{ borderBottom: "2px solid #FFD22F" }}>
            {t(locale).common.backToSite}
          </Link>
        </p>
      </main>
      <SiteFooter locale={locale} />
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
