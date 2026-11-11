import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity/brain/1f9fa7ba-be90-4738-b480-9d68a25264b7/visual-evidence/audit-loop-2';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
    hasTouch: true,
    geolocation: { latitude: 49.8429, longitude: 24.0311 },
    permissions: ['geolocation'],
  });

  const page = await ctx.newPage();
  console.log('Navigating to http://127.0.0.1:7777/...');
  await page.goto('http://127.0.0.1:7777/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Check if welcome screen is present
  const loginPrompt = page.locator('button:has-text("У мене вже є акаунт")');
  if (await loginPrompt.isVisible()) {
    console.log('Logging in...');
    await loginPrompt.click();
    await page.waitForTimeout(400);
    await page.fill('#login-email', 'dima@marshgo.local');
    await page.fill('#login-password', 'Marshgo#2026dev');
    await page.click('button[type="submit"]:has-text("Увійти")');
    await page.waitForTimeout(2000);
  }

  // 1. Central Action Menu (+)
  try {
    const plusBtn = page.locator('button[aria-label="Створити"], button[aria-label="Дії"], button:has-text("+"), .mg-bottom-nav button').nth(2);
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '01-action-menu-open.png') });
      console.log('Captured 01-action-menu-open.png');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  } catch (err) {
    console.warn('Action menu error:', err.message);
  }

  // 2. Perform search via clicking tab "Пошук"
  try {
    const searchNav = page.locator('.mg-bottom-nav button, nav button').filter({ hasText: 'Пошук' }).first();
    if (await searchNav.isVisible()) {
      await searchNav.click();
      await page.waitForTimeout(800);
    } else {
      await page.goto('http://127.0.0.1:7777/search', { waitUntil: 'networkidle' });
    }

    const originInput = page.locator('input[placeholder="Місто відправлення"]');
    const destInput = page.locator('input[placeholder="Місто призначення"]');
    if (await originInput.isVisible()) {
      await originInput.fill('Львів');
      await page.waitForTimeout(200);
      await destInput.fill('Стрий');
      await page.waitForTimeout(200);
      const submitBtn = page.locator('button.search-submit, button[type="submit"]:has-text("Знайти")').first();
      await submitBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '02-search-results-stryi.png') });
      console.log('Captured 02-search-results-stryi.png');
    }
  } catch (err) {
    console.warn('Search results error:', err.message);
  }

  // 3. Chat / Messages screen
  try {
    const chatBtn = page.locator('button[aria-label*="Повідомлення"], button[aria-label*="Чат"]').first();
    if (await chatBtn.isVisible()) {
      await chatBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '03-chat-screen.png') });
      console.log('Captured 03-chat-screen.png');
    }
  } catch (err) {
    console.warn('Chat error:', err.message);
  }

  // 4. Offer Form (Publish Trip)
  try {
    await page.goto('http://127.0.0.1:7777/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const publishBtn = page.locator('button:has-text("Опублікувати поїздку")').first();
    if (await publishBtn.isVisible()) {
      await publishBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '04-publish-trip-screen.png') });
      console.log('Captured 04-publish-trip-screen.png');
    }
  } catch (err) {
    console.warn('Publish trip error:', err.message);
  }

  // 5. Profile Settings modal
  try {
    await page.goto('http://127.0.0.1:7777/profile', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const settingsBtn = page.locator('button:has-text("Налаштування")').first();
    if (await settingsBtn.isVisible()) {
      await settingsBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '05-profile-settings.png') });
      console.log('Captured 05-profile-settings.png');
    }
  } catch (err) {
    console.warn('Profile settings error:', err.message);
  }

  await browser.close();
  console.log('Audit 2 complete!');
}

runAudit().catch(console.error);
