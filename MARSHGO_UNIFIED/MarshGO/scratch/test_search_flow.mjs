import { chromium } from 'playwright';

async function testSearchFlow() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
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
  console.log('Logged in successfully!');

  // Switch to Search tab
  console.log('Navigating to Search tab...');
  await page.getByRole('button', { name: 'Пошук', exact: true }).click();
  await page.waitForTimeout(1000);

  const originInput = page.getByPlaceholder('Місто відправлення');
  const destInput = page.getByPlaceholder('Місто призначення');
  console.log('Search inputs visible:', await originInput.isVisible(), await destInput.isVisible());

  await originInput.fill('Львів');
  await destInput.fill('Стрий');

  console.log('Submitting search with "Знайти маршрут"...');
  await page.getByRole('button', { name: 'Знайти маршрут' }).click();

  // Wait for results
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'scratch/search_results_live.png' });
  console.log('Screenshot saved to scratch/search_results_live.png');

  const bodyText = await page.innerText('body');
  const hasResults = bodyText.includes('Маршрут:') || bodyText.includes('Попутки MARSHGO') || bodyText.includes('варіант');
  console.log('Has route search results:', hasResults);

  await browser.close();
}

testSearchFlow().catch((err) => {
  console.error('Test search failed:', err);
  process.exit(1);
});
