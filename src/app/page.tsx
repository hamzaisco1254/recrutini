import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BRAND, PACK_LIST } from "@/lib/brand";

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
    a: "It is where the work matters most. The rewrite reframes what you have done around the role you want next, and the simulation prepares you for the \"why this change\" question you will certainly be asked.",
  },
  {
    q: "What happens to my documents?",
    a: "They stay with the recruiter working on your file and are deleted on request. Recordings are shared with you only.",
  },
  {
    q: "How do I pay?",
    a: "Book first, pay after. You receive payment instructions with your confirmation — bank transfer, D17 or cash before the session. Your slot is held for 48 hours.",
  },
];

const STEPS = [
  {
    label: "Step one",
    title: "You pick a pack",
    body: "No call needed first. A short intake form asks for your CV and your target roles.",
  },
  {
    label: "Step two",
    title: "We draft",
    body: "A recruiter rewrites your material and sends the first version within four working days.",
  },
  {
    label: "Step three",
    title: "You react, we revise",
    body: "Comment on anything that doesn't sound like you. Two rounds are included.",
  },
  {
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
    title: "30 minutes, video, unbroken",
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

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="wrap sec-lg hero-grid">
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #DCD9CE",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 12.5,
                letterSpacing: "0.04em",
                color: "#14140F",
                background: "#FFD22F",
              }}
            >
              Bilingual EN / FR — CV, LinkedIn &amp; interview coaching
            </div>
            <h1
              className="serif"
              style={{
                fontSize: "clamp(33px,7vw,64px)",
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
                margin: "20px 0 0",
                textWrap: "pretty",
              }}
            >
              You have the experience. Let&apos;s make it read that way.
            </h1>
            <p
              style={{
                fontSize: "clamp(16.5px,4.4vw,18.5px)",
                lineHeight: 1.6,
                color: "#56544C",
                maxWidth: "52ch",
                margin: "20px 0 0",
              }}
            >
              We rewrite your CV, rebuild your LinkedIn profile, and put you through a real 30-minute
              interview simulation with written feedback. Done by recruiters who have sat on the
              hiring side of the table.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
              <Link
                href="#packs"
                className="btn btn-primary btn-block-sm"
                style={{ padding: "15px 26px" }}
              >
                Choose your pack
              </Link>
              <Link
                href="#process"
                className="btn btn-ghost btn-block-sm"
                style={{ padding: "15px 26px" }}
              >
                See how it works
              </Link>
            </div>
            <p style={{ fontSize: 13.5, color: "#86837A", marginTop: 20 }}>
              Most deliveries within 4 working days. Two rounds of revisions included.
            </p>
          </div>
          <div style={{ position: "relative" }} className="hide-sm">
            <div
              style={{
                position: "absolute",
                inset: "-14px 14px 14px -14px",
                background: "#FFD22F",
                borderRadius: 10,
              }}
            />
            <div
              style={{
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                background: "#EBE9E1",
                height: 420,
                display: "grid",
                placeItems: "center",
                border: "1px solid #E4E2DA",
              }}
            >
              <div style={{ textAlign: "center", padding: 28 }}>
                <div className="serif" style={{ fontSize: 44, color: "#14140F" }}>
                  30 min
                </div>
                <div style={{ fontSize: 15, color: "#56544C", marginTop: 8, maxWidth: "26ch" }}>
                  A full interview simulation with a written report, before the one that counts.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section
          style={{
            borderTop: "1px solid #E4E2DA",
            borderBottom: "1px solid #E4E2DA",
            background: "#F1EFE7",
          }}
        >
          <div
            className="wrap"
            style={{
              paddingTop: 32,
              paddingBottom: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 28,
            }}
          >
            {[
              ["4 days", "typical turnaround on a rewrite"],
              ["2 rounds", "of revisions included in every pack"],
              ["EN / FR", "sessions and reports, your choice"],
            ].map(([big, small]) => (
              <div key={big}>
                <div className="serif" style={{ fontSize: 34, color: "#14140F" }}>
                  {big}
                </div>
                <div style={{ fontSize: 14, color: "#56544C", marginTop: 4 }}>{small}</div>
              </div>
            ))}
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "#56544C",
                borderLeft: "3px solid #FFD22F",
                paddingLeft: 24,
              }}
            >
              Your documents are reviewed by former in-house recruiters and talent partners, not
              generalist writers.
            </div>
          </div>
        </section>

        {/* Packs */}
        <section id="packs" className="wrap sec-lg" style={{ paddingBottom: 24 }}>
          <h2
            className="serif"
            style={{ fontSize: "clamp(27px,5.5vw,44px)", letterSpacing: "-0.015em", margin: 0 }}
          >
            Choose your pack
          </h2>
          <p style={{ fontSize: 17, color: "#56544C", maxWidth: "56ch", margin: "14px 0 0" }}>
            Start with one document, or take the full pack and walk into your next interview already
            having practised it.
          </p>

          <div className="grid-auto" style={{ marginTop: 40, alignItems: "stretch" }}>
            {PACK_LIST.map((pack) => {
              const dark = pack.featured;
              return (
                <div
                  key={pack.key}
                  style={{
                    background: dark ? "#111" : "#fff",
                    color: dark ? "#F4F2EA" : undefined,
                    border: dark ? "none" : "1px solid #E4E2DA",
                    borderRadius: 10,
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    boxShadow: dark ? "0 18px 40px -24px rgba(0,0,0,0.5)" : undefined,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 10,
                      minHeight: 72,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: dark ? "#FFD22F" : "#86837A",
                        }}
                      >
                        {pack.number}
                      </div>
                      <h3
                        className="serif"
                        style={{ fontSize: 24, margin: "8px 0 0", color: dark ? "#fff" : undefined }}
                      >
                        {pack.title}
                      </h3>
                    </div>
                    {pack.featured && (
                      <span
                        style={{
                          flex: "none",
                          background: "#FFD22F",
                          color: "#111",
                          fontSize: 10.5,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          padding: "6px 9px",
                          borderRadius: 999,
                        }}
                      >
                        Best value
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span
                      className="serif"
                      style={{ fontSize: 36, color: dark ? "#fff" : undefined }}
                    >
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
                      <span style={{ fontSize: 14, color: "#86837A" }}>{pack.duration}</span>
                    )}
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      fontSize: 14.5,
                      lineHeight: 1.5,
                      color: dark ? "#E6E4DC" : "#3D3B34",
                    }}
                  >
                    {pack.bullets.map((b) => (
                      <li key={b} style={{ display: "flex", gap: 10 }}>
                        <span style={{ color: dark ? "#FFD22F" : "#C9A400" }}>—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/book?pack=${pack.key}`}
                    className={`btn ${dark ? "btn-yellow" : "btn-ghost"}`}
                    style={{ marginTop: "auto", width: "100%", padding: 12, fontSize: 14.5 }}
                  >
                    {dark ? "Take the full pack" : "Choose this pack"}
                  </Link>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: "#86837A", marginTop: 18 }}>
            Sessions available in English or French, weekdays and Saturday mornings. Payment on
            confirmation — bank transfer, D17 or cash.
          </p>
        </section>

        {/* Interview */}
        <section id="interview" style={{ background: "#111", color: "#F4F2EA", marginTop: 64 }}>
          <div
            className="wrap sec"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 40,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#FFD22F",
                }}
              >
                The 30-minute simulation
              </div>
              <h2
                className="serif"
                style={{
                  fontSize: "clamp(27px,5.5vw,44px)",
                  letterSpacing: "-0.015em",
                  margin: "18px 0 0",
                  color: "#fff",
                }}
              >
                A real interview, before the one that counts
              </h2>
              <p
                style={{
                  fontSize: 17.5,
                  lineHeight: 1.62,
                  color: "#E6E4DC",
                  maxWidth: "48ch",
                  margin: "20px 0 0",
                }}
              >
                You send us the job posting. We run the interview a hiring manager for that role
                would actually run — competency questions, pressure follow-ups, salary conversation.
                Then we tell you, plainly, what worked and what didn&apos;t.
              </p>
              <Link
                href="/book?pack=INTERVIEW"
                className="btn btn-yellow btn-block-sm"
                style={{ marginTop: 30, padding: "14px 24px" }}
              >
                Book a simulation
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {SIM_STEPS.map((s, i) => (
                <div
                  key={s.n}
                  style={{
                    borderTop: "1px solid #2E2E2E",
                    borderBottom: i === SIM_STEPS.length - 1 ? "1px solid #2E2E2E" : undefined,
                    padding: "20px 0",
                    display: "flex",
                    gap: 18,
                  }}
                >
                  <span
                    className="serif"
                    style={{ fontSize: 20, color: "#FFD22F", flex: "none", width: 32 }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <div style={{ fontSize: 16.5, fontWeight: 600, color: "#fff" }}>{s.title}</div>
                    <div
                      style={{
                        fontSize: 15,
                        color: "#A9A69C",
                        lineHeight: 1.55,
                        marginTop: 4,
                      }}
                    >
                      {s.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="wrap sec">
          <h2
            className="serif"
            style={{ fontSize: "clamp(27px,5.5vw,44px)", letterSpacing: "-0.015em", margin: 0 }}
          >
            How working together goes
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 28,
              marginTop: 40,
            }}
          >
            {STEPS.map((s) => (
              <div key={s.title}>
                <div style={{ width: 28, height: 4, background: "#FFD22F" }} />
                <div className="eyebrow" style={{ marginTop: 14 }}>
                  {s.label}
                </div>
                <h3 className="serif" style={{ fontSize: 21, margin: "8px 0" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.58, color: "#56544C", margin: 0 }}>
                  {s.body}
                </p>
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
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 32,
              alignItems: "start",
            }}
          >
            <div>
              <h2
                className="serif"
                style={{ fontSize: "clamp(26px,5vw,40px)", letterSpacing: "-0.015em", margin: 0 }}
              >
                Questions candidates ask
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "#56544C",
                  margin: "14px 0 0",
                  maxWidth: "36ch",
                }}
              >
                Anything else, write to us. We answer within a day.
              </p>
              <a
                href={`mailto:${BRAND.email}`}
                style={{
                  display: "inline-block",
                  marginTop: 16,
                  fontSize: 15.5,
                  fontWeight: 600,
                  borderBottom: "3px solid #FFD22F",
                }}
              >
                {BRAND.email}
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {FAQS.map((f, i) => (
                <details
                  key={f.q}
                  style={{
                    borderTop: "1px solid #DCD9CE",
                    borderBottom: i === FAQS.length - 1 ? "1px solid #DCD9CE" : undefined,
                    padding: "18px 0",
                  }}
                >
                  <summary
                    style={{
                      fontSize: 16.5,
                      fontWeight: 600,
                      color: "#26251F",
                      cursor: "pointer",
                      listStyle: "none",
                      paddingTop: 4,
                      paddingBottom: 4,
                      minHeight: 32,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {f.q}
                  </summary>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "#56544C", margin: "10px 0 0" }}>
                    {f.a}
                  </p>
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
