import StatusFilePage from "@/components/pages/StatusFilePage";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default function Page(props: { params: Promise<{ ref: string }> }) {
  return <StatusFilePage locale="en" params={props.params} />;
}
