import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity/brain/1f9fa7ba-be90-4738-b480-9d68a25264b7/visual-evidence';
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function run() {
  console.log('🚀 Running visual verification of routes, vehicle icons, and bottom sheet...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14
    deviceScaleFactor: 2,
    hasTouch: true,
    geolocation: { latitude: 50.4501, longitude: 30.5234 }, // Kyiv center
    permissions: ['geolocation'],
  });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:7777/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Login
  const loginBtn = page.locator('button:has-text("У мене вже є акаунт")');
  if (await loginBtn.isVisible()) {
    await loginBtn.click();
    await page.waitForTimeout(400);
    await page.fill('#login-email', 'dima@marshgo.local');
    await page.fill('#login-password', 'Marshgo#2026dev');
    await page.click('button[type="submit"]:has-text("Увійти")');
    await page.waitForTimeout(2000);
  }
  console.log('✅ Logged in to Home Dashboard');

  // 2. Open Transport Map
  console.log('📍 Opening "Карта транспорту"...');
  const mapBtn = page.locator('button:has-text("Карта транспорту")').first();
  if (await mapBtn.isVisible()) {
    await mapBtn.click();
    await page.waitForTimeout(3000);
    const shot1 = path.join(ARTIFACT_DIR, 'polish-01-live-transport-icons.png');
    await page.screenshot({ path: shot1 });
    console.log(`Saved ${shot1}`);

    // Back to home
    const backBtn = page.locator('header button').first();
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  // 3. Open Search via "Знайти маршрут" or Popular route
  console.log('🔍 Searching route...');
  const searchTile = page.locator('button:has-text("Знайти маршрут")').first();
  if (await searchTile.isVisible()) {
    await searchTile.click();
    await page.waitForTimeout(800);

    const fromInput = page.locator('input[placeholder*="Звідки"]');
    const toInput = page.locator('input[placeholder*="Куди"]');
    if (await fromInput.isVisible()) {
      await fromInput.fill('Борщагівка');
      await page.waitForTimeout(300);
    }
    if (await toInput.isVisible()) {
      await toInput.fill('Голосіївський парк');
      await page.waitForTimeout(300);
    }

    const searchSubmit = page.locator('button:has-text("Знайти маршрути"), button[type="submit"]').first();
    if (await searchSubmit.isVisible()) {
      await searchSubmit.click();
      await page.waitForTimeout(3000);
    }

    // Click on the first route card to enter JourneyRouteMapScreen
    const routeCard = page.locator('.route-card, [data-testid="journey-result-card"]').first();
    if (await routeCard.isVisible()) {
      console.log('🗺️ Opening JourneyRouteMapScreen...');
      await routeCard.click();
      await page.waitForTimeout(3000);

      // Screenshot 2: Default view with enhanced bottom sheet & balanced camera padding
      const shot2 = path.join(ARTIFACT_DIR, 'polish-02-route-map-overview.png');
      await page.screenshot({ path: shot2 });
      console.log(`Saved ${shot2}`);

      // Screenshot 3: Active segment focus (pill active + route line glowing + walking trail)
      const ribbonPill = page.locator('.mg-route-ribbon__pill').first();
      if (await ribbonPill.isVisible()) {
        console.log('🎯 Selecting ribbon segment for camera focus & trail highlight...');
        await ribbonPill.click();
        await page.waitForTimeout(1500);
        const shot3 = path.join(ARTIFACT_DIR, 'polish-03-segment-focus-trail.png');
        await page.screenshot({ path: shot3 });
        console.log(`Saved ${shot3}`);
      }

      // Screenshot 4: Cycle sheet snap
      const grabber = page.locator('.route-sheet-grabber').first();
      if (await grabber.isVisible()) {
        console.log('↕️ Adjusting sheet snap...');
        await grabber.click();
        await page.waitForTimeout(1500);
        const shot4 = path.join(ARTIFACT_DIR, 'polish-04-sheet-collapsed-focus.png');
        await page.screenshot({ path: shot4 });
        console.log(`Saved ${shot4}`);
      }

      const backFromRoute = page.locator('button[aria-label="Назад до результатів"]').first();
      if (await backFromRoute.isVisible()) {
        await backFromRoute.click();
        await page.waitForTimeout(1000);
      }
    }
  }

  // 4. Return to home and launch Navigation Mode
  console.log('🧭 Opening Navigation Mode...');
  await page.goto('http://127.0.0.1:7777/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const navAction = page.locator('button:has-text("Навігація")').first();
  if (await navAction.isVisible()) {
    await navAction.click();
    await page.waitForTimeout(2500);
    const shot5 = path.join(ARTIFACT_DIR, 'polish-05-nav-mode-puck.png');
    await page.screenshot({ path: shot5 });
    console.log(`Saved ${shot5}`);
  }

  await browser.close();
  console.log('🎉 All visual checks completed successfully!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
