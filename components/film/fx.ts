import { gsap } from 'gsap';

type Ease = (t: number) => number;
/** A group of properties animated together; `curve` derives its own timing from the element's ease. */
type Part = { from: gsap.TweenVars; to: gsap.TweenVars; curve?: (ease: Ease) => Ease };

// data-ease of the references: "out" is a cubic ease-out (GSAP power2).
export const EASES: Record<string, Ease> = {
  out: gsap.parseEase('power2.out'),
  back: gsap.parseEase('back.out(1.70158)'),
  linear: gsap.parseEase('none'),
};

const clip = (from: string) => [{ from: { clipPath: from }, to: { clipPath: 'inset(0% 0% 0% 0%)' } }];
// Effects whose many properties derive from a single t: the reference's CSS formulas are kept as they are
// in motion.css, and GSAP drives their --t.
const formula = () => [{ from: { '--t': 0 }, to: { '--t': 1 } }];

// Reveal effects, translated from the references' `.cine [data-fx=…]` rules (phone values where they differ).
// Rotations always swing away from the viewer. domino and drawY come with Méthode (step 5).
const FX: Record<string, (mobile: boolean) => Part[]> = {
  deal: formula,
  flap: formula,
  rise: (m) => [{ from: { opacity: 0, y: m ? 50 : 80 }, to: { opacity: 1, y: 0 } }],
  drop: (m) => [{ from: { opacity: 0, y: m ? -40 : -70 }, to: { opacity: 1, y: 0 } }],
  left: () => [{ from: { opacity: 0, x: -140 }, to: { opacity: 1, x: 0 } }],
  right: (m) => [{ from: { opacity: 0, x: m ? 60 : 140 }, to: { opacity: 1, x: 0 } }],
  mask: () => [{ from: { clipPath: 'inset(100% 0% 0% 0%)', y: 50 }, to: { clipPath: 'inset(0% 0% 0% 0%)', y: 0 } }],
  wipe: () => clip('inset(0% 100% 0% 0%)'),
  curtain: () => clip('inset(0% 0% 0% 100%)'),
  blur: () => [
    { from: { opacity: 0, filter: 'blur(14px)', scale: 1.04 }, to: { opacity: 1, filter: 'blur(0px)', scale: 1 } },
  ],
  zoom: () => [{ from: { opacity: 0, scale: 0.55 }, to: { opacity: 1, scale: 1 } }],
  pop: () => [
    { from: { scale: 0 }, to: { scale: 1 } },
    { from: { opacity: 0 }, to: { opacity: 1 }, curve: (e) => (t) => Math.min(1, 3 * e(t)) },
  ],
  flip: () => [
    {
      from: { opacity: 0, rotationY: 80, transformPerspective: 1000, transformOrigin: '0% 50%' },
      to: { opacity: 1, rotationY: 0 },
    },
  ],
  swing: () => [
    {
      from: { opacity: 0, rotationX: -80, transformPerspective: 1000, transformOrigin: '50% 0%' },
      to: { opacity: 1, rotationX: 0 },
    },
  ],
  spin: () => [{ from: { opacity: 0, rotation: -16, scale: 0.7 }, to: { opacity: 1, rotation: 0, scale: 1 } }],
  tilt: (m) => [{ from: { opacity: 0, skewY: 9, y: m ? 60 : 90 }, to: { opacity: 1, skewY: 0, y: 0 } }],
  iris: () => [{ from: { clipPath: 'circle(0% at 50% 50%)' }, to: { clipPath: 'circle(75% at 50% 50%)' } }],
  draw: () => [{ from: { scaleX: 0, transformOrigin: '0% 50%' }, to: { scaleX: 1 } }],
  fade: () => [{ from: { opacity: 0 }, to: { opacity: 1 } }],
};

/**
 * Adds the reveal `name` of `el` to `tl` over [position, position + duration].
 * `rev` plays it backwards (an exit), mirroring the reference's `t = 1 - t` before easing.
 * Returns false when `name` is not a generic reveal (handled by its scene).
 */
export function addFx(
  tl: gsap.core.Timeline,
  el: Element,
  name: string,
  { mobile, ease, rev }: { mobile: boolean; ease: Ease; rev: boolean },
  position: number,
  duration: number,
) {
  const parts = FX[name]?.(mobile);
  if (!parts) return false;
  const base = rev ? (t: number) => 1 - ease(1 - t) : ease;
  for (const { from, to, curve } of parts) {
    tl.fromTo(el, rev ? to : from, { ...(rev ? from : to), duration, ease: curve ? curve(base) : base }, position);
  }
  return true;
}
