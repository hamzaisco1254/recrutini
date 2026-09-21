"use server";

import { after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { PACKS, STUDENT_OFFER } from "@/lib/brand";
import { makeRef } from "@/lib/ref";
import { grantTrackAccess } from "@/lib/track";
import { notifyAdmin, sendBookingConfirmation } from "@/lib/email";
import { isSlotFree } from "@/lib/schedule";
import { isLocale, t, type Locale } from "@/lib/i18n";

/**
 * Validation speaks the language of the page the form was on. The locale
 * travels with the payload rather than being read from a header, so a French
 * form always gets French answers even behind a proxy that strips headers.
 */
const schemaFor = (locale: Locale) => z.object({
  pack: z.enum(["CV_LINKEDIN", "INTERVIEW", "FULL"]),
  name: z.string().trim().min(2, t(locale).book.errors.name).max(120),
  email: z.string().trim().email(t(locale).book.errors.email),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  targetRole: z.string().trim().max(160).optional().or(z.literal("")),
  cvLink: z.string().trim().max(500).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().max(300).optional().or(z.literal("")),
  jobPostingUrl: z.string().trim().max(500).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  date: z.string().trim().optional().or(z.literal("")),
  time: z.string().trim().optional().or(z.literal("")),
  language: z.enum(["EN", "FR", "AR"]).optional(),
  locale: z.enum(["en", "fr"]).optional(),
  isStudent: z.boolean().optional(),
  studentCardUrl: z.string().trim().max(600).optional().or(z.literal("")),
});

/** Only accept a card that actually came from our own blob store. */
function isOwnUpload(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export type BookingResult =
  | { ok: true; ref: string }
  | { ok: false; error: string };

export async function submitBooking(raw: unknown): Promise<BookingResult> {
  const maybe = (raw as { locale?: unknown } | null)?.locale;
  const locale: Locale = isLocale(maybe) ? maybe : "en";
  const err = t(locale).book.errors;
  const parsed = schemaFor(locale).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t(locale).common.checkForm };
  }
  const data = parsed.data;
  const pack = PACKS[data.pack];
  const isStudent = STUDENT_OFFER.on && data.isStudent === true;

  if (isStudent && !(data.studentCardUrl && isOwnUpload(data.studentCardUrl))) {
    return { ok: false, error: err.card };
  }

  if (pack.includesInterview) {
    if (!data.date || !data.time) {
      return { ok: false, error: err.slot };
    }
    if (!(await isSlotFree(data.date, data.time))) {
      return { ok: false, error: err.taken };
    }
  }

  const ref = makeRef();

  let created;
  try {
    created = await prisma.order.create({
      include: { booking: true },
      data: {
        ref,
        locale,
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        pack: data.pack,
        amountDt: isStudent ? 0 : pack.price,
        // Nothing is owed on a student file, so it never sits in "awaiting payment".
        payment: isStudent ? "PAID" : "UNPAID",
        isStudent,
        studentCardUrl: isStudent ? data.studentCardUrl || null : null,
        targetRole: data.targetRole || null,
        cvLink: data.cvLink || null,
        linkedinUrl: data.linkedinUrl || null,
        jobPostingUrl: data.jobPostingUrl || null,
        notes: data.notes || null,
        booking: pack.includesInterview
          ? {
              create: {
                date: data.date!,
                time: data.time!,
                language: data.language ?? "EN",
              },
            }
          : undefined,
      },
    });
  } catch {
    return { ok: false, error: err.save };
  }

  // The person who just booked gets to open their own file without re-entering
  // the reference and email they typed a second ago.
  try {
    await grantTrackAccess(ref);
  } catch {
    // A missing pass only means one extra lookup; never fail the booking for it.
  }

  // Confirmation in writing, so nobody is left holding a reference they saw
  // once on a screen. It goes out after the response, so the person sees
  // their reference at once and a slow mail server never delays the booking.
  // Failures are logged inside and never break the booking.
  const slot = created.booking
    ? {
        date: created.booking.date,
        time: created.booking.time,
        language: created.booking.language as string,
      }
    : null;
  const order = created;
  after(async () => {
    await Promise.allSettled([sendBookingConfirmation(order, slot), notifyAdmin(order, slot)]);
  });

  return { ok: true, ref };
}
