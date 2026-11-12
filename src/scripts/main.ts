// Orquestación del portfolio: scroll suave, escenas fijadas, revelados y navegación.
// Todo anima solo transform y opacity (rápido en GPU). Con "reducir movimiento" el
// contenido se muestra tal cual, sin escenas ni revelados.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { runLoader } from './loader';
import { initTheme } from './theme';
import { initPrism } from './prism';

gsap.registerPlugin(ScrollTrigger, SplitText);
// En móvil la barra del navegador aparece y desaparece al deslizar: no recalcular en cada cambio
ScrollTrigger.config({ ignoreMobileResize: true });

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;
const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel);
const $$ = <T extends HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

/* ----------------------------------------------------------- scroll suave */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.stop();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
function goTo(target: HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target as never, { duration: 1.5, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target });
  } else {
    target.scrollIntoView();
  }
}

/* ------------------------------------------------------------- navegación */
const indexEl = $('#index')!;
const openBtn = $('#index-open')!;
const closeBtn = $('#index-close')!;
let indexOpen = false;

gsap.set(indexEl, { yPercent: -100 });
const indexTl = gsap.timeline({ paused: true, onReverseComplete: () => { indexEl.style.visibility = 'hidden'; } });
indexTl
  .set(indexEl, { visibility: 'visible' })
  .fromTo(indexEl, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: 'power4.inOut' })
  .from('#index li', { yPercent: 60, autoAlpha: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out' }, '-=0.4');

function openIndex() {
  if (indexOpen) return;
  indexOpen = true;
  lenis?.stop();
  indexTl.timeScale(reduce ? 30 : 1).play();
  setTimeout(() => $<HTMLAnchorElement>('#index a')?.focus(), reduce ? 0 : 500);
}
function closeIndex() {
  if (!indexOpen) return;
  indexOpen = false;
  indexTl.timeScale(reduce ? 30 : 1.7).reverse();
  lenis?.start();
  openBtn.focus({ preventScroll: true });
}
openBtn.addEventListener('click', openIndex);
closeBtn.addEventListener('click', closeIndex);
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeIndex(); });

$$<HTMLAnchorElement>('a[data-nav]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = (a.getAttribute('href') || '').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (a.hasAttribute('data-close')) { indexOpen = false; indexTl.timeScale(reduce ? 30 : 1.7).reverse(); lenis?.start(); }
    goTo(el);
  });
});

/* -------------------------------------------------------------- utilidades */
const copyBtn = $<HTMLButtonElement>('#copy-mail');
copyBtn?.addEventListener('click', async () => {
  const mail = $<HTMLAnchorElement>('#mail')?.textContent?.trim() || '';
  try { await navigator.clipboard.writeText(mail); copyBtn.textContent = 'Copiado ✓'; }
  catch { copyBtn.textContent = 'Copia desde el enlace'; }
  setTimeout(() => { copyBtn.textContent = 'Copiar email'; }, 2000);
});

$$('.work-media').forEach((box) => {
  const img = box.querySelector('img');
  if (!img) return;
  const done = () => box.classList.add('loaded');
  if (img.complete && img.naturalWidth) done();
  else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
});

