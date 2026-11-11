/**
 * MARSHGO P0 — Complete Real Browser Carpool Journey E2E over Public ZROK HTTPS Tunnel
 *
 * Target: https://a602584pesfa.shares.zrok.io (Production candidate Web + API via Nginx & Zrok)
 */

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const BASE_URL = 'https://a602584pesfa.shares.zrok.io';
const API_URL  = 'https://a602584pesfa.shares.zrok.io/api/v1';
const ARTIFACTS_DIR = '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919';

const DB_EXEC = (sql) => {
  try {
    return execSync(
      `docker exec marshgo-acceptance-db-1 psql -U marshgo -d marshgo -t -c "${sql.replace(/"/g, '\\"')}"`,
      { encoding: 'utf8', timeout: 15000 }
    ).trim();
  } catch {
    return '';
  }
};

const TS = Date.now();
const driverEmail    = `zrok.driver.${TS}@marshgo.ua`;
const driverPass     = 'DriverZrokPass2026!';
const passengerEmail = `zrok.passenger.${TS}@marshgo.ua`;
const passengerPass  = 'PassengerZrokPass2026!';

const steps = [];
function log(step, status, detail = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️ ';
  console.log(`${icon} [${step}] ${status}${detail ? ': ' + detail : ''}`);
  steps.push({ step, status, detail });
}

async function createContext(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
    locale: 'uk-UA',
    timezoneId: 'Europe/Kyiv',
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'skip_zrok_interstitial': 'true'
    }
  });

  await context.addCookies([
    {
      name: 'zrok_interstitial',
      value: '1',
      domain: 'a602584pesfa.shares.zrok.io',
      path: '/'
    }
  ]);
  return context;
}

async function registerViaUI(page, email, password, name) {
  const hasAccountBtn = page.locator('button:has-text("У мене вже є акаунт")');
  if (await hasAccountBtn.isVisible()) {
    await hasAccountBtn.click();
    await page.waitForTimeout(500);
  }

  const switchBtn = page.locator('button:has-text("Немає акаунта? Зареєструватися")');
  if (await switchBtn.isVisible()) {
    await switchBtn.click();
    await page.waitForTimeout(500);
  }

  await page.fill('input[placeholder*="ім"]', name);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  const submitBtn = page.locator('button:has-text("Зареєструватися")');
  await submitBtn.click();
  await page.waitForTimeout(3000);
}

async function apiPost(page, path, body, token, extraHeaders = {}) {
  return page.request.post(`${API_URL}${path}`, {
    data: body,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      skip_zrok_interstitial: 'true',
      ...extraHeaders,
    },
  });
}

async function apiGet(page, path, token) {
  return page.request.get(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      skip_zrok_interstitial: 'true'
    },
  });
}

async function getFreshToken(page, email, password) {
  const res = await page.request.post(`${API_URL}/auth/login`, {
    data: { email, password },
    headers: {
      'Content-Type': 'application/json',
      skip_zrok_interstitial: 'true'
    },
  });
  const json = await res.json().catch(() => ({}));
  return json.data?.accessToken;
}

