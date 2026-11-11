import { chromium } from 'playwright';

async function testWaitForSearchResponse() {
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

  await page.getByRole('button', { name: 'Пошук', exact: true }).click();
  await page.waitForTimeout(500);

  const originInput = page.getByPlaceholder('Місто відправлення');
  await originInput.click();
  await originInput.fill('Львів');
  await page.waitForTimeout(1000);
  await page.getByText('Львів, Львівська міська громада').first().click();

  const destInput = page.getByPlaceholder('Місто призначення');
  await destInput.click();
  await destInput.fill('Стрий');
  await page.waitForTimeout(1000);
  await page.getByText('Стрий, Стрийська міська громада').first().click();

  console.log('Submitting form by clicking Знайти маршрут...');
  const searchPromise = page.waitForResponse(
    (res) => res.url().includes('/api/v1/journeys/search') && res.request().method() === 'POST',
    { timeout: 35000 }
  );
  await page.getByRole('button', { name: 'Знайти маршрут' }).click();

  const response = await searchPromise;
  console.log('JOURNEYS/SEARCH STATUS:', response.status());
  const json = await response.json();
  console.log('Journeys count:', json.data?.journeys?.length ?? 0);

  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'scratch/journeys_rendered.png' });
  console.log('Saved screenshot scratch/journeys_rendered.png');

  const text = await page.innerText('body');
  console.log('Results text snippet:', text.replace(/\n+/g, ' | ').slice(0, 500));

  await browser.close();
}

testWaitForSearchResponse().catch(console.error);
