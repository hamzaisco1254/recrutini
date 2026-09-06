"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PACKS, PACK_LIST, type PackKey } from "@/lib/brand";
import type { DaySlots } from "@/lib/schedule";
import { submitBooking } from "./actions";

export default function BookingForm({
  days,
  initialPack,
  tzLabel,
}: {
  days: DaySlots[];
  initialPack: PackKey;
  tzLabel: string;
}) {
  const router = useRouter();
  const [pack, setPack] = useState<PackKey>(initialPack);
  const [dateIdx, setDateIdx] = useState(0);
  const [time, setTime] = useState<string>("");
  const [language, setLanguage] = useState<"EN" | "FR">("EN");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    targetRole: "",
    cvLink: "",
    linkedinUrl: "",
    jobPostingUrl: "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const needsSlot = PACKS[pack].includesInterview;
  const day = days[dateIdx];

  const summary = useMemo(() => {
    if (!needsSlot) return `${PACKS[pack].title} · ${PACKS[pack].price} dt`;
    if (!day || !time) return "Pick a date and a time to continue.";
    return `${day.dow} ${day.num} ${day.month}, ${time} · 30 min · ${
      language === "EN" ? "English" : "Français"
    } · ${PACKS[pack].price} dt`;
  }, [needsSlot, pack, day, time, language]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitBooking({
        pack,
        ...form,
        language,
        date: needsSlot ? day?.date ?? "" : "",
        time: needsSlot ? time : "",
      });
      if (res.ok) {
        router.push(`/status/${res.ref}?new=1`);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 24 }}>
      {/* Pack picker */}
      <section className="card pad-card">
        <h2 className="serif" style={{ fontSize: 23, margin: 0 }}>
          1. Your pack
        </h2>
        <div className="pack-grid">
          {PACK_LIST.map((p) => {
            const on = p.key === pack;
            return (
              <button
                type="button"
                key={p.key}
                onClick={() => setPack(p.key)}
                style={{
                  textAlign: "left",
                  border: `1px solid ${on ? "#111" : "#DCD9CE"}`,
                  background: on ? "#111" : "#FCFCFA",
                  color: on ? "#fff" : "#26251F",
                  borderRadius: 8,
                  padding: 16,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div
                  style={{
                    fontSize: 11.5,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: on ? "#FFD22F" : "#86837A",
                  }}
                >
                  {p.number}
                </div>
                <div className="serif" style={{ fontSize: 19, marginTop: 6 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 14, marginTop: 6, opacity: 0.85 }}>
                  {p.price} dt{p.duration ? ` · ${p.duration}` : ""}
                </div>
              </button>
            );
          })}
        </div>
        <ul
          style={{
            margin: "18px 0 0",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 14.5,
            color: "#3D3B34",
          }}
        >
          {PACKS[pack].bullets.map((b) => (
            <li key={b} style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "#C9A400" }}>—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Slot picker */}
      {needsSlot && (
        <section className="card pad-card">
          <h2 className="serif" style={{ fontSize: 23, margin: 0 }}>
            2. Your 30 minutes
          </h2>
          <p style={{ fontSize: 15, color: "#56544C", lineHeight: 1.55, margin: "10px 0 0" }}>
            Sessions run 30 minutes with no break. Reschedule up to 12 hours before.
          </p>

          <label className="lbl" style={{ marginTop: 26 }}>
            Language of the session
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="chip"
              data-on={language === "EN"}
              style={{ flex: 1 }}
              onClick={() => setLanguage("EN")}
            >
              English
            </button>
            <button
              type="button"
              className="chip"
              data-on={language === "FR"}
              style={{ flex: 1 }}
              onClick={() => setLanguage("FR")}
            >
              Français
            </button>
          </div>

          <label className="lbl" style={{ marginTop: 26 }}>
            Date
          </label>
          {days.length === 0 ? (
            <p style={{ fontSize: 15, color: "#56544C" }}>
              No slots are open at the moment. Send us a note below and we&apos;ll open one for you.
            </p>
          ) : (
            <div className="date-grid">
              {days.map((d, i) => {
                const on = i === dateIdx;
                return (
                  <button
                    type="button"
                    key={d.date}
                    onClick={() => {
                      setDateIdx(i);
                      setTime("");
                    }}
                    style={{
                      border: `1px solid ${on ? "#111" : "#DCD9CE"}`,
                      background: on ? "#111" : "#FCFCFA",
                      color: on ? "#fff" : "#26251F",
                      fontFamily: "inherit",
                      padding: "12px 6px",
                      borderRadius: 8,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11.5,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        opacity: 0.75,
                      }}
                    >
                      {d.dow}
                    </div>
                    <div className="serif" style={{ fontSize: 22, marginTop: 2 }}>
                      {d.num}
                    </div>
                    <div style={{ fontSize: 10.5, opacity: 0.6 }}>{d.month}</div>
                  </button>
                );
              })}
            </div>
          )}

          {day && (
            <>
              <label className="lbl" style={{ marginTop: 26 }}>
                Time — {tzLabel}
              </label>
              <div className="time-grid">
                {day.slots.map((s) => (
                  <button
                    type="button"
                    key={s.time}
                    className="chip"
                    disabled={s.taken}
                    data-on={time === s.time}
                    onClick={() => setTime(s.time)}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Details */}
      <section className="card pad-card">
        <h2 className="serif" style={{ fontSize: 23, margin: 0 }}>
          {needsSlot ? "3." : "2."} Your details
        </h2>
        <div className="field-grid">
          <div>
            <label className="lbl">Full name</label>
            <input
              className="field"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Amine Ben Salah"
            />
          </div>
          <div>
            <label className="lbl">Email</label>
            <input
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="lbl">Phone (optional)</label>
            <input
              className="field"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+216 ..."
            />
          </div>
          <div>
            <label className="lbl">Target role</label>
            <input
              className="field"
              value={form.targetRole}
              onChange={(e) => set("targetRole", e.target.value)}
              placeholder="Product Marketing Manager"
            />
          </div>
          <div>
            <label className="lbl">Link to your CV (Drive / Dropbox)</label>
            <input
              className="field"
              type="url"
              inputMode="url"
              autoCapitalize="none"
              spellCheck={false}
              value={form.cvLink}
              onChange={(e) => set("cvLink", e.target.value)}
              placeholder="https://drive.google.com/..."
            />
          </div>
          <div>
            <label className="lbl">LinkedIn profile</label>
            <input
              className="field"
              type="url"
              inputMode="url"
              autoCapitalize="none"
              spellCheck={false}
              value={form.linkedinUrl}
              onChange={(e) => set("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          {needsSlot && (
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="lbl">Job posting (link)</label>
              <input
                className="field"
                value={form.jobPostingUrl}
                onChange={(e) => set("jobPostingUrl", e.target.value)}
                placeholder="Paste the posting you are preparing for"
              />
            </div>
          )}
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="lbl">Anything we should know</label>
            <textarea
              className="field"
              rows={4}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Career change, sector you are targeting, deadlines..."
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: 18,
              background: "#F6EEEE",
              border: "1px solid #E3CCCC",
              color: "#8A3B3B",
              borderRadius: 6,
              padding: "12px 14px",
              fontSize: 14.5,
            }}
          >
            {error}
          </div>
        )}

        <div className="submit-row">
          <div style={{ fontSize: 14.5, color: "#56544C", lineHeight: 1.5 }}>{summary}</div>
          <button
            type="submit"
            className="btn btn-primary btn-block-sm submit-btn"
            disabled={pending || (needsSlot && (!day || !time))}
          >
            {pending ? "Sending..." : needsSlot ? "Request this session" : "Send my request"}
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#86837A", marginTop: 12 }}>
          Nothing is charged online. We confirm your slot by email with payment instructions.
        </p>
      </section>
    </form>
  );
}
