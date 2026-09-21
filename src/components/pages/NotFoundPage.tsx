import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { localePath, t, type Locale } from "@/lib/i18n";

export default function NotFoundPage({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2", display: "flex", flexDirection: "column" }}>
      <SiteHeader locale={locale} />
      <main className="wrap sec" style={{ maxWidth: 640, flex: 1 }}>
        <div className="eyebrow">404</div>
        <h1
          className="serif"
          style={{ fontSize: "clamp(30px,6vw,52px)", margin: "14px 0 0", letterSpacing: "-0.02em" }}
        >
          {c.common.notFoundTitle}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#56544C", margin: "18px 0 28px", maxWidth: "48ch" }}>
          {c.common.notFoundBody}
        </p>
        <Link href={localePath(locale, "/")} className="btn btn-primary btn-block-sm">
          {c.common.notFoundCta}
        </Link>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
