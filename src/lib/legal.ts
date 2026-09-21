import { BRAND, FOUNDER } from "./brand";

/**
 * Plain-language policies. Two reasons they exist: a student uploading a photo
 * of their ID card is handing over personal data and deserves to know what
 * happens to it, and a buyer in a market with real scam fear needs to see that
 * someone named stands behind the service.
 */

export const LAST_UPDATED = "19 September 2026";

export const PRIVACY = [
  {
    h: "Who is behind this",
    p: [
      `${BRAND.name} is run by ${FOUNDER.name} from Tunis, Tunisia. You can reach a human at ${BRAND.email} and the same person answers.`,
    ],
  },
  {
    h: "What we collect, and why",
    p: [
      "When you book: your name, email, phone number, the role you are targeting, and anything you choose to send us: your CV, your LinkedIn address, the job posting. We need these to do the work you asked for. Nothing else is collected.",
      "If you claim the student offer: a photo of your student card. It is used once, by hand, to confirm you are a student, and for nothing else.",
      "Session recordings, when a session is recorded: shared with you, and kept only so you can rewatch them.",
    ],
  },
  {
    h: "What we never do",
    p: [
      "We never sell your data, and we never share it with employers, recruiters or anyone else. Your CV is not added to any database. Nobody is contacted about you.",
      "We never ask for card details. Payment is by bank transfer or D17, to the account shown on your own file page.",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "Student card photos are deleted once your file is confirmed, and always within 30 days.",
      "Your documents and session recordings are kept for 12 months so you can come back to them, then deleted.",
      "Your order record (name, email, reference, what you bought) is kept for accounting purposes.",
    ],
  },
  {
    h: "Deleting your data",
    p: [
      `Write to ${BRAND.email} and ask. We delete everything we can within 7 days and tell you when it is done. You do not have to give a reason.`,
    ],
  },
  {
    h: "Cookies",
    p: [
      "This site sets no advertising cookies and does not follow you to other sites. There is one technical cookie, which keeps your own file page open after you identify yourself. Nothing to accept, nothing to refuse.",
    ],
  },
  {
    h: "Where it is stored",
    p: [
      "Your file is stored on servers operated by Vercel and Neon, inside the European Union. Uploaded files are stored on Vercel Blob storage. We use Vercel Analytics, which counts page visits without cookies and without tracking you across other websites.",
    ],
  },
];

export const TERMS = [
  {
    h: "What you are buying",
    p: [
      "A service delivered by a person, not software. Depending on the pack: a rewrite of your CV and LinkedIn profile, a 50-minute interview simulation with a written report, coaching sessions, and follow-up.",
      "We help you present your experience accurately and prepare properly. We do not promise you a job, an interview, or a reply from any employer, and nobody honest can.",
    ],
  },
  {
    h: "Booking and payment",
    p: [
      "Booking costs nothing and commits you to nothing. Once we confirm your slot, your file page shows the bank details and your reference.",
      "Your slot is held for 48 hours while payment is pending. After that it goes back into the calendar and you are free to book another.",
      "Students on the free offer pay nothing at all.",
    ],
  },
  {
    h: "Changing or cancelling",
    p: [
      "Reschedule a session up to 12 hours before it starts, at no cost, as many times as you need.",
      "Cancel more than 12 hours before the session and you are refunded in full. Cancel later than that, or miss the session without telling us, and the session is used.",
      "If we cancel or reschedule on you, you choose: a new slot or a full refund.",
    ],
  },
  {
    h: "If the work is not right",
    p: [
      "Every rewrite includes two rounds of revisions. Tell us what does not sound like you and we redo it.",
      "If we have not delivered the first draft within the stated turnaround and the delay is ours, write to us and you are refunded in full.",
    ],
  },
  {
    h: "What we ask of you",
    p: [
      "Send us accurate information. We will not write a CV that claims experience or qualifications you do not have, and we will say so if asked.",
      "Turn up to your session on time and ready. A 50-minute simulation does not work in 20 minutes.",
    ],
  },
  {
    h: "Recordings and confidentiality",
    p: [
      "Session recordings are shared with you and with nobody else. We never publish a recording, a CV, or a name without written permission.",
      "Reviews on this site are written by clients themselves. We publish them as they come, and we do not write them ourselves.",
    ],
  },
  {
    h: "Making a complaint",
    p: [
      `Write to ${BRAND.email} with your reference. We reply within 48 hours and look for a fix before anything else.`,
    ],
  },
  {
    h: "Law",
    p: [
      "These terms are governed by Tunisian law. If something goes wrong, write to us first. It is usually a misunderstanding and we would rather fix it than argue about it.",
    ],
  },
];

