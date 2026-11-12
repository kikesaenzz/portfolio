// Rejilla en perspectiva de la portada (idea de Prism Grid, sin React ni framer-motion).
// Un solo elemento con la rejilla dibujada por CSS y, como mucho, unas pocas casillas
// iluminadas a la vez: coste mínimo y 60 fps.

const BOX = 64;
const PERSPECTIVE = 1000;
const YAW = -16;
const PITCH = 40;
const MAX_CELLS = 24;

// Punto de la pantalla -> punto del plano inclinado
function screenToPlane(sx: number, sy: number) {
  const a = (YAW * Math.PI) / 180;
  const b = (PITCH * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  const p = PERSPECTIVE;
  const a11 = p * ca - sx * sa * cb;
  const a12 = sx * sb;
  const a21 = p * sa * sb - sy * sa * cb;
  const a22 = p * cb + sy * sb;
  const det = a11 * a22 - a12 * a21;
  if (!isFinite(det) || Math.abs(det) < 1e-6) return null;
  const b1 = sx * p, b2 = sy * p;
  return { x: (b1 * a22 - a12 * b2) / det, y: (a11 * b2 - b1 * a21) / det };
}

export function initPrism(plane: HTMLElement | null, opts: { idle: boolean }) {
  if (!plane) return;
  const host = plane.parentElement as HTMLElement;
  const hero = host.closest('.hero') as HTMLElement;
  let cols = 0, rows = 0;
  let lastKey = '';
  let lastMove = 0;
  let visible = true;

  const size = () => {
    cols = Math.ceil(host.clientWidth / BOX) + 4;
    rows = Math.ceil(host.clientHeight / BOX) + 4;
    plane.style.width = cols * BOX + 'px';
    plane.style.height = rows * BOX + 'px';
  };
  size();
  window.addEventListener('resize', size);

  const palette = () => {
    const s = getComputedStyle(document.documentElement);
    return [s.getPropertyValue('--accent'), s.getPropertyValue('--accent-2'), s.getPropertyValue('--accent-soft'), s.getPropertyValue('--accent-strong')].map((c) => c.trim());
  };

  const light = (col: number, row: number) => {
    if (col < 0 || col >= cols || row < 0 || row >= rows) return;
    if (plane.childElementCount >= MAX_CELLS) return;
    const cell = document.createElement('div');
    cell.className = 'prism-cell';
    const colors = palette();
    cell.style.background = colors[Math.floor(Math.random() * colors.length)];
    cell.style.left = col * BOX + 'px';
    cell.style.top = row * BOX + 'px';
    cell.addEventListener('animationend', () => cell.remove(), { once: true });
    setTimeout(() => cell.remove(), 1400); // respaldo si la pestaña está en segundo plano
    plane.appendChild(cell);
  };

  hero.addEventListener('pointermove', (e: PointerEvent) => {
    lastMove = performance.now();
    const r = host.getBoundingClientRect();
    const pt = screenToPlane(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
    if (!pt) return;
    const col = Math.floor((pt.x + (cols * BOX) / 2) / BOX);
    const row = Math.floor((pt.y + (rows * BOX) / 2) / BOX);
    const key = col + ':' + row;
    if (key === lastKey) return;
    lastKey = key;
    light(col, row);
  });

  if (opts.idle) {
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(hero);
    setInterval(() => {
      if (!visible || document.hidden || performance.now() - lastMove < 2500) return;
      light(Math.floor(cols * (0.3 + Math.random() * 0.5)), Math.floor(rows * (0.2 + Math.random() * 0.6)));
    }, 900);
  }
}
