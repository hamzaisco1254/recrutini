import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Image from "next/image";
import { BRAND, CREDENTIALS, FOUNDER, PACK_LIST, STUDENT_OFFER } from "@/lib/brand";

export const dynamic = "force-static";

const FAQS = [
  {
    q: "Do you write the CV from scratch?",
    a: "We rewrite from what you already have, plus a short intake. If you have no CV yet, tell us and we start from the intake alone.",
  },
  {
    q: "Can the interview be in French?",
    a: "Yes. Sessions and reports are available in English or French. Choose when you book, or ask for one of each if you are applying in both languages.",
  },
  {
    q: "I'm changing careers. Does this still work?",
    a: 'It is where the work matters most. The rewrite reframes what you have done around the role you want next, and the simulation prepares you for the "why this change" question you will certainly be asked.',
  },
  {
    q: "What happens to my documents?",
    a: "They stay with the recruiter working on your file and are deleted on request. Recordings are shared with you only.",
  },
  {
    q: "How do I pay?",
    a: "Book first, pay after. You receive payment instructions with your confirmation — bank transfer, D17 or cash before the session. Your slot is held for 48 hours. Students on the free offer pay nothing at all.",
  },
  {
    q: "I'm a student looking for a PFE. How does the free offer work?",
    a: "Book the pack you want and tick the student box, then upload a photo of your student card. We check it by hand and confirm your file the same day. There is nothing to pay and we never ask for card details. The card is used only to confirm you are a student, and we delete it on request.",
  },
  {
    q: "Who actually works on my file?",
    a: "Experienced recruiters from the IT field and occupational psychologists, qualified and with international experience. The person who rewrites your CV is the same kind of person who reads it on the hiring side.",
  },
];

const STEPS = [
  {
    n: "01",
    label: "Step one",
    title: "You pick a pack",
    body: "No call needed first. A short intake form asks for your CV and your target roles.",
  },
  {
    n: "02",
    label: "Step two",
    title: "We draft",
    body: "A recruiter rewrites your material and sends the first version within four working days.",
  },
  {
    n: "03",
    label: "Step three",
    title: "You react, we revise",
    body: "Comment on anything that doesn't sound like you. Two rounds are included.",
  },
  {
    n: "04",
    label: "Step four",
    title: "You practise",
    body: "Book the simulation whenever you have a real interview coming up.",
  },
];

const SIM_STEPS = [
  {
    n: "01",
    title: "Intake, 24h before",
    body: "Job posting, your CV, the company. We prepare the question set.",
  },
  {
    n: "02",
    title: "50 minutes, video, unbroken",
    body: "No pausing, no restarts. It should feel like the real thing.",
  },
  {
    n: "03",
    title: "Feedback report, within 48h",
    body: "Scores across five competencies, quoted moments, rewritten answers.",
  },
  {
    n: "04",
    title: "One follow-up message",
    body: "Ask us anything about the report once you've read it.",
  },
];

