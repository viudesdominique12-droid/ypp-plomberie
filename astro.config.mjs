// @ts-check
/**
 * Astro configuration — Ypp Plomberie (Phase 1).
 *
 * Rôle : configurer Astro pour un site 100 % statique (SSG) avec sitemap.
 * Utilisé par : Astro CLI (`astro dev`, `astro build`, `astro check`).
 *
 * `site` est requis pour générer des URLs absolues correctes dans le sitemap,
 * le canonical et les balises Open Graph. La valeur définitive sera ajustée
 * en phase 2/4 ; pour l'instant, on pointe sur le domaine cible présumé.
 */
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ypp-plomberie.fr',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
