const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runDeepAudit() {
  const artifactDir = '/Users/dima1203/.gemini/antigravity-ide/brain/e508fd6d-8a68-4a57-9f93-681a5627f9f1';
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });

  const context = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));

  const auditData = {};

  console.log('1. Loading landing page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, '01_intro_screen.png') });

  // Onboarding slides
  console.log('2. Inspecting onboarding slides...');
  const startBtn = page.getByRole('button', { name: 'Почати' });
  if (await startBtn.isVisible()) {
    await startBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(artifactDir, '02_onboarding_slide1.png') });

    const nextBtn = page.getByRole('button', { name: 'Далі' });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(artifactDir, '03_onboarding_slide2.png') });

      const nextBtn2 = page.getByRole('button', { name: 'Далі' });
      if (await nextBtn2.isVisible()) {
        await nextBtn2.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(artifactDir, '04_onboarding_slide3.png') });
      }
    }
  }

  // Go to Login
  console.log('3. Navigating to login...');
  const skipOrFinish = page.locator('button:has-text("Пропустити"), button:has-text("Розпочати"), button:has-text("Почати")').first();
  if (await skipOrFinish.isVisible()) {
    await skipOrFinish.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: path.join(artifactDir, '05_phone_login.png') });

  // Fill login
  const nameInput = page.locator('input[placeholder="Ваше ім’я"]');
  if (await nameInput.isVisible()) {
    await nameInput.fill('Олексій');
    const phoneInput = page.locator('input[placeholder="+380 номер телефону"]');
    await phoneInput.fill('+380501234567');
    await page.locator('button:has-text("Почати")').click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(artifactDir, '06_otp_step.png') });

    const devCodeElement = page.locator('text=Тестовий OTP локального середовища:');
    if (await devCodeElement.isVisible()) {
      const text = await devCodeElement.innerText();
      const match = text.match(/\d{6}/);
      const code = match ? match[0] : '123456';
      const codeInput = page.locator('input[placeholder="••••••"]');
      await codeInput.fill(code);
      await page.locator('button:has-text("Підтвердити номер")').click();
      await page.waitForTimeout(1500);
    }
  }

  // We are now in Main App
  console.log('4. In Main App - Home/Rendezvous view...');
  await page.screenshot({ path: path.join(artifactDir, '07_main_home_screen.png') });

  // Explore Navigation Tabs
  const bottomTabs = await page.$$eval('nav button, nav a', els => els.map(e => e.innerText.trim()).filter(Boolean));
  auditData.tabs = bottomTabs;

  // Search tab
  console.log('5. Navigating to Search...');
  const searchTab = page.locator('button:has-text("Пошук")').last();
  if (await searchTab.isVisible()) {
    await searchTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, '08_search_form.png') });

    // Execute Search
    const routeSearchBtn = page.locator('button:has-text("Знайти маршрут")').first();
    if (await routeSearchBtn.isVisible()) {
      await routeSearchBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(artifactDir, '09_search_results_balanced.png') });

      // Click on Fastest strategy
      const fastest = page.locator('button:has-text("Найшвидше")').first();
      if (await fastest.isVisible()) {
        await fastest.click();
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(artifactDir, '10_search_results_fastest.png') });
      }

      // Click on Details of first trip
      const firstCard = page.locator('button:has-text("Мультимодальний"), button:has-text("грн"), button.group').first();
      if (await firstCard.isVisible()) {
        await firstCard.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(artifactDir, '11_trip_details_map.png') });
      }
    }
  }

  // Trips / Active Trips tab
  console.log('6. Navigating to Trips tab...');
  const tripsTab = page.locator('button:has-text("Поїздки")').first();
  if (await tripsTab.isVisible()) {
    await tripsTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, '12_trips_tab.png') });
  }

  // Profile / Settings tab
  console.log('7. Navigating to Profile tab...');
  const profileTab = page.locator('button:has-text("Профіль")').first();
  if (await profileTab.isVisible()) {
    await profileTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, '13_profile_tab.png') });
  }

  // Desktop Responsive View
  console.log('8. Capturing Desktop resolution...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000/search', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: path.join(artifactDir, '14_desktop_search_view.png') });
  await desktopContext.close();

  auditData.consoleMessages = consoleMessages;
  fs.writeFileSync(path.join(artifactDir, 'deep_audit_summary.json'), JSON.stringify(auditData, null, 2));

  console.log('ALL_AUDITS_CAPTURED_SUCCESSFULLY');
  await browser.close();
}

runDeepAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
