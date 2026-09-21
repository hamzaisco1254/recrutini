import BookPage, { bookMetadata } from "@/components/pages/BookPage";

export const dynamic = "force-dynamic";
export const metadata = bookMetadata("fr");

export default function Page(props: { searchParams: Promise<{ pack?: string; student?: string }> }) {
  return <BookPage locale="fr" searchParams={props.searchParams} />;
}
