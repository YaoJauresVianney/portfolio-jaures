'use client';

import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type Lenis from 'lenis';
import { useLenis } from 'lenis/react';
import { addFx, EASES } from './fx';
import { SCENES } from './scenes';
import { TRANSITIONS } from './transitions';

gsap.registerPlugin(ScrollTrigger, useGSAP);
// Phone toolbars resize the viewport while scrolling; re-measuring then would make the film jump.
ScrollTrigger.config({ ignoreMobileResize: true });

type Timing = { len: number; hold?: [number, number]; pan?: [number, number] };

// Scroll length of each scene's own animation, in screen heights (1 = 100vh), and its reading holds
// (share of `len` at its start / end). Each scene after the first enters through a 1-screen transition.
// pan (phone): window of the scene's progress during which a scene taller than the screen scrolls up.
// The totals (desktop 18.8, phone 17.6) are mirrored in motion.css for the instant before this runs.
const TIMING: Record<'desktop' | 'mobile', Record<string, Timing>> = {
  desktop: {
    hero: { len: 0.8 },
    cases: { len: 5.2, hold: [0.04, 0.12] },
    services: { len: 2, hold: [0, 0.2] },
    stack: { len: 1.6, hold: [0, 0.25] },
    method: { len: 2.4, hold: [0, 0.18] },
    contact: { len: 1.8, hold: [0, 0.15] },
  },
  mobile: {
    hero: { len: 0.6, pan: [0.05, 0.85] },
    cases: { len: 4, hold: [0.04, 0.12] },
    services: { len: 2.4, hold: [0, 0.15], pan: [0.5, 0.9] },
    stack: { len: 1.2, hold: [0, 0.25], pan: [0.3, 0.8] },
    method: { len: 2.8, hold: [0, 0.15], pan: [0.3, 0.95] },
    contact: { len: 1.6, hold: [0, 0.15], pan: [0.3, 0.85] },
  },
};
const TRANSITION = 1;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Builds the scroll-driven film for one layout and returns its cleanup. */
function film(root: HTMLElement, lenis: Lenis, mobile: boolean) {
  document.documentElement.dataset.film = 'ready'; // film layout first: everything below measures it
  const timing = TIMING[mobile ? 'mobile' : 'desktop'];
  const scenes = gsap.utils.toArray<HTMLElement>('[data-scene]', root);
  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  const shown = new Map<HTMLElement, [number, number]>(); // timeline span during which a scene is on screen
  const measures: (() => void)[] = [];
  const cleanups: (() => void)[] = [];
  let t = 0;

  // Scenes taller than the screen shrink to fit under the menu (phone: to 92% at most, then pan down).
  // Measured now and on every refresh; the tweens read these values through functions, so a refresh
  // (which rewinds the timeline) re-applies them.
  const fits = new Map(
    scenes
      .filter((s) => s.dataset.scene !== 'cases')
      .map((s) => [s, { stageIn: s.querySelector<HTMLElement>('.stage-in')!, fit: 1, ov: 0 }]),
  );
  const fit = () => {
    const avail = innerHeight - (mobile ? 112 : 136);
    for (const f of fits.values()) {
      const h = f.stageIn.offsetHeight;
      f.fit = mobile ? Math.max(0.92, Math.min(1, avail / h)) : Math.min(1, avail / h);
      f.ov = mobile ? Math.max(0, Math.round(h * f.fit - avail)) : 0;
      f.stageIn.parentElement!.classList.toggle('pan', f.ov > 0);
    }
  };
  fit();
  measures.push(fit);

  scenes.forEach((scene, i) => {
    const id = scene.dataset.scene!;
    const { len, hold: [hs, he] = [0, 0], pan } = timing[id];
    const enter = t;
    if (i > 0) {
      TRANSITIONS[id](tl, scenes[i - 1], scene, t, mobile);
      t += TRANSITION;
      // Once covered, the previous scene leaves (as a scrolled-away section would): the backdrop, not an
      // old scene, shows behind the next 3D transition. Opacity, not visibility: its links stay focusable.
      tl.set(scenes[i - 1], { opacity: 0 }, t);
    }
    tl.addLabel(id, t);
    // The scene's own progress p runs 0 → 1 between its holds.
    const p0 = t + len * hs;
    const pLen = len * (1 - hs - he);

    for (const el of scene.querySelectorAll<HTMLElement>('[data-fx]')) {
      const { at, atM, src, ease, easeM, axis } = el.dataset;
      const win = (mobile && atM) || at;
      // Skipped: intro-only (CSS), card-driven (scenes.ts) and hidden-at-this-size elements.
      if (!win || axis || !el.getClientRects().length) continue;
      const [a, b] = win.split(' ').map(Number);
      // data-src="e": the window is read on the entry transition instead of the scene's progress.
      const [start, span] =
        src === 'e' ? [enter + a * TRANSITION, (b - a) * TRANSITION] : [p0 + a * pLen, (b - a) * pLen];
      const fx = { mobile, ease: EASES[(mobile && easeM) || ease || 'out'], rev: 'rev' in el.dataset };
      addFx(tl, el, el.dataset.fx!, fx, start, span);
    }

    const pat = scene.querySelector('.pat');
    if (pat) tl.fromTo(pat, { y: 0 }, { y: mobile ? -60 : -90, duration: pLen }, p0);

    const f = fits.get(scene);
    if (f && pan) {
      const [a, b] = pan;
      tl.fromTo(f.stageIn, { y: 0 }, { y: () => -f.ov, ease: smoothstep, duration: (b - a) * pLen }, p0 + a * pLen);
    }
    SCENES[id]?.({
      tl,
      el: scene,
      mobile,
      p0,
      pLen,
      measure: (fn) => measures.push(fn),
      cleanup: (fn) => cleanups.push(fn),
    });
    shown.set(scene, [i ? enter : 0, t + len + (i < scenes.length - 1 ? TRANSITION : 0)]);
    t += len;
  });
  // The fit scale holds for the whole film (a tween, not a set, so it renders at every scroll position).
  for (const f of fits.values()) tl.fromTo(f.stageIn, { scale: () => f.fit }, { scale: () => f.fit, duration: t }, 0);
  tl.set({}, {}, t); // the timeline lasts exactly the film length, holds included
  const measure = () => measures.forEach((fn) => fn());
  measure();
  ScrollTrigger.addEventListener('refreshInit', measure);

  root.style.setProperty('--len', String(t));
  const st = ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    animation: tl,
    invalidateOnRefresh: true,
  });

  // Scroll position of a scene's label. Not st.labelToScroll(): with the film starting at the very top
  // (start = 0, falsy) it refreshes the trigger on every call, which desyncs it from the timeline and
  // leaves an instant jump (keyboard focus, #hash) showing the wrong scene.
  const go = (scene: HTMLElement, immediate = false) =>
    lenis.scrollTo(st.start + (tl.labels[scene.dataset.scene!] / tl.duration()) * (st.end - st.start), {
      immediate,
    });
  const sceneOf = (hash: string) => {
    const el = hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    return el?.dataset.scene && root.contains(el) ? el : null;
  };
  // Anchor links (#cas, #services…) scroll to their scene's label rather than to the section's DOM position.
  const onClick = (e: MouseEvent) => {
    const scene = sceneOf((e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')?.hash ?? '');
    if (!scene) return;
    e.preventDefault();
    go(scene);
  };
  // Keyboard users tabbing into a scene that is off screen are taken to it.
  const onFocus = (e: FocusEvent) => {
    const scene = (e.target as Element).closest<HTMLElement>('[data-scene]');
    const span = scene && shown.get(scene);
    if (span && (tl.time() < span[0] || tl.time() > span[1])) go(scene!, true);
  };
  document.addEventListener('click', onClick);
  root.addEventListener('focusin', onFocus);
  // A shared link with #contact lands on its scene, once ScrollTrigger has measured the page.
  const target = sceneOf(location.hash);
  const jump = () => {
    ScrollTrigger.removeEventListener('refresh', jump);
    go(target!, true);
  };
  if (target) ScrollTrigger.addEventListener('refresh', jump);

  return () => {
    document.removeEventListener('click', onClick);
    root.removeEventListener('focusin', onFocus);
    ScrollTrigger.removeEventListener('refreshInit', measure);
    ScrollTrigger.removeEventListener('refresh', jump);
    cleanups.forEach((fn) => fn());
    for (const f of fits.values()) f.stageIn.parentElement!.classList.remove('pan');
    root.style.removeProperty('--len');
    delete document.documentElement.dataset.film;
  };
}

/** The pinned film: every scene stacked in one sticky frame, driven by a single scroll-scrubbed timeline. */
export function FilmProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!lenis) return;
      // GSAP's ticker drives Lenis, and every smoothed scroll frame updates ScrollTrigger.
      // Kept outside the media queries: with autoRaf off, Lenis needs these frames even in reduced motion.
      const off = lenis.on('scroll', ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      gsap.matchMedia().add(
        {
          desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => film(ref.current!, lenis, Boolean(ctx.conditions?.mobile)),
      );
      document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        off();
        gsap.ticker.remove(raf);
      };
    },
    { dependencies: [lenis], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className="film">
      <div className="frame">{children}</div>
    </div>
  );
}
