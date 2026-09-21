"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { BRAND, whatsappLink } from "@/lib/brand";
import { localePath, t, type Locale } from "@/lib/i18n";

/**
 * Every booking entry point on the site goes through here, so each one is
 * measured and we can see which section actually produced the booking rather
 * than guessing. `where` is the section name, not the button label.
 */
export function BookButton({
  where,
  pack,
  label,
  variant = "yellow",
  className = "",
  style,
  locale = "en",
}: {
  where: string;
  pack?: string;
  label?: string;
  variant?: "yellow" | "primary" | "ghost";
  className?: string;
  style?: React.CSSProperties;
  locale?: Locale;
}) {
  const book = localePath(locale, "/book");
  const href = pack ? `${book}?pack=${pack}` : book;
  return (
    <Link
      href={href}
      className={`btn btn-${variant} btn-block-sm ${className}`}
      style={style}
      onClick={() => track("book_click", { where, pack: pack ?? "none" })}
    >
      {label ?? t(locale).common.book}
    </Link>
  );
}

/**
 * A phone-only bar pinned to the bottom. Most Tunisian traffic is mobile, and
 * on a phone the header CTA is a long scroll away by the time anyone is
 * convinced. It hides itself on the booking page, where it would be noise.
 */
export function StickyBookBar({ hidden = false, locale = "en" }: { hidden?: boolean; locale?: Locale }) {
  const c = t(locale);
  // The hero already carries a booking button; the bar slides in once that
  // button has scrolled away, so the first screen is never covered twice.
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const wa = whatsappLink(
    locale === "fr"
      ? "Bonjour, je voudrais réserver une session Recrutini."
      : "Hello, I would like to book a Recrutini session.",
  );
  if (hidden) return null;
  return (
    <div className="sticky-book only-sm" aria-label={c.common.bookAria} data-show={show ? "true" : undefined}>
      <div className="sticky-book-inner">
        <div className="sticky-book-copy">
          <strong>{c.sticky.price}</strong>
          <span>{c.sticky.note}</span>
        </div>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="sticky-wa"
            aria-label={c.common.whatsappAria}
            onClick={() => track("whatsapp_click", { where: "sticky_bar" })}
          >
            <WhatsAppGlyph />
          </a>
        )}
        <Link
          href={localePath(locale, "/book")}
          className="btn btn-yellow sticky-book-btn"
          onClick={() => track("book_click", { where: "sticky_bar", pack: "none" })}
        >
          {c.sticky.book}
        </Link>
      </div>
    </div>
  );
}

export function WhatsAppGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7.59.26 1.04.41 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

/**
 * The hero panel. It always looked like a card you could press, so now it is
 * one — the whole block is the booking link for the interview pack.
 */
export function HeroPanel({
  locale = "en",
  pack,
  children,
}: {
  locale?: Locale;
  pack?: string;
  children: React.ReactNode;
}) {
  const book = localePath(locale, "/book");
  return (
    <Link
      href={pack ? `${book}?pack=${pack}` : book}
      className="hero-panel hide-sm"
      onClick={() => track("book_click", { where: "hero_panel", pack: pack ?? "none" })}
    >
      {children}
    </Link>
  );
}

/** A quiet "talk to a human first" option, for people not ready to book. */
export function AskFirst({ where, dark = false, locale = "en" }: { where: string; dark?: boolean; locale?: Locale }) {
  const c = t(locale);
  const wa = whatsappLink(
    locale === "fr"
      ? "Bonjour, j'ai une question sur Recrutini avant de réserver."
      : "Hello, I have a question about Recrutini before booking.",
  );
  return (
    <div className="ask-first" data-dark={dark}>
      <span>{c.askFirst.prompt}</span>
      <span className="ask-first-links">
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("whatsapp_click", { where })}
          >
            <WhatsAppGlyph size={17} /> {c.askFirst.whatsapp}
          </a>
        )}
        <a href={`mailto:${BRAND.email}`} onClick={() => track("email_click", { where })}>
          {BRAND.email}
        </a>
      </span>
    </div>
  );
}
