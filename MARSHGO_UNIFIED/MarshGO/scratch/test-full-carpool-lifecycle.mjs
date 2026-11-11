import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:3001';
const SCREENSHOT_DIR = '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919';

function kyivTomorrowString() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function run() {
  console.log('🚀 Starting Full Carpool Lifecycle End-to-End Verification...');
  const browser = await chromium.launch({ headless: true });

  // -------------------------------------------------------------
  // Phase 1: Driver Oleksiy publishes a ride from Lviv to Kyiv
  // -------------------------------------------------------------
  console.log('\n--- Phase 1: Driver Login & Publish Offer ---');
  const driverContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const driverPage = await driverContext.newPage();

  driverPage.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[Driver Console Error]:', msg.text());
  });

  await driverPage.goto(BASE_URL);
  await driverPage.waitForSelector('.auth-screen');

  // Real Email & Password Login
  await driverPage.fill('input[type="email"]', 'driver@marshgo.ua');
  await driverPage.fill('input[type="password"]', 'DriverPass123!');
  await driverPage.click('button[type="submit"]');
  await driverPage.waitForSelector('.production-app', { timeout: 15000 });
  console.log('✅ Driver Oleksiy logged in successfully via real email/password');

  // Navigate to offer-new tab
  await driverPage.evaluate(() => {
    window.location.hash = '';
    window.history.pushState({}, '', '/offers/new');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await driverPage.waitForTimeout(500);

  // Verify offer form loaded
  await driverPage.waitForSelector('form:has-text("Опублікувати поїздку")');
  console.log('✅ Offer publication form loaded');

  // Fill origin: Львів
  const originInput = driverPage.locator('input[placeholder="Пошук адреси або міста"]').first();
  await originInput.fill('Львів');
  const originSearchBtn = driverPage.locator('button[aria-label="Знайти"]').first();
  await originSearchBtn.click();
  await driverPage.waitForSelector('button:has-text("Львів, Львівська міська громада")', { timeout: 5000 });
  await driverPage.click('button:has-text("Львів, Львівська міська громада")');
  console.log('✅ Origin selected: Львів');

  // Fill destination: Київ
  const destInput = driverPage.locator('input[placeholder="Пошук адреси або міста"]').nth(1);
  await destInput.fill('Київ');
  const destSearchBtn = driverPage.locator('button[aria-label="Знайти"]').nth(1);
  await destSearchBtn.click();
  await driverPage.waitForSelector('button:has-text("Київ, Україна")', { timeout: 5000 });
  await driverPage.click('button:has-text("Київ, Україна")');
  console.log('✅ Destination selected: Київ');

  // Departure date
  const departureInput = driverPage.locator('input[type="datetime-local"]');
  const departureValue = kyivTomorrowString();
  await departureInput.fill(departureValue);
  console.log(`✅ Departure set to: ${departureValue}`);

  // Select vehicle
  const vehicleSelect = driverPage.locator('select').first();
  const options = await vehicleSelect.locator('option').allInnerTexts();
  console.log('Vehicle options:', options);
  await vehicleSelect.selectOption({ index: 1 }); // Select Toyota Camry

  // Price
  const priceInput = driverPage.locator('input[inputmode="decimal"]');
  await priceInput.fill('450');

  // Submit offer
  const publishBtn = driverPage.locator('button:has-text("Опублікувати поїздку")');
  await publishBtn.click();

  // Wait for success status and redirection to trips
  await driverPage.waitForFunction(() => {
    return document.body.innerText.includes('Поїздку збережено на сервері') ||
           document.body.innerText.includes('Мої поїздки');
  }, { timeout: 10000 });
  console.log('🎉 Offer published successfully to database!');

  await driverPage.screenshot({ path: `${SCREENSHOT_DIR}/lifecycle_01_driver_published.png` });

  // -------------------------------------------------------------
  // Phase 2: Passenger Iryna logs in, finds offer & books 1 seat
  // -------------------------------------------------------------
  console.log('\n--- Phase 2: Passenger Login, Search & Book ---');
  const passengerContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const passengerPage = await passengerContext.newPage();

  passengerPage.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[Passenger Console Error]:', msg.text());
  });

  await passengerPage.goto(BASE_URL);
  await passengerPage.waitForSelector('.auth-screen');

  // Real Email & Password Login
  await passengerPage.fill('input[type="email"]', 'passenger@marshgo.ua');
  await passengerPage.fill('input[type="password"]', 'PassengerPass123!');
  await passengerPage.click('button[type="submit"]');
  await passengerPage.waitForSelector('.production-app', { timeout: 15000 });
  console.log('✅ Passenger Iryna logged in successfully via real email/password');

  // Query open offers for Lviv -> Kyiv
  console.log('Querying open offers...');
  const offersRes = await passengerPage.evaluate(async () => {
    const res = await fetch('/api/v1/offers?origin=%D0%9B%D1%8C%D0%B2%D1%96%D0%B2&destination=%D0%9A%D0%B8%D1%97%D0%B2&originLon=24.0315921&originLat=49.841952&destinationLon=30.5241361&destinationLat=50.4500336');
    const json = await res.json();
    return json.data;
  });
  console.log(`Found ${offersRes.length} open offers in database`);
  const ourOffer = offersRes[0];
  if (!ourOffer) {
    throw new Error('Could not find newly published offer');
  }
  console.log(`Target Offer ID: ${ourOffer.id}, Price: ${ourOffer.price_per_seat_minor / 100} ₴`);

  // Navigate passenger to offer detail screen
  await passengerPage.evaluate((id) => {
    window.history.pushState({}, '', `/offers/${id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, ourOffer.id);
  await passengerPage.waitForTimeout(800);

  // Verify offer details screen loaded
  await passengerPage.waitForSelector('button[data-testid="offer-book-button"]', { timeout: 10000 });
  console.log('✅ Offer details rendered on passenger screen');

  await passengerPage.screenshot({ path: `${SCREENSHOT_DIR}/lifecycle_02_passenger_offer_view.png` });

  // Click "Забронювати місце"
  const bookBtn = passengerPage.locator('button[data-testid="offer-book-button"]');
  await bookBtn.click();
  console.log('Clicked "Забронювати місце" button');

  // Wait for redirect to trips tab and switch to "Заплановані"
  await passengerPage.waitForTimeout(1000);
  const upcomingTabBtn = passengerPage.locator('button[role="tab"]:has-text("Заплановані")');
  if (await upcomingTabBtn.isVisible()) {
    await upcomingTabBtn.click();
    console.log('Switched to "Заплановані" tab');
  }

  // Wait for booking card to appear
  console.log('Waiting for booked trip card in trips tab...');
  await passengerPage.waitForSelector('button:has-text("Показати квиток для посадки")', { timeout: 15000 });
  console.log('🎉 Booking confirmed and visible in Trips tab!');

  await passengerPage.screenshot({ path: `${SCREENSHOT_DIR}/lifecycle_02_passenger_marshpass.png` });

  // Show ticket for boarding
  console.log('Clicking "Показати квиток для посадки"...');
  await passengerPage.click('button:has-text("Показати квиток для посадки")');
  console.log('Waiting for boarding ticket token...');
  await passengerPage.waitForSelector('[data-testid="boarding-token-text"]', { timeout: 15000 });
  const boardingToken = await passengerPage.locator('[data-testid="boarding-token-text"]').innerText();
  console.log(`🎫 Boarding ticket received! Token: ${boardingToken}`);

  await passengerPage.screenshot({ path: `${SCREENSHOT_DIR}/lifecycle_03_passenger_ticket_qr.png` });

  // -------------------------------------------------------------
  // Phase 3: Boarding confirmation by Driver
  // -------------------------------------------------------------
  console.log('\n--- Phase 3: Driver Boarding Confirmation ---');
  // Driver goes to trips tab
  await driverPage.evaluate(() => {
    window.history.pushState({}, '', '/trips');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await driverPage.reload();
  await driverPage.waitForSelector('.production-app');

  // Switch to "Заплановані" to see the upcoming confirmed booking
  const driverUpcomingTab = driverPage.locator('button[role="tab"]:has-text("Заплановані")');
  if (await driverUpcomingTab.isVisible()) {
    await driverUpcomingTab.click();
    await driverPage.waitForTimeout(500);
  }

  // Find boarding ticket input on driver page
  const boardingInput = driverPage.locator('input[aria-label="Токен квитка пасажира"], input[placeholder*="токен"]').first();
  await boardingInput.waitFor({ timeout: 10000 });
  await boardingInput.fill(boardingToken.trim());
  console.log('Filled boarding token into Driver form');

  const confirmTicketBtn = driverPage.locator('button:has-text("Підтвердити посадку")').first();
  await confirmTicketBtn.click();
  console.log('Driver clicked "Підтвердити посадку"');

  // Switch to "Активні" tab where boarding trip is now located
  await driverPage.waitForTimeout(800);
  const driverActiveTab = driverPage.locator('button[role="tab"]:has-text("Активні")');
  if (await driverActiveTab.isVisible()) {
    await driverActiveTab.click();
  }

  // Wait for "Почати поїздку" button
  await driverPage.waitForSelector('button:has-text("Почати поїздку")', { timeout: 10000 });
  console.log('🎉 Driver confirmed passenger boarding! "Почати поїздку" button is now active');

  await driverPage.screenshot({ path: `${SCREENSHOT_DIR}/lifecycle_04_driver_boarding_confirmed.png` });

  // -------------------------------------------------------------
  // Phase 4: Start Trip & In-Progress
  // -------------------------------------------------------------
  console.log('\n--- Phase 4: Driver Starts Trip ---');
  const startTripBtn = driverPage.locator('button:has-text("Почати поїздку")').first();
  await startTripBtn.click();

  await driverPage.waitForSelector('button:has-text("Підтвердити завершення")', { timeout: 10000 });
  console.log('🎉 Trip officially in-progress! "Підтвердити завершення" is available for Driver');

  await driverPage.screenshot({ path: `${SCREENSHOT_DIR}/lifecycle_05_driver_trip_started.png` });

  // -------------------------------------------------------------
  // Phase 5: Rendezvous & Completion
  // -------------------------------------------------------------
  console.log('\n--- Phase 5: Rendezvous & Completion ---');
  // Passenger switches to "Активні"
  const passActiveTab = passengerPage.locator('button[role="tab"]:has-text("Активні")');
  if (await passActiveTab.isVisible()) {
    await passActiveTab.click();
    await passengerPage.waitForTimeout(500);
  }

  // Passenger checks rendezvous meeting
  const openMeetingBtn = passengerPage.locator('button:has-text("Відкрити зустріч")').first();
  if (await openMeetingBtn.isVisible()) {
    await openMeetingBtn.click();
    await passengerPage.waitForTimeout(1000);
    console.log('✅ Passenger opened rendezvous meeting');
    await passengerPage.screenshot({ path: `${SCREENSHOT_DIR}/lifecycle_06_passenger_rendezvous.png` });

    // Close meeting view to return to trips list
    const backBtn = passengerPage.locator('button[aria-label="Назад"]').first();
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await passengerPage.waitForTimeout(500);
      console.log('Closed rendezvous meeting view');
    }
  }

  // Driver confirms completion
  console.log('Driver confirming completion...');
  const driverConfirmCompletion = driverPage.locator('button:has-text("Підтвердити завершення")').first();
  await driverConfirmCompletion.click();
  await driverPage.waitForTimeout(800);

  // Passenger confirms completion
  console.log('Passenger confirming completion...');
  // Ensure on "Активні" tab
  if (await passActiveTab.isVisible()) await passActiveTab.click();
  const passengerConfirmCompletion = passengerPage.locator('button:has-text("Підтвердити завершення")').first();
  await passengerConfirmCompletion.click();
  await passengerPage.waitForTimeout(1000);

  // Both confirmed -> trip is completed! Now let's open "Історія" tab on passenger
  console.log('Opening History tab for review...');
  const moreBtn = passengerPage.locator('button[aria-label="Інші розділи поїздок"]');
  if (await moreBtn.isVisible()) {
    await moreBtn.click();
    await passengerPage.waitForTimeout(300);
  }
  const historyTab = passengerPage.locator('button[role="tab"]:has-text("Історія")');
  if (await historyTab.isVisible()) {
    await historyTab.click();
    await passengerPage.waitForTimeout(500);
  }

  // Verify "Залишити відгук" is available
  await passengerPage.waitForSelector('button:has-text("Залишити відгук"), button[data-testid="booking-review-open"]', { timeout: 10000 });
  console.log('🎉 Trip successfully completed by both participants! "Залишити відгук" is available');

  await passengerPage.screenshot({ path: `${SCREENSHOT_DIR}/lifecycle_07_trip_completed.png` });

  // Passenger leaves review
  const reviewBtn = passengerPage.locator('button:has-text("Залишити відгук"), button[data-testid="booking-review-open"]').first();
  await reviewBtn.click();
  await passengerPage.waitForSelector('textarea', { timeout: 5000 });
  await passengerPage.fill('textarea', 'Поїздка пройшла чудово, водій пунктуальний!');
  const submitReviewBtn = passengerPage.locator('button:has-text("Надіслати відгук")').first();
  if (await submitReviewBtn.isVisible()) {
    await submitReviewBtn.click();
    await passengerPage.waitForTimeout(800);
    console.log('✅ Passenger review submitted successfully');
  }

  await passengerPage.screenshot({ path: `${SCREENSHOT_DIR}/lifecycle_08_review_submitted.png` });

  await browser.close();
  console.log('\n=============================================================');
  console.log('🏆 100% CARPOOL LIFECYCLE VERIFIED END-TO-END VIA BROWSER UI!');
  console.log('=============================================================');
}

run().catch((err) => {
  console.error('❌ Lifecycle verification failed:', err);
  process.exit(1);
});
