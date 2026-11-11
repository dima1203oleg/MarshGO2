import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const EVIDENCE_DIR = '/Users/dima1203/.gemini/antigravity/brain/1f9fa7ba-be90-4738-b480-9d68a25264b7/visual-evidence/user-experience';
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

const configuredBaseUrl = process.env.MARSHGO_E2E_BASE_URL || 'https://marshgo-dima.shares.zrok.io';
const parsedBaseUrl = new URL(configuredBaseUrl);
if (parsedBaseUrl.protocol !== 'https:' || !parsedBaseUrl.hostname.endsWith('.shares.zrok.io')) {
  throw new Error('MARSHGO_E2E_BASE_URL must use the existing HTTPS zrok shares host.');
}
const appBaseUrl = parsedBaseUrl.origin;

const auditSteps = [];

function recordStep(id, title, status, desc, file) {
  auditSteps.push({ id, title, status, desc, file });
  console.log(`[${status}] [Step ${id}] ${title} -> ${desc}`);
}

async function runCompleteUserJourney() {
  console.log('🚀 Running Complete End-to-End User Experience in Browser...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Flagship mobile (iPhone 14/15)
    deviceScaleFactor: 2,
    hasTouch: true,
    geolocation: { latitude: 50.4501, longitude: 30.5234 },
    permissions: ['geolocation'],
  });

  const page = await context.newPage();

  try {
    // -----------------------------------------------------------------
    // 1. Visit Web/PWA Landing
    // -----------------------------------------------------------------
    await page.goto(`${appBaseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const loginBtn = page.locator('button:has-text("У мене вже є акаунт")');
    if (await loginBtn.isVisible()) {
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '01-onboarding.png') });
      recordStep(1, 'Onboarding', 'OBSERVED', 'Вітальний екран успішно завантажено', '01-onboarding.png');

      await loginBtn.click();
      await page.waitForTimeout(300);
      const e2eEmail = process.env.MARSHGO_E2E_EMAIL;
      const e2ePassword = process.env.MARSHGO_E2E_PASSWORD;
      if (!e2eEmail || !e2ePassword) {
        throw new Error('Set MARSHGO_E2E_EMAIL and MARSHGO_E2E_PASSWORD to run the authenticated flow.');
      }
      await page.fill('#login-email', e2eEmail);
      await page.fill('#login-password', e2ePassword);
      const loginResponsePromise = page.waitForResponse((response) =>
        new URL(response.url()).pathname === '/api/v1/auth/login' && response.request().method() === 'POST',
      );
      await page.click('button[type="submit"]:has-text("Увійти")');
      const loginResponse = await loginResponsePromise;
      if (loginResponse.status() !== 200) {
        throw new Error(`Login API returned HTTP ${loginResponse.status()}`);
      }
      await page.locator('.production-app').waitFor({ state: 'visible', timeout: 15_000 });
      recordStep(2, 'Авторизація', 'PASS', 'API прийняв вхід і відкрив основний інтерфейс.', null);
    }
    await page.locator('.production-app').waitFor({ state: 'visible', timeout: 15_000 });

    // -----------------------------------------------------------------
    // 2. Home Dashboard & MarshPass
    // -----------------------------------------------------------------
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '03-home-dashboard.png') });
    recordStep(3, 'Головний екран', 'OBSERVED', 'Екран після спроби входу знято для ручного огляду.', '03-home-dashboard.png');

    // Quick Notifications check
    const notifBtn = page.locator('button[aria-label*="Сповіщення"]');
    if (await notifBtn.isVisible()) {
      await notifBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '04-notifications.png') });
      recordStep(4, 'Сповіщення', 'OBSERVED', 'Виконано спробу відкрити сповіщення; стан зафіксовано скриншотом.', '04-notifications.png');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // -----------------------------------------------------------------
    // 3. Search Tab & Transport Mode Selectors
    // -----------------------------------------------------------------
    const searchNav = page.locator('nav button:has-text("Пошук")').first();
    if (await searchNav.isVisible()) {
      await searchNav.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '05-search-tab-12-modes.png') });
      recordStep(5, 'Екран пошуку', 'OBSERVED', 'Екран пошуку знято; наявність усіх категорій окремо не перевірялась.', '05-search-tab-12-modes.png');
    }

    // -----------------------------------------------------------------
    // 4. Trips Tab & Saved Journeys
    // -----------------------------------------------------------------
    const tripsNav = page.locator('nav button:has-text("Поїздки")').first();
    await tripsNav.click();
    await page.waitForTimeout(800);

    // Switch to "Збережені"
    const savedTab = page.locator('button[role="tab"]:has-text("Збережені")').first();
    if (await savedTab.isVisible()) {
      await savedTab.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(EVIDENCE_DIR, '06-trips-saved-tab.png') });
      recordStep(6, 'Вкладка "Збережені"', 'OBSERVED', 'Вкладку поїздок знято; вміст і збережені маршрути не верифіковано.', '06-trips-saved-tab.png');

      // Click saved journey card to open JourneyRouteMapScreen
      const savedCard = page.locator('button:has-text("Карта й деталі маршруту")').first();
      if (await savedCard.isVisible()) {
        console.log('🗺️ Відкриваємо збережений маршрут у JourneyRouteMapScreen...');
        await savedCard.click();
        await page.waitForTimeout(3500); // Allow MapLibre GL to render

        await page.screenshot({ path: path.join(EVIDENCE_DIR, '07-cinematic-route-overview.png') });
        recordStep(7, 'Кінематографічний огляд маршруту', 'OBSERVED', 'Екран маршруту знято; геометрія й фокус камери не вимірювались.', '07-cinematic-route-overview.png');

        // Click ribbon pill for active segment focus & halo reveal
        const ribbonPill = page.locator('.mg-route-ribbon__pill').first();
        if (await ribbonPill.isVisible()) {
          console.log('🎯 Фокусування на транспортному сегменті...');
          await ribbonPill.click();
          await page.waitForTimeout(2000); // Wait for camera flyTo animation

          await page.screenshot({ path: path.join(EVIDENCE_DIR, '08-segment-cinematic-focus.png') });
          recordStep(8, 'Фокусування на сегменті', 'OBSERVED', 'Виконано спробу вибрати сегмент; рух камери й підказки не вимірювались.', '08-segment-cinematic-focus.png');
        }

        // Tapping sheet grabber
        const grabber = page.locator('.route-sheet-grabber').first();
        if (await grabber.isVisible()) {
          console.log('↕️ Адаптація висоти Bottom Sheet...');
          await grabber.click();
          await page.waitForTimeout(1500);

          await page.screenshot({ path: path.join(EVIDENCE_DIR, '09-bottom-sheet-collapsed.png') });
          recordStep(9, 'Адаптація Bottom Sheet', 'OBSERVED', 'Виконано спробу згорнути панель; висота та видимість карти не вимірювались.', '09-bottom-sheet-collapsed.png');
        }

        // Return back using Escape
        console.log('🔙 Повертаємось назад із карти маршруту по Escape...');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
      }
    }

    // -----------------------------------------------------------------
    // 5. Driver / Rideshare Creation Modal (+)
    // -----------------------------------------------------------------
    const createBtn = page.locator('button[aria-label*="Створити"]').first();
    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(EVIDENCE_DIR, '10-create-actions-menu.png') });
      recordStep(10, 'Меню створення поїздки (+)', 'OBSERVED', 'Меню створення знято; доступність кожної дії не перевірялась.', '10-create-actions-menu.png');

      const offerRideOption = page.locator('button:has-text("Запропонувати поїздку")').first();
      if (await offerRideOption.isVisible()) {
        await offerRideOption.click();
        await page.waitForTimeout(600);

        await page.screenshot({ path: path.join(EVIDENCE_DIR, '11-offer-ride-modal.png') });
        recordStep(11, 'Форма створення поїздки водієм', 'OBSERVED', 'Форму публікації знято; поля й надсилання не перевірялись.', '11-offer-ride-modal.png');

        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      } else {
        await page.keyboard.press('Escape');
      }
    }

    // -----------------------------------------------------------------
    // 6. Interactive MapPointPicker
    // -----------------------------------------------------------------
    const searchNavAgain = page.locator('nav button:has-text("Пошук")').first();
    if (await searchNavAgain.isVisible()) {
      await searchNavAgain.click();
      await page.waitForTimeout(600);

      const pickMapBtn = page.locator('button:has-text("Обрати на мапі")').first();
      if (await pickMapBtn.isVisible()) {
        await pickMapBtn.click();
        await page.waitForTimeout(1500);

        await page.screenshot({ path: path.join(EVIDENCE_DIR, '12-interactive-point-picker.png') });
        recordStep(12, 'Вибір точки на мапі (MapPointPicker)', 'OBSERVED', 'Екран вибору точки знято; координатну взаємодію не перевіряли.', '12-interactive-point-picker.png');

        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }

    // -----------------------------------------------------------------
    // 7. Profile, Settings & Graphite × Blue Theme Switch
    // -----------------------------------------------------------------
    const profileNav = page.locator('nav button:has-text("Профіль")').first();
    await profileNav.click();
    await page.waitForTimeout(800);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '13-profile-graphite-dark.png') });
    recordStep(13, 'Профіль користувача (Темна тема)', 'OBSERVED', 'Екран профілю знято; профільні дані та верифікація не перевірялись.', '13-profile-graphite-dark.png');

    // Check Settings
    const settingsSecBtn = page.locator('button:has-text("Налаштування")').first();
    if (await settingsSecBtn.isVisible()) {
      await settingsSecBtn.click();
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(EVIDENCE_DIR, '14-settings-theme.png') });
      recordStep(14, 'Налаштування теми', 'OBSERVED', 'Екран налаштувань знято; параметри й збереження не перевірялись.', '14-settings-theme.png');

      // Toggle Theme to Light
      const lightBtn = page.locator('button:has-text("Світла")').first();
      if (await lightBtn.isVisible()) {
        await lightBtn.click();
        await page.waitForTimeout(500);

        await page.screenshot({ path: path.join(EVIDENCE_DIR, '15-settings-theme-light.png') });
        recordStep(15, 'Світла тема', 'OBSERVED', 'Світлу тему ввімкнено та знято; контрастність не вимірювалась.', '15-settings-theme-light.png');

        // Toggle back to Dark
        const darkBtn = page.locator('button:has-text("Темна")').first();
        if (await darkBtn.isVisible()) {
          await darkBtn.click();
          await page.waitForTimeout(400);
        }
      }

      const backFromSettings = page.locator('button:has(svg.lucide-arrow-left)').first();
      if (await backFromSettings.isVisible()) {
        await backFromSettings.click();
        await page.waitForTimeout(400);
      }
    }

    // Check Data Sources
    const sourcesSecBtn = page.locator('button:has-text("Джерела даних")').first();
    if (await sourcesSecBtn.isVisible()) {
      await sourcesSecBtn.click();
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(EVIDENCE_DIR, '16-profile-data-sources.png') });
      recordStep(16, 'Джерела даних та ліцензії', 'OBSERVED', 'Екран джерел знято; провайдери, права й актуальність не перевірялись.', '16-profile-data-sources.png');
    }

    const observedCount = auditSteps.filter((step) => step.status === 'OBSERVED').length;
    console.log(`ℹ️ ${observedCount} UI checkpoints observed; this smoke script is not production acceptance evidence.`);
  } catch (err) {
    console.error('Fatal user testing error:', err);
    recordStep(99, 'Test Exception', 'FAIL', err.message, null);
    process.exitCode = 1;
  } finally {
    await browser.close();
    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'complete-user-flow-results.json'),
      JSON.stringify(auditSteps, null, 2),
      'utf8'
    );
  }
}

runCompleteUserJourney();
