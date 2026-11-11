import { chromium } from 'playwright';
import assert from 'node:assert/strict';

async function main() {
  console.log('--- STARTING RC3 EXTENDED BROWSER UI PLAYWRIGHT TEST ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile Viewport (iPhone 14)
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  // 1. Web PWA Home & Login flow
  console.log('1. Loading Web PWA at http://127.0.0.1:3900...');
  const res = await page.goto('http://127.0.0.1:3900/', { waitUntil: 'networkidle' });
  assert.equal(res.status(), 200, 'Web container must return HTTP 200');

  // Verify page title
  const title = await page.title();
  console.log('   Web PWA Title:', title);

  // Take screenshot of Home
  await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/rc3_ui_01_home.png' });

  // Direct login via UI or token injection
  console.log('2. Authenticating passenger in Web PWA...');
  const loginRes = await page.request.post('http://127.0.0.1:3900/api/v1/auth/login', {
    data: { email: 'passenger@marshgo.ua', password: 'PassengerPass123!' }
  });
  assert.equal(loginRes.status(), 200, 'Login API must return 200');
  const loginData = await loginRes.json();
  const token = loginData.data?.accessToken;
  assert(token, 'Access token required');

  await page.evaluate((t) => {
    localStorage.setItem('marshgo_access_token', t);
    localStorage.setItem('auth_token', t);
  }, token);

  await page.reload({ waitUntil: 'networkidle' });
  await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/rc3_ui_02_authenticated.png' });
  console.log('   Web PWA authenticated and loaded successfully.');

  // 3. Admin Portal
  console.log('3. Loading Admin Portal at http://127.0.0.1:3903...');
  const adminPage = await context.newPage();
  const adminRes = await adminPage.goto('http://127.0.0.1:3903/', { waitUntil: 'networkidle' });
  assert.equal(adminRes.status(), 200, 'Admin container must return 200');
  await adminPage.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/rc3_ui_03_admin.png' });
  console.log('   Admin portal verified.');

  // 4. Partner Portal
  console.log('4. Loading Partner Portal at http://127.0.0.1:3904...');
  const partnerPage = await context.newPage();
  const partnerRes = await partnerPage.goto('http://127.0.0.1:3904/', { waitUntil: 'networkidle' });
  assert.equal(partnerRes.status(), 200, 'Partner container must return 200');
  await partnerPage.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/rc3_ui_04_partner.png' });
  console.log('   Partner portal verified.');

  await browser.close();
  console.log('--- ALL RC3 BROWSER UI PLAYWRIGHT TESTS PASSED ---');
}

main().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
