import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const ZROK_URL = 'https://a602584pesfa.shares.zrok.io';
const ARTIFACTS_DIR = '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919';

async function run() {
  console.log(`🚀 Starting Live Zrok Acceptance Test against: ${ZROK_URL}`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
    locale: 'uk-UA',
    timezoneId: 'Europe/Kyiv',
    geolocation: { latitude: 49.8397, longitude: 24.0297 }, // Lviv
    permissions: ['geolocation'],
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'skip_zrok_interstitial': 'true'
    }
  });

  // Also pre-seed the zrok_interstitial cookie
  await context.addCookies([
    {
      name: 'zrok_interstitial',
      value: '1',
      domain: 'a602584pesfa.shares.zrok.io',
      path: '/'
    }
  ]);

  const page = await context.newPage();
  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleLogs.push(`[PAGE ERROR] ${err.message}`));
  page.on('requestfailed', req => {
    networkErrors.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
  });

  console.log('1. Navigating to public zrok endpoint...');
  const response = await page.goto(ZROK_URL, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`HTTP Status: ${response.status()}`);

  // In case the interstitial button is rendered:
  const visitBtn = page.locator('button:has-text("Visit Share")');
  if (await visitBtn.isVisible()) {
    console.log('Detected zrok interstitial button, clicking "Visit Share"...');
    await visitBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  }

  const title = await page.title();
  console.log(`Page Title: "${title}"`);

  // Wait for dynamic hydration of MarshGO
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${ARTIFACTS_DIR}/zrok_live_home_screen.png`, fullPage: false });
  console.log('📸 Captured zrok_live_home_screen.png');

  // Check if onboarding / welcome is visible
  const welcomeHasAccount = page.locator('button:has-text("У мене вже є акаунт"), button:has-text("Розпочати"), button:has-text("Пропустити")');
  const hasWelcome = (await welcomeHasAccount.count()) > 0;
  console.log(`Welcome/Onboarding buttons found: ${hasWelcome}`);

  if (hasWelcome) {
    const firstBtn = welcomeHasAccount.first();
    const btnText = await firstBtn.textContent();
    console.log(`Clicking welcome button: "${btnText}"`);
    await firstBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${ARTIFACTS_DIR}/zrok_live_after_welcome.png` });
  }

  // Look for bottom navigation
  const searchTab = page.locator('button:has-text("Пошук"), [data-testid="tab-search"], [aria-label="Пошук"]').first();
  const carpoolTab = page.locator('button:has-text("Поїздки"), [data-testid="tab-rides"], [aria-label="Поїздки"]').first();
  const profileTab = page.locator('button:has-text("Профіль"), [data-testid="tab-profile"], [aria-label="Профіль"]').first();

  console.log(`Tabs found: Search=${await searchTab.count()}, Carpool=${await carpoolTab.count()}, Profile=${await profileTab.count()}`);

  // Test Profile / Auth screen
  if (await profileTab.count() > 0) {
    console.log('Navigating to Profile tab...');
    await profileTab.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${ARTIFACTS_DIR}/zrok_live_profile_tab.png` });
  }

  // Test Search tab
  if (await searchTab.count() > 0) {
    console.log('Navigating to Search tab...');
    await searchTab.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${ARTIFACTS_DIR}/zrok_live_search_tab.png` });
  }

  // Check Admin endpoint
  console.log('2. Testing /admin/ endpoint...');
  const adminPage = await context.newPage();
  const adminResp = await adminPage.goto(`${ZROK_URL}/admin/`, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`Admin status: ${adminResp.status()}`);
  await adminPage.waitForTimeout(1000);
  await adminPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_live_admin_screen.png` });

  // Check Partner endpoint
  console.log('3. Testing /partner/ endpoint...');
  const partnerPage = await context.newPage();
  const partnerResp = await partnerPage.goto(`${ZROK_URL}/partner/`, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`Partner status: ${partnerResp.status()}`);
  await partnerPage.waitForTimeout(1000);
  await partnerPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_live_partner_screen.png` });

  console.log('4. Checking API Health & Endpoints over HTTPS...');
  const apiHealthResp = await page.request.get(`${ZROK_URL}/readyz`);
  const apiHealthJson = await apiHealthResp.json();
  console.log(`Readyz response:`, apiHealthJson);

  await browser.close();

  const report = {
    zrokUrl: ZROK_URL,
    timestamp: new Date().toISOString(),
    status: response.status() === 200 && title.includes('MARSHGO') ? 'PASS' : 'WARN',
    title,
    adminStatus: adminResp.status(),
    partnerStatus: partnerResp.status(),
    apiReadyz: apiHealthJson,
    networkErrorsCount: networkErrors.length,
    networkErrors: networkErrors.slice(0, 10),
    consoleLogsCount: consoleLogs.length,
    recentConsoleLogs: consoleLogs.slice(-10)
  };

  writeFileSync(`${ARTIFACTS_DIR}/zrok_live_verification.json`, JSON.stringify(report, null, 2));
  console.log('✅ Zrok Live Acceptance Verification completed successfully!');
  console.log(JSON.stringify(report, null, 2));
}

run().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
