import Link from "next/link";
import { BRAND } from "@/lib/brand";

/**
 * The R of Libre Caslon Display — the same face the wordmark is set in —
 * carried as outlines so the mark never waits on a webfont, and never shifts
 * if one fails to load.
 */
const R_PATH =
  "M647 8V0H544Q520 0 508.0 7.0Q496 14 483 34L330 281Q316 304 306.5 309.5Q297 315 273 315H199V16L286 8V0H40V8L122 16V674L40 682V690H293Q411 690 473.0 642.5Q535 595 535 505Q535 435 497.0 390.0Q459 345 387 328H388L571 42Q584 22 596.5 15.0Q609 8 633 8ZM199 678V330H290Q370 330 408.5 372.5Q447 415 447 503Q447 592 408.0 635.0Q369 678 290 678Z";

/**
 * The mark: a serif R standing on the stroke a reader leaves when a line is
 * worth keeping. On a dark ground the letter reverses; the accent never does.
 */
export function LogoMark({ size = 34, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      style={{ flex: "none", display: "block" }}
    >
      <rect x="6.32" y="28.51" width="27.35" height="6.40" fill="#FFD22F" />
      <g fill={dark ? "#FFFFFF" : "#111111"}>
        <path transform="translate(6.559 33.5) scale(0.039130 -0.039130)" d={R_PATH} />
      </g>
    </svg>
  );
}

export function Logo({ dark = false, size = 34 }: { dark?: boolean; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
      <LogoMark size={size} dark={dark} />
      <span
        className="serif"
        style={{
          fontSize: size * 0.66,
          letterSpacing: "-0.015em",
          lineHeight: 1,
          color: dark ? "#fff" : undefined,
        }}
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
          <Link href="/reviews">Reviews</Link>
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
        <Link href="/reviews">Reviews</Link>
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
            <Logo dark size={40} />
            <h2
              className="serif"
              style={{
                fontSize: "clamp(26px,2.6vw,36px)",
                color: "#fff",
                margin: "26px 0 0",
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
          <Link href="/reviews" style={{ color: "#8E8B82", padding: "8px 0" }}>
            Reviews
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
