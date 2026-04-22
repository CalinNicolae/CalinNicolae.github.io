/**
 * terminal.js  —  All terminal animation utilities.
 * Pure ES-module exports, no side-effects on import.
 */

/* ─────────────────────────────────────────────────────────
   1. typeText
   Types `text` into `element` character by character.
   Returns a Promise that resolves when complete.
───────────────────────────────────────────────────────── */
export function typeText(element, text, speed = 60) {
  return new Promise((resolve) => {
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

/* ─────────────────────────────────────────────────────────
   2. deleteText
   Removes characters from element.textContent one by one
   from the end. Returns a Promise.
───────────────────────────────────────────────────────── */
export function deleteText(element, speed = 30) {
  return new Promise((resolve) => {
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

/* ─────────────────────────────────────────────────────────
   3. rotatingSub
   Cycles through `strings` indefinitely:
     type → pause → delete → type next → …
   Returns a stop() function to halt the cycle cleanly.
───────────────────────────────────────────────────────── */
export function rotatingSub(
  element,
  strings,
  typeSpeed   = 60,
  deleteSpeed = 30,
  pause       = 2000
) {
  let stopped = false;
  let idx     = 0;

  async function cycle() {
    while (!stopped) {
      const s = strings[idx % strings.length];
      await typeText(element, s, typeSpeed);
      await new Promise(r => setTimeout(r, pause));
      if (stopped) break;
      await deleteText(element, deleteSpeed);
      if (stopped) break;
      idx++;
    }
  }

  cycle();
  return () => { stopped = true; };
}

/* ─────────────────────────────────────────────────────────
   4. terminalBoot
   Takes an array of { text, className } line objects.
   For each: creates a <div>, appends it, types the text,
   waits lineDelay ms, then moves to next.
   Returns a Promise that resolves when all lines are done.
───────────────────────────────────────────────────────── */
export function terminalBoot(containerElement, lines, lineDelay = 300) {
  return lines.reduce((chain, line) => {
    return chain.then(() => {
      const div = document.createElement('div');
      if (line.className) div.className = line.className;
      containerElement.appendChild(div);
      return typeText(div, line.text, 42)
        .then(() => new Promise(r => setTimeout(r, lineDelay)));
    });
  }, Promise.resolve());
}

/* ─────────────────────────────────────────────────────────
   5. glitchOnce
   For `duration` ms: replaces random characters with glitch
   symbols using requestAnimationFrame.
   Restores the exact original text after duration ms.
───────────────────────────────────────────────────────── */
export function glitchOnce(element, duration = 800) {
  const original  = element.textContent;
  const charset   = '░▒▓█▄▌▐─│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌';
  const startTime = performance.now();

  function frame(now) {
    if (now - startTime >= duration) {
      element.textContent = original;
      return;
    }
    const chars = Array.from(original);
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] !== ' ' && Math.random() < 0.35) {
        chars[i] = charset[Math.floor(Math.random() * charset.length)];
      }
    }
    element.textContent = chars.join('');
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

/* ─────────────────────────────────────────────────────────
   6. createCursor
   Returns a blinking cursor <span> element.
───────────────────────────────────────────────────────── */
export function createCursor() {
  const span = document.createElement('span');
  span.className = 'cursor';
  span.textContent = '|';
  span.style.cssText = 'animation: blink 1s step-end infinite; color: var(--neon-cyan);';
  return span;
}
