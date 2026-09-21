import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BRAND } from "@/lib/brand";
import { LAST_UPDATED } from "@/lib/legal";
import { localePath, type Locale } from "@/lib/i18n";

const UI = {
  en: { updated: "Last updated", q: "Questions about any of this?", book: "Book a session" },
  fr: { updated: "Mise à jour le", q: "Une question sur tout ceci ?", book: "Réserver une session" },
};

export default function LegalPage({
  title,
  intro,
  sections,
  locale = "en",
}: {
  title: string;
  intro: string;
  sections: { h: string; p: string[] }[];
  locale?: Locale;
}) {
  const ui = UI[locale];
  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2", display: "flex", flexDirection: "column" }}>
      <SiteHeader locale={locale} />
      <main className="wrap sec" style={{ maxWidth: 760, flex: 1 }}>
        <div className="eyebrow">{ui.updated} {LAST_UPDATED}</div>
        <h1
          className="serif"
          style={{ fontSize: "clamp(30px,6vw,52px)", margin: "14px 0 0", letterSpacing: "-0.02em" }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#56544C", margin: "18px 0 0", maxWidth: "52ch" }}>
          {intro}
        </p>

        {sections.map((s) => (
          <section key={s.h} style={{ marginTop: 52 }}>
            <h2 className="serif" style={{ fontSize: 26, margin: 0, letterSpacing: "-0.01em" }}>
              {s.h}
            </h2>
            {s.p.map((para) => (
              <p
                key={para.slice(0, 30)}
                style={{ fontSize: 16.5, lineHeight: 1.7, color: "#3D3B34", margin: "14px 0 0" }}
              >
                {para}
              </p>
            ))}
          </section>
        ))}

        <div className="card pad-card" style={{ marginTop: 56 }}>
          <h2 className="serif" style={{ fontSize: 22, margin: 0 }}>
{ui.q}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#56544C", margin: "10px 0 18px" }}>
{locale === "fr" ? "Écrivez-nous. Réponse le jour même, samedi compris." : `Write to us. ${BRAND.replyPromise}`}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={`mailto:${BRAND.email}`} className="btn btn-primary btn-block-sm">
              {BRAND.email}
            </a>
            <Link href={localePath(locale, "/book")} className="btn btn-ghost btn-block-sm">
              {ui.book}
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
