/**
 * Globales Motion-System: Smooth Scroll (Lenis) + GSAP ScrollTrigger.
 * Alles respektiert `prefers-reduced-motion` – dann gibt es keine
 * Scroll-Animationen, Inhalte sind sofort sichtbar.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Smooth Scroll ---------- */
if (!reduceMotion) {
  const lenis = new Lenis({
    lerp: 0.11,
    smoothWheel: true,
    anchors: { offset: -88 },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as any).__lenis = lenis;
}

/* ---------- Text-Reveals ---------- */
function initSplits() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const onLoad = el.dataset.split === 'load';
    const delay = Number(el.dataset.delay ?? 0);
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, {
          yPercent: 115,
          rotate: 2,
          duration: 1.25,
          ease: 'expo.out',
          stagger: 0.09,
          delay,
          scrollTrigger: onLoad ? undefined : { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });
}

function initScrubText() {
  document.querySelectorAll<HTMLElement>('[data-scrub]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', wordsClass: 'word' });
    gsap.fromTo(
      split.words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: true },
      },
    );
  });
}

function initReveals() {
  const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  gsap.set(els, { autoAlpha: 0, y: 40 });
  ScrollTrigger.batch(els, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });
}

/* ---------- Zahlen hochzählen ---------- */
function initCounters() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const from = Number(el.dataset.from ?? 0);
    const decimals = Number(el.dataset.decimals ?? 0);
    const fmt = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: el.dataset.grouping !== 'false',
    });
    const state = { v: from };
    el.textContent = fmt.format(from);
    gsap.to(state, {
      v: to,
      duration: 2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = fmt.format(state.v)),
    });
  });
}

/* ---------- Parallax ---------- */
function initParallax() {
  document.querySelectorAll<HTMLElement>('[data-speed]').forEach((el) => {
    const speed = Number(el.dataset.speed);
    gsap.fromTo(
      el,
      { yPercent: -speed * 10 },
      {
        yPercent: speed * 10,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

/* ---------- Laufband (beschleunigt beim Scrollen) ---------- */
function initMarquees() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) => {
    const track = el.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;
    const dir = el.dataset.marquee === 'reverse' ? 1 : -1;
    const loop = gsap.fromTo(
      track,
      { xPercent: dir === -1 ? 0 : -50 },
      { xPercent: dir === -1 ? -50 : 0, duration: Number(el.dataset.duration ?? 40), ease: 'none', repeat: -1 },
    );
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
        gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.2, ease: 'power2.out' });
      },
    });
  });
}

/* ---------- Magnetische Buttons ---------- */
function initMagnetic() {
  if (!finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic || 0.35);
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* ---------- Start ---------- */
if (!reduceMotion) {
  // Schriften abwarten, damit Zeilenumbrüche korrekt gesplittet werden
  document.fonts.ready.then(() => {
    initSplits();
    initScrubText();
    initReveals();
    initCounters();
    initParallax();
    initMarquees();
    initMagnetic();
    root.classList.add('motion-ready');
    ScrollTrigger.refresh();
  });
} else {
  root.classList.add('motion-ready');
}

// Nach dem Laden aller Bilder Positionen neu berechnen
window.addEventListener('load', () => ScrollTrigger.refresh());

export { gsap, ScrollTrigger, reduceMotion, finePointer };
