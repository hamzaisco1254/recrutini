import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { packLabel } from "@/lib/brand";
import AdminShell from "@/components/AdminShell";
import { requireAdmin, updateOrder, updateBooking } from "../../actions";
import ReportEditor from "./ReportEditor";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;

  const order = await prisma.order
    .findUnique({ where: { id }, include: { booking: { include: { report: true } } } })
    .catch(() => null);
  if (!order) notFound();

  const b = order.booking;

  return (
    <AdminShell email={admin.email} active="orders">
      <Link href="/admin/orders" style={{ fontSize: 14, color: "#86837A" }}>
        ← All orders
      </Link>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          flexWrap: "wrap",
          margin: "12px 0 4px",
        }}
      >
        <h1 className="serif" style={{ fontSize: "clamp(26px,6vw,32px)", margin: 0, letterSpacing: "-0.02em" }}>
          {order.name}
        </h1>
        <span style={{ fontFamily: "ui-monospace, monospace", color: "#86837A" }}>{order.ref}</span>
      </div>
      <p style={{ color: "#56544C", margin: "0 0 24px" }}>
        {packLabel(order.pack)} · {order.amountDt} dt · {order.email}
        {order.phone ? ` · ${order.phone}` : ""}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))",
          gap: 20,
          alignItems: "start",
        }}
      >
        <section className="card pad-card">
          <h2 className="serif" style={{ fontSize: 22, margin: "0 0 18px" }}>
            The file
          </h2>
          <form action={updateOrder} style={{ display: "grid", gap: 14 }}>
            <input type="hidden" name="id" value={order.id} />
            <div>
              <label className="lbl">Status</label>
              <select className="field" name="status" defaultValue={order.status}>
                {["NEW", "IN_PROGRESS", "DELIVERED", "CANCELLED"].map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl">Payment</label>
              <select className="field" name="payment" defaultValue={order.payment}>
                {["UNPAID", "PAID", "REFUNDED"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl">Internal notes</label>
              <textarea className="field" name="adminNotes" rows={4} defaultValue={order.adminNotes ?? ""} />
            </div>
            <button className="btn btn-primary btn-block-sm">Save</button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid #EDEBE3" }}>
            <h3 className="eyebrow">What the client sent</h3>
            {order.isStudent && (
              <div className="student-proof">
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span className="badge" data-tone="student">
                    STUDENT — FREE
                  </span>
                  {order.studentCardUrl && (
                    <a
                      href={order.studentCardUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost"
                      style={{ fontSize: 13, padding: "8px 14px", minHeight: 0 }}
                    >
                      Open student card
                    </a>
                  )}
                </div>
                {order.studentCardUrl && /\.(jpe?g|png|webp|heic)$/i.test(order.studentCardUrl) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={order.studentCardUrl}
                    alt="Student card submitted with this booking"
                    className="student-proof-img"
                  />
                )}
              </div>
            )}
            <Detail label="Target role" value={order.targetRole} />
            <Detail label="CV link" value={order.cvLink} link />
            <Detail label="LinkedIn" value={order.linkedinUrl} link />
            <Detail label="Job posting" value={order.jobPostingUrl} link />
            <Detail label="Notes" value={order.notes} />
            <Detail
              label="Received"
              value={new Intl.DateTimeFormat("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Africa/Tunis",
              }).format(order.createdAt)}
            />
            <Detail label="Client page" value={`/status/${order.ref}`} internal />
          </div>
        </section>

        {b && (
          <section className="card pad-card">
            <h2 className="serif" style={{ fontSize: 22, margin: "0 0 18px" }}>
              The session
            </h2>
            <form action={updateBooking} style={{ display: "grid", gap: 14 }}>
              <input type="hidden" name="bookingId" value={b.id} />
              <input type="hidden" name="orderId" value={order.id} />
              <div className="two-col">
                <div>
                  <label className="lbl">Date</label>
                  <input className="field" name="date" type="date" defaultValue={b.date} />
                </div>
                <div>
                  <label className="lbl">Time</label>
                  <input className="field" name="time" type="time" defaultValue={b.time} />
                </div>
              </div>
              <div className="two-col">
                <div>
                  <label className="lbl">Language</label>
                  <select className="field" name="language" defaultValue={b.language}>
                    <option value="EN">English</option>
                    <option value="FR">Français</option>
                  </select>
                </div>
                <div>
                  <label className="lbl">Status</label>
                  <select className="field" name="bookingStatus" defaultValue={b.status}>
                    {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="lbl">Meeting link (Meet / Zoom)</label>
                <input className="field" name="meetingUrl" defaultValue={b.meetingUrl ?? ""} />
              </div>
              <button className="btn btn-primary btn-block-sm">Save session</button>
            </form>
          </section>
        )}
      </div>

      {b && (
        <div style={{ marginTop: 20 }}>
          <ReportEditor bookingId={b.id} orderId={order.id} report={b.report} />
        </div>
      )}
    </AdminShell>
  );
}

function Detail({
  label,
  value,
  link,
  internal,
}: {
  label: string;
  value?: string | null;
  link?: boolean;
  internal?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="kv" style={{ fontSize: 14.5 }}>
      <span>{label}</span>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#26251F", borderBottom: "2px solid #FFD22F", wordBreak: "break-all" }}
        >
          {value}
        </a>
      ) : internal ? (
        <Link href={value} style={{ color: "#26251F", borderBottom: "2px solid #FFD22F" }}>
          {value}
        </Link>
      ) : (
        <span style={{ color: "#26251F", whiteSpace: "pre-wrap" }}>{value}</span>
      )}
    </div>
  );
}
