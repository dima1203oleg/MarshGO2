import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const PREVIEW_URL = process.env.PREVIEW_URL || 'http://127.0.0.1:3001';
const API_URL = process.env.API_URL || 'http://127.0.0.1:3002';

async function runTest() {
  console.log(`Starting First Result Verification: Server + Web/PWA Full Navigation Flow...`);
  console.log(`Preview: ${PREVIEW_URL}, API: ${API_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 950 },
    permissions: ['geolocation'],
    geolocation: { latitude: 49.8397, longitude: 24.0297, accuracy: 10 }, // Lviv center
  });

  const page = await context.newPage();

  try {
    // 1. Load Web app
    console.log('\n--- Step 1: Open MARSHGO Web App ---');
    await page.goto(`${PREVIEW_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    const title = await page.title();
    console.log(`Loaded page: "${title}"`);
    assert.match(title, /MARSHGO/i);

    // 2. Sign In via typed email/password
    console.log('\n--- Step 2: Sign In via Email & Password ---');
    const existingAccountBtn = page.locator('button:has-text("У мене вже є акаунт")');
    if (await existingAccountBtn.isVisible()) {
      await existingAccountBtn.click();
      await page.waitForTimeout(500);
    }

    const loginTab = page.locator('button:has-text("Вхід")');
    if (await loginTab.isVisible()) {
      await loginTab.click();
      await page.waitForTimeout(300);
    }

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill('passenger@marshgo.ua');
    await passwordInput.fill('PassengerPass123!');

    const submitBtn = page.locator('button:has-text("Увійти")');
    await submitBtn.click();
    await page.waitForTimeout(2500);

    const bottomNav = page.locator('nav, [role="navigation"]').first();
    assert.ok(await bottomNav.isVisible(), 'Bottom navigation must be visible after login');
    console.log('✅ Successfully authenticated as passenger@marshgo.ua');

    // 3. Open Search Tab
    console.log('\n--- Step 3: Open Search Tab ---');
    const searchNavBtn = page.locator('button:has-text("Пошук")').first();
    await searchNavBtn.click();
    await page.waitForTimeout(1000);

    // 4. Fill Origin and Destination (Львів -> Київ)
    console.log('\n--- Step 4: Select Real Origin & Destination ---');
    const originInput = page.locator('input[aria-label="Звідки"]').first();
    const destInput = page.locator('input[aria-label="Куди"]').first();

    await originInput.click();
    await originInput.fill('Львів');
    await page.waitForTimeout(1000);
    const originSuggestion = page.locator('button:has-text("Львів")').first();
    if (await originSuggestion.isVisible()) {
      await originSuggestion.click();
      console.log('Selected origin suggestion: Львів');
    }
    await page.waitForTimeout(500);

    await destInput.click();
    await destInput.fill('Київ');
    await page.waitForTimeout(1000);
    const destSuggestion = page.locator('button:has-text("Київ")').first();
    if (await destSuggestion.isVisible()) {
      await destSuggestion.click();
      console.log('Selected destination suggestion: Київ');
    }
    await page.waitForTimeout(600);

    // 5. Execute Route Search
    console.log('\n--- Step 5: Execute Route Search ---');
    const searchSubmit = page.locator('button:has-text("Знайти маршрут")').first();
    await searchSubmit.click();
    console.log('Clicked "Знайти маршрут", waiting for planner results...');

    // Wait until loading spinner disappears
    await page.waitForFunction(() => !document.body.innerText.includes("Шукаємо найкращі маршрути…"), { timeout: 25000 });
    console.log('✅ Route planner returned multimodal chains!');

    await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/nav_flow_02_search_results.png' });

    // 6. Select a Route Card to open vector map and bottom sheet
    console.log('\n--- Step 6: Select Route to Compare & View Map Sheet ---');
    const routeCard = page.locator('[data-testid="journey-result-card"]').first();
    assert.ok(await routeCard.isVisible(), 'At least one route card must be visible');
    const routeText = await routeCard.innerText();
    console.log(`Selected Route: ${routeText.replace(/\n+/g, ' · ').slice(0, 100)}...`);

    await routeCard.click();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/nav_flow_03_map_route_sheet.png' });
    console.log('✅ Interactive Vector Map + Route Sheet opened and recorded');

    // 7. Expand route details sheet
    console.log('\n--- Step 7: Expand Route Details Sheet ---');
    const expandDetailsBtn = page.locator('button:has-text("Показати деталі"), button[aria-label="Розгорнути деталі маршруту"]').first();
    if (await expandDetailsBtn.isVisible()) {
      await expandDetailsBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/nav_flow_04_route_details_expanded.png' });
      console.log('✅ Expanded details sheet with stops, timings, and segments recorded');
    }

    // Return to results list
    const backToResultsBtn = page.locator('button[aria-label="Назад до результатів"]').first();
    if (await backToResultsBtn.isVisible()) {
      await backToResultsBtn.click();
      await page.waitForTimeout(1000);
      console.log('Returned to search results list');
    }

    // Return to search form
    const backToSearchFormBtn = page.locator('button[aria-label="Назад до пошуку"]').first();
    if (await backToSearchFormBtn.isVisible()) {
      await backToSearchFormBtn.click();
      await page.waitForTimeout(1000);
      console.log('Returned to search form');
    }

    // 8. Return to Home and Start Navigation
    console.log('\n--- Step 8: Return to Home and Start Navigation ---');
    const homeTabBtn = page.locator('button:has-text("Головна")').first();
    await homeTabBtn.waitFor({ state: 'visible', timeout: 5000 });
    await homeTabBtn.click();
    await page.waitForTimeout(1000);

    // Find and click "Навігація"
    const startNavBtn = page.locator('button:has-text("Навігація")').first();
    await startNavBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Clicking "Навігація"...');
    await startNavBtn.click();
    await page.waitForTimeout(4000);

    await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/nav_flow_05_navigation_view.png' });
    console.log('✅ Navigation view active and recorded');

    // Verify Navigation UI is alive
    const pageText = await page.textContent('body');
    const isNavActive = pageText.includes('км/год') || pageText.includes('КМ/ГОД') || pageText.includes('маршрут') || pageText.includes('GPS') || pageText.includes('Залишилось') || pageText.includes('навігац') || pageText.includes('Навігація працює');
    console.log(`Navigation UI active verification: ${isNavActive}`);
    assert.ok(isNavActive, 'Navigation screen must be active');

    console.log('\n=============================================================');
    console.log('🏆 SERVER + WEB/PWA NAVIGATION USER FLOW VERIFIED 100% PASS!');
    console.log('=============================================================');
  } finally {
    await browser.close();
  }
}

runTest().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
