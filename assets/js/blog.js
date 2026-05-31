import { sortByDate } from './util.js';

let allPosts = [];
let activeCategories = new Set();

function coverHTML(post) {
  if (post.coverImage) {
    return `<div class="post-list-img-wrap">
      <img class="post-list-img" src="${post.coverImage}" alt="${post.title}" loading="lazy">
    </div>`;
  }
  return `<div class="post-list-no-img">[ NO IMG ]</div>`;
}

function postCardHTML(post, delay) {
  const requiredBadge = post.required ? `<span class="required-badge">[ REQUIRED ]</span>` : '';
  return `
    <a class="post-list-item" href="./post.html?id=${post.id}"
       style="animation-delay:${delay}ms" data-category="${post.category}">
      ${coverHTML(post)}
      <div class="post-list-content">
        <div class="post-list-meta">
          <span class="tag">[${post.category}]</span>
          ${requiredBadge}
          <span class="post-list-date">${post.date}</span>
        </div>
        <h2 class="post-list-title">${post.title}</h2>
        <p class="post-list-excerpt">${post.excerpt}</p>
        <div class="post-list-footer">
          <span class="post-list-read-time">${post.readTime || ''}</span>
          <span class="post-list-read-more">&gt;&gt; READ MORE <span class="post-list-arrow">→</span></span>
        </div>
      </div>
    </a>`;
}

function filterPosts() {
  if (activeCategories.size === 0 || activeCategories.has('ALL')) return allPosts;
  return allPosts.filter(p => activeCategories.has(p.category));
}

function renderPosts() {
  const listEl   = document.getElementById('post-list');
  const emptyEl  = document.getElementById('empty-state');
  const filtered = filterPosts();
  const sorted   = sortByDate(filtered);

  if (sorted.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';
  listEl.style.opacity   = '0';
  listEl.style.transform = 'scale(0.97)';
  listEl.style.transition = 'opacity 0.15s ease, transform 0.15s ease';

  setTimeout(() => {
    listEl.innerHTML = sorted.map((p, i) => postCardHTML(p, i * 80)).join('');
    listEl.style.opacity   = '1';
    listEl.style.transform = 'scale(1)';
  }, 150);
}

function onFilterClick(e) {
  const pill = e.target.closest('.filter-pill');
  if (!pill) return;

  const allPill = document.querySelector('.filter-pill[data-filter="ALL"]');

  const target = (pill.classList.contains('active') && pill.dataset.filter !== 'ALL')
    ? allPill
    : pill;

  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  target.classList.add('active');

  activeCategories.clear();
  activeCategories.add(target.dataset.filter);

  renderPosts();
}

function buildFilterBar(posts) {
  const bar = document.getElementById('filter-bar');
  const categories = ['ALL', ...new Set(posts.map(p => p.category))];
  bar.innerHTML = categories.map(cat =>
      `<button class="filter-pill ${cat === 'ALL' ? 'active' : ''}" data-filter="${cat}">[${cat}]</button>`
  ).join('');
  bar.addEventListener('click', onFilterClick);
}

function showLoadError() {
  document.getElementById('post-list').innerHTML =
      `<p style="color:var(--text-dim);font-family:var(--font-mono),sans-serif;padding:2rem">Could not load posts.</p>`;
}

async function init() {
  try {
    const res = await fetch('./data/posts.json');
    allPosts  = await res.json();
    buildFilterBar(allPosts);
    activeCategories.add('ALL');
    renderPosts();
  } catch {
    showLoadError();
  }
}

init();