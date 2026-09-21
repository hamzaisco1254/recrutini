import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";

/**
 * Access control for a candidate's own file page.
 *
 * A reference code alone is not a secret worth trusting: it is short, it is
 * printed in emails, and it can be shoulder-surfed. So opening a file requires
 * the reference AND the email address the order was placed with. On a match we
 * hand out a signed, http-only pass for that one reference; the file page
 * refuses to render without it.
 */

const COOKIE = "recrutini_track";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days — long enough to bookmark

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

/** Refs already unlocked in this browser, so several orders can be open at once. */
async function readPasses(): Promise<string[]> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return [];
    const { payload } = await jwtVerify(token, secret());
    const refs = payload.refs;
    return Array.isArray(refs) ? refs.filter((r): r is string => typeof r === "string") : [];
  } catch {
    return [];
  }
}

export async function grantTrackAccess(ref: string) {
  const refs = Array.from(new Set([...(await readPasses()), ref])).slice(-10);
  const token = await new SignJWT({ refs })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function hasTrackAccess(ref: string) {
  return (await readPasses()).includes(ref);
}

/**
 * Attempt throttling, keyed by client IP. Held in memory: it survives within a
 * server instance rather than across all of them, which slows a guessing run
 * without pretending to be a distributed rate limiter.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, number[]>();

export async function clientKey() {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

export function tooManyAttempts(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  attempts.set(key, recent);
  if (attempts.size > 5000) attempts.clear(); // crude ceiling on memory
  return recent.length >= MAX_ATTEMPTS;
}

export function noteAttempt(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
}

export function clearAttempts(key: string) {
  attempts.delete(key);
}
