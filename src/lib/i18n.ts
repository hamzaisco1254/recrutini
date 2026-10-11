import { BANK, BRAND, FOUNDER } from "./brand";

/**
 * Two languages, one structure.
 *
 * French is not a translation of the English here — it is written for the
 * person it is aimed at. A Tunisian graduate, and the parent often paying,
 * read French as the language of professional seriousness, so the French cut
 * is slightly more formal and leans harder on the international angle, which
 * is what that audience is actually buying.
 */

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Prefix a path for a locale. English lives at the root. */
export function localePath(locale: Locale, path = "/") {
  const clean = path === "/" ? "" : path;
  return locale === "en" ? clean || "/" : `/fr${clean}`;
}

export type Pack = {
  key: "CV_LINKEDIN" | "INTERVIEW" | "FULL";
  number: string;
  title: string;
  price: number;
  duration?: string;
  forWho: string;
  note?: string;
  featured?: boolean;
  includesInterview: boolean;
  bullets: string[];
};

export type Copy = {
  htmlLang: string;
  meta: { title: string; description: string };
  nav: {
    packs: string; process: string; interview: string; why: string;
    founder: string; reviews: string; faq: string; contact: string; track: string; book: string;
    switchTo: string; switchLabel: string; sectionsLabel: string;
    menu: string; closeMenu: string; menuLabel: string;
  };
  contact: {
    label: string; h2: string; h2em: string; lead: string;
    name: string; email: string; topic: string; topics: string[];
    message: string; placeholder: string; send: string;
    sentTitle: string; sentBody: string; another: string;
    direct: string; replyTime: string; privacy: string;
    errors: { name: string; email: string; body: string; server: string };
  };
  hero: {
    label: string; h1a: string; h1em: string; sub: string;
    cta: string; cta2: string; note: string;
    panelLabel: string; panelNum: string; panelCopy: string; panelGo: string;
  };
  askFirst: { prompt: string; whatsapp: string };
  intro: { label: string; h2: string; h2em: string; lead: string };
  reasons: { label: string; h2: string; h2em: string; items: { k: string; t: string; b: string }[] };
  proof: { lead: string; leadStrong: string; stats: [string, string][]; note: string };
  packs: {
    label: string; h2: string; h2em: string; sub: string; footnote: string;
    choose: string; chooseFeatured: string; bestValue: string;
    assure: [string, string, string][];
    list: Pack[];
  };
  student: { title: string; body: string; cta: string; meta: string; short: string; tag: string; line: string; band: string };
  process: { label: string; h2: string; h2em: string; steps: { n: string; title: string; body: string }[] };
  interview: {
    label: string; h2: string; body: string; cta: string; sample: string;
    steps: { n: string; title: string; body: string }[];
  };
  human: {
    label: string; h2: string; h2em: string; intro: string;
    aiTitle: string; usTitle: string;
    matrix: { row: string; ai: boolean; us: boolean }[];
    verdict: string; cta: string;
  };
  video: { label: string; h2: string; body: string; play: string; caption: string; close: string; captions: string; captionsNote: string };
  founder: {
    label: string; h2: string; h2em: string; role: string; bio: string[];
    abroadTitle: string; abroadBody: string;
    credentials: { title: string; org: string }[];
    stats: [string, string][];
    quote: string;
    cta: string; linkedin: string;
  };
  reviews: { h2: string; sub: string; readAll: string; leave: string };
  faq: { label: string; h2: string; h2em: string; sub: string; items: { q: string; a: string }[] };
  footer: { h2: string; sub: string; cta1: string; cta2: string; tagline: string; privacy: string; terms: string; track: string; reviews: string; admin: string };
  sticky: { price: string; note: string; book: string };
  common: {
    tagline: string; book: string; bookAria: string; whatsappAria: string;
    backToSite: string; free: string; sending: string; checkForm: string;
    notFoundTitle: string; notFoundBody: string; notFoundCta: string;
  };
  book: {
    metaTitle: string; metaDesc: string; eyebrow: string; h1: string; lead: string; dbError: string;
    step1: string; step2: string; step3: string; freeStudent: string;
    studentCheck: string; studentSub: string; cardLabel: string; cardUploaded: string; cardHint: string;
    replace: string; uploading: string; tooBig: string; uploadFailed: string; cardNote: string;
    sessionLead: string; sessionLang: string; date: string; noSlots: string; time: string;
    fullName: string; email: string; emailPh: string; phone: string; targetRole: string; targetRolePh: string;
    cvLink: string; cvPh: string; linkedin: string; linkedinPh: string; jobPosting: string; jobPostingPh: string;
    notes: string; notesPh: string; pickDateTime: string; requestSession: string; sendRequest: string;
    noteStudent: string; noteNormal: string;
    errors: { name: string; email: string; card: string; slot: string; taken: string; save: string };
  };
  status: {
    metaTitle: string; eyebrow: string; h1: string; lead: string; refLabel: string; emailLabel: string;
    bad: string; slow: string; open: string; keep: string;
    fileEyebrow: string; where: string; file: string; payment: string; session: string; state: string;
    join: string; payTitle: string; payNote1: string; payNote2: string;
    studentTitle: string; studentBody: string; reportSoon: string; howTitle: string; howBody: string;
    leaveReview: string; bookmark: string;
    payFree: string; payReceived: string; payRefunded: string; payPending: string;
    orderStatus: Record<string, string>; bookingStatus: Record<string, string>;
    bank: { amount: string; reference: string };
  };
  reviewsPage: {
    metaTitle: string; metaDesc: string; eyebrow: string; h1: string; lead: string;
    average: (avg: string, n: number) => string; listTitle: string; verified: string; outOf: string;
    form: {
      rating: string; ratingAria: string; tapStar: string; name: string; role: string; rolePh: string;
      body: string; bodyPh: string; ref: string; refHint: string; send: string; moderated: string;
      thanksTitle: string; thanksBody: string;
      errors: { name: string; rating: string; body: string; save: string };
    };
  };
  sample: {
    metaTitle: string; metaDesc: string; eyebrow: string; h1: string; lead: string; label: string;
    competencies: string; moments: string; said: string; instead: string; actions: string;
    yoursTitle: string; yoursBody: (interview: number, full: number) => string; cta: string; seeAll: string; disclaimer: string;
  };
  report: {
    label: string; sessionOf: string; interviewer: string; outOf: string; landed: string; toFix: string;
    rewritten: string; download: string; recording: string; followUp: string;
  };
};

// ---------------------------------------------------------------- English ---

