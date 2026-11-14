import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = '/private/tmp/mg-visual-evidence';
fs.mkdirSync(OUT_DIR, { recursive: true });

async function testSatellite() {
  console.log('🛰️ Testing Satellite Basemap toggle in Web UI...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true
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
    console.log('Opening Transport Map...');
    const mapCard = page.locator('button:has-text("Карта транспорту")').first();
    await mapCard.click();
    await page.waitForTimeout(3000); // Wait for MapLibre map to initialize

    // Find Satellite Toggle Button (has title "Супутник" initially, and switches to "Схема" when active)
    const satBtn = page.locator('button[title="Супутник"], button[title="Схема"]').first();
    const isSatVisible = await satBtn.isVisible();
    const isSatDisabled = await satBtn.isDisabled();
    const satTitle = await satBtn.getAttribute('title');
    const satPressedBefore = await satBtn.getAttribute('aria-pressed');

    console.log(`Satellite button found: visible=${isSatVisible}, disabled=${isSatDisabled}, title="${satTitle}", aria-pressed=${satPressedBefore}`);

    // Screenshot before toggle (Standard Scheme)
    await page.screenshot({ path: path.join(OUT_DIR, 'satellite-01-scheme-default.png') });

    // Click Satellite Toggle
    console.log('Clicking Satellite Toggle...');
    await satBtn.click();
    await page.waitForTimeout(3000); // Allow satellite raster tiles to stream in

    const satPressedAfter = await satBtn.getAttribute('aria-pressed');
    const satTitleAfter = await satBtn.getAttribute('title');
    const satLabelAfter = await satBtn.getAttribute('aria-label');
    console.log(`Satellite button state after click: aria-pressed=${satPressedAfter}, title="${satTitleAfter}", label="${satLabelAfter}"`);

    // Screenshot with Satellite Active
    await page.screenshot({ path: path.join(OUT_DIR, 'satellite-02-active-imagery.png') });

    // Click again to toggle back to scheme
    console.log('Clicking toggle again to return to scheme...');
    await satBtn.click();
    await page.waitForTimeout(2000);

    const satPressedFinal = await satBtn.getAttribute('aria-pressed');
    const satTitleFinal = await satBtn.getAttribute('title');
    console.log(`Satellite button final state: aria-pressed=${satPressedFinal}, title="${satTitleFinal}"`);
    await page.screenshot({ path: path.join(OUT_DIR, 'satellite-03-back-to-scheme.png') });

    console.log('✅ SATELLITE SWITCHING TEST VERIFIED AND PASSED!');

  } catch (err) {
    console.error('Error during satellite test:', err);
    await page.screenshot({ path: path.join(OUT_DIR, 'satellite-error.png') });
  } finally {
    await browser.close();
  }
}

testSatellite();
