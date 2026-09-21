"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient background for the hero.
 *
 * Rules it has to obey: never compete with the headline, never cost a mobile
 * visitor their data plan, never move for someone who asked the OS for less
 * motion. So the poster image is the real background, and the video only
 * fades in over it once it can play, on a wide screen, on a connection that
 * can afford it. Everything below that bar simply sees the still.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 720px)").matches;
    // Respect Data Saver and slow connections where the API exists.
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const thin = Boolean(conn?.saveData) || ["slow-2g", "2g"].includes(conn?.effectiveType ?? "");

    if (calm || narrow || thin) return;

    const el = ref.current;
    if (!el) return;
    // Two sources: VP9 for Chromium/Firefox, H.264 for Safari and iOS.
    for (const [src, type] of [
      ["/hero-loop.webm", "video/webm"],
      ["/hero-loop.mp4", "video/mp4"],
    ] as const) {
      const s = document.createElement("source");
      s.src = src;
      s.type = type;
      el.appendChild(s);
    }
    el.load();
    const play = () => {
      el.play()
        .then(() => setOn(true))
        .catch(() => setOn(false)); // autoplay refused: the poster stays
    };
    el.addEventListener("canplay", play, { once: true });
    return () => el.removeEventListener("canplay", play);
  }, []);

  return (
    <div className="hero-media" aria-hidden="true">
      <div className="hero-media-still" />
      <video
        ref={ref}
        className="hero-media-video"
        data-on={on}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
        poster="/hero-poster.jpg"
      />
      <div className="hero-media-scrim" />
    </div>
  );
}
