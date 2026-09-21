import type { Metadata } from "next";
import { SiteHeader, SiteFooter, LogoMark } from "@/components/SiteChrome";
import { BRAND, PACKS, type PackKey } from "@/lib/brand";
import { buildCalendar } from "@/lib/schedule";
import { localePath, t, type Locale } from "@/lib/i18n";
import BookingForm from "@/components/BookingForm";

export function bookMetadata(locale: Locale): Metadata {
  const c = t(locale);
  return {
    title: c.book.metaTitle,
    description: c.book.metaDesc,
    alternates: {
      canonical: localePath(locale, "/book"),
      languages: { en: "/book", fr: "/fr/book", "x-default": "/book" },
    },
    // A booking page is for the person on it, not for search engines.
    robots: { index: false, follow: true },
  };
}

export default async function BookPage({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Promise<{ pack?: string; student?: string }>;
}) {
  const c = t(locale);
  const { pack, student } = await searchParams;
  const initialPack: PackKey =
    pack && pack.toUpperCase() in PACKS ? (pack.toUpperCase() as PackKey) : "FULL";

  const initialStudent = student === "1" || student === "true";

  let days: Awaited<ReturnType<typeof buildCalendar>> = [];
  let dbError = false;
  try {
    days = await buildCalendar(locale);
  } catch {
    dbError = true;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      <SiteHeader locale={locale} />
      <main className="wrap" style={{ paddingTop: 44, paddingBottom: 80, maxWidth: 820 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LogoMark size={30} />
          <div className="eyebrow">{c.book.eyebrow}</div>
        </div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(27px,5.5vw,44px)",
            letterSpacing: "-0.02em",
            margin: "12px 0 8px",
          }}
        >
          {c.book.h1}
        </h1>
        <p style={{ fontSize: 17, color: "#56544C", maxWidth: "56ch", margin: "0 0 28px" }}>
          {c.book.lead}
        </p>

        {dbError && (
          <div
            className="card"
            style={{ padding: 20, marginBottom: 20, borderColor: "#E3CCCC", background: "#F6EEEE" }}
          >
            {c.book.dbError}{" "}
            <a href={`mailto:${BRAND.email}`} style={{ borderBottom: "2px solid #FFD22F" }}>
              {BRAND.email}
            </a>
          </div>
        )}

        <BookingForm
          locale={locale}
          days={days}
          initialPack={initialPack}
          initialStudent={initialStudent}
          tzLabel={BRAND.tzLabel}
        />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
