import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BRAND, FOUNDER, STUDENT_OFFER } from "@/lib/brand";
import { prisma } from "@/lib/db";
import ReviewCard, { Stars, type PublicReview } from "@/components/ReviewCard";
import { AskFirst, BookButton, StickyBookBar } from "@/components/BookCta";
import { PlayButton, PromoSection } from "@/components/PromoVideo";
import ContactForm from "@/components/ContactForm";
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


/** Three line marks for the assurance row: a shield, a clock and a hand. Drawn
 *  rather than set, so the row reads as three guarantees at a glance instead of
 *  three more sentences. */
function AssureIcon({ i }: { i: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      {i === 0 && <path {...common} d="M12 3l7 3v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3z M9 12l2 2 4-4" />}
      {i === 1 && <path {...common} d="M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z M12 7.5V12l3 2" />}
      {i === 2 && <path {...common} d="M4 13V7.5a1.5 1.5 0 0 1 3 0V12V5a1.5 1.5 0 0 1 3 0v7V6a1.5 1.5 0 0 1 3 0v6V8.5a1.5 1.5 0 0 1 3 0V15a5 5 0 0 1-5 5h-1.2a5 5 0 0 1-3.9-1.9L4 15z" />}
    </svg>
  );
}


/** The picture beside the contact form: the reply, drawn. It says the same
 *  thing the old paragraph said — a person answers, today — without the
 *  paragraph. */
function ContactNote({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <figure className="contact-note">
      <div className="cn-card">
        <div className="cn-head">
          <span className="cn-dot" />
          <span>{c.contact.label}</span>
          <span className="cn-when">{c.hero.note.split("\u00b7").pop()?.trim()}</span>
        </div>
        <svg viewBox="0 0 220 120" className="cn-art" aria-hidden="true">
          <rect x="8" y="14" width="126" height="13" rx="6.5" fill="#E4E0D4" />
          <rect x="8" y="36" width="168" height="13" rx="6.5" fill="#E4E0D4" />
          <rect x="8" y="58" width="96" height="13" rx="6.5" fill="#E4E0D4" />
          <rect x="60" y="86" width="152" height="26" rx="13" fill="#111111" />
          <rect x="72" y="95" width="104" height="8" rx="4" fill="#FFD22F" />
        </svg>
      </div>
      <figcaption>{FOUNDER.name} · {c.founder.role}</figcaption>
    </figure>
  );
}


/**
 * A small drawing at the top of each pack, so the three are told apart by
 * shape before they are read: a marked-up CV, an interview in two takes, and
 * the two of them plus the follow-up. Drawn rather than photographed, because
 * a stock photo of a smiling stranger would say nothing true about the work.
 */
function PackArt({ i }: { i: number }) {
  if (i === 0) {
    return (
      <svg className="pcard-art" viewBox="0 0 240 110" aria-hidden="true">
        <rect x="26" y="10" width="126" height="92" rx="7" fill="#fff" stroke="#111" strokeOpacity="0.12" />
        <rect x="38" y="24" width="52" height="7" rx="3.5" fill="#111" />
        <rect x="38" y="39" width="88" height="5" rx="2.5" fill="#111" opacity="0.18" />
        <rect x="38" y="52" width="96" height="9" rx="2" fill="#FFD22F" />
        <rect x="38" y="53" width="78" height="5" rx="2.5" fill="#111" opacity="0.3" />
        <rect x="38" y="70" width="70" height="5" rx="2.5" fill="#111" opacity="0.18" />
        <rect x="38" y="82" width="84" height="5" rx="2.5" fill="#111" opacity="0.18" />
        <g transform="translate(150 44) rotate(18)">
          <rect x="0" y="0" width="7" height="44" rx="3.5" fill="#111" />
          <path d="M0 44 L3.5 54 L7 44 Z" fill="#111" />
        </g>
      </svg>
    );
  }
  if (i === 1) {
    const bars = [14, 26, 40, 30, 52, 68, 44, 30, 58, 72, 46, 26, 38, 22, 14];
    return (
      <svg className="pcard-art" viewBox="0 0 240 110" aria-hidden="true">
        <g fill="#111">
          {bars.map((h, k) => (
            <rect key={k} x={44 + k * 10.5} y={(110 - h) / 2} width="5" height={h} rx="2.5" opacity={k < 7 ? 0.28 : 1} />
          ))}
        </g>
        <circle cx="30" cy="55" r="9" fill="#111" />
        <path d="M27 51.5 L34.5 55 L27 58.5 Z" fill="#FFD22F" />
      </svg>
    );
  }
  return (
    <svg className="pcard-art" viewBox="0 0 240 110" aria-hidden="true">
      <rect x="52" y="38" width="40" height="5" rx="2.5" fill="#F7F6F2" opacity="0.7" />
      <rect x="52" y="52" width="54" height="5" rx="2.5" fill="#F7F6F2" opacity="0.32" />
      <rect x="52" y="66" width="46" height="5" rx="2.5" fill="#F7F6F2" opacity="0.32" />
      <g fill="#F7F6F2">
        {[18, 34, 26, 44, 30, 20].map((h, k) => (
          <rect key={k} x={118 + k * 11} y={(110 - h) / 2} width="5" height={h} rx="2.5" opacity="0.55" />
        ))}
      </g>
      <rect x="182" y="34" width="38" height="42" rx="6" fill="#FFD22F" />
      <rect x="189" y="44" width="24" height="4" rx="2" fill="#111" />
      <rect x="189" y="53" width="18" height="4" rx="2" fill="#111" opacity="0.55" />
      <rect x="189" y="62" width="21" height="4" rx="2" fill="#111" opacity="0.55" />
    </svg>
  );
}


