import { BANK, BRAND, PACKS, SITE_URL, packLabel } from "./brand";
import { prettyDate } from "./schedule";
import { isLocale, localePath, packTitle, type Locale } from "./i18n";

/**
 * Transactional email.
 *
 * Two ways out, chosen by which credentials exist:
 *
 *  1. Gmail, through SMTP with an app password (GMAIL_USER, GMAIL_APP_PASSWORD).
 *     Mail then leaves from the founder's own address, which is what a
 *     candidate expects to see and reply to. Google allows about 500 messages
 *     a day on a personal account, far above what a booking flow sends.
 *  2. Resend's REST API (RESEND_API_KEY, MAIL_FROM), for when the site has its
 *     own domain and volume grows.
 *
 * Every function is best-effort: with neither configured, or when a send
 * fails, we log and carry on, because a booking must never fail because an
 * email did.
 */

const GMAIL_USER = process.env.GMAIL_USER ?? "";
const GMAIL_PASS = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
const KEY = process.env.RESEND_API_KEY ?? "";
const FROM =
  process.env.MAIL_FROM ??
  (GMAIL_USER ? `${BRAND.name} <${GMAIL_USER}>` : `${BRAND.name} <onboarding@resend.dev>`);

export const emailProvider: "gmail" | "resend" | "none" =
  GMAIL_USER && GMAIL_PASS ? "gmail" : KEY ? "resend" : "none";
export const emailEnabled = emailProvider !== "none";

type Mail = { to: string; subject: string; blocks: Block[]; preheader?: string; locale?: Locale };
type Block =
  | { t: "p"; v: string }
  | { t: "h"; v: string }
  | { t: "rows"; v: [string, string][] }
  | { t: "cta"; v: string; href: string }
  | { t: "note"; v: string };

