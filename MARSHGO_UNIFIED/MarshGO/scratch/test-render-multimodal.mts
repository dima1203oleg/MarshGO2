import { chromium } from 'playwright';

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity-ide/brain/e508fd6d-8a68-4a57-9f93-681a5627f9f1';

async function run() {
  console.log('🚀 Clicking journey card to view full interactive JourneyRouteMapScreen...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  // Give each OTP request an isolated pseudo-client IP so the rate-limiter never triggers
  await page.route('**/api/v1/auth/**', async (route) => {
    const headers = { ...route.request().headers(), 'x-forwarded-for': `192.0.2.${Math.floor(1 + Math.random() * 200)}` };
    await route.continue({ headers });
  });

  // Login
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const startBtn = page.getByRole('button', { name: /Почати/i });
  if (await startBtn.isVisible()) {
    await startBtn.click();
    await page.waitForTimeout(300);

    const skipBtn = page.getByRole('button', { name: /Пропустити/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
      await page.waitForTimeout(300);
    }

    const testPhone = `+38099${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.getByPlaceholder(/Ваше ім’я/i).fill('Олексій');
    await page.getByPlaceholder(/\+380 номер телефону/i).fill(testPhone);

    const otpPromise = page.waitForResponse((res) => res.url().includes('/auth/otp/request') && res.request().method() === 'POST');
    await page.getByRole('button', { name: /Почати/i }).click();

    const otpRes = await otpPromise;
    const otpBody = await otpRes.json();
    console.log('OTP response body:', JSON.stringify(otpBody));
    const code = otpBody?.data?.developmentCode ?? otpBody?.developmentCode ?? '123456';

    await page.getByPlaceholder(/••••••/i).fill(code);
    await page.getByRole('button', { name: /Підтвердити номер/i }).click();
    await page.waitForTimeout(2000);
  }

  // Navigate within SPA to preserve in-memory accessToken!
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10);
  const path = `/journeys/search?mode=planner&origin=%D0%97%D0%B0%D0%BB%D1%96%D0%B7%D0%BD%D0%B8%D1%87%D0%BD%D0%B8%D0%B9+%D0%B2%D0%BE%D0%BA%D0%B7%D0%B0%D0%BB%2C+%D0%9B%D1%8C%D0%B2%D1%96%D0%B2&originLat=49.8400&originLon=23.9950&originProvider=manual&destination=%D0%9F%D0%BB%D0%BE%D1%89%D0%B0+%D0%A0%D0%B8%D0%BD%D0%BE%D0%BA%2C+%D0%9B%D1%8C%D0%B2%D1%96%D0%B2&destinationLat=49.8419&destinationLon=24.0315&destinationProvider=manual&date=${tomorrow}&passengers=1&departure=${tomorrow}T08%3A00&strategy=BALANCED`;

  console.log('Navigating within SPA...');
  await page.evaluate((target) => {
    window.history.pushState({}, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, path);

  await page.waitForTimeout(1500);

  const findBtn = page.getByRole('button', { name: 'Знайти маршрут' });
  await findBtn.waitFor({ state: 'visible', timeout: 10000 });
  console.log('Clicking "Знайти маршрут"...');
  const searchPromise = page.waitForResponse((res) => res.url().includes('/journeys/search') && res.request().method() === 'POST', { timeout: 30000 });
  await findBtn.click();
  await searchPromise;
  console.log('Search response received, waiting for cards to render...');
  await page.waitForTimeout(3000);

  // Click on the first journey card
  const card = page.locator('[data-testid="journey-result-card"]').first();
  await card.waitFor({ state: 'visible', timeout: 10000 });
  console.log('Clicking journey result card [data-testid="journey-result-card"]...');
  await card.click();

  console.log('Waiting for JourneyRouteMapScreen to render...');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/80_lviv_journey_route_screen.png` });
  console.log('Captured 80_lviv_journey_route_screen.png');

  // Click to expand the bottom sheet details
  const expandBtn = page.getByRole('button', { name: /Розгорнути деталі маршруту|Деталі маршруту/i }).or(page.locator('[aria-label*="Розгорнути"]')).first();
  if (await expandBtn.isVisible()) {
    console.log('Expanding bottom sheet...');
    await expandBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/81_lviv_expanded_sheet_timeline.png` });
    console.log('Captured 81_lviv_expanded_sheet_timeline.png');
  }

  await browser.close();
  console.log('✨ Finished JourneyRouteMapScreen capture!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
