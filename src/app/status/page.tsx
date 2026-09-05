import { redirect } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { normalizeRef } from "@/lib/ref";

export const dynamic = "force-dynamic";

async function lookup(formData: FormData) {
  "use server";
  const ref = normalizeRef(String(formData.get("ref") ?? ""));
  redirect(`/status/${encodeURIComponent(ref)}`);
}

export default async function StatusLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ notfound?: string }>;
}) {
  const { notfound } = await searchParams;
  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2", display: "flex", flexDirection: "column" }}>
      <SiteHeader />
      <main className="wrap" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 560, flex: 1 }}>
        <div className="eyebrow">Your file</div>
        <h1
          className="serif"
          style={{ fontSize: "clamp(28px,3vw,40px)", margin: "12px 0 8px", letterSpacing: "-0.02em" }}
        >
          Track your order
        </h1>
        <p style={{ fontSize: 16.5, color: "#56544C", margin: "0 0 24px" }}>
          Enter the reference code from your confirmation, for example RC-ABC-234.
        </p>
        <form action={lookup} className="card" style={{ padding: 24, display: "grid", gap: 14 }}>
          <div>
            <label className="lbl">Reference code</label>
            <input className="field" name="ref" required placeholder="RC-ABC-234" autoFocus />
          </div>
          {notfound && (
            <div style={{ fontSize: 14.5, color: "#8A3B3B" }}>
              We couldn&apos;t find that reference. Check the code, or write to us.
            </div>
          )}
          <button className="btn btn-primary" type="submit">
            Open my file
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
