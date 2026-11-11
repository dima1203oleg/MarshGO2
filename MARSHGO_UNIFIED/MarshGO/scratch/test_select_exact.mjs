import { chromium } from 'playwright';

async function testExact() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  page.on('response', (res) => {
    if (res.url().includes('/api/v1/')) {
      console.log('API RESPONSE:', res.status(), res.url());
    }
  });

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

  // Type Origin and wait for suggestion
  const originInput = page.getByPlaceholder('Місто відправлення');
  await originInput.click();
  await originInput.fill('Львів');
  await page.waitForTimeout(1000);
  const lvivSugg = page.getByText('Львів, Львівська міська громада').first();
  await lvivSugg.waitFor({ state: 'visible', timeout: 5000 });
  console.log('Clicking Lviv suggestion...');
  await lvivSugg.click();
  await page.waitForTimeout(500);

  // Type Destination and wait for suggestion
  const destInput = page.getByPlaceholder('Місто призначення');
  await destInput.click();
  await destInput.fill('Стрий');
  await page.waitForTimeout(1000);
  const stryiSugg = page.getByText('Стрий, Стрийська міська громада').first();
  await stryiSugg.waitFor({ state: 'visible', timeout: 5000 });
  console.log('Clicking Stryi suggestion...');
  await stryiSugg.click();
  await page.waitForTimeout(500);

  console.log('Clicking "Знайти маршрут"...');
  await page.getByRole('button', { name: 'Знайти маршрут' }).click();

  // Wait for results
  await page.waitForTimeout(5000);
  const statusMsg = await page.locator('[role="status"]').allInnerTexts();
  console.log('Status message:', statusMsg);

  await page.screenshot({ path: 'scratch/results_exact.png' });
  console.log('Saved screenshot scratch/results_exact.png');

  await browser.close();
}

testExact().catch(console.error);
