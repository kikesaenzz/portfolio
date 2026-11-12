// Pantalla de carga: un mini pipeline.
// Paquetes que cambian de forma al pasar por Datos, API, Automatiza e IA, mientras el
// nombre se "compila" letra a letra. El porcentaje espera a que carguen fuentes y
// recursos de verdad. Al 100 % un círculo naranja cubre todo y se levanta como cortina.

import { gsap } from 'gsap';

const GLYPHS = '01{}<>/;=#&%+*';
const MESSAGES = ['Leyendo datos', 'Llamando a la API', 'Automatizando', 'Aplicando IA', 'Listo'];
const THRESHOLDS = [0.14, 0.42, 0.7, 0.97];
const MIN_DESKTOP = 4400;
const MIN_SMALL = 3400; // en móvil la espera es algo más corta
const MAX_MS = 9000;

export function runLoader(): Promise<void> {
  return new Promise((resolve) => {
    const loader = document.getElementById('loader');
    if (!loader) { resolve(); return; }

    const finishNow = () => { loader.remove(); resolve(); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finishNow(); return; }

    const title = loader.querySelector<HTMLElement>('#ld-title')!;
    const fill = loader.querySelector<HTMLElement>('#ld-fill')!;
    const host = loader.querySelector<HTMLElement>('#ld-packets')!;
    const pctEl = loader.querySelector<HTMLElement>('#ld-pct')!;
    const msgEl = loader.querySelector<HTMLElement>('#ld-msg')!;
    const wipe = loader.querySelector<HTMLElement>('#ld-wipe')!;
    const curtain = loader.querySelector<HTMLElement>('#ld-curtain')!;
    const small = matchMedia('(max-width: 700px)').matches;
    const minMs = small ? MIN_SMALL : MIN_DESKTOP;
    const nodes = Array.from(loader.querySelectorAll<HTMLElement>('.ld-node'));
    const inner = loader.querySelector<HTMLElement>('.ld-inner')!;

    /* ---- nombre que se compila ---- */
    const text = title.dataset.text || title.textContent || '';
    title.textContent = '';
    const chars = Array.from(text).map((c) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c === ' ' ? ' ' : c;
      title.appendChild(s);
      return s;
    });
    const measure = () => chars.forEach((s) => { s.style.minWidth = ''; s.style.minWidth = s.getBoundingClientRect().width + 'px'; s.style.textAlign = 'center'; });
    measure();
    document.fonts && document.fonts.ready.then(measure).catch(() => {});

    /* ---- paquetes ---- */
    const packets: HTMLElement[] = [];
    const radius = [3, 8, 2, 8];
    const rot = [0, 0, 45, 0];
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.className = 'ld-packet';
      host.appendChild(p);
      packets.push(p);
      let stage = -1;
      gsap.to(p, {
        x: () => host.clientWidth - 16,
        duration: 2.6,
        ease: 'none',
        repeat: -1,
        delay: i * 0.32,
        onUpdate() {
          const f = this.progress();
          p.style.opacity = String(f < 0.05 ? f / 0.05 : f > 0.95 ? (1 - f) / 0.05 : 1);
          const s = Math.min(3, Math.floor(f * 4));
          if (s !== stage) {
            stage = s;
            gsap.to(p, { borderRadius: radius[s], rotation: rot[s], duration: 0.25, overwrite: 'auto' });
          }
        },
      });
    }

    /* ---- progreso real ---- */
    let ready = false;
    Promise.all([
      document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve(),
      new Promise<void>((r) => (document.readyState === 'complete' ? r() : addEventListener('load', () => r(), { once: true }))),
    ]).then(() => { ready = true; });

    const start = performance.now();
    let shown = 0;
    let lastScramble = 0;
    let done = false;

    const render = (now: number) => {
      if (done) return;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / minMs);
      const eased = 1 - Math.pow(1 - t, 2.4);
      const target = ready ? eased : Math.min(eased, 0.9);
      shown = Math.max(shown, target);

      pctEl.textContent = String(Math.round(shown * 100));
      fill.style.transform = `scaleX(${shown})`;
      nodes.forEach((n, i) => n.classList.toggle('on', shown >= THRESHOLDS[i]));
      const msgIndex = THRESHOLDS.filter((th) => shown >= th).length;
      if (msgEl.textContent !== MESSAGES[msgIndex]) msgEl.textContent = MESSAGES[msgIndex];

      if (now - lastScramble > 110) {
        lastScramble = now;
        const settled = Math.floor(shown * chars.length * 1.04);
        chars.forEach((s, i) => {
          if (i < settled || text[i] === ' ') {
            if (s.dataset.r) { s.textContent = text[i] === ' ' ? ' ' : text[i]; s.classList.remove('rnd'); delete s.dataset.r; }
          } else {
            s.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            s.classList.add('rnd');
            s.dataset.r = '1';
          }
        });
      }

      if ((ready && t >= 1) || elapsed > MAX_MS) {
        done = true;
        pctEl.textContent = '100';
        fill.style.transform = 'scaleX(1)';
        nodes.forEach((n) => n.classList.add('on'));
        msgEl.textContent = MESSAGES[4];
        chars.forEach((s, i) => { s.textContent = text[i] === ' ' ? ' ' : text[i]; s.classList.remove('rnd'); });
        close();
        return;
      }
      requestAnimationFrame(render);
    };

    /* ---- salida: círculo naranja que cubre y se levanta ---- */
    const close = () => {
      // Todo con transform (se anima en la GPU): círculo que crece y cortina que sube
      gsap.timeline({ delay: small ? 0.7 : 1 }) // pausa con el nombre ya completo para poder leerlo
        .to(inner, { scale: 1.04, duration: 0.5, ease: 'power2.in' }, 0)
        .to(wipe, { scale: 1, duration: 1.1, ease: 'power3.inOut' }, 0)
        .add(() => {
          packets.forEach((p) => gsap.killTweensOf(p));
          inner.style.visibility = 'hidden';
          loader.style.background = 'transparent';
          wipe.style.visibility = 'hidden';
          gsap.set(curtain, { visibility: 'visible', yPercent: 0 });
          resolve(); // main quita is-loading y arranca la intro mientras sube la cortina
        })
        .to(curtain, { yPercent: -100, duration: 1.2, ease: 'power4.inOut' }, '+=0.1')
        .add(() => loader.remove());
    };

    requestAnimationFrame(render);
  });
}
