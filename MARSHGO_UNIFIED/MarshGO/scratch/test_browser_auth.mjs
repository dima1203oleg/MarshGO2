import { chromium } from 'playwright';

async function testAuthInBrowser() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

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

  // Click "У мене вже є акаунт"
  const accountBtn = page.getByRole('button', { name: 'У мене вже є акаунт' });
  if (await accountBtn.isVisible()) {
    await accountBtn.click();
  }
  await page.waitForTimeout(500);

  // Click "Реєстрація"
  await page.getByRole('button', { name: 'Реєстрація' }).click();
  await page.waitForTimeout(300);

  const testEmail = `pwa_reg_${Date.now()}@example.com`;
  await page.getByPlaceholder('Ваше ім’я та прізвище').fill('Тарас Шевченко');
  await page.getByPlaceholder('Електронна пошта (email)').fill(testEmail);
  await page.getByPlaceholder('Пароль (від 8 символів)').fill('MySecurePassword123!');

  console.log('Clicking "Зареєструватися"...');
  await page.getByRole('button', { name: 'Зареєструватися' }).click();

  await page.waitForTimeout(2000);
  const statusMsg = await page.locator('[role="status"]').allInnerTexts();
  console.log('Status message on page:', statusMsg);

  await page.screenshot({ path: 'scratch/auth_result.png' });
  console.log('Screenshot saved to scratch/auth_result.png');

  await browser.close();
}

testAuthInBrowser().catch(console.error);
