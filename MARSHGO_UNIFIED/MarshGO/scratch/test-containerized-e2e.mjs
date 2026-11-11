import { chromium } from 'playwright';
import assert from 'node:assert/strict';

async function main() {
  console.log('--- STARTING CONTAINERIZED E2E ACCEPTANCE ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14/15 size
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  console.log('1. Navigating to containerized Web PWA at http://127.0.0.1:3900...');
  const res = await page.goto('http://127.0.0.1:3900/', { waitUntil: 'networkidle' });
  assert.equal(res.status(), 200, 'Web container must return HTTP 200');

  // Verify title and root elements
  const title = await page.title();
  console.log('   Page Title:', title);

  // Take screenshot of Home on containerized Web
  await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/container_e2e_01_home.png' });
  console.log('   Saved container_e2e_01_home.png');

  // Check login API directly via page context
  console.log('2. Testing containerized Email/Password Auth from browser session...');
  let loginRes = await page.request.post('http://127.0.0.1:3900/api/v1/auth/login', {
    data: { email: 'passenger@marshgo.ua', password: 'PassengerPass123!' }
  });
  if (loginRes.status() === 401 || loginRes.status() === 404) {
    console.log('   User not found, registering test user via container API...');
    const regRes = await page.request.post('http://127.0.0.1:3900/api/v1/auth/register', {
      data: {
        email: 'passenger@marshgo.ua',
        password: 'PassengerPass123!',
        displayName: 'Олена Пасажир'
      }
    });
    console.log('   Registration status:', regRes.status());
    loginRes = await page.request.post('http://127.0.0.1:3900/api/v1/auth/login', {
      data: { email: 'passenger@marshgo.ua', password: 'PassengerPass123!' }
    });
  }
  assert.equal(loginRes.status(), 200, 'Login via containerized proxy must return 200');
  const loginJson = await loginRes.json();
  const token = loginJson.data.accessToken;
  assert(token, 'Access token must be returned');
  console.log('   Access Token received from container API:', token.slice(0, 16) + '...');

  // Set token in localStorage to authenticate browser session
  await page.evaluate((jwt) => {
    localStorage.setItem('marshgo_access_token', jwt);
    localStorage.setItem('auth_token', jwt);
  }, token);

  // Reload page with authenticated state
  await page.reload({ waitUntil: 'networkidle' });
  await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/container_e2e_02_authenticated.png' });
  console.log('   Saved container_e2e_02_authenticated.png');

  // Test Admin Container
  console.log('3. Testing containerized Admin portal at http://127.0.0.1:3903...');
  const adminPage = await context.newPage();
  const adminRes = await adminPage.goto('http://127.0.0.1:3903/', { waitUntil: 'networkidle' });
  assert.equal(adminRes.status(), 200, 'Admin container must return HTTP 200');
  await adminPage.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/container_e2e_03_admin.png' });
  console.log('   Saved container_e2e_03_admin.png');

  // Test Partner Container
  console.log('4. Testing containerized Partner portal at http://127.0.0.1:3904...');
  const partnerPage = await context.newPage();
  const partnerRes = await partnerPage.goto('http://127.0.0.1:3904/', { waitUntil: 'networkidle' });
  assert.equal(partnerRes.status(), 200, 'Partner container must return HTTP 200');
  await partnerPage.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/container_e2e_04_partner.png' });
  console.log('   Saved container_e2e_04_partner.png');

  await browser.close();
  console.log('--- ALL CONTAINERIZED BROWSER E2E TESTS PASSED ---');
}

main().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});
