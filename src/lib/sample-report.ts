/**
 * An EXAMPLE feedback report, written to show the format and the depth of the
 * thing a client actually receives. It is not a real client's report and the
 * page says so plainly in three places — a fabricated testimonial would be a
 * lie, but a worked example of your own deliverable is a product demo.
 */
export const SAMPLE = {
  role: "Backend Engineer (Java / Spring), Berlin",
  language: "English",
  duration: "50 minutes",
  overall: 62,
  verdict:
    "On this performance you would reach a second interview in Tunis and stop at the first in Berlin. The technical answers are sound. What loses it is that almost nothing you said had a number attached, and twice you explained what the team did rather than what you did.",
  scores: [
    {
      name: "Structure",
      pct: 78,
      note: "Answers had a beginning and an end. The middle drifted twice.",
    },
    {
      name: "Evidence",
      pct: 41,
      note: "Nine claims, one number. This is the single biggest thing to fix.",
      weak: true,
    },
    {
      name: "Ownership",
      pct: 55,
      note: '"We migrated the service": a German panel will ask what you personally did, and it will sound like a challenge.',
    },
    {
      name: "Technical depth",
      pct: 84,
      note: "Comfortable and specific. No concerns here.",
    },
    {
      name: "Presence",
      pct: 63,
      note: "Warm, a little fast when unsure. You filled three silences that were not yours to fill.",
    },
  ],
  moments: [
    {
      q: "Tell me about a system you improved.",
      said: "We had performance problems on the orders service, so we refactored it and it got much better.",
      why: "Three vague words carrying the whole answer: problems, refactored, better. The interviewer learns nothing they can write down, and a scorecard needs something to write down.",
      instead:
        "The orders service was timing out at about 300 requests a second. I traced it to an N+1 query in the checkout path, added a join and a cache, and we held 1,200 a second with p95 latency down from 800ms to 110ms. I did the tracing and the fix; my colleague reviewed it.",
    },
    {
      q: "Why are you leaving your current role?",
      said: "The management changed and things became complicated, so I started looking.",
      why: 'Neutral in Tunis, a small red flag in Berlin: "complicated" invites the interviewer to imagine the worst, and they will. Never leave a gap someone else fills in.',
      instead:
        "I have built the same kind of service for three years and I want a codebase at a scale I have not worked at yet. Your platform team is the reason I applied rather than anywhere else.",
    },
    {
      q: "What are your salary expectations?",
      said: "I am flexible, whatever is standard for the role.",
      why: "Flexible reads as unprepared, and in Germany the first number frames everything that follows. You gave the frame away for free.",
      instead:
        "Based on what I have seen for this level in Berlin I am looking at 65 to 75 thousand, depending on the rest of the package. Where does this role sit?",
    },
  ],
  actions: [
    "Rewrite your three strongest stories with a number in each. Before, after, and what you personally did. That one exercise moves Evidence from 41 to the 70s.",
    'Strike "we" from every story where the work was yours. Practise saying "I" out loud. It will feel arrogant the first four times and normal by the fifth.',
    "Decide your salary number before the real interview, and say it first.",
    "Sit with silence for three seconds before answering. You lost nothing to thinking and twice to filling.",
  ],
};

/** The same worked example, written for the French page rather than translated word for word. */
export const SAMPLE_FR: typeof SAMPLE = {
  role: "Ingénieur back-end (Java / Spring), Berlin",
  language: "Français",
  duration: "50 minutes",
  overall: 62,
  verdict:
    "Sur cette prestation, vous décrochez un second entretien à Tunis et vous vous arrêtez au premier à Berlin. Les réponses techniques tiennent. Ce qui coûte le poste : presque rien de ce que vous avez dit n'était chiffré, et deux fois vous avez raconté ce que l'équipe a fait plutôt que ce que vous avez fait.",
  scores: [
    {
      name: "Structure",
      pct: 78,
      note: "Les réponses avaient un début et une fin. Le milieu a dérivé deux fois.",
    },
    {
      name: "Preuves",
      pct: 41,
      note: "Neuf affirmations, un seul chiffre. C'est le point numéro un à corriger.",
      weak: true,
    },
    {
      name: "Responsabilité",
      pct: 55,
      note: "« Nous avons migré le service » : un jury allemand demandera ce que vous avez fait personnellement, et la question sonnera comme un reproche.",
    },
    {
      name: "Profondeur technique",
      pct: 84,
      note: "À l'aise et précis. Rien à signaler.",
    },
    {
      name: "Présence",
      pct: 63,
      note: "Chaleureux, un peu rapide dans le doute. Vous avez comblé trois silences qui n'étaient pas à vous.",
    },
  ],
  moments: [
    {
      q: "Parlez-moi d'un système que vous avez amélioré.",
      said: "On avait des problèmes de performance sur le service commandes, donc on l'a refactorisé et ça allait beaucoup mieux.",
      why: "Trois mots vagues portent toute la réponse : problèmes, refactorisé, mieux. Le recruteur n'apprend rien qu'il puisse noter, et une grille d'évaluation a besoin de quelque chose à noter.",
      instead:
        "Le service commandes tombait en timeout vers 300 requêtes par seconde. J'ai remonté la piste jusqu'à une requête N+1 dans le parcours de paiement, ajouté une jointure et un cache, et nous avons tenu 1 200 requêtes par seconde avec une latence p95 passée de 800 ms à 110 ms. J'ai fait le diagnostic et le correctif ; un collègue a relu.",
    },
    {
      q: "Pourquoi quittez-vous votre poste actuel ?",
      said: "La direction a changé et les choses sont devenues compliquées, alors j'ai commencé à regarder ailleurs.",
      why: "Neutre à Tunis, petit signal d'alarme à Berlin : « compliqué » invite le recruteur à imaginer le pire, et il le fera. Ne laissez jamais un blanc que quelqu'un d'autre remplira.",
      instead:
        "Je construis le même type de service depuis trois ans et je veux une base de code à une échelle que je n'ai pas encore connue. Votre équipe plateforme est la raison pour laquelle j'ai postulé chez vous plutôt qu'ailleurs.",
    },
    {
      q: "Quelles sont vos prétentions salariales ?",
      said: "Je suis flexible, ce qui est standard pour le poste.",
      why: "Flexible se lit comme impréparé, et en Allemagne le premier chiffre cadre tout ce qui suit. Vous avez cédé le cadre gratuitement.",
      instead:
        "D'après ce que je vois pour ce niveau à Berlin, je vise entre 65 et 75 mille, selon le reste du package. Où se situe ce poste ?",
    },
  ],
  actions: [
    "Réécrivez vos trois meilleures histoires avec un chiffre dans chacune. Avant, après, et ce que vous avez fait personnellement. Ce seul exercice fait passer « Preuves » de 41 à plus de 70.",
    "Supprimez « nous » de chaque histoire où le travail était le vôtre. Entraînez-vous à dire « je » à voix haute : ça paraîtra arrogant les quatre premières fois, normal à la cinquième.",
    "Fixez votre chiffre de salaire avant le vrai entretien, et dites-le en premier.",
    "Laissez trois secondes de silence avant de répondre. Réfléchir ne vous a rien coûté ; combler, deux fois.",
  ],
};
