/* Shared motion setup: Lenis smooth scroll driven by the GSAP ticker, so ScrollTrigger stays in sync.
   Everything is skipped for people who ask for reduced motion. */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({
    lerp: 0.11,
    anchors: { offset: -72 },
    prevent: (node) => node.closest('dialog') !== null,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as unknown as { __lenis: Lenis }).__lenis = lenis;

  // pause smooth scrolling while a modal dialog is open
  const observer = new MutationObserver(() => {
    const open = document.querySelector('dialog[open]');
    open ? lenis?.stop() : lenis?.start();
  });
  document.querySelectorAll('dialog').forEach((d) => observer.observe(d, { attributes: true, attributeFilter: ['open'] }));
  return lenis;
}

// Anything that changes the page height (opening "Show more roles", late fonts, a rotated phone)
// moves the scroll-driven sections, so their start and end points are measured again.
if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
  let timer = 0;
  let lastHeight = 0;
  new ResizeObserver(() => {
    const h = document.body.scrollHeight;
    if (h === lastHeight) return;
    lastHeight = h;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
  }).observe(document.body);
}

export { gsap, ScrollTrigger };
