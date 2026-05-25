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
  document.title = post.title;
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
    bodyEl.innerHTML = '<p style="color:var(--text-dim);font-family:var(--font-mono),sans-serif">Content not available yet.</p>';
  }
}

function renderGallery(post) {
  if (!post.gallery || post.gallery.length === 0) return;
  document.getElementById('gallery-section').style.display = '';
  document.getElementById('gallery-grid').innerHTML = post.gallery.map(img =>
    `<figure>
      <img src="${img.src}" alt="${img.caption}" loading="lazy">
    </figure>`
  ).join('');
}

function parseDate(dateStr) {
  if (!dateStr) return new Date(0);
  const parts = dateStr.split('/');
  if (parts.length !== 3) return new Date(dateStr);
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}
function sortByDate(posts) {
  return [...posts].sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

function renderPrevNext(currentPost, allPostsSorted) {
  const currentIndex = allPostsSorted.findIndex(p => p.id === currentPost.id);
  if (currentIndex === -1) return;

  const prevPost = currentIndex > 0 ? allPostsSorted[currentIndex - 1] : null;
  const nextPost = currentIndex < allPostsSorted.length - 1 ? allPostsSorted[currentIndex + 1] : null;

  const prevLink = document.getElementById('prev-post-link');
  const nextLink = document.getElementById('next-post-link');

  if (prevPost) {
    prevLink.href = `./post.html?id=${prevPost.id}`;
    prevLink.style.display = 'inline-block';
  } else {
    prevLink.style.display = 'none';
  }

  if (nextPost) {
    nextLink.href = `./post.html?id=${nextPost.id}`;
    nextLink.style.display = 'inline-block';
  } else {
    nextLink.style.display = 'none';
  }

  const section = document.getElementById('post-navigation-section');
  if (prevPost || nextPost) {
    section.style.display = 'block';
  } else {
    section.style.display = 'none';
  }
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
  renderGallery(post);
  const sortedPosts = sortByDate(posts);
  renderPrevNext(post, sortedPosts);
}

window.addEventListener('scroll', updateScrollBar, { passive: true });
loadPost();