const STATS = [
  ["800+", "interviews conducted by the recruiter you meet"],
  ["4 days", "typical turnaround on a rewrite"],
  ["EN / FR", "sessions and reports, your choice"],
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      <SiteHeader dark />
      <main>
        {/* Hero */}
        <section className="hero">
          <div className="wrap sec-lg hero-grid">
            <div>
              <div className="hero-eyebrow">Bilingual EN / FR</div>
              {STUDENT_OFFER.on && (
                <Link href="#students" className="hero-flag">
                  <span className="hero-flag-tag">Free</span>
                  <span>{STUDENT_OFFER.short}</span>
                </Link>
              )}
              <h1 className="serif display">
                You have the experience. Let&apos;s make it{" "}
                <em>read that way.</em>
              </h1>
              <p className="hero-lead">
                We rewrite your CV, rebuild your LinkedIn profile, and put you through a real
                50-minute interview simulation with written feedback. Done by recruiters who have sat
                on the hiring side of the table.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
                <Link
                  href="#packs"
                  className="btn btn-yellow btn-block-sm"
                  style={{ padding: "16px 28px", fontSize: 15.5 }}
                >
                  Choose your pack
                </Link>
                <Link
                  href="#process"
                  className="btn btn-block-sm"
                  style={{
                    padding: "16px 28px",
                    fontSize: 15.5,
                    border: "1px solid #3A3A3A",
                    background: "transparent",
                    color: "#E6E4DC",
                  }}
                >
                  See how it works
                </Link>
              </div>
              <p className="hero-note">
                Most deliveries within 4 working days. Two rounds of revisions included.
              </p>
            </div>

            <div className="hero-panel hide-sm">
              <div className="serif panel-num">50 min</div>
              <p className="panel-copy">
                A full interview simulation with a written report, before the one that counts.
              </p>
              <span className="panel-tag">CV · LinkedIn · Interview</span>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section
          style={{
            borderBottom: "1px solid #E4E2DA",
            background: "#F1EFE7",
          }}
        >
          <div className="wrap" style={{ paddingTop: 36, paddingBottom: 36 }}>
            <div className="stats">
              {STATS.map(([big, small]) => (
                <div className="stat" key={big}>
                  <div className="serif stat-big">{big}</div>
                  <div className="stat-small">{small}</div>
                </div>
              ))}
              <div className="stat" style={{ borderLeft: "none" }}>
                <p className="stat-note">{CREDENTIALS}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Packs */}
        <section id="packs" className="wrap sec">
          <div className="sec-head">
            <span className="sec-num">01</span>
            <div>
              <h2 className="serif h2">Choose your pack</h2>
              <p style={{ fontSize: 17, color: "#56544C", maxWidth: "54ch", margin: "14px 0 0" }}>
                Fix your CV and LinkedIn together, rehearse one interview for the role you are
                chasing, or take the full pack and be coached all the way to the offer.
              </p>
            </div>
          </div>

          <div className="grid-auto" style={{ marginTop: 44, alignItems: "stretch" }}>
            {PACK_LIST.map((pack) => {
              const dark = pack.featured;
              return (
                <div key={pack.key} className={`pack${dark ? " pack-featured" : ""}`}>
                  {pack.featured ? (
                    <span className="pack-flag">Best value</span>
                  ) : (
                    <span className="serif pack-ghost" aria-hidden="true">
                      {pack.number.replace("Pack ", "")}
                    </span>
                  )}
                  <div className="pack-head">
                    <div
                      style={{
                        fontSize: 11.5,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: dark ? "#FFD22F" : "#86837A",
                      }}
                    >
                      {pack.number}
                    </div>
                    <h3
                      className="serif"
                      style={{
                        fontSize: 23,
                        margin: "10px 0 0",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.15,
                        color: dark ? "#fff" : undefined,
                      }}
                    >
                      {pack.title}
                    </h3>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                      flexWrap: "nowrap",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span className="serif pack-price" style={{ color: dark ? "#fff" : undefined }}>
                      {pack.price} dt
                    </span>
                    {pack.strike && (
                      <span
                        style={{ fontSize: 14, color: "#A9A69C", textDecoration: "line-through" }}
                      >
                        {pack.strike} dt
                      </span>
                    )}
                    {pack.duration && (
                      <span style={{ fontSize: 14, color: dark ? "#A9A69C" : "#86837A" }}>
                        {pack.duration}
                      </span>
                    )}
                  </div>

                  <ul className="pack-list">
                    {pack.bullets.map((b) => (
                      <li key={b}>
                        <span className="tick" aria-hidden="true">
                          —
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/book?pack=${pack.key}`}
                    className={`btn ${dark ? "btn-yellow" : "btn-ghost"}`}
                    style={{ marginTop: "auto", width: "100%", padding: 13, fontSize: 14.5 }}
                  >
                    {dark ? "Take the full pack" : "Choose this pack"}
                  </Link>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: "#86837A", marginTop: 20 }}>
            Sessions available in English or French, weekdays and Saturday mornings. Payment on
            confirmation — bank transfer, D17 or cash.
          </p>

          {STUDENT_OFFER.on && (
            <div id="students" className="student-band">
              <span className="student-flag">Free</span>
              <div>
                <h3 className="serif student-title">{STUDENT_OFFER.title}</h3>
                <p className="student-body">{STUDENT_OFFER.body}</p>
                <div className="student-actions">
                  <Link href="/book?pack=FULL&student=1" className="btn btn-yellow btn-block-sm">
                    Book as a student
                  </Link>
                  <span className="student-meta">
                    Student card checked by hand · Deleted on request
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* The simulation */}
        <section id="interview" className="band-yellow">
          <div
            className="wrap sec"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))",
              gap: 48,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(17,17,17,0.68)",
                }}
              >
                02 — The 50-minute simulation
              </div>
              <h2 className="serif h2" style={{ margin: "20px 0 0" }}>
                A real interview, before the one that counts
              </h2>
              <p
                style={{
                  fontSize: 17.5,
                  lineHeight: 1.62,
                  color: "rgba(17,17,17,0.78)",
                  maxWidth: "46ch",
                  margin: "22px 0 0",
                }}
              >
                You send us the job posting. We run the interview a hiring manager for that role
                would actually run — competency questions, pressure follow-ups, salary conversation.
                Then we tell you, plainly, what worked and what didn&apos;t.
              </p>
              <Link
                href="/book?pack=INTERVIEW"
                className="btn btn-primary btn-block-sm"
                style={{ marginTop: 32, padding: "15px 26px" }}
              >
                Book a simulation
              </Link>
            </div>
            <div>
              {SIM_STEPS.map((s) => (
                <div key={s.n} className="sim-step">
                  <span className="serif sim-num">{s.n}</span>
                  <div>
                    <div className="sim-title">{s.title}</div>
                    <div className="sim-body">{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Founder */}
        <section id="founder" className="wrap sec founder">
          <div className="founder-photo">
            <div className="founder-photo-block" aria-hidden="true" />
            <Image
              src={FOUNDER.photo}
              alt={`${FOUNDER.name}, founder of ${BRAND.name}`}
              width={400}
              height={400}
              sizes="(max-width: 720px) 230px, 264px"
              className="founder-img"
              priority={false}
            />
          </div>

          <div>
            <div className="sec-num" style={{ display: "block" }}>
              03 — Who you work with
            </div>
            <h2 className="serif h2" style={{ marginTop: 14 }}>
              Meet the founder
            </h2>
            <div className="founder-name serif">{FOUNDER.name}</div>
            <div className="founder-role">{FOUNDER.role}</div>

            <div className="founder-stats">
              {FOUNDER.stats.map(([big, small]) => (
                <div key={big}>
                  <div className="serif founder-stat-big">{big}</div>
                  <div className="founder-stat-small">{small}</div>
                </div>
              ))}
            </div>

            {FOUNDER.bio.map((para) => (
              <p key={para.slice(0, 24)} className="founder-bio">
                {para}
              </p>
            ))}

            <div className="founder-creds">
              {FOUNDER.credentials.map((c) => (
                <div key={c.title} className="cred">
                  <div className="cred-title">{c.title}</div>
                  <div className="cred-org">{c.org}</div>
                </div>
              ))}
            </div>

            <a
              href={FOUNDER.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-block-sm"
              style={{ marginTop: 26 }}
            >
              See the full profile on LinkedIn
            </a>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="wrap sec">
          <div className="sec-head">
            <span className="sec-num">04</span>
            <h2 className="serif h2">How working together goes</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(220px,100%),1fr))",
              gap: 28,
              marginTop: 44,
            }}
          >
            {STEPS.map((s) => (
              <div key={s.title} className="step">
                <div className="serif step-num">{s.n}</div>
                <div className="eyebrow" style={{ marginTop: 10 }}>
                  {s.label}
                </div>
                <h3 className="serif step-title">{s.title}</h3>
                <p className="step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ borderTop: "1px solid #E4E2DA", background: "#F1EFE7" }}>
          <div
            className="wrap sec"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))",
              gap: 40,
              alignItems: "start",
            }}
          >
            <div>
              <span className="sec-num" style={{ display: "block", marginBottom: 12 }}>
                05
              </span>
              <h2 className="serif h2">Questions candidates ask</h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "#56544C",
                  margin: "16px 0 0",
                  maxWidth: "34ch",
                }}
              >
                Anything else, write to us. We answer within a day.
              </p>
              <a
                href={`mailto:${BRAND.email}`}
                style={{
                  display: "inline-block",
                  marginTop: 18,
                  fontSize: 15.5,
                  fontWeight: 600,
                  borderBottom: "3px solid #FFD22F",
                  paddingBottom: 2,
                }}
              >
                {BRAND.email}
              </a>
            </div>
            <div>
              {FAQS.map((f) => (
                <details key={f.q} className="faq-item">
                  <summary>{f.q}</summary>
                  <p className="faq-answer">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
