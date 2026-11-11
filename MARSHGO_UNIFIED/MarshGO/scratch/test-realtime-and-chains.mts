import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity-ide/brain/e508fd6d-8a68-4a57-9f93-681a5627f9f1';

async function run() {
  console.log('🚀 Starting zoomed real-time transit & multimodal chains browser test...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }, // iPhone 16 Pro Max
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  });

  const page = await context.newPage();

  let capturedOtp = '';
  page.on('response', async (res) => {
    if (res.url().includes('/auth/otp/request')) {
      try {
        const json = await res.json();
        capturedOtp = json?.data?.developmentCode || json?.developmentCode || '';
        console.log('Intercepted OTP Code:', capturedOtp);
      } catch {}
    }
  });

  console.log('1. Navigating to http://localhost:3000...');
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

    const testPhone = `+38050988${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(`Entering name and phone: ${testPhone}...`);
    await page.getByPlaceholder(/Ваше ім’я/i).fill('Олексій');
    await page.getByPlaceholder(/\+380 номер телефону/i).fill(testPhone);
    await page.getByRole('button', { name: /Почати/i }).click();

    await page.waitForTimeout(1000);
    console.log('Entering OTP:', capturedOtp);
    await page.getByPlaceholder(/••••••/i).fill(capturedOtp);
    await page.getByRole('button', { name: /Підтвердити номер/i }).click();
    await page.waitForTimeout(2000);
  }

  // 2. Open Transport Map
  console.log('2. Opening Transport Map...');
  const mapBtn = page.getByRole('button', { name: /Карта транспорту/i }).or(page.locator('button:has-text("Карта")')).first();
  await mapBtn.click();
  await page.waitForTimeout(2000);

  // Open Layers and enable everything
  const layersBtn = page.getByRole('button', { name: /Шари карти/i });
  if (await layersBtn.isVisible()) {
    await layersBtn.click();
    await page.waitForTimeout(600);

    const switches = page.getByRole('switch');
    const count = await switches.count();
    for (let i = 0; i < count; i++) {
      const sw = switches.nth(i);
      const isChecked = await sw.isChecked();
      const isDisabled = await sw.isDisabled();
      if (!isChecked && !isDisabled) {
        await sw.click({ force: true });
        await page.waitForTimeout(60);
      }
    }

    const closeBtn = page.getByRole('button', { name: /Закрити шари карти/i });
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // 3. Zoom into Central Lviv (Svobody Ave / Rynok Square)
  console.log('3. Zooming into Central Lviv to verify live vehicles (trams, trolleybuses, buses)...');
  await page.evaluate(() => {
    // Access MapLibre map instance attached to window or canvas
    const mapEl = document.querySelector('.maplibregl-map') as any;
    if (mapEl && mapEl._mapLibreMap) {
      mapEl._mapLibreMap.flyTo({ center: [24.028, 49.841], zoom: 14.5 });
    }
  });

  // Alternative: select Lviv and dispatch zoom via double clicks or scroll
  const citySelect = page.locator('#transport-city');
  if (await citySelect.isVisible()) {
    await citySelect.selectOption('lviv');
    await page.waitForTimeout(1000);
    // Double click to zoom in center
    const mapCanvas = page.locator('canvas.maplibregl-canvas');
    if (await mapCanvas.isVisible()) {
      const box = await mapCanvas.boundingBox();
      if (box) {
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        for (let z = 0; z < 5; z++) {
          await page.mouse.dblclick(cx, cy);
          await page.waitForTimeout(300);
        }
      }
    }
  }

  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/30_lviv_zoomed_vehicles.png` });
  console.log('Captured 30_lviv_zoomed_vehicles.png');

  // Click on a live vehicle circle
  const canvas = page.locator('canvas.maplibregl-canvas');
  if (await canvas.isVisible()) {
    const box = await canvas.boundingBox();
    if (box) {
      // Click near center where vehicles cluster in central Lviv
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${ARTIFACT_DIR}/31_lviv_vehicle_popup.png` });
    }
  }

  // 4. Zoom into Kyiv (Khreshchatyk / Bessarabska) for scooters & metro
  console.log('4. Switching to Kyiv & zooming into scooters and metro...');
  if (await citySelect.isVisible()) {
    const kyivVal = await citySelect.locator('option:has-text("Київ")').getAttribute('value');
    if (kyivVal) {
      await citySelect.selectOption(kyivVal);
      await page.waitForTimeout(1000);
      if (await canvas.isVisible()) {
        const box = await canvas.boundingBox();
        if (box) {
          const cx = box.x + box.width / 2;
          const cy = box.y + box.height / 2;
          for (let z = 0; z < 5; z++) {
            await page.mouse.dblclick(cx, cy);
            await page.waitForTimeout(300);
          }
        }
      }
      await page.waitForTimeout(4000);
      await page.screenshot({ path: `${ARTIFACT_DIR}/32_kyiv_zoomed_micromobility.png` });
      console.log('Captured 32_kyiv_zoomed_micromobility.png');

      // Click for scooter popup
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width * 0.45, box.y + box.height * 0.45);
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${ARTIFACT_DIR}/33_kyiv_scooter_popup.png` });
      }
    }
  }

  // 5. Navigate back to Home and open Search
  console.log('5. Navigating back to Search...');
  const backBtn = page.getByRole('button', { name: /Назад/i });
  if (await backBtn.isVisible()) {
    await backBtn.click();
    await page.waitForTimeout(1000);
  }

  // On home screen, check search input
  await page.screenshot({ path: `${ARTIFACT_DIR}/34_home_ready_for_search.png` });
  console.log('Captured 34_home_ready_for_search.png');

  // Look for search input or quick search buttons on home screen
  const searchInput = page.locator('input[type="text"]').first();
  if (await searchInput.isVisible()) {
    console.log('Clicking search input on home...');
    await searchInput.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/35_search_form_view.png` });
  }

  await browser.close();
  console.log('✅ Realtime transit & micromobility test completed successfully!');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
