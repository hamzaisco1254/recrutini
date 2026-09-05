import Link from "next/link";
import { prisma } from "@/lib/db";
import { packLabel } from "@/lib/brand";
import { prettyDate, nowInTz } from "@/lib/schedule";
import AdminShell from "@/components/AdminShell";
import { requireAdmin, markPaid } from "../actions";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unpaid", label: "Awaiting payment" },
  { key: "upcoming", label: "Upcoming sessions" },
  { key: "active", label: "In progress" },
  { key: "done", label: "Delivered" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const admin = await requireAdmin();
  const { filter = "all" } = await searchParams;
  const today = nowInTz().date;

  const where =
    filter === "unpaid"
      ? { payment: "UNPAID" as const, status: { not: "CANCELLED" as const } }
      : filter === "active"
        ? { status: "IN_PROGRESS" as const }
        : filter === "done"
          ? { status: "DELIVERED" as const }
          : filter === "upcoming"
            ? { booking: { is: { date: { gte: today }, status: { not: "CANCELLED" as const } } } }
            : {};

  let orders: Awaited<ReturnType<typeof loadOrders>> = [];
  let dbError = false;
  try {
    orders = await loadOrders(where);
  } catch {
    dbError = true;
  }

  const counts = { total: orders.length };

  return (
    <AdminShell email={admin.email} active="orders">
      {dbError ? (
        <div className="card" style={{ padding: 22, background: "#F6EEEE", borderColor: "#E3CCCC" }}>
          <strong>Can&apos;t reach the database.</strong> Check DATABASE_URL and run{" "}
          <code>npx prisma db push</code>.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            {FILTERS.map((f) => (
              <Link
                key={f.key}
                href={`/admin/orders?filter=${f.key}`}
                className="badge"
                style={{
                  padding: "7px 13px",
                  fontSize: 13,
                  background: filter === f.key ? "#FFD22F" : "#fff",
                  borderColor: filter === f.key ? "#FFD22F" : "#DCD9CE",
                  color: filter === f.key ? "#111" : "#56544C",
                }}
              >
                {f.label}
              </Link>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 13.5, color: "#86837A" }}>
              {counts.total} record{counts.total === 1 ? "" : "s"}
            </span>
          </div>

          <div className="card scroll-x">
            <table className="data">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Client</th>
                  <th>Pack</th>
                  <th>Session</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: 28, textAlign: "center", color: "#86837A" }}>
                      Nothing here yet.
                    </td>
                  </tr>
                )}
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: "ui-monospace, monospace", whiteSpace: "nowrap" }}>
                      <Link href={`/admin/orders/${o.id}`} style={{ borderBottom: "2px solid #FFD22F" }}>
                        {o.ref}
                      </Link>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#26251F" }}>{o.name}</div>
                      <div style={{ fontSize: 13, color: "#86837A" }}>{o.email}</div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {packLabel(o.pack)}
                      <div style={{ fontSize: 13, color: "#86837A" }}>{o.amountDt} dt</div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {o.booking ? (
                        <>
                          {prettyDate(o.booking.date)}
                          <div style={{ fontSize: 13, color: "#86837A" }}>
                            {o.booking.time} · {o.booking.language}
                          </div>
                        </>
                      ) : (
                        <span style={{ color: "#B5B2A9" }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className="badge" data-tone={o.payment.toLowerCase()}>
                        {o.payment}
                      </span>
                    </td>
                    <td>
                      <span className="badge" data-tone={o.status.toLowerCase().replace("_", "")}>
                        {o.status.replace("_", " ")}
                      </span>
                      {o.booking && (
                        <div style={{ marginTop: 6 }}>
                          <span className="badge" data-tone={o.booking.status.toLowerCase()}>
                            {o.booking.status}
                          </span>
                        </div>
                      )}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {o.payment === "UNPAID" && o.status !== "CANCELLED" && (
                        <form action={markPaid}>
                          <input type="hidden" name="id" value={o.id} />
                          <button className="btn btn-yellow" style={{ fontSize: 13, padding: "8px 14px" }}>
                            Mark paid
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}

async function loadOrders(where: object) {
  return prisma.order.findMany({
    where,
    include: { booking: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}
