"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { PACKS } from "@/lib/brand";
import { makeRef } from "@/lib/ref";
import { isSlotFree } from "@/lib/schedule";

const schema = z.object({
  pack: z.enum(["CV", "LINKEDIN", "INTERVIEW", "FULL"]),
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
});

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
        amountDt: pack.price,
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
