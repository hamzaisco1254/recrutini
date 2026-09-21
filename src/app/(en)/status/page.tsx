import StatusLookupPage, { statusMetadata } from "@/components/pages/StatusLookupPage";

export const dynamic = "force-dynamic";
export const metadata = statusMetadata("en");

export default function Page(props: { searchParams: Promise<{ e?: string; notfound?: string; r?: string }> }) {
  return <StatusLookupPage locale="en" searchParams={props.searchParams} />;
}