const en: Copy = {
  htmlLang: "en",
  meta: {
    title: "Mock interviews and CV review, by a real recruiter | Recrutini",
    description:
      "Mock interviews, CV and LinkedIn rewrites with a recruiter who has run 800+ interviews across the MENA region, Germany, Spain and France. Written feedback in 48h. From 20 dt.",
  },
  nav: {
    packs: "Packs", process: "How it works", interview: "Mock interview", why: "Why a human",
    founder: "Founder", reviews: "Reviews", faq: "FAQ", contact: "Contact", track: "Track my order", book: "Book",
    switchTo: "Français", switchLabel: "Language", sectionsLabel: "Sections",
    menu: "Menu", closeMenu: "Close menu", menuLabel: "Site menu",
  },
  contact: {
    label: "Contact",
    h2: "Ask before you", h2em: "book.",
    lead: "A real person reads this and answers the same day.",
    name: "Your name", email: "Your email", topic: "About",
    topics: ["Choosing a pack", "The mock interview", "CV or LinkedIn", "Student / PFE", "Payment", "Something else"],
    message: "Your question", placeholder: "The role you're after, and what you're unsure about.",
    send: "Send the question",
    sentTitle: "Sent.", sentBody: "You'll have an answer today, from the recruiter, not a robot.",
    another: "Ask something else",
    direct: "Or write to us directly", replyTime: "Same-day reply, every day.",
    privacy: "Your message is stored with us and never shared. Nothing else is collected.",
    errors: {
      name: "Tell us your name.",
      email: "We need an email to answer you.",
      body: "Say a little more, so the answer is worth reading.",
      server: "That didn't send. Try again, or write to contact@recrutini.tn.",
    },
  },
  hero: {
    label: "CV · LinkedIn · Mock interviews · Tunis",
    h1a: "Your CV and your interview, prepared with",
    h1em: "a real recruiter.",
    sub: "Honest feedback on your CV, your LinkedIn and a real mock interview, from a recruiter who has run 800+ of them.",
    cta: "Book a session", cta2: "Play",
    note: "From 20 dt · Free for students hunting a PFE · We reply the same day",
    panelLabel: "Mock interview", panelNum: "50 min",
    panelCopy: "The interview you are about to face. Feedback right after, then a written report.",
    panelGo: "Book a mock interview →",
  },
  askFirst: { prompt: "Not sure which pack? Ask before you book.", whatsapp: "WhatsApp" },
  intro: {
    label: "Recrutini",
    h2: "Know what's holding you back.", h2em: "Then fix it.",
    lead: "A recruiter reads your CV, runs your interview, and tells you exactly what to change. Then we stay: your partner for every application that follows.",
  },
  reasons: {
    label: "Why Recrutini",
    h2: "Three reasons", h2em: "to book with a recruiter.",
    items: [
      { k: "01 · Experience", t: "800+ interviews, hiring side", b: "Four years deciding who moves forward, across four markets." },
      { k: "02 · Honesty", t: "Feedback nobody else gives you", b: "The line a hiring manager stops at, and why a correct answer still lost." },
      { k: "03 · No risk", t: "You pay after we confirm", b: "No card, no deposit, free cancellation, and nothing at all for PFE students." },
    ],
  },
  proof: {
    lead: "You apply, and you hear nothing. Most CV services are written by people who have never had to reject anyone.",
    leadStrong: "This one is run from the other side of the table.",
    stats: [
      ["800+", "interviews run from the hiring side"],
      ["International experience", "Tunisia · Germany · Spain · France"],
      ["Premium, personalised", "one session built around you, never a template"],
    ],
    note: "We can't promise you the job. We can make sure your CV and interview don't cost you the opportunity.",
  },
  packs: {
    label: "Packs",
    h2: "Three ways in.", h2em: "Pick the one that fits today.",
    sub: "Hearing nothing back? Start with the CV. Interview soon? Book the mock. Want both? Take the Full Pack. Sessions in English, French or Arabic.",
    footnote: "Sessions in English, French or Arabic, weekdays and Saturday mornings. You get the bank details once your slot is confirmed.",
    choose: "Choose this pack", chooseFeatured: "Take the Full Pack", bestValue: "Best value",
    assure: [
      ["✓", "You pay after we confirm", "Pick a slot, we confirm it, then you get the bank details. No card, no deposit."],
      ["✕", "Cancel free up to 12h before", "Reschedule as often as you need. Cancel in time and you are refunded in full."],
      ["⚑", "A person, not a form", "A recruiter answers, and the same person runs your session."],
    ],
    list: [
      {
        key: "CV_LINKEDIN", number: "Pack 01", title: "CV & LinkedIn rewrite", price: 20,
        forWho: "For when you apply and hear nothing.", includesInterview: false,
        bullets: [
          "Your CV rewritten line by line, for the ATS and for the human after it",
          "LinkedIn headline, About and experience rewritten so recruiters find you",
          "Editable Word + PDF, two rounds of revisions",
        ],
      },
      {
        key: "INTERVIEW", number: "Pack 02", title: "Mock interview", price: 40, duration: "50 min",
        forWho: "For when a real interview is coming.", includesInterview: true,
        bullets: [
          "50 minutes on the exact role, with the questions that role really gets",
          "Written report within 48h: five competencies scored, weak answers rewritten",
          "Feedback and coaching right after, the recording, and follow-up for all your questions",
        ],
      },
      {
        key: "FULL", number: "Pack 03", title: "Full Pack", price: 50, featured: true,
        forWho: "For when you want the whole search handled, until you sign.",
        note: "10 dt more than the mock interview alone, with the CV and LinkedIn rewrite included.",
        includesInterview: true,
        bullets: [
          "Everything in both packs",
          "One mock interview, on the role you are actually targeting",
          "Two coaching sessions, and an honest read on whether the job fits you",
          "60 days of follow-up, by email or WhatsApp",
        ],
      },
    ],
  },
  student: {
    title: "Hunting a PFE? It's free.",
    body: "Every pack, at no cost, while we build our track record in Tunisia. Upload a photo of your student card when you book; we confirm the same day.",
    cta: "Book as a student",
    meta: "Card checked by hand · Deleted on request",
    short: "Looking for a PFE? It's free for students.",
    tag: "Free",
    line: "Every pack, at no cost, while we build our track record in Tunisia. Upload a photo of your student card when you book and we confirm the same day.",
    band: "Hunting a PFE? Every pack is free.",
  },
  process: {
    label: "How it works", h2: "Five minutes to book.", h2em: "The rest is on us.",
    steps: [
      { n: "01", title: "Tell us the job you're after", body: "One form, five minutes. No call to book a call, no sales pitch." },
      { n: "02", title: "We get to work", body: "Your CV rewritten in four working days. Or your interview: 50 minutes on video, with the questions that role really gets." },
      { n: "03", title: "You hear it straight", body: "What worked, what didn't, and what to say instead. In the session, then in writing. Then ask us anything." },
    ],
  },
  interview: {
    label: "The mock interview",
    h2: "A real interview, before the one that counts",
    body: "Send the job posting. We run the interview that hiring manager would run: competency questions, pressure follow-ups, the salary talk. Then we tell you plainly what worked and what to say instead.",
    cta: "Book a mock interview", sample: "See a sample report",
    steps: [
      { n: "01", title: "Intake, 24h before", body: "Job posting, CV, company." },
      { n: "02", title: "50 minutes, video, no pauses", body: "Like the real thing." },
      { n: "03", title: "Feedback right after, in the session", body: "What worked, what did not, and what to say instead. Then the written report within 48h." },
      { n: "04", title: "Follow-up for all your questions", body: "Write to us as often as you need once you have read it." },
    ],
  },
  human: {
    label: "Why a human",
    h2: "Use AI.", h2em: "Then talk to someone who has hired.",
    intro: "AI is good at first drafts. We use it too. It has just never sat where a recruiter sits.",
    aiTitle: "AI",
    usTitle: "A recruiter",
    matrix: [
      { row: "Draft a CV in seconds", ai: true, us: true },
      { row: "Make a paragraph sound smooth", ai: true, us: true },
      { row: "Suggest an answer to any question", ai: true, us: true },
      { row: "Tell you why you were rejected", ai: false, us: true },
      { row: "Know the line a hiring manager stops at", ai: false, us: true },
      { row: "Hear that a correct answer still missed", ai: false, us: true },
      { row: "Ask the follow-up nobody practises", ai: false, us: true },
    ],
    verdict: "Human judgment, with technology doing the boring parts.",
    cta: "Book a mock interview",
  },
  video: {
    label: "40 seconds",
    h2: "See how it works",
    body: "Why practising alone stops working, and what a session actually is.",
    play: "Play", caption: "40 seconds", close: "Close",
    captions: "English captions", captionsNote: "Subtitled. Sound on if you can.",
  },
  founder: {
    label: "Who you work with", h2: "Hamza Dhia Mrabet.", h2em: "HR manager, work psychologist.",
    role: FOUNDER.role,
    bio: [
      "I read the applications, ask the questions and decide who moves forward. Four years of it, more than 800 interviews, and a background in work psychology, so I can tell you not just that an answer failed, but why it landed the way it did.",
      "Almost nobody is ever told why they were rejected. That is what a session gives you.",
    ],
    abroadTitle: "Applying abroad, or elsewhere in the region?",
    abroadBody: "Tunisia, MENA, Germany, Spain and France do not read a CV the same way. Your file is built for the market you target, not translated into it.",
    credentials: FOUNDER.credentials,
    stats: FOUNDER.stats.map(([a, b]) => [a, b]),
    quote: "We can't promise you the job. We can make sure your CV and interview don't cost you the opportunity.",
    cta: "Book with Hamza", linkedin: "Full profile on LinkedIn",
  },
  reviews: {
    h2: "What candidates say",
    sub: "Written by people who booked, published as they come.",
    readAll: "Read all reviews", leave: "Leave a review",
  },
  faq: {
    label: "FAQ", h2: "Questions", h2em: "candidates ask.",
    sub: "Anything else, write to us. We answer within a day.",
    items: [
      { q: "20 dt seems low. Is the work any good?", a: "Deliberately low while we build our track record in Tunisia. The work is done by someone who reads CVs on the hiring side for a living, and students hunting a PFE pay nothing." },
      { q: "How do I pay?", a: "Book first, pay after. Your file page shows the bank details and your reference: transfer or D17, and we confirm the same day. Your slot is held 48 hours." },
      { q: "Can the session be in Arabic?", a: "Yes. Sessions and written reports come in English, French or Arabic. You pick when you book." },
      { q: "I'm applying abroad. Can you help?", a: "That is where this helps most. None of those markets read a CV the same way. Your file is built for the one you target, not translated into it." },
      { q: "What happens to my documents?", a: "They stay with the recruiter on your file and are deleted on request. Recordings go to you only. The privacy page has the details." },
    ],
  },
  footer: {
    h2: "The right opportunity deserves the right preparation.",
    sub: "Pick a pack, fill the form, and hear from a recruiter the same day. From 20 dt, and free if you are a student hunting a PFE.",
    cta1: "Choose a pack", cta2: "Book a mock interview",
    tagline: "Tunis, Tunisia · HR services for candidates",
    privacy: "Privacy", terms: "Terms & refunds", track: "Track my order", reviews: "Reviews", admin: "Admin",
  },
  sticky: { price: "From 20 dt", note: "Free for PFE students", book: "Book" },
  common: {
    tagline: "HR Services", book: "Book your session", bookAria: "Book a session", whatsappAria: "Ask on WhatsApp",
    backToSite: "Back to the site", free: "free", sending: "Sending…", checkForm: "Please check the form.",
    notFoundTitle: "That page doesn't exist.", notFoundBody: "The link may be old, or mistyped. Everything you need is one click away.", notFoundCta: "Back to the home page",
  },
  book: {
    metaTitle: "Book your session", metaDesc: "Choose a pack, pick a slot, tell us who you are. You pay once your slot is confirmed.",
    eyebrow: "Booking", h1: "Book your session",
    lead: "Choose a pack, pick your slot if it includes the interview, and tell us who you are. You get a reference code to follow your file.",
    dbError: "The booking calendar is unavailable right now. Write to us and we will book you by hand.",
    step1: "1. Your pack", step2: "2. Your 50 minutes", step3: "Your details", freeStudent: "free, student offer",
    studentCheck: "I'm a student looking for a PFE",
    studentSub: "Everything is free while the offer runs. Upload your student card and we confirm your file the same day.",
    cardLabel: "Student card", cardUploaded: "· uploaded", cardHint: "(photo or PDF, max 6 MB)",
    replace: "Replace", uploading: "Uploading…",
    tooBig: "That file is over 6 MB. Please upload a smaller photo.",
    uploadFailed: `We couldn't upload that file. Try again, or email your card to ${BRAND.email} and we'll sort it out.`,
    cardNote: "We use it only to confirm you are a student, and delete it on request.",
    sessionLead: "Sessions run 50 minutes with no break. Reschedule up to 12 hours before.",
    sessionLang: "Language of the session", date: "Date",
    noSlots: "No slots are open at the moment. Send us a note below and we'll open one for you.",
    time: "Time",
    fullName: "Full name", email: "Email", emailPh: "you@email.com", phone: "Phone (optional)",
    targetRole: "Target role", targetRolePh: "Product Marketing Manager",
    cvLink: "Link to your CV (Drive / Dropbox)", cvPh: "https://drive.google.com/...",
    linkedin: "LinkedIn profile", linkedinPh: "https://linkedin.com/in/...",
    jobPosting: "Job posting (link)", jobPostingPh: "Paste the posting you are preparing for",
    notes: "Anything we should know", notesPh: "Career change, sector you are targeting, deadlines…",
    pickDateTime: "Pick a date and a time to continue.",
    requestSession: "Request this session", sendRequest: "Send my request",
    noteStudent: "Nothing to pay. We check your student card and confirm your file the same day.",
    noteNormal: "Nothing is charged online. We confirm your slot by email with payment instructions.",
    errors: {
      name: "Please give your full name.", email: "That email address doesn't look right.",
      card: "Please upload a photo of your student card so we can confirm the free offer.",
      slot: "Please pick a date and a time for your session.",
      taken: "That slot was just taken. Please choose another time.",
      save: "Something went wrong saving your request. Please try again.",
    },
  },
  status: {
    metaTitle: "Track my order", eyebrow: "Your file", h1: "Track your order",
    lead: "Your reference code and the email you booked with.",
    refLabel: "Reference code", emailLabel: "Email used to book",
    bad: "That code and email don't match an order. Check both, or write to",
    slow: "Too many attempts. Wait a few minutes and try again.",
    open: "Open my file", keep: "Files stay open in this browser for 30 days, so you can bookmark the page.",
    fileEyebrow: "Reference", where: "Where things stand", file: "File", payment: "Payment", session: "Session", state: "Status",
    join: "Join the session", payTitle: "Paying for this",
    payNote1: "Write your reference", payNote2: "in the transfer note, then send the receipt to",
    studentTitle: "Student offer",
    studentBody: "Your student card is with us and this file is free. Nothing to pay, no card details. If anything is unclear on the card we will write to you at",
    reportSoon: "Your feedback report is being written. It lands here within 48 hours of the session.",
    howTitle: "How did it go?", howBody: "If it helped, a couple of sentences from you helps the next candidate decide.",
    leaveReview: "Leave a review", bookmark: "Bookmark this page: it is the live state of your file.",
    payFree: "Free, student offer. Nothing to pay.", payReceived: "Received", payRefunded: "Refunded", payPending: "Pending",
    orderStatus: {
      NEW: "Received. We are reviewing your file.",
      IN_PROGRESS: "In progress. A recruiter is working on it.",
      DELIVERED: "Delivered. Check your inbox.",
      CANCELLED: "Cancelled.",
    },
    bookingStatus: {
      PENDING: "Requested. We confirm once payment is received.",
      CONFIRMED: "Confirmed. The link is in your email.",
      COMPLETED: "Done. Your feedback report is below.",
      CANCELLED: "Cancelled.",
    },
    bank: { amount: "Amount", reference: "Reference to write" },
  },
  reviewsPage: {
    metaTitle: "Reviews", metaDesc: "What candidates say after a CV rewrite, a LinkedIn rewrite or a mock interview with Recrutini. Published as they come, good or bad.",
    eyebrow: "Reviews", h1: "How did it go?",
    lead: "If we worked on your CV, your LinkedIn or an interview, tell other candidates what it was actually like. Good or bad.",
    average: (avg, n) => `${avg} / 5 from ${n} published review${n === 1 ? "" : "s"}.`,
    listTitle: "What candidates said", verified: "Verified client", outOf: "out of 5",
    form: {
      rating: "Your rating", ratingAria: "Rating out of five", tapStar: "Tap a star",
      name: "Your name", role: "Role you were applying for (optional)", rolePh: "Software engineer, PFE",
      body: "Your review", bodyPh: "What did you book, what changed, and would you tell a friend to do it?",
      ref: "Reference code (optional)", refHint: "From your confirmation. If it matches, your review is marked as a verified client.",
      send: "Send my review", moderated: "Reviews are read before they go on the site.",
      thanksTitle: "Thank you. That means a lot.",
      thanksBody: "Your review has been sent. We read every one by hand before it appears on the site, so give it a day or so to show up.",
      errors: {
        name: "Please give your name.", rating: "Please pick a rating.",
        body: "Please write a couple of sentences so it is useful to other candidates.",
        save: "Something went wrong saving your review. Please try again.",
      },
    },
  },
  sample: {
    metaTitle: "What the feedback report looks like",
    metaDesc: "A complete worked example of the written report you get after a mock interview: five competencies scored, the moments that cost you the offer, and what to say instead.",
    eyebrow: "Example · not a real client", h1: "What you actually get back",
    lead: "Every mock interview ends with a written report like this one, within 48 hours. This is a worked example so you can see the depth before you pay for it. The candidate is invented; the format, the scoring and the level of detail are exactly what we send.",
    label: "Feedback report · example",
    competencies: "The five competencies", moments: "Three moments that cost you the offer",
    said: "You said", instead: "Say this instead", actions: "Do these four things before the real one",
    yoursTitle: "Yours lands within 48 hours of the session",
    yoursBody: (i, f) => `Built on the job you are actually applying for, with the recording to go with it. ${i} dt for the mock interview, or ${f} dt for the Full Pack with three of them.`,
    cta: "Book a mock interview", seeAll: "See all packs",
    disclaimer: "This example was written by us to demonstrate the format. It is not a real candidate and no client's report, CV or recording is ever published.",
  },
  report: {
    label: "Feedback report", sessionOf: "Session of", interviewer: "Interviewer", outOf: "out of 5",
    landed: "What landed well", toFix: "What to fix before the real interview", rewritten: "Rewritten answer",
    download: "Download report (PDF)", recording: "Watch recording", followUp: "Follow-up included for all your questions",
  },
};

