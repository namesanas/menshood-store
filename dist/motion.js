/* MENSHOOD motion: native browser animations, no animation-library download.
 * Change these timings to adjust the feel. All effects respect reduced motion.
 * Content remains visible if JavaScript or IntersectionObserver is unavailable.
 */
(() => {
  'use strict';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timing = { entrance: 720, reveal: 620, stagger: 75 };
  const running = new Set();
  let revealObserver;
  const $all = selector => Array.from(document.querySelectorAll(selector));

  function animate(element, frames, options = {}) {
    if (!element || preference.matches || !element.animate || document.hidden) return;
    const animation = element.animate(frames, {
      duration: timing.reveal,
      easing: 'cubic-bezier(.22,1,.36,1)',
      fill: 'backwards',
      ...options
    });
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
  }

  function settle() {
    revealObserver?.disconnect();
    running.forEach(animation => animation.cancel());
    running.clear();
    $all('[data-reveal-pending]').forEach(element => element.removeAttribute('data-reveal-pending'));
  }

  if (preference.matches || !Element.prototype.animate) return;
  preference.addEventListener('change', event => { if (event.matches) settle(); });

  // Finite entrance sequence; the image itself never delays text or navigation.
  if (!location.hash && window.scrollY < 80) {
    $all('.hero-brand, .hero-copy > .eyebrow, .hero h1, .hero-copy > p, .hero-copy > .button, .hero-foot')
      .forEach((element, index) => animate(element,
        [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: timing.entrance, delay: index * timing.stagger }));
    animate(document.querySelector('.hero-image > img'),
      [{ opacity: .55, transform: 'scale(1.045)' }, { opacity: 1, transform: 'scale(1)' }],
      { duration: 1150 });
    animate(document.querySelector('.image-caption'),
      [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: timing.entrance, delay: 240 });
  }

  if (!('IntersectionObserver' in window)) return;
  const targets = $all('.section-heading, .catalogue-note, .shop-toolbar, .product-card, .editorial-image, .editorial-copy, .how-section > div:first-child, .how-grid article, .community > .eyebrow, .community > h2, .community > div, .faq > div, .footer-top, .footer-word');
  revealObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    visible.forEach(({ target }, index) => {
      revealObserver.unobserve(target);
      target.removeAttribute('data-reveal-pending');
      animate(target,
        [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { delay: Math.min(index, 3) * timing.stagger });
    });
  }, { threshold: .08 });
  targets.forEach(element => {
    // Never hide already visible content or items reached by a direct anchor.
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.setAttribute('data-reveal-pending', '');
    revealObserver.observe(element);
  });
  // Keyboard navigation must not focus an invisible reveal target.
  document.addEventListener('focusin', event => {
    const target = event.target.closest('[data-reveal-pending]');
    if (target) { target.removeAttribute('data-reveal-pending'); revealObserver.unobserve(target); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });

  // A little depth once the navigation sticks, without a per-frame scroll handler.
  const header = document.querySelector('.header');
  const announcement = document.querySelector('.announcement');
  if (header && announcement) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-scrolled', !entry.isIntersecting);
    });
    headerObserver.observe(announcement);
  }
})();
