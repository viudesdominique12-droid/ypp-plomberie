// @ts-check
/**
 * Astro configuration — Ypp Plomberie.
 *
 * Site statique avec sitemap. Déploiement actuel sur GitHub Pages
 * sous /ypp-plomberie/. À l'achat du domaine custom (ypp-plomberie.fr),
 * retirer `base` et changer `site` vers le domaine final.
 */
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  // Domaine final (ou GitHub Pages tant qu'on n'a pas branché le domaine).
  site: isProd
    ? 'https://viudesdominique12-droid.github.io'
    : 'https://www.ypp-plomberie.fr',
  // Sous-chemin GitHub Pages — sera retiré quand le domaine custom sera en place.
  base: isProd ? '/ypp-plomberie/' : '/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
