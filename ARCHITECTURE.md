# ARCHITECTURE — Ypp Plomberie

Document central de débogage. Ouvrir CE fichier en premier quand
quelque chose ne va pas.

---

## 1. Le principe — architecture en couches

Le code est organisé en **7 couches** qui se dépendent les unes les
autres dans **un seul sens** (de haut en bas).
Une couche n'importe **que** des couches situées plus bas. Jamais
l'inverse. Jamais de couplage latéral caché.

```
┌─────────────────────────────────────────────────────────────────┐
│ 7. pages         src/pages/                                     │  routes
│                  Choisit un template, fournit les données       │  (chemin = URL)
├─────────────────────────────────────────────────────────────────┤
│ 6. templates     src/layouts/                                   │
│                  Assemble layout (chrome) + sections            │
├─────────────────────────────────────────────────────────────────┤
│ 5. sections      src/components/sections/                       │
│                  Blocs de page : Hero, ServicesGrid, FAQ…       │
├─────────────────────────────────────────────────────────────────┤
│ 4. layout        src/components/layout/                         │
│                  Chrome : Header, Footer, StickyCallBar,        │
│                  Breadcrumb, Seo                                │
├─────────────────────────────────────────────────────────────────┤
│ 3. ui            src/components/ui/                             │
│                  Primitives : Button, Container, Section,       │
│                  ServiceCard, Stepper…                          │
├─────────────────────────────────────────────────────────────────┤
│ 2. base          src/styles/global.css                          │
│                  Reset + typo + accessibilité                   │
├─────────────────────────────────────────────────────────────────┤
│ 1. tokens        src/styles/tokens.css                          │
│                  Couleurs, typo, espacement, ombres…            │
└─────────────────────────────────────────────────────────────────┘
                                  ▲
                src/data/site.ts (NAP, nav, libellés)
                src/content/      (services, zones)
                — sources de vérité transverses, lues par
                  les couches 5, 6, 7
```

### Règles strictes

- **1 route = 1 fichier** dans `src/pages/`, au chemin **identique
  à l'URL**.
- **1 page = composition seule** (pas de logique métier, pas de
  style, pas de contenu en dur).
- **1 fichier = 1 responsabilité.** Si un fichier fait deux choses,
  scinder.
- **1 composant = 1 fichier `.astro`** avec ses styles scopés
  co-localisés dedans.
- **Aucune valeur en dur dupliquée** : couleurs / espacements → tokens ;
  NAP / nav / libellés → `src/data/site.ts`.
- **Imports via alias** (`@/*`). **Jamais** de `../../../`.

### Échec bruyant

Les schémas Zod de `src/content.config.ts` font **échouer le build
en nommant le fichier fautif** si une entrée de contenu est invalide.
Aucune erreur ne passe en silence.

---

## 2. Table route → fichier de page → template → sections

| URL                                       | Fichier de page                                        | Template / layout                                          | Sections principales                                                                                                                              |
|-------------------------------------------|--------------------------------------------------------|------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `/`                                       | `src/pages/index.astro`                                | `src/layouts/BaseLayout.astro`                             | HomeHero · ServicesGrid · ReassuranceBlock · ProcessSteps · RealisationsPreview · ReviewsSection · ZonesSection · FaqSection · FinalCta            |
| `/services/`                              | `src/pages/services/index.astro`                       | `BaseLayout`                                               | Breadcrumb · ServicesGrid · ReassuranceBlock · FinalCta                                                                                          |
| `/services/depannage-urgence/`            | `src/pages/services/[slug].astro` ← `services/depannage-urgence.md`      | `src/layouts/ServiceLayout.astro` (→ BaseLayout) | Breadcrumb · ServiceHero · ServiceWhenSection · ServiceProcessSection · ServicePricingSection · ReassuranceBlock · FaqSection · ServiceCrossLinks · FinalCta |
| `/services/recherche-de-fuite/`           | idem ← `services/recherche-de-fuite.md`                 | idem                                                       | idem                                                                                                                                              |
| `/services/debouchage-canalisation/`      | idem ← `services/debouchage-canalisation.md`            | idem                                                       | idem                                                                                                                                              |
| `/services/chauffe-eau/`                  | idem ← `services/chauffe-eau.md`                        | idem                                                       | idem                                                                                                                                              |
| `/services/renovation-salle-de-bain/`     | idem ← `services/renovation-salle-de-bain.md`           | idem                                                       | idem                                                                                                                                              |
| `/services/installation-sanitaire/`       | idem ← `services/installation-sanitaire.md`             | idem                                                       | idem                                                                                                                                              |
| `/zone-intervention/`                     | `src/pages/zone-intervention/index.astro`              | `BaseLayout`                                               | Breadcrumb · (intro) · ZonesSection · ReassuranceBlock · FinalCta                                                                                |
| `/zones/saint-laurent-du-var/`            | `src/pages/zones/[slug].astro` ← `zones/saint-laurent-du-var.md`         | `src/layouts/ZoneLayout.astro` (→ BaseLayout)    | Breadcrumb · ZoneHero · (contenu local Markdown) · ZoneServicesSection · ReassuranceBlock · FinalCta                                              |
| `/zones/cagnes-sur-mer/`                  | idem ← `zones/cagnes-sur-mer.md`                        | idem                                                       | idem                                                                                                                                              |
| `/zones/villefranche-sur-mer/`            | idem ← `zones/villefranche-sur-mer.md`                  | idem                                                       | idem                                                                                                                                              |
| `/realisations/`                          | `src/pages/realisations/index.astro`                   | `BaseLayout`                                               | Breadcrumb · (grille placeholders) · FinalCta                                                                                                    |
| `/a-propos/`                              | `src/pages/a-propos/index.astro`                       | `src/layouts/ContentLayout.astro` (→ BaseLayout)           | Breadcrumb · ContentHeader · ContentBody                                                                                                          |
| `/contact/`                               | `src/pages/contact/index.astro`                        | `BaseLayout`                                               | Breadcrumb · ContactIntro · ContactDetails · QuoteForm                                                                                            |
| `/mentions-legales/`                      | `src/pages/mentions-legales/index.astro`               | `ContentLayout`                                            | Breadcrumb · ContentHeader · ContentBody                                                                                                          |
| `/politique-de-confidentialite/`          | `src/pages/politique-de-confidentialite/index.astro`   | `ContentLayout`                                            | Breadcrumb · ContentHeader · ContentBody                                                                                                          |
| `/404`                                    | `src/pages/404.astro`                                  | `BaseLayout`                                               | NotFound                                                                                                                                          |

