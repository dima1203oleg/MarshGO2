import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity/brain/1f9fa7ba-be90-4738-b480-9d68a25264b7/visual-evidence';
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function run() {
  console.log('🚀 Opening JourneyRouteMapScreen via Saved Journeys in Trips tab...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 mobile
    deviceScaleFactor: 2,
    hasTouch: true,
    geolocation: { latitude: 49.8429, longitude: 24.0311 },
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

  // Go to Trips tab
  const tripsTab = page.locator('button:has-text("Поїздки")').first();
  await tripsTab.click();
  await page.waitForTimeout(1000);

  // Click "Збережені" tab
  const savedTab = page.locator('button[role="tab"]:has-text("Збережені")');
  if (await savedTab.isVisible()) {
    await savedTab.click();
    await page.waitForTimeout(1200);
  }

  // Find saved journey card
  const journeyCard = page.locator('section[aria-label="Збережені маршрути"] button').first();
  const count = await journeyCard.count();
  console.log(`Saved journey cards count: ${count}`);

  if (count > 0) {
    console.log('Clicking saved journey card...');
    await journeyCard.click();
    await page.waitForTimeout(3000);

    // 1. Screenshot: Overview with new bottom sheet, smooth styling, and 36px balanced camera padding
    const shot2 = path.join(ARTIFACT_DIR, 'polish-02-route-map-overview.png');
    await page.screenshot({ path: shot2 });
    console.log(`✅ Saved ${shot2}`);

    // 2. Click segment ribbon pill to focus on active stage and highlight trail
    const ribbonPill = page.locator('.mg-route-ribbon__pill').first();
    if (await ribbonPill.isVisible()) {
      console.log('Clicking ribbon pill for active segment focus & halo...');
      await ribbonPill.click();
      await page.waitForTimeout(1500);
      const shot3 = path.join(ARTIFACT_DIR, 'polish-03-segment-focus-trail.png');
      await page.screenshot({ path: shot3 });
      console.log(`✅ Saved ${shot3}`);
    }

    // 3. Tapping sheet grabber to cycle to peek/collapsed state
    const grabber = page.locator('.route-sheet-grabber').first();
    if (await grabber.isVisible()) {
      console.log('Tapping sheet grabber to adjust sheet height...');
      await grabber.click();
      await page.waitForTimeout(1500);
      const shot4 = path.join(ARTIFACT_DIR, 'polish-04-sheet-collapsed-focus.png');
      await page.screenshot({ path: shot4 });
      console.log(`✅ Saved ${shot4}`);
    }
  }

  await browser.close();
  console.log('🎉 Done!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
