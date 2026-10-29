import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test, type Page } from '@playwright/test';

// Static ("canvas") layout = what prefers-reduced-motion visitors get.
test.use({ reducedMotion: 'reduce' });

const reference = (kind: 'desktop' | 'mobile') => pathToFileURL(path.resolve(`design-references/${kind}.html`)).href;

/** Rounded boxes (x, page y, width, height) of the landmarks the site shares with the reference. */
function boxes(page: Page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const kinds = [
      '[data-scene]',
      'header',
      'h1',
      'h2',
      'h3',
      'article',
      '[data-fx="deal"]',
      '.flap',
      '[data-fx="domino"]',
      '.ph-scene',
      'footer',
    ];
    return Object.fromEntries(
      kinds.flatMap((k) =>
        [...document.querySelectorAll(k)].map((el, i) => {
          const r = el.getBoundingClientRect();
          return [`${k} #${i}`, [r.left, r.top + scrollY, r.width, r.height].map(Math.round).join(',')];
        }),
      ),
    );
  });
}

for (const [kind, width, height] of [
  ['desktop', 1366, 768],
  ['desktop', 1440, 900],
  ['desktop', 1920, 1080],
  ['mobile', 390, 844],
] as const) {
  test(`${width}x${height} matches the ${kind} reference box for box`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto(reference(kind), { waitUntil: 'networkidle' });
    const expected = await boxes(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(await boxes(page)).toEqual(expected);
  });
}

// Below ~1346 px the reference itself breaks (wrapping header and buttons, clipped contact card);
// the site adapts there (fluid margins, tighter gaps, buttons never wrap).
for (const [width, height] of [
  [1024, 768],
  [1080, 810],
  [1133, 744],
  [1180, 820],
  [1279, 800],
  [1280, 720],
]) {
  test(`${width}x${height}: nothing wraps, overflows or gets clipped`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/', { waitUntil: 'networkidle' });
    const problems = await page.evaluate(async () => {
      await document.fonts.ready;
      const out: string[] = [];
      const name = (el: Element) => `${el.tagName.toLowerCase()} "${el.textContent!.trim().slice(0, 24)}"`;
      const lines = (el: Element) => {
        const tops = new Set<number>();
        const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
          if (!n.textContent!.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(n);
          for (const r of range.getClientRects()) tops.add(Math.round(r.top));
        }
        return tops.size;
      };
      // Nearest ancestor that would clip the element (or the viewport).
      const clipper = (el: Element) => {
        let c = el.parentElement;
        while (c && !/hidden|clip/.test(getComputedStyle(c).overflowX)) c = c.parentElement;
        return c ?? document.documentElement;
      };

      if (document.documentElement.scrollWidth > innerWidth) out.push('horizontal scroll');
      for (const el of document.querySelectorAll('.btn, header a')) {
        if (el.getClientRects().length && lines(el) > 1) out.push(`${name(el)} wraps`);
      }
      for (const el of document.querySelectorAll('h1, h2, h3, p, li, a, dl, article, .eyebrow, .flap-h.f3 > span')) {
        if (!el.getClientRects().length || el.closest('.sr-only')) continue;
        const r = el.getBoundingClientRect();
        const c = clipper(el).getBoundingClientRect();
        if (r.left < c.left - 1 || r.right > c.right + 1) out.push(`${name(el)} is clipped`);
        if (el.scrollWidth > el.clientWidth + 1) out.push(`${name(el)} overflows its box`);
      }
      return out;
    });
    expect(problems).toEqual([]);
  });
}
