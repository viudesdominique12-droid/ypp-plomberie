/**
 * url.ts — Helper pour les chemins respectant le `base` du déploiement.
 *
 * En dev local Astro tourne à la racine (`/`), en prod GitHub Pages
 * sous `/ypp-plomberie/`. Tous les liens internes ET les `src` d'images
 * publiques doivent passer par cette fonction pour rester valides dans
 * les deux environnements.
 *
 * Usage :
 *   import { url } from '@/utils/url';
 *   <a href={url('/services/')}>Services</a>
 *   <img src={url('/realisations/01-...jpg')} />
 *
 * Le jour où on branche un domaine custom (ypp-plomberie.fr) et qu'on
 * remet `base: '/'` dans astro.config.mjs, ce helper devient un no-op
 * silencieux — aucun composant à modifier.
 */

const BASE = import.meta.env.BASE_URL ?? '/';

/**
 * Préfixe un chemin avec le BASE_URL Astro. Tolère les chemins avec ou
 * sans slash initial, et garantit qu'il y a EXACTEMENT un slash entre
 * la base et le chemin (pas de double slash, pas d'oubli).
 *
 *   url('/')                 → '/' (dev)   '/ypp-plomberie/' (prod)
 *   url('/services/')        → '/services/' (dev)   '/ypp-plomberie/services/' (prod)
 *   url('services/')         → idem (slash initial optionnel)
 *   url('/realisations/x.jpg') → idem
 */
export function url(path: string): string {
  const base = BASE.endsWith('/') ? BASE : BASE + '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return base + cleanPath;
}