if (finePointer && !reduce) {
  $$('.magnetic').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    el.addEventListener('pointermove', (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

initTheme();
initPrism(document.getElementById('prism'), { idle: !reduce });

/* ------------------------------------------------------ animaciones de scroll */
let heroSplit: SplitText | null = null;
let introPlayed = false;

function buildAnimations() {
  // Hilo de flujo (rail) y barra de progreso
  const ids = $$('.rail li').map((li) => li.dataset.for!);
  const lis = $$('.rail li');
  const fill = $('.rail-fill');
  const setActive = (i: number) => lis.forEach((li, k) => { li.classList.toggle('active', k === i); li.classList.toggle('done', k < i); });
  // La sección activa se calcula con la posición REAL de cada sección en pantalla.
  // Así no depende de los espacios que añaden las escenas fijadas (pin) y nunca se desincroniza.
  const secEls = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
  let railQueued = false;
  const updateRail = () => {
    railQueued = false;
    const line = innerHeight * 0.55;
    let idx = 0;
    let prog = 0;
    secEls.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.top <= line) { idx = i; prog = Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height))); }
    });
    const atBottom = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    if (atBottom) { idx = secEls.length - 1; prog = 1; }
    setActive(idx);
    if (fill) gsap.set(fill, { scaleY: Math.min(1, idx >= ids.length - 1 ? 1 : (idx + prog) / (ids.length - 1)) });
  };
  // El hilo solo existe en pantallas anchas: en móvil no se calcula nada al deslizar
  const railMq = matchMedia('(min-width: 1100px)');
  const queueRail = () => { if (railMq.matches && !railQueued) { railQueued = true; requestAnimationFrame(updateRail); } };
  addEventListener('scroll', queueRail, { passive: true });
  addEventListener('resize', queueRail);
  ScrollTrigger.addEventListener('refresh', queueRail);
  queueRail();
  if (!reduce) {
    gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }

  if (reduce) {
    // Sin movimiento: nada fijado ni oculto, todo apilado y visible
    $('.cap')?.classList.add('static');
    $('.casos')?.classList.add('static');
    return;
  }

  // Titulares: cada línea sube desde una máscara
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', maskClass: 'split-mask', autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
      },
    });
  });

  // Frase de perfil: las palabras se van encendiendo al leer
  const statement = $('#statement');
  if (statement) {
    SplitText.create(statement, {
      type: 'words', autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(self.words, { opacity: 0.14 }, {
          opacity: 1, ease: 'none', stagger: 0.12,
          scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 52%', scrub: true },
        });
      },
    });
  }

  // Bloques que entran con un pequeño desplazamiento
  gsap.set('[data-fade]', { autoAlpha: 0, y: 36 });
  ScrollTrigger.batch('[data-fade]', {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.1 }),
  });

  // Viñetas de experiencia, una a una
  gsap.set('.job li', { autoAlpha: 0, y: 16 });
  ScrollTrigger.batch('.job li', {
    start: 'top 92%', once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.07 }),
  });

  // Stack: las etiquetas aparecen con un pequeño rebote
  gsap.set('.stack-g .chip', { autoAlpha: 0, scale: 0.7, y: 14 });
  ScrollTrigger.batch('.stack-g', {
    start: 'top 90%', once: true,
    onEnter: (groups) => groups.forEach((g, i) =>
      gsap.to(g.querySelectorAll('.chip'), { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.045, delay: i * 0.1, ease: 'back.out(1.7)' })),
  });

  /* ---- escenas fijadas (solo escritorio con altura suficiente) ---- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (min-height: 760px)', () => {
    // 02 Qué hago: cuatro áreas que cambian al deslizar
    const panels = $$('.cap-panel');
    const items = $$('.cap-item');
    const bar = $('.cap-bar i');
    if (panels.length) {
      gsap.set(panels, { autoAlpha: 0, y: 30 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0 });
      let active = 0;
      const show = (i: number) => {
        if (i === active) return;
        gsap.to(panels[active], { autoAlpha: 0, y: -26, duration: 0.35, ease: 'power2.in', overwrite: true });
        gsap.fromTo(panels[i], { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.12, ease: 'power3.out', overwrite: true });
        items.forEach((it, k) => it.classList.toggle('is-active', k === i));
        active = i;
      };
      ScrollTrigger.create({
        id: 'cap', trigger: '.cap-pin', start: 'top top',
        end: () => '+=' + Math.round(innerHeight * 0.7 * panels.length),
        pin: true, anticipatePin: 1,
        onUpdate: (self) => {
          show(Math.min(panels.length - 1, Math.floor(self.progress * panels.length)));
          if (bar) gsap.set(bar, { scaleY: self.progress });
        },
      });
    }

    // 04 Casos: recorrido horizontal
    const track = $('.casos-track');
    const cbar = $('.casos-bar i');
    if (track) {
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          id: 'casos', trigger: '.casos-pin', start: 'top top', end: () => '+=' + dist(),
          pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => { if (cbar) gsap.set(cbar, { scaleX: self.progress }); },
        },
      });
    }
    return () => { $('.cap')?.classList.remove('static'); $('.casos')?.classList.remove('static'); };
  });
  // Proyectos propios: tarjetas apiladas y parallax solo en pantallas anchas (en móvil, lista simple)
  mm.add('(min-width: 900px)', () => {
    $$('.work').forEach((w, i, all) => {
      const img = w.querySelector('img');
      if (img) gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom top', scrub: true } });
      if (i < all.length - 1) {
        gsap.to(w, { scale: 0.94, ease: 'none', scrollTrigger: { trigger: all[i + 1], start: 'top 85%', end: 'top 18%', scrub: true } });
      }
    });
  });
  mm.add('(max-width: 899px), (max-height: 759px)', () => {
    $('.cap')?.classList.add('static');
    $('.casos')?.classList.add('static');
  });
}

// Clic en un área: saltar al tramo de la escena
$$('.cap-item').forEach((it, k, all) => {
  it.addEventListener('click', () => {
    const st = ScrollTrigger.getById('cap');
    if (st) goTo(st.start + ((k + 0.5) / all.length) * (st.end - st.start));
  });
});

/* ----------------------------------------------------------- intro del hero */
function prepareHero() {
  const title = $('#hero-title');
  if (reduce) return;
  gsap.set('[data-intro]', { autoAlpha: 0, y: 28 });
  if (title) {
    SplitText.create(title, {
      type: 'lines,words', mask: 'lines', maskClass: 'split-mask', autoSplit: true,
      onSplit(self) {
        heroSplit = self;
        gsap.set(self.words, { yPercent: introPlayed ? 0 : 115 });
      },
    });
  }
}
function playHero() {
  introPlayed = true;
  if (reduce) return;
  if (heroSplit) gsap.to(heroSplit.words, { yPercent: 0, duration: 2, ease: 'expo.out', stagger: 0.16, delay: 0.7 });
  gsap.to('[data-intro]', { autoAlpha: 1, y: 0, duration: 1.3, ease: 'power3.out', stagger: 0.2, delay: 1.6 });
}

/* ------------------------------------------------------------------- arranque */
async function boot() {
  const loaderDone = runLoader();
  // No esperar a las fuentes más de 2,5 s: con una red lenta la página debe animarse igualmente
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]); } catch { /* continuar */ }
  prepareHero();
  buildAnimations();
  ScrollTrigger.sort(); // las escenas fijadas se crean después: reordenar por posición antes de medir
  await loaderDone;
  (window as unknown as { __appReady: boolean }).__appReady = true;
  root.classList.remove('is-loading');
  lenis?.start();
  ScrollTrigger.refresh();
  playHero();
}
boot();
