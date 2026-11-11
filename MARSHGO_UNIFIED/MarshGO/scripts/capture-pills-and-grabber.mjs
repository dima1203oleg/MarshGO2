import { chromium } from 'playwright';
import path from 'node:path';

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity/brain/1f9fa7ba-be90-4738-b480-9d68a25264b7/visual-evidence';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    geolocation: { latitude: 49.8429, longitude: 24.0311 },
    permissions: ['geolocation'],
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:7777/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const loginBtn = page.locator('button:has-text("У мене вже є акаунт")');
  if (await loginBtn.isVisible()) {
    await loginBtn.click();
    await page.waitForTimeout(300);
    await page.fill('#login-email', 'dima@marshgo.local');
    await page.fill('#login-password', 'Marshgo#2026dev');
    await page.click('button[type="submit"]:has-text("Увійти")');
    await page.waitForTimeout(1500);
  }

  const tripsTab = page.locator('button:has-text("Поїздки")').first();
  await tripsTab.click();
  await page.waitForTimeout(800);

  const savedTab = page.locator('button[role="tab"]:has-text("Збережені")');
  if (await savedTab.isVisible()) await savedTab.click();
  await page.waitForTimeout(1000);

  const card = page.locator('section[aria-label="Збережені маршрути"] button').first();
  await card.click();
  await page.waitForTimeout(2500);

  // Check ribbon pills
  const pills = page.locator('.mg-route-ribbon__pill');
  console.log('Ribbon pills count:', await pills.count());
  if (await pills.count() > 0) {
    await pills.first().click();
    await page.waitForTimeout(1200);
    const shot3 = path.join(ARTIFACT_DIR, 'polish-03-segment-focus-trail.png');
    await page.screenshot({ path: shot3 });
    console.log(`Saved ${shot3}`);
  }

  // Check grabber
  const grabber = page.locator('.route-sheet-grabber');
  console.log('Grabber count:', await grabber.count());
  if (await grabber.count() > 0) {
    await grabber.first().click();
    await page.waitForTimeout(1200);
    const shot4 = path.join(ARTIFACT_DIR, 'polish-04-sheet-collapsed-focus.png');
    await page.screenshot({ path: shot4 });
    console.log(`Saved ${shot4}`);
  }

  await browser.close();
}

run().catch(console.error);
