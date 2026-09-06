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

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  return (
    <header
      className={dark ? "head-dark" : undefined}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: dark ? undefined : "rgba(247,246,242,0.93)",
        backdropFilter: "blur(8px)",
        borderBottom: dark ? undefined : "1px solid #E4E2DA",
      }}
    >
      <div
        className="wrap site-head"
        style={{
          paddingTop: 12,
          paddingBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginRight: "auto",
            minWidth: 0,
          }}
        >
          <Link href="/" style={{ display: "inline-flex", padding: "6px 0" }}>
            <Logo dark={dark} />
          </Link>
          <span
            className="hide-sm"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: dark ? "#8E8B82" : "#86837A",
            }}
          >
            {BRAND.tagline}
          </span>
        </div>
        <nav
          className="hide-sm"
          style={{ display: "flex", gap: 22, fontSize: 14.5, color: dark ? "#A9A69C" : "#56544C" }}
        >
          <Link href="/#packs">Packs</Link>
          <Link href="/#process">How it works</Link>
          <Link href="/#interview">Mock interview</Link>
          <Link href="/#founder">Founder</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: "none" }}>
          <Link
            href="/status"
            className="btn btn-ghost head-btn"
            style={{ fontSize: 13, padding: "9px 14px", borderRadius: 999 }}
          >
            <span className="hide-sm">Track my order</span>
            <span className="only-sm-inline">Track</span>
          </Link>
          <Link
            href="/book"
            className={`btn head-btn ${dark ? "btn-yellow" : "btn-primary"}`}
            style={{ fontSize: 13, padding: "9px 18px", borderRadius: 999 }}
          >
            Book
          </Link>
        </div>
      </div>
      {/* Section links stay reachable on a phone, where the nav above is hidden. */}
      <nav className="only-sm section-rail" aria-label="Sections">
        <Link href="/#packs">Packs</Link>
        <Link href="/#process">How it works</Link>
        <Link href="/#interview">Mock interview</Link>
        <Link href="/#founder">Founder</Link>
        <Link href="/#faq">FAQ</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer style={{ background: "#111", color: "#E6E4DC" }}>
      <div className="wrap sec-footer">
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
            <Link href="/#packs" className="btn btn-yellow btn-block-sm">
              Choose your pack
            </Link>
            <Link
              href="/book?pack=INTERVIEW"
              className="btn btn-block-sm"
              style={{ border: "1px solid #4A4A4A", background: "transparent", color: "#E6E4DC" }}
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
            rowGap: 4,
            fontSize: 13.5,
            color: "#8E8B82",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "auto" }}>{BRAND.name} — HR services for candidates</span>
          <Link href="/status" style={{ color: "#8E8B82", padding: "8px 0" }}>
            Track my order
          </Link>
          <a href={`mailto:${BRAND.email}`} style={{ color: "#8E8B82", padding: "8px 0" }}>
            {BRAND.email}
          </a>
          <Link href="/admin" style={{ color: "#8E8B82", padding: "8px 0" }}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
