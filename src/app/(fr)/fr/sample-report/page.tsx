import SampleReportPage, { sampleMetadata } from "@/components/pages/SampleReportPage";

export const metadata = sampleMetadata("fr");

export default function Page() {
  return <SampleReportPage locale="fr" />;
}
