"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendPaymentReceived, sendReviewRequest } from "@/lib/email";
import { prisma } from "@/lib/db";
import { checkCredentials, createSession, destroySession, getAdmin } from "@/lib/auth";
import { setSetting, type Availability } from "@/lib/schedule";

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function login(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(email, password)) {
    return { error: "Wrong email or password." };
  }
  await createSession(email);
  redirect("/admin/orders");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const data: Record<string, unknown> = {};

  const status = formData.get("status");
  const payment = formData.get("payment");
  const adminNotes = formData.get("adminNotes");
  if (status) data.status = String(status);
  if (payment) data.payment = String(payment);
  if (adminNotes !== null) data.adminNotes = String(adminNotes) || null;

  const before = await prisma.order.findUnique({ where: { id }, select: { status: true } });
  const order = await prisma.order.update({ where: { id }, data });

  // The growth loop: the ask goes out automatically the moment a file is
  // delivered, because a review that has to be chased by hand never happens.
  if (data.status === "DELIVERED" && before?.status !== "DELIVERED") {
    await sendReviewRequest(order);
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function markPaid(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const order = await prisma.order.update({
    where: { id },
    data: { payment: "PAID", status: "IN_PROGRESS" },
    include: { booking: true },
  });
  if (order.booking && order.booking.status === "PENDING") {
    await prisma.booking.update({
      where: { id: order.booking.id },
      data: { status: "CONFIRMED" },
    });
  }
  // The "did my transfer arrive?" question, answered before it is asked.
  await sendPaymentReceived(order);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function updateBooking(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("bookingId"));
  const orderId = String(formData.get("orderId"));
  const data: Record<string, unknown> = {};
  const status = formData.get("bookingStatus");
  const meetingUrl = formData.get("meetingUrl");
  const date = formData.get("date");
  const time = formData.get("time");
  const language = formData.get("language");
  if (status) data.status = String(status);
  if (meetingUrl !== null) data.meetingUrl = String(meetingUrl) || null;
  if (date) data.date = String(date);
  if (time) data.time = String(time);
  if (language) data.language = String(language);

  await prisma.booking.update({ where: { id }, data });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function saveReport(formData: FormData) {
  await requireAdmin();
  const bookingId = String(formData.get("bookingId"));
  const orderId = String(formData.get("orderId"));

  const scoreNames = formData.getAll("scoreName").map(String);
  const scoreValues = formData.getAll("scoreValue").map((v) => Number(v));
  const scores = scoreNames
    .map((name, i) => ({ name: name.trim(), value: Number.isFinite(scoreValues[i]) ? scoreValues[i] : 0 }))
    .filter((s) => s.name.length > 0);

  const overallRaw = Number(formData.get("overall"));
  const overall =
    Number.isFinite(overallRaw) && overallRaw > 0
      ? overallRaw
      : scores.length
        ? Number((scores.reduce((a, s) => a + s.value, 0) / scores.length).toFixed(1))
        : 0;

  const toFix = String(formData.get("toFix") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const payload = {
    interviewer: String(formData.get("interviewer") ?? ""),
    overall,
    scores,
    whatLanded: String(formData.get("whatLanded") ?? ""),
    toFix,
    rewrittenTitle: String(formData.get("rewrittenTitle") ?? ""),
    rewrittenAnswer: String(formData.get("rewrittenAnswer") ?? ""),
    recordingUrl: String(formData.get("recordingUrl") ?? "") || null,
    reportUrl: String(formData.get("reportUrl") ?? "") || null,
    published: formData.get("published") === "on",
  };

  await prisma.report.upsert({
    where: { bookingId },
    create: { bookingId, ...payload },
    update: payload,
  });

  if (payload.published) {
    await prisma.booking.update({ where: { id: bookingId }, data: { status: "COMPLETED" } });
    await prisma.order.update({ where: { id: orderId }, data: { status: "DELIVERED" } });
  }

  revalidatePath(`/admin/orders/${orderId}`);
}

export async function saveAvailability(formData: FormData) {
  await requireAdmin();
  const weekdays: Record<string, string[]> = {};
  for (let d = 0; d < 7; d++) {
    weekdays[String(d)] = String(formData.get(`day-${d}`) ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => /^\d{1,2}:\d{2}$/.test(t))
      .map((t) => (t.length === 4 ? `0${t}` : t))
      .sort();
  }
  const availability: Availability = {
    weekdays,
    horizonDays: Math.max(1, Math.min(90, Number(formData.get("horizonDays")) || 21)),
    leadHours: Math.max(0, Math.min(240, Number(formData.get("leadHours")) || 24)),
  };
  await setSetting("availability", availability);
  await setSetting("paymentInstructions", String(formData.get("paymentInstructions") ?? ""));
  await setSetting("paymentInstructions_fr", String(formData.get("paymentInstructionsFr") ?? ""));
  revalidatePath("/admin/schedule");
  revalidatePath("/book");
  revalidatePath("/fr/book");
}

export async function addBlackout(formData: FormData) {
  await requireAdmin();
  const date = String(formData.get("date") ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    await prisma.blackout.upsert({ where: { date }, create: { date }, update: {} });
  }
  revalidatePath("/admin/schedule");
}

export async function removeBlackout(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.blackout.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/schedule");
}

export async function publishReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.review.update({ where: { id }, data: { status: "PUBLISHED" } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
}

export async function unpublishReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.review.update({ where: { id }, data: { status: "PENDING" } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
}
