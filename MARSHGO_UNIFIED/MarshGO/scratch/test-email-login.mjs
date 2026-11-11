import { chromium } from 'playwright';

async function run() {
  console.log('Testing Email/Password Login flow on http://127.0.0.1:3001 ...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  // Listen to console and errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });

  await page.goto('http://127.0.0.1:3001');
  await page.waitForLoadState('networkidle');

  // Verify auth screen is visible
  const authScreen = await page.waitForSelector('.auth-screen', { timeout: 10000 });
  console.log('✅ Auth screen loaded successfully');

  // Take screenshot of login screen
  await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/email_login_screen.png' });
  console.log('📸 Screenshot saved: email_login_screen.png');

  // Check for email and password inputs
  const emailInput = await page.waitForSelector('input[type="email"]');
  const passwordInput = await page.waitForSelector('input[type="password"]');
  console.log('✅ Found email and password inputs');

  // Click 1-click Driver Demo button
  const driverBtn = await page.waitForSelector('button:has-text("Водій (Олексій)")');
  await driverBtn.click();
  console.log('✅ Clicked 1-click Driver Demo button');

  // Verify inputs filled
  const emailVal = await emailInput.inputValue();
  const passVal = await passwordInput.inputValue();
  console.log(`Filled values: email=${emailVal}, passwordLength=${passVal.length}`);

  // Submit login
  const submitBtn = await page.waitForSelector('button[type="submit"]');
  await submitBtn.click();
  console.log('✅ Clicked Submit login button');

  // Wait for main app to appear
  await page.waitForSelector('.production-app', { timeout: 15000 });
  console.log('🎉 Successfully logged in! .production-app is now rendered');

  // Wait for networkidle
  await page.waitForLoadState('networkidle');

  // Capture logged-in screenshot
  await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/email_login_success.png' });
  console.log('📸 Screenshot saved: email_login_success.png');

  await browser.close();
  console.log('ALL VERIFICATIONS PASSED 100%!');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
