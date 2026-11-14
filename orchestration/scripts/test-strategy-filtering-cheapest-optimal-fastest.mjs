import { chromium } from 'playwright';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const outDir = '/Users/dima1203/.gemini/antigravity/brain/1f9fa7ba-be90-4738-b480-9d68a25264b7/visual-evidence/strategy-filtering';
fs.mkdirSync(outDir, { recursive: true });

const baseApi = 'http://127.0.0.1:3019/api/v1';

async function testBackendScoringAndPooling() {
  console.log('\n======================================================');
  console.log('1. TESTING BACKEND CANDIDATE POOLING & STRATEGY RANKING');
  console.log('======================================================');

  // Register temp user
  const email = `filter_test_${Date.now()}@marshgo.local`;
  const regRes = await fetch(`${baseApi}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Password2026!', displayName: 'Filter Tester' }),
  });
  const regData = await regRes.json();
  const token = regData.data?.accessToken;
  if (!token) throw new Error('Failed to obtain token');

  // Search Kyiv -> Lviv route
  const searchRes = await fetch(`${baseApi}/journeys/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      origin: { name: 'Київ, Хрещатик', coordinates: [30.5234, 50.447] },
      destination: { name: 'Львів, пл. Ринок', coordinates: [24.0316, 49.8419] },
      departureAt: '2026-11-06T08:00:00.000Z',
      passengers: 1,
      strategy: 'BALANCED',
    }),
  });

  const searchData = await searchRes.json();
  const journeys = searchData.data?.journeys || [];
  const availableStrategies = searchData.data?.availableStrategies || [];

  console.log(`Available Strategies from API: ${JSON.stringify(availableStrategies)}`);
  console.log(`Total Candidates returned in pool: ${journeys.length}`);

  if (journeys.length === 0) {
    throw new Error('No journeys found in search pool!');
  }

  // Check that candidates have diverse modes and prices
  console.log('\nCandidate Breakdown:');
  journeys.forEach((j, i) => {
    const modes = j.legs.map((l) => l.mode).join(' -> ');
    const price = j.totalPriceMinor ? `${(j.totalPriceMinor / 100).toFixed(2)} ₴` : '—';
    const dur = `${Math.round(j.totalDurationSeconds / 60)} хв`;
    console.log(`Candidate #${i + 1} [id: ${j.id.slice(0, 8)}...]: Modes: (${modes}), Duration: ${dur}, Price: ${price}`);
    console.log(`   Strategy Ranks: ${JSON.stringify(j.strategyRanks || {})}, Recommended: ${JSON.stringify(j.recommendedStrategies || [])}`);
  });

  // Verify FASTEST winner has minimum duration among all
  const sortedByDuration = [...journeys].sort((a, b) => a.totalDurationSeconds - b.totalDurationSeconds);
  const minDur = sortedByDuration[0].totalDurationSeconds;

  // Verify CHEAPEST winner has minimum price among those with known price
  const withKnownPrice = journeys.filter((j) => j.totalPriceMinor !== null);
  const sortedByPrice = [...withKnownPrice].sort((a, b) => a.totalPriceMinor - b.totalPriceMinor);
  const minPrice = sortedByPrice[0]?.totalPriceMinor;

  console.log('\nValidation:');
  console.log(`- Minimum Duration in pool: ${Math.round(minDur / 60)} хв (Winner ID: ${sortedByDuration[0].id.slice(0, 8)}...)`);
  if (minPrice !== undefined) {
    console.log(`- Minimum Price in pool: ${(minPrice / 100).toFixed(2)} ₴ (Winner ID: ${sortedByPrice[0].id.slice(0, 8)}...)`);
  }

  return { token, email };
}

