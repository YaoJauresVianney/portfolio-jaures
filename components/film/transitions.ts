import { gsap } from 'gsap';

/** Adds the 1-screen transition from `prev` to `next` to `tl`, starting at `at` (both scenes animate at once). */
type Transition = (tl: gsap.core.Timeline, prev: HTMLElement, next: HTMLElement, at: number, mobile: boolean) => void;

const stage = (scene: HTMLElement) => scene.querySelector<HTMLElement>('.stage')!;

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
};

/** Until a scene has its own transition (steps 4–5): it slides up over the previous one. */
export const slideUp: Transition = (tl, _prev, next, at) => {
  tl.fromTo(next, { yPercent: 100 }, { yPercent: 0, duration: 1 }, at);
};
