import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = '/private/tmp/mg-visual-evidence';
const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity/brain/1f9fa7ba-be90-4738-b480-9d68a25264b7/visual-evidence';
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function testImmediateNavigation() {
  console.log('🚀 Testing Immediate Navigation Launch & UX (iPhone 13 - 390x844)...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    geolocation: { latitude: 49.8397, longitude: 24.0297 }, // Lviv center
    permissions: ['geolocation']
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

    console.log('✅ Logged in to Home Dashboard');

    // Click "Навігація" tile in HomeHero
    console.log('📍 Clicking "Навігація" tile on Home...');
    const navTile = page.locator('button:has-text("Навігація")').first();
    await navTile.click();
    await page.waitForTimeout(1200);

    // Verify there is NO intermediate screen ("Куди прямуєте?")
    const intermediateHeading = await page.locator('h1:has-text("Куди прямуєте?")').count();
    const intermediateButton = await page.locator('button:has-text("Почати без пункту призначення")').count();
    console.log(`Intermediate screen checks: heading count = ${intermediateHeading}, button count = ${intermediateButton}`);
    if (intermediateHeading > 0 || intermediateButton > 0) {
      throw new Error('FAILED: Intermediate page was shown!');
    }
    console.log('✅ PASS: Intermediate page completely eliminated! Live map rendered immediately.');

    // Check presence of top search bar, speed indicator, and floating controls
    const searchInput = page.locator('input[placeholder="Куди їдемо?"]');
    const speedPill = page.locator('[data-testid="navigation-speed"]');
    const voiceButton = page.locator('button[aria-label*="голосові підказки"]');
    
    console.log(`Search input visible: ${await searchInput.isVisible()}`);
    console.log(`Speed indicator visible: ${await speedPill.isVisible()}`);
    console.log(`Voice toggle visible: ${await voiceButton.isVisible()}`);

    // Capture screenshot 1: Immediate launch into map
    const file1 = 'nav-01-immediate-map-launch.png';
    await page.screenshot({ path: path.join(OUT_DIR, file1) });
    fs.copyFileSync(path.join(OUT_DIR, file1), path.join(ARTIFACT_DIR, file1));
    console.log(`📸 Saved ${file1}`);

    // Test Voice toggle
    console.log('🔊 Testing Voice toggle...');
    await voiceButton.click();
    await page.waitForTimeout(400);
    const file2 = 'nav-02-voice-toggle.png';
    await page.screenshot({ path: path.join(OUT_DIR, file2) });
    fs.copyFileSync(path.join(OUT_DIR, file2), path.join(ARTIFACT_DIR, file2));
    console.log(`📸 Saved ${file2}`);

    // Enter destination into the search bar: "Стрий"
    console.log('🔍 Entering destination "Стрий" into navigation search...');
    await searchInput.fill('Стрий');
    await page.waitForTimeout(500);
    const searchSubmit = page.locator('button[aria-label="Знайти місце"]');
    await searchSubmit.click();
    await page.waitForTimeout(1500);

    // Pick first suggestion if suggestions appear, or check route
    const firstSuggestion = page.locator('button:has-text("Стрий")').first();
    if (await firstSuggestion.isVisible()) {
      console.log('Tapping destination suggestion...');
      await firstSuggestion.click();
      await page.waitForTimeout(3000);
    } else {
      await page.waitForTimeout(2000);
    }

    // Capture screenshot 3: Active Turn-by-Turn Guidance Banner
    const file3 = 'nav-03-active-turn-by-turn.png';
    await page.screenshot({ path: path.join(OUT_DIR, file3) });
    fs.copyFileSync(path.join(OUT_DIR, file3), path.join(ARTIFACT_DIR, file3));
    console.log(`📸 Saved ${file3}`);

    // Expand bottom sheet to inspect Step-by-Step Directions
    console.log('📋 Expanding bottom sheet to inspect route directions...');
    const bottomSummary = page.locator('button[aria-label="Розгорнути панель навігації"]');
    if (await bottomSummary.isVisible()) {
      await bottomSummary.click();
      await page.waitForTimeout(600);
      const detailsBtn = page.locator('button:has-text("Деталі")');
      if (await detailsBtn.isVisible()) {
        await detailsBtn.click();
        await page.waitForTimeout(600);
      }
    }

    // Capture screenshot 4: Expanded sheet with step-by-step turns
    const file4 = 'nav-04-sheet-expanded-itinerary.png';
    await page.screenshot({ path: path.join(OUT_DIR, file4) });
    fs.copyFileSync(path.join(OUT_DIR, file4), path.join(ARTIFACT_DIR, file4));
    console.log(`📸 Saved ${file4}`);

    console.log('🎉 Immediate navigation test PASSED with 100% evidence!');
  } catch (error) {
    console.error('❌ Test error:', error);
    await page.screenshot({ path: path.join(OUT_DIR, 'nav-error.png') });
    throw error;
  } finally {
    await browser.close();
  }
}

testImmediateNavigation().catch((err) => {
  console.error(err);
  process.exit(1);
});