export const PRIVACY_FR = [
  {
    h: "Qui est derrière tout ça",
    p: [
      `${BRAND.name} est dirigé par ${FOUNDER.name}, depuis Tunis. Vous pouvez écrire à une vraie personne à ${BRAND.email}, et c'est la même qui répond.`,
    ],
  },
  {
    h: "Ce que nous collectons, et pourquoi",
    p: [
      "À la réservation : votre nom, votre e-mail, votre téléphone, le poste que vous visez, et ce que vous choisissez de nous envoyer : CV, adresse LinkedIn, offre d'emploi. Nous en avons besoin pour faire le travail que vous demandez. Rien d'autre n'est collecté.",
      "Si vous profitez de l'offre étudiante : une photo de votre carte d'étudiant. Elle sert une seule fois, vérifiée à la main, à confirmer que vous êtes étudiant. À rien d'autre.",
      "Les enregistrements de session, lorsqu'il y en a : partagés avec vous, et conservés uniquement pour que vous puissiez les revoir.",
    ],
  },
  {
    h: "Ce que nous ne faisons jamais",
    p: [
      "Nous ne vendons jamais vos données et nous ne les partageons avec aucun employeur, cabinet ou tiers. Votre CV n'entre dans aucune base de données. Personne n'est contacté à votre sujet.",
      "Nous ne demandons jamais de coordonnées bancaires de carte. Le paiement se fait par virement ou D17, vers le compte affiché sur votre propre page de suivi.",
    ],
  },
  {
    h: "Combien de temps nous les gardons",
    p: [
      "Les photos de carte d'étudiant sont supprimées dès votre dossier confirmé, et au plus tard sous 30 jours.",
      "Vos documents et enregistrements sont conservés 12 mois pour que vous puissiez y revenir, puis supprimés.",
      "Le dossier de commande (nom, e-mail, référence, prestation) est conservé pour des raisons comptables.",
    ],
  },
  {
    h: "Faire supprimer vos données",
    p: [
      `Écrivez à ${BRAND.email} et demandez-le. Nous supprimons tout ce que nous pouvons sous 7 jours et nous vous confirmons quand c'est fait. Vous n'avez pas à vous justifier.`,
    ],
  },
  {
    h: "Où elles sont stockées",
    p: [
      "Votre dossier est hébergé sur des serveurs Vercel et Neon situés dans l'Union européenne. Les fichiers téléversés sont stockés sur Vercel Blob. Nous utilisons Vercel Analytics, qui compte les visites sans cookie et sans vous suivre sur d'autres sites.",
    ],
  },
  {
    h: "Cookies",
    p: [
      "Ce site ne dépose aucun cookie publicitaire et ne vous suit sur aucun autre site. Nous utilisons un seul cookie technique, qui garde ouverte votre page de suivi après que vous vous êtes identifié. Rien à accepter, rien à refuser.",
    ],
  },
];

export const TERMS_FR = [
  {
    h: "Ce que vous achetez",
    p: [
      "Une prestation réalisée par une personne, pas par un logiciel. Selon la formule : la réécriture de votre CV et de votre profil LinkedIn, un entretien blanc de 50 minutes avec rapport écrit, des séances de coaching, et un suivi.",
      "Nous vous aidons à présenter votre parcours avec justesse et à vous préparer sérieusement. Nous ne promettons ni emploi, ni entretien, ni réponse d'un employeur, et personne d'honnête ne le peut.",
    ],
  },
  {
    h: "Réservation et paiement",
    p: [
      "Réserver ne coûte rien et ne vous engage à rien. Une fois votre créneau confirmé, votre page de suivi affiche le RIB et votre référence.",
      "Votre créneau est tenu 48 heures en attendant le paiement. Passé ce délai il retourne au calendrier et vous êtes libre d'en reprendre un autre.",
      "Les étudiants bénéficiant de l'offre gratuite ne paient rien.",
    ],
  },
  {
    h: "Modifier ou annuler",
    p: [
      "Reportez une session jusqu'à 12 heures avant, sans frais, autant de fois que nécessaire.",
      "Annulez plus de 12 heures avant et vous êtes remboursé intégralement. Au-delà, ou en cas d'absence sans prévenir, la session est décomptée.",
      "Si c'est nous qui annulons ou reportons, vous choisissez : un nouveau créneau ou un remboursement intégral.",
    ],
  },
  {
    h: "Si le travail ne convient pas",
    p: [
      "Chaque réécriture inclut deux séries de corrections. Dites-nous ce qui ne vous ressemble pas et nous le refaisons.",
      "Si la première version n'est pas livrée dans le délai annoncé et que le retard nous incombe, écrivez-nous : vous êtes remboursé intégralement.",
    ],
  },
  {
    h: "Ce que nous attendons de vous",
    p: [
      "Des informations exactes. Nous n'écrirons pas un CV qui revendique une expérience ou un diplôme que vous n'avez pas, et nous vous le dirons si la question se pose.",
      "Votre présence à l'heure et préparé. Un entretien blanc de 50 minutes ne tient pas en 20.",
    ],
  },
  {
    h: "Enregistrements et confidentialité",
    p: [
      "Les enregistrements sont partagés avec vous et avec personne d'autre. Nous ne publions jamais un enregistrement, un CV ou un nom sans autorisation écrite.",
      "Les avis publiés sur ce site sont écrits par les clients eux-mêmes. Nous les publions tels quels et nous n'en rédigeons aucun.",
    ],
  },
  {
    h: "Une réclamation",
    p: [
      `Écrivez d'abord à ${BRAND.email} en indiquant votre référence. Nous répondons sous 48 heures et nous cherchons une solution avant toute autre démarche.`,
    ],
  },
  {
    h: "Droit applicable",
    p: [
      "Ces conditions relèvent du droit tunisien. En cas de problème, écrivez-nous d'abord : c'est presque toujours un malentendu, et nous préférons le corriger que le plaider.",
    ],
  },
];
