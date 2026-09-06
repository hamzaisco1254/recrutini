export const BRAND = {
  name: "Recruitini.tn",
  shortName: "Recruitini",
  tagline: "HR Services",
  email: "hamzamrabet1253@gmail.com",
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

export type PackKey = "CV_LINKEDIN" | "INTERVIEW" | "FULL";

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
  CV_LINKEDIN: {
    key: "CV_LINKEDIN",
    number: "Pack 01",
    title: "CV & LinkedIn Optimization",
    price: 20,
    includesInterview: false,
    bullets: [
      "Full CV rewrite: structure, wording, impact statements",
      "ATS-friendly formatting, editable Word + PDF",
      "LinkedIn headline, About and experience rewritten",
      "Keyword strategy so recruiters actually find you",
      "Two revision rounds on both",
    ],
  },
  INTERVIEW: {
    key: "INTERVIEW",
    number: "Pack 02",
    title: "Mock Interview",
    price: 40,
    duration: "50 min",
    includesInterview: true,
    bullets: [
      "A live simulation for the exact role you are applying for",
      "Written feedback scored across five competencies",
      "Recording of the session, yours to keep",
      "One follow-up question after you read the report",
    ],
  },
  FULL: {
    key: "FULL",
    number: "Pack 03",
    title: "Full Pack",
    price: 50,
    strike: 60,
    featured: true,
    includesInterview: true,
    bullets: [
      "Coaching sessions, one to one",
      "Mock interviews for your target roles",
      "CV review and rewrite",
      "Role review: whether the job actually fits you",
      "Written feedback after every session",
      "Continuous follow-up until you land the role",
    ],
  },
};

export const PACK_LIST = [PACKS.CV_LINKEDIN, PACKS.INTERVIEW, PACKS.FULL];

/** Students looking for a PFE pay nothing while the offer runs. */
export const STUDENT_OFFER = {
  on: true,
  title: "Free for students, right now",
  body: "If you are a student looking for a PFE, every pack above is free while we build our track record in Tunisia. Pick the pack you want, upload a photo of your student card when you book, and we confirm your file the same day. No payment, no card details.",
  short: "Students looking for a PFE: free, just upload your student card.",
};

/** Facts shown in the founder section — all taken from his own profile. */
export const FOUNDER = {
  name: "Hamza Dhia Mrabet",
  role: "HR Manager · Industrial-organizational psychologist",
  location: "Tunis, Tunisia",
  linkedin: "https://www.linkedin.com/in/hamza-dhia-mrabet-561a97b8/",
  photo: "/founder.jpg",
  stats: [
    ["4 years", "hiring experience"],
    ["800+", "interviews conducted"],
  ],
  bio: [
    "Four years hiring, and more than 800 interviews conducted. I run interviews for a living: I read the applications, ask the questions and decide who moves forward — so I know what a CV has thirty seconds to prove, and what an interviewer is quietly scoring while you talk.",
    "In a session you get the real questions for your target role, and an honest answer to the thing nobody tells candidates: why they said no.",
  ],
  credentials: [
    { title: "Master's in work psychology & HR management", org: "Université de Tunis" },
    { title: "MBA, artificial-intelligence focus", org: "South Mediterranean University (MSB)" },
  ],
};

export const CREDENTIALS =
  "You work with experienced recruiters from the IT field and with occupational psychologists — qualified, with international experience.";

export function packLabel(key: string) {
  return PACKS[key as PackKey]?.title ?? key;
}
