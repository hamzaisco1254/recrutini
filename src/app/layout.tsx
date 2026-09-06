import type { Metadata } from "next";
import { Figtree, Libre_Caslon_Display } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const sans = Figtree({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Libre_Caslon_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} — CV, LinkedIn & interview coaching`,
  description:
    "We rewrite your CV, rebuild your LinkedIn profile, and put you through a real 50-minute interview simulation with written feedback. Bilingual EN / FR, Tunisia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
