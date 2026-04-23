import { terminalBoot, rotatingSub, glitchOnce } from './terminal.js';

function featuredCardHTML(post, delay) {
  return `
    <a class="featured-card" href="./post.html?id=${post.id}" style="animation-delay:${delay}ms">
      <span class="tag">[${post.category}]</span>
      <h3 class="featured-card-title">${post.title}</h3>
      <span class="featured-card-date">${post.date}</span>
      <p class="featured-card-excerpt">${post.excerpt}</p>
      <div class="featured-card-footer">&gt;&gt; READ MORE <span class="featured-card-arrow">→</span></div>
    </a>`;
}

function renderFeaturedPosts(posts) {
  const recent = [...posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  document.getElementById('featured-grid').innerHTML =
    recent.map((p, i) => featuredCardHTML(p, i * 80)).join('');
}

function showFeaturedError() {
  document.getElementById('featured-grid').innerHTML =
    '<p style="color:var(--text-dim);font-family:var(--font-mono)">Could not load posts.</p>';
}

async function loadFeaturedPosts() {
  try {
    const res = await fetch('./data/posts.json');
    renderFeaturedPosts(await res.json());
  } catch {
    showFeaturedError();
  }
}

function revealHero(bootEl, heroEl, nameEl, typeEl) {
  bootEl.classList.add('hidden');
  setTimeout(() => {
    heroEl.style.opacity = '1';
    heroEl.style.pointerEvents = 'auto';
    heroEl.style.animation = 'heroFadeIn 0.5s ease forwards';
    glitchOnce(nameEl, 800);
    rotatingSub(typeEl, [
      'Cybersecurity Student',
      'CTF Player',
      'Penetration Tester',
      'Security Researcher',
      'Ethical Hacker',
    ]);
  }, 350);
}

async function runBootSequence() {
  const bootEl = document.getElementById('boot-terminal');
  const bodyEl = bootEl.querySelector('.boot-terminal-body');
  const heroEl = document.getElementById('hero-content');
  const nameEl = document.getElementById('hero-name');
  const typeEl = document.getElementById('typewriter-text');

  await terminalBoot(bodyEl, [
    { text: '> Initializing profile...', className: 'boot-terminal-line' },
    { text: '> Loading credentials...',  className: 'boot-terminal-line' },
    { text: '> ACCESS GRANTED.',         className: 'boot-terminal-line boot-line-green' },
  ], 400);

  revealHero(bootEl, heroEl, nameEl, typeEl);
}

runBootSequence();
loadFeaturedPosts();
