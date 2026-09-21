"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type NavItem = { id: string; href: string; label: string };

/**
 * The header's section links, aware of where the reader is.
 *
 * On the landing page the link for the section currently under the header is
 * marked, so the bar works as a map and not just a menu; on a phone the rail
 * also slides so that link stays in view. On any other page the same links
 * simply lead home to the right section.
 */
export function NavLinks({
  items,
  variant,
  label,
}: {
  items: NavItem[];
  variant: "nav" | "rail";
  label: string;
}) {
  const active = useActiveSection(items.map((i) => i.id));
  const railRef = useRef<HTMLElement | null>(null);

  // Keep the active link visible in the scrolling rail without moving the page.
  useEffect(() => {
    if (variant !== "rail" || !active || !railRef.current) return;
    const rail = railRef.current;
    const el = rail.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!el) return;
    const left = el.offsetLeft - (rail.clientWidth - el.clientWidth) / 2;
    rail.scrollTo({ left: Math.max(0, left), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [active, variant]);

  const links = items.map((i) => (
    <Link
      key={i.id}
      href={i.href}
      data-id={i.id}
      data-active={active === i.id ? "true" : undefined}
      aria-current={active === i.id ? "location" : undefined}
    >
      {i.label}
    </Link>
  ));

  if (variant === "rail") {
    return (
      <nav ref={railRef} className="section-rail" aria-label={label}>
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
 * Which of the given section ids is under the reading line right now. Reads
 * positions on scroll, throttled to animation frames, and returns nothing
 * when none of the sections exist on the page.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) {
      setActive(null);
      return;
    }
    let raf = 0;
    const measure = () => {
      raf = 0;
      // The reading line sits a third of the way down: a section counts as
      // current once its top has crossed it, until the next one does.
      const line = window.scrollY + window.innerHeight * 0.34;
      let current: string | null = null;
      for (const el of sections) {
        if (el.offsetTop <= line) current = el.id;
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

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