const YELLOW = "#FFD22F";
const INK = "#111111";
const PAPER = "#F7F6F2";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** One template for everything: tables only, so it survives Gmail and Outlook. */
function render({ blocks, preheader, locale = "en" }: { blocks: Block[]; preheader?: string; locale?: Locale }) {
  const foot = locale === "fr" ? { place: "Tunis, Tunisie", privacy: "Confidentialité", terms: "CGV &amp; remboursements" }
    : { place: "Tunis, Tunisia", privacy: "Privacy", terms: "Terms &amp; refunds" };
  const body = blocks
    .map((b) => {
      switch (b.t) {
        case "h":
          return `<tr><td style="padding:26px 32px 0;font-family:Georgia,serif;font-size:21px;color:${INK}">${esc(b.v)}</td></tr>`;
        case "p":
          return `<tr><td style="padding:14px 32px 0;font-size:15px;line-height:1.62;color:#3D3B34">${b.v}</td></tr>`;
        case "note":
          return `<tr><td style="padding:14px 32px 0;font-size:13.5px;line-height:1.6;color:#86837A">${b.v}</td></tr>`;
        case "rows":
          return `<tr><td style="padding:18px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E4E2DA;border-radius:8px;overflow:hidden">${b.v
            .map(
              ([k, v], i) =>
                `<tr><td style="padding:11px 14px;font-size:13px;color:#86837A;width:40%;border-top:${i ? "1px solid #EEECE4" : "none"};background:#FCFBF8">${esc(k)}</td><td style="padding:11px 14px;font-size:14px;font-weight:600;color:#26251F;border-top:${i ? "1px solid #EEECE4" : "none"};background:#fff">${esc(v)}</td></tr>`,
            )
            .join("")}</table></td></tr>`;
        case "cta":
          return `<tr><td style="padding:24px 32px 0"><a href="${b.href}" style="display:inline-block;background:${YELLOW};color:${INK};font-weight:700;font-size:15px;text-decoration:none;padding:14px 26px;border-radius:999px">${esc(b.v)}</a></td></tr>`;
      }
    })
    .join("");

  return `<!doctype html><html lang="${locale}"><body style="margin:0;background:${PAPER};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader ?? "")}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:28px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#fff;border:1px solid #E4E2DA;border-radius:12px;overflow:hidden">
<tr><td style="background:${INK};padding:22px 32px">
  <span style="font-family:Georgia,serif;font-size:22px;color:#fff">${BRAND.name}</span>
  <span style="display:inline-block;width:26px;height:4px;background:${YELLOW};vertical-align:middle;margin-left:10px"></span>
</td></tr>
${body}
<tr><td style="padding:30px 32px 26px">
  <div style="border-top:1px solid #E4E2DA;padding-top:16px;font-size:12.5px;line-height:1.6;color:#86837A">
    ${BRAND.name} · ${foot.place} · <a href="mailto:${BRAND.email}" style="color:#86837A">${BRAND.email}</a><br>
    <a href="${SITE_URL}${localePath(locale, "/legal/privacy")}" style="color:#86837A">${foot.privacy}</a> ·
    <a href="${SITE_URL}${localePath(locale, "/legal/terms")}" style="color:#86837A">${foot.terms}</a>
  </div>
</td></tr>
</table></td></tr></table></body></html>`;
}

async function send(mail: Mail) {
  if (emailProvider === "none") {
    console.info(`[email] skipped (no GMAIL_USER/GMAIL_APP_PASSWORD or RESEND_API_KEY): "${mail.subject}" -> ${mail.to}`);
    return { ok: false as const, reason: "disabled" };
  }
  const html = render(mail);
  try {
    if (emailProvider === "gmail") {
      const { createTransport } = await import("nodemailer");
      const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: GMAIL_USER, pass: GMAIL_PASS },
        // Never let a slow mail server hold a booking hostage.
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 12000,
      });
      await transport.sendMail({
        from: FROM,
        to: mail.to,
        replyTo: BRAND.email,
        subject: mail.subject,
        html,
        text: textOf(mail),
      });
      return { ok: true as const };
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [mail.to],
        reply_to: BRAND.email,
        subject: mail.subject,
        html,
        text: textOf(mail),
      }),
    });
    if (!res.ok) {
      console.error("[email] send failed", res.status, await res.text().catch(() => ""));
      return { ok: false as const, reason: "provider" };
    }
    return { ok: true as const };
  } catch (err) {
    console.error("[email] threw", err);
    return { ok: false as const, reason: "threw" };
  }
}

/** A plain-text twin of the HTML, for clients and filters that prefer one. */
function textOf(mail: Mail) {
  const strip = (v: string) => v.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
  return mail.blocks
    .map((b) => {
      switch (b.t) {
        case "h":
          return `\n${b.v}\n`;
        case "p":
        case "note":
          return strip(b.v);
        case "rows":
          return b.v.map(([k, v]) => `${k}: ${v}`).join("\n");
        case "cta":
          return `${b.v}: ${b.href}`;
      }
    })
    .join("\n\n")
    .trim();
}

// ---------------------------------------------------------------------------

type OrderLike = {
  ref: string;
  name: string;
  email: string;
  pack: string;
  amountDt: number;
  isStudent: boolean;
  /** Language of the site when the order was placed. */
  locale?: string | null;
};

function localeOf(order: OrderLike): Locale {
  return isLocale(order.locale) ? order.locale : "en";
}

function firstName(order: OrderLike, locale: Locale) {
  return order.name.trim().split(/\s+/)[0] || (locale === "fr" ? "bonjour" : "there");
}

function status(locale: Locale) {
  return `${SITE_URL}${localePath(locale, "/status")}`;
}

/** Sent the moment someone books. Their reference and what happens next, in writing. */
export function sendBookingConfirmation(
  order: OrderLike,
  slot?: { date: string; time: string; language: string } | null,
) {
  const locale = localeOf(order);
  const fr = locale === "fr";
  const first = firstName(order, locale);
  const free = order.isStudent || order.amountDt === 0;
  const pack = packTitle(order.pack, locale);
  const rows: [string, string][] = [
    [fr ? "Référence" : "Reference", order.ref],
    [fr ? "Formule" : "Pack", pack],
  ];
  if (slot) rows.push(["Session", `${prettyDate(slot.date, locale)}, ${slot.time} · ${BRAND.tzLabel}`]);
  rows.push([fr ? "Montant" : "Amount", free ? (fr ? "Gratuit, offre étudiante" : "Free, student offer") : `${order.amountDt} dt`]);

  const blocks: Block[] = [
    { t: "h", v: fr ? `C'est noté, ${first}.` : `Got it, ${first}.` },
    {
      t: "p",
      v: fr
        ? `Votre demande est bien reçue. Gardez cet e-mail : votre référence est <strong>${esc(order.ref)}</strong>, c'est avec elle que nous retrouvons votre dossier.`
        : `Your request is in. Keep this email: your reference is <strong>${esc(order.ref)}</strong>, and it is how we find your file.`,
    },
    { t: "rows", v: rows },
  ];

  if (free) {
    blocks.push({
      t: "p",
      v: fr ? "Rien à payer. Nous vérifions votre carte d'étudiant à la main et confirmons votre dossier le jour même." : "Nothing to pay. We check your student card by hand and confirm your file the same day.",
    });
  } else {
    blocks.push(
      { t: "h", v: fr ? "Le règlement" : "Paying for it" },
      {
        t: "p",
        v: fr ? `Virement ou D17 sur le compte ci-dessous, puis répondez à cet e-mail avec le reçu. Indiquez votre référence <strong>${esc(order.ref)}</strong> dans le libellé. Votre créneau est tenu 48 heures.`
          : `Transfer or D17 to the account below, then reply to this email with the receipt. Write your reference <strong>${esc(order.ref)}</strong> in the transfer note. Your slot is held for 48 hours.`,
      },
      {
        t: "rows",
        v: [
          [fr ? "Titulaire du compte" : "Account holder", BANK.holder],
          [fr ? "Banque" : "Bank", BANK.bank],
          ["RIB", BANK.rib.replace(/(.{4})/g, "$1 ").trim()],
          ["IBAN", BANK.iban.replace(/(.{4})/g, "$1 ").trim()],
        ],
      },
    );
  }

  blocks.push(
    { t: "cta", v: fr ? "Ouvrir mon dossier" : "Open my file", href: status(locale) },
    {
      t: "note",
      v: fr ? "Pour ouvrir votre dossier, il faut cette référence et cette adresse e-mail : personne d'autre ne peut le voir. Une question ? Répondez simplement à cet e-mail. Réponse le jour même, samedi compris." : `Opening your file asks for this reference and this email address, so nobody else can see it. Questions? Just reply. ${esc(BRAND.replyPromise)}`,
    },
  );

  return send({
    to: order.email,
    locale,
    subject: fr ? `${order.ref} · votre réservation ${pack}` : `${order.ref} · your ${pack} booking`,
    preheader: free ? fr ? "Rien à payer. Nous confirmons votre dossier le jour même." : "Nothing to pay. We confirm your file the same day." : fr ? `Référence ${order.ref}. RIB à l'intérieur.` : `Reference ${order.ref}. Bank details inside.`,
    blocks,
  });
}

