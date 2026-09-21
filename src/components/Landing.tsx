import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BRAND, FOUNDER, STUDENT_OFFER } from "@/lib/brand";
import { prisma } from "@/lib/db";
import ReviewCard, { Stars, type PublicReview } from "@/components/ReviewCard";
import { AskFirst, BookButton, StickyBookBar } from "@/components/BookCta";
import { PlayButton, PromoSection } from "@/components/PromoVideo";
import { faqJsonLd } from "@/lib/seo";
import { localePath, t, type Locale } from "@/lib/i18n";

/**
 * The landing page, once, for both languages.
 *
 * Structure and rhythm borrowed from a senior consultancy site: a dark hero
 * with one bold sentence and a line drawing, small kicker labels, big
 * two-tone titles, three-column rows, a dark band for the argument, and a
 * closing panel. Palette and voice stay Recrutini's: ink, paper, one yellow,
 * and a recruiter talking plainly. Every string comes from the dictionary.
 */

/** A two-tone title: plain first half, second half underlined in yellow. */
function Title({ a, em, as = "h2", dark = false }: { a: string; em: string; as?: "h1" | "h2"; dark?: boolean }) {
  const Tag = as;
  return (
    <Tag className={`serif ${as === "h1" ? "display" : "h2"} title${dark ? " title-dark" : ""}`}>
      {a} <em>{em}</em>
    </Tag>
  );
}

