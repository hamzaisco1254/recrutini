import { notFound } from "next/navigation";

/** Unmatched URLs land on this language's not-found page, inside its own layout. */
export default function CatchAll() {
  notFound();
}
