import type { Metadata } from "next";
import Landing from "@/components/Landing";
import { t } from "@/lib/i18n";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: t("en").meta.title },
  description: t("en").meta.description,
  alternates: { canonical: "/", languages: { en: "/", fr: "/fr", "x-default": "/" } },
};

export default function Page() {
  return <Landing locale="en" />;
}