export default async function Landing({ locale }: { locale: Locale }) {
  const c = t(locale);
  const book = localePath(locale, "/book");

  let reviews: PublicReview[] = [];
  try {
    reviews = await prisma.review.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, name: true, role: true, rating: true, body: true, verified: true, createdAt: true },
    });
  } catch {
    reviews = [];
  }
  const average =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      <SiteHeader dark locale={locale} />
      <main>
        {/* 1. Hero */}
        <section className="hero hero-mw">
          <div className="wrap hero-mw-inner">
            <Title as="h1" a={c.hero.h1a} em={c.hero.h1em} dark />
            <p className="hero-lead">{c.hero.sub}</p>
            <div className="hero-ctas">
              <BookButton locale={locale} where="hero" label={c.hero.cta} className="btn-lg" />
              <PlayButton locale={locale} variant="dark" />
            </div>
            <p className="hero-note">{c.hero.note}</p>
          </div>
          <svg className="waves" viewBox="0 0 900 400" fill="none" aria-hidden="true">
            <g stroke="#FFD22F" strokeWidth="1.2" opacity="0.55">
              <path d="M0 330 C 220 300, 300 120, 560 140 S 880 60, 900 20" />
              <path d="M0 345 C 230 315, 320 140, 580 160 S 890 80, 900 40" />
              <path d="M0 360 C 240 330, 340 160, 600 180 S 900 100, 900 60" />
              <path d="M0 375 C 250 345, 360 180, 620 200 S 910 120, 900 80" />
              <path d="M0 390 C 260 360, 380 200, 640 220 S 920 140, 900 100" />
              <path d="M0 405 C 270 375, 400 220, 660 240 S 930 160, 900 120" />
            </g>
          </svg>
        </section>

        {/* 2. The hook, then how it works in three columns */}
        <section id="process" className="wrap sec-mw">
          <div className="kicker">{c.intro.label}</div>
          <Title a={c.intro.h2} em={c.intro.h2em} />
          <p className="lead-mw">{c.intro.lead}</p>
          <figure className="pull">
            <blockquote>{c.founder.quote}</blockquote>
            <figcaption>
              {FOUNDER.name}, <Link href={`${localePath(locale, "/")}#founder`}>{c.founder.role}</Link>
            </figcaption>
          </figure>
          <div className="cols3" style={{ marginTop: 64 }}>
            {c.process.steps.map((s) => (
              <div key={s.n} className="col-mw">
                <span className="step-n">{s.n}</span>
                <h3>{s.title}.</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Packs */}
        <section id="packs" className="wrap sec-mw" style={{ paddingTop: 0 }}>
          <div className="kicker">{c.packs.label}</div>
          <Title a={c.packs.h2} em={c.packs.h2em} />
          <p className="lead-mw">{c.packs.sub}</p>
          <div className="cols3" style={{ marginTop: 48 }}>
            {c.packs.list.map((pack, i) => (
              <div key={pack.key} id={pack.key === "INTERVIEW" ? "interview" : undefined} className="pcard">
                <div className={`pcard-img pcard-img-${i}`}>
                  {pack.featured && <span className="pcard-best">{c.packs.bestValue}</span>}
                </div>
                <div className="pcard-body">
                  <div className="pcard-kicker">{pack.number}</div>
                  <h3>{pack.title}</h3>
                  <p className="pcard-for">{pack.forWho}</p>
                  <ul className="pack-list">
                    {pack.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  {pack.key === "INTERVIEW" && (
                    <Link href={localePath(locale, "/sample-report")} className="inline-link pcard-link">
                      {c.interview.sample}
                    </Link>
                  )}
                  {pack.note && <p className="pcard-note">{pack.note}</p>}
                  <div className="pcard-row">
                    <span className="pcard-price">{pack.price} dt</span>
                    <BookButton
                      locale={locale}
                      where="pack_card"
                      pack={pack.key}
                      variant={pack.featured ? "yellow" : "ghost"}
                      className="pcard-go"
                      label={pack.featured ? c.packs.chooseFeatured : c.packs.choose}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pack-under">
            {STUDENT_OFFER.on && (
              <div id="students" className="student-band-mw">
                <span className="student-flag">{c.student.tag}</span>
                <div>
                  <h3 className="serif student-band-h3">{c.student.band}</h3>
                  <p className="student-band-p">{c.student.line}</p>
                </div>
                <Link href={`${book}?pack=FULL&student=1`} className="btn btn-yellow btn-block-sm student-band-cta">
                  {c.student.cta}
                </Link>
              </div>
            )}
            <p className="pack-footnote">{c.packs.footnote}</p>
          </div>

          <div className="assure">
            {c.packs.assure.map(([mark, title, body]) => (
              <div className="assure-item" key={title}>
                <span className="assure-mark" aria-hidden="true">
                  {mark}
                </span>
                <div>
                  <p className="assure-title">{title}</p>
                  <p className="assure-body">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: 36 }}>
            <BookButton locale={locale} where="packs_footer" label={c.hero.cta} variant="yellow" />
            <AskFirst where="packs_footer" locale={locale} />
          </div>
        </section>

        {/* 4. What candidates say, once there are candidates to say it */}
        {reviews.length > 0 && (
          <section id="reviews" className="wrap sec-mw" style={{ paddingTop: 0 }}>
            <div className="kicker">{c.reviews.h2}</div>
            <div className="reviews-head">
              <Title a={c.reviews.h2} em={c.reviews.sub} />
              {average !== null && (
                <div className="reviews-avg">
                  <Stars value={Math.round(average)} locale={locale} />
                  <span>{average.toFixed(1)} / 5</span>
                </div>
              )}
            </div>
            <div className="review-grid" style={{ marginTop: 40 }}>
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} locale={locale} />
              ))}
            </div>
            <div className="cta-row" style={{ marginTop: 24 }}>
              <Link href={localePath(locale, "/reviews")} className="btn btn-ghost btn-block-sm">
                {c.reviews.readAll}
              </Link>
            </div>
          </section>
        )}

        {/* 5. Dark band: three reasons, then the case for a human */}
        <section id="why" className="band-ink">
          <div className="wrap sec-mw">
            <div className="kicker kicker-y">{c.reasons.label}</div>
            <Title a={c.reasons.h2} em={c.reasons.h2em} dark />
            <div className="cols3" style={{ marginTop: 48 }}>
              {c.reasons.items.map((r) => (
                <div key={r.k} className="glass">
                  <div className="glass-k">{r.k}</div>
                  <h3>{r.t}</h3>
                  <p>{r.b}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 104 }}>
              <div className="kicker kicker-y">{c.human.label}</div>
              <Title a={c.human.h2} em={c.human.h2em} dark />
              <p className="lead-mw lead-mw-dark">{c.human.intro}</p>
            </div>
            <div className="human-cols" style={{ marginTop: 44 }}>
              <div className="human-col">
                <h3 className="human-col-title">{c.human.aiTitle}</h3>
                <ul>
                  {c.human.ai.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="human-col human-col-us">
                <h3 className="human-col-title">{c.human.usTitle}</h3>
                <ul>
                  {c.human.us.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="human-verdict">
              <p className="serif">{c.human.verdict}</p>
              <BookButton locale={locale} where="human" pack="INTERVIEW" label={c.human.cta} variant="yellow" />
            </div>
          </div>
        </section>

        {/* 6. The film */}
        <PromoSection locale={locale} />

        {/* 7. Who you work with */}
        <section id="founder" className="wrap sec-mw">
          <div className="founder-row">
            <div>
              <div className="kicker">{c.founder.label}</div>
              <Title a={c.founder.h2} em={c.founder.h2em} />
              <p className="lead-mw founder-quote-mw">{c.founder.bio[1]}</p>
              <div className="cta-row" style={{ marginTop: 26 }}>
                <BookButton locale={locale} where="founder" label={c.founder.cta} variant="yellow" />
                <a href={FOUNDER.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost btn-block-sm">
                  LinkedIn
                </a>
              </div>
            </div>
            <div>
              <div className="founder-stats founder-stats-tight">
                {c.founder.stats.map(([big, small]) => (
                  <div key={big}>
                    <div className="serif founder-stat-big">{big}</div>
                    <div className="founder-stat-small">{small}</div>
                  </div>
                ))}
              </div>
              <div className="founder-creds">
                {c.founder.credentials.map((cr) => (
                  <div key={cr.title} className="cred">
                    <div className="cred-title">{cr.title}</div>
                    <div className="cred-org">{cr.org}</div>
                  </div>
                ))}
              </div>
              <p className="abroad-inline">
                <strong>{c.founder.abroadTitle}</strong> {c.founder.abroadBody}
              </p>
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section id="faq" className="wrap sec-mw faq-grid" style={{ paddingTop: 0 }}>
          <div>
            <div className="kicker">{c.faq.label}</div>
            <Title a={c.faq.h2} em={c.faq.h2em} />
            <p className="lead-mw" style={{ maxWidth: "34ch" }}>
              {c.faq.sub}
            </p>
            <a href={`mailto:${BRAND.email}`} className="inline-link" style={{ marginTop: 18 }}>
              {BRAND.email}
            </a>
          </div>
          <div>
            {c.faq.items.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p className="faq-answer">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
      <StickyBookBar locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(c.faq.items)) }}
      />
    </div>
  );
}
