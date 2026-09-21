import { NextResponse, type NextRequest } from "next/server";

/**
 * Language memory.
 *
 * The URL is the source of truth for the language of a page (/ is English,
 * /fr is French), which keeps every page cacheable and shareable. What this
 * proxy adds is memory: the language a visitor chose, or arrived in, follows
 * them to the next visit even when they type the bare domain.
 *
 *  - A visitor with a French cookie who opens an English URL is sent to the
 *    French one. Explicitly clicking EN writes an English cookie first, so the
 *    switch itself is never undone.
 *  - A first-time visitor with no cookie is sent to French when their browser
 *    prefers French over English, which in Tunisia is most browsers.
 *  - Serving a page sets the cookie for its language, so a shared /fr link is
 *    remembered as a French choice.
 *
 * Admin, API and asset paths are untouched.
 */

const COOKIE = "recrutini_lang";
const YEAR = 60 * 60 * 24 * 365;

// Paths that exist in both languages. Anything else is left alone.
const LOCALIZED = /^\/(book|reviews|sample-report|status(\/.*)?|legal\/(privacy|terms))?\/?$/;

function isFrPath(pathname: string) {
  return pathname === "/fr" || pathname.startsWith("/fr/");
}

// Crawlers and link unfurlers see the URL they asked for; only people get guessed.
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|linkedinbot|twitterbot|telegrambot|preview/i;

function prefersFrench(accept: string | null) {
  if (!accept) return false;
  let fr = 0;
  let en = 0;
  for (const part of accept.split(",")) {
    const [tag, ...params] = part.trim().split(";");
    const q = Number(params.find((p) => p.trim().startsWith("q="))?.split("=")[1] ?? "1");
    const lang = tag.trim().toLowerCase();
    if (lang === "fr" || lang.startsWith("fr-")) fr = Math.max(fr, q);
    if (lang === "en" || lang.startsWith("en-")) en = Math.max(en, q);
  }
  return fr > en;
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // A prefetch is not a visit. Redirecting one only teaches the client router
  // that this URL means "go elsewhere", which it then replays on a real click.
  if (req.headers.get("next-router-prefetch") === "1") return NextResponse.next();

  // "/index" and "/fr/index" are internal names for the two home pages, never
  // URLs. Anything that produced one gets sent to the real address.
  if (pathname === "/index" || pathname === "/fr/index") {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/index" ? "/" : "/fr";
    return NextResponse.redirect(url, 308);
  }

  const cookie = req.cookies.get(COOKIE)?.value;
  const onFr = isFrPath(pathname);

  // An explicit choice from the EN | FR control arrives as ?lang=. It is
  // settled here, at the edge, in one hop: write the cookie, drop the
  // parameter, and send the visitor on to the clean URL of the page they asked
  // for. No function has to cold-start for a language switch.
  const asked = req.nextUrl.searchParams.get("lang");
  if (asked === "en" || asked === "fr") {
    const url = req.nextUrl.clone();
    url.searchParams.delete("lang");
    const wantFr = asked === "fr";
    if (wantFr !== onFr) {
      const bare = onFr ? (pathname === "/fr" ? "/" : pathname.slice(3)) : pathname;
      url.pathname = wantFr ? `/fr${bare === "/" ? "" : bare}` : bare;
    }
    const res = NextResponse.redirect(url, 307);
    res.cookies.set(COOKIE, asked, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return res;
  }

  const remember = (res: NextResponse, lang: "en" | "fr") => {
    if (cookie !== lang) {
      res.cookies.set(COOKIE, lang, { path: "/", maxAge: YEAR, sameSite: "lax" });
    }
    return res;
  };

  if (onFr) return remember(NextResponse.next(), "fr");

  // An English URL for a page that also exists in French.
  if (LOCALIZED.test(pathname)) {
    const human = !BOT.test(req.headers.get("user-agent") ?? "");
    const wantsFr =
      cookie === "fr" || (!cookie && human && prefersFrench(req.headers.get("accept-language")));
    if (wantsFr) {
      const url = req.nextUrl.clone();
      url.pathname = `/fr${pathname === "/" ? "" : pathname.replace(/\/$/, "")}`;
      url.search = search;
      return remember(NextResponse.redirect(url, 307), "fr");
    }
    return human ? remember(NextResponse.next(), "en") : NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next internals, static files, the API and the admin.
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
