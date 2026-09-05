import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BRAND, PACKS, type PackKey } from "@/lib/brand";
import { buildCalendar } from "@/lib/schedule";
import BookingForm from "./BookingForm";

export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ pack?: string }>;
}) {
  const { pack } = await searchParams;
  const initialPack: PackKey =
    pack && pack.toUpperCase() in PACKS ? (pack.toUpperCase() as PackKey) : "FULL";

  let days: Awaited<ReturnType<typeof buildCalendar>> = [];
  let dbError = false;
  try {
    days = await buildCalendar();
  } catch {
    dbError = true;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      <SiteHeader />
      <main className="wrap" style={{ paddingTop: 44, paddingBottom: 80, maxWidth: 820 }}>
        <div className="eyebrow">Booking</div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(30px,3.4vw,44px)",
            letterSpacing: "-0.02em",
            margin: "12px 0 8px",
          }}
        >
          Book your session
        </h1>
        <p style={{ fontSize: 17, color: "#56544C", maxWidth: "56ch", margin: "0 0 28px" }}>
          Choose a pack, pick your slot if it includes the interview, and tell us who you are. You
          get a reference code to follow your file.
        </p>

        {dbError && (
          <div
            className="card"
            style={{ padding: 20, marginBottom: 20, borderColor: "#E3CCCC", background: "#F6EEEE" }}
          >
            <strong>The database isn&apos;t reachable.</strong> Set DATABASE_URL in your environment
            and run <code>npx prisma db push</code>.
          </div>
        )}

        <BookingForm days={days} initialPack={initialPack} tzLabel={BRAND.tzLabel} />
      </main>
      <SiteFooter />
    </div>
  );
}
