import { chromium } from 'playwright';

async function run() {
  console.log('Starting Playwright browser...');
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop test
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktopContext.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.text().includes('journey')) {
      console.log(`[Browser console] ${msg.type()}: ${msg.text()}`);
    }
  });

  const baseUrl = 'http://127.0.0.1:3001';
  console.log(`Navigating to ${baseUrl}/journeys/search...`);
  await page.goto(`${baseUrl}/journeys/search`, { waitUntil: 'networkidle' });

  // Handle zrok interstitial if present
  try {
    const visitBtn = page.getByRole('button', { name: /visit share/i });
    if (await visitBtn.isVisible({ timeout: 2000 })) {
      await visitBtn.click();
      await page.waitForLoadState('networkidle');
    }
  } catch {
    // Interstitial not present
  }

  // Fill in search form
  console.log('Filling origin: Чернівці...');
  const originInput = page.getByPlaceholder(/місто відправлення/i);
  await originInput.click();
  await originInput.fill('Чернівці');
  await page.waitForTimeout(1000);

  // Click suggestion
  const chernivtsiOption = page.locator('button, div').filter({ hasText: /Чернівецька міська громада|Чернівці/i }).first();
  if (await chernivtsiOption.isVisible()) {
    await chernivtsiOption.click();
    console.log('Selected Chernivtsi suggestion');
  }

  console.log('Filling destination: Київ...');
  const destInput = page.getByPlaceholder(/місто призначення/i);
  await destInput.click();
  await destInput.fill('Київ');
  await page.waitForTimeout(1000);

  // Click suggestion
  const kyivOption = page.locator('button, div').filter({ hasText: /Київ, Україна|Київ/i }).first();
  if (await kyivOption.isVisible()) {
    await kyivOption.click();
    console.log('Selected Kyiv suggestion');
  }

  // Set departure date if input is visible
  console.log('Submitting search for journeys...');
  const searchBtn = page.getByRole('button', { name: /знайти маршрут/i });
  await searchBtn.click();

  // Wait for results
  console.log('Waiting for journey results...');
  await page.waitForTimeout(4000);

  // Take desktop screenshot
  await page.screenshot({ path: '/Users/dima1203/Desktop/MarshGO/scratch/chernivtsi_kyiv_desktop.png', fullPage: true });
  console.log('Saved desktop screenshot to scratch/chernivtsi_kyiv_desktop.png');

  // 2. Mobile test
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${baseUrl}/journeys/search`, { waitUntil: 'networkidle' });

  const mOriginInput = mobilePage.getByPlaceholder(/місто відправлення/i);
  await mOriginInput.click();
  await mOriginInput.fill('Чернівці');
  await mobilePage.waitForTimeout(1000);
  const mChOption = mobilePage.locator('button, div').filter({ hasText: /Чернівецька міська громада|Чернівці/i }).first();
  if (await mChOption.isVisible()) await mChOption.click();

  const mDestInput = mobilePage.getByPlaceholder(/місто призначення/i);
  await mDestInput.click();
  await mDestInput.fill('Київ');
  await mobilePage.waitForTimeout(1000);
  const mKyOption = mobilePage.locator('button, div').filter({ hasText: /Київ, Україна|Київ/i }).first();
  if (await mKyOption.isVisible()) await mKyOption.click();

  const mSearchBtn = mobilePage.getByRole('button', { name: /знайти маршрут/i });
  await mSearchBtn.click();
  await mobilePage.waitForTimeout(4000);

  await mobilePage.screenshot({ path: '/Users/dima1203/Desktop/MarshGO/scratch/chernivtsi_kyiv_mobile.png', fullPage: true });
  console.log('Saved mobile screenshot to scratch/chernivtsi_kyiv_mobile.png');

  await browser.close();
  console.log('Verification finished successfully!');
}

run().catch((err) => {
  console.error('Playwright verification error:', err);
  process.exit(1);
});
