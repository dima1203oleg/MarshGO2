/* global localStorage */
const { chromium } = require('playwright');
const path = require('path');

async function testSearch() {
  const artifactDir = '/Users/dima1203/.gemini/antigravity-ide/brain/e508fd6d-8a68-4a57-9f93-681a5627f9f1';
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const context = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  
  // Set auth in storage
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('marshgo_access_token', 'dev-test-token');
    localStorage.setItem('marshgo_user', JSON.stringify({ id: 'u1', name: 'Олексій', phone: '+380501234567' }));
    localStorage.setItem('mg_onboarding_completed', 'true');
  });

  await page.goto('http://localhost:3000/search', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const fromInput = page.locator('input[placeholder*="відправлення"]').first();
  const toInput = page.locator('input[placeholder*="призначення"]').first();

  if (await fromInput.isVisible() && await toInput.isVisible()) {
    await fromInput.fill('Київ');
    await page.waitForTimeout(400);
    await toInput.fill('Львів');
    await page.waitForTimeout(400);

    const searchBtn = page.locator('button:has-text("Знайти маршрут")').first();
    await searchBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, '15_search_results_with_query.png') });

    // Click on the first result card if found
    const firstResult = page.locator('button:has-text("грн"), div[role="button"], article, .cursor-pointer').first();
    if (await firstResult.isVisible()) {
      await firstResult.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(artifactDir, '16_route_detail_modal.png') });
    }
  }

  await browser.close();
  console.log('SEARCH_WITH_QUERY_DONE');
}

testSearch().catch(console.error);
