function relatedCardHTML(post) {
  return `
    <a class="featured-card" href="./post.html?id=${post.id}">
      <span class="tag">[${post.category}]</span>
      <h3 class="featured-card-title">${post.title}</h3>
      <span class="featured-card-date">${post.date}</span>
      <p class="featured-card-excerpt">${post.excerpt}</p>
      <div class="featured-card-footer">&gt;&gt; READ MORE <span class="featured-card-arrow">→</span></div>
    </a>`;
}

function getPostId() {
  return new URLSearchParams(window.location.search).get('id');
}

function show404(id) {
  document.getElementById('main').style.display = 'none';
  document.getElementById('post-404').style.display = 'flex';
  document.getElementById('err-line-1').textContent = '> ERROR: POST_NOT_FOUND';
  document.getElementById('err-line-2').textContent = `> id: ${id}`;
}

function updatePageMeta(post) {
  document.title = `${post.title} — Portfolio`;
  document.querySelector('meta[name="description"]').content = post.excerpt;
}

function renderHeader(post) {
  document.getElementById('post-header').style.display = '';
  document.getElementById('post-category').textContent = `[${post.category}]`;
  if (post.required) document.getElementById('required-badge').style.display = '';
  document.getElementById('post-title').textContent = post.title;
  const parts = [post.date];
  if (post.readTime)  parts.push(post.readTime);
  if (post.wordCount) parts.push(`${post.wordCount} words`);
  document.getElementById('post-meta').textContent = parts.join(' · ');
}

function renderCover(post) {
  if (!post.coverImage) return;
  document.getElementById('post-cover').style.display = '';
  const img = document.getElementById('cover-img');
  img.src = post.coverImage;
  img.alt = post.coverCaption || post.title;
  if (post.coverCaption) {
    document.getElementById('cover-caption').textContent = `// ${post.coverCaption}`;
  }
}

function renderSpeaker(post) {
  if (!post.speakerName) return;
  document.getElementById('speaker-card').style.display = '';
  document.getElementById('speaker-name').textContent = post.speakerName;
  document.getElementById('speaker-bio').textContent  = post.speakerBio || '';
}

async function renderBody(post) {
  const bodyEl = document.getElementById('post-body');
  try {
    const r = await fetch(post.content);
    bodyEl.innerHTML = await r.text();
    bodyEl.querySelectorAll('pre').forEach(pre => {
      if (!pre.hasAttribute('data-filename')) pre.setAttribute('data-filename', 'code');
    });
  } catch {
    bodyEl.innerHTML = '<p style="color:var(--text-dim);font-family:var(--font-mono)">Content not available yet.</p>';
  }
}

function renderVerdict(post) {
  if (typeof post.wouldAttendAgain !== 'boolean') return;
  document.getElementById('post-verdict').style.display = '';
  document.getElementById('verdict-text').innerHTML = post.wouldAttendAgain
    ? 'Would attend again: <span class="verdict-yes">YES ✓</span>'
    : 'Would attend again: <span class="verdict-no">NO ✗</span>';
}

function renderGallery(post) {
  if (!post.gallery || post.gallery.length === 0) return;
  document.getElementById('gallery-section').style.display = '';
  document.getElementById('gallery-grid').innerHTML = post.gallery.map(img =>
    `<figure>
      <img src="${img.src}" alt="${img.caption}" loading="lazy">
      <figcaption>${img.caption}</figcaption>
    </figure>`
  ).join('');
}

function pickRelated(posts, post) {
  const sameCat = posts.filter(p => p.category === post.category && p.id !== post.id);
  const others  = [...posts]
    .filter(p => p.id !== post.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter(p => !sameCat.find(r => r.id === p.id));
  return [...sameCat, ...others].slice(0, 3);
}

function renderRelated(posts, post) {
  const related = pickRelated(posts, post);
  if (related.length === 0) return;
  document.getElementById('related-section').style.display = '';
  document.getElementById('related-label').textContent = `> related_posts --category [${post.category}]`;
  document.getElementById('related-grid').innerHTML = related.map(relatedCardHTML).join('');
}

function updateScrollBar() {
  const el  = document.documentElement;
  const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
  document.getElementById('scroll-bar').style.width = pct + '%';
}

async function loadPost() {
  const id = getPostId();
  if (!id) { show404('(none)'); return; }

  let posts, post;
  try {
    const res = await fetch('./data/posts.json');
    posts = await res.json();
    post  = posts.find(p => p.id === id);
  } catch {
    show404(id); return;
  }

  if (!post) { show404(id); return; }

  updatePageMeta(post);
  renderHeader(post);
  renderCover(post);
  renderSpeaker(post);
  await renderBody(post);
  renderVerdict(post);
  renderGallery(post);
  renderRelated(posts, post);
}

window.addEventListener('scroll', updateScrollBar, { passive: true });
loadPost();