/** A mark for each of the three reasons: the four markets as a bar chart, a
 *  scorecard with the line that mattered, and a receipt with nothing on it. */
function ReasonArt({ i }: { i: number }) {
  if (i === 0) {
    const bars = [34, 52, 40, 62];
    return (
      <svg className="glass-art" viewBox="0 0 120 70" aria-hidden="true">
        {bars.map((h, k) => (
          <rect key={k} x={8 + k * 20} y={66 - h} width="12" height={h} rx="3" fill="#FFD22F" opacity={0.45 + k * 0.18} />
        ))}
        <rect x="4" y="66" width="104" height="2" rx="1" fill="#F7F6F2" opacity="0.35" />
      </svg>
    );
  }
  if (i === 1) {
    return (
      <svg className="glass-art" viewBox="0 0 120 70" aria-hidden="true">
        <rect x="6" y="8" width="108" height="54" rx="6" fill="#F7F6F2" opacity="0.1" />
        <rect x="16" y="20" width="56" height="5" rx="2.5" fill="#F7F6F2" opacity="0.45" />
        <rect x="16" y="33" width="80" height="8" rx="3" fill="#FFD22F" />
        <rect x="16" y="48" width="44" height="5" rx="2.5" fill="#F7F6F2" opacity="0.45" />
      </svg>
    );
  }
  return (
    <svg className="glass-art" viewBox="0 0 120 70" aria-hidden="true">
      <rect x="30" y="6" width="60" height="58" rx="5" fill="#F7F6F2" opacity="0.1" />
      <rect x="40" y="18" width="40" height="4" rx="2" fill="#F7F6F2" opacity="0.4" />
      <rect x="40" y="29" width="30" height="4" rx="2" fill="#F7F6F2" opacity="0.4" />
      <rect x="40" y="45" width="40" height="7" rx="3.5" fill="#FFD22F" />
      <path d="M46 48.5 L52 48.5" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      <path d="M62 48.5 L74 48.5" stroke="#111" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** The comparison, as a grid of marks rather than two columns of sentences:
 *  a filled dot where the tool can do it, a hollow one where it cannot. The
 *  shape of the two columns is the argument. */
function Matrix({ locale }: { locale: Locale }) {
  const c = t(locale).human;
  return (
    <div className="matrix" role="table" aria-label={`${c.aiTitle} / ${c.usTitle}`}>
      <div className="matrix-head" role="row">
        <span role="columnheader" />
        <span role="columnheader">{c.aiTitle}</span>
        <span role="columnheader" className="matrix-us">{c.usTitle}</span>
      </div>
      {c.matrix.map((r) => (
        <div className="matrix-row" key={r.row} role="row">
          <span role="cell">{r.row}</span>
          <span role="cell" className="matrix-cell">
            <i className={r.ai ? "dot dot-on" : "dot"} aria-hidden="true" />
            <em className="sr-only">{r.ai ? "yes" : "no"}</em>
          </span>
          <span role="cell" className="matrix-cell">
            <i className={r.us ? "dot dot-on dot-us" : "dot"} aria-hidden="true" />
            <em className="sr-only">{r.us ? "yes" : "no"}</em>
          </span>
        </div>
      ))}
    </div>
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
      <SiteHeader dark locale={locale} reviewsOnPage={reviews.length > 0} />
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

        {/* 2. The numbers, before any argument. Three figures the site can
            stand behind, on the ink the hero ends on. */}
        <section className="statband" aria-label={c.proof.leadStrong}>
          <div className="wrap statband-row">
            {c.proof.stats.map(([big, small]) => (
              <div key={big} className="statband-item">
                <span className="statband-big" data-kind={big.length > 10 ? "phrase" : "figure"}>
                  {big}
                </span>
                <span className="statband-small">{small}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. The hook, then how it works in three columns */}
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
                  <PackArt i={i} />
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
            {c.packs.assure.map(([, title, body]) => (
              <div className="assure-item" key={title}>
                <span className="assure-mark" aria-hidden="true">
                  <AssureIcon i={c.packs.assure.findIndex(([, x]) => x === title)} />
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
              {c.reasons.items.map((r, i) => (
                <div key={r.k} className="glass">
                  <ReasonArt i={i} />
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
            <Matrix locale={locale} />
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
        {/* 9. Ask before booking */}
        <section id="contact" className="wrap sec-mw" style={{ paddingTop: 0 }}>
          <div className="kicker">{c.contact.label}</div>
          <Title a={c.contact.h2} em={c.contact.h2em} />
          <p className="lead-mw" style={{ maxWidth: "36ch" }}>
            {c.contact.lead}
          </p>
          <div className="contact-grid">
            <ContactNote locale={locale} />
            <ContactForm locale={locale} />
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
