import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BookButton, StickyBookBar } from "@/components/BookCta";
import { SAMPLE, SAMPLE_FR } from "@/lib/sample-report";
import { PACKS } from "@/lib/brand";
import { localePath, t, type Locale } from "@/lib/i18n";

export function sampleMetadata(locale: Locale): Metadata {
  const c = t(locale).sample;
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: {
      canonical: localePath(locale, "/sample-report"),
      languages: { en: "/sample-report", fr: "/fr/sample-report", "x-default": "/sample-report" },
    },
  };
}

export default function SampleReportPage({ locale }: { locale: Locale }) {
  const c = t(locale).sample;
  const S = locale === "fr" ? SAMPLE_FR : SAMPLE;
  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      <SiteHeader locale={locale} />
      <main className="wrap sec" style={{ maxWidth: 860 }}>
        <div className="eyebrow">{c.eyebrow}</div>
        <h1
          className="serif"
          style={{ fontSize: "clamp(30px,6vw,52px)", margin: "14px 0 0", letterSpacing: "-0.02em" }}
        >
          {c.h1}
        </h1>
        <p style={{ fontSize: 18.5, lineHeight: 1.6, color: "#56544C", margin: "18px 0 0", maxWidth: "54ch" }}>
          {c.lead}
        </p>

        <div className="sample-sheet">
          <div className="sample-head">
            <div>
              <div className="sample-label">{c.label}</div>
              <div className="serif sample-role">{S.role}</div>
            </div>
            <div className="sample-meta">
              {S.language} · {S.duration}
            </div>
          </div>

          <div className="sample-verdict">
            <div className="sample-overall">
              <span className="serif">{S.overall}</span>
              <small>/ 100</small>
            </div>
            <p>{S.verdict}</p>
          </div>

          <h2 className="serif sample-h2">{c.competencies}</h2>
          <div className="sample-scores">
            {S.scores.map((s) => (
              <div className="sample-score" key={s.name}>
                <div className="sample-score-top">
                  <span className="sample-score-name">{s.name}</span>
                  <span className="sample-score-pct">{s.pct}</span>
                </div>
                <div className="sample-track">
                  <div
                    className="sample-fill"
                    data-weak={s.weak ? "true" : "false"}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <p className="sample-score-note">{s.note}</p>
              </div>
            ))}
          </div>

          <h2 className="serif sample-h2">{c.moments}</h2>
          {S.moments.map((m, i) => (
            <div className="moment" key={m.q}>
              <div className="moment-n">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className="moment-q">{m.q}</div>
                <div className="moment-block" data-kind="said">
                  <span className="moment-tag">{c.said}</span>
                  <p>{m.said}</p>
                </div>
                <p className="moment-why">{m.why}</p>
                <div className="moment-block" data-kind="instead">
                  <span className="moment-tag">{c.instead}</span>
                  <p>{m.instead}</p>
                </div>
              </div>
            </div>
          ))}

          <h2 className="serif sample-h2">{c.actions}</h2>
          <ol className="sample-actions">
            {S.actions.map((a) => (
              <li key={a.slice(0, 24)}>{a}</li>
            ))}
          </ol>
        </div>

        <div className="card pad-card" style={{ marginTop: 40 }}>
          <h2 className="serif" style={{ fontSize: 24, margin: 0 }}>
            {c.yoursTitle}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#56544C", margin: "12px 0 20px", maxWidth: "56ch" }}>
            {c.yoursBody(PACKS.INTERVIEW.price, PACKS.FULL.price)}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <BookButton where="sample_report" pack="INTERVIEW" label={c.cta} locale={locale} />
            <Link href={`${localePath(locale, "/")}#packs`} className="btn btn-ghost btn-block-sm">
              {c.seeAll}
            </Link>
          </div>
        </div>

        <p style={{ fontSize: 13.5, color: "#86837A", marginTop: 26, maxWidth: "62ch", lineHeight: 1.6 }}>
          {c.disclaimer}
        </p>
      </main>
      <SiteFooter locale={locale} />
      <StickyBookBar locale={locale} />
    </div>
  );
}
