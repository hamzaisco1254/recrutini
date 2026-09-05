import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          width: 26,
          height: 26,
          background: dark ? "#fff" : "#111",
          display: "inline-block",
          position: "relative",
          borderRadius: 3,
          flex: "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 5,
            bottom: 5,
            width: 16,
            height: 5,
            background: "#FFD22F",
          }}
        />
      </span>
      <span
        className="serif"
        style={{ fontSize: 21, letterSpacing: "-0.01em", color: dark ? "#fff" : undefined }}
      >
        {BRAND.name}
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(247,246,242,0.93)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #E4E2DA",
      }}
    >
      <div
        className="wrap"
        style={{
          paddingTop: 16,
          paddingBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: "auto" }}>
          <Link href="/">
            <Logo />
          </Link>
          <span
            className="hide-sm"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#86837A",
            }}
          >
            {BRAND.tagline}
          </span>
        </div>
        <nav
          className="hide-sm"
          style={{ display: "flex", gap: 22, fontSize: 14.5, color: "#56544C" }}
        >
          <Link href="/#packs">Packs</Link>
          <Link href="/#process">How it works</Link>
          <Link href="/#interview">Mock interview</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link
            href="/status"
            className="btn btn-ghost"
            style={{ fontSize: 13, padding: "8px 14px", borderRadius: 999 }}
          >
            Track my order
          </Link>
          <Link
            href="/book"
            className="btn btn-primary"
            style={{ fontSize: 13, padding: "9px 16px", borderRadius: 999 }}
          >
            Book
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer style={{ background: "#111", color: "#E6E4DC" }}>
      <div className="wrap" style={{ paddingTop: 64, paddingBottom: 40 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 32,
            alignItems: "end",
          }}
        >
          <div>
            <h2
              className="serif"
              style={{
                fontSize: "clamp(26px,2.6vw,36px)",
                color: "#fff",
                margin: 0,
                letterSpacing: "-0.015em",
              }}
            >
              Ready when you are.
            </h2>
            <p style={{ fontSize: 16, color: "#A9A69C", margin: "12px 0 0", maxWidth: "40ch" }}>
              Pick a pack and fill the intake form. You&apos;ll hear from a recruiter the same day.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/#packs" className="btn btn-yellow">
              Choose your pack
            </Link>
            <Link
              href="/book?pack=INTERVIEW"
              className="btn"
              style={{ border: "1px solid #3A3A3A", color: "#E6E4DC" }}
            >
              Book an interview slot
            </Link>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #2E2E2E",
            marginTop: 44,
            paddingTop: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
            fontSize: 13.5,
            color: "#8E8B82",
          }}
        >
          <span style={{ marginRight: "auto" }}>{BRAND.name} — HR services for candidates</span>
          <Link href="/status" style={{ color: "#8E8B82" }}>
            Track my order
          </Link>
          <a href={`mailto:${BRAND.email}`} style={{ color: "#8E8B82" }}>
            {BRAND.email}
          </a>
          <Link href="/admin" style={{ color: "#8E8B82" }}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
