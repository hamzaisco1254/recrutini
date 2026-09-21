import type { Metadata } from "next";
import LegalPage from "@/components/pages/LegalPage";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy and your data",
  description:
    "What Recrutini collects, why, how long it is kept, and how to have it deleted. Plain language, no legal padding.",
  alternates: { canonical: "/legal/privacy", languages: { en: "/legal/privacy", fr: "/fr/legal/privacy", "x-default": "/legal/privacy" } },
};

export default function Page() {
  return (
    <LegalPage
      title="Privacy and your data"
      intro="Short version: we collect what we need to do the work, we never sell it, we never share it with employers, and you can have it deleted by asking."
      sections={PRIVACY}
    />
  );
}