/** Sent when the admin confirms payment. Removes the "did it arrive?" doubt. */
export function sendPaymentReceived(order: OrderLike) {
  const locale = localeOf(order);
  const fr = locale === "fr";
  const first = firstName(order, locale);
  const pack = packTitle(order.pack, locale);
  const interview = PACKS[order.pack as keyof typeof PACKS]?.includesInterview;
  return send({
    to: order.email,
    locale,
    subject: fr ? `${order.ref} · paiement reçu` : `${order.ref} · payment received`,
    preheader: fr ? "C'est confirmé. Voici la suite." : "You're confirmed. Here's what happens next.",
    blocks: [
      { t: "h", v: fr ? `Paiement reçu, ${first}.` : `Payment received, ${first}.` },
      {
        t: "p",
        v: fr
          ? `Nous avons bien reçu vos ${order.amountDt} dt pour <strong>${esc(pack)}</strong>. Votre créneau est confirmé et le travail est lancé.`
          : `We have your ${order.amountDt} dt for <strong>${esc(pack)}</strong>. Your slot is confirmed and the work is under way.`,
      },
      {
        t: "p",
        v: interview ? fr ? "Vous recevrez le lien de connexion avant votre session. Envoyez-nous l'offre d'emploi à l'avance si vous en avez une : les questions sont construites à partir d'elle." : "You'll get the joining link before your session. Send us the job posting beforehand if you have one: the questions are built from it." : fr ? "Votre première version arrive sous quatre jours ouvrés." : "Your first draft lands within four working days.",
      },
      { t: "cta", v: fr ? "Suivre mon dossier" : "Track my file", href: status(locale) },
    ],
  });
}

/** Sent the day before a session. The single cheapest way to cut no-shows. */
export function sendSessionReminder(
  order: OrderLike,
  slot: { date: string; time: string; meetingUrl?: string | null },
) {
  const locale = localeOf(order);
  const fr = locale === "fr";
  const first = firstName(order, locale);
  const blocks: Block[] = [
    { t: "h", v: fr ? `C'est demain, ${first}.` : `Tomorrow, ${first}.` },
    {
      t: "p",
      v: fr ? `Votre session a lieu <strong>${esc(prettyDate(slot.date, locale))} à ${esc(slot.time)}</strong> (${esc(BRAND.tzLabel)}). Elle dure 50 minutes sans pause : trouvez un endroit calme où personne ne vous interrompra.`
        : `Your session is <strong>${esc(prettyDate(slot.date, locale))} at ${esc(slot.time)}</strong> (${esc(BRAND.tzLabel)}). It runs 50 minutes with no break, so find somewhere quiet where you won't be interrupted.`,
    },
    {
      t: "p",
      v: fr ? "Gardez l'offre d'emploi ouverte. Testez caméra et micro avant de commencer : le chrono tourne quoi qu'il arrive, exactement comme en vrai." : "Have the job posting open. Test your camera and microphone before we start. The clock runs either way, exactly like the real thing.",
    },
  ];
  if (slot.meetingUrl) blocks.push({ t: "cta", v: fr ? "Rejoindre la session" : "Join the session", href: slot.meetingUrl });
  blocks.push({
    t: "note",
    v: fr ? "Un empêchement ? Répondez maintenant : le report est gratuit jusqu'à 12 heures avant." : "Can't make it? Reply now. Rescheduling is free up to 12 hours before.",
  });
  return send({
    to: order.email,
    locale,
    subject: fr ? `Demain à ${slot.time} · votre entretien blanc` : `Tomorrow at ${slot.time} · your mock interview`,
    preheader: fr ? "50 minutes, sans pause. Gardez l'offre d'emploi ouverte." : "50 minutes, no break. Have the job posting open.",
    blocks,
  });
}

