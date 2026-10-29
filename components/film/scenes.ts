import { gsap } from 'gsap';
import { addFx, EASES } from './fx';

/** What a scene gets to add its own choreography to the film. */
export type SceneContext = {
  tl: gsap.core.Timeline;
  el: HTMLElement;
  mobile: boolean;
  /** Timeline span of the scene's own progress p (0 → 1, holds excluded). */
  p0: number;
  pLen: number;
  /** Runs now and on every refresh: the only place for layout reads. */
  measure: (fn: () => void) => void;
  cleanup: (fn: () => void) => void;
};

const clamp = gsap.utils.clamp(0, 1);
const smooth = (t: number) => t * t * (3 - 2 * t);
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Eases `value` toward `target` frame by frame (lerp), then stops; `paint` renders each frame. */
function follower<T extends { x: number; y: number; tx: number; ty: number }>(
  items: T[],
  rate: number,
  paint: () => void,
) {
  let running = false;
  const step = () => {
    let moving = false;
    for (const m of items) {
      m.x += (m.tx - m.x) * rate;
      m.y += (m.ty - m.y) * rate;
      if (Math.abs(m.tx - m.x) > 0.001 || Math.abs(m.ty - m.y) > 0.001) moving = true;
    }
    paint();
    if (!moving) {
      gsap.ticker.remove(step);
      running = false;
    }
  };
  return {
    start() {
      if (!running) gsap.ticker.add(step);
      running = true;
    },
    stop() {
      gsap.ticker.remove(step);
      running = false;
    },
  };
}

/** Hero: the photo pivots and recedes as the scene plays; on a computer it first leans toward the mouse. */
function hero({ tl, el, mobile, p0, pLen, cleanup }: SceneContext) {
  tl.fromTo(
    el.querySelector('.ph-turn'),
    { z: 0, rotationY: 0, rotationX: 0 },
    { z: mobile ? -160 : -240, rotationY: mobile ? -22 : -26, rotationX: 5, duration: pLen },
    p0,
  );
  if (mobile || !finePointer()) return;

  // Up to 8° toward the mouse, fading out as the scene progresses (reference: --mx · (1 − p) · 8deg).
  const tilt = el.querySelector<HTMLElement>('.ph-tilt')!;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const setY = gsap.quickSetter(tilt, 'rotationY', 'deg');
  const setX = gsap.quickSetter(tilt, 'rotationX', 'deg');
  const paint = () => {
    const k = 1 - clamp((tl.time() - p0) / pLen);
    setY(mouse.x * k * 8);
    setX(mouse.y * k * -8);
  };
  const lean = follower([mouse], 0.08, paint);
  const onMove = (e: MouseEvent) => {
    mouse.tx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / innerHeight) * 2 - 1;
    lean.start();
  };
  const onLeave = () => {
    mouse.tx = mouse.ty = 0;
    lean.start();
  };
  addEventListener('mousemove', onMove, { passive: true });
  document.documentElement.addEventListener('mouseleave', onLeave);
  tl.to({}, { duration: pLen, onUpdate: paint }, p0); // scrolling fades the lean even when the mouse rests
  cleanup(() => {
    lean.stop();
    removeEventListener('mousemove', onMove);
    document.documentElement.removeEventListener('mouseleave', onLeave);
    gsap.set(tilt, { clearProps: 'transform' });
  });
}

/**
 * Case studies: the track scrolls sideways through a 3D carousel. Each card turns ~35° and recedes on
 * the sides, flat in front; its contents reveal from the card's own position on screen (data-axis="x").
 */
