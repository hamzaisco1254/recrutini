"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { t, type Locale } from "@/lib/i18n";

/**
 * The promotional film, in the language of the page, behind one button.
 *
 * Pressing Play opens a dialog and starts the film with sound at once: the
 * press is the gesture browsers require, so nothing asks twice. Escape, the
 * close button or the backdrop stop it and put focus back on the button.
 * Nothing downloads until someone asks for it.
 */
export function PlayButton({
  locale = "en",
  variant = "dark",
  className = "",
}: {
  locale?: Locale;
  variant?: "dark" | "light";
  className?: string;
}) {
  const c = t(locale).video;
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    btnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = videoRef.current;
    if (el) {
      el.muted = false;
      el.currentTime = 0;
      el.play().catch(() => {
        // The gesture was consumed by the click, so this rarely fails; if it
        // does, the controls are visible and one more tap starts it.
      });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={`btn btn-block-sm play-btn play-btn-${variant} ${className}`}
        onClick={() => {
          setOpen(true);
          track("promo_play", { locale });
        }}
        aria-haspopup="dialog"
      >
        <span aria-hidden="true" className="promo-tri" />
        {c.play}
        <span className="play-len">{c.caption}</span>
      </button>

      {open && (
        <div className="film-backdrop" onClick={close} role="presentation">
          <div
            className="film-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={c.h2}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="film-close" onClick={close} aria-label={c.close}>
              ×
            </button>
            <video
              ref={videoRef}
              className="film-video"
              poster={`/promo-${locale}.jpg`}
              playsInline
              controls
              onEnded={close}
            >
              <source src={`/promo-${locale}.mp4`} type="video/mp4" />
              <track
                kind="captions"
                src={`/promo-${locale}.vtt`}
                srcLang={locale}
                label={c.captions}
                default
              />
            </video>
          </div>
        </div>
      )}
    </>
  );
}

export default PlayButton;

/**
 * The film as a section of the page: poster in a phone-shaped frame, one Play
 * button, and it plays right there with sound as soon as it is pressed.
 */
export function PromoSection({ locale = "en" }: { locale?: Locale }) {
  const c = t(locale).video;
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function start() {
    const el = ref.current;
    if (!el) return;
    el.muted = false;
    el.play()
      .then(() => {
        setPlaying(true);
        track("promo_play", { locale, where: "section" });
      })
      .catch(() => {
        el.muted = true;
        el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      });
  }

  return (
    <section id="film" className="promo">
      <div className="wrap sec promo-grid">
        <div>
          <div className="kicker">{c.label}</div>
          <h2 className="serif h2">{c.h2}</h2>
          <p className="promo-body">{c.body}</p>
          <p className="promo-cc">{c.captionsNote}</p>
          {!playing && (
            <button type="button" className="btn btn-primary btn-block-sm play-btn" onClick={start}>
              <span aria-hidden="true" className="promo-tri" />
              {c.play}
              <span className="play-len play-len-onink">{c.caption}</span>
            </button>
          )}
        </div>
        <div className="promo-frame">
          <video
            ref={ref}
            className="promo-video"
            poster={`/promo-${locale}.jpg`}
            preload="none"
            playsInline
            controls={playing}
            onEnded={() => setPlaying(false)}
          >
            <source src={`/promo-${locale}.mp4`} type="video/mp4" />
            <track
              kind="captions"
              src={`/promo-${locale}.vtt`}
              srcLang={locale}
              label={c.captions}
              default
            />
          </video>
          {!playing && (
            <button type="button" className="promo-overlay" onClick={start} aria-label={c.play}>
              <span className="promo-play">
                <span aria-hidden="true" className="promo-tri promo-tri-lg" />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
