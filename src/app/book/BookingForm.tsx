"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PACKS, PACK_LIST, STUDENT_OFFER, type PackKey } from "@/lib/brand";
import type { DaySlots } from "@/lib/schedule";
import { submitBooking } from "./actions";

export default function BookingForm({
  days,
  initialPack,
  initialStudent = false,
  tzLabel,
}: {
  days: DaySlots[];
  initialPack: PackKey;
  initialStudent?: boolean;
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
  const [isStudent, setIsStudent] = useState(initialStudent && STUDENT_OFFER.on);
  const [cardUrl, setCardUrl] = useState("");
  const [cardName, setCardName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const needsSlot = PACKS[pack].includesInterview;
  const day = days[dateIdx];
  const price = isStudent ? 0 : PACKS[pack].price;
  const priceLabel = isStudent ? "free — student offer" : `${price} dt`;

  async function onCardChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    if (file.size > 6 * 1024 * 1024) {
      setUploadError("That file is over 6 MB. Please upload a smaller photo.");
      return;
    }
    setUploading(true);
    try {
      const { upload } = await import("@vercel/blob/client");
      const blob = await upload(`student-cards/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/student-card",
      });
      setCardUrl(blob.url);
      setCardName(file.name);
    } catch {
      setUploadError(
        "We couldn't upload that file. Try again, or email your card to hello@recruitini.tn and we'll sort it out.",
      );
    } finally {
      setUploading(false);
    }
  }

  const summary = useMemo(() => {
    if (!needsSlot) return `${PACKS[pack].title} · ${priceLabel}`;
    if (!day || !time) return "Pick a date and a time to continue.";
    return `${day.dow} ${day.num} ${day.month}, ${time} · 50 min · ${
      language === "EN" ? "English" : "Français"
    } · ${priceLabel}`;
  }, [needsSlot, pack, day, time, language, priceLabel]);

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
        isStudent,
        studentCardUrl: cardUrl,
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
                  {isStudent ? (
                    <>
                      <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
                        {p.price} dt
                      </span>{" "}
                      free
                    </>
                  ) : (
                    `${p.price} dt`
                  )}
                  {p.duration ? ` · ${p.duration}` : ""}
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

        {STUDENT_OFFER.on && (
          <div className="student-box">
            <label className="student-check">
              <input
                type="checkbox"
                checked={isStudent}
                onChange={(e) => {
                  setIsStudent(e.target.checked);
                  if (!e.target.checked) {
                    setCardUrl("");
                    setCardName("");
                    setUploadError(null);
                  }
                }}
              />
              <span>
                <strong>I&apos;m a student looking for a PFE</strong>
                <span className="student-sub">
                  Everything is free while the offer runs. Upload your student card and we confirm
                  your file the same day.
                </span>
              </span>
            </label>

            {isStudent && (
              <div className="student-upload">
                <label className="lbl" style={{ marginBottom: 10 }}>
                  Student card {cardUrl ? "— uploaded" : "(photo or PDF, max 6 MB)"}
                </label>
                {cardUrl ? (
                  <div className="student-done">
                    <span aria-hidden="true">✓</span>
                    <span style={{ marginRight: "auto", wordBreak: "break-all" }}>{cardName}</span>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ fontSize: 13, padding: "8px 14px", minHeight: 0 }}
                      onClick={() => {
                        setCardUrl("");
                        setCardName("");
                      }}
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
                    onChange={onCardChosen}
                    disabled={uploading}
                    className="field"
                    style={{ padding: 10 }}
                  />
                )}
                {uploading && (
                  <p style={{ fontSize: 13.5, color: "#56544C", margin: "10px 0 0" }}>
                    Uploading…
                  </p>
                )}
                {uploadError && (
                  <p style={{ fontSize: 13.5, color: "#8A3B3B", margin: "10px 0 0" }}>
                    {uploadError}
                  </p>
                )}
                <p style={{ fontSize: 12.5, color: "#86837A", margin: "10px 0 0" }}>
                  We use it only to confirm you are a student, and delete it on request.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Slot picker */}
      {needsSlot && (
        <section className="card pad-card">
          <h2 className="serif" style={{ fontSize: 23, margin: 0 }}>
            2. Your 50 minutes
          </h2>
          <p style={{ fontSize: 15, color: "#56544C", lineHeight: 1.55, margin: "10px 0 0" }}>
            Sessions run 50 minutes with no break. Reschedule up to 12 hours before.
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
            disabled={
              pending || uploading || (needsSlot && (!day || !time)) || (isStudent && !cardUrl)
            }
          >
            {pending ? "Sending..." : needsSlot ? "Request this session" : "Send my request"}
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#86837A", marginTop: 12 }}>
          {isStudent
            ? "Nothing to pay. We check your student card and confirm your file the same day."
            : "Nothing is charged online. We confirm your slot by email with payment instructions."}
        </p>
      </section>
    </form>
  );
}
