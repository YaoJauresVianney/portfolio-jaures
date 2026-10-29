import { expect, test, type Page } from '@playwright/test';

const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

/** Waits until smooth scrolling has settled. */
async function settle(page: Page) {
  let last = -1;
  for (let i = 0; i < 60; i++) {
    const y = await page.evaluate(() => scrollY);
    if (y === last) return;
    last = y;
    await page.waitForTimeout(150);
  }
}

/** id of the scene under the centre of the screen. */
const sceneOnScreen = (page: Page) =>
  page.evaluate(() => document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest('[data-scene]')?.id);

async function openFilm(page: Page, viewport: typeof DESKTOP, path = '/') {
  await page.setViewportSize(viewport);
  await page.goto(path, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.film === 'ready');
}

for (const [name, viewport, screens] of [
  ['desktop', DESKTOP, 18.8],
  ['phone', PHONE, 17.6],
] as const) {
  test(`${name}: the film scrolls for ${screens} screens`, async ({ page }) => {
    await openFilm(page, viewport);
    const length = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    expect(length).toBeCloseTo(screens * viewport.height, -1);
  });
}

test('desktop: each menu link brings its scene', async ({ page }) => {
  await openFilm(page, DESKTOP);
  for (const id of ['contact', 'cas', 'methode', 'services', 'stack', 'top']) {
    await page.locator(`header a[href="#${id}"]`).first().click();
    await settle(page);
    expect(await sceneOnScreen(page)).toBe(id);
  }
});

test('phone: each burger menu link brings its scene', async ({ page }) => {
  await openFilm(page, PHONE);
  for (const id of ['stack', 'cas', 'contact', 'methode', 'services']) {
    await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
    await page.locator(`#mobile-menu a[href="#${id}"]`).click();
    await settle(page);
    expect(await sceneOnScreen(page)).toBe(id);
  }
});

test('keyboard focus in an off-screen scene brings that scene', async ({ page }) => {
  await openFilm(page, DESKTOP);
  await page.locator('#contact a.btn').focus();
  await settle(page);
  expect(await sceneOnScreen(page)).toBe('contact');
});

test('a shared link to #services opens on that scene', async ({ page }) => {
  await openFilm(page, DESKTOP, '/#services');
  await settle(page);
  expect(await sceneOnScreen(page)).toBe('services');
});

test('nothing shifts while the film starts', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.film === 'ready');
  const cls = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let sum = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[])
            if (!e.hadRecentInput) sum += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(sum), 1000);
      }),
  );
  expect(cls).toBeLessThan(0.001);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the page is static and anchors scroll natively', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(await page.evaluate(() => document.documentElement.dataset.film)).toBeUndefined();
    await page.locator('header a[href="#methode"]').first().click();
    await settle(page);
    await expect(page.locator('#methode-title')).toBeInViewport();
  });
});
