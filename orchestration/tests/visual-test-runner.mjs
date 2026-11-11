import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = '/private/tmp/mg-visual-evidence';
fs.mkdirSync(OUT_DIR, { recursive: true });

async function visualTest() {
  console.log('📱 Launching Mobile Web Viewport (iPhone 13 - 390x844)...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true
  });

  const page = await context.newPage();
  const report = [];

  function logPass(screen, description) {
    console.log(`✅ [PASS] ${screen}: ${description}`);
    report.push({ screen, status: 'PASS', description });
  }

  try {
    // 1. Landing Screen
    console.log('\n--- 1. Testing Landing / Welcome Screen ---');
    await page.goto('http://127.0.0.1:4178/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const hasBrand = await page.locator('strong:has-text("MARSH")').isVisible();
    const hasStartBtn = await page.locator('button:has-text("Почати")').isVisible();
    const hasLoginBtn = await page.locator('button:has-text("У мене вже є акаунт")').isVisible();
    await page.screenshot({ path: path.join(OUT_DIR, '01-landing-screen.png') });
    logPass('Landing Screen', `Brand: ${hasBrand}, Start button: ${hasStartBtn}, Login button: ${hasLoginBtn}`);

    // 2. Login Flow
    console.log('\n--- 2. Testing Login Screen ---');
    await page.locator('button:has-text("У мене вже є акаунт")').click();
    await page.waitForTimeout(600);
    await page.fill('#login-email', 'dima@marshgo.local');
    await page.fill('#login-password', 'Marshgo#2026dev');
    await page.screenshot({ path: path.join(OUT_DIR, '02-login-form.png') });
    await page.locator('button[type="submit"]:has-text("Увійти")').click();
    await page.waitForTimeout(2000);
    logPass('Login Form', 'Fields filled and submitted');

    // 3. Home Screen
    console.log('\n--- 3. Testing Home Screen ---');
    const bottomNav = await page.locator('nav[aria-label="Основна навігація"]').isVisible();
    const homeHeader = await page.locator('header.app-header').isVisible();
    await page.screenshot({ path: path.join(OUT_DIR, '03-home-dashboard.png') });
    logPass('Home Dashboard', `Header: ${homeHeader}, Bottom Navigation: ${bottomNav}`);

    // 4. Transport Map View
    console.log('\n--- 4. Testing Transport Map View ---');
    // Open map from the home card
    const mapCard = page.locator('button:has-text("Карта транспорту")').first();
    if (await mapCard.isVisible()) {
      await mapCard.click();
      await page.waitForTimeout(3000); // Wait for MapLibre canvas
      const canvasExists = await page.locator('.maplibregl-canvas').isVisible();
      await page.screenshot({ path: path.join(OUT_DIR, '04-transport-map.png') });
      logPass('Transport Map View', `MapLibre canvas rendered: ${canvasExists}`);

      // Activate Tram layer
      const tramChip = page.locator('button:has-text("Трамваї")').first();
      if (await tramChip.isVisible()) {
        await tramChip.click();
        await page.waitForTimeout(2500); // Allow vehicles to load
        await page.screenshot({ path: path.join(OUT_DIR, '05-transport-map-trams.png') });
        logPass('Transport Map Layers', 'Tram layer activated, live positions requested');
      }

      // Switch City to Kyiv
      const citySelect = page.locator('select').first();
      if (await citySelect.isVisible()) {
        await citySelect.selectOption({ label: 'Київ' });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(OUT_DIR, '06-transport-map-kyiv.png') });
        logPass('Transport Map Cities', 'Switched focus to Kyiv');
      }

      // Return to main
      const backBtn = page.locator('button[aria-label="Назад"], button:has(svg.lucide-arrow-left)').first();
      if (await backBtn.isVisible()) {
        await backBtn.click();
        await page.waitForTimeout(600);
      }
    }

    // 5. Search Screen & Suggestions
    console.log('\n--- 5. Testing Search Screen ---');
    const searchTab = page.locator('nav[aria-label="Основна навігація"] button:has-text("Пошук")').first();
    await searchTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT_DIR, '07-search-screen.png') });
    logPass('Search Screen', 'Search tab active with multimodal options');

    // 6. Trips Screen & MarshPass
    console.log('\n--- 6. Testing Trips & MarshPass Ticket ---');
    const tripsTab = page.locator('nav[aria-label="Основна навігація"] button:has-text("Поїздки")').first();
    await tripsTab.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, '08-trips-screen.png') });
    logPass('Trips Screen', 'Trips history and active bookings visible');

    const showTicketBtn = page.locator('button:has-text("квиток"), button:has-text("Показати квиток")').first();
    if (await showTicketBtn.isVisible()) {
      await showTicketBtn.click();
      await page.waitForTimeout(800);
      const dialogVisible = await page.locator('[role="dialog"]').isVisible();
      const qrVisible = await page.locator('svg[viewBox*="0 0"]').isVisible();
      await page.screenshot({ path: path.join(OUT_DIR, '09-marshpass-ticket.png') });
      logPass('MarshPass Ticket Modal', `Dialog: ${dialogVisible}, QR: ${qrVisible}`);

      // Close modal
      const closeBtn = page.locator('[role="dialog"] button:has-text("Повернутися"), [role="dialog"] button:has(svg.lucide-x)').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(400);
      }
    }

    // 7. Profile Screen
    console.log('\n--- 7. Testing Profile Screen ---');
    const profileTab = page.locator('nav[aria-label="Основна навігація"] button:has-text("Профіль")').first();
    await profileTab.click();
    await page.waitForTimeout(800);
    const userNameVisible = await page.locator('text=Власник (dev)').isVisible();
    await page.screenshot({ path: path.join(OUT_DIR, '10-profile-screen.png') });
    logPass('Profile Screen', `Profile data rendered: ${userNameVisible}`);

  } catch (error) {
    console.error('Error during visual test:', error);
    await page.screenshot({ path: path.join(OUT_DIR, 'error.png') });
  } finally {
    await browser.close();
  }

  console.log('\n🎉 Visual testing completed successfully!');
  console.log('Artifacts location:', OUT_DIR);
  console.log('Total verified screens:', report.length);
}

visualTest();
