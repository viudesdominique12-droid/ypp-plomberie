# Ypp Plomberie — Site vitrine

Site vitrine statique pour **Ypp Plomberie**, artisan plombier à Nice (06).
Objectif : faire **appeler** et faire **demander un devis**. Mobile-first,
SEO local en cluster, identité visuelle « Baie des Anges ».

→ **Stack** : Astro 6.x · TypeScript strict · CSS natif (custom properties) ·
Content Collections (Zod) · Web3Forms pour le formulaire de devis · 100 % SSG.

→ Pas de backend à héberger. Le formulaire envoie un e-mail à l'artisan via
Web3Forms ; le reste est statique.

---

## Démarrage rapide

### Prérequis

- **Node.js ≥ 22.12** (`node --version`).
- **npm ≥ 10** (livré avec Node).

### Installation

```bash
git clone <url-du-repo> ypp-plomberie
cd ypp-plomberie
npm install
```

### Variables d'environnement

Copier `.env.example` en `.env` à la racine du projet :

```bash
cp .env.example .env
```

Renseigner la clé Web3Forms (obtenue gratuitement sur
[web3forms.com](https://web3forms.com)) :

```env
PUBLIC_WEB3FORMS_KEY=votre-clé-d-accès-ici
```

Le fichier `.env` est ignoré par Git (cf. `.gitignore`).

### Commandes

| Commande            | Effet                                                  |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Serveur de développement sur `http://localhost:4321`   |
| `npm run typecheck` | `astro check` — vérifie TypeScript et les `.astro`     |
| `npm run build`     | Build statique de production dans `dist/`              |
| `npm run preview`   | Sert le build localement (vérification avant déploiement) |

### Déploiement

Le site est **100 % statique** : la sortie `dist/` se déploie sur n'importe
quel hébergeur web (Vercel, Netlify, OVH, Infomaniak, etc.).

Procédure type :

1. `npm run build` (génère `dist/`).
2. Uploader le contenu de `dist/` sur l'hébergeur, ou pousser sur la branche
   suivie par l'hébergeur (Vercel/Netlify rebuildent automatiquement).
3. Sur Vercel/Netlify : ajouter la variable d'environnement
   `PUBLIC_WEB3FORMS_KEY` dans l'interface (pas de fichier `.env` à
   déployer).
4. Vérifier que `https://www.ypp-plomberie.fr/sitemap-index.xml` répond.

---

## Documentation du projet

| Document                                | Rôle                                              |
| --------------------------------------- | ------------------------------------------------- |
| [CLAUDE.md](CLAUDE.md)                  | Guide projet, conventions, plan en 4 phases       |
| [ARCHITECTURE.md](ARCHITECTURE.md)      | Schéma des 7 couches, table route → fichier, **carte de débogage** symptôme → fichier |
| [LIVRAISON.md](LIVRAISON.md)            | Liste des placeholders `[…]` à compléter par le client et points à valider |

---

## Modifier un contenu

### Texte d'une page service

Éditer le fichier `src/content/services/<slug>.md` :
- frontmatter (title, meta…) : balises SEO et propriétés affichées ;
- corps Markdown : éditorial long-form (rendu dans la page).

### Texte d'une page zone

Éditer le fichier `src/content/zones/<slug>.md`. **Contenu obligatoirement
différencié par commune** (quartiers réels, bâti type) — sinon Google
pénalise comme *doorway page*.

### Coordonnées (téléphone, adresse, e-mail, SIRET…)

Tout est centralisé dans [src/data/site.ts](src/data/site.ts). Changer une
valeur ici la propage **partout** (texte, footer, schéma JSON-LD).

### FAQ

- FAQ accueil : tableau `homeFaq` dans
  [src/pages/index.astro](src/pages/index.astro).
- FAQ d'une page service : champ `faqItems` du frontmatter `.md`.

---

## Ajouter un service

1. Créer un fichier `src/content/services/mon-nouveau-service.md` avec le
   frontmatter requis (voir le schéma dans
   [src/content.config.ts](src/content.config.ts)).
2. Rédiger le corps Markdown.
3. C'est tout — la page `/services/mon-nouveau-service/` est générée
   automatiquement, et la nouvelle entrée apparaît dans la grille de
   services, le footer et le maillage interne.

## Ajouter une zone

1. Créer un fichier `src/content/zones/ma-commune.md`.
2. Rédiger un contenu local différencié (quartiers réels, bâti type, délais).
3. La page `/zones/ma-commune/` est générée automatiquement.

⚠️ Ne **pas** créer `/zones/nice/` : la page pilier « Plombier Nice » est
l'accueil. Créer une page zone pour Nice = cannibalisation SEO.

---

## Phases du projet

| Phase | Livrable                                                | Statut |
| ----- | ------------------------------------------------------- | ------ |
| 1     | Architecture & design system structurel                 | ✅     |
| 2     | Thème couleur + identité « Baie des Anges » + fonts     | ✅     |
| 3     | Contenu rédactionnel + SEO complet                       | ✅     |
| 4     | Formulaire fonctionnel + audit final + livraison        | ✅     |

Voir [CLAUDE.md](CLAUDE.md) pour le détail.

---

## Conventions de code

- **TypeScript strict**, aliases `@/*` (jamais `../../../`).
- **En-tête de commentaire** sur chaque fichier (rôle + où il est utilisé).
- **CSS natif** uniquement, pas de framework CSS. Tous les styles
  proviennent des tokens dans [src/styles/tokens.css](src/styles/tokens.css)
  — aucune couleur en dur dans les composants.
- **Composant** = 1 fichier `.astro` avec son CSS scopé co-localisé.
- **Section markée** : commentaire `<!-- [Section: Nom] -->` + `id`
  stable, pour retrouver le fichier source depuis le DOM.
- **HTML sémantique** : landmarks, hiérarchie Hn, `alt`, skip-link, focus
  visible, `prefers-reduced-motion` respecté.

---

## Crédits techniques

- **Astro** ([astro.build](https://astro.build)) — framework principal.
- **Playfair Display** + **Inter** — polices via `@fontsource`.
- **Lucide Icons** ([lucide.dev](https://lucide.dev)) — iconographie stroke.
- **Web3Forms** ([web3forms.com](https://web3forms.com)) — relai e-mail du
  formulaire de contact.
- Composants inspirés de **Magic UI**, **21st.dev** et **shadcn/ui**,
  adaptés en Astro / CSS pur (aucune dépendance React).

---

## Licence

Code source propriétaire — Ypp Plomberie. Tous droits réservés.
