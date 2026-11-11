import { chromium } from 'playwright';

async function testCompleteJourneyFlow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ['geolocation'],
    geolocation: { latitude: 49.8397, longitude: 24.0297 }, // Lviv center
  });
  const page = await context.newPage();

  await page.goto('https://marshgo-dima.shares.zrok.io/', { waitUntil: 'networkidle' });
  const visitBtn = page.getByRole('button', { name: 'Visit Share' });
  if (await visitBtn.isVisible()) {
    await visitBtn.click();
    await page.waitForLoadState('networkidle');
  }

  // Log in
  await page.getByRole('button', { name: 'У мене вже є акаунт' }).click();
  await page.getByPlaceholder('Електронна пошта (email)').fill('production_user@example.com');
  await page.getByPlaceholder('Пароль').fill('FinalStrongPassword789!');
  await page.getByRole('button', { name: 'Увійти' }).click();

  await page.waitForSelector('header.app-header', { timeout: 10000 });
  console.log('User logged in!');

  // Navigate to Search
  await page.getByRole('button', { name: 'Пошук', exact: true }).click();
  await page.waitForTimeout(500);

  // Fill in origin & destination
  const originInput = page.getByPlaceholder('Місто відправлення');
  const destInput = page.getByPlaceholder('Місто призначення');

  await originInput.fill('Львів');
  await destInput.fill('Стрий');

  console.log('Submitting search...');
  await page.getByRole('button', { name: 'Знайти маршрут' }).click();

  // Wait for results
  await page.waitForSelector('.journey-results-header, .search-results-list, [role="region"]', { timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'scratch/journey_search_verified.png' });
  console.log('Saved screenshot scratch/journey_search_verified.png');

  const text = await page.innerText('body');
  console.log('Page text snapshot:', text.replace(/\n+/g, ' | ').slice(0, 500));

  await browser.close();
}

testCompleteJourneyFlow().catch(console.error);
