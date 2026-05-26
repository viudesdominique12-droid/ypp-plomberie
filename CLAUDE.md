# Ypp Plomberie — guide projet

Site vitrine pour Ypp Plomberie, artisan plombier à Nice (06).
Site statique (SSG), mobile-first, SEO local en cluster.

---

## Objectif

Faire **appeler** ou faire **demander un devis**. Trois priorités :

1. **Réactivité** : urgence 24h/24 omniprésente (header, sticky bar mobile,
   CTAs sur chaque page).
2. **SEO local** : cluster sémantique services × zones, page pilier
   « plombier Nice » = accueil.
3. **Conversion mobile** : design mobile-first, sticky call bar permanente.

---

## Stack

- **Astro** 6.x · **TypeScript strict** · **CSS natif** (custom properties).
- **Content Collections** (Zod) pour `services` et `zones`.
- **`@astrojs/sitemap`** (rien d'autre).
- 100 % statique. Système de polices natif en phase 1.

### Commandes

```bash
npm run dev        # serveur de dév
npm run build      # build de production
npm run preview    # preview de la build
npm run typecheck  # `astro check` (TypeScript + .astro)
```

---

## Conventions de code

| Élément                  | Convention                  | Exemple                       |
|--------------------------|-----------------------------|-------------------------------|
| Composant                | PascalCase                  | `ServiceCard.astro`           |
| Template / layout        | PascalCase + `Layout`       | `ServiceLayout.astro`         |
| Route / dossier de page  | kebab-case                  | `recherche-de-fuite/`         |
| Données / utilitaires    | kebab-case                  | `site.ts`                     |
| Token CSS                | kebab-case préfixé          | `--color-accent`, `--space-4` |
| Slug de contenu          | kebab-case                  | `debouchage-canalisation`     |
| Type TS / interface props| PascalCase / `Props`        | `ServiceEntry`, `Props`       |

### Règles fixes

1. **En-tête de commentaire OBLIGATOIRE** sur chaque fichier (rôle +
   « rendu dans / utilisé par »).
2. **Aucune valeur en dur dupliquée** : tokens pour les couleurs /
   typo / espacement ; `src/data/site.ts` pour NAP, nav, libellés.
3. **Imports via alias** `@/*` (jamais `../../../`).
4. **`interface Props`** pour les props de composant.
5. **Section markée** : commentaire `<!-- [Section: Nom] -->` et
   `id` stable = nom du composant.
6. **HTML sémantique** : landmarks, hiérarchie de titres, `alt`,
   skip-link, focus visible, `prefers-reduced-motion`.

---

## Philosophie des design tokens

Tout passe par les variables CSS définies dans
[src/styles/tokens.css](src/styles/tokens.css) :

- **Couleurs** : sémantiques (`--color-accent`, `--color-urgent`…),
  jamais une couleur écrite en dur dans un composant.
- **Typo** : échelle modulaire ~1,25 (`--font-size-xs` → `--font-size-3xl`).
- **Espacement** : base 4 px (`--space-1` → `--space-24`).
- **Reste** : rayons, ombres, transitions, z-index, breakpoints
  documentés.

⚠️ **Phase 1** : les valeurs de couleurs sont des niveaux de gris
provisoires. La phase 2 changera **uniquement** les valeurs, jamais
les noms ni leur usage dans les composants.

---

## Plan en 4 phases

### Phase 1 — Architecture & design system structurel ✅

- Squelette Astro + TypeScript strict.
- Design tokens (structure définitive, couleurs neutres provisoires).
- Composants atomiques + sections + layouts + pages.
- Content collections `services` (6) et `zones` (3) avec schémas Zod.
- 404 stylée, sitemap, robots.txt, JSON-LD LocalBusiness/Plumber +
  BreadcrumbList.

### Phase 2 — Thème couleur + identité Nice ✅

- Palette « Baie des Anges » appliquée (azur, urg, laiton, ink…).
- Playfair Display + Inter chargées via `@fontsource`.
- Composants re-skinés (boutons pill, cartes, FAQ, etc.).
- Touches « eau qui coule » (AnimatedWaves, Ripple, Marquee, etc.).
- Composants 21st.dev / Magic UI / shadcn / Iconify adaptés.

### Phase 3 — Contenu + SEO complet ✅ (CE LIVRABLE)

- Rédaction des 6 pages services (frontmatter + body Markdown ~500 mots).
- Rédaction RÉELLEMENT DIFFÉRENCIÉE des 3 pages zones (quartiers réels,
  repères géographiques publics, bâti type).
- FAQ spécifiques par service (3-5 questions chacune) + FAQ accueil
  (6 questions) — toutes alimentent le JSON-LD FAQPage.
- Mentions légales et politique de confidentialité conformes RGPD
  (placeholders pour les informations spécifiques à l'éditeur).
- JSON-LD enrichi : `LocalBusiness` avec `AggregateRating` (5,0/13),
  `priceRange`, `areaServed` (10 villes), `Service` par page service,
  `FAQPage` sur l'accueil et chaque page service, `BreadcrumbList`
  sur toutes les pages internes.
- Schéma `services` étendu : `accroche`, `faqItems`.
- Schéma `zones` étendu : `chips`.
- 17 routes avec titles + meta uniques.

### Phase 4 — Formulaire + audit final ✅ (CE LIVRABLE)

- Formulaire de devis FONCTIONNEL via **Web3Forms** (envoi e-mail
  sans backend). Clé d'accès via `PUBLIC_WEB3FORMS_KEY`
  (cf. `.env.example`).
- Logique formulaire isolée dans
  [src/scripts/quote-form.ts](src/scripts/quote-form.ts) — un seul
  endroit où déboguer.
- Validation client (champs requis, e-mail, téléphone FR 10
  chiffres, RGPD), états visuels (idle / sending / success / error),
  honeypot Web3Forms (`botcheck`), accessibilité ARIA, dégradation
  gracieuse sans JS.
- Audits passés : performance, SEO (titles/metas/JSON-LD), accessibilité
  WCAG AA, robustesse.
- `README.md` et `LIVRAISON.md` créés (livraison client).
- Placeholders à compléter listés dans `LIVRAISON.md`.

---

## Comment ajouter un service

1. Créer un fichier `src/content/services/<slug>.md`.
2. Renseigner le frontmatter conformément au schéma de
   [src/content.config.ts](src/content.config.ts) :
   - Obligatoire : `title`, `slug`, `order`, `h1`, `metaTitle` (≤ 70),
     `metaDescription` (50–170), `shortDescription`, `icon`.
   - Optionnel (phase 3) : `accroche` (intro éditoriale 40–420 car.),
     `faqItems` (3-6 questions/réponses — alimentent la section FAQ
     ET le JSON-LD `FAQPage`).
3. **Corps Markdown** : éditorial long-form ~500-700 mots (titre H2,
   listes, liens internes). Rendu dans le `<slot />` de `ServiceLayout`
   juste après le hero — c'est le contenu SEO le plus important de la
   page.
4. **C'est tout** : la page `/services/<slug>/` est générée
   automatiquement via `getStaticPaths`. Le service apparaît dans
   la grille de services et dans le maillage interne des autres
   pages services et zones.

## Comment ajouter une zone

1. Créer un fichier `src/content/zones/<slug>.md`.
2. Renseigner le frontmatter : `commune`, `slug`, `codePostal`,
   `h1`, `metaTitle`, `metaDescription`, `intro`,
   `chips` (quartiers/villages voisins, optionnel).
3. **Corps Markdown** : contenu local **réellement différencié**
   (quartiers réels, repères géographiques publics, bâti type,
   délais depuis Nice). Voir [ARCHITECTURE.md](ARCHITECTURE.md) — un
   contenu générique = doorway page = pénalité Google.
4. La page `/zones/<slug>/` est générée automatiquement.

⚠️ **Ne pas créer de page `/zones/nice/`** : la page pilier
« plombier Nice » est l'accueil, c'est volontaire (anti-cannibalisation
SEO).

---

## Comment éditer un texte ou une meta

| Élément | Où le modifier |
|---|---|
| Title / meta description d'une page service | `src/content/services/<slug>.md` (frontmatter) |
| Title / meta description d'une page zone | `src/content/zones/<slug>.md` (frontmatter) |
| Title / meta description d'une page transverse | dans la page `.astro` (props passées à `<BaseLayout>` ou `<ContentLayout>`) |
| Contenu éditorial long d'un service | corps Markdown du `.md` |
| FAQ d'un service | `faqItems` dans le frontmatter du `.md` |
| FAQ de l'accueil | tableau `homeFaq` dans `src/pages/index.astro` |
| NAP (nom, téléphone, adresse, e-mail, SIRET…) | `src/data/site.ts` — propagé partout (texte + JSON-LD) |

Tous les `[PLACEHOLDER]` du site pointent vers `src/data/site.ts`
ou les pages légales. Voir la liste exhaustive à la fin de ce doc
ou dans le rapport de fin de phase 3.

---

## Pour comprendre où vit chaque chose

Voir [ARCHITECTURE.md](ARCHITECTURE.md) — schéma des 7 couches,
table route → fichier, et **carte de débogage**
« symptôme → fichier à inspecter ».
