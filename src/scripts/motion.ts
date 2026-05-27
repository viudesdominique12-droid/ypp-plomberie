/**
 * motion.ts — Runtime d'animations global (couche client).
 *
 * Rôle : initialiser Lenis (scroll lissé éditorial) + GSAP / ScrollTrigger
 * et exposer un petit jeu de comportements déclaratifs activables via
 * data-attributes :
 *
 *   - [data-anim="rise"]        → fade-up au scroll, stagger via index
 *   - [data-anim="mask"]        → clip-path inset reveal
 *   - [data-anim="hero-words"]  → split + reveal mot par mot
 *   - [data-anim="counter"]     → tween numérique (decimals via data-decimals)
 *   - [data-parallax="0.X"]     → translate Y -X*100% selon scroll
 *   - [data-cursor-light]       → spot blanc qui suit le curseur (sections sombres)
 *
 * Toutes les animations respectent `prefers-reduced-motion` :
 *   - reduced  → fade direct opacity, sans translation, sans parallax
 *   - normal   → ease-out cubic, durées 0.6–1.2s
 *
 * Importé une seule fois depuis BaseLayout via <script type="module">.
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================================
 * 1. Lenis — scroll lissé global
 * ========================================================================= */
function initLenis(): Lenis | null {
  if (REDUCED) return null;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
  });
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync GSAP ScrollTrigger avec Lenis.
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/* =========================================================================
 * 2. Reveals : fade-up générique
 * ========================================================================= */
function initRises() {
  const rises = document.querySelectorAll<HTMLElement>('[data-anim="rise"]');
  rises.forEach((el) => {
    if (REDUCED) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });
}

/* =========================================================================
 * 3. Reveals : clip-path inset (image / bloc)
 * ========================================================================= */
function initMasks() {
  const masks = document.querySelectorAll<HTMLElement>('[data-anim="mask"]');
  masks.forEach((el) => {
    if (REDUCED) {
      gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 });
      return;
    }
    gsap.fromTo(
      el,
      { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.4 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      }
    );
  });
}

/* =========================================================================
 * 4. Hero : split words + reveal stagger
 * ========================================================================= */
/**
 * Wrap chaque mot d'un nœud (récursivement) dans <span class="word">.
 * Préserve <br>, <em>, et les attributs des éléments — opère uniquement
 * sur les nœuds TEXT, jamais sur le HTML brut.
 */
function wrapWordsInElement(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    if (node.nodeValue && node.nodeValue.trim().length > 0) {
      textNodes.push(node as Text);
    }
    node = walker.nextNode();
  }
  textNodes.forEach((tn) => {
    const parent = tn.parentNode;
    if (!parent) return;
    const parts = tn.nodeValue!.split(/(\s+)/); // garde les espaces comme entrées
    const frag = document.createDocumentFragment();
    parts.forEach((p) => {
      if (p.length === 0) return;
      if (/^\s+$/.test(p)) {
        frag.appendChild(document.createTextNode(p));
      } else {
        const word = document.createElement('span');
        word.className = 'word';
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = p;
        word.appendChild(inner);
        frag.appendChild(word);
      }
    });
    parent.replaceChild(frag, tn);
  });
}

function initHeroWords() {
  const titles = document.querySelectorAll<HTMLElement>('[data-anim="hero-words"]');
  titles.forEach((title) => {
    if (REDUCED) {
      gsap.set(title, { opacity: 1 });
      return;
    }
    wrapWordsInElement(title);

    const inners = title.querySelectorAll('.word-inner');
    gsap.set(title, { opacity: 1 });
    gsap.set(inners, { yPercent: 110, opacity: 0 });
    gsap.to(inners, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.05,
      delay: 0.15,
    });
  });
}

/* =========================================================================
 * 5. Compteurs numériques (entrée dans la vue)
 * ========================================================================= */
function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-anim="counter"]');
  counters.forEach((el) => {
    const target = parseFloat(el.dataset.target ?? '0');
    const decimals = parseInt(el.dataset.decimals ?? '0', 10);
    const suffix = el.dataset.suffix ?? '';
    const prefix = el.dataset.prefix ?? '';

    if (REDUCED) {
      el.textContent = prefix + target.toFixed(decimals).replace('.', ',') + suffix;
      return;
    }

    const obj = { v: 0 };
    el.textContent = prefix + (0).toFixed(decimals).replace('.', ',') + suffix;
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
      onUpdate: () => {
        el.textContent = prefix + obj.v.toFixed(decimals).replace('.', ',') + suffix;
      },
    });
  });
}

/* =========================================================================
 * 6. Parallax : translate y selon le scroll
 * ========================================================================= */
function initParallax() {
  if (REDUCED) return;
  const items = document.querySelectorAll<HTMLElement>('[data-parallax]');
  items.forEach((el) => {
    const strength = parseFloat(el.dataset.parallax ?? '0.2');
    gsap.fromTo(
      el,
      { yPercent: -strength * 50 },
      {
        yPercent: strength * 50,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

/* =========================================================================
 * 7. Sticky stats : numéro pinné, contenu scrolle
 * ========================================================================= */
function initStickyNumbers() {
  if (REDUCED) return;
  const items = document.querySelectorAll<HTMLElement>('[data-sticky-num]');
  items.forEach((el) => {
    const num = el.querySelector<HTMLElement>('.sticky-num');
    if (!num) return;
    // CSS gère le position: sticky — on n'a rien à faire en JS sauf
    // forcer ScrollTrigger refresh après load.
  });
  ScrollTrigger.refresh();
}

/* =========================================================================
 * 8. Cursor light (sections sombres)
 * ========================================================================= */
function initCursorLight() {
  if (REDUCED || window.matchMedia('(hover: none)').matches) return;
  const targets = document.querySelectorAll<HTMLElement>('[data-cursor-light]');
  targets.forEach((target) => {
    if (target.dataset.cursorBound) return;
    target.dataset.cursorBound = '1';
    const onMove = (e: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--cx', `${e.clientX - rect.left}px`);
      target.style.setProperty('--cy', `${e.clientY - rect.top}px`);
      target.style.setProperty('--c-opacity', '1');
    };
    const onLeave = () => target.style.setProperty('--c-opacity', '0');
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerleave', onLeave);
  });
}

/* =========================================================================
 * Boot
 * ========================================================================= */
function boot() {
  initLenis();
  initHeroWords();
  initMasks();
  initRises();
  initCounters();
  initParallax();
  initStickyNumbers();
  initCursorLight();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// Astro View Transitions — relance après chaque navigation.
document.addEventListener('astro:after-swap', () => {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  boot();
});
