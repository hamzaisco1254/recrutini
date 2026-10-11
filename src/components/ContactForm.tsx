"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { submitMessage } from "@/server/contact";
import { t, type Locale } from "@/lib/i18n";
import { BRAND, whatsappLink } from "@/lib/brand";

/**
 * Four fields and a real answer.
 *
 * It posts to our own server action, which writes the message to our database
 * before it tries to send any mail, so a question is never lost to a mail
 * outage. No third-party form service: one would add a script, a consent
 * banner and a copy of every candidate's question on someone else's servers.
 */
export default function ContactForm({ locale = "en" }: { locale?: Locale }) {
  const c = t(locale).contact;
  const common = t(locale).common;
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const wa = whatsappLink(
    locale === "fr" ? "Bonjour, j'ai une question sur Recrutini." : "Hello, I have a question about Recrutini.",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("sending");
    setError(null);
    const res = await submitMessage({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      topic: String(data.get("topic") ?? ""),
      body: String(data.get("body") ?? ""),
      website: String(data.get("website") ?? ""),
      locale,
    });
    if (res.ok) {
      form.reset();
      setState("sent");
      track("contact_sent", { locale });
    } else {
      setState("idle");
      setError(res.error);
    }
  }

  if (state === "sent") {
    return (
      <div className="contact-done">
        <span className="contact-tick" aria-hidden="true">
          ✓
        </span>
        <div>
          <p className="contact-done-h">{c.sentTitle}</p>
          <p className="contact-done-p">{c.sentBody}</p>
          <button type="button" className="inline-link" onClick={() => setState("idle")}>
            {c.another}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="contact-form" noValidate>
      <div className="contact-row">
        <div>
          <label className="lbl" htmlFor="ct-name">
            {c.name}
          </label>
          <input id="ct-name" name="name" className="field" autoComplete="name" required maxLength={80} />
        </div>
        <div>
          <label className="lbl" htmlFor="ct-email">
            {c.email}
          </label>
          <input
            id="ct-email"
            name="email"
            type="email"
            className="field"
            autoComplete="email"
            required
            maxLength={180}
          />
        </div>
      </div>
      <div>
        <label className="lbl" htmlFor="ct-topic">
          {c.topic}
        </label>
        <select id="ct-topic" name="topic" className="field" defaultValue={c.topics[0]}>
          {c.topics.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="lbl" htmlFor="ct-body">
          {c.message}
        </label>
        <textarea
          id="ct-body"
          name="body"
          className="field"
          rows={4}
          required
          maxLength={2000}
          placeholder={c.placeholder}
        />
      </div>

      {/* Left empty by people, filled by bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp-field"
      />

      {error && (
        <p className="contact-error" role="alert">
          {error}
        </p>
      )}

      <div className="contact-actions">
        <button type="submit" className="btn btn-primary btn-block-sm" disabled={state === "sending"}>
          {state === "sending" ? common.sending : c.send}
        </button>
        <span className="contact-reply">{c.replyTime}</span>
      </div>
      <p className="contact-privacy">{c.privacy}</p>

      <div className="contact-direct">
        <span>{c.direct}</span>
        <a href={`mailto:${BRAND.email}`} className="inline-link">
          {BRAND.email}
        </a>
        {wa && (
          <a href={wa} target="_blank" rel="noreferrer" className="inline-link">
            WhatsApp
          </a>
        )}
      </div>
    </form>
  );
}
