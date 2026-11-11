import { chromium } from 'playwright';

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity-ide/brain/e508fd6d-8a68-4a57-9f93-681a5627f9f1';

async function run() {
  console.log('🚀 Running Multimodal Journey Chain & Search Test...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  let capturedOtp = '';
  page.on('response', async (res) => {
    if (res.url().includes('/auth/otp/request')) {
      try {
        const json = await res.json();
        capturedOtp = json?.data?.developmentCode || json?.developmentCode || '';
      } catch {}
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

    const testPhone = `+38050989${Math.floor(1000 + Math.random() * 9000)}`;
    await page.getByPlaceholder(/Ваше ім’я/i).fill('Олексій');
    await page.getByPlaceholder(/\+380 номер телефону/i).fill(testPhone);
    await page.getByRole('button', { name: /Почати/i }).click();

    await page.waitForTimeout(1000);
    await page.getByPlaceholder(/••••••/i).fill(capturedOtp);
    await page.getByRole('button', { name: /Підтвердити номер/i }).click();
    await page.waitForTimeout(2000);
  }

  console.log('Filling search fields: Київ → Львів...');
  const originInput = page.getByPlaceholder('Місто відправлення');
  await originInput.click();
  await originInput.fill('Київ');
  await page.waitForTimeout(400);

  const destInput = page.getByPlaceholder('Місто призначення');
  await destInput.click();
  await destInput.fill('Львів');
  await page.waitForTimeout(400);

  console.log('Clicking "Знайти маршрут"...');
  const searchBtn = page.getByRole('button', { name: /Знайти маршрут/i });
  await searchBtn.click();

  console.log('Waiting for multimodal itineraries...');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/40_journey_search_results.png` });
  console.log('Captured 40_journey_search_results.png');

  // Let's click on the first candidate card
  const candidate = page.locator('button[data-testid^="journey-card-"], button:has-text("грн"), button:has-text("хв"), div[role="button"]:has-text("год")').first();
  if (await candidate.isVisible()) {
    console.log('Clicking on first candidate itinerary card...');
    await candidate.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${ARTIFACT_DIR}/41_multimodal_journey_chain_expanded.png` });
    console.log('Captured 41_multimodal_journey_chain_expanded.png');
  } else {
    console.log('Could not find specific card selector, checking entire page text...');
    const bodyText = await page.innerText('body');
    console.log('Body snippet:', bodyText.slice(0, 500));
  }

  await browser.close();
  console.log('Done!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
