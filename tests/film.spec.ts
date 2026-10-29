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

test('the hero buttons are clickable above the stacked scenes', async ({ page }) => {
  await openFilm(page, DESKTOP);
  await page.locator('#top a[href="#cas"]').click();
  await settle(page);
  expect(await sceneOnScreen(page)).toBe('cas');
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

test('desktop: the hero plays its intro on load', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto('/', { waitUntil: 'commit' });
  await page.waitForFunction(() => document.getAnimations().length > 0);
  const names = await page.evaluate(() => document.getAnimations().map((a) => (a as CSSAnimation).animationName));
  expect(names).toEqual(expect.arrayContaining(['in-left', 'in-blur', 'in-iris', 'in-mask', 'in-right']));
});

test('desktop: the photo leans toward the mouse', async ({ page }) => {
  await openFilm(page, DESKTOP);
  await page.mouse.move(DESKTOP.width - 2, DESKTOP.height / 2, { steps: 4 });
  await page.waitForTimeout(1500);
  // rotateY(θ) puts −sin θ in m13; the reference leans up to 8° (mouse at the right edge ≈ +8°).
  const lean = await page.evaluate(() => {
    const m = new DOMMatrix(getComputedStyle(document.querySelector('.ph-tilt')!).transform);
    return (Math.asin(-m.m13) * 180) / Math.PI;
  });
  expect(lean).toBeGreaterThan(6);
});

test('desktop: the case carousel ends with the last card centred and flat', async ({ page }) => {
  await openFilm(page, DESKTOP);
  await page.evaluate((y) => scrollTo(0, y), 7 * DESKTOP.height - 2); // end of the case studies' own animation
  await settle(page);
  const last = page.locator('#cas .case').last();
  const box = (await last.boundingBox())!;
  expect(Math.abs(box.x + box.width / 2 - DESKTOP.width / 2)).toBeLessThan(2);
  // The card in front leans toward the mouse.
  const before = await last.evaluate((el) => getComputedStyle(el).transform);
  await page.mouse.move(box.x + box.width - 10, box.y + 10, { steps: 4 });
  await page.waitForTimeout(800);
  expect(await last.evaluate((el) => getComputedStyle(el).transform)).not.toBe(before);
});
