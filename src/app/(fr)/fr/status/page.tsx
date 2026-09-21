import StatusLookupPage, { statusMetadata } from "@/components/pages/StatusLookupPage";

export const dynamic = "force-dynamic";
export const metadata = statusMetadata("fr");

export default function Page(props: { searchParams: Promise<{ e?: string; notfound?: string; r?: string }> }) {
  return <StatusLookupPage locale="fr" searchParams={props.searchParams} />;
}