> ⚠️ La page pilier « plombier Nice » est l'accueil (`/`).
> **Ne pas créer `/zones/nice/`** — ce serait une cannibalisation SEO.

---

## 3. CARTE DE DÉBOGAGE — symptôme → fichier à inspecter

| Symptôme observé                                              | Fichier(s) à inspecter                                                                       |
|--------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Couleur / typo / espacement global incorrect                  | [src/styles/tokens.css](src/styles/tokens.css)                                                |
| Reset / focus / skip-link global cassé                        | [src/styles/global.css](src/styles/global.css)                                                |
| Téléphone / adresse / horaires / e-mail faux PARTOUT          | [src/data/site.ts](src/data/site.ts)                                                          |
| Libellés de navigation faux                                   | [src/data/site.ts](src/data/site.ts) → `primaryNav`, `footerLegalNav`                         |
| Menu, logo ou en-tête cassé                                   | [src/components/layout/Header.astro](src/components/layout/Header.astro)                      |
| Bouton d'appel mobile cassé                                   | [src/components/layout/StickyCallBar.astro](src/components/layout/StickyCallBar.astro)        |
| Pied de page incorrect                                        | [src/components/layout/Footer.astro](src/components/layout/Footer.astro)                      |
| Fil d'Ariane ou son JSON-LD faux                              | [src/components/layout/Breadcrumb.astro](src/components/layout/Breadcrumb.astro)              |
| Balises meta / titre de page / canonical / Open Graph faux    | [src/components/layout/Seo.astro](src/components/layout/Seo.astro)                            |
| JSON-LD LocalBusiness/Plumber faux                            | [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) + [src/data/site.ts](src/data/site.ts) |
| Lien d'évitement (skip-link) cassé                            | [src/styles/global.css](src/styles/global.css) + [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) |
| Une section de l'accueil rend mal                             | `src/components/sections/<NomSection>.astro`                                                  |
| Sticky call bar masquée alors qu'elle ne devrait pas          | [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) (`hideStickyCallBar`)            |
| Une primitive (bouton, carte…) rend mal                       | `src/components/ui/<Nom>.astro`                                                               |
| Une page service entière est cassée                           | [src/layouts/ServiceLayout.astro](src/layouts/ServiceLayout.astro)                            |
| Le contenu d'UN service est faux (titre, slug, méta…)         | `src/content/services/<slug>.md`                                                              |
| Le déroulé / les tarifs d'un service paraissent génériques    | Sections `ServiceWhenSection`, `ServiceProcessSection`, `ServicePricingSection` (passer un override `items`/`steps`/`rows` depuis ServiceLayout si besoin per-service) |
| Une page zone est cassée                                      | [src/layouts/ZoneLayout.astro](src/layouts/ZoneLayout.astro)                                  |
| Le contenu d'UNE zone est faux                                | `src/content/zones/<slug>.md`                                                                 |
| Une page « contenu » (à-propos / légal) est cassée            | [src/layouts/ContentLayout.astro](src/layouts/ContentLayout.astro) + la page concernée        |
| Le formulaire de devis n'envoie rien                          | [src/scripts/quote-form.ts](src/scripts/quote-form.ts) (logique) ; vérifier `PUBLIC_WEB3FORMS_KEY` dans `.env` ; ouvrir la console (logs `[QuoteForm]`) |
| Le formulaire de devis est cassé visuellement                 | [src/components/sections/QuoteForm.astro](src/components/sections/QuoteForm.astro) (markup + styles) |
| Le formulaire valide mal un champ (e-mail, tel, RGPD)         | fonctions `isValidEmail`, `isValidFrenchPhone`, `validate` dans [src/scripts/quote-form.ts](src/scripts/quote-form.ts) |
| Les messages d'erreur du formulaire sont en mauvais français  | objet `messages` dans [src/scripts/quote-form.ts](src/scripts/quote-form.ts) |
| L'état succès / erreur du formulaire ne s'affiche pas         | élément `[data-form-live]` dans le markup + classes `data-state` dans [src/components/sections/QuoteForm.astro](src/components/sections/QuoteForm.astro) |
| Build qui échoue sur une donnée (Zod)                         | [src/content.config.ts](src/content.config.ts) + le fichier d'entrée nommé dans l'erreur      |
| Une route renvoie 404                                         | `src/pages/` (chemin = URL ; vérifier le slug / l'`index.astro`)                              |
| La page 404 elle-même rend mal                                | [src/pages/404.astro](src/pages/404.astro)                                                    |

### Contenu & SEO (phase 3)

| Symptôme observé                                              | Fichier(s) à inspecter                                                                       |
|--------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| `title`/`meta description` d'une page service                 | `src/content/services/<slug>.md` (frontmatter `metaTitle`/`metaDescription`)                  |
| `title`/`meta description` d'une page zone                    | `src/content/zones/<slug>.md` (frontmatter `metaTitle`/`metaDescription`)                     |
| `title`/`meta description` d'une page transverse              | la page `.astro` (props passées au layout)                                                    |
| `canonical`, Open Graph, robots                               | [src/components/layout/Seo.astro](src/components/layout/Seo.astro)                            |
| JSON-LD `LocalBusiness`/`Plumber` (NAP, rating, areaServed)   | [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) + [src/data/site.ts](src/data/site.ts) |
| JSON-LD `Service` d'une page service                          | [src/layouts/ServiceLayout.astro](src/layouts/ServiceLayout.astro) (généré depuis l'entry)    |
| JSON-LD `FAQPage` d'une page service                          | [src/layouts/ServiceLayout.astro](src/layouts/ServiceLayout.astro) (depuis `faqItems` de l'entry) |
| JSON-LD `FAQPage` de l'accueil                                | [src/pages/index.astro](src/pages/index.astro) (depuis `homeFaq`)                             |
| JSON-LD `BreadcrumbList`                                      | [src/components/layout/Breadcrumb.astro](src/components/layout/Breadcrumb.astro)              |
| FAQ d'une page service                                        | `faqItems` du frontmatter `src/content/services/<slug>.md`                                    |
| FAQ de l'accueil                                              | tableau `homeFaq` dans [src/pages/index.astro](src/pages/index.astro)                         |
| Contenu éditorial long d'une page service                     | corps Markdown de `src/content/services/<slug>.md`                                            |
| Contenu local d'une page zone                                 | corps Markdown de `src/content/zones/<slug>.md`                                               |
| Présentation de l'artisan (à-propos)                          | [src/pages/a-propos/index.astro](src/pages/a-propos/index.astro) (paragraphes inline)         |
| Mentions légales / RGPD                                       | [src/pages/mentions-legales/index.astro](src/pages/mentions-legales/index.astro) + [src/pages/politique-de-confidentialite/index.astro](src/pages/politique-de-confidentialite/index.astro) |
| Note Google, nombre d'avis                                    | [src/data/site.ts](src/data/site.ts) → `site.rating`                                          |
| `sitemap.xml` manquant                                        | [astro.config.mjs](astro.config.mjs) (intégration `sitemap()`) — généré au build              |
| `robots.txt` faux                                             | [public/robots.txt](public/robots.txt)                                                        |
| Placeholder `[XXX]` visible à l'écran                         | recherche `grep -r '\[[A-Z_]\+\]' src/` puis remonter à `src/data/site.ts` (la majorité)      |
| Le sitemap est absent                                         | [astro.config.mjs](astro.config.mjs) (intégration `sitemap()`)                                |
| `robots.txt` faux                                             | [public/robots.txt](public/robots.txt)                                                        |

### Astuces générales

- Inspecter le DOM : la balise `<section>` porte un commentaire HTML
  `<!-- [Section: Nom] -->` et un `id="Nom"`. Le `Nom` est exactement
  le nom du composant dans `src/components/sections/` (ou la chaîne
  passée en prop `id` à `<Section>`).
- Si un composant ne reçoit pas la bonne valeur, remonter le fil :
  page (couche 7) → template (6) → section (5) — l'erreur est dans
  la couche qui transmet les props.

---

## 4. Anatomie d'un fichier de composant

Chaque fichier `.astro` suit la même forme :

```astro
---
/**
 * NomComposant.astro — Rôle (1 ligne).
 *
 * Rôle : ce que fait ce composant en 1-2 phrases.
 * Rendu dans : ses parents directs.
 * Utilisé par : qui s'en sert.
 */

export interface Props { /* … */ }
const { /* destructuration */ } = Astro.props;
---

<!-- markup -->

<style>
  /* styles scopés — uniquement des tokens. */
</style>
```

Un bug visuel se corrige **dans ce seul fichier**.

---

## 5. Phases du projet

Voir [CLAUDE.md](CLAUDE.md) — section « Plan en 4 phases ».
