import type { Metadata } from "next";
import LegalPage from "@/components/pages/LegalPage";
import { TERMS_FR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "CGV, remboursements et annulations",
  description:
    "Ce que vous achetez, ce que nous promettons, comment reporter ou annuler, et dans quels cas vous êtes remboursé.",
  alternates: { canonical: "/fr/legal/terms", languages: { en: "/legal/terms", fr: "/fr/legal/terms", "x-default": "/legal/terms" } },
};

export default function Page() {
  return (
    <LegalPage
      locale="fr"
      title="CGV, remboursements et annulations"
      intro="Ce que vous achetez, ce que nous promettons, et ce qui se passe si ça tourne mal. Écrit pour être lu, pas pour nous protéger."
      sections={TERMS_FR}
    />
  );
}
