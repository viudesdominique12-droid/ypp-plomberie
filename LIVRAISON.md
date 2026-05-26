# LIVRAISON — Ypp Plomberie

Document de transmission du site à l'éditeur. Il liste **tout ce qui
reste à compléter avec les informations réelles du client** avant la
mise en ligne définitive, ainsi que les points qui nécessitent une
validation explicite (mentions légales, contenus sensibles).

Le site est **100 % opérationnel** côté code : architecture, design,
contenu rédactionnel, SEO, formulaire et audits sont passés. Il ne
manque que les données factuelles propres à l'éditeur.

---

## 1. Placeholders à renseigner — données centrales

Tous les placeholders ci-dessous sont **centralisés** dans
[src/data/site.ts](src/data/site.ts). Renseigner une seule fois ici
suffit à les propager dans tout le site (textes, footer, mentions
légales, JSON-LD).

| Placeholder              | Description                                          | Fichier · ligne                         |
| ------------------------ | ---------------------------------------------------- | --------------------------------------- |
| `[NOM_GERANT]`           | Nom + prénom du gérant                                | `src/data/site.ts:51`                   |
| `[ADRESSE]`              | Adresse postale (rue + n°)                            | `src/data/site.ts:57`                   |
| `[CODE_POSTAL]`          | Code postal du siège                                  | `src/data/site.ts:58`                   |
| `[EMAIL]`                | Adresse e-mail professionnelle                        | `src/data/site.ts:64`                   |
| `[ANNEE_CREATION]`       | Année de création de l'activité                       | `src/data/site.ts:66`                   |
| `[NB_ANNEES_EXPERIENCE]` | Nombre d'années d'expérience (ex. `10`)               | `src/data/site.ts:68`                   |
| `[N_SIRET]`              | Numéro SIRET (14 chiffres)                            | `src/data/site.ts:95`                   |
| `[N_SIREN]`              | Numéro SIREN (9 chiffres)                             | `src/data/site.ts:96`                   |
| `[N_TVA_INTRACOM]`       | Numéro TVA intracommunautaire                         | `src/data/site.ts:97`                   |
| `[N_RCS_OU_RM]`          | RCS / Répertoire des Métiers                          | `src/data/site.ts:98`                   |
| `[ASSURANCE_DECENNALE]`  | Numéro de contrat décennale + assureur                | `src/data/site.ts:99`                   |
| `[URL_GOOGLE_BUSINESS]`  | URL de la fiche Google Business Profile               | `src/data/site.ts:37` et `:103`         |

## 2. Placeholders à renseigner — pages légales

| Placeholder              | Description                                          | Fichier · ligne                                              |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------ |
| `[NOM_HEBERGEUR]`        | Nom de l'hébergeur web retenu                         | `src/pages/mentions-legales/index.astro:60`                  |
| `[ADRESSE_HEBERGEUR]`    | Adresse postale complète de l'hébergeur               | `src/pages/mentions-legales/index.astro:61`                  |
| `[NOM_PRESTATAIRE_WEB]`  | Identité du prestataire ayant développé le site       | `src/pages/mentions-legales/index.astro:117`                 |
| `[DUREE_CONSERVATION]`   | Durée de conservation des données formulaire (ex. « 3 ans ») | `src/pages/politique-de-confidentialite/index.astro:86` |
| `[NOM_OUTIL_ANALYTIQUE]` | Outil d'analytique anonymisée (Plausible, etc.) ou *« aucun »* | `src/pages/politique-de-confidentialite/index.astro:150` |

## 3. Configuration formulaire