// ----------------------------------------------------------------- French ---

const fr: Copy = {
  htmlLang: "fr",
  meta: {
    title: "Entretien blanc et CV en Tunisie, avec un vrai recruteur | Recrutini",
    description:
      "Entretiens blancs, CV et LinkedIn réécrits avec un recruteur qui a mené 800+ entretiens dans la région MENA, en Allemagne, en Espagne et en France. Retour écrit sous 48 h. Dès 20 dt.",
  },
  nav: {
    packs: "Formules", process: "Comment ça marche", interview: "Entretien blanc", why: "Pourquoi un humain",
    founder: "Fondateur", reviews: "Avis", faq: "FAQ", contact: "Contact", track: "Suivre ma commande", book: "Réserver",
    switchTo: "English", switchLabel: "Langue", sectionsLabel: "Sections",
    menu: "Menu", closeMenu: "Fermer le menu", menuLabel: "Menu du site",
  },
  contact: {
    label: "Contact",
    h2: "Une question avant de", h2em: "réserver ?",
    lead: "Une vraie personne lit votre message et répond le jour même.",
    name: "Votre nom", email: "Votre e-mail", topic: "Sujet",
    topics: ["Choisir une formule", "L'entretien blanc", "CV ou LinkedIn", "Étudiant / PFE", "Paiement", "Autre chose"],
    message: "Votre question", placeholder: "Le poste que vous visez, et ce sur quoi vous hésitez.",
    send: "Envoyer la question",
    sentTitle: "C'est envoyé.", sentBody: "Vous aurez une réponse aujourd'hui, du recruteur, pas d'un robot.",
    another: "Poser une autre question",
    direct: "Ou écrivez-nous directement", replyTime: "Réponse le jour même, tous les jours.",
    privacy: "Votre message reste chez nous et n'est jamais partagé. Rien d'autre n'est collecté.",
    errors: {
      name: "Dites-nous votre nom.",
      email: "Il nous faut un e-mail pour vous répondre.",
      body: "Donnez un peu plus de détails, la réponse n'en sera que meilleure.",
      server: "L'envoi a échoué. Réessayez, ou écrivez à contact@recrutini.tn.",
    },
  },
  hero: {
    label: "CV · LinkedIn · Entretiens blancs · Tunis",
    h1a: "Votre CV et votre entretien, préparés avec",
    h1em: "un vrai recruteur.",
    sub: "Un retour honnête sur votre CV, votre LinkedIn et un vrai entretien blanc, par un recruteur qui en a mené plus de 800.",
    cta: "Réserver une session", cta2: "Lecture",
    note: "À partir de 20 dt · Gratuit pour les étudiants en PFE · Réponse le jour même",
    panelLabel: "Entretien blanc", panelNum: "50 min",
    panelCopy: "L'entretien qui vous attend. Retour immédiat, puis un rapport écrit.",
    panelGo: "Réserver un entretien blanc →",
  },
  askFirst: { prompt: "Une question avant de réserver ? Écrivez-nous.", whatsapp: "WhatsApp" },
  intro: {
    label: "Recrutini",
    h2: "Sachez ce qui vous freine.", h2em: "Puis corrigez-le.",
    lead: "Un recruteur lit votre CV, mène votre entretien, et vous dit précisément quoi changer. Puis on reste : votre partenaire pour chaque candidature qui suit.",
  },
  reasons: {
    label: "Pourquoi Recrutini",
    h2: "Trois raisons", h2em: "de réserver avec un recruteur.",
    items: [
      { k: "01 · Expérience", t: "800+ entretiens, côté recruteur", b: "Quatre ans à décider qui passe à l'étape suivante, sur quatre marchés." },
      { k: "02 · Franchise", t: "Le retour que personne d'autre ne vous donne", b: "La ligne sur laquelle un recruteur s'arrête, et pourquoi une réponse juste a perdu." },
      { k: "03 · Sans risque", t: "Vous payez après confirmation", b: "Ni carte, ni acompte, annulation libre, et rien du tout pour les étudiants en PFE." },
    ],
  },
  proof: {
    lead: "Vous postulez, et rien ne revient. La plupart des services de CV sont rédigés par des gens qui n'ont jamais eu à refuser personne.",
    leadStrong: "Celui-ci est tenu de l'autre côté de la table.",
    stats: [
      ["800+", "entretiens menés côté recruteur"],
      ["Expérience internationale", "Tunisie · Allemagne · Espagne · France"],
      ["Premium, personnalisé", "une séance construite pour vous, jamais un modèle"],
    ],
    note: "Nous ne pouvons pas vous promettre le poste. Nous pouvons faire en sorte que votre CV et votre entretien ne vous le fassent pas perdre.",
  },
  packs: {
    label: "Formules",
    h2: "Trois façons de commencer.", h2em: "Choisissez celle qu'il vous faut aujourd'hui.",
    sub: "Vous postulez sans réponse ? Commencez par le CV. Un entretien approche ? Réservez l'entretien blanc. Vous voulez les deux ? Prenez le Pack complet. Sessions en français, en anglais ou en arabe.",
    footnote: "Sessions en français, en anglais ou en arabe, en semaine et le samedi matin. Vous recevez le RIB une fois votre créneau confirmé.",
    choose: "Choisir cette formule", chooseFeatured: "Prendre le Pack complet", bestValue: "Meilleur rapport",
    assure: [
      ["✓", "Vous payez après confirmation", "Vous choisissez un créneau, nous le confirmons, puis vous recevez le RIB. Ni carte bancaire, ni acompte."],
      ["✕", "Annulation libre jusqu'à 12 h avant", "Reportez autant que nécessaire. Annulez à temps et vous êtes remboursé intégralement."],
      ["⚑", "Une personne, pas un formulaire", "Un recruteur vous répond, et c'est la même personne qui mène votre session."],
    ],
    list: [
      {
        key: "CV_LINKEDIN", number: "Formule 01", title: "Réécriture CV & LinkedIn", price: 20,
        forWho: "Quand vous postulez et que rien ne revient.", includesInterview: false,
        bullets: [
          "Votre CV réécrit ligne par ligne, pour l'ATS et pour l'humain qui lit ensuite",
          "Titre, résumé et expériences LinkedIn réécrits pour que les recruteurs vous trouvent",
          "Word et PDF modifiables, deux séries de corrections",
        ],
      },
      {
        key: "INTERVIEW", number: "Formule 02", title: "Entretien blanc", price: 40, duration: "50 min",
        forWho: "Quand un vrai entretien approche.", includesInterview: true,
        bullets: [
          "50 minutes sur le poste exact, avec les questions qu'on pose vraiment pour ce poste",
          "Rapport écrit sous 48 h : cinq compétences notées, réponses faibles réécrites",
          "Retour et coaching juste après, l'enregistrement, et un suivi pour toutes vos questions",
        ],
      },
      {
        key: "FULL", number: "Formule 03", title: "Pack complet", price: 50, featured: true,
        forWho: "Quand vous voulez être accompagné jusqu'à la signature.",
        note: "10 dt de plus que l'entretien blanc seul, avec la réécriture du CV et du LinkedIn en plus.",
        includesInterview: true,
        bullets: [
          "Tout ce que contiennent les deux formules",
          "Un entretien blanc, sur le poste que vous visez vraiment",
          "Deux séances de coaching, et un avis franc sur le poste : vous correspond-il vraiment ?",
          "60 jours de suivi, par e-mail ou WhatsApp",
        ],
      },
    ],
  },
  student: {
    title: "En recherche de PFE ? C'est gratuit.",
    body: "Toutes les formules, sans rien payer, le temps de construire nos références en Tunisie. Téléversez une photo de votre carte d'étudiant à la réservation ; nous confirmons le jour même.",
    cta: "Réserver en tant qu'étudiant",
    meta: "Carte vérifiée à la main · Supprimée sur demande",
    short: "Vous cherchez un PFE ? C'est gratuit pour les étudiants.",
    tag: "Gratuit",
    line: "Toutes les formules, sans rien payer, le temps de construire nos références en Tunisie. Téléversez une photo de votre carte d'étudiant à la réservation et nous confirmons le jour même.",
    band: "En recherche de PFE ? Toutes les formules sont gratuites.",
  },
  process: {
    label: "Comment ça marche", h2: "Cinq minutes pour réserver.", h2em: "Le reste, c'est pour nous.",
    steps: [
      { n: "01", title: "Dites-nous quel poste vous visez", body: "Un formulaire, cinq minutes. Pas d'appel pour prendre un appel, pas de discours commercial." },
      { n: "02", title: "On se met au travail", body: "Votre CV réécrit sous quatre jours ouvrés. Ou votre entretien : 50 minutes en visio, avec les questions qu'on pose vraiment pour ce poste." },
      { n: "03", title: "On vous dit les choses franchement", body: "Ce qui a marché, ce qui n'a pas marché, et quoi dire à la place. Dans la séance, puis par écrit. Ensuite, posez-nous toutes vos questions." },
    ],
  },
  interview: {
    label: "L'entretien blanc",
    h2: "Un vrai entretien, avant celui qui compte",
    body: "Envoyez l'offre. Nous menons l'entretien que ce responsable du recrutement mènerait : questions de compétences, relances sous pression, la discussion salaire. Puis nous vous disons clairement ce qui a marché et quoi dire à la place.",
    cta: "Réserver un entretien blanc", sample: "Voir un exemple de rapport",
    steps: [
      { n: "01", title: "Brief, 24 h avant", body: "L'offre, votre CV, l'entreprise." },
      { n: "02", title: "50 minutes, en visio, sans pause", body: "Comme en vrai." },
      { n: "03", title: "Retour immédiat, dans la séance", body: "Ce qui a marché, ce qui n'a pas marché, et quoi dire à la place. Puis le rapport écrit sous 48 h." },
      { n: "04", title: "Suivi pour toutes vos questions", body: "Écrivez-nous autant que nécessaire après lecture." },
    ],
  },
  human: {
    label: "Pourquoi un humain",
    h2: "Utilisez l'IA.", h2em: "Puis parlez à quelqu'un qui a déjà recruté.",
    intro: "L'IA est douée pour les premiers jets. Nous l'utilisons aussi. Elle ne s'est juste jamais assise à la place du recruteur.",
    aiTitle: "L'IA",
    usTitle: "Un recruteur",
    matrix: [
      { row: "Rédiger un CV en quelques secondes", ai: true, us: true },
      { row: "Rendre un paragraphe fluide", ai: true, us: true },
      { row: "Proposer une réponse à n'importe quelle question", ai: true, us: true },
      { row: "Vous dire pourquoi vous avez été écarté", ai: false, us: true },
      { row: "Connaître la ligne sur laquelle un recruteur s'arrête", ai: false, us: true },
      { row: "Entendre qu'une réponse juste n'a pas convaincu", ai: false, us: true },
      { row: "Poser la relance que personne ne vous pose", ai: false, us: true },
    ],
    verdict: "Le jugement humain, avec la technologie pour les tâches ingrates.",
    cta: "Réserver un entretien blanc",
  },
  video: {
    label: "40 secondes",
    h2: "Voyez comment ça marche",
    body: "Pourquoi s'entraîner seul ne suffit plus, et ce qu'est vraiment une session.",
    play: "Lecture", caption: "40 secondes", close: "Fermer",
    captions: "Sous-titres en français", captionsNote: "Sous-titré. Avec le son, si vous pouvez.",
  },
  founder: {
    label: "Avec qui vous travaillez", h2: "Hamza Dhia Mrabet.", h2em: "Responsable RH, psychologue du travail.",
    role: "Responsable RH · Psychologue du travail et des organisations",
    bio: [
      "Je lis les candidatures, je pose les questions et je décide qui passe à l'étape suivante. Quatre ans de cela, plus de 800 entretiens, et une formation de psychologue du travail : je peux vous dire non seulement qu'une réponse n'a pas pris, mais pourquoi.",
      "Presque personne n'apprend jamais pourquoi il a été écarté. C'est ce qu'une session vous donne.",
    ],
    abroadTitle: "Vous postulez à l'étranger, ou ailleurs dans la région ?",
    abroadBody: "Je recrute dans la région MENA, et en Allemagne, en Espagne et en France. Ces marchés ne lisent pas un CV de la même façon. Votre dossier est construit pour le marché visé, pas traduit vers lui.",
    credentials: [
      { title: "Master en psychologie du travail et gestion des RH", org: "Université de Tunis" },
      { title: "MBA, spécialisation intelligence artificielle", org: "South Mediterranean University (MSB)" },
    ],
    stats: [
      ["4 ans", "d'expérience en recrutement"],
      ["800+", "entretiens menés"],
      ["International", "Tunisie · MENA · Allemagne · Espagne · France"],
    ],
    quote: "Nous ne pouvons pas vous promettre le poste. Nous pouvons faire en sorte que votre CV et votre entretien ne vous le fassent pas perdre.",
    cta: "Réserver avec Hamza", linkedin: "Profil complet sur LinkedIn",
  },
  reviews: {
    h2: "Ce que disent les candidats",
    sub: "Écrits par des personnes qui ont réservé, publiés tels quels.",
    readAll: "Lire tous les avis", leave: "Laisser un avis",
  },
  faq: {
    label: "FAQ", h2: "Les questions", h2em: "qu'on nous pose.",
    sub: "Pour le reste, écrivez-nous. Nous répondons sous 24 heures.",
    items: [
      { q: "20 dt, c'est peu. Le travail est sérieux ?", a: "Le prix est un choix : nous voulons qu'un accompagnement RH sérieux reste accessible aux candidats d'ici, le temps de construire nos références en Tunisie. Le travail est fait par quelqu'un qui lit des CV côté recrutement, tous les jours. Jugez sur la première version, et les corrections sont incluses." },
      { q: "Comment se passe le paiement ?", a: "On réserve d'abord, on paie ensuite. Votre page de suivi affiche le RIB et votre référence : virement ou D17, et nous confirmons le jour même. Votre créneau est tenu 48 heures." },
      { q: "La session peut-elle se faire en arabe ?", a: "Oui. Les sessions et les rapports écrits existent en français, en anglais et en arabe. Vous choisissez à la réservation." },
      { q: "Je postule à l'étranger. Ça aide ?", a: "C'est là que ça aide le plus. Nous recrutons dans la région MENA, en Allemagne, en Espagne et en France, et aucun de ces marchés ne lit un CV de la même façon. Votre dossier est construit pour le marché visé, pas traduit vers lui." },
      { q: "Que deviennent mes documents ?", a: "Ils restent avec le recruteur qui traite votre dossier et sont supprimés sur demande. Les enregistrements ne vont qu'à vous. La page confidentialité a les détails." },
    ],
  },
  footer: {
    h2: "La bonne opportunité mérite la bonne préparation.",
    sub: "Choisissez une formule, remplissez le formulaire, et un recruteur vous répond le jour même. À partir de 20 dt, et gratuit si vous cherchez un PFE.",
    cta1: "Choisir une formule", cta2: "Réserver un entretien blanc",
    tagline: "Tunis, Tunisie · Services RH pour candidats",
    privacy: "Confidentialité", terms: "CGV & remboursements", track: "Suivre ma commande", reviews: "Avis", admin: "Admin",
  },
  sticky: { price: "Dès 20 dt", note: "Gratuit pour les étudiants en PFE", book: "Réserver" },
  common: {
    tagline: "Services RH", book: "Réserver ma session", bookAria: "Réserver une session", whatsappAria: "Poser une question sur WhatsApp",
    backToSite: "Retour au site", free: "gratuit", sending: "Envoi…", checkForm: "Merci de vérifier le formulaire.",
    notFoundTitle: "Cette page n'existe pas.", notFoundBody: "Le lien est peut-être ancien, ou mal recopié. Tout ce qu'il vous faut est à un clic.", notFoundCta: "Retour à l'accueil",
  },
  book: {
    metaTitle: "Réserver ma session", metaDesc: "Choisissez une formule, un créneau, et dites-nous qui vous êtes. Vous payez une fois le créneau confirmé.",
    eyebrow: "Réservation", h1: "Réserver ma session",
    lead: "Choisissez une formule, un créneau si elle comprend l'entretien, et dites-nous qui vous êtes. Vous recevez un code de référence pour suivre votre dossier.",
    dbError: "Le calendrier de réservation est indisponible pour le moment. Écrivez-nous et nous vous réservons un créneau à la main.",
    step1: "1. Votre formule", step2: "2. Vos 50 minutes", step3: "Vos coordonnées", freeStudent: "gratuit, offre étudiante",
    studentCheck: "Je suis étudiant(e) à la recherche d'un PFE",
    studentSub: "Tout est gratuit pendant l'offre. Téléversez votre carte d'étudiant et nous confirmons votre dossier le jour même.",
    cardLabel: "Carte d'étudiant", cardUploaded: "· téléversée", cardHint: "(photo ou PDF, 6 Mo max)",
    replace: "Remplacer", uploading: "Téléversement…",
    tooBig: "Ce fichier dépasse 6 Mo. Merci de téléverser une photo plus légère.",
    uploadFailed: `Le téléversement a échoué. Réessayez, ou envoyez votre carte à ${BRAND.email} et nous nous en occupons.`,
    cardNote: "Elle sert uniquement à confirmer que vous êtes étudiant, et elle est supprimée sur demande.",
    sessionLead: "Les sessions durent 50 minutes sans pause. Report possible jusqu'à 12 heures avant.",
    sessionLang: "Langue de la session", date: "Date",
    noSlots: "Aucun créneau n'est ouvert pour le moment. Laissez-nous un mot ci-dessous et nous en ouvrons un pour vous.",
    time: "Heure",
    fullName: "Nom complet", email: "E-mail", emailPh: "vous@email.com", phone: "Téléphone (facultatif)",
    targetRole: "Poste visé", targetRolePh: "Chef de produit marketing",
    cvLink: "Lien vers votre CV (Drive / Dropbox)", cvPh: "https://drive.google.com/...",
    linkedin: "Profil LinkedIn", linkedinPh: "https://linkedin.com/in/...",
    jobPosting: "Offre d'emploi (lien)", jobPostingPh: "Collez l'offre que vous préparez",
    notes: "Ce que nous devrions savoir", notesPh: "Reconversion, secteur visé, échéances…",
    pickDateTime: "Choisissez une date et une heure pour continuer.",
    requestSession: "Demander cette session", sendRequest: "Envoyer ma demande",
    noteStudent: "Rien à payer. Nous vérifions votre carte d'étudiant et confirmons votre dossier le jour même.",
    noteNormal: "Aucun paiement en ligne. Nous confirmons votre créneau par e-mail avec les instructions de paiement.",
    errors: {
      name: "Merci d'indiquer votre nom complet.", email: "Cette adresse e-mail ne semble pas valide.",
      card: "Merci de téléverser une photo de votre carte d'étudiant pour que nous puissions confirmer l'offre gratuite.",
      slot: "Merci de choisir une date et une heure pour votre session.",
      taken: "Ce créneau vient d'être pris. Merci d'en choisir un autre.",
      save: "Une erreur est survenue lors de l'enregistrement de votre demande. Merci de réessayer.",
    },
  },
  status: {
    metaTitle: "Suivre ma commande", eyebrow: "Votre dossier", h1: "Suivre ma commande",
    lead: "Votre code de référence et l'e-mail utilisé pour réserver.",
    refLabel: "Code de référence", emailLabel: "E-mail utilisé pour réserver",
    bad: "Ce code et cet e-mail ne correspondent à aucune commande. Vérifiez les deux, ou écrivez à",
    slow: "Trop de tentatives. Patientez quelques minutes et réessayez.",
    open: "Ouvrir mon dossier", keep: "Votre dossier reste ouvert dans ce navigateur pendant 30 jours : vous pouvez mettre la page en favori.",
    fileEyebrow: "Référence", where: "Où en est-on", file: "Dossier", payment: "Paiement", session: "Session", state: "Statut",
    join: "Rejoindre la session", payTitle: "Régler cette commande",
    payNote1: "Indiquez votre référence", payNote2: "dans le libellé du virement, puis envoyez le reçu à",
    studentTitle: "Offre étudiante",
    studentBody: "Votre carte d'étudiant est bien reçue et ce dossier est gratuit. Rien à payer, aucune carte bancaire. Si quelque chose n'est pas lisible sur la carte, nous vous écrirons à",
    reportSoon: "Votre rapport de feedback est en cours de rédaction. Il apparaîtra ici sous 48 heures après la session.",
    howTitle: "Comment ça s'est passé ?", howBody: "Si ça vous a aidé, deux phrases de votre part aident le prochain candidat à se décider.",
    leaveReview: "Laisser un avis", bookmark: "Mettez cette page en favori : c'est l'état en direct de votre dossier.",
    payFree: "Gratuit, offre étudiante. Rien à payer.", payReceived: "Reçu", payRefunded: "Remboursé", payPending: "En attente",
    orderStatus: {
      NEW: "Reçu. Nous examinons votre dossier.",
      IN_PROGRESS: "En cours. Un recruteur y travaille.",
      DELIVERED: "Livré. Regardez votre boîte mail.",
      CANCELLED: "Annulé.",
    },
    bookingStatus: {
      PENDING: "Demandée. Confirmée dès réception du paiement.",
      CONFIRMED: "Confirmée. Le lien est dans votre e-mail.",
      COMPLETED: "Terminée. Votre rapport de feedback est ci-dessous.",
      CANCELLED: "Annulée.",
    },
    bank: { amount: "Montant", reference: "Référence à indiquer" },
  },
  reviewsPage: {
    metaTitle: "Avis", metaDesc: "Ce que disent les candidats après une réécriture de CV, de LinkedIn ou un entretien blanc avec Recrutini. Publiés tels quels, bons ou mauvais.",
    eyebrow: "Avis", h1: "Comment ça s'est passé ?",
    lead: "Si nous avons travaillé sur votre CV, votre LinkedIn ou un entretien, dites aux autres candidats comment ça s'est vraiment passé. En bien ou en mal.",
    average: (avg, n) => `${avg} / 5 sur ${n} avis publié${n === 1 ? "" : "s"}.`,
    listTitle: "Ce que les candidats ont dit", verified: "Client vérifié", outOf: "sur 5",
    form: {
      rating: "Votre note", ratingAria: "Note sur cinq", tapStar: "Touchez une étoile",
      name: "Votre nom", role: "Poste visé (facultatif)", rolePh: "Ingénieur logiciel, PFE",
      body: "Votre avis", bodyPh: "Qu'avez-vous réservé, qu'est-ce qui a changé, et le conseilleriez-vous à un ami ?",
      ref: "Code de référence (facultatif)", refHint: "Il figure dans votre confirmation. S'il correspond, votre avis est marqué « client vérifié ».",
      send: "Envoyer mon avis", moderated: "Les avis sont relus avant publication.",
      thanksTitle: "Merci. Ça compte beaucoup.",
      thanksBody: "Votre avis a bien été envoyé. Nous lisons chacun d'eux à la main avant publication : comptez environ une journée avant qu'il apparaisse.",
      errors: {
        name: "Merci d'indiquer votre nom.", rating: "Merci de choisir une note.",
        body: "Merci d'écrire quelques phrases, pour que ce soit utile aux autres candidats.",
        save: "Une erreur est survenue lors de l'enregistrement de votre avis. Merci de réessayer.",
      },
    },
  },
  sample: {
    metaTitle: "À quoi ressemble le rapport de feedback",
    metaDesc: "Un exemple complet du rapport écrit que vous recevez après un entretien blanc : cinq compétences notées, les moments qui vous ont coûté le poste, et quoi dire à la place.",
    eyebrow: "Exemple · pas un vrai client", h1: "Ce que vous recevez vraiment",
    lead: "Chaque entretien blanc se termine par un rapport écrit comme celui-ci, sous 48 heures. C'est un exemple rédigé pour que vous mesuriez la profondeur avant de payer. Le candidat est inventé ; le format, la notation et le niveau de détail sont exactement ce que nous envoyons.",
    label: "Rapport de feedback · exemple",
    competencies: "Les cinq compétences", moments: "Trois moments qui vous ont coûté le poste",
    said: "Vous avez dit", instead: "Dites plutôt", actions: "Quatre choses à faire avant le vrai",
    yoursTitle: "Le vôtre arrive sous 48 heures après la session",
    yoursBody: (i, f) => `Construit sur le poste auquel vous postulez vraiment, avec l'enregistrement qui va avec. ${i} dt pour l'entretien blanc, ou ${f} dt pour le Pack complet qui en contient trois.`,
    cta: "Réserver un entretien blanc", seeAll: "Voir toutes les formules",
    disclaimer: "Cet exemple a été rédigé par nos soins pour montrer le format. Ce n'est pas un vrai candidat, et aucun rapport, CV ou enregistrement de client n'est jamais publié.",
  },
  report: {
    label: "Rapport de feedback", sessionOf: "Session du", interviewer: "Recruteur", outOf: "sur 5",
    landed: "Ce qui a bien fonctionné", toFix: "À corriger avant le vrai entretien", rewritten: "Réponse réécrite",
    download: "Télécharger le rapport (PDF)", recording: "Voir l'enregistrement", followUp: "Suivi inclus pour toutes vos questions",
  },
};

