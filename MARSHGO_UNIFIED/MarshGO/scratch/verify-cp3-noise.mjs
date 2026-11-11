// PREMIUM-8 CP3 live verification (acceptance stack, real API, throwaway account).
// Run from /Users/dima1203/Desktop/MarshGO with the Site preview on :4173 proxying :3902.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
const OUT = process.env.OUT_DIR ?? '/tmp/cp3-evidence';
mkdirSync(OUT, { recursive: true });

const email = `cp3.verify.${Date.now()}@marshgo.ua`;
const password = 'Password2026!';
const shots = [];
const facts = { base: BASE, viewport: '430x932' };
const errors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
page.on('pageerror', (error) => errors.push(String(error.message).slice(0, 160)));

// 1 — register a throwaway passenger against the real acceptance API.
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.locator('button:has-text("У мене вже є акаунт")').click({ timeout: 20_000 });
await page.locator('button:has-text("Немає акаунта? Зареєструватися")').click({ timeout: 20_000 });
await page.locator('input[autocomplete="name"]').fill('CP3 Verify');
await page.locator('input[type="email"]').fill(email);
await page.locator('input[autocomplete="new-password"]').fill(password);
const [registerResponse] = await Promise.all([
  page.waitForResponse((r) => new URL(r.url()).pathname === '/api/v1/auth/register', { timeout: 30_000 }),
  page.locator('button:has-text("Зареєструватися")').click(),
]);
facts.registerStatus = registerResponse.status();
await page.waitForSelector('.production-app', { timeout: 30_000 });

// 2 — Профіль › Джерела даних must render the real server provenance payload.
await page.locator('[data-testid="global-bottom-navigation"] button:has-text("Профіль")').click({ timeout: 20_000 });
await page.locator('button:has-text("Джерела даних")').click({ timeout: 20_000 });
const cities = page.locator('[data-testid="profile-source-city"]');
await cities.first().waitFor({ timeout: 25_000 });
facts.sourceCityCount = await cities.count();
facts.firstSourceCity = (await cities.first().innerText()).replace(/\s+/g, ' ').slice(0, 240);
facts.sourceLinkCount = await page.locator('a:has-text("Першоджерело")').count();
facts.sourceLinkMinHeight = await page.locator('a:has-text("Першоджерело")').first().evaluate((el) => el.getBoundingClientRect().height);
await page.locator('[data-testid="profile-source-city"]').first().screenshot({ path: `${OUT}/01-profile-sources.png` });
shots.push('01-profile-sources.png');
await page.locator('button[aria-label="Назад до профілю"]').click({ timeout: 15_000 });
await page.locator('button:has-text("Приватність і геолокація")').click({ timeout: 15_000 });
facts.rendezvousHumanCopy = await page.locator('p:has-text("близько двох хвилин")').count();
facts.redisMentions = await page.locator('text=/\\b(Redis|TTL)\\b/').count();
await page.locator('div:has(> b:has-text("Точка зустрічі зберігається тимчасово"))').screenshot({ path: `${OUT}/04-privacy-retention.png` });
shots.push('04-privacy-retention.png');

// 3 — results cards must not repeat the strategy the passenger already chose.
await page.locator('[data-testid="global-bottom-navigation"] button:has-text("Пошук")').click({ timeout: 20_000 });
const pickPlace = async (group, listId, text) => {
  await page.locator(`[role="group"][aria-label="${group}"] input`).waitFor({ timeout: 20_000 });
  await page.locator(`[role="group"][aria-label="${group}"] input`).fill(text);
  await page.locator(`#${listId} button`).first().waitFor({ timeout: 25_000 });
  await page.locator(`#${listId} button`).first().click();
};
await pickPlace('Початкова точка', 'route-place-origin-list', 'Львів');
await pickPlace('Кінцева точка', 'route-place-destination-list', 'Трускавець');
const [searchResponse] = await Promise.all([
  page.waitForResponse((r) => new URL(r.url()).pathname === '/api/v1/journeys/search', { timeout: 90_000 }),
  page.locator('button.search-submit').click(),
]);
facts.searchStatus = searchResponse.status();
await page.waitForSelector('.journey-result-card', { timeout: 90_000 });
facts.resultCards = await page.locator('.journey-result-card').count();
facts.strategyBadges = await page.locator('.journey-result-action-badge').count();
facts.transferBadges = await page.locator('[data-testid="journey-result-transfers"]').count();
facts.transferBadgeSize = await page.locator('[data-testid="journey-result-transfers"]').first().evaluate((el) => { const r = el.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}`; });
facts.unknownFareCaptions = await page.locator('text=тариф невідомий').count();
await page.screenshot({ path: `${OUT}/02-results-no-badge.png`, fullPage: false });
shots.push('02-results-no-badge.png');

// 4 — the transport map must no longer carry the provenance footnote.
await page.locator('button[aria-label="Створити поїздку або запит"]').click({ timeout: 20_000 });
await page.locator('button:has-text("Карта транспорту")').click({ timeout: 15_000 });
await page.locator('h1:has-text("Карта транспорту")').waitFor({ timeout: 25_000 });
await page.waitForTimeout(5_000);
facts.mapSourceDataLink = await page.locator('a:has-text("Джерело даних")').count();
facts.mapCoverageLine = (await page.locator('p:has-text("зупинок")').first().innerText().catch(() => 'n/a')).replace(/\s+/g, ' ');
await page.screenshot({ path: `${OUT}/03-transport-map.png`, fullPage: false });
shots.push('03-transport-map.png');

facts.pageErrors = errors;
console.log(JSON.stringify({ facts, shots }, null, 2));
await browser.close();
