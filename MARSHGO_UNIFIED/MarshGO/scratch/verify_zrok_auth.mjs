import { chromium } from 'playwright';

async function verifyAuthUI() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  console.log('Navigating to https://marshgo-dima.shares.zrok.io/...');
  await page.goto('https://marshgo-dima.shares.zrok.io/', { waitUntil: 'networkidle' });

  // Handle zrok interstitial if present
  const visitBtn = page.getByRole('button', { name: 'Visit Share' });
  if (await visitBtn.isVisible()) {
    console.log('Clicking zrok interstitial Visit Share button...');
    await visitBtn.click();
    await page.waitForLoadState('networkidle');
  }

  await page.waitForTimeout(1000);
  console.log('Page title:', await page.title());

  // Click "У мене вже є акаунт"
  const accountBtn = page.getByRole('button', { name: 'У мене вже є акаунт' });
  if (await accountBtn.isVisible()) {
    console.log('Clicking "У мене вже є акаунт" button...');
    await accountBtn.click();
  }

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'zrok_auth_screen.png' });
  console.log('Saved screenshot zrok_auth_screen.png');

  // Verify Email and Password inputs
  const emailInput = page.getByPlaceholder('Електронна пошта (email)');
  const passwordInput = page.getByPlaceholder('Пароль');
  const emailVisible = await emailInput.isVisible();
  const passwordVisible = await passwordInput.isVisible();
  console.log('Email input visible:', emailVisible);
  console.log('Password input visible:', passwordVisible);

  // Switch to Registration tab
  const regTab = page.getByRole('button', { name: 'Реєстрація' });
  console.log('Clicking "Реєстрація" tab...');
  await regTab.click();
  await page.waitForTimeout(500);

  const nameInput = page.getByPlaceholder('Ваше ім’я та прізвище');
  const nameVisible = await nameInput.isVisible();
  console.log('Name input visible on registration tab:', nameVisible);

  // Register a new user
  const uniqueEmail = `pwa_user_${Date.now()}@marshgo.local`;
  await nameInput.fill('Олена Петренко');
  await page.getByPlaceholder('Електронна пошта (email)').fill(uniqueEmail);
  await page.getByPlaceholder('Пароль (від 8 символів)').fill('PwaStrongPassword2026!');

  console.log('Submitting registration...');
  await page.getByRole('button', { name: 'Зареєструватися' }).click();

  // Wait for login transition and check profile/search screen
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'zrok_logged_in_pwa.png' });
  console.log('Saved screenshot zrok_logged_in_pwa.png');

  const originInput = page.getByPlaceholder('Місто відправлення');
  const originVisible = await originInput.isVisible();
  console.log('Search origin input visible (logged in):', originVisible);

  await browser.close();
}

verifyAuthUI().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
