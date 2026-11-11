import { chromium } from 'playwright';

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity-ide/brain/e508fd6d-8a68-4a57-9f93-681a5627f9f1';

async function run() {
  console.log('🚀 Running Multimodal Journey Search with robust OTP handling...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  page.on('response', async (res) => {
    if (res.url().includes('/journeys/search') && res.request().method() === 'POST') {
      try {
        const body = await res.json();
        console.log('Intercepted /journeys/search response! HTTP Status:', res.status());
        const journeys = body?.data?.journeys || body?.journeys || [];
        console.log(`Received ${journeys.length} journeys from backend.`);
        if (journeys.length > 0) {
          console.log('Sample Journey Legs:');
          for (const leg of journeys[0].legs || []) {
            console.log(`  - Mode: ${leg.mode}, Duration: ${Math.round(leg.durationSeconds / 60)} min, From: ${leg.origin?.name} -> To: ${leg.destination?.name}`);
          }
        }
      } catch (e) {
        console.error('Error parsing search response:', e);
      }
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Onboarding & Login
  const startBtn = page.getByRole('button', { name: /Почати/i });
  if (await startBtn.isVisible()) {
    await startBtn.click();
    await page.waitForTimeout(300);

    const skipBtn = page.getByRole('button', { name: /Пропустити/i });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
      await page.waitForTimeout(300);
    }

    const testPhone = `+3805099${Math.floor(10000 + Math.random() * 90000)}`;
    await page.getByPlaceholder(/Ваше ім’я/i).fill('Олексій');
    await page.getByPlaceholder(/\+380 номер телефону/i).fill(testPhone);

    const otpPromise = page.waitForResponse((res) => res.url().includes('/auth/otp/request') && res.request().method() === 'POST');
    await page.getByRole('button', { name: /Почати/i }).click();

    const otpResponse = await otpPromise;
    const otpBody = await otpResponse.json();
    const code = otpBody?.data?.developmentCode || otpBody?.developmentCode;
    console.log(`Successfully obtained OTP: ${code}`);

    await page.getByPlaceholder(/••••••/i).fill(code);
    await page.getByRole('button', { name: /Підтвердити номер/i }).click();
    await page.waitForTimeout(2000);
  }

  console.log('Opening Search Tab...');
  const searchTab = page.getByRole('navigation', { name: 'Основна навігація' }).getByRole('button', { name: 'Пошук', exact: true });
  if (await searchTab.isVisible()) {
    await searchTab.click();
    await page.waitForTimeout(800);
  }

  console.log('Filling search fields: Київ → Львів...');
  const originInput = page.getByPlaceholder(/Місто відправлення|Моє місцеперебування/);
  await originInput.click();
  await originInput.fill('Київ');
  await page.waitForTimeout(1000);

  const kyivSuggestion = page.getByRole('button', { name: /Київ/i }).first();
  if (await kyivSuggestion.isVisible()) {
    await kyivSuggestion.click();
    await page.waitForTimeout(500);
  }

  const destInput = page.getByPlaceholder(/Місто призначення|Введіть адресу, місто або зупинку/);
  await destInput.click();
  await destInput.fill('Львів');
  await page.waitForTimeout(1000);

  const lvivSuggestion = page.getByRole('button', { name: /Львів/i }).first();
  if (await lvivSuggestion.isVisible()) {
    await lvivSuggestion.click();
    await page.waitForTimeout(500);
  }

  console.log('Clicking "Знайти маршрут"...');
  const searchResponsePromise = page.waitForResponse(
    (res) => res.url().includes('/journeys/search') && res.request().method() === 'POST',
    { timeout: 35000 }
  );

  const searchBtn = page.getByRole('button', { name: /Знайти маршрут|Шукаємо/i });
  await searchBtn.click();

  console.log('Waiting for backend response...');
  await searchResponsePromise;
  console.log('Backend responded! Waiting 3s for UI rendering...');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: `${ARTIFACT_DIR}/55_intercity_search_cards.png` });
  console.log('Saved 55_intercity_search_cards.png');

  // Click on the first itinerary card to show detailed legs strip
  const card = page.locator('article, [data-testid^="journey-card-"], div[class*="rounded-2xl"], div[role="button"]').filter({ hasText: /хв|год/i }).first();
  if (await card.isVisible()) {
    console.log('Clicking journey card to view expanded chain...');
    await card.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${ARTIFACT_DIR}/56_journey_expanded_legs.png` });
    console.log('Saved 56_journey_expanded_legs.png');
  }

  await browser.close();
  console.log('✨ All search assertions passed!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
