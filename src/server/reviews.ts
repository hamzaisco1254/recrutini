"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { normalizeRef } from "@/lib/ref";
import { isLocale, t, type Locale } from "@/lib/i18n";

const schemaFor = (locale: Locale) => z.object({
  name: z.string().trim().min(2, t(locale).reviewsPage.form.errors.name).max(80),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  rating: z.number().int().min(1, t(locale).reviewsPage.form.errors.rating).max(5),
  body: z.string().trim().min(20, t(locale).reviewsPage.form.errors.body).max(1200),
  orderRef: z.string().trim().max(20).optional().or(z.literal("")),
  locale: z.enum(["en", "fr"]).optional(),
  // Honeypot: real people never fill this, bots usually do. Kept permissive so a
  // bot gets a plain success and no hint that it was caught.
  website: z.string().max(200).optional(),
});

export type ReviewResult = { ok: true } | { ok: false; error: string };

export async function submitReview(raw: unknown): Promise<ReviewResult> {
  const maybe = (raw as { locale?: unknown } | null)?.locale;
  const locale: Locale = isLocale(maybe) ? maybe : "en";
  const parsed = schemaFor(locale).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t(locale).common.checkForm };
  }
  const data = parsed.data;

  if (data.website) {
    // Silently accept, store nothing.
    return { ok: true };
  }

  // A reference code is optional; when it matches a real order the review is
  // marked verified, which is the only thing that badge ever means.
  let verified = false;
  let ref: string | null = null;
  if (data.orderRef) {
    ref = normalizeRef(data.orderRef);
    try {
      const order = await prisma.order.findUnique({ where: { ref }, select: { id: true } });
      verified = Boolean(order);
    } catch {
      verified = false;
    }
    if (!verified) ref = null;
  }

  try {
    await prisma.review.create({
      data: {
        name: data.name,
        role: data.role || null,
        rating: data.rating,
        body: data.body,
        orderRef: ref,
        verified,
      },
    });
  } catch {
    return { ok: false, error: t(locale).reviewsPage.form.errors.save };
  }

  return { ok: true };
}