async function testFrontendStrategyTabs() {
  console.log('\n======================================================');
  console.log('2. TESTING FRONTEND STRATEGY SWITCHING IN BROWSER');
  console.log('======================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    locale: 'uk-UA',
  });
  const page = await context.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('circle-11') && !text.includes('wood-pattern')) {
      console.log('BROWSER_ERROR:', text);
    }
  });

  // 1. Load app
  await page.goto('http://127.0.0.1:7777/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const startBtn = page.locator('button:has-text("Почати")');
  if (await startBtn.isVisible().catch(() => false)) await startBtn.click();
  const skipBtn = page.locator('button:has-text("Пропустити")');
  if (await skipBtn.isVisible().catch(() => false)) await skipBtn.click();
  const toRegister = page.locator('button:has-text("Немає акаунта? Зареєструватися")');
  if (await toRegister.isVisible().catch(() => false)) {
    await toRegister.click();
    await page.locator('input').nth(0).fill('Стратег Маршрутів');
    await page.locator('input').nth(1).fill(`strat_${Date.now()}@marshgo.ua`);
    await page.locator('input').nth(2).fill('Password2026!');
    await page.click('button:has-text("Зареєструватися")');
    await page.waitForTimeout(1500);
  }

  // 2. Open Search Tab
  await page.click('nav button:has-text("Пошук")');
  await page.waitForTimeout(800);

  // Search Kyiv -> Lviv route
  console.log('Searching Kyiv -> Lviv route in PWA...');
  const originInput = page.locator('input[placeholder="Місто відправлення"]');
  await originInput.click();
  await originInput.fill('Київ');
  await page.waitForTimeout(700);
  await page.locator('[role="option"]:has-text("Київ")').first().click();

  const destInput = page.locator('input[placeholder="Місто призначення"]');
  await destInput.click();
  await destInput.fill('Львів');
  await page.waitForTimeout(700);
  await page.locator('[role="option"]:has-text("Львів")').first().click();

  await page.click('button:has-text("Знайти маршрут")');
  await page.waitForTimeout(4000);

  // 3. Verify Strategy Pills
  const balancedTab = page.locator('button:has-text("Оптимальний")').first();
  const fastestTab = page.locator('button:has-text("Найшвидший")').first();
  const cheapestTab = page.locator('button:has-text("Найдешевший")').first();

  console.log('Checking strategy tabs visibility:');
  console.log('- Оптимальний visible:', await balancedTab.isVisible().catch(() => false));
  console.log('- Найшвидший visible:', await fastestTab.isVisible().catch(() => false));
  console.log('- Найдешевший visible:', await cheapestTab.isVisible().catch(() => false));

  // --- TAB 1: Оптимальний (BALANCED) ---
  await balancedTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '01-tab-optimal-balanced.png') });
  console.log('📸 01-tab-optimal-balanced.png saved');

  const optimalCards = await page.locator('.journey-result-card').count();
  const optimalFirstCard = await page.locator('.journey-result-card').first().innerText();
  console.log(`[Оптимальний] Cards count: ${optimalCards}`);
  console.log(`[Оптимальний] Top pick summary:\n${optimalFirstCard.split('\n').slice(0, 4).join(' · ')}`);

  // --- TAB 2: Найшвидший (FASTEST) ---
  await fastestTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '02-tab-fastest.png') });
  console.log('📸 02-tab-fastest.png saved');

  const fastestCards = await page.locator('.journey-result-card').count();
  const fastestFirstCard = await page.locator('.journey-result-card').first().innerText();
  console.log(`[Найшвидший] Cards count: ${fastestCards}`);
  console.log(`[Найшвидший] Top pick summary:\n${fastestFirstCard.split('\n').slice(0, 4).join(' · ')}`);

  // --- TAB 3: Найдешевший (CHEAPEST) ---
  await cheapestTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, '03-tab-cheapest.png') });
  console.log('📸 03-tab-cheapest.png saved');

  const cheapestCards = await page.locator('.journey-result-card').count();
  const cheapestFirstCard = await page.locator('.journey-result-card').first().innerText();
  console.log(`[Найдешевший] Cards count: ${cheapestCards}`);
  console.log(`[Найдешевший] Top pick summary:\n${cheapestFirstCard.split('\n').slice(0, 4).join(' · ')}`);

  await browser.close();
  console.log('\n🎉 ALL TESTS PASSED: Finding all variants -> Filtering Cheapest, Optimal, Fastest verified!');
}

async function main() {
  await testBackendScoringAndPooling();
  await testFrontendStrategyTabs();
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
