"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { PACKS, STUDENT_OFFER } from "@/lib/brand";
import { makeRef } from "@/lib/ref";
import { isSlotFree } from "@/lib/schedule";

const schema = z.object({
  pack: z.enum(["CV_LINKEDIN", "INTERVIEW", "FULL"]),
  name: z.string().trim().min(2, "Please give your full name.").max(120),
  email: z.string().trim().email("That email address doesn't look right."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  targetRole: z.string().trim().max(160).optional().or(z.literal("")),
  cvLink: z.string().trim().max(500).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().max(300).optional().or(z.literal("")),
  jobPostingUrl: z.string().trim().max(500).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  date: z.string().trim().optional().or(z.literal("")),
  time: z.string().trim().optional().or(z.literal("")),
  language: z.enum(["EN", "FR"]).optional(),
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
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const data = parsed.data;
  const pack = PACKS[data.pack];
  const isStudent = STUDENT_OFFER.on && data.isStudent === true;

  if (isStudent && !(data.studentCardUrl && isOwnUpload(data.studentCardUrl))) {
    return {
      ok: false,
      error: "Please upload a photo of your student card so we can confirm the free offer.",
    };
  }

  if (pack.includesInterview) {
    if (!data.date || !data.time) {
      return { ok: false, error: "Please pick a date and a time for your session." };
    }
    if (!(await isSlotFree(data.date, data.time))) {
      return {
        ok: false,
        error: "That slot was just taken. Please choose another time.",
      };
    }
  }

  const ref = makeRef();

  try {
    await prisma.order.create({
      data: {
        ref,
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
    return { ok: false, error: "Something went wrong saving your request. Please try again." };
  }

  return { ok: true, ref };
}
