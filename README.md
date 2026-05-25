# Professional networking portfolio

This is my personal ePortfolio built for the Howest Professional Networking module (academic year 2025-2026). The site documents attendance at IT events, a hackathon, and other professional activities required by the module. It is hand-coded with HTML, CSS, and vanilla JavaScript. No framework, no build step, no dependencies. Hosted on GitHub Pages.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Live site](#live-site)
- [How to add a new post](#how-to-add-a-new-post)
- [Module requirements status](#module-requirements-status)

---

## Tech stack

| Layer           | Technology |
|-----------------|---|
| Markup          | HTML5, semantic and accessible |
| Styling         | CSS3 with custom properties, no preprocessor |
| Behaviour       | Vanilla JavaScript ES6 modules |
| Fonts           | Google Fonts: JetBrains Mono, Syne |
| Hosting         | GitHub Pages |
| Version control | Git, main branch |

---

## Live site
```
https://calinnicolae.github.io
```
---

## How to add a new post

1. Create a new HTML fragment in `post-content/` containing only the body content, no `<html>` or `<body>` tags.

2. Add a new object to `data/posts.json`. See the [posts.json documentation](./POSTS_JSON.md) for all available fields.

3. Add any cover or gallery images to `assets/images/`.

4. Commit and push. GitHub Pages rebuilds automatically within a minute or two.

No build step is required. The site reads `posts.json` at runtime.

---

## Module requirements status

| Requirement | Status |
|---|---|
| Website explanation post | Complete (how-this-site-was-built) |
| Minimum four physical event reflections | Complete (five events: Phishathon, .NET 10, IPv6, NATO, DeepSeek) |
| Podcast episode | Recorded and posted (IT-podcast) |
| LinkedIn profile enhancement reflection | Pending |
