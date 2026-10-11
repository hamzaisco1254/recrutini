"use server";

import { after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notifyMessage } from "@/lib/email";
import { isLocale, t, type Locale } from "@/lib/i18n";

/**
 * A question from the contact section.
 *
 * The message is written to our own database first and emailed afterwards, so
 * nothing is lost while mail is unconfigured or a provider is having a bad day.
 * No third-party form service: that would put a script, a cookie banner and a
 * copy of every candidate's message on someone else's servers, for a form that
 * has four fields.
 */
const schemaFor = (locale: Locale) =>
  z.object({
    name: z.string().trim().min(2, t(locale).contact.errors.name).max(80),
    email: z.string().trim().email(t(locale).contact.errors.email).max(180),
    topic: z.string().trim().max(60).optional().or(z.literal("")),
    body: z.string().trim().min(10, t(locale).contact.errors.body).max(2000),
    locale: z.enum(["en", "fr"]).optional(),
    // Honeypot: people leave it empty, bots fill it. A bot gets a plain success.
    website: z.string().max(200).optional(),
  });

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function submitMessage(raw: unknown): Promise<ContactResult> {
  const maybe = (raw as { locale?: unknown } | null)?.locale;
  const locale: Locale = isLocale(maybe) ? maybe : "en";
  const parsed = schemaFor(locale).safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t(locale).common.checkForm };
  }
  const data = parsed.data;

  if (data.website) return { ok: true };

  try {
    const saved = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        topic: data.topic || null,
        body: data.body,
        locale,
      },
      select: { id: true, createdAt: true },
    });

    // Tell the recruiter after the response has gone out; a mail failure must
    // never cost the candidate their message.
    after(async () => {
      try {
        await notifyMessage({
          id: saved.id,
          name: data.name,
          email: data.email,
          topic: data.topic || null,
          body: data.body,
          locale,
        });
      } catch {
        // The message is already in the database; the admin inbox can wait.
      }
    });

    return { ok: true };
  } catch {
    return { ok: false, error: t(locale).contact.errors.server };
  }
}
