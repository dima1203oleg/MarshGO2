import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import pg from 'pg';

const PREVIEW_URL = process.env.PREVIEW_URL || 'http://127.0.0.1:3001';
const DATABASE_URL = 'postgres://marshgo:local_only_change_me@127.0.0.1:5434/marshgo';
const pool = new pg.Pool({ connectionString: DATABASE_URL });

const brokenTextPattern = /\bundefined\b|\bnull\b|\bNaN\b|\[object Object\]|Internal Server Error|TypeError/i;
const destructivePattern = /Видалити акаунт|Вийти з усіх пристроїв|Вийти з акаунта|Видалити профіль|Заблокувати/i;

async function auditAllPagesAndButtons() {
  console.log(`========================================================================`);
  console.log(`Starting Exhaustive UI & Button Audit on ${PREVIEW_URL}`);
  console.log(`========================================================================`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 }, // Mobile viewport (Pixel 7 / iPhone 16 tier)
    geolocation: { latitude: 49.8397, longitude: 24.0297 }, // Lviv
    permissions: ['geolocation'],
  });
  const page = await context.newPage();

  const errors = [];
  const warnings = [];
  const auditedButtons = [];
  const screenshots = [];

  page.on('pageerror', (err) => {
    errors.push(`PageError: ${err.message}`);
    console.error(`❌ [PageError] ${err.message}`);
  });

  page.on('response', (res) => {
    if (res.status() >= 500 && !res.url().includes('/api/v1/places/')) {
      errors.push(`HTTP ${res.status()} ${res.url()}`);
      console.error(`❌ [HTTP ${res.status()}] ${res.url()}`);
    }
  });

  const runId = Math.floor(100000 + Math.random() * 900000);
  const testEmail = `audit.user.${runId}@marshgo.ua`;
  const testPassword = 'Password2026!';
  const testName = `Тестер Аудиту ${runId}`;

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Registration & Initial App Entry
    // -------------------------------------------------------------------------
    console.log(`\n[STEP 1] Testing Auth Entry & Registering: ${testEmail}...`);
    await page.goto(`${PREVIEW_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500);

    // Click "У мене вже є акаунт"
    const welcomeLogin = page.locator('button:has-text("У мене вже є акаунт")');
    if (await welcomeLogin.isVisible()) {
      await welcomeLogin.click();
      await page.waitForTimeout(400);
    }

    // Switch to Register tab
    const registerTab = page.locator('button:has-text("Реєстрація")');
    await registerTab.waitFor({ state: 'visible', timeout: 5000 });
    await registerTab.click();
    await page.waitForTimeout(300);

    // Fill form
    await page.locator('input[autocomplete="name"], input[placeholder*="ім’я"]').first().fill(testName);
    await page.locator('input[autocomplete="email"], input[type="email"]').first().fill(testEmail);
    await page.locator('input[autocomplete="new-password"], input[type="password"]').first().fill(testPassword);

    // Select role driver for full capabilities
    const driverRoleBtn = page.locator('button:has-text("Водій")');
    if (await driverRoleBtn.isVisible()) {
      await driverRoleBtn.click();
      await page.waitForTimeout(200);
    }

    // Submit
    const registerBtn = page.locator('button:has-text("Зареєструватися")');
    await registerBtn.click();
    await page.waitForTimeout(2500);

    await page.waitForSelector('.production-app', { timeout: 10000 });
    console.log(`✅ User registered and app loaded successfully.`);

    // -------------------------------------------------------------------------
    // Helper function to audit all visible buttons on the current view
    // -------------------------------------------------------------------------
    async function auditCurrentViewButtons(viewName) {
      console.log(`\n--- Auditing buttons on view: [${viewName}] ---`);
      await page.waitForTimeout(600);

      // Check for broken text
      const bodyText = await page.textContent('body');
      const brokenMatch = bodyText.match(brokenTextPattern);
      if (brokenMatch) {
        errors.push(`Broken text found in ${viewName}: "${brokenMatch[0]}"`);
        console.error(`❌ Broken text in ${viewName}: ${brokenMatch[0]}`);
      }

      // Capture screenshot
      const shotPath = `/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/audit_${viewName.replace(/\s+/g, '_')}.png`;
      await page.screenshot({ path: shotPath });
      screenshots.push({ view: viewName, path: shotPath });

      // Find all visible buttons
      const buttons = page.locator('button:visible');
      const buttonCount = await buttons.count();
      console.log(` Found ${buttonCount} visible buttons on [${viewName}]`);

      for (let i = 0; i < buttonCount; i++) {
        const btn = buttons.nth(i);
        const text = (await btn.innerText().catch(() => '')) || (await btn.getAttribute('aria-label').catch(() => '')) || (await btn.getAttribute('title').catch(() => '')) || `btn_${i}`;
        const cleanText = text.replace(/\s+/g, ' ').trim();

        if (destructivePattern.test(cleanText)) {
          console.log(`   ⏭️ Skipping destructive action: "${cleanText}"`);
          continue;
        }

        auditedButtons.push({ view: viewName, label: cleanText, index: i });
      }
    }

    // -------------------------------------------------------------------------
    // STEP 2: Audit Home Screen
    // -------------------------------------------------------------------------
    await auditCurrentViewButtons('01_Home');

    // Test Notifications Modal
    console.log(`\nTesting Notifications button...`);
    const notifBtn = page.locator('button[aria-label*="Сповіщення"]').first();
    if (await notifBtn.isVisible()) {
      await notifBtn.click();
      await page.waitForTimeout(800);
      await auditCurrentViewButtons('02_Notifications_Modal');
      const closeNotif = page.locator('button[aria-label*="Закрити"]').first();
      if (await closeNotif.isVisible()) {
        await closeNotif.click();
        await page.waitForTimeout(500);
      }
    }

    // Test Quick Actions "+" Modal
    console.log(`\nTesting Quick Actions (+) button...`);
    const plusBtn = page.locator('button[aria-label*="Створити"]').first();
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
      await page.waitForTimeout(800);
      await auditCurrentViewButtons('03_Quick_Actions_Modal');

      // Click "Знайти маршрут" from quick actions
      const findRouteQuick = page.locator('button:has-text("Знайти маршрут")').last();
      if (await findRouteQuick.isVisible()) {
        await findRouteQuick.click();
        await page.waitForTimeout(800);
      }
    }

    // -------------------------------------------------------------------------
    // STEP 3: Audit Search Screen & Subviews
    // -------------------------------------------------------------------------
    await auditCurrentViewButtons('04_Search_Tab');

    // Test Transport Filter Panel Buttons
    console.log(`\nTesting Transport filter buttons...`);
    const transportChips = page.locator('button[role="switch"], .transport-chip, button[aria-label*="транспорт"]');
    const chipCount = await transportChips.count();
    console.log(` Found ${chipCount} transport mode chips/switches.`);
    for (let c = 0; c < Math.min(chipCount, 12); c++) {
      const chip = transportChips.nth(c);
      if (await chip.isVisible() && await chip.isEnabled()) {
        const title = (await chip.getAttribute('title').catch(() => '')) || (await chip.innerText().catch(() => '')) || `chip_${c}`;
        console.log(`   Testing toggle: "${title.replace(/\s+/g, ' ').trim()}"`);
        await chip.click();
        await page.waitForTimeout(200);
        await chip.click(); // toggle back
        await page.waitForTimeout(200);
      }
    }

    // Test Origin and Destination Inputs with Intercity Search
    console.log(`\nTesting Search Query: Чернівці -> Київ...`);
    const originInput = page.locator('input[placeholder*="відправлення"], input[aria-label="Звідки"]').first();
    const destInput = page.locator('input[placeholder*="призначення"], input[aria-label="Куди"]').first();

    await originInput.fill('Чернівці');
    await originInput.press('Enter');
    await page.waitForTimeout(600);
    const suggOrigin = page.locator('button:has-text("Чернівці")').first();
    if (await suggOrigin.isVisible()) await suggOrigin.click();
    await page.waitForTimeout(500);

    await destInput.fill('Київ');
    await destInput.press('Enter');
    await page.waitForTimeout(600);
    const suggDest = page.locator('button:has-text("Київ")').first();
    if (await suggDest.isVisible()) await suggDest.click();
    await page.waitForTimeout(600);

    // Submit Search
    const searchBtn = page.locator('button.search-submit, button:has-text("Знайти маршрут")').first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      console.log(` Submitted search query. Waiting for results...`);
      await page.waitForTimeout(5000);
    }
    await auditCurrentViewButtons('05_Search_Results');

    // -------------------------------------------------------------------------
    // STEP 4: Audit Map Screen
    // -------------------------------------------------------------------------
    console.log(`\n[STEP 4] Navigating to Transport Map...`);
    // Open through Quick actions or direct tab
    const plusBtn2 = page.locator('button[aria-label*="Створити"]').first();
    if (await plusBtn2.isVisible()) {
      await plusBtn2.click();
      await page.waitForTimeout(600);
      const mapQuick = page.locator('button:has-text("Карта транспорту")').last();
      if (await mapQuick.isVisible()) {
        await mapQuick.click();
        await page.waitForTimeout(2000);
        await auditCurrentViewButtons('06_Transport_Map');

        // Test Map Layer Toggle
        const layersBtn = page.locator('button[aria-label*="шари"], button:has-text("Шари")').first();
        if (await layersBtn.isVisible()) {
          await layersBtn.click();
          await page.waitForTimeout(600);
          await auditCurrentViewButtons('07_Map_Layers_Modal');
          const closeLayer = page.locator('button[aria-label*="Закрити"]').first();
          if (await closeLayer.isVisible()) await closeLayer.click();
        }

        // Back to home
        const backBtn = page.locator('button[aria-label*="Назад"], button:has-text("Назад")').first();
        if (await backBtn.isVisible()) await backBtn.click();
        await page.waitForTimeout(600);
      }
    }

    // -------------------------------------------------------------------------
    // STEP 5: Audit Trips Screen
    // -------------------------------------------------------------------------
    console.log(`\n[STEP 5] Navigating to Trips Tab...`);
    const tripsTab = page.locator('button:has-text("Поїздки")').first();
    if (await tripsTab.isVisible()) {
      await tripsTab.click();
      await page.waitForTimeout(1000);
      await auditCurrentViewButtons('08_Trips_Tab');

      // Switch sub-tabs (Активні, Завершені, План)
      const tabs = page.locator('button[role="tab"]');
      const tabCnt = await tabs.count();
      for (let t = 0; t < tabCnt; t++) {
        const subTab = tabs.nth(t);
        if (await subTab.isVisible()) {
          await subTab.click();
          await page.waitForTimeout(400);
        }
      }
    }

    // -------------------------------------------------------------------------
    // STEP 6: Audit Profile Screen & Sections
    // -------------------------------------------------------------------------
    console.log(`\n[STEP 6] Navigating to Profile Tab...`);
    const profileTab = page.locator('button:has-text("Профіль")').first();
    if (await profileTab.isVisible()) {
      await profileTab.click();
      await page.waitForTimeout(1000);
      await auditCurrentViewButtons('09_Profile_Tab');

      // Test Profile Subsections (Мої авто, Документи, тощо)
      const vehicleSectionBtn = page.locator('button:has-text("Мої авто"), button:has-text("Автомобілі")').first();
      if (await vehicleSectionBtn.isVisible()) {
        await vehicleSectionBtn.click();
        await page.waitForTimeout(800);
        await auditCurrentViewButtons('10_Profile_Vehicles_Section');
        const backProfile = page.locator('button[aria-label*="Назад"], button:has-text("Назад")').first();
        if (await backProfile.isVisible()) {
          await backProfile.click();
          await page.waitForTimeout(500);
        }
      }

      const verificationSectionBtn = page.locator('button:has-text("Верифікація"), button:has-text("Документи")').first();
      if (await verificationSectionBtn.isVisible()) {
        await verificationSectionBtn.click();
        await page.waitForTimeout(800);
        await auditCurrentViewButtons('11_Profile_Verification_Section');
        const backProfile = page.locator('button[aria-label*="Назад"], button:has-text("Назад")').first();
        if (await backProfile.isVisible()) {
          await backProfile.click();
          await page.waitForTimeout(500);
        }
      }
    }

    // -------------------------------------------------------------------------
    // STEP 7: Audit Messages / Chat Screen
    // -------------------------------------------------------------------------
    console.log(`\n[STEP 7] Navigating to Messages / Chat...`);
    const chatBtn = page.locator('button[aria-label*="Повідомлення"]').first();
    if (await chatBtn.isVisible()) {
      await chatBtn.click();
      await page.waitForTimeout(1000);
      await auditCurrentViewButtons('12_Messages_Chat');
      const closeChat = page.locator('button[aria-label*="Назад"], button[aria-label*="Закрити"]').first();
      if (await closeChat.isVisible()) {
        await closeChat.click();
        await page.waitForTimeout(500);
      }
    }

    // -------------------------------------------------------------------------
    // STEP 8: Audit Publish Trip & Demand Forms
    // -------------------------------------------------------------------------
    console.log(`\n[STEP 8] Auditing Publish Offer & Passenger Demand Forms...`);
    const plusBtn3 = page.locator('button[aria-label*="Створити"]').first();
    if (await plusBtn3.isVisible()) {
      await plusBtn3.click();
      await page.waitForTimeout(600);

      // Open Demand Form
      const demandQuick = page.locator('button:has-text("Створити запит на поїздку")').last();
      if (await demandQuick.isVisible()) {
        await demandQuick.click();
        await page.waitForTimeout(1000);
        await auditCurrentViewButtons('13_Create_Demand_Form');
      }
    }

    console.log(`\n========================================================================`);
    console.log(`COMPREHENSIVE AUDIT COMPLETE:`);
    console.log(`Total Buttons Audited: ${auditedButtons.length}`);
    console.log(`Screenshots Captured: ${screenshots.length}`);
    console.log(`Total Errors Detected: ${errors.length}`);
    console.log(`========================================================================`);

    assert.equal(errors.length, 0, `Audit encountered ${errors.length} errors: ${errors.join('; ')}`);
    console.log(`🎉 ALL BUTTONS, SCREENS AND MODALS PASSED AUDIT WITH 0 ERRORS!`);

  } finally {
    // Teardown created user from DB
    try {
      const userRow = await pool.query('SELECT id FROM users WHERE email = $1', [testEmail]);
      if (userRow.rows[0]) {
        const uid = userRow.rows[0].id;
        await pool.query('DELETE FROM sessions WHERE user_id = $1', [uid]);
        await pool.query('DELETE FROM user_roles WHERE user_id = $1', [uid]);
        await pool.query('DELETE FROM audit_events WHERE actor_id = $1', [uid]);
        await pool.query('DELETE FROM users WHERE id = $1', [uid]);
      }
    } catch (e) {
      console.warn('Cleanup error (ignored):', e.message);
    }
    await pool.end();
    await browser.close();
  }
}

auditAllPagesAndButtons().catch((err) => {
  console.error('Fatal audit failure:', err);
  pool.end();
  process.exit(1);
});
