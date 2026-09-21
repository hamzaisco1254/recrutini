import BookPage, { bookMetadata } from "@/components/pages/BookPage";

export const dynamic = "force-dynamic";
export const metadata = bookMetadata("en");

export default function Page(props: { searchParams: Promise<{ pack?: string; student?: string }> }) {
  return <BookPage locale="en" searchParams={props.searchParams} />;
}
