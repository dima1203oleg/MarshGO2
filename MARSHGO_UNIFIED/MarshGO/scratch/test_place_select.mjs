import { chromium } from 'playwright';

async function testSelectAndSearch() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
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

  // Go to search
  await page.getByRole('button', { name: 'Пошук', exact: true }).click();
  await page.waitForTimeout(500);

  // Focus origin and type Львів
  const originInput = page.getByPlaceholder('Місто відправлення');
  await originInput.focus();
  await originInput.fill('Львів');
  await page.waitForTimeout(800);
  const originFirstSugg = page.locator('div[aria-label="Варіанти місць відправлення"] button').first();
  if (await originFirstSugg.isVisible()) {
    console.log('Clicking origin suggestion:', await originFirstSugg.innerText());
    await originFirstSugg.click();
  }

  // Focus destination and type Стрий
  const destInput = page.getByPlaceholder('Місто призначення');
  await destInput.focus();
  await destInput.fill('Стрий');
  await page.waitForTimeout(800);
  const destFirstSugg = page.locator('div[aria-label="Варіанти місць призначення"] button').first();
  if (await destFirstSugg.isVisible()) {
    console.log('Clicking destination suggestion:', await destFirstSugg.innerText());
    await destFirstSugg.click();
  }

  console.log('Clicking "Знайти маршрут"...');
  await page.getByRole('button', { name: 'Знайти маршрут' }).click();

  // Wait for results
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'scratch/search_results_flow.png' });
  console.log('Saved screenshot scratch/search_results_flow.png');

  const text = await page.innerText('body');
  console.log('Search page text snippet:', text.replace(/\n+/g, ' | ').slice(0, 600));

  await browser.close();
}

testSelectAndSearch().catch(console.error);
