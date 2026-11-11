import { chromium } from 'playwright';

async function testLoginInBrowser() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

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

  // Click "У мене вже є акаунт"
  const accountBtn = page.getByRole('button', { name: 'У мене вже є акаунт' });
  if (await accountBtn.isVisible()) {
    await accountBtn.click();
  }
  await page.waitForTimeout(500);

  // By default we are on the "Вхід" tab
  await page.getByPlaceholder('Електронна пошта (email)').fill('production_user@example.com');
  await page.getByPlaceholder('Пароль').fill('FinalStrongPassword789!');

  console.log('Clicking "Увійти"...');
  await page.getByRole('button', { name: 'Увійти' }).click();

  await page.waitForTimeout(2000);
  const statusMsg = await page.locator('[role="status"]').allInnerTexts();
  console.log('Status message on page:', statusMsg);

  await page.screenshot({ path: 'scratch/login_result.png' });
  console.log('Screenshot saved to scratch/login_result.png');

  // Verify that the user profile name or home UI is visible
  const searchInput = page.getByPlaceholder('Місто відправлення');
  console.log('Home search input visible after login:', await searchInput.isVisible());

  await browser.close();
}

testLoginInBrowser().catch(console.error);