/**
 * Sent when a file is delivered. This is the growth loop: without an automatic
 * ask, reviews never arrive, and reviews are the thing the site most lacks.
 */
export function sendReviewRequest(order: OrderLike) {
  const locale = localeOf(order);
  const fr = locale === "fr";
  const first = firstName(order, locale);
  return send({
    to: order.email,
    locale,
    subject: fr ? "Comment ça s'est passé ?" : "How did it go?",
    preheader: fr ? "Deux phrases aideraient vraiment le prochain candidat." : "Two sentences would genuinely help the next candidate.",
    blocks: [
      { t: "h", v: fr ? `Comment ça s'est passé, ${first} ?` : `How did it go, ${first}?` },
      {
        t: "p",
        v: fr ? "Votre dossier est livré. Si ça vous a aidé, deux phrases de votre part aideraient la prochaine personne à se décider : la plupart des candidats qui nous découvrent n'ont aucun moyen de savoir si tout ceci fonctionne." : "Your file is delivered. If it helped, two sentences from you would help the next person decide. Most candidates looking at us have no way of knowing whether any of this works.",
      },
      {
        t: "p",
        v: fr ? "Et si quelque chose n'a pas été à la hauteur, répondez plutôt à cet e-mail et dites-le-moi. Je préfère le corriger que le lire plus tard." : "And if something fell short, reply to this email instead and tell me. I would rather fix it than read about it later.",
      },
      { t: "cta", v: fr ? "Laisser un avis" : "Leave a review", href: `${SITE_URL}${localePath(locale, "/reviews")}?ref=${order.ref}` },
      {
        t: "note",
        v: fr ? "Publié avec votre prénom et votre poste uniquement. Jamais votre CV, jamais votre employeur, jamais votre nom complet." : "Published with your first name and role only. Never your CV, never your employer, never your full name.",
      },
    ],
  });
}

/** Copy to the admin, so a booking is noticed without watching the dashboard. */
export function notifyAdmin(order: OrderLike, slot?: { date: string; time: string } | null) {
  return send({
    to: BRAND.email,
    subject: `New booking · ${order.ref} · ${packLabel(order.pack)}`,
    preheader: `${order.name} · ${order.amountDt === 0 ? "student, free" : `${order.amountDt} dt`}`,
    blocks: [
      { t: "h", v: "New booking" },
      {
        t: "rows",
        v: [
          ["Reference", order.ref],
          ["Name", order.name],
          ["Email", order.email],
          ["Pack", packLabel(order.pack)],
          ["Amount", order.amountDt === 0 ? "Free (student)" : `${order.amountDt} dt`],
          ["Site language", (order.locale ?? "en").toUpperCase()],
          ...(slot ? ([["Session", `${slot.date} ${slot.time}`]] as [string, string][]) : []),
        ],
      },
      { t: "cta", v: "Open in admin", href: `${SITE_URL}/admin/orders` },
    ],
  });
}

/** A question from the contact section, forwarded to the recruiter's inbox. */
export function notifyMessage(m: {
  id: string;
  name: string;
  email: string;
  topic?: string | null;
  body: string;
  locale: string;
}) {
  return send({
    to: BRAND.email,
    subject: `New question · ${m.name}${m.topic ? ` · ${m.topic}` : ""}`,
    preheader: m.body.slice(0, 120),
    blocks: [
      { t: "h", v: "New question" },
      {
        t: "rows",
        v: [
          ["Name", m.name],
          ["Email", m.email],
          ["Topic", m.topic || "—"],
          ["Language", m.locale.toUpperCase()],
        ],
      },
      { t: "p", v: esc(m.body).replace(/\n/g, "<br>") },
      { t: "note", v: `Reply straight to ${m.email}. Saved as ${m.id}.` },
    ],
  });
}
