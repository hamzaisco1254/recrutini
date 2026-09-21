/**
 * The canonical origin. Set NEXT_PUBLIC_SITE_URL the day a real domain exists;
 * everything (sitemap, canonical tags, share cards, structured data) follows it.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://recruitini-recrutini.vercel.app"
).replace(/\/$/, "");

export const BRAND = {
  name: "Recrutini",
  shortName: "Recrutini",
  tagline: "HR Services",
  email: "hamzamrabet1253@gmail.com",
  /** Tunisia runs on WhatsApp. Digits only, international format, no plus. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  timezone: "Africa/Tunis",
  tzLabel: "Africa / Tunis",
  /** How fast we actually answer. Stated, so nobody has to wonder. */
  replyPromise: "Same day, every day, including Saturday.",
};

export function whatsappLink(message: string) {
  if (!BRAND.whatsapp) return null;
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Bank details for manual transfers. Shown on a candidate's own file page and
 * on the payment page, never on the public landing page.
 */
export const BANK = {
  holder: "Hamza Dhiaa Mrabet",
  bank: "ATB, Arab Tunisian Bank",
  branch: "Agence El Mechtel, Tunis Nord",
  rib: "01004027111608518481",
  iban: "TN5901004027111608518481",
  swift: "ATBKTNTT",
  currency: "TND",
};

export const COLORS = {
  ink: "#14140F",
  black: "#111111",
  yellow: "#FFD22F",
  yellowDark: "#F0C214",
  gold: "#C9A400",
  paper: "#F7F6F2",
  paperAlt: "#F1EFE7",
  card: "#FFFFFF",
  line: "#E4E2DA",
  line2: "#DCD9CE",
  line3: "#CFCCC0",
  text: "#3D3B34",
  muted: "#56544C",
  faint: "#86837A",
  onDark: "#E6E4DC",
  onDarkMuted: "#A9A69C",
  darkLine: "#2E2E2E",
};

export type PackKey = "CV_LINKEDIN" | "INTERVIEW" | "FULL";

export const PACKS: Record<
  PackKey,
  {
    key: PackKey;
    number: string;
    title: string;
    price: number;
    duration?: string;
    /** The situation this pack is bought in, in the candidate's own words. */
    forWho: string;
    /** One line under the price, when the pack has an argument to make. */
    note?: string;
    featured?: boolean;
    includesInterview: boolean;
    bullets: string[];
  }
> = {
  CV_LINKEDIN: {
    key: "CV_LINKEDIN",
    number: "Pack 01",
    title: "CV & LinkedIn rewrite",
    price: 20,
    forWho: "For when you apply and hear nothing.",
    includesInterview: false,
    bullets: [
      "Your CV rewritten line by line, for the ATS and for the human after it",
      "LinkedIn headline, About and experience rewritten so recruiters find you",
      "Editable Word + PDF, two rounds of revisions",
    ],
  },
  INTERVIEW: {
    key: "INTERVIEW",
    number: "Pack 02",
    title: "Mock interview",
    price: 40,
    duration: "50 min",
    forWho: "For when a real interview is coming.",
    includesInterview: true,
    bullets: [
      "50 minutes on the exact role, with the questions that role really gets",
      "Written report within 48h: five competencies scored, weak answers rewritten",
      "Feedback and coaching right after, the recording, and follow-up for all your questions",
    ],
  },
  FULL: {
    key: "FULL",
    number: "Pack 03",
    title: "Full Pack",
    price: 50,
    forWho: "For when you want the whole search handled, until you sign.",
    note: "10 dt more than the mock interview alone, with the CV and LinkedIn rewrite included.",
    featured: true,
    includesInterview: true,
    bullets: [
      "Everything in both packs",
      "One mock interview, on the role you are actually targeting",
      "Two coaching sessions, and an honest read on whether the job fits you",
      "60 days of follow-up, by email or WhatsApp",
    ],
  },
};

export const PACK_LIST = [PACKS.CV_LINKEDIN, PACKS.INTERVIEW, PACKS.FULL];

/** Students looking for a PFE pay nothing while the offer runs. */
export const STUDENT_OFFER = {
  on: true,
  title: "Hunting a PFE? All of it is free.",
  body: "Every pack, at no cost, while we build our track record in Tunisia. Pick the one you want, upload a photo of your student card when you book, and we confirm the same day. No payment, no card details.",
  short: "Students looking for a PFE: free, just upload your student card.",
};

/** Facts shown in the founder section — all taken from his own profile. */
export const FOUNDER = {
  name: "Hamza Dhia Mrabet",
  role: "HR Manager · Industrial-organizational psychologist",
  location: "Tunis, Tunisia",
  linkedin: "https://www.linkedin.com/in/hamza-dhia-mrabet-561a97b8/",
  photo: "/founder.jpg",
  markets: ["Tunisia", "MENA region", "Germany", "Spain", "France"],
  stats: [
    ["4 years", "hiring experience"],
    ["800+", "interviews conducted"],
    ["4 markets", "Tunisia · MENA · Germany · Spain · France"],
  ],
  bio: [
    "I read the applications, ask the questions and decide who moves forward. Four years of it, and more than 800 interviews. I am also trained as a work psychologist, which means I can tell you not just that an answer failed, but why it registered the way it did.",
    "Almost no candidate is ever told why they were rejected. Book a session and you get the real questions for your target role, and the honest answer nobody gives you.",
  ],
  /** The single strongest differentiator for a candidate applying abroad. */
  abroad: {
    title: "Applying abroad, or elsewhere in the region?",
    body: "I recruit across the MENA region, and in Germany, Spain and France. They do not read a CV the same way: what reads as appropriately modest in Tunis reads as vague in Berlin, and a Spanish shortlist weighs things a German one ignores. Your CV, your LinkedIn and your answers get built for the market you are targeting, instead of translated into it.",
  },
  credentials: [
    { title: "Master's in work psychology & HR management", org: "Université de Tunis" },
    { title: "MBA, artificial-intelligence focus", org: "South Mediterranean University (MSB)" },
  ],
};

export const CREDENTIALS =
  "Experienced IT recruiters and occupational psychologists, hiring across the MENA region, Germany, Spain and France.";

/** Sessions and written reports are delivered in any of these. */
export const LANGUAGES = [
  { key: "EN", label: "English", short: "EN" },
  { key: "FR", label: "Français", short: "FR" },
  { key: "AR", label: "العربية", short: "AR" },
] as const;

export type LanguageKey = (typeof LANGUAGES)[number]["key"];

export function languageLabel(key: string) {
  return LANGUAGES.find((l) => l.key === key)?.label ?? key;
}

export function packLabel(key: string) {
  return PACKS[key as PackKey]?.title ?? key;
}
