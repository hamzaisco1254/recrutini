import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendSessionReminder } from "@/lib/email";
import { addDays, nowInTz } from "@/lib/schedule";

export const dynamic = "force-dynamic";

/**
 * Tomorrow's sessions get a reminder. Wire it in vercel.json to run once a day;
 * a no-show costs a full delivery slot, and one email prevents most of them.
 * Protected by CRON_SECRET so it cannot be triggered from outside.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const target = addDays(nowInTz().date, 1);
  const bookings = await prisma.booking.findMany({
    where: { date: target, status: { in: ["PENDING", "CONFIRMED"] } },
    include: { order: true },
  });

  const results = await Promise.allSettled(
    bookings.map((b) =>
      sendSessionReminder(b.order, { date: b.date, time: b.time, meetingUrl: b.meetingUrl }),
    ),
  );

  return NextResponse.json({
    ok: true,
    date: target,
    sent: results.filter((r) => r.status === "fulfilled").length,
    total: bookings.length,
  });
}
