"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LOCALES, localePath, stripLocale, type Locale } from "@/lib/i18n";

/** Each link says the language it leads to, in that language. */
const LANGUAGE_NAMES: Record<Locale, string> = { en: "English", fr: "Français" };

/**
 * The EN | FR control.
 *
 * It points at the page you are on, in the other language, never at the home
 * page: someone halfway through booking in English who switches to French
 * lands on the French booking page. The link carries ?lang= so the edge proxy
 * can record the choice and redirect in a single fast hop, and it is a plain
 * anchor so the router never prefetches the destination (a prefetch used to
 * cache a stale "go back to French" redirect and leave EN looking dead).
 *
 * The pressed state flips immediately on click: the page that follows is a
 * full load, and a control that does not react until then feels broken.
 */
export default function LangPick({
  locale,
  dark = false,
  label,
}: {
  locale: Locale;
  dark?: boolean;
  label: string;
}) {
  // On a statically prerendered page this hook can report the internal route
  // ("/index") rather than the URL, which once sent the French link to a page
  // that does not exist. Normalise before building anything from it.
  const pathname = (usePathname() || "/").replace(/\/index$/, "") || "/";
  const bare = stripLocale(pathname) || "/";
  const [pending, setPending] = useState<Locale | null>(null);
  const shown = pending ?? locale;

  function href(l: Locale, extra = "") {
    const q = new URLSearchParams(extra);
    q.set("lang", l);
    return `${localePath(l, bare)}?${q.toString()}`;
  }

  return (
    <div className="lang-pick" role="group" aria-label={label} data-dark={dark} aria-busy={pending ? "true" : undefined}>
      {LOCALES.map((l) => (
        <a
          key={l}
          href={href(l)}
          lang={l}
          rel="nofollow"
          aria-label={LANGUAGE_NAMES[l]}
          aria-current={l === locale ? "true" : undefined}
          data-on={l === shown}
          onClick={(e) => {
            if (l === locale) {
              e.preventDefault();
              return;
            }
            setPending(l);
            // Carry the query string across (?pack=FULL and friends). Read at
            // click time so the link itself stays static and prefetch-free.
            const qs = window.location.search;
            if (!qs) return;
            e.preventDefault();
            window.location.href = href(l, qs);
          }}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
