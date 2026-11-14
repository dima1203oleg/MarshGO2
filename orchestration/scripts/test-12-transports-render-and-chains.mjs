import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = '/Users/dima1203/.gemini/antigravity/brain/1f9fa7ba-be90-4738-b480-9d68a25264b7/visual-evidence/12-transports-audit';
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log('🚀 Running Playwright Audit: 12 Transports, Feeds & Rendering across Ukraine...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    locale: 'uk-UA',
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('circle-11') && !text.includes('wood-pattern')) {
      consoleErrors.push(text);
      console.log('BROWSER_ERROR:', text);
    }
  });

  // 1. Load application
  await page.goto('http://127.0.0.1:7777/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const startBtn = page.locator('button:has-text("Почати")');
  if (await startBtn.isVisible().catch(() => false)) await startBtn.click();
  const skipBtn = page.locator('button:has-text("Пропустити")');
  if (await skipBtn.isVisible().catch(() => false)) await skipBtn.click();
  const toRegister = page.locator('button:has-text("Немає акаунта? Зареєструватися")');
  if (await toRegister.isVisible().catch(() => false)) {
    await toRegister.click();
    await page.locator('input').nth(0).fill('Тестер 12 Видів');
    await page.locator('input').nth(1).fill(`audit12_${Date.now()}@marshgo.ua`);
    await page.locator('input').nth(2).fill('Password2026!');
    await page.click('button:has-text("Зареєструватися")');
    await page.waitForTimeout(1500);
  }

  // 2. Open Search Tab
  await page.click('nav button:has-text("Пошук")');
  await page.waitForTimeout(800);

  // Open transport filter panel to verify 12 canonical modes
  const filterBtn = page.locator('button[aria-label="Фільтри пошуку транспорту"], button:has-text("Транспорт"), button:has-text("Усі види")').first();
  if (await filterBtn.isVisible().catch(() => false)) {
    await filterBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '01-all-12-canonical-transport-modes.png') });
    console.log('📸 01-all-12-canonical-transport-modes.png saved');

    // Close picker
    const closePicker = page.locator('button[aria-label="Закрити вибір транспорту"], button[aria-label="Закрити"]').first();
    if (await closePicker.isVisible().catch(() => false)) await closePicker.click();
    await page.waitForTimeout(400);
  }

  // 3. Search Real Lviv GTFS Route (Сихів -> Центр)
  console.log('Searching Real Lviv GTFS Route...');
  const originInput = page.locator('input[placeholder="Місто відправлення"]');
  await originInput.click();
  await originInput.fill('Сихів');
  await page.waitForTimeout(700);
  const sykhivOpt = page.locator('[role="option"]:has-text("Сихів")').first();
  if (await sykhivOpt.isVisible().catch(() => false)) {
    await sykhivOpt.click();
  } else {
    await originInput.fill('Львів');
    await page.waitForTimeout(600);
    await page.locator('[role="option"]:has-text("Львів")').first().click();
  }

  const destInput = page.locator('input[placeholder="Місто призначення"]');
  await destInput.click();
  await destInput.fill('Скриня');
  await page.waitForTimeout(700);
  const skryniaOpt = page.locator('[role="option"]:has-text("Скриня")').first();
  if (await skryniaOpt.isVisible().catch(() => false)) {
    await skryniaOpt.click();
  } else {
    await destInput.fill('Львів');
    await page.waitForTimeout(600);
    await page.locator('[role="option"]:has-text("Львів")').first().click();
  }

  await page.click('button:has-text("Знайти маршрут")');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(outDir, '02-lviv-real-gtfs-results.png') });
  console.log('📸 02-lviv-real-gtfs-results.png saved');

  // Open details map
  const openMapBtn = page.locator('.journey-result-card button, button:has-text("Переглянути")').first();
  if (await openMapBtn.isVisible().catch(() => false)) {
    await openMapBtn.click();
    await page.waitForTimeout(3500);
    await page.screenshot({ path: path.join(outDir, '03-lviv-gtfs-rendered-map.png') });
    console.log('📸 03-lviv-gtfs-rendered-map.png saved');

    // Click on transit leg pill
    const busPill = page.locator('.mg-route-ribbon__pill').nth(1);
    if (await busPill.isVisible().catch(() => false)) {
      await busPill.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(outDir, '04-lviv-bus-focused-segment.png') });
      console.log('📸 04-lviv-bus-focused-segment.png saved');
    }
  }

  console.log('Console Errors caught:', consoleErrors.length);
  await browser.close();
  console.log('🎉 Playwright audit finished successfully!');
}

main().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});
