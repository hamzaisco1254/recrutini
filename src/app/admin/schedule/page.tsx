import { prisma } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import { getAvailability, getPaymentInstructions } from "@/lib/schedule";
import { requireAdmin, saveAvailability, addBlackout, removeBlackout } from "../actions";

export const dynamic = "force-dynamic";

const DAYS = [
  { i: 0, name: "Sunday" },
  { i: 1, name: "Monday" },
  { i: 2, name: "Tuesday" },
  { i: 3, name: "Wednesday" },
  { i: 4, name: "Thursday" },
  { i: 5, name: "Friday" },
  { i: 6, name: "Saturday" },
];

export default async function AdminSchedulePage() {
  const admin = await requireAdmin();
  const [availability, payment, blackouts] = await Promise.all([
    getAvailability(),
    getPaymentInstructions(),
    prisma.blackout.findMany({ orderBy: { date: "asc" } }).catch(() => []),
  ]);

  return (
    <AdminShell email={admin.email} active="schedule">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
          gap: 20,
          alignItems: "start",
        }}
      >
        <form action={saveAvailability} className="card" style={{ padding: 26 }}>
          <h2 className="serif" style={{ fontSize: 22, margin: "0 0 8px" }}>
            Weekly availability
          </h2>
          <p style={{ fontSize: 14.5, color: "#56544C", margin: "0 0 20px" }}>
            Times in 24h format, comma separated. Leave a day empty to close it.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {DAYS.map((d) => (
              <div key={d.i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ width: 92, flex: "none", fontSize: 14.5, color: "#56544C" }}>
                  {d.name}
                </span>
                <input
                  className="field"
                  name={`day-${d.i}`}
                  defaultValue={(availability.weekdays[String(d.i)] ?? []).join(", ")}
                  placeholder="09:00, 11:30, 14:00"
                />
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 20,
            }}
          >
            <div>
              <label className="lbl">Days visible ahead</label>
              <input
                className="field"
                name="horizonDays"
                type="number"
                min={1}
                max={90}
                defaultValue={availability.horizonDays}
              />
            </div>
            <div>
              <label className="lbl">Minimum notice (hours)</label>
              <input
                className="field"
                name="leadHours"
                type="number"
                min={0}
                max={240}
                defaultValue={availability.leadHours}
              />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <label className="lbl">Payment instructions shown to clients</label>
            <textarea className="field" name="paymentInstructions" rows={8} defaultValue={payment} />
          </div>

          <button className="btn btn-primary" style={{ marginTop: 20 }}>
            Save
          </button>
        </form>

        <section className="card" style={{ padding: 26 }}>
          <h2 className="serif" style={{ fontSize: 22, margin: "0 0 8px" }}>
            Days off
          </h2>
          <p style={{ fontSize: 14.5, color: "#56544C", margin: "0 0 18px" }}>
            Block a specific date — holidays, travel, anything.
          </p>
          <form action={addBlackout} style={{ display: "flex", gap: 10 }}>
            <input className="field" name="date" type="date" required />
            <button className="btn btn-ghost" style={{ flex: "none" }}>
              Block
            </button>
          </form>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column" }}>
            {blackouts.length === 0 && (
              <span style={{ fontSize: 14.5, color: "#86837A" }}>No days blocked.</span>
            )}
            {blackouts.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderTop: "1px solid #EDEBE3",
                  fontSize: 15,
                }}
              >
                <span style={{ marginRight: "auto" }}>{b.date}</span>
                <form action={removeBlackout}>
                  <input type="hidden" name="id" value={b.id} />
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 13, padding: "7px 12px" }}
                  >
                    Unblock
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
