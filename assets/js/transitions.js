const MESSAGES = ['> LOADING...', '> ACCESSING...', '> DECRYPTING...', '> MOUNTING...'];

function randomMessage() {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

function snapOverlay(overlay, clipPath) {
  overlay.style.transition = 'none';
  overlay.style.clipPath = clipPath;
  overlay.style.pointerEvents = clipPath === 'inset(0 0 0 0)' ? 'all' : 'none';
}

function animateOverlay(overlay, clipPath) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    overlay.style.transition = '';
    overlay.style.clipPath = clipPath;
  }));
}

function runEnter(overlay, textEl) {
  if (textEl) textEl.textContent = randomMessage();
  snapOverlay(overlay, 'inset(0 0 0 0)');
  animateOverlay(overlay, 'inset(0 0 100% 0)');
  overlay.style.pointerEvents = 'none';
}

function hideOverlay(overlay) {
  overlay.style.transition = 'none';
  overlay.style.clipPath = 'inset(0 0 100% 0)';
  overlay.style.pointerEvents = 'none';
}

function onPageShow(overlay, textEl, e) {
  if (e.persisted) {
    hideOverlay(overlay);
  } else {
    runEnter(overlay, textEl);
  }
}

function isInternalHref(href) {
  return href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('http');
}

function onLinkClick(overlay, textEl, e) {
  const anchor = e.target.closest('a[href]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (!isInternalHref(href)) return;

  e.preventDefault();
  if (textEl) textEl.textContent = randomMessage();
  snapOverlay(overlay, 'inset(0 100% 0 0)');
  animateOverlay(overlay, 'inset(0 0 0 0)');
  setTimeout(() => { window.location.href = href; }, 420);
}

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.addEventListener('click', e => {
    if (e.target.tagName !== 'A') return;
    navLinks.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
}

function initActiveLink() {
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href').split('/').pop() === cur) a.classList.add('active');
  });
}

export default function initTransitions() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  const textEl = overlay.querySelector('.transition-text');

  window.addEventListener('pageshow', e => onPageShow(overlay, textEl, e));
  document.addEventListener('click', e => onLinkClick(overlay, textEl, e));
  initNav();
  initActiveLink();
}
