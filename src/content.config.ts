/**
 * src/content.config.ts — Schémas des Content Collections.
 *
 * Rôle : déclarer, via Zod, la forme attendue des entrées de contenu.
 * Une entrée invalide casse le build en NOMMANT le fichier fautif —
 * c'est l'application du principe « échec bruyant » de l'architecture.
 *
 * Utilisé par : src/pages/services/[slug].astro,
 *               src/pages/zones/[slug].astro,
 *               src/pages/services/index.astro,
 *               src/pages/zone-intervention/index.astro,
 *               et tout composant qui lit `getCollection()`.
 *
 * Pour ajouter un service ou une zone : créer un fichier `.md` dans
 * `src/content/services/` ou `src/content/zones/` ; aucun autre code
 * à toucher (les pages sont générées en `getStaticPaths`).
 *
 * Phase 3 — schéma `services` enrichi :
 *   - `accroche` (résumé éditorial, 2-3 phrases ; affiché en hero) ;
 *   - `faqItems` (3-5 Q/R propres au service ; alimentent FaqSection
 *     ET le JSON-LD `FAQPage`).
 *   Le corps Markdown reste le long-form éditorial (450-650 mots).
 */

import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const faqItemSchema = z.object({
  question: z.string().min(8),
  answer: z.string().min(20),
});

/* =========================================================================
 * Collection : services
 * URL : /services/<slug>/
 * ========================================================================= */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string().min(2),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'slug doit être en kebab-case'),
    order: z.number().int().nonnegative(),
    h1: z.string().min(5),
    metaTitle: z.string().min(10).max(70),
    metaDescription: z.string().min(50).max(170),
    shortDescription: z.string().min(20).max(200),
    /**
     * Identifiant d'icône (ex. "wrench", "droplet"). Le composant
     * ServiceCard mappe cet identifiant vers un SVG inline.
     */
    icon: z.string().min(1),
    /**
     * Accroche éditoriale — 2-3 phrases qui ouvrent la page service
     * (rendue en intro, juste après le hero). Optionnel : si absente,
     * c'est `shortDescription` qui sert de fallback.
     */
    accroche: z.string().min(40).max(420).optional(),
    /**
     * FAQ spécifique au service (3-5 items). Alimente la section FAQ
     * de la page ET le JSON-LD `FAQPage`.
     */
    faqItems: z.array(faqItemSchema).min(3).max(6).optional(),
  }),
});

/* =========================================================================
 * Collection : zones
 * URL : /zones/<slug>/
 *
 * ⚠️ Phase 3 : chaque page zone DOIT contenir un contenu local
 * réellement unique (quartiers, repères, exemples) — sous peine d'être
 * traitée comme doorway page par Google.
 * ========================================================================= */
const zones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/zones' }),
  schema: z.object({
    commune: z.string().min(2),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'slug doit être en kebab-case'),
    codePostal: z.string().regex(/^\d{5}$/, 'code postal sur 5 chiffres'),
    h1: z.string().min(5),
    metaTitle: z.string().min(10).max(70),
    metaDescription: z.string().min(50).max(170),
    intro: z.string().min(20).max(280),
    /**
     * Chips (quartiers / villages voisins) à afficher sous le hero
     * pour ancrer le caractère local. Optionnel.
     */
    chips: z.array(z.string().min(2)).max(12).optional(),
  }),
});

export const collections = { services, zones };
