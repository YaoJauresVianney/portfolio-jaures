// Captures the design references (film mode + static mode) into docs/reference-shots/.
// Usage: node scripts/capture-reference.mjs
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const out = path.resolve('docs/reference-shots');
const targets = [
  { name: 'desktop', file: 'design-references/desktop.html', viewport: { width: 1440, height: 900 }, mobile: false },
  { name: 'mobile', file: 'design-references/mobile.html', viewport: { width: 390, height: 844 }, mobile: true },
];
const frames = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

await mkdir(out, { recursive: true });
const browser = await chromium.launch();

for (const t of targets) {
  const url = pathToFileURL(path.resolve(t.file)).href;
  const opts = { viewport: t.viewport, isMobile: t.mobile, hasTouch: t.mobile };

  // Film mode: intro, then for each scene the entry transition midpoint and p = 0 / 0.5 / 1.
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${out}/${t.name}-00-hero-intro.jpg`, quality: 75 });
  await page.waitForTimeout(2600);

  const stops = await page.evaluate(() => {
    const vh = innerHeight;
    return [...document.querySelectorAll('[data-scene]')].flatMap((s) => {
      const top = s.getBoundingClientRect().top + scrollY;
      const span = Math.max(1, s.offsetHeight - (s.hasAttribute('data-last') ? 1 : 2) * vh);
      const id = s.dataset.scene;
      return [
        ...(top > 0 ? [[`${id}-enter`, top - vh / 2]] : []),
        [`${id}-p000`, top],
        [`${id}-p050`, top + span / 2],
        [`${id}-p100`, top + span],
      ];
    });
  });
  let i = 1;
  for (const [label, y] of stops) {
    await page.evaluate((y) => scrollTo(0, y), Math.round(y));
    await frames(page);
    await page.waitForTimeout(60);
    await page.screenshot({ path: `${out}/${t.name}-${String(i++).padStart(2, '0')}-${label}.jpg`, quality: 75 });
  }
  await ctx.close();

  // Static mode (prefers-reduced-motion): the "canvas" layout, both themes.
  for (const theme of ['default', 'toggled']) {
    const sctx = await browser.newContext({ ...opts, reducedMotion: 'reduce' });
    const sp = await sctx.newPage();
    await sp.goto(url, { waitUntil: 'networkidle' });
    if (theme === 'toggled') await sp.click('[data-ref="theme"]');
    await sp.waitForTimeout(400);
    await sp.screenshot({ path: `${out}/${t.name}-static-${theme}-theme.jpg`, quality: 75, fullPage: true });
    await sctx.close();
  }
}
await browser.close();
console.log('Reference shots written to', out);