Le formulaire de devis envoie un e-mail à l'artisan via
[Web3Forms](https://web3forms.com). Avant mise en ligne :

1. Aller sur [web3forms.com](https://web3forms.com) et saisir l'adresse
   `[EMAIL]` de l'artisan.
2. Récupérer la **clé d'accès** (Access Key) reçue par e-mail.
3. Sur l'hébergeur (Vercel, Netlify, etc.), ajouter la variable
   d'environnement :

   ```
   PUBLIC_WEB3FORMS_KEY = <clé fournie par Web3Forms>
   ```

4. Redéployer le site.
5. Tester l'envoi du formulaire depuis `/contact/` une fois en ligne.

> La clé Web3Forms est *publique* (validée côté serveur sur le domaine
> d'origine) — pas un secret au sens cryptographique.

## 4. Image de partage Open Graph

À fournir et déposer dans `public/og-default.jpg` :

- Format : JPEG, 1200 × 630 px (ratio 1.91:1).
- Poids : ≤ 200 Ko.
- Contenu suggéré : logo Ypp Plomberie + accroche « Plombier à Nice
  24h/24 », couleurs identité (azur + ink). À défaut, un visuel sobre
  réutilisable. Référencé dans le JSON-LD `LocalBusiness.image` et la
  meta `og:image`.

## 5. Photos à fournir (phase visuelle facultative)

Le site fonctionne sans, mais c'est l'étape « finitions premium » à
prévoir une fois en place :

- **Portrait artisan** (ratio ~ 4/5, 800 × 1000 px) — pour la page
  `/a-propos/`. Remplace le placeholder photo.
- **Photos de chantiers réels** (6 à 9 images) — pour
  `/realisations/`. Avant / après idéalement. Légendes
  descriptives à fournir avec les images (= alt SEO).
- **Visuel hero accueil** (optionnel) — un vrai cliché baie des Anges
  ou intervention soignée, en remplacement de la scène d'eau animée
  par défaut.

## 6. Points à valider explicitement par le client

| Élément                                                     | À valider                                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Mentions légales** ([mentions-legales/](src/pages/mentions-legales/index.astro)) | Le texte est un modèle conforme LCEN — à relire et adapter au statut juridique exact (entreprise individuelle, EURL, SASU, etc.). |
| **Politique de confidentialité** ([politique-de-confidentialite/](src/pages/politique-de-confidentialite/index.astro)) | Vérifier que toutes les pratiques décrites correspondent à la réalité (durée de conservation, outils analytique, cookies). |
| **Tarifs indicatifs** sur pages services (fourchettes affichées) | Validation par l'artisan que les fourchettes affichées sont correctes (détection acoustique 180€, caméra thermique 240€, gaz traceur 320€, etc. — cf. ServicePricingSection). |
| **Délais d'intervention** annoncés (< 1 h Nice, 20-30 min Saint-Laurent, etc.) | Validation que ces délais sont réalistes au quotidien. |
| **Zones d'intervention** étendues (12 communes citées dans le JSON-LD `areaServed`) | Confirmer la couverture complète : Nice, Saint-Laurent-du-Var, Cagnes-sur-Mer, Villeneuve-Loubet, Antibes, Beaulieu, Villefranche, Èze, Saint-Jean-Cap-Ferrat, Cap d'Ail. |
| **Avis Google affichés** (3 témoignages sur l'accueil)      | Reformulés de manière vraisemblable mais non sourcés — à remplacer par les vrais avis Google avec accord des clients (Thierry P., Eva T., etc.). |
| **FAQ par service** (3-5 questions par page service)        | Relecture par l'artisan : tarif d'intervention urgence, prise en charge assurance, types de chauffe-eau installés, marques, etc. |
| **Présentation à-propos** (3 paragraphes signal E-E-A-T)    | Validation du ton et de l'exactitude factuelle (parcours, formation, méthode de travail). |

## 7. Procédure de mise en ligne

1. ✅ **Compléter les 18 placeholders** ci-dessus (section 1 + 2).
2. ✅ **Faire valider** les éléments de la section 6 par le client.
3. ✅ **Obtenir la clé Web3Forms** (section 3).
4. ✅ **Déposer `og-default.jpg`** dans `public/` (section 4).
5. ✅ Choisir l'hébergeur (Vercel, Netlify, OVH…) et configurer la
   variable `PUBLIC_WEB3FORMS_KEY` dessus.
6. ✅ `npm run build` puis déployer.
7. ✅ Tester le formulaire en production (envoyer une demande de
   test, vérifier la réception).
8. ✅ Soumettre le `sitemap-index.xml` à Google Search Console.
9. ✅ Vérifier la connexion à la fiche Google Business Profile
   (`[URL_GOOGLE_BUSINESS]` dans `site.ts`).

## 8. Vérification : un seul `grep`

À tout moment, recenser ce qui reste à compléter :

```bash
grep -rnE '\[[A-Z_]+\]' src public --include="*.astro" --include="*.ts" --include="*.md"
```

Le résultat doit **strictement** correspondre aux tableaux des
sections 1 et 2 ci-dessus. Toute autre occurrence est anormale.

---

**Site livré le :** [DATE_LIVRAISON]
**Contact prestataire :** [NOM_PRESTATAIRE_WEB]
