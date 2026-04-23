const CHARSET = '░▒▓█▄▌▐─│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌';

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export function typeText(element, text, speed = 60) {
  return new Promise(resolve => {
    let i = 0;
    function tick() {
      if (i < text.length) {
        element.textContent += text[i++];
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    }
    tick();
  });
}

export function deleteText(element, speed = 30) {
  return new Promise(resolve => {
    function tick() {
      if (element.textContent.length > 0) {
        element.textContent = element.textContent.slice(0, -1);
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    }
    tick();
  });
}

export async function rotatingSub(element, strings, typeSpeed = 60, deleteSpeed = 30, pause = 2000) {
  let stopped = false;
  let idx = 0;

  async function cycle() {
    while (!stopped) {
      await typeText(element, strings[idx % strings.length], typeSpeed);
      await delay(pause);
      if (stopped) break;
      await deleteText(element, deleteSpeed);
      if (stopped) break;
      idx++;
    }
  }

  cycle();
  return () => { stopped = true; };
}

function appendLine(container, text, className) {
  const div = document.createElement('div');
  if (className) div.className = className;
  container.appendChild(div);
  return typeText(div, text, 42);
}

export function terminalBoot(container, lines, lineDelay = 300) {
  return lines.reduce((chain, line) => {
    return chain
        .then(() => appendLine(container, line.text, line.className))
        .then(() => delay(lineDelay));
  }, Promise.resolve());
}

function glitchFrame(element, original, startTime, duration) {
  return function frame(now) {
    if (now - startTime >= duration) {
      element.textContent = original;
      return;
    }
    const chars = Array.from(original).map(c => {
      if (c === ' ' || Math.random() >= 0.35) return c;
      return CHARSET[Math.floor(Math.random() * CHARSET.length)];
    });
    element.textContent = chars.join('');
    requestAnimationFrame(frame);
  };
}

export function glitchOnce(element, duration = 800) {
  const original = element.textContent;
  requestAnimationFrame(glitchFrame(element, original, performance.now(), duration));
}

export function createCursor() {
  const span = document.createElement('span');
  span.className = 'cursor';
  span.textContent = '|';
  span.style.cssText = 'animation: blink 1s step-end infinite; color: var(--neon-cyan);';
  return span;
}
