import ReviewsPage, { reviewsMetadata } from "@/components/pages/ReviewsPage";

export const dynamic = "force-dynamic";
export const metadata = reviewsMetadata("fr");

export default function Page(props: { searchParams: Promise<{ ref?: string }> }) {
  return <ReviewsPage locale="fr" searchParams={props.searchParams} />;
}
