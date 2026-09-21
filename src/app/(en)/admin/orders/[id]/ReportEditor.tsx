"use client";

import { useState } from "react";
import { saveReport } from "@/server/admin";

type Score = { name: string; value: number };

const DEFAULT_SCORES: Score[] = [
  { name: "Role knowledge", value: 3 },
  { name: "Structured answers (STAR)", value: 3 },
  { name: "Evidence and numbers", value: 3 },
  { name: "Career-change narrative", value: 3 },
  { name: "Salary and closing", value: 3 },
];

export default function ReportEditor({
  bookingId,
  orderId,
  report,
}: {
  bookingId: string;
  orderId: string;
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
    published: boolean;
  } | null;
}) {
  const initial: Score[] =
    report && Array.isArray(report.scores) && (report.scores as Score[]).length
      ? (report.scores as Score[])
      : DEFAULT_SCORES;
  const [scores, setScores] = useState<Score[]>(initial);

  function update(i: number, patch: Partial<Score>) {
    setScores((s) => s.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  const toFixText = Array.isArray(report?.toFix) ? (report!.toFix as string[]).join("\n") : "";

  return (
    <form action={saveReport} className="card pad-card">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="orderId" value={orderId} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 className="serif" style={{ fontSize: 22, margin: 0, marginRight: "auto" }}>
          Feedback report
        </h2>
        <label
          style={{
            fontSize: 14.5,
            display: "flex",
            alignItems: "center",
            gap: 10,
            minHeight: 44,
          }}
        >
          <input
            type="checkbox"
            name="published"
            defaultChecked={report?.published ?? false}
            style={{ width: 20, height: 20 }}
          />
          Visible to the client
        </label>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(200px,100%),1fr))",
          gap: 14,
          marginTop: 20,
        }}
      >
        <div>
          <label className="lbl">Interviewer</label>
          <input className="field" name="interviewer" defaultValue={report?.interviewer ?? ""} placeholder="Claire M., ex-Talent Partner" />
        </div>
        <div>
          <label className="lbl">Overall (blank = average)</label>
          <input
            className="field"
            name="overall"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={report?.overall ? String(report.overall) : ""}
          />
        </div>
      </div>

      <label className="lbl" style={{ marginTop: 22 }}>
        Competency scores
      </label>
      <div style={{ display: "grid", gap: 10 }}>
        {scores.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              className="field"
              name="scoreName"
              value={s.name}
              onChange={(e) => update(i, { name: e.target.value })}
              style={{ flex: 1 }}
            />
            <input
              className="field"
              name="scoreValue"
              type="number"
              step="0.5"
              min="0"
              max="5"
              value={s.value}
              onChange={(e) => update(i, { value: Number(e.target.value) })}
              style={{ width: 84, flex: "none" }}
            />
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: "10px 12px", fontSize: 13 }}
              onClick={() => setScores((rows) => rows.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-ghost"
        style={{ marginTop: 10, fontSize: 13.5, padding: "10px 16px" }}
        onClick={() => setScores((rows) => [...rows, { name: "", value: 3 }])}
      >
        Add a competency
      </button>

      <div style={{ marginTop: 22 }}>
        <label className="lbl">What landed well</label>
        <textarea className="field" name="whatLanded" rows={3} defaultValue={report?.whatLanded ?? ""} />
      </div>

      <div style={{ marginTop: 16 }}>
        <label className="lbl">What to fix — one per line</label>
        <textarea className="field" name="toFix" rows={4} defaultValue={toFixText} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        <div>
          <label className="lbl">Rewritten answer — heading</label>
          <input
            className="field"
            name="rewrittenTitle"
            defaultValue={report?.rewrittenTitle ?? ""}
            placeholder='Rewritten answer — "Why this change?"'
          />
        </div>
        <div>
          <label className="lbl">Recording link</label>
          <input className="field" name="recordingUrl" defaultValue={report?.recordingUrl ?? ""} />
        </div>
        <div>
          <label className="lbl">Report PDF link</label>
          <input className="field" name="reportUrl" defaultValue={report?.reportUrl ?? ""} />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <label className="lbl">Rewritten answer — text</label>
        <textarea
          className="field"
          name="rewrittenAnswer"
          rows={4}
          defaultValue={report?.rewrittenAnswer ?? ""}
        />
      </div>

      <button className="btn btn-primary" style={{ marginTop: 20 }}>
        Save report
      </button>
    </form>
  );
}
