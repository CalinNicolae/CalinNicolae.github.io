# Calin Mihai Nicolae personal portfolio

Personal e-portfolio and blog built for both personal use and the Howest Professional Networking
module (2025–2026). Covers attended events, hackathons, security research,
and professional development as a Cybersecurity student.

## Live Site
> https://calinnicolae.github.io/

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript (ES6 modules)
- No frameworks, no build tools, no dependencies
- Hosted on GitHub Pages

## Project Structure
```
portfolio/
├── index.html          Homepage
├── blog.html           Blog listing
├── post.html           Single post template (reads ?id= from URL)
├── about.html          About & CV
├── 404.html            Custom 404 page
├── style.css           Global design system
├── terminal.js         Typewriter & glitch animations
├── transitions.js      Page transition system
├── data/posts.json     Blog post metadata
├── post-content/       Post body HTML files
└── assets/images/      Photos and media
```

## Adding a New Post
1. Add an entry to `data/posts.json` with a unique `id`
2. Create the body content in `post-content/[id].html`
3. Add images to `assets/images/`
4. Commit and push — GitHub Pages deploys automatically

## Module Context
Built for the Howest Professional Networking module (Gene Vangampelaere).
E-portfolio section counts for 60% of the module grade.