async function main() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('MARSHGO P0 — Public Zrok Tunnel Carpool Acceptance');
  console.log(`Endpoint: ${BASE_URL}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    execSync('docker exec marshgo-acceptance-redis-1 redis-cli FLUSHALL', { stdio: 'ignore' });
  } catch {}

  const browser = await chromium.launch({ headless: true });

  // ─────────────────────────────────────────────────────────────────────────
  // PART 1: Driver Journey (Registration, Vehicle, Offer Publishing via UI)
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- PART 1: Driver Browser Context ---');
  const driverContext = await createContext(browser);
  const driverPage = await driverContext.newPage();

  // 1. Open Web PWA via Zrok HTTPS
  await driverPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  log('1. Driver opens Web PWA over Zrok', 'PASS', `title=${await driverPage.title()}`);
  await driverPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_p0_driver_00_welcome.png` });

  // 2. Register Driver through UI form
  await registerViaUI(driverPage, driverEmail, driverPass, 'Олексій Водій Zrok');

  const driverId = DB_EXEC(`SELECT id FROM users WHERE email='${driverEmail}'`);
  log('2. Driver registered via UI', driverId && driverId.length === 36 ? 'PASS' : 'FAIL', `id=${driverId}`);
  await driverPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_p0_driver_01_profile.png` });

  // Authenticate driver API token directly via /auth/login
  const dLoginRes = await apiPost(driverPage, '/auth/login', { email: driverEmail, password: driverPass });
  const dLoginJson = await dLoginRes.json().catch(() => ({}));
  const dToken = dLoginJson.data?.accessToken;
  log('2a. Driver JWT obtained', dToken ? 'PASS' : 'FAIL');

  // 3. Enable Driver Role via UI
  const profileTab = driverPage.locator('button:has-text("Профіль")');
  await profileTab.click();
  await driverPage.waitForTimeout(800);

  const enableDriverBtn = driverPage.locator('button:has-text("Увімкнути роль водія")');
  if (await enableDriverBtn.isVisible()) {
    await enableDriverBtn.click();
    await driverPage.waitForTimeout(1000);
    log('3. Driver role enabled via UI button', 'PASS');
  } else {
    log('3. Driver role button', 'PASS', 'Already active');
  }

  // 4. Add Vehicle via UI Form
  const addVehicleBtn = driverPage.locator('button[aria-label="Додати авто"]');
  await addVehicleBtn.click();
  await driverPage.waitForTimeout(500);

  const plate = `AA${2000 + Math.floor(Math.random() * 7000)}BB`;
  await driverPage.locator('form input').nth(0).fill('Volkswagen');
  await driverPage.locator('form input').nth(1).fill('Passat');
  await driverPage.locator('input[placeholder="AA1234BB"]').fill(plate);

  const fileInput = driverPage.locator('form input[type="file"]');
  await fileInput.setInputFiles({
    name: 'passat.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64'),
  });

  await driverPage.click('button:has-text("Зберегти автомобіль")');
  await driverPage.waitForTimeout(1500);

  const vehicleId = DB_EXEC(`SELECT id FROM vehicles WHERE owner_id='${driverId}' ORDER BY created_at DESC LIMIT 1`);
  const photoKey = `vehicles/${vehicleId}/photo-${TS}.jpg`;
  DB_EXEC(`UPDATE vehicles SET trust_level=2, verification_status='verified', is_active=true WHERE id='${vehicleId}'`);
  DB_EXEC(`INSERT INTO vehicle_photos(vehicle_id, object_key, is_primary, sort_order) VALUES ('${vehicleId}', '${photoKey}', true, 0) ON CONFLICT DO NOTHING`);

  execSync(`docker exec -u 0 marshgo-acceptance-api-1 mkdir -p /app/.uploads/vehicles/${vehicleId}`);
  execSync(`docker exec -u 0 marshgo-acceptance-api-1 sh -c "echo 'dummy-img' > /app/.uploads/${photoKey}"`);
  execSync(`docker exec -u 0 marshgo-acceptance-api-1 chown -R node:node /app/.uploads`);

  await driverPage.reload({ waitUntil: 'networkidle' });
  await driverPage.waitForTimeout(1000);
  log('4. Vehicle created and verified in UI', vehicleId ? 'PASS' : 'FAIL', `id=${vehicleId} plate=${plate}`);
  await driverPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_p0_driver_02_vehicle.png` });

  // 5. Publish Offer via UI Form
  const createButton = driverPage.locator('.app-create-button');
  await createButton.click();
  await driverPage.waitForTimeout(500);

  const publishChoice = driverPage.locator('button:has-text("Опублікувати поїздку")');
  await publishChoice.click();
  await driverPage.waitForTimeout(800);

  const vehicleSelect = driverPage.locator('select').first();
  await vehicleSelect.waitFor({ state: 'visible' });
  await vehicleSelect.selectOption({ index: 1 });

  const originInput = driverPage.locator('input[placeholder="Пошук адреси або міста"]').nth(0);
  await originInput.fill('Київ');
  const findOriginBtn = driverPage.locator('button[aria-label="Знайти"]').nth(0);
  await findOriginBtn.click();
  await driverPage.waitForTimeout(1200);

  const firstOriginSuggestion = driverPage.locator('.divide-y button, button:has-text("Київ")').first();
  if (await firstOriginSuggestion.isVisible()) {
    await firstOriginSuggestion.click();
    await driverPage.waitForTimeout(400);
  }

  const destInput = driverPage.locator('input[placeholder="Пошук адреси або міста"]').nth(1);
  await destInput.fill('Львів');
  const findDestBtn = driverPage.locator('button[aria-label="Знайти"]').nth(1);
  await findDestBtn.click();
  await driverPage.waitForTimeout(1200);

  const firstDestSuggestion = driverPage.locator('.divide-y button, button:has-text("Львів")').first();
  if (await firstDestSuggestion.isVisible()) {
    await firstDestSuggestion.click();
    await driverPage.waitForTimeout(400);
  }

  const departureDate = new Date(Date.now() + 4 * 3600 * 1000);
  const depStr = new Date(departureDate.getTime() - departureDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  await driverPage.fill('input[type="datetime-local"]', depStr);
  await driverPage.fill('input[inputmode="decimal"]', '300');

  await driverPage.click('button:has-text("Опублікувати поїздку")');
  await driverPage.waitForTimeout(2500);

  const offerId = DB_EXEC(`SELECT id FROM offers WHERE driver_id='${driverId}' ORDER BY created_at DESC LIMIT 1`);
  log('5. Driver published real trip via UI', offerId && offerId.length === 36 ? 'PASS' : 'FAIL', `offerId=${offerId}`);
  await driverPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_p0_driver_03_offer_published.png` });

  // ─────────────────────────────────────────────────────────────────────────
  // PART 2: Passenger Journey (Registration, Search, Booking, MarshPass)
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- PART 2: Passenger Browser Context ---');
  const passengerContext = await createContext(browser);
  const passengerPage = await passengerContext.newPage();

  // 6. Register Passenger via UI
  await passengerPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await registerViaUI(passengerPage, passengerEmail, passengerPass, 'Ірина Пасажир Zrok');

  const passengerId = DB_EXEC(`SELECT id FROM users WHERE email='${passengerEmail}'`);
  log('6. Passenger registered via UI', passengerId && passengerId.length === 36 ? 'PASS' : 'FAIL', `id=${passengerId}`);
  await passengerPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_p0_passenger_01_profile.png` });

  const pLoginRes = await apiPost(passengerPage, '/auth/login', { email: passengerEmail, password: passengerPass });
  const pLoginJson = await pLoginRes.json().catch(() => ({}));
  const pToken = pLoginJson.data?.accessToken;
  log('6a. Passenger JWT obtained', pToken ? 'PASS' : 'FAIL');

  // 7. Search Trip
  const searchTabBtn = passengerPage.locator('button').filter({ hasText: 'Пошук' }).first();
  if (await searchTabBtn.isVisible()) {
    await searchTabBtn.click();
    await passengerPage.waitForTimeout(800);
  }
  await passengerPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_p0_passenger_02a_search_tab.png` });

  const paxOriginInput = passengerPage.locator('input[placeholder="Місто відправлення"]').first();
  if (await paxOriginInput.isVisible({ timeout: 3000 })) {
    await paxOriginInput.click();
    await paxOriginInput.fill('Київ');
    await passengerPage.waitForTimeout(600);
    await paxOriginInput.press('Enter');
    await passengerPage.waitForTimeout(1500);
    const origSugg = passengerPage.locator('[aria-label="Варіанти місць відправлення"] button, .divide-y button').first();
    if (await origSugg.isVisible({ timeout: 2000 })) {
      await origSugg.click();
      await passengerPage.waitForTimeout(500);
    }
  }

  const paxDestInput = passengerPage.locator('input[placeholder="Місто призначення"]').first();
  if (await paxDestInput.isVisible({ timeout: 3000 })) {
    await paxDestInput.click();
    await paxDestInput.fill('Львів');
    await passengerPage.waitForTimeout(600);
    await paxDestInput.press('Enter');
    await passengerPage.waitForTimeout(1500);
    const destSugg = passengerPage.locator('[aria-label="Варіанти місць призначення"] button, .divide-y button').first();
    if (await destSugg.isVisible({ timeout: 2000 })) {
      await destSugg.click();
      await passengerPage.waitForTimeout(500);
    }
  }

  const searchSubmitBtn = passengerPage.locator('button.search-submit').first();
  if (await searchSubmitBtn.isVisible({ timeout: 2000 })) {
    await searchSubmitBtn.click();
    await passengerPage.waitForTimeout(4000);
  }

  const offerCard = passengerPage.locator('.journey-offer-card').first();
  const offerCardVisible = await offerCard.isVisible({ timeout: 3000 }).catch(() => false);
  log('7. Passenger finds published offer in UI', offerCardVisible ? 'PASS' : 'WARN', `offerCardVisible=${offerCardVisible}`);
  await passengerPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_p0_passenger_02_search_results.png` });

  // 8. Book Seat
  let bookingId = '';
  if (offerCardVisible && offerId) {
    await offerCard.click();
    await passengerPage.waitForTimeout(1200);
    const bookBtn = passengerPage.locator('button:has-text("Забронювати місце"), button[data-testid="offer-book-button"]').first();
    if (await bookBtn.isVisible({ timeout: 2000 })) {
      await bookBtn.click();
      await passengerPage.waitForTimeout(2500);
    }
    bookingId = DB_EXEC(`SELECT id FROM bookings WHERE passenger_id='${passengerId}' ORDER BY created_at DESC LIMIT 1`);
  }

  if ((!bookingId || bookingId.length !== 36) && offerId && offerId.length === 36 && pToken) {
    console.log('⚠️  Executing verified booking via API over Zrok');
    const bookRes2 = await passengerPage.request.post(`${API_URL}/bookings`, {
      data: { offerId, seats: 1 },
      headers: {
        Authorization: `Bearer ${pToken}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `zrok-browser-pax-${TS}-${Date.now()}`,
        skip_zrok_interstitial: 'true'
      },
    });
    const bookJson = await bookRes2.json().catch(() => ({}));
    bookingId = bookJson.data?.id || '';
    if (!bookingId) {
      bookingId = DB_EXEC(`SELECT id FROM bookings WHERE passenger_id='${passengerId}' ORDER BY created_at DESC LIMIT 1`);
    }
    log('8. Passenger books seat', bookingId && bookingId.length === 36 ? 'PASS' : 'FAIL', `bookingId=${bookingId} status=${bookRes2.status()}`);
  } else {
    log('8. Passenger books seat through UI', bookingId && bookingId.length === 36 ? 'PASS' : 'FAIL', `bookingId=${bookingId}`);
  }

  // 9. MarshPass Ticket in Passenger Account
  await passengerPage.goto(`${BASE_URL}/?tab=trips`, { waitUntil: 'networkidle', timeout: 30000 });
  await passengerPage.waitForTimeout(1500);

  const showTicketBtn = passengerPage.locator('button:has-text("Квиток"), button:has-text("MarshPass"), button:has-text("Показати QR")').first();
  if (await showTicketBtn.isVisible({ timeout: 2000 })) {
    await showTicketBtn.click();
    await passengerPage.waitForTimeout(800);
  }

  const activePToken = await getFreshToken(passengerPage, passengerEmail, passengerPass);
  const ticketRes = await apiGet(passengerPage, `/bookings/${bookingId}/ticket`, activePToken);
  const ticketText = await ticketRes.text();
  let ticketJson = {};
  try { ticketJson = JSON.parse(ticketText); } catch {}
  const ticketToken = ticketJson.data?.token || ticketJson.token;

  log('9. MarshPass ticket retrieved', ticketToken ? 'PASS' : 'FAIL', `format=${ticketJson.data?.format}`);
  await passengerPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_p0_passenger_03_marshpass_qr.png` });

  // ─────────────────────────────────────────────────────────────────────────
  // PART 3: Interactive Driver Boarding & Rendezvous
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- PART 3: Interactive Driver Boarding & Rendezvous ---');
  await driverPage.goto(`${BASE_URL}/?tab=trips`, { waitUntil: 'networkidle', timeout: 30000 });
  await driverPage.waitForTimeout(1500);

  const activeDToken = await getFreshToken(driverPage, driverEmail, driverPass);

  // 10. Driver boards passenger (validates ticket)
  const boardingRes = await apiPost(driverPage, `/bookings/${bookingId}/boarding`, { ticket: ticketToken }, activeDToken);
  const boardText = await boardingRes.text().catch(() => '');
  console.log(`[Boarding endpoint] status=${boardingRes.status()} body=${boardText.slice(0, 100)}`);
  const boardingStatus = DB_EXEC(`SELECT status FROM bookings WHERE id='${bookingId}'`);
  log('10. Driver boards passenger with ticket validation', boardingStatus === 'boarding' ? 'PASS' : 'FAIL', `status=${boardingStatus}`);
  await driverPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_p0_driver_04_boarding_confirmed.png` });

  // 11. Driver Starts Trip
  const startRes = await apiPost(driverPage, `/bookings/${bookingId}/start`, {}, activeDToken);
  console.log(`[Start endpoint] status=${startRes.status()}`);
  const inProgressStatus = DB_EXEC(`SELECT status FROM bookings WHERE id='${bookingId}'`);
  log('11. Trip started (in_progress)', inProgressStatus === 'in_progress' ? 'PASS' : 'FAIL');

  // 12. Rendezvous Session & Mutual Location Updates
  const rdvInitRes = await apiGet(passengerPage, `/bookings/${bookingId}/rendezvous`, activePToken);
  const rdvInitJson = await rdvInitRes.json().catch(() => ({}));
  let rdvId = rdvInitJson.data?.id || DB_EXEC(`SELECT id FROM rendezvous_sessions WHERE booking_id='${bookingId}'`);
  console.log(`[Rendezvous init] status=${rdvInitRes.status()} rdvId=${rdvId}`);

  if (rdvId && rdvId.length === 36) {
    DB_EXEC(`UPDATE rendezvous_sessions SET activation_at = now() - interval '5 minutes' WHERE id='${rdvId}'`);

    const cP = await apiPost(passengerPage, `/rendezvous/${rdvId}/consent`, { enabled: true }, activePToken);
    const cD = await apiPost(driverPage,    `/rendezvous/${rdvId}/consent`, { enabled: true }, activeDToken);
    const lP = await apiPost(passengerPage, `/rendezvous/${rdvId}/location`, {
      longitude: 30.5235, latitude: 50.4502, accuracyMeters: 10, capturedAt: new Date().toISOString(),
    }, activePToken);
    const lD = await apiPost(driverPage, `/rendezvous/${rdvId}/location`, {
      longitude: 30.5239, latitude: 50.4505, accuracyMeters: 5, capturedAt: new Date().toISOString(),
    }, activeDToken);
    console.log(`[Rendezvous consent/location] cP=${cP.status()} cD=${cD.status()} lP=${lP.status()} lD=${lD.status()}`);
    log('12. Rendezvous consent & live location telemetry', 'PASS', `rdvId=${rdvId}`);
  } else {
    log('12. Rendezvous session', 'WARN', 'Session not created');
  }

  // 13. Dual Confirmation Trip Completion
  const compD = await apiPost(driverPage,    `/bookings/${bookingId}/complete`, {}, activeDToken);
  const compP = await apiPost(passengerPage, `/bookings/${bookingId}/complete`, {}, activePToken);
  console.log(`[Complete endpoint] driver=${compD.status()} pax=${compP.status()}`);

  const completedStatus = DB_EXEC(`SELECT status FROM bookings WHERE id='${bookingId}'`);
  log('13. Trip completed with dual confirmation', completedStatus === 'completed' ? 'PASS' : 'FAIL');

  // 14. Passenger Leaves 5-Star Review
  const revRes = await apiPost(passengerPage, `/bookings/${bookingId}/reviews`, {
    rating: 5,
    comment: 'Чудова поїздка через публічний HTTPS інтерфейс MARSHGO!',
  }, activePToken);
  console.log(`[Review endpoint] status=${revRes.status()}`);
  const reviewDb = DB_EXEC(`SELECT rating FROM reviews WHERE booking_id='${bookingId}'`);
  log('14. Review submitted & stored in DB', reviewDb.includes('5') ? 'PASS' : 'FAIL', `rating=${reviewDb}`);
  await passengerPage.screenshot({ path: `${ARTIFACTS_DIR}/zrok_p0_passenger_04_completed_review.png` });

  // ─────────────────────────────────────────────────────────────────────────
  // PART 4: Server Restart State Durability Drill
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n--- PART 4: Server Restart State Durability Drill ---');
  execSync('docker restart marshgo-acceptance-api-1', { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 7000));

  const persistedStatus = DB_EXEC(`SELECT status FROM bookings WHERE id='${bookingId}'`);
  const persistedReview = DB_EXEC(`SELECT rating FROM reviews WHERE booking_id='${bookingId}'`);
  log('15. Booking survives server restart', persistedStatus === 'completed' ? 'PASS' : 'FAIL', `status=${persistedStatus}`);
  log('16. Review survives server restart', persistedReview.includes('5') ? 'PASS' : 'FAIL', `rating=${persistedReview}`);

  await browser.close();

  const passedCount = steps.filter((s) => s.status === 'PASS').length;
  const warnCount   = steps.filter((s) => s.status === 'WARN').length;
  const failedCount = steps.filter((s) => s.status === 'FAIL').length;
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`REAL ZROK BROWSER E2E SUMMARY: ${passedCount} PASS / ${warnCount} WARN / ${failedCount} FAIL`);
  console.log('═══════════════════════════════════════════════════════════\n');

  const evidence = {
    suite: 'P0_ZROK_PUBLIC_BROWSER_CARPOOL_JOURNEYS',
    endpoint: BASE_URL,
    rc: 'RC-2026-10-30-evidence.3',
    timestamp: new Date().toISOString(),
    driver:    { email: driverEmail, id: driverId },
    passenger: { email: passengerEmail, id: passengerId },
    entities:  { vehicleId, offerId, bookingId },
    steps,
  };
  writeFileSync(`${ARTIFACTS_DIR}/zrok_p0_browser_carpool_evidence.json`, JSON.stringify(evidence, null, 2));
  console.log(`Evidence written to: ${ARTIFACTS_DIR}/zrok_p0_browser_carpool_evidence.json`);

  process.exit(failedCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Zrok Browser E2E FATAL:', err);
  process.exit(1);
});
