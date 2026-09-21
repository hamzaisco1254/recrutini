import { prettyDate } from "@/lib/schedule";
import { languageLabel } from "@/lib/brand";
import { t, type Locale } from "@/lib/i18n";

type Score = { name: string; value: number };

export default function ReportView({
  report,
  booking,
  targetRole,
  locale = "en",
}: {
  report: {
    interviewer: string;
    overall: number;
    scores: unknown;
    whatLanded: string;
    toFix: unknown;
    rewrittenTitle: string;
    rewrittenAnswer: string;
    recordingUrl: string | null;
    reportUrl: string | null;
  };
  booking: { date: string; time: string; language: string };
  targetRole?: string | null;
  locale?: Locale;
}) {
  const c = t(locale).report;
  const scores: Score[] = Array.isArray(report.scores) ? (report.scores as Score[]) : [];
  const toFix: string[] = Array.isArray(report.toFix) ? (report.toFix as string[]) : [];

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div
        className="report-pad"
        style={{
          background: "#111",
          color: "#F4F2EA",
          borderBottom: "4px solid #FFD22F",
        }}
      >
        <div className="report-head">
          <div>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#FFD22F",
              }}
            >
              {c.label}
            </div>
            <h2 className="serif" style={{ fontSize: "clamp(19px,4.6vw,23px)", margin: "8px 0 0", color: "#fff" }}>
              {c.sessionOf} {prettyDate(booking.date, locale)}
              {targetRole ? ` · ${targetRole}` : ""}
            </h2>
            <div style={{ fontSize: 13.5, color: "#A9A69C", marginTop: 6 }}>
              {report.interviewer ? `${c.interviewer} : ${report.interviewer} · ` : ""}
              {languageLabel(booking.language)} · 50 min
            </div>
          </div>
          <div style={{ textAlign: "right", flex: "none" }}>
            <div className="serif" style={{ fontSize: "clamp(30px,7vw,38px)", color: "#FFD22F", lineHeight: 1 }}>
              {report.overall.toFixed(1)}
            </div>
            <div style={{ fontSize: 12, color: "#A9A69C" }}>{c.outOf}</div>
          </div>
        </div>
      </div>

      <div className="report-pad">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {scores.map((row) => (
            <div key={row.name}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14.5,
                  color: "#26251F",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontWeight: 600 }}>{row.name}</span>
                <span style={{ color: "#56544C" }}>{Number(row.value).toFixed(1)} / 5</span>
              </div>
              <div
                style={{ height: 7, background: "#EDEBE3", borderRadius: 999, overflow: "hidden" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(Number(row.value) / 5) * 100}%`,
                    background: Number(row.value) < 3 ? "#FFD22F" : "#111",
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {report.whatLanded && (
          <div style={{ marginTop: 26, paddingTop: 22, borderTop: "1px solid #EDEBE3" }}>
            <div className="eyebrow">{c.landed}</div>
            <p style={{ fontSize: 15, lineHeight: 1.62, color: "#3D3B34", margin: "10px 0 0", whiteSpace: "pre-wrap" }}>
              {report.whatLanded}
            </p>
          </div>
        )}

        {toFix.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <div className="eyebrow">{c.toFix}</div>
            <ol
              style={{
                margin: "10px 0 0",
                paddingLeft: 22,
                fontSize: 15,
                lineHeight: 1.62,
                color: "#3D3B34",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {toFix.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ol>
          </div>
        )}

        {report.rewrittenAnswer && (
          <div
            style={{
              marginTop: 24,
              background: "#F1EFE7",
              borderLeft: "4px solid #FFD22F",
              borderRadius: 6,
              padding: "18px 20px",
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#14140F" }}>
              {report.rewrittenTitle || c.rewritten}
            </div>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.62,
                color: "#3D3B34",
                margin: "10px 0 0",
                fontStyle: "italic",
                whiteSpace: "pre-wrap",
              }}
            >
              {report.rewrittenAnswer}
            </p>
          </div>
        )}

        {(report.reportUrl || report.recordingUrl) && (
          <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {report.reportUrl && (
              <a className="btn btn-primary btn-block-sm" href={report.reportUrl} target="_blank" rel="noreferrer">
                {c.download}
              </a>
            )}
            {report.recordingUrl && (
              <a className="btn btn-ghost btn-block-sm" href={report.recordingUrl} target="_blank" rel="noreferrer">
                {c.recording}
              </a>
            )}
            <span style={{ fontSize: 13.5, color: "#86837A" }}>{c.followUp}</span>
          </div>
        )}
      </div>
    </div>
  );
}
