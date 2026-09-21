"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES, STUDENT_OFFER, languageLabel, type LanguageKey, type PackKey } from "@/lib/brand";
import type { DaySlots } from "@/lib/schedule";
import { localePath, t, type Locale } from "@/lib/i18n";
import { submitBooking } from "@/server/booking";

export default function BookingForm({
  locale = "en",
  days,
  initialPack,
  initialStudent = false,
  tzLabel,
}: {
  locale?: Locale;
  days: DaySlots[];
  initialPack: PackKey;
  initialStudent?: boolean;
  tzLabel: string;
}) {
  const router = useRouter();
  const c = t(locale);
  const b = c.book;
  // Pack copy in the page's language; keys and prices are shared.
  const PACK_LIST = c.packs.list;
  const PACKS = Object.fromEntries(PACK_LIST.map((p) => [p.key, p])) as Record<PackKey, (typeof PACK_LIST)[number]>;
  const [pack, setPack] = useState<PackKey>(initialPack);
  const [dateIdx, setDateIdx] = useState(0);
  const [time, setTime] = useState<string>("");
  const [language, setLanguage] = useState<LanguageKey>(locale === "fr" ? "FR" : "EN");
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
  const priceLabel = isStudent ? b.freeStudent : `${price} dt`;

  async function onCardChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    if (file.size > 6 * 1024 * 1024) {
      setUploadError(b.tooBig);
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
      setUploadError(b.uploadFailed);
    } finally {
      setUploading(false);
    }
  }

  const summary = useMemo(() => {
    if (!needsSlot) return `${PACKS[pack].title} · ${priceLabel}`;
    if (!day || !time) return b.pickDateTime;
    return `${day.dow} ${day.num} ${day.month}, ${time} · 50 min · ${languageLabel(
      language,
    )} · ${priceLabel}`;
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
        locale,
        isStudent,
        studentCardUrl: cardUrl,
        language,
        date: needsSlot ? day?.date ?? "" : "",
        time: needsSlot ? time : "",
      });
      if (res.ok) {
        router.push(`${localePath(locale, `/status/${res.ref}`)}?new=1`);
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
          {b.step1}
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
                      {c.common.free}
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
              <span className="tick" aria-hidden="true" style={{ display: "inline-block", width: 12, height: 2, background: "#C9A400", marginTop: "0.62em", flex: "none" }} />
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
                <strong>{b.studentCheck}</strong>
                <span className="student-sub">{b.studentSub}</span>
              </span>
            </label>

            {isStudent && (
              <div className="student-upload">
                <label className="lbl" style={{ marginBottom: 10 }} htmlFor="bk-card">
                  {b.cardLabel} {cardUrl ? b.cardUploaded : b.cardHint}
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
                      {b.replace}
                    </button>
                  </div>
                ) : (
                  <input
                    id="bk-card"
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
                    {b.uploading}
                  </p>
                )}
                {uploadError && (
                  <p style={{ fontSize: 13.5, color: "#8A3B3B", margin: "10px 0 0" }}>
                    {uploadError}
                  </p>
                )}
                <p style={{ fontSize: 12.5, color: "#86837A", margin: "10px 0 0" }}>
                  {b.cardNote}
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
            {b.step2}
          </h2>
          <p style={{ fontSize: 15, color: "#56544C", lineHeight: 1.55, margin: "10px 0 0" }}>
            {b.sessionLead}
          </p>

          <div className="lbl" id="bk-lang-label" style={{ marginTop: 26 }}>
            {b.sessionLang}
          </div>
          <div role="group" aria-labelledby="bk-lang-label" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                type="button"
                className="chip"
                data-on={language === l.key}
                style={{ flex: "1 1 30%" }}
                onClick={() => setLanguage(l.key)}
                lang={l.key === "AR" ? "ar" : undefined}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="lbl" id="bk-date-label" style={{ marginTop: 26 }}>
            {b.date}
          </div>
          {days.length === 0 ? (
            <p style={{ fontSize: 15, color: "#56544C" }}>{b.noSlots}</p>
          ) : (
            <div className="date-grid" role="group" aria-labelledby="bk-date-label">
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
              <div className="lbl" id="bk-time-label" style={{ marginTop: 26 }}>
                {b.time} · {tzLabel}
              </div>
              <div className="time-grid" role="group" aria-labelledby="bk-time-label">
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
          {needsSlot ? "3." : "2."} {b.step3}
        </h2>
        <div className="field-grid">
          <div>
            <label className="lbl" htmlFor="bk-name">{b.fullName}</label>
            <input
              id="bk-name"
              className="field"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div>
            <label className="lbl" htmlFor="bk-email">{b.email}</label>
            <input
              id="bk-email"
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder={b.emailPh}
            />
          </div>
          <div>
            <label className="lbl" htmlFor="bk-phone">{b.phone}</label>
            <input
              id="bk-phone"
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
            <label className="lbl" htmlFor="bk-targetRole">{b.targetRole}</label>
            <input
              id="bk-targetRole"
              className="field"
              value={form.targetRole}
              onChange={(e) => set("targetRole", e.target.value)}
              placeholder={b.targetRolePh}
            />
          </div>
          <div>
            <label className="lbl" htmlFor="bk-cvLink">{b.cvLink}</label>
            <input
              id="bk-cvLink"
              className="field"
              type="url"
              inputMode="url"
              autoCapitalize="none"
              spellCheck={false}
              value={form.cvLink}
              onChange={(e) => set("cvLink", e.target.value)}
              placeholder={b.cvPh}
            />
          </div>
          <div>
            <label className="lbl" htmlFor="bk-linkedinUrl">{b.linkedin}</label>
            <input
              id="bk-linkedinUrl"
              className="field"
              type="url"
              inputMode="url"
              autoCapitalize="none"
              spellCheck={false}
              value={form.linkedinUrl}
              onChange={(e) => set("linkedinUrl", e.target.value)}
              placeholder={b.linkedinPh}
            />
          </div>
          {needsSlot && (
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="lbl" htmlFor="bk-jobPostingUrl">{b.jobPosting}</label>
              <input
                id="bk-jobPostingUrl"
              className="field"
                value={form.jobPostingUrl}
                onChange={(e) => set("jobPostingUrl", e.target.value)}
                placeholder={b.jobPostingPh}
              />
            </div>
          )}
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="lbl" htmlFor="bk-notes">{b.notes}</label>
            <textarea
              id="bk-notes"
              className="field"
              rows={4}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder={b.notesPh}
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
            {pending ? c.common.sending : needsSlot ? b.requestSession : b.sendRequest}
          </button>
        </div>
        <p style={{ fontSize: 13, color: "#86837A", marginTop: 12 }}>
          {isStudent ? b.noteStudent : b.noteNormal}
        </p>
      </section>
    </form>
  );
}
