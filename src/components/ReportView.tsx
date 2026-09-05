import { prettyDate } from "@/lib/schedule";

type Score = { name: string; value: number };

export default function ReportView({
  report,
  booking,
  targetRole,
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
}) {
  const scores: Score[] = Array.isArray(report.scores) ? (report.scores as Score[]) : [];
  const toFix: string[] = Array.isArray(report.toFix) ? (report.toFix as string[]) : [];

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div
        style={{
          background: "#111",
          color: "#F4F2EA",
          padding: "24px 28px",
          borderBottom: "4px solid #FFD22F",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}
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
              Feedback report
            </div>
            <h2 className="serif" style={{ fontSize: 23, margin: "8px 0 0", color: "#fff" }}>
              Session of {prettyDate(booking.date)}
              {targetRole ? ` — ${targetRole}` : ""}
            </h2>
            <div style={{ fontSize: 13.5, color: "#A9A69C", marginTop: 6 }}>
              {report.interviewer ? `Interviewer: ${report.interviewer} · ` : ""}
              {booking.language === "EN" ? "English" : "Français"} · 30 min
            </div>
          </div>
          <div style={{ textAlign: "right", flex: "none" }}>
            <div className="serif" style={{ fontSize: 38, color: "#FFD22F", lineHeight: 1 }}>
              {report.overall.toFixed(1)}
            </div>
            <div style={{ fontSize: 12, color: "#A9A69C" }}>out of 5</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 28px" }}>
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
            <div className="eyebrow">What landed well</div>
            <p style={{ fontSize: 15, lineHeight: 1.62, color: "#3D3B34", margin: "10px 0 0", whiteSpace: "pre-wrap" }}>
              {report.whatLanded}
            </p>
          </div>
        )}

        {toFix.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <div className="eyebrow">What to fix before the real interview</div>
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
              {report.rewrittenTitle || "Rewritten answer"}
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
              <a className="btn btn-primary" href={report.reportUrl} target="_blank" rel="noreferrer">
                Download report (PDF)
              </a>
            )}
            {report.recordingUrl && (
              <a className="btn btn-ghost" href={report.recordingUrl} target="_blank" rel="noreferrer">
                Watch recording
              </a>
            )}
            <span style={{ fontSize: 13.5, color: "#86837A" }}>One follow-up question included</span>
          </div>
        )}
      </div>
    </div>
  );
}
