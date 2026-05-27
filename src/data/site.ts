/**
 * data/site.ts — Source unique de vérité (NAP, navigation, libellés).
 *
 * Rôle : centraliser toutes les informations qui apparaissent à plus
 * d'un endroit du site. Le téléphone, l'adresse, les horaires, les
 * libellés de navigation, etc., ne doivent JAMAIS être écrits en dur
 * dans un composant ou une page — il faut TOUJOURS les importer d'ici.
 *
 * Utilisé par : Header, Footer, StickyCallBar, Seo, BaseLayout,
 *               et toute section qui affiche un NAP ou un CTA.
 *
 * PHASE 1 :
 *   - téléphone : VRAI (seul vrai chiffre du site).
 *   - adresse / e-mail / nom du gérant : placeholders explicites.
 *   - libellés et libellés de nav : provisoires mais cohérents.
 */

/* =========================================================================
 * Métadonnées générales du site
 * ========================================================================= */
export const site = {
  name: 'Ypp Plomberie',
  legalName: 'Ypp Plomberie',
  shortName: 'Ypp Plomberie',
  /** Domaine de production (à ajuster en phase 4 si besoin). */
  url: 'https://www.ypp-plomberie.fr',
  /** Locale ISO. */
  locale: 'fr-FR',
  /** Description par défaut (fallback meta description). */
  description:
    'Ypp Plomberie : plombier à Nice, dépannage 24h/24 et 7j/7. Recherche de fuite, débouchage, chauffe-eau, rénovation de salle de bain.',
  /** Note Google moyenne — à mettre à jour selon évolution. */
  rating: {
    value: 5.0,
    count: 13,
    /** Source à brancher en phase 4 (lien Google Business Profile). */
    source: '[URL_GOOGLE_BUSINESS]',
  },
} as const;

/* =========================================================================
 * NAP — Name / Address / Phone
 *
 * Le SEUL vrai chiffre est le téléphone. Le reste est en placeholder
 * et sera complété en phase 3 (contenus) ou phase 4 (audit final).
 * ========================================================================= */
export const nap = {
  /** Nom commercial complet (utilisé dans le JSON-LD LocalBusiness). */
  legalName: 'Ypp Plomberie',
  /** Nom du gérant — affiché sur /a-propos/ et /mentions-legales/. */
  ownerName: '[NOM_GERANT]',
  /** Téléphone — VRAI. Format affiché ; le format `tel:` est dérivé. */
  phoneDisplay: '06 03 34 03 05',
  phoneE164: '+33603340305',
  /** Adresse postale du siège ou de l'atelier. */
  address: {
    street: '[ADRESSE]',
    postalCode: '[CODE_POSTAL]',
    city: 'Nice',
    region: 'Alpes-Maritimes',
    country: 'France',
    countryCode: 'FR',
  },
  email: '[EMAIL]',
  /** Année de création de l'activité (affichée à-propos). */
  yearCreated: '[ANNEE_CREATION]',
  /** Nombre d'années d'expérience (affiché à-propos). */
  yearsExperience: '[NB_ANNEES_EXPERIENCE]',
  /** Fourchette tarifaire JSON-LD (échelle €€ pour artisanat moyen). */
  priceRange: '€€',
  /** Horaires : urgences 24h/24, 7j/7. */
  hours: {
    label: '24h/24 — 7j/7',
    /** Représentation lisible. */
    human: 'Ouvert 24 heures sur 24, 7 jours sur 7 pour les urgences.',
    /** Représentation OpeningHoursSpecification (JSON-LD), 24h/24. */
    schema: [
      {
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
  },
  /** SIRET / SIREN / TVA / RCS / Assurance décennale. */
  identifiers: {
    siret: '[N_SIRET]',
    siren: '[N_SIREN]',
    vat: '[N_TVA_INTRACOM]',
    rcs: '[N_RCS_OU_RM]',
    decennale: '[ASSURANCE_DECENNALE]',
  },
  /** Réseaux sociaux et fiche Google. */
  socials: {
    googleBusiness: '[URL_GOOGLE_BUSINESS]',
    facebook: null as string | null,
    instagram: null as string | null,
  },
} as const;

/* =========================================================================
 * Navigation principale
 * ========================================================================= */
import { url } from '@/utils/url';

export type NavItem = {
  label: string;
  href: string;
  /** Sous-éléments éventuels (déroulant ou liste verticale). */
  children?: readonly NavItem[];
};

export const primaryNav: readonly NavItem[] = [
  { label: 'Accueil', href: url('/') },
  {
    label: 'Services',
    href: url('/services/'),
    children: [
      { label: 'Dépannage 24h/24',       href: url('/services/depannage-urgence/') },
      { label: 'Recherche de fuite',     href: url('/services/recherche-de-fuite/') },
      { label: 'Débouchage',             href: url('/services/debouchage-canalisation/') },
      { label: 'Chaudière & chauffage',  href: url('/services/chauffe-eau/') },
      { label: 'Salle de bain',          href: url('/services/renovation-salle-de-bain/') },
      { label: 'Installation sanitaire', href: url('/services/installation-sanitaire/') },
    ],
  },
  { label: 'Zone',         href: url('/zone-intervention/') },
  { label: 'Réalisations', href: url('/realisations/') },
  { label: 'À propos',     href: url('/a-propos/') },
  { label: 'Contact',      href: url('/contact/') },
];

export const footerLegalNav: readonly NavItem[] = [
  { label: 'Mentions légales',             href: url('/mentions-legales/') },
  { label: 'Politique de confidentialité', href: url('/politique-de-confidentialite/') },
];

/* =========================================================================
 * Libellés réutilisés (UI commune)
 * ========================================================================= */
export const labels = {
  callNow: 'Appeler maintenant',
  callShort: 'Appeler',
  requestQuote: 'Demander un devis',
  emergency: 'Urgence 24h/24',
  open247: '24h/24 · 7j/7',
  skipToContent: 'Aller au contenu principal',
} as const;

/* =========================================================================
 * Liste des services et zones — RAPPEL : la source de vérité de leur
 * contenu reste `src/content/`. Ces tableaux servent uniquement aux
 * composants qui doivent ENUMÉRER les routes sans utiliser
 * `getCollection()` (ex. liens de footer).
 *
 * Si l'on ajoute un service ou une zone, on ne touche PAS à ce fichier :
 * il suffit de créer le `.md` correspondant ; les composants qui
 * utilisent `getCollection()` (la majorité) les détecteront tout seuls.
 * ========================================================================= */