export const DICT: Record<Locale, Copy> = { en, fr };

export function t(locale: Locale): Copy {
  return DICT[locale] ?? DICT[DEFAULT_LOCALE];
}

export function isLocale(x: unknown): x is Locale {
  return typeof x === "string" && (LOCALES as readonly string[]).includes(x);
}

/** The cookie that remembers a visitor's language across visits. Read by the proxy. */
export const LOCALE_COOKIE = "recrutini_lang";

/** Which locale a pathname is in, and the same path in the other locale. */
export function localeOfPath(pathname: string): Locale {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}
export function stripLocale(pathname: string) {
  if (pathname === "/fr") return "/";
  return pathname.startsWith("/fr/") ? pathname.slice(3) : pathname;
}

/** Pack title in the page's language, for file pages and emails. */
export function packTitle(key: string, locale: Locale) {
  return t(locale).packs.list.find((p) => p.key === key)?.title ?? key;
}

/** Bank fields, labelled per locale, for the payment panel. */
export const BANK_LABELS: Record<Locale, [string, string][]> = {
  en: [
    ["Account holder", BANK.holder], ["Bank", BANK.bank], ["Branch", BANK.branch],
    ["RIB", BANK.rib], ["IBAN", BANK.iban], ["SWIFT / BIC", BANK.swift],
  ],
  fr: [
    ["Titulaire du compte", BANK.holder], ["Banque", BANK.bank], ["Agence", BANK.branch],
    ["RIB", BANK.rib], ["IBAN", BANK.iban], ["SWIFT / BIC", BANK.swift],
  ],
};
