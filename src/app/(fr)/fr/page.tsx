import type { Metadata } from "next";
import Landing from "@/components/Landing";
import { t } from "@/lib/i18n";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: t("fr").meta.title },
  description: t("fr").meta.description,
  alternates: { canonical: "/fr", languages: { en: "/", fr: "/fr", "x-default": "/" } },
  openGraph: {
    locale: "fr_TN",
    title: t("fr").meta.title,
    description: t("fr").meta.description,
  },
};

export default function Page() {
  return <Landing locale="fr" />;
}
