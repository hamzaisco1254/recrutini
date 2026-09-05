import { prisma } from "./db";
import { BRAND } from "./brand";

export type Availability = {
  // 0 = Sunday ... 6 = Saturday
  weekdays: Record<string, string[]>;
  horizonDays: number;
  leadHours: number;
};

export const DEFAULT_AVAILABILITY: Availability = {
  weekdays: {
    "0": [],
    "1": ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"],
    "2": ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"],
    "3": ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"],
    "4": ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"],
    "5": ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"],
    "6": ["09:00", "10:00", "11:30"],
  },
  horizonDays: 21,
  leadHours: 24,
};

export const DEFAULT_PAYMENT_INSTRUCTIONS = `Payment is confirmed manually. Send the amount by one of these means, then we confirm your slot by email:

• Bank transfer (RIB sent with your confirmation email)
• D17 / Flouci to the number you receive by email
• Cash before the session

Your booking is held for 48 hours while payment is pending.`;

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    if (!row) return fallback;
    return row.value as T;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown) {
  await prisma.setting.upsert({
    where: { key },
    update: { value: value as object },
    create: { key, value: value as object },
  });
}

export async function getAvailability() {
  return getSetting<Availability>("availability", DEFAULT_AVAILABILITY);
}

export async function getPaymentInstructions() {
  return getSetting<string>("paymentInstructions", DEFAULT_PAYMENT_INSTRUCTIONS);
}

/** Current date/time parts in the Tunis timezone. */
export function nowInTz() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: BRAND.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

export function addDays(isoDate: string, days: number) {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function weekdayOf(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).getUTCDay();
}

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function dowShort(isoDate: string) {
  return DOW[weekdayOf(isoDate)];
}

export function dayNumber(isoDate: string) {
  return Number(isoDate.slice(8, 10));
}

export function monthShort(isoDate: string) {
  return MONTHS[Number(isoDate.slice(5, 7)) - 1].slice(0, 3);
}

export function prettyDate(isoDate: string) {
  return `${DOW_LONG[weekdayOf(isoDate)]} ${dayNumber(isoDate)} ${MONTHS[Number(isoDate.slice(5, 7)) - 1]}`;
}

export type DaySlots = {
  date: string;
  dow: string;
  num: number;
  month: string;
  slots: { time: string; taken: boolean }[];
};

/** Build the bookable calendar: availability minus blackouts, past times and existing bookings. */
export async function buildCalendar(): Promise<DaySlots[]> {
  const availability = await getAvailability();
  const now = nowInTz();
  const start = now.date;
  const end = addDays(start, availability.horizonDays);

  const [blackouts, bookings] = await Promise.all([
    prisma.blackout.findMany({ where: { date: { gte: start, lte: end } } }),
    prisma.booking.findMany({
      where: { date: { gte: start, lte: end }, status: { not: "CANCELLED" } },
      select: { date: true, time: true },
    }),
  ]);

  const blocked = new Set(blackouts.map((b) => b.date));
  const taken = new Set(bookings.map((b) => `${b.date} ${b.time}`));

  // Earliest bookable moment = now + leadHours.
  const leadMs = availability.leadHours * 3600 * 1000;
  const earliest = new Date(Date.now() + leadMs);

  const days: DaySlots[] = [];
  for (let i = 0; i <= availability.horizonDays; i++) {
    const date = addDays(start, i);
    if (blocked.has(date)) continue;
    const times = availability.weekdays[String(weekdayOf(date))] ?? [];
    if (times.length === 0) continue;

    const slots = times
      .slice()
      .sort()
      .map((time) => {
        const when = tzDateTimeToUtc(date, time);
        const past = when.getTime() < earliest.getTime();
        return { time, taken: past || taken.has(`${date} ${time}`) };
      })
      .filter((s, idx, arr) => {
        // Drop days entirely in the past below, keep slot list stable here.
        void idx;
        void arr;
        return true;
      });

    if (slots.every((s) => s.taken) && i < 1) continue;
    if (slots.length === 0) continue;
    days.push({ date, dow: dowShort(date), num: dayNumber(date), month: monthShort(date), slots });
  }
  return days.filter((d) => d.slots.some((s) => !s.taken)).slice(0, 14);
}

/** Convert a Tunis wall-clock date+time to a UTC Date (handles DST via offset probing). */
export function tzDateTimeToUtc(isoDate: string, time: string) {
  const naive = new Date(`${isoDate}T${time}:00Z`);
  const offset = tzOffsetMinutes(naive);
  return new Date(naive.getTime() - offset * 60 * 1000);
}

function tzOffsetMinutes(at: Date) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: BRAND.timezone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(dtf.formatToParts(at).map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour === "24" ? "00" : parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return (asUtc - at.getTime()) / 60000;
}

export async function isSlotFree(date: string, time: string) {
  const existing = await prisma.booking.findFirst({
    where: { date, time, status: { not: "CANCELLED" } },
  });
  return !existing;
}
