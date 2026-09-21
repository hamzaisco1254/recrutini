import type { Metadata } from "next";
import LegalPage from "@/components/pages/LegalPage";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms, refunds and cancellations",
  description:
    "What you are buying, what we promise, how to reschedule or cancel, and when you get your money back.",
  alternates: { canonical: "/legal/terms", languages: { en: "/legal/terms", fr: "/fr/legal/terms", "x-default": "/legal/terms" } },
};

export default function Page() {
  return (
    <LegalPage
      title="Terms, refunds and cancellations"
      intro="What you are buying, what we promise, and what happens if it goes wrong. Written to be read, not to protect us."
      sections={TERMS}
    />
  );
}
