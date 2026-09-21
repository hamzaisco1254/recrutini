import type { Metadata } from "next";
import LegalPage from "@/components/pages/LegalPage";
import { PRIVACY_FR } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Confidentialité et vos données",
  description:
    "Ce que Recrutini collecte, pourquoi, combien de temps c'est conservé et comment tout faire supprimer. En clair, sans remplissage juridique.",
  alternates: { canonical: "/fr/legal/privacy", languages: { en: "/legal/privacy", fr: "/fr/legal/privacy", "x-default": "/legal/privacy" } },
};

export default function Page() {
  return (
    <LegalPage
      locale="fr"
      title="Confidentialité et vos données"
      intro="En résumé : nous collectons ce qu'il faut pour faire le travail, nous ne le vendons jamais, nous ne le partageons avec aucun employeur, et vous pouvez tout faire supprimer sur simple demande."
      sections={PRIVACY_FR}
    />
  );
}
