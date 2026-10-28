// Tout le texte de la page d'accueil. Les composants ne contiennent aucun texte en dur.

// TODO Jaurès : numéro WhatsApp au format international, sans « + » ni espaces (ex. 2250700000000).
export const WHATSAPP_NUMBER = '225XXXXXXXXXX';
const WHATSAPP_MESSAGE = "Bonjour Jaurès, je souhaite discuter d'un projet";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const EMAIL = 'yaojauresvianney@gmail.com';

export type CaseStudy = {
  num: string;
  name: string;
  subtitle: string;
  tags: string[];
  problem: string;
  solution: string;
  result: string;
  metric: string;
};

export const site = {
  name: 'Jaurès',
  meta: {
    title: 'Jaurès · Développeur fullstack & chef de projet IT · Abidjan',
    description:
      "Je suis Jaurès. J'accompagne entreprises, institutions et startups de l'idée à la mise en ligne : plateformes d'inscription, outils RH, applications métier — ici en Côte d'Ivoire comme pour la diaspora.",
  },

  nav: {
    skip: 'Aller au contenu',
    label: 'Navigation principale',
    links: [
      { href: '#cas', label: 'Études de cas' },
      { href: '#services', label: 'Services' },
      { href: '#stack', label: 'Stack' },
      { href: '#methode', label: 'Méthode' },
      { href: '#contact', label: 'Contact' },
    ],
    cta: 'Parlons projet',
    theme: { generic: 'Changer de thème', toLight: 'Passer en mode clair', toDark: 'Passer en mode sombre' },
    menu: { open: 'Ouvrir le menu', close: 'Fermer le menu' },
  },

  hero: {
    eyebrow: {
      desktop: 'Développeur fullstack & chef de projet IT · Abidjan',
      mobile: 'Fullstack & chef de projet IT · Abidjan',
    },
    title: { lead: 'Votre projet web, cadré, construit et livré par ', accent: 'un seul interlocuteur.' },
    intro:
      "Je suis Jaurès. J'accompagne entreprises, institutions et startups de l'idée à la mise en ligne : plateformes d'inscription, outils RH, applications métier — ici en Côte d'Ivoire comme pour la diaspora.",
    ctaPrimary: 'Discuter de votre projet',
    ctaSecondary: 'Voir les études de cas',
    badges: ['Laravel · React · TypeScript', 'Basé à Abidjan', 'Missions à distance ou sur site'],
    // TODO Jaurès : remplacer par { src: '/jaures.jpg', alt: 'Portrait de Jaurès' } (fichier dans /public).
    photo: null as { src: string; alt: string } | null,
    photoPlaceholder: '[Votre photo]',
    card: { eyebrow: 'Double casquette', text: 'Le code et le pilotage, sans intermédiaire.' },
    scrollHint: 'Défiler',
  },

  cases: {
    eyebrow: 'Études de cas',
    title: 'Des problèmes concrets, des solutions sur mesure.',
    intro:
      "Quatre projets, quatre contextes : l'événementiel, le recrutement, l'emploi dans la diaspora et l'automatisation par l'IA.",
    hint: 'Continuez à défiler',
    labels: { problem: 'Problème', solution: 'Solution', result: 'Résultat' },
    items: [
      {
        num: '01',
        name: 'FODESE',
        subtitle: 'Plateforme événementielle multi-villes',
        tags: ['PHP', 'MySQL', 'QR codes', 'Mailgun'],
        problem:
          "Un forum organisé dans plusieurs villes devait gérer inscriptions, badges, accueil et suivi des participants sans perdre le fil d'une ville à l'autre.",
        solution:
          'Une plateforme multi-modules : inscriptions en ligne, badges QR automatiques, e-mails transactionnels, relance des absents, suivi des visites de stands et tableaux de bord statistiques.',
        result:
          "L'édition 2026 opérée à Yamoussoukro, Bouaké et San-Pédro sur une seule plateforme, avec un formulaire express pour le personnel le jour J.",
        // TODO Jaurès : nombre d'inscrits réel.
        metric: '3 villes · [N] inscrits',
      },
      {
        num: '02',
        name: 'Empower CV',
        subtitle: 'Parsing & matching sémantique de CV',
        tags: ['Laravel API', 'React', 'pgvector', 'Embeddings'],
        problem:
          'Comparer des dizaines de CV à chaque offre, à la main, prend du temps et reste subjectif — les bons profils passent entre les mailles.',
        solution:
          'Un service qui extrait les CV puis les compare aux offres par similarité sémantique (embeddings OpenAI, pgvector sur Supabase), exposé par une API REST Laravel et une interface React.',
        result:
          "Pour chaque offre, un classement des candidats par pertinence, consultable depuis une interface simple par l'équipe RH.",
        // TODO Jaurès : pourcentage réel de temps de tri gagné.
        metric: '[X] % de temps de tri gagné',
      },
      {
        num: '03',
        name: 'DiaspoJob',
        subtitle: "Plateforme d'emploi pour la diaspora africaine",
        tags: ['Laravel', 'Inertia', 'React', 'React Native'],
        problem:
          "Les talents de la diaspora et les recruteurs du continent se croisent mal sur des job boards généralistes, pensés pour d'autres marchés.",
        solution:
          "Une plateforme dédiée en Laravel, Inertia et React : design responsive, partage social, rotation d'annonces sponsorisées et SEO soigné, optimisée pour un hébergement mutualisé.",
        result:
          'Une plateforme web responsive, prolongée par une application mobile React Native préparée pour le Google Play Store.',
        metric: 'Web + mobile Android',
      },
      {
        num: '04',
        name: 'CV-Offre Matcher',
        subtitle: "Génération de prospects par l'IA",
        tags: ['Python', 'OCR', 'LLM', 'Excel'],
        problem:
          "Un cabinet de recrutement et de formation disposait d'environ 8 000 CV en PDF, sans moyen rapide d'y repérer des prospects pour ses programmes.",
        solution:
          'Un pipeline par lots : extraction de texte et OCR, pré-filtrage par mots-clés, classification par LLM (Claude Haiku) puis scoring de chaque profil.',
        result: "Des listes de prospects notées, livrées en Excel, directement exploitables par l'équipe commerciale.",
        metric: '≈ 8 000 CV analysés',
      },
    ] satisfies CaseStudy[],
  },

  services: {
    eyebrow: 'Services',
    title: 'Trois façons de faire avancer votre projet.',
    items: [
      {
        title: 'Développement web sur mesure',
        text: "Applications métier, plateformes d'inscription, espaces membres et back-offices. Du code maintenable, un déploiement maîtrisé — y compris sur hébergement mutualisé.",
        bullets: [
          'Applications Laravel · Inertia · React',
          'Back-offices & tableaux de bord',
          'Mise en ligne & maintenance',
        ],
      },
      {
        title: 'Pilotage de projet IT',
        text: "Je traduis vos besoins en cahier des charges clair, je modélise vos données et vos processus, puis je coordonne jusqu'à la livraison.",
        bullets: ['Cadrage & cahier des charges', 'Modélisation MERISE (MCD, MCT, MOT)', 'Suivi, recette & formation'],
      },
      {
        title: 'IA & automatisation des données',
        text: "Extraction de documents, matching sémantique, classification par LLM : j'intègre l'IA là où elle vous fait réellement gagner du temps.",
        bullets: ['Traitement de CV & PDF en masse', 'Matching par embeddings', 'Pipelines & exports Excel'],
      },
    ],
  },

  stack: {
    eyebrow: 'Stack technique',
    title: 'Des outils modernes, maîtrisés.',
    intro: "Un socle cohérent du back-end à l'interface, pour des applications rapides à faire évoluer.",
    // scramble : les deux faces de brouillage de l'afficheur à palettes, avant le nom.
    items: [
      { name: 'Laravel', desc: 'Back-end & API', scramble: ['X7#Q·R2', 'LA4AV3L'] },
      { name: 'React', desc: 'Interfaces', scramble: ['Q#9·Z', 'RE4CT'] },
      { name: 'TypeScript', desc: 'Code typé et fiable', scramble: ['#K2·X9QW7Z', 'TYP3SCR1PT'] },
      { name: 'Inertia', desc: 'Le pont Laravel ↔ React', scramble: ['Z9#·QK2', '1NERT1A'] },
      { name: 'MySQL', desc: 'Données structurées', scramble: ['#Q7·K', 'MY5QL'] },
      { name: 'Tailwind', desc: 'UI cohérente', scramble: ['Q#7·ZK9X', 'TA1LW1ND'] },
    ],
  },

  method: {
    eyebrow: 'Méthode de travail',
    title: 'Cinq étapes, zéro surprise.',
    steps: [
      {
        title: 'Écoute',
        text: 'Un premier échange pour comprendre vos objectifs, vos utilisateurs et vos contraintes.',
      },
      { title: 'Cadrage', text: 'Périmètre, modélisation des données, planning et devis détaillé, validés ensemble.' },
      { title: 'Maquettes', text: 'Parcours et écrans validés avec vous avant la moindre ligne de code.' },
      {
        title: 'Développement',
        text: "Des livraisons régulières que vous testez au fil de l'eau, avec un point d'avancement clair.",
      },
      {
        title: 'Mise en ligne & suivi',
        text: 'Déploiement, formation de vos équipes, puis maintenance et évolutions.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Parlons de votre projet.',
    text: 'Une idée, un cahier des charges ou simplement une question ? Écrivez-moi sur WhatsApp : on en discute, sans engagement.',
    cta: 'Écrire sur WhatsApp',
    info: [
      { label: 'Localisation', value: "Abidjan, Côte d'Ivoire" },
      { label: 'Fuseau', value: 'GMT (UTC+0)' },
      // TODO Jaurès : disponibilité réelle (ex. « Disponible à partir de janvier »).
      { label: 'Disponibilité', value: '[Votre disponibilité]' },
    ],
  },

  footer: {
    copyright: '© 2026 Jaurès — Développeur fullstack & chef de projet IT',
    madeIn: 'Conçu et codé à Abidjan',
  },
};
