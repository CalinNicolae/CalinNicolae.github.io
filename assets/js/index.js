import { rotatingSub, glitchOnce } from './terminal.js';

function revealHero(bootEl, heroEl, nameEl, typeEl) {
  bootEl.classList.add('hidden');
  setTimeout(() => {
    heroEl.style.opacity = '1';
    heroEl.style.pointerEvents = 'auto';
    heroEl.style.animation = 'heroFadeIn 0.5s ease forwards';
    glitchOnce(nameEl, 800);
    rotatingSub(typeEl, [
      'Cybersecurity Graduate',
      'Capture The Flag Player',
      'Penetration Tester',
      'Ethical Hacker',
      'System Defender',
      'Dedicated Gamer',
      'Security Researcher',
      'The Honored One',
    ]);
  }, 1000);
}

function runBootSequence() {
  const bootEl = document.getElementById('boot-terminal');
  const heroEl = document.getElementById('hero-content');
  const nameEl = document.getElementById('hero-name');
  const typeEl = document.getElementById('typewriter-text');
  bootEl.style.display = 'none';
  heroEl.style.opacity = '1';
  heroEl.style.pointerEvents = 'auto';
  revealHero(bootEl, heroEl, nameEl, typeEl);
}

runBootSequence();