function cases({ tl, el, mobile, p0, pLen, measure, cleanup }: SceneContext) {
  const track = el.querySelector<HTMLElement>('[data-track]')!;
  const intro = track.querySelector<HTMLElement>('.case-intro')!;
  const cards = gsap.utils.toArray<HTMLElement>('.case', track);
  const shadows = cards.map((c) => c.querySelector<HTMLElement>('.case-shadow')!);
  const sets = cards.map((c) => gsap.quickSetter(c, 'css'));
  const view = cards.map(() => ({ rot: 0, z: 0, focus: 0, opacity: 1 }));
  const hover = cards.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));
  const geo = cards.map(() => ({ left: 0, width: 0 }));
  let width = 0; // of the screen (the scene)
  let shift = 0; // how far the track travels
  let fit = 1; // phone: cards shrink on short screens so a whole card stays visible

  // One paused reveal per card element; its progress follows the card's position.
  const reveals = gsap.utils.toArray<HTMLElement>('[data-axis="x"]', el).map((node) => {
    const { at, ease, easeM, fx } = node.dataset;
    const [a, b] = at!.split(' ').map(Number);
    const anim = gsap.timeline({ paused: true });
    addFx(anim, node, fx!, { mobile, ease: EASES[(mobile && easeM) || ease || 'out'], rev: false }, 0, 1);
    return { card: cards.indexOf(node.closest<HTMLElement>('.case')!), a, b, anim };
  });

  const paint = (i: number) => {
    const v = view[i];
    const h = hover[i];
    sets[i]({
      z: v.z,
      rotationY: v.rot + h.x * v.focus * 7,
      rotationX: h.y * v.focus * -6,
      opacity: v.opacity,
      scale: fit,
    });
    shadows[i].style.opacity = String(v.focus);
  };

  // Reference _coverflow and data-axis reveal, from the track's current offset: no layout reads here.
  const update = () => {
    const x = gsap.getProperty(track, 'x') as number;
    const half = width / 2;
    cards.forEach((_, i) => {
      const d = (geo[i].left + x + geo[i].width / 2 - half) / half;
      const a = Math.abs(d);
      view[i] = {
        rot: Math.sign(d) * 35 * smooth(Math.min(1, a)),
        z: (mobile ? -160 : -230) * smooth(Math.min(1, a / 1.2)),
        focus: Math.max(0, 1 - a * 1.6),
        opacity: 1 - Math.min(0.45, Math.max(0, a - 0.7) * 0.6),
      };
      paint(i);
    });
    for (const r of reveals) {
      const seen = (width - (geo[r.card].left + x)) / (0.55 * width);
      r.anim.progress(clamp((seen - r.a) / (r.b - r.a)));
    }
  };

  tl.fromTo(track, { x: 0 }, { x: () => -shift, duration: pLen, onUpdate: update }, p0);
  tl.fromTo(el.querySelector('.cases-bar > div'), { scaleX: 0 }, { scaleX: 1, duration: pLen }, p0);

  measure(() => {
    width = el.clientWidth;
    shift = Math.max(0, track.offsetWidth - width);
    cards.forEach((c, i) => (geo[i] = { left: c.offsetLeft, width: c.offsetWidth }));
    if (mobile) {
      const tallest = Math.max(...[intro, ...cards].map((c) => c.offsetHeight));
      fit = Math.min(1, (innerHeight - 116) / tallest);
      gsap.set(intro, { scale: fit });
    }
    update();
  });

  // Desktop: the card in front leans toward the mouse (±7°), less the further it is from the centre.
  if (!mobile && finePointer()) {
    const lean = follower(hover, 0.1, () => cards.forEach((_, i) => paint(i)));
    const handlers = cards.map((card, i) => {
      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        hover[i].tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        hover[i].ty = ((e.clientY - r.top) / r.height) * 2 - 1;
        lean.start();
      };
      const leave = () => {
        hover[i].tx = hover[i].ty = 0;
        lean.start();
      };
      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
      return () => {
        card.removeEventListener('mousemove', move);
        card.removeEventListener('mouseleave', leave);
      };
    });
    cleanup(() => {
      lean.stop();
      handlers.forEach((off) => off());
    });
  }
  cleanup(() => gsap.set([intro, ...cards, ...shadows], { clearProps: 'transform,opacity' }));
}

export const SCENES: Record<string, (ctx: SceneContext) => void> = { hero, cases };
