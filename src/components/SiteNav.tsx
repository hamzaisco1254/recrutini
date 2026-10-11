"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type NavItem = { id: string; href: string; label: string };

/**
 * The header's section links, aware of where the reader is.
 *
 * On the landing page the link for the section currently under the header is
 * marked, so the bar works as a map and not just a menu. On any other page the
 * same links simply lead home to the right section.
 */
export function NavLinks({
  items,
  variant,
  label,
  onNavigate,
}: {
  items: NavItem[];
  variant: "nav" | "panel";
  label: string;
  onNavigate?: () => void;
}) {
  const active = useActiveSection(items.map((i) => i.id));

  const links = items.map((i) => (
    <Link
      key={i.id}
      href={i.href}
      data-id={i.id}
      data-active={active === i.id ? "true" : undefined}
      aria-current={active === i.id ? "location" : undefined}
      onClick={onNavigate}
    >
      {i.label}
    </Link>
  ));

  if (variant === "panel") {
    return (
      <nav className="menu-links" aria-label={label}>
        {links}
      </nav>
    );
  }
  return (
    <nav className="head-nav" aria-label={label}>
      {links}
    </nav>
  );
}

/**
 * Which of the given section ids is under the reading line right now.
 *
 * The sections are sorted by their position on the page before they are
 * compared, never by the order they appear in the menu: the two differ (Packs
 * is listed first but sits below How it works), and comparing in menu order
 * made the last-listed section win every time, which is why clicking Packs
 * used to light up How it works.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const present = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (present.length === 0) {
      setActive(null);
      return;
    }
    let raf = 0;
    const measure = () => {
      raf = 0;
      const sections = [...present].sort((a, b) => top(a) - top(b));
      // The reading line sits a third of the way down: a section counts as
      // current once its top has crossed it, until the next one does.
      const line = window.scrollY + window.innerHeight * 0.34;
      let current: string | null = null;
      for (const el of sections) {
        if (top(el) <= line) current = el.id;
      }
      // Past the last section (footer), keep the last one lit rather than none.
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1].id;
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}

/** Distance from the top of the document, whatever the element is nested in. */
function top(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY;
}

/**
 * The menu on phones and small laptops: one button, one panel.
 *
 * The button says what it does and what state it is in; the panel closes on a
 * link, on Escape, on a tap outside it and when the window grows back to a
 * width where the full bar fits. While it is open the page behind it cannot
 * scroll, and focus returns to the button on close.
 */
export function MenuButton({
  items,
  label,
  openLabel,
  closeLabel,
  children,
}: {
  items: NavItem[];
  label: string;
  openLabel: string;
  closeLabel: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    btnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 1180) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("resize", onResize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the panel so the keyboard lands where the eye does.
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="menu-bars" data-open={open ? "true" : undefined} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="menu-word">{openLabel}</span>
      </button>

      {open && <div className="menu-scrim" aria-hidden="true" />}

      <div
        id="site-menu"
        ref={panelRef}
        className="menu-panel"
        data-open={open ? "true" : undefined}
        hidden={!open}
      >
        <NavLinks items={items} variant="panel" label={label} onNavigate={() => setOpen(false)} />
        <div className="menu-foot">{children}</div>
      </div>
    </>
  );
}

/** The header itself: sticky, and marked once the page has scrolled under it. */
export function StickyHeader({
  dark,
  children,
}: {
  dark: boolean;
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`site-header${dark ? " head-dark" : ""}`} data-scrolled={scrolled ? "true" : undefined}>
      {children}
    </header>
  );
}
