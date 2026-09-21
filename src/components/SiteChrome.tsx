import Link from "next/link";
import { BRAND, whatsappLink } from "@/lib/brand";
import { localePath, t, type Locale } from "@/lib/i18n";
import LangPick from "./LangPick";
import { NavLinks, StickyHeader, type NavItem } from "./SiteNav";

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
        className="serif logo-word"
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

export function SiteHeader({ dark = false, locale = "en" }: { dark?: boolean; locale?: Locale }) {
  const c = t(locale);
  const base = localePath(locale, "/");
  const items: NavItem[] = [
    { id: "packs", href: `${base}#packs`, label: c.nav.packs },
    { id: "process", href: `${base}#process`, label: c.nav.process },
    { id: "why", href: `${base}#why`, label: c.nav.why },
    { id: "founder", href: `${base}#founder`, label: c.nav.founder },
    { id: "reviews", href: localePath(locale, "/reviews"), label: c.nav.reviews },
    { id: "faq", href: `${base}#faq`, label: c.nav.faq },
  ];
  return (
    <StickyHeader dark={dark}>
      <div className="wrap site-head">
        <div className="head-brand">
          <Link href={base} style={{ display: "inline-flex", padding: "6px 0" }}>
            <Logo dark={dark} />
          </Link>
          <span className="head-tagline">{c.common.tagline}</span>
        </div>
        <NavLinks items={items} variant="nav" label={c.nav.sectionsLabel} />
        <div className="head-actions">
          <LangPick locale={locale} dark={dark} label={c.nav.switchLabel} />
          <Link href={localePath(locale, "/book")} className={`btn head-btn ${dark ? "btn-yellow" : "btn-primary"}`}>
            {c.nav.book}
          </Link>
        </div>
      </div>
      {/* Section links stay reachable where the row above has no room for them. */}
      <NavLinks items={items} variant="rail" label={c.nav.sectionsLabel} />
    </StickyHeader>
  );
}

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const c = t(locale);
  const base = localePath(locale, "/");
  const wa = whatsappLink(
    locale === "fr"
      ? "Bonjour, j'ai une question sur Recrutini."
      : "Hello, I have a question about Recrutini.",
  );
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="cta-panel">
          <div>
            <h2 className="serif cta-panel-h2">{c.footer.h2}</h2>
            <p className="cta-panel-p">{c.footer.sub}</p>
          </div>
          <div className="cta-panel-actions">
            <Link href={`${base}#packs`} className="btn btn-yellow btn-block-sm">
              {c.footer.cta1}
            </Link>
            <Link href={`${localePath(locale, "/book")}?pack=INTERVIEW`} className="btn btn-on-ink btn-block-sm">
              {c.footer.cta2}
            </Link>
          </div>
        </div>
        <div className="foot-row">
          <span className="foot-brand">
            <Logo size={26} /> <span className="foot-tag">{c.footer.tagline}</span>
          </span>
          <nav className="foot-links" aria-label="Footer">
            <Link href={localePath(locale, "/status")}>{c.footer.track}</Link>
            <Link href={localePath(locale, "/reviews")}>{c.footer.reviews}</Link>
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            )}
            <Link href={localePath(locale, "/legal/privacy")}>{c.footer.privacy}</Link>
            <Link href={localePath(locale, "/legal/terms")}>{c.footer.terms}</Link>
            <Link href="/admin">{c.footer.admin}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
