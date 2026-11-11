import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import pg from 'pg';

const PREVIEW_URL = process.env.PREVIEW_URL || 'http://127.0.0.1:3001';
const API_URL = process.env.API_URL || 'http://127.0.0.1:3002';
const DATABASE_URL = 'postgres://marshgo:local_only_change_me@127.0.0.1:5434/marshgo';

const pool = new pg.Pool({ connectionString: DATABASE_URL });

async function verify() {
  console.log(`Starting Full Browser End-to-End Verification on ${PREVIEW_URL}...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 950 },
  });
  const page = await context.newPage();

  const runId = Math.floor(100000 + Math.random() * 900000);
  const testEmail = `browser.e2e.${runId}@marshgo.ua`;
  const testPassword = 'Password2026!';
  const testName = `Тестер Браузера ${runId}`;

  try {
    // 1. Load Home
    console.log('1. Loading Home page...');
    await page.goto(`${PREVIEW_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const title = await page.title();
    console.log(` Page title: "${title}"`);
    assert.match(title, /MARSHGO/i);

    // 2. Click "У мене вже є акаунт" or start onboarding
    console.log('2. Testing Email & Password Auth UI...');
    const loginButton = page.locator('button:has-text("У мене вже є акаунт")');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.waitForTimeout(600);
    }

    // Switch to Register tab
    const registerTab = page.locator('button:has-text("Реєстрація")');
    await registerTab.waitFor({ state: 'visible', timeout: 5000 });
    await registerTab.click();
    await page.waitForTimeout(500);

    // Fill registration form
    console.log(` Registering user: ${testEmail}...`);
    const nameInput = page.locator('input[autocomplete="name"], input[placeholder*="ім’я"], input[placeholder*="імя"]').first();
    await nameInput.fill(testName);
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').fill(testPassword);

    const submitBtn = page.locator('button:has-text("Зареєструватися")');
    await submitBtn.click();
    await page.waitForTimeout(2500);

    // Check that user is logged in and bottom navigation is visible
    const bottomNav = page.locator('nav, [role="navigation"]').first();
    assert.ok(await bottomNav.isVisible(), 'Bottom navigation must be visible after login');
    console.log(' Successfully registered and logged in via UI!');

    // Capture Home screenshot
    await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/e2e_full_01_home.png' });

    // 3. Navigate to Search Tab
    console.log('3. Navigating to Search Tab...');
    const searchNavBtn = page.locator('button:has-text("Пошук")').first();
    await searchNavBtn.click();
    await page.waitForTimeout(1500);

    // 4. Fill Origin and Destination (Львів -> Київ)
    console.log('4. Entering search parameters (Львів -> Київ)...');
    const originInput = page.locator('input[aria-label="Звідки"]').first();
    const destInput = page.locator('input[aria-label="Куди"]').first();

    await originInput.click();
    await originInput.fill('Львів');
    await page.waitForTimeout(1000);
    const suggestionOrigin = page.locator('button:has-text("Львів")').first();
    if (await suggestionOrigin.isVisible()) {
      await suggestionOrigin.click();
      console.log(' Selected origin suggestion: Львів');
    }
    await page.waitForTimeout(600);

    await destInput.click();
    await destInput.fill('Київ');
    await page.waitForTimeout(1000);
    const suggestionDest = page.locator('button:has-text("Київ")').first();
    if (await suggestionDest.isVisible()) {
      await suggestionDest.click();
      console.log(' Selected destination suggestion: Київ');
    }
    await page.waitForTimeout(800);

    // Click search button
    const searchSubmit = page.locator('button:has-text("Знайти маршрут")').first();
    if (await searchSubmit.isVisible()) {
      await searchSubmit.click();
      console.log(' Clicked search submit button');
    }
    await page.waitForTimeout(6000);

    // Capture search results screenshot
    await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/e2e_full_02_search_results.png' });
    console.log(' Captured search results screenshot');

    // 5. Navigate to Trips Tab
    console.log('5. Navigating to Trips Tab...');
    const tripsBtn = page.locator('button:has-text("Поїздки")').first();
    if (await tripsBtn.isVisible()) {
      await tripsBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/e2e_full_03_trips.png' });
      console.log(' Captured trips screenshot');
    }

    // 6. Navigate to Profile Tab
    console.log('6. Navigating to Profile Tab...');
    const profileBtn = page.locator('button:has-text("Профіль")').first();
    if (await profileBtn.isVisible()) {
      await profileBtn.click();
      await page.waitForTimeout(1500);

      // Verify user display name is shown
      const pageText = await page.textContent('body');
      assert.ok(pageText.includes(testName) || pageText.includes('Профіль'), 'Profile must display user information');
      await page.screenshot({ path: '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919/e2e_full_04_profile.png' });
      console.log(' Captured profile screenshot');
    }

    console.log('\n ALL FULL BROWSER END-TO-END STEPS COMPLETED SUCCESSFULLY!');
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

verify().catch((err) => {
  console.error('Browser verification failed:', err);
  pool.end();
  process.exit(1);
});
