import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity/brain/1f9fa7ba-be90-4738-b480-9d68a25264b7/visual-evidence';
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function run() {
  console.log('🚀 Capturing JourneyRouteMapScreen in detail...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14
    deviceScaleFactor: 2,
    hasTouch: true,
    geolocation: { latitude: 50.4501, longitude: 30.5234 },
    permissions: ['geolocation'],
  });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:7777/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Login
  const loginBtn = page.locator('button:has-text("У мене вже є акаунт")');
  if (await loginBtn.isVisible()) {
    await loginBtn.click();
    await page.waitForTimeout(400);
    await page.fill('#login-email', 'dima@marshgo.local');
    await page.fill('#login-password', 'Marshgo#2026dev');
    await page.click('button[type="submit"]:has-text("Увійти")');
    await page.waitForTimeout(2000);
  }
  console.log('✅ Logged in');

  // Search route from Kyiv (Борщагівка -> Голосіївський парк)
  console.log('📍 Filling search fields...');
  const searchTile = page.locator('button:has-text("Знайти маршрут")').first();
  if (await searchTile.isVisible()) {
    await searchTile.click();
    await page.waitForTimeout(800);
  }

  const fromInput = page.locator('input[placeholder="Місто відправлення"]');
  const toInput = page.locator('input[placeholder="Місто призначення"]');
  if (await fromInput.isVisible()) {
    await fromInput.fill('Борщагівка');
    await page.waitForTimeout(400);
  }
  if (await toInput.isVisible()) {
    await toInput.fill('Голосіївський парк');
    await page.waitForTimeout(400);
  }

  console.log('Submitting search form...');
  const submitBtn = page.locator('button.search-submit');
  if (await submitBtn.isVisible()) {
    await submitBtn.click();
    await page.waitForTimeout(4000);
  }

  // Look for result card
  const card = page.locator('article[data-testid="journey-result-card"]').first();
  const cardCount = await card.count();
  console.log(`Found ${cardCount} journey result cards`);

  if (cardCount > 0) {
    console.log('Clicking journey result card to open JourneyRouteMapScreen...');
    await card.click();
    await page.waitForTimeout(3000);

    // Screenshot 2: Default half snap with enhanced bottom sheet & balanced camera padding
    const shot2 = path.join(ARTIFACT_DIR, 'polish-02-route-map-overview.png');
    await page.screenshot({ path: shot2 });
    console.log(`✅ Saved ${shot2}`);

    // Screenshot 3: Active segment focus
    const ribbonPill = page.locator('.mg-route-ribbon__pill').first();
    if (await ribbonPill.isVisible()) {
      console.log('Clicking ribbon pill for active segment focus...');
      await ribbonPill.click();
      await page.waitForTimeout(1500);
      const shot3 = path.join(ARTIFACT_DIR, 'polish-03-segment-focus-trail.png');
      await page.screenshot({ path: shot3 });
      console.log(`✅ Saved ${shot3}`);
    }

    // Screenshot 4: Cycle sheet grabber to peek/collapsed
    const grabber = page.locator('.route-sheet-grabber').first();
    if (await grabber.isVisible()) {
      console.log('Tapping sheet grabber...');
      await grabber.click();
      await page.waitForTimeout(1500);
      const shot4 = path.join(ARTIFACT_DIR, 'polish-04-sheet-collapsed-focus.png');
      await page.screenshot({ path: shot4 });
      console.log(`✅ Saved ${shot4}`);
    }
  } else {
    console.log('No cards with Борщагівка, trying popular route Львів → Київ...');
    await page.goto('http://127.0.0.1:7777/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const pop = page.locator('button:has-text("Львів → Київ")').first();
    if (await pop.isVisible()) {
      await pop.click();
      await page.waitForTimeout(1000);
      const sub = page.locator('button.search-submit');
      if (await sub.isVisible()) {
        await sub.click();
        await page.waitForTimeout(4000);
      }
      const c = page.locator('article[data-testid="journey-result-card"]').first();
      if (await c.count()) {
        await c.click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'polish-02-route-map-overview.png') });
        console.log('✅ Saved polish-02-route-map-overview.png (popular route)');
      }
    }
  }

  await browser.close();
  console.log('🎉 Done!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
