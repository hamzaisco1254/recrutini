"use client";

import { useState, useTransition } from "react";
import { submitReview } from "./actions";

export default function ReviewForm({ initialRef = "" }: { initialRef?: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ name: "", role: "", body: "", orderRef: initialRef });
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitReview({ ...form, rating, website });
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  }

  if (done) {
    return (
      <div className="card pad-card" style={{ borderLeft: "4px solid #FFD22F" }}>
        <h2 className="serif" style={{ fontSize: 22, margin: "0 0 10px" }}>
          Thank you — that means a lot.
        </h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#3D3B34", margin: 0 }}>
          Your review has been sent. We read every one by hand before it appears on the site, so give
          it a day or so to show up.
        </p>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form onSubmit={onSubmit} className="card pad-card" style={{ display: "grid", gap: 18 }}>
      <div>
        <label className="lbl">Your rating</label>
        <div
          className="stars-input"
          role="radiogroup"
          aria-label="Rating out of five"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} out of 5`}
              className="star-btn"
              data-on={n <= shown}
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(0)}
              onClick={() => setRating(n)}
            >
              ★
            </button>
          ))}
          <span className="star-label">
            {rating ? `${rating} / 5` : "Tap a star"}
          </span>
        </div>
      </div>

      <div className="field-grid" style={{ marginTop: 0 }}>
        <div>
          <label className="lbl">Your name</label>
          <input
            className="field"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <label className="lbl">Role you were applying for (optional)</label>
          <input
            className="field"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="Software engineer, PFE"
          />
        </div>
      </div>

      <div>
        <label className="lbl">Your review</label>
        <textarea
          className="field"
          rows={5}
          required
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="What did you book, what changed, and would you tell a friend to do it?"
        />
      </div>

      <div>
        <label className="lbl">Reference code (optional)</label>
        <input
          className="field"
          value={form.orderRef}
          onChange={(e) => set("orderRef", e.target.value)}
          placeholder="RC-ABC-234"
          style={{ maxWidth: 220 }}
        />
        <p style={{ fontSize: 13, color: "#86837A", margin: "8px 0 0" }}>
          From your confirmation. If it matches, your review is marked as a verified client.
        </p>
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />

      {error && (
        <div
          style={{
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

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <button
          type="submit"
          className="btn btn-primary btn-block-sm"
          disabled={pending || rating === 0}
        >
          {pending ? "Sending..." : "Send my review"}
        </button>
        <span style={{ fontSize: 13, color: "#86837A" }}>
          Reviews are read before they go on the site.
        </span>
      </div>
    </form>
  );
}
