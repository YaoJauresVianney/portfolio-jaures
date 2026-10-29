import { gsap } from 'gsap';

/** Adds the 1-screen transition from `prev` to `next` to `tl`, starting at `at` (both scenes animate at once). */
type Transition = (tl: gsap.core.Timeline, prev: HTMLElement, next: HTMLElement, at: number, mobile: boolean) => void;

const stage = (scene: HTMLElement) => scene.querySelector<HTMLElement>('.stage')!;
const shade = (scene: HTMLElement) => scene.querySelector<HTMLElement>('.cube-shade')!;
// A face of a cube whose centre sits half a screen behind the screen (reference: translateZ(−50vh) … translateZ(50vh)).
const cubeAxis = () => `50% 50% ${-innerHeight / 2}px`;
// 4x(1 − x): 0 at both ends, 1 halfway — the reference's x(1 − x) recede, normalised.
const arc = (x: number) => 4 * x * (1 - x);

// Transitions keyed by the incoming scene, translated from the references' `.cine .sc-* .stage` rules
// (x = exit progress of the outgoing scene, e = entry progress of the incoming one, both linear in scroll).
export const TRANSITIONS: Record<string, Transition> = {
  // Hero → case studies: the camera pulls back from the hero (f = x(2 − x), a quadratic ease-out)
  // while the case studies open in a circle from where the photo stands (e², a quadratic ease-in).
  cases: (tl, prev, next, at, mobile) => {
    const out = stage(prev);
    const shadow = mobile ? '0 30px 60px' : '0 40px 90px';
    tl.fromTo(
      out,
      {
        transformPerspective: mobile ? 900 : 1400,
        transformOrigin: mobile ? '50% 24%' : '70% 50%',
        z: 0,
        rotationX: 0,
      },
      { z: mobile ? -560 : -900, rotationX: 8, ease: 'power1.out', duration: 1 },
      at,
    );
    tl.fromTo(
      out,
      { borderRadius: 0, opacity: 1, boxShadow: `${shadow} rgba(20,14,8,0)` },
      { borderRadius: mobile ? 32 : 48, opacity: 0.65, boxShadow: `${shadow} rgba(20,14,8,0.35)`, duration: 1 },
      at,
    );
    const centre = mobile ? '50% 26%' : '70% 50%';
    tl.fromTo(
      stage(next),
      { clipPath: `circle(0% at ${centre})` },
      { clipPath: `circle(${mobile ? 120 : 110}% at ${centre})`, ease: 'power1.in', duration: 1 },
      at,
    );
  },

  // Case studies → services: a cube turning upward. The case studies tip back (front face → top) while
  // services come up as the face below; both faces darken while they turn.
  services: (tl, prev, next, at, mobile) => {
    const perspective = mobile ? 1200 : 2000;
    tl.fromTo(
      stage(prev),
      { transformPerspective: perspective, transformOrigin: cubeAxis, rotationX: 0 },
      { rotationX: 90, duration: 1 },
      at,
    );
    tl.fromTo(
      stage(next),
      { transformPerspective: perspective, transformOrigin: cubeAxis, rotationX: -90 },
      { rotationX: 0, duration: 1 },
      at,
    );
    tl.fromTo(shade(prev), { opacity: 0 }, { opacity: 0.5, duration: 1 }, at);
    tl.fromTo(shade(next), { opacity: 0.5 }, { opacity: 0, duration: 1 }, at);
  },

  // Services → stack: a horizontal wipe, while services drift up (14vh, phone 10vh) and fade to half.
  stack: (tl, prev, next, at, mobile) => {
    tl.fromTo(stage(next), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, at);
    // yPercent rather than y: y already carries the phone pan of that scene.
    const leaving = prev.querySelector<HTMLElement>('.stage-in')!;
    tl.fromTo(
      leaving,
      { yPercent: 0, opacity: 1 },
      { yPercent: () => (-(mobile ? 10 : 14) * innerHeight) / leaving.offsetHeight, opacity: 0.5, duration: 1 },
      at,
    );
  },

  // Stack → method: the screen turns over like a card (stack on the front, method on the back),
  // receding while it turns (translateZ x(1 − x) · −2000px, phone −1200px); both sides darken.
  method: (tl, prev, next, at, mobile) => {
    const perspective = mobile ? 1300 : 2200;
    const depth = (mobile ? -1200 : -2000) / 4; // deepest point of x(1 − x) · depth, reached halfway
    for (const [scene, from, to] of [
      [prev, 0, 180],
      [next, -180, 0],
    ] as const) {
      tl.fromTo(
        stage(scene),
        { transformPerspective: perspective, rotationY: from },
        { rotationY: to, duration: 1 },
        at,
      );
      tl.fromTo(stage(scene), { z: 0 }, { z: depth, ease: arc, duration: 1 }, at);
    }
    tl.fromTo(shade(prev), { opacity: 0 }, { opacity: 0.7, duration: 1 }, at);
    tl.fromTo(shade(next), { opacity: 0.7 }, { opacity: 0, duration: 1 }, at);
  },

  // Method → contact: a diagonal sweep, while method shrinks back (desktop) and fades.
  contact: (tl, prev, next, at, mobile) => {
    tl.fromTo(
      stage(next),
      { clipPath: 'polygon(0% 0%, 0% 0%, -100% 100%, 0% 100%)' },
      { clipPath: 'polygon(0% 0%, 200% 0%, 100% 100%, 0% 100%)', duration: 1 },
      at,
    );
    const leaving = prev.querySelector<HTMLElement>('.stage-in')!;
    tl.fromTo(leaving, { opacity: 1 }, { opacity: 0.3, duration: 1 }, at);
    // Shrinks to 92% by moving back under its own perspective, not through scale: scale already carries
    // the fit-to-screen tween, and two scale tweens overlapping would fight when scrolling back up.
    if (!mobile)
      tl.fromTo(leaving, { transformPerspective: 1000, z: 0 }, { z: -1000 * (1 / 0.92 - 1), duration: 1 }, at);
  },
};
