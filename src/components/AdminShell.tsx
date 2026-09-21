import Link from "next/link";
import { Logo } from "./SiteChrome";
import { logout } from "@/server/admin";

export default function AdminShell({
  email,
  active,
  children,
}: {
  email: string;
  active: "orders" | "schedule" | "reviews";
  children: React.ReactNode;
}) {
  const tab = (key: "orders" | "schedule" | "reviews", href: string, label: string) => (
    <Link
      href={href}
      style={{
        fontSize: 14.5,
        fontWeight: 600,
        padding: "10px 16px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        border: `1px solid ${active === key ? "#111" : "#DCD9CE"}`,
        background: active === key ? "#111" : "transparent",
        color: active === key ? "#fff" : "#56544C",
      }}
    >
      {label}
    </Link>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      <header
        style={{
          background: "#111",
          color: "#E6E4DC",
          borderBottom: "4px solid #FFD22F",
        }}
      >
        <div
          className="wrap"
          style={{
            paddingTop: 16,
            paddingBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/admin/orders"
            style={{ marginRight: "auto", display: "inline-flex", padding: "6px 0" }}
          >
            <Logo dark />
          </Link>
          <span style={{ fontSize: 13, color: "#A9A69C" }} className="hide-sm">
            {email}
          </span>
          <Link
            href="/"
            style={{ fontSize: 13.5, color: "#A9A69C", padding: "10px 0", whiteSpace: "nowrap" }}
          >
            View site
          </Link>
          <form action={logout}>
            <button
              className="btn"
              style={{
                border: "1px solid #4A4A4A",
                background: "transparent",
                color: "#E6E4DC",
                fontSize: 13,
                padding: "9px 14px",
                minHeight: 40,
                whiteSpace: "nowrap",
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <nav className="rail" style={{ marginBottom: 20 }}>
          {tab("orders", "/admin/orders", "Orders & bookings")}
          {tab("reviews", "/admin/reviews", "Reviews")}
        {tab("schedule", "/admin/schedule", "Availability & payment")}
        </nav>
        {children}
      </div>
    </div>
  );
}
