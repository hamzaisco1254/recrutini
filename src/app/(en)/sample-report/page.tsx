import SampleReportPage, { sampleMetadata } from "@/components/pages/SampleReportPage";

export const metadata = sampleMetadata("en");

export default function Page() {
  return <SampleReportPage locale="en" />;
}
