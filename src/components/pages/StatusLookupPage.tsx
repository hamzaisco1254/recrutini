import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { normalizeRef } from "@/lib/ref";
import { prisma } from "@/lib/db";
import { BRAND } from "@/lib/brand";
import { clearAttempts, clientKey, grantTrackAccess, noteAttempt, tooManyAttempts } from "@/lib/track";
import { isLocale, localePath, t, type Locale } from "@/lib/i18n";

export function statusMetadata(locale: Locale): Metadata {
  return {
    title: t(locale).status.metaTitle,
    alternates: {
      canonical: localePath(locale, "/status"),
      languages: { en: "/status", fr: "/fr/status", "x-default": "/status" },
    },
    robots: { index: false, follow: true },
  };
}

/**
 * Opening a file needs the reference AND the email it was booked with, so a
 * guessed or shoulder-surfed code on its own reveals nothing. Every failure
 * says the same thing, whether the code exists or not.
 */
async function lookup(formData: FormData) {
  "use server";
  const l = formData.get("locale");
  const locale: Locale = isLocale(l) ? l : "en";
  const back = (q: string) => localePath(locale, `/status?${q}`);
  const ref = normalizeRef(String(formData.get("ref") ?? ""));
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const key = await clientKey();

  if (tooManyAttempts(key)) redirect(back("e=slow"));
  noteAttempt(key);

  if (!ref || !email) redirect(back("e=1"));

  let match = null;
  try {
    match = await prisma.order.findFirst({ where: { ref }, select: { ref: true, email: true } });
  } catch {
    match = null;
  }
  if (!match || match.email.trim().toLowerCase() !== email) redirect(back("e=1"));

  clearAttempts(key);
  await grantTrackAccess(match.ref);
  redirect(localePath(locale, `/status/${encodeURIComponent(match.ref)}`));
}

export default async function StatusLookupPage({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Promise<{ e?: string; notfound?: string; r?: string }>;
}) {
  const c = t(locale).status;
  const { e, notfound, r } = await searchParams;
  const error = e === "slow" ? "slow" : e || notfound ? "bad" : null;
  const prefill = r ? normalizeRef(r).slice(0, 12) : "";

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2", display: "flex", flexDirection: "column" }}>
      <SiteHeader locale={locale} />
      <main className="wrap sec" style={{ maxWidth: 560, flex: 1 }}>
        <div className="eyebrow">{c.eyebrow}</div>
        <h1
          className="serif"
          style={{ fontSize: "clamp(26px,6vw,40px)", margin: "12px 0 10px", letterSpacing: "-0.02em" }}
        >
          {c.h1}
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#56544C", margin: "0 0 28px" }}>{c.lead}</p>
        <form action={lookup} className="card pad-card" style={{ display: "grid", gap: 18 }}>
          <input type="hidden" name="locale" value={locale} />
          <div>
            <label className="lbl" htmlFor="ref">
              {c.refLabel}
            </label>
            <input
              id="ref"
              className="field"
              name="ref"
              required
              placeholder="RC-ABC-234"
              autoComplete="off"
              autoCapitalize="characters"
              defaultValue={prefill}
              autoFocus
            />
          </div>
          <div>
            <label className="lbl" htmlFor="email">
              {c.emailLabel}
            </label>
            <input
              id="email"
              className="field"
              name="email"
              type="email"
              required
              placeholder={t(locale).book.emailPh}
              autoComplete="email"
            />
          </div>
          {error === "bad" && (
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "#8A3B3B" }}>
              {c.bad}{" "}
              <a href={`mailto:${BRAND.email}`} style={{ borderBottom: "2px solid #FFD22F" }}>
                {BRAND.email}
              </a>
              .
            </div>
          )}
          {error === "slow" && (
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "#8A3B3B" }}>{c.slow}</div>
          )}
          <button className="btn btn-primary btn-block-sm" type="submit">
            {c.open}
          </button>
        </form>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#86837A", marginTop: 20 }}>{c.keep}</p>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
