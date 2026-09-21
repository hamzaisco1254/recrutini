import ReviewsPage, { reviewsMetadata } from "@/components/pages/ReviewsPage";

export const dynamic = "force-dynamic";
export const metadata = reviewsMetadata("en");

export default function Page(props: { searchParams: Promise<{ ref?: string }> }) {
  return <ReviewsPage locale="en" searchParams={props.searchParams} />;
}
