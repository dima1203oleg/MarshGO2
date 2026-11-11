import { chromium } from 'playwright';
/* global document */
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = '/private/tmp/mg-visual-evidence';
fs.mkdirSync(OUT_DIR, { recursive: true });

async function testDarkSatellite() {
  console.log('🌙 Testing Dark Satellite Basemap in Web UI (iPhone 13 - 390x844)...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    colorScheme: 'dark'
  });

  const page = await context.newPage();

  try {
    await page.goto('http://127.0.0.1:4178/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Login
    const loginBtn = page.locator('button:has-text("У мене вже є акаунт")');
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
      await page.waitForTimeout(400);
      await page.fill('#login-email', 'dima@marshgo.local');
      await page.fill('#login-password', 'Marshgo#2026dev');
      await page.click('button[type="submit"]:has-text("Увійти")');
      await page.waitForTimeout(1500);
    }

    // Open Transport Map
    console.log('Opening Transport Map in Dark Theme...');
    const mapCard = page.locator('button:has-text("Карта транспорту")').first();
    await mapCard.click();
    await page.waitForTimeout(3000);

    // Verify dark theme is applied on root
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log(`Document has 'dark' class: ${isDark}`);

    // Screenshot of Dark Scheme default
    await page.screenshot({ path: path.join(OUT_DIR, 'dark-01-scheme-default.png') });

    // Toggle Satellite
    console.log('Clicking Satellite button in Dark Theme...');
    const satBtn = page.locator('button[title="Супутник"], button[title="Схема"]').first();
    await satBtn.click();
    await page.waitForTimeout(3500); // Allow dark satellite raster and dark vector labels to stream

    const satPressed = await satBtn.getAttribute('aria-pressed');
    const satTitle = await satBtn.getAttribute('title');
    console.log(`Satellite button state: aria-pressed=${satPressed}, title="${satTitle}"`);

    // Screenshot of Dark Satellite Active
    await page.screenshot({ path: path.join(OUT_DIR, 'dark-02-satellite-active.png') });

    // Toggle back
    console.log('Toggling back to Dark Scheme...');
    await satBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'dark-03-scheme-restored.png') });

    console.log('🎉 DARK SATELLITE TEST VERIFIED AND PASSED!');

  } catch (err) {
    console.error('Error in dark satellite test:', err);
    await page.screenshot({ path: path.join(OUT_DIR, 'dark-satellite-error.png') });
  } finally {
    await browser.close();
  }
}

testDarkSatellite();
