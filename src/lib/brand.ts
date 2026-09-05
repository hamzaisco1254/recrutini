export const BRAND = {
  name: "Recruitini.tn",
  shortName: "Recruitini",
  tagline: "HR Services",
  email: "hello@recruitini.tn",
  timezone: "Africa/Tunis",
  tzLabel: "Africa / Tunis",
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

export type PackKey = "CV" | "LINKEDIN" | "INTERVIEW" | "FULL";

export const PACKS: Record<
  PackKey,
  {
    key: PackKey;
    number: string;
    title: string;
    price: number;
    strike?: number;
    duration?: string;
    featured?: boolean;
    includesInterview: boolean;
    bullets: string[];
  }
> = {
  CV: {
    key: "CV",
    number: "Pack 01",
    title: "CV Optimization",
    price: 10,
    includesInterview: false,
    bullets: [
      "Full rewrite: structure, wording, impact statements",
      "ATS-friendly formatting, editable Word + PDF",
      "Tailored to one target role or sector",
      "Two revision rounds",
    ],
  },
  LINKEDIN: {
    key: "LINKEDIN",
    number: "Pack 02",
    title: "LinkedIn Optimization",
    price: 10,
    includesInterview: false,
    bullets: [
      "Headline, About section and experience rewritten",
      "Keyword strategy so recruiters actually find you",
      "Banner, photo and settings review",
      "Two revision rounds",
    ],
  },
  INTERVIEW: {
    key: "INTERVIEW",
    number: "Pack 03",
    title: "Mock Interview",
    price: 40,
    duration: "30 min",
    includesInterview: true,
    bullets: [
      "30-minute live simulation for your target role",
      "Written feedback scored across five competencies",
      "Recording of the session, yours to keep",
      "One follow-up question after you read the report",
    ],
  },
  FULL: {
    key: "FULL",
    number: "Pack 04",
    title: "Full Pack",
    price: 50,
    strike: 60,
    featured: true,
    includesInterview: true,
    bullets: [
      "CV rewrite and LinkedIn rebuild",
      "30-minute interview simulation and feedback report",
      "Answer scripts for the questions you struggled with",
      "Everything delivered in one coordinated file",
    ],
  },
};

export const PACK_LIST = [PACKS.CV, PACKS.LINKEDIN, PACKS.INTERVIEW, PACKS.FULL];

export function packLabel(key: string) {
  return PACKS[key as PackKey]?.title ?? key;
}
