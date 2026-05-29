const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.4;

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function constrainOffset(offset, containerSize, imageSize, scale) {
  const overflow = (imageSize * scale - containerSize) / 2;
  return overflow > 0 ? clamp(offset, -overflow, overflow) : 0;
}

function buildModal(imgSrc, imgAlt) {
  const modal = document.createElement('div');
  modal.id = 'photo-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', imgAlt);
  modal.innerHTML = `
    <div id="photo-modal-backdrop"></div>
    <div id="photo-modal-container">
      <button id="photo-modal-close" aria-label="Close photo">[&times;]</button>
      <div id="photo-modal-viewport">
        <img id="photo-modal-img" src="${imgSrc}" alt="${imgAlt}" draggable="false">
      </div>
    </div>
  `;
  return modal;
}

function applyTransform(img, scale, x, y) {
  img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

function initMouseZoom(viewport, img, state) {
  viewport.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP;
    state.scale = clamp(state.scale + delta, MIN_SCALE, MAX_SCALE);
    if (state.scale === MIN_SCALE) { state.x = 0; state.y = 0; }
    state.x = constrainOffset(state.x, viewport.clientWidth, img.naturalWidth, state.scale);
    state.y = constrainOffset(state.y, viewport.clientHeight, img.naturalHeight, state.scale);
    applyTransform(img, state.scale, state.x, state.y);
  }, { passive: false });
}

function initMouseDrag(viewport, img, state) {
  let dragging = false;
  let startX = 0;
  let startY = 0;

  viewport.addEventListener('mousedown', e => {
    if (state.scale <= MIN_SCALE) return;
    dragging = true;
    startX = e.clientX - state.x;
    startY = e.clientY - state.y;
    viewport.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    state.x = constrainOffset(e.clientX - startX, viewport.clientWidth, img.naturalWidth, state.scale);
    state.y = constrainOffset(e.clientY - startY, viewport.clientHeight, img.naturalHeight, state.scale);
    applyTransform(img, state.scale, state.x, state.y);
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
    viewport.style.cursor = state.scale > MIN_SCALE ? 'grab' : 'default';
  });
}

function getTouchMidpoint(touches) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function initTouchGestures(viewport, img, state) {
  let lastTouchDist = 0;
  let lastMid = { x: 0, y: 0 };
  let singleStartX = 0;
  let singleStartY = 0;

  viewport.addEventListener('touchstart', e => {
    e.preventDefault();
    if (e.touches.length === 2) {
      lastTouchDist = getTouchDistance(e.touches);
      lastMid = getTouchMidpoint(e.touches);
    } else if (e.touches.length === 1) {
      singleStartX = e.touches[0].clientX - state.x;
      singleStartY = e.touches[0].clientY - state.y;
    }
  }, { passive: false });

  viewport.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const dist = getTouchDistance(e.touches);
      const delta = (dist - lastTouchDist) * 0.01;
      state.scale = clamp(state.scale + delta, MIN_SCALE, MAX_SCALE);
      lastTouchDist = dist;
      if (state.scale === MIN_SCALE) { state.x = 0; state.y = 0; }
      state.x = constrainOffset(state.x, viewport.clientWidth, img.naturalWidth, state.scale);
      state.y = constrainOffset(state.y, viewport.clientHeight, img.naturalHeight, state.scale);
    } else if (e.touches.length === 1 && state.scale > MIN_SCALE) {
      state.x = constrainOffset(e.touches[0].clientX - singleStartX, viewport.clientWidth, img.naturalWidth, state.scale);
      state.y = constrainOffset(e.touches[0].clientY - singleStartY, viewport.clientHeight, img.naturalHeight, state.scale);
    }
    applyTransform(img, state.scale, state.x, state.y);
  }, { passive: false });
}

function resetState(state) {
  state.scale = MIN_SCALE;
  state.x = 0;
  state.y = 0;
}

function closeModal(modal, state, img) {
  resetState(state);
  applyTransform(img, 1, 0, 0);
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  setTimeout(() => modal.remove(), 250);
}

function openModal(imgSrc, imgAlt) {
  const existing = document.getElementById('photo-modal');
  if (existing) existing.remove();

  const state = { scale: MIN_SCALE, x: 0, y: 0 };
  const modal = buildModal(imgSrc, imgAlt);
  document.body.appendChild(modal);

  const viewport = document.getElementById('photo-modal-viewport');
  const img      = document.getElementById('photo-modal-img');
  const closeBtn = document.getElementById('photo-modal-close');
  const backdrop = document.getElementById('photo-modal-backdrop');

  initMouseZoom(viewport, img, state);
  initMouseDrag(viewport, img, state);
  initTouchGestures(viewport, img, state);
  initDoubleClickZoom(viewport, img, state);

  closeBtn.addEventListener('click', () => closeModal(modal, state, img));
  backdrop.addEventListener('click', () => closeModal(modal, state, img));
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') { closeModal(modal, state, img); document.removeEventListener('keydown', onKey); }
  });

  requestAnimationFrame(() => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
}

function isZoomableImage(img) {
  if (img.closest('#photo-modal')) return false;
  if (img.width < 30 && img.height < 30) return false;
  if (img.hasAttribute('data-zoomable') && img.getAttribute('data-zoomable') === 'false') return false;
  if (img.closest('.footer-icons, .nav-links, .nav-logo, .hero-btn, .tag, .filter-pill')) return false;
  const parentLink = img.closest('a');
  if (parentLink && parentLink.href && !parentLink.href.includes('#')) {
    return false;
  }
  return true;
}

function initDoubleClickZoom(viewport, img, state) {
  const ZOOM_IN_SCALE = 2;  // You can adjust this value (2 = 200%)

  viewport.addEventListener('dblclick', (e) => {
    e.preventDefault();

    if (state.scale === MIN_SCALE) {
      // Zoom in to ZOOM_IN_SCALE
      state.scale = ZOOM_IN_SCALE;

      // Get click coordinates relative to the image
      const rect = img.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Convert to relative position within the image (0..1)
      const relX = clickX / rect.width;
      const relY = clickY / rect.height;

      // Calculate new pan offsets so that the clicked point stays under the cursor
      const maxX = (img.naturalWidth * state.scale - viewport.clientWidth) / 2;
      const maxY = (img.naturalHeight * state.scale - viewport.clientHeight) / 2;
      let targetX = (relX - 0.5) * (img.naturalWidth * state.scale - viewport.clientWidth);
      let targetY = (relY - 0.5) * (img.naturalHeight * state.scale - viewport.clientHeight);
      targetX = clamp(targetX, -maxX, maxX);
      targetY = clamp(targetY, -maxY, maxY);

      state.x = targetX;
      state.y = targetY;
    } else {
      // Reset to full view
      state.scale = MIN_SCALE;
      state.x = 0;
      state.y = 0;
    }

    applyTransform(img, state.scale, state.x, state.y);
    viewport.style.cursor = state.scale > MIN_SCALE ? 'grab' : 'default';
  });
}

function initGlobalPhotoModal() {
  document.body.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    if (!isZoomableImage(img)) return;
    e.preventDefault();
    openModal(img.src, img.alt || 'Photo');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalPhotoModal);
} else {
  initGlobalPhotoModal();
}
