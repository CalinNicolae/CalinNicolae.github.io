import { rotatingSub, glitchOnce } from './terminal.js';
//import terminalBoot;

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
      'Ethical Hacker',
      'System Defender',
      'Dedicated Gamer',
      'Security Researcher',
      'The Honored One',
    ]);
  }, 1000);
}

async function runBootSequence() {
  const bootEl = document.getElementById('boot-terminal');
  //const bodyEl = bootEl.querySelector('.boot-terminal-body');
  const heroEl = document.getElementById('hero-content');
  const nameEl = document.getElementById('hero-name');
  const typeEl = document.getElementById('typewriter-text');
  bootEl.style.display = 'none';
  heroEl.style.opacity = '1';
  heroEl.style.pointerEvents = 'auto';
  // await terminalBoot(bodyEl, [
  //   { text: '> Initializing profile...', className: 'boot-terminal-line' },
  //   { text: '> Loading variables...',  className: 'boot-terminal-line' },
  //   { text: '> SUCCESS...',         className: 'boot-terminal-line boot-line-green' },
  // ], 400);

  revealHero(bootEl, heroEl, nameEl, typeEl);
}

runBootSequence();
