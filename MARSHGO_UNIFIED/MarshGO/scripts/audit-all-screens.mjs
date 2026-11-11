import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity/brain/1f9fa7ba-be90-4738-b480-9d68a25264b7/visual-evidence/audit-loop';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile iPhone 15 Pro Max (430x932)
  const mobileCtx = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
    hasTouch: true,
    geolocation: { latitude: 49.8429, longitude: 24.0311 },
    permissions: ['geolocation'],
  });

  const page = await mobileCtx.newPage();
  console.log('Navigating to http://127.0.0.1:7777...');
  await page.goto('http://127.0.0.1:7777/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Login if prompt shown
  try {
    const loginBtn = page.locator('button:has-text("У мене вже є акаунт")');
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
      await page.waitForTimeout(300);
      await page.fill('#login-email', 'dima@marshgo.local');
      await page.fill('#login-password', 'Marshgo#2026dev');
      await page.click('button[type="submit"]:has-text("Увійти")');
      await page.waitForTimeout(1500);
    }
  } catch (err) {
    console.warn('Login skipped or failed:', err.message);
  }

  // 1. Home Screen (Mobile)
  try {
    await page.goto('http://127.0.0.1:7777/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01-home-screen-mobile.png') });
    console.log('Captured 01-home-screen-mobile.png');
  } catch (err) {
    console.error('Home mobile error:', err.message);
  }

  // 2. Action Menu
  try {
    const actionMenuTrigger = page.locator('button[aria-label="Створити"], button[aria-label="Дії"], button:has-text("+"), .mg-bottom-nav button').nth(2);
    if (await actionMenuTrigger.isVisible()) {
      await actionMenuTrigger.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '02-action-menu-mobile.png') });
      console.log('Captured 02-action-menu-mobile.png');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  } catch (err) {
    console.error('Action menu error:', err.message);
  }

  // 3. Search Screen
  try {
    await page.goto('http://127.0.0.1:7777/search', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03-search-form-mobile.png') });
    console.log('Captured 03-search-form-mobile.png');

    const searchSubmit = page.locator('button[type="submit"]:has-text("Знайти"), button:has-text("Знайти маршрут")').first();
    if (await searchSubmit.isVisible()) {
      await searchSubmit.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '04-search-results-mobile.png') });
      console.log('Captured 04-search-results-mobile.png');
    }
  } catch (err) {
    console.error('Search screen error:', err.message);
  }

  // 4. Transport Map Screen
  try {
    await page.goto('http://127.0.0.1:7777/map', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05-transport-map-mobile.png') });
    console.log('Captured 05-transport-map-mobile.png');

    const layersBtn = page.locator('button[aria-label="Шари карти"], button:has-text("Шари")').first();
    if (await layersBtn.isVisible()) {
      await layersBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '06-map-layers-panel-mobile.png') });
      console.log('Captured 06-map-layers-panel-mobile.png');
    }
  } catch (err) {
    console.error('Map screen error:', err.message);
  }

  // 5. Trips Screen
  try {
    await page.goto('http://127.0.0.1:7777/trips', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '07-trips-screen-mobile.png') });
    console.log('Captured 07-trips-screen-mobile.png');

    const savedTab = page.locator('button[role="tab"]:has-text("Збережені")');
    if (await savedTab.isVisible()) {
      await savedTab.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '08-saved-journeys-mobile.png') });
      console.log('Captured 08-saved-journeys-mobile.png');

      const cardBtn = page.locator('article[data-testid="saved-journey-card"] button').first();
      if ((await cardBtn.count()) > 0) {
        await cardBtn.click();
        await page.waitForTimeout(2500);
        await page.screenshot({ path: path.join(ARTIFACT_DIR, '09-journey-route-map-mobile.png') });
        console.log('Captured 09-journey-route-map-mobile.png');
      }
    }
  } catch (err) {
    console.error('Trips screen error:', err.message);
  }

  // 6. Profile Screen
  try {
    await page.goto('http://127.0.0.1:7777/profile', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '10-profile-screen-mobile.png') });
    console.log('Captured 10-profile-screen-mobile.png');
  } catch (err) {
    console.error('Profile screen error:', err.message);
  }

  // 7. Desktop audit (1280x800)
  const desktopCtx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const deskPage = await desktopCtx.newPage();
  try {
    await deskPage.goto('http://127.0.0.1:7777/', { waitUntil: 'networkidle' });
    await deskPage.waitForTimeout(800);
    await deskPage.screenshot({ path: path.join(ARTIFACT_DIR, '11-home-screen-desktop.png') });
    console.log('Captured 11-home-screen-desktop.png');

    await deskPage.goto('http://127.0.0.1:7777/search', { waitUntil: 'networkidle' });
    await deskPage.waitForTimeout(800);
    await deskPage.screenshot({ path: path.join(ARTIFACT_DIR, '12-search-screen-desktop.png') });
    console.log('Captured 12-search-screen-desktop.png');

    await deskPage.goto('http://127.0.0.1:7777/map', { waitUntil: 'networkidle' });
    await deskPage.waitForTimeout(1500);
    await deskPage.screenshot({ path: path.join(ARTIFACT_DIR, '13-map-screen-desktop.png') });
    console.log('Captured 13-map-screen-desktop.png');
  } catch (err) {
    console.error('Desktop audit error:', err.message);
  }

  await browser.close();
  console.log('ALL AUDIT SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

runAudit().catch(console.error);
