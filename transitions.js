/**
 * transitions.js  —  Clip-path page transition system + shared nav behaviour.
 * Usage in every HTML page:
 *   <script type="module">
 *     import initTransitions from './transitions.js';
 *     initTransitions();
 *   </script>
 */

const MESSAGES = [
  '> LOADING...',
  '> ACCESSING...',
  '> DECRYPTING...',
  '> MOUNTING...',
];

export default function initTransitions() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  const textEl = overlay.querySelector('.transition-text');

  function setMsg() {
    if (textEl) textEl.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  }

  /* ── Enter animation (on every page load) ──
     1. Disable transition, snap overlay to fully visible.
     2. Re-enable transition, animate to hidden (wipe up). */
  window.addEventListener('DOMContentLoaded', () => {
    setMsg();
    overlay.style.transition = 'none';
    overlay.style.clipPath    = 'inset(0 0 0 0)';
    overlay.style.pointerEvents = 'all';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.transition   = '';       // restore CSS transition
        overlay.style.clipPath     = 'inset(0 0 100% 0)';
        overlay.style.pointerEvents = 'none';
      });
    });
  });

  /* ── Exit animation (intercept internal link clicks) ──
     1. Wipe in from right.
     2. After 420ms, navigate. */
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;

    e.preventDefault();
    setMsg();

    // Snap to right-clipped (invisible), then transition to fully visible
    overlay.style.transition    = 'none';
    overlay.style.clipPath      = 'inset(0 100% 0 0)';
    overlay.style.pointerEvents = 'all';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.transition = '';
        overlay.style.clipPath   = 'inset(0 0 0 0)';
      });
    });

    setTimeout(() => { window.location.href = href; }, 420);
  });

  /* ── Hamburger → X toggle ── */
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Active nav link ── */
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href').split('/').pop() === cur) a.classList.add('active');
  });
}
