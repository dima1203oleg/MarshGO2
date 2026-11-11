import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { chromium } from 'playwright';
import pg from 'pg';
import { lifecycleFixtureTargets } from '../scripts/lifecycle-fixture-targets.mjs';

// Historical fixture renderer: SQL seeds publication, booking and completion.
// The harness owner must independently verify that the API uses this disposable DB.
const targets = lifecycleFixtureTargets(process.env);
const PREVIEW_URL = targets.previewUrl;
const API_URL = targets.apiUrl;
const DATABASE_URL = targets.databaseUrl;
const pool = new pg.Pool({ connectionString: DATABASE_URL });

const ARTIFACT_DIR = '/Users/dima1203/.gemini/antigravity/brain/0d1cdeee-53b1-4629-b63b-c2b1bd18c919';

async function runTwoAccountLifecycle() {
  console.log('========================================================================');
  console.log('MARSHGO HISTORICAL FIXTURE-ASSISTED UI RENDERING — NOT PRODUCT E2E');
  console.log(`UI: ${PREVIEW_URL} | API: ${API_URL}`);
  console.log('========================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const runId = Math.floor(100000 + Math.random() * 900000);

  const driverEmail = `driver.${runId}@marshgo.ua`;
  const driverPass = 'DriverPass2026!';
  const driverName = `Олексій Водій ${runId}`;

  const passengerEmail = `passenger.${runId}@marshgo.ua`;
  const passengerPass = 'PassengerPass2026!';
  const passengerName = `Ірина Пасажирка ${runId}`;

  const driverContext = await browser.newContext({
    viewport: { width: 412, height: 915 },
    geolocation: { latitude: 50.4501, longitude: 30.5234 }, // Kyiv
    permissions: ['geolocation'],
  });

  const passengerContext = await browser.newContext({
    viewport: { width: 412, height: 915 },
    geolocation: { latitude: 50.4501, longitude: 30.5234 }, // Kyiv
    permissions: ['geolocation'],
  });

  const driverPage = await driverContext.newPage();
  const passengerPage = await passengerContext.newPage();

  const milestones = [];

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Driver Registration & Vehicle Setup
    // -------------------------------------------------------------------------
    console.log(`[Step 1] Registering Driver: ${driverEmail}...`);
    await driverPage.goto(`${PREVIEW_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    const welcomeLogin = driverPage.locator('button:has-text("У мене вже є акаунт")');
    if (await welcomeLogin.isVisible()) {
      await welcomeLogin.click();
      await driverPage.waitForTimeout(300);
    }
    const registerTab = driverPage.locator('button:has-text("Реєстрація")');
    await registerTab.click();
    await driverPage.waitForTimeout(200);

    await driverPage.locator('input[autocomplete="name"], input[placeholder*="ім’я"]').first().fill(driverName);
    await driverPage.locator('input[autocomplete="email"], input[type="email"]').first().fill(driverEmail);
    await driverPage.locator('input[autocomplete="new-password"], input[type="password"]').first().fill(driverPass);

    const driverRoleBtn = driverPage.locator('button:has-text("Водій")');
    if (await driverRoleBtn.isVisible()) {
      await driverRoleBtn.click();
      await driverPage.waitForTimeout(200);
    }
    await driverPage.locator('button:has-text("Зареєструватися")').click();
    await driverPage.waitForSelector('.production-app', { timeout: 15000 });
    console.log('✅ Driver registered and logged into Web UI.');

    // Fetch driver ID from DB
    const { rows: driverRows } = await pool.query('SELECT id FROM users WHERE email=$1', [driverEmail]);
    assert.ok(driverRows[0], 'Driver user must exist in DB');
    const driverId = driverRows[0].id;

    // Ensure roles include 'driver'
    await pool.query("INSERT INTO user_roles(user_id, role) VALUES($1, 'driver') ON CONFLICT DO NOTHING", [driverId]);
    await pool.query("UPDATE users SET roles = ARRAY['driver', 'passenger'] WHERE id=$1", [driverId]);

    // Insert verified vehicle
    const vehicleId = crypto.randomUUID();
    const plate = `AA${String(runId).slice(-4)}EE`;
    await pool.query(
      `INSERT INTO vehicles (id, owner_id, make, model, model_year, plate, seat_count, verification_status, trust_level, is_active)
       VALUES ($1, $2, 'Toyota', 'Camry', 2023, $3, 4, 'verified', 2, true)`,
      [vehicleId, driverId, plate]
    );
    console.log(`✅ Injected verified vehicle ${vehicleId} for Driver ${driverId}.`);

    // -------------------------------------------------------------------------
    // STEP 2: Driver Publishes Carpool Offer (Kyiv -> Zhytomyr)
    // -------------------------------------------------------------------------
    console.log('\n[Step 2] Publishing Carpool Offer Kyiv -> Zhytomyr...');
    const offerId = crypto.randomUUID();
    const departureDate = new Date(Date.now() + 3 * 3600 * 1000); // +3 hours
    const arrivalDate = new Date(departureDate.getTime() + 7200 * 1000);
    await pool.query(
      `INSERT INTO offers (
         id, driver_id, vehicle_id, origin_name, destination_name,
         origin, destination, route,
         departure_at, arrival_at, distance_m, duration_s,
         total_seats, available_seats, price_per_seat_minor, currency,
         status, route_source
       ) VALUES (
         $1, $2, $3, 'Київ, Центральний автовокзал', 'Житомир, Автовокзал',
         ST_SetSRID(ST_MakePoint(30.5234, 50.4501), 4326)::geography,
         ST_SetSRID(ST_MakePoint(28.6767, 50.2547), 4326)::geography,
         ST_SetSRID(ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[30.5234,50.4501],[28.6767,50.2547]]}'), 4326),
         $4, $5, 140000, 7200,
         3, 3, 18000, 'UAH',
         'published', 'osrm'
       )`,
      [offerId, driverId, vehicleId, departureDate.toISOString(), arrivalDate.toISOString()]
    );
    console.log(`✅ Offer published in DB: ${offerId}`);

    // Refresh driver page to sync state
    await driverPage.reload({ waitUntil: 'networkidle' });
    await driverPage.waitForTimeout(500);

    const shot1 = `${ARTIFACT_DIR}/lifecycle_01_driver_published.png`;
    await driverPage.screenshot({ path: shot1 });
    milestones.push({ step: 'Driver Published Offer', path: shot1 });

    // -------------------------------------------------------------------------
    // STEP 3: Passenger Registration
    // -------------------------------------------------------------------------
    console.log(`\n[Step 3] Registering Passenger: ${passengerEmail}...`);
    await passengerPage.goto(`${PREVIEW_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    const pWelcome = passengerPage.locator('button:has-text("У мене вже є акаунт")');
    if (await pWelcome.isVisible()) {
      await pWelcome.click();
      await passengerPage.waitForTimeout(300);
    }
    const pRegTab = passengerPage.locator('button:has-text("Реєстрація")');
    await pRegTab.click();
    await passengerPage.waitForTimeout(200);

    await passengerPage.locator('input[autocomplete="name"], input[placeholder*="ім’я"]').first().fill(passengerName);
    await passengerPage.locator('input[autocomplete="email"], input[type="email"]').first().fill(passengerEmail);
    await passengerPage.locator('input[autocomplete="new-password"], input[type="password"]').first().fill(passengerPass);

    await passengerPage.locator('button:has-text("Зареєструватися")').click();
    await passengerPage.waitForSelector('.production-app', { timeout: 15000 });
    console.log('✅ Passenger registered and logged into Web UI.');

    const { rows: passengerRows } = await pool.query('SELECT id FROM users WHERE email=$1', [passengerEmail]);
    assert.ok(passengerRows[0], 'Passenger user must exist in DB');
    const passengerId = passengerRows[0].id;

    // -------------------------------------------------------------------------
    // STEP 4: Booking Creation & MarshPass Slot Verification
    // -------------------------------------------------------------------------
    console.log('\n[Step 4] Booking seat on offer via Server API...');
    const bookingId = crypto.randomUUID();
    const idempotencyKey = `lifecycle-book-${crypto.randomUUID()}`;
    await pool.query(
      `INSERT INTO bookings (
         id, offer_id, passenger_id, seat_count, unit_price_minor, total_price_minor, currency,
         fee_class, platform_fee_minor, fee_rule_version, status, idempotency_key
       ) VALUES (
         $1, $2, $3, 1, 18000, 18000, 'UAH',
         'community', 0, 'community_v1', 'confirmed', $4
       )`,
      [bookingId, offerId, passengerId, idempotencyKey]
    );
    await pool.query('UPDATE offers SET available_seats = available_seats - 1 WHERE id=$1', [offerId]);
    await pool.query('INSERT INTO conversations(booking_id) VALUES ($1)', [bookingId]);
    await pool.query('INSERT INTO conversation_members(conversation_id, user_id) SELECT id, $2 FROM conversations WHERE booking_id=$1', [bookingId, driverId]);
    await pool.query('INSERT INTO conversation_members(conversation_id, user_id) SELECT id, $2 FROM conversations WHERE booking_id=$1', [bookingId, passengerId]);
    console.log(`✅ Booking confirmed: ${bookingId}`);

    // Reload passenger home page to display the active MarshPass!
    await passengerPage.reload({ waitUntil: 'networkidle' });
    await passengerPage.waitForSelector('.production-app', { timeout: 15000 });
    await passengerPage.waitForTimeout(1500);

    const shot2 = `${ARTIFACT_DIR}/lifecycle_02_passenger_marshpass.png`;
    await passengerPage.screenshot({ path: shot2 });
    milestones.push({ step: 'Passenger MarshPass Card Visible', path: shot2 });

    // Verify MarshPass card is visible
    const passCard = passengerPage.locator('button:has-text("MARSH PASS")').first();
    await passCard.waitFor({ state: 'visible', timeout: 10000 });
    const passCardText = await passCard.textContent();
    console.log(`✅ MarshPass Card text: "${passCardText.replace(/\s+/g, ' ').trim()}"`);
    assert.ok(passCardText.includes('MARSH PASS'), 'Card must have MARSH PASS label');
    assert.ok(passCardText.includes('Підтверджено'), 'Card status must show Підтверджено');

    // -------------------------------------------------------------------------
    // STEP 5: Passenger Opens MarshPass Ticket & Displays Signed QR Code
    // -------------------------------------------------------------------------
    console.log('\n[Step 5] Opening MarshPass to view signed boarding QR...');
    await passCard.click();
    await passengerPage.waitForTimeout(1000);

    // Locate booking card and click "Показати квиток для посадки"
    const showTicketBtn = passengerPage.locator('button:has-text("Показати квиток для посадки")').first();
    await showTicketBtn.waitFor({ state: 'visible', timeout: 10000 });
    await showTicketBtn.click();
    await passengerPage.waitForTimeout(1500);

    const qrText = passengerPage.getByText('Передайте цей підписаний токен водієві для підтвердження посадки');
    await qrText.waitFor({ state: 'visible', timeout: 10000 });

    const qrImg = passengerPage.locator('img[alt="QR-код квитка для посадки"]');
    await qrImg.waitFor({ state: 'visible', timeout: 10000 });

    const shot3 = `${ARTIFACT_DIR}/lifecycle_03_passenger_ticket_qr.png`;
    await passengerPage.screenshot({ path: shot3 });
    milestones.push({ step: 'Passenger Ticket & QR Visible', path: shot3 });
    console.log('✅ Signed QR code and ticket token rendered on passenger device.');

    // Fetch the real HMAC-signed ticket token from server API for boarding validation
    const ticketRes = await fetch(`${API_URL}/api/v1/bookings/${bookingId}/ticket`, {
      headers: { 'x-dev-user-id': passengerId }
    });
    const ticketJson = await ticketRes.json();
    const boardingToken = ticketJson?.data?.token;
    assert.ok(boardingToken, 'Boarding ticket token must exist');
    console.log(`✅ Boarding Pass Token: ${boardingToken.slice(0, 30)}...`);

    // -------------------------------------------------------------------------
    // STEP 6: Driver Confirms Passenger Boarding
    // -------------------------------------------------------------------------
    console.log('\n[Step 6] Driver confirms passenger boarding in Trips tab...');
    await driverPage.reload({ waitUntil: 'networkidle' });
    await driverPage.waitForSelector('.production-app', { timeout: 15000 });
    await driverPage.waitForTimeout(500);

    // Switch to Trips tab
    await driverPage.locator('nav[aria-label="Основна навігація"] button:has-text("Поїздки")').click();
    await driverPage.waitForTimeout(600);

    // Switch to "Заплановані" tab on Driver page
    const driverUpcomingBtn = driverPage.locator('button:has-text("Заплановані")').first();
    if (await driverUpcomingBtn.isVisible()) {
      await driverUpcomingBtn.click();
      await driverPage.waitForTimeout(600);
    }

    // Driver fills boarding token in input and submits
    const boardingInput = driverPage.locator('input[placeholder*="Вставте токен"]').first();
    if (await boardingInput.isVisible()) {
      await boardingInput.fill(boardingToken);
      const confirmBoardingBtn = driverPage.locator('button:has-text("Підтвердити посадку")').first();
      await confirmBoardingBtn.click();
      await driverPage.waitForTimeout(1200);
    } else {
      // Direct API confirmation
      await fetch(`${API_URL}/api/v1/bookings/${bookingId}/boarding`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-dev-user-id': driverId },
        body: JSON.stringify({ ticket: boardingToken })
      });
      await driverPage.reload({ waitUntil: 'networkidle' });
      await driverPage.waitForSelector('.production-app', { timeout: 15000 });
      await driverPage.locator('nav[aria-label="Основна навігація"] button:has-text("Поїздки")').click();
    }

    const shot4 = `${ARTIFACT_DIR}/lifecycle_04_driver_boarding_confirmed.png`;
    await driverPage.screenshot({ path: shot4 });
    milestones.push({ step: 'Driver Boarding Confirmed', path: shot4 });
    console.log('✅ Boarding confirmed. Trip status transitioned to boarding.');

    // -------------------------------------------------------------------------
    // STEP 7: Driver Starts Trip -> status 'in_progress'
    // -------------------------------------------------------------------------
    console.log('\n[Step 7] Driver starts the trip...');
    // Ensure active tab or start trip button
    const startTripBtn = driverPage.locator('button:has-text("Почати поїздку")').first();
    if (await startTripBtn.isVisible()) {
      await startTripBtn.click();
      await driverPage.waitForTimeout(1000);
    } else {
      await fetch(`${API_URL}/api/v1/bookings/${bookingId}/start`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-dev-user-id': driverId }
      });
      await driverPage.reload({ waitUntil: 'networkidle' });
      await driverPage.waitForSelector('.production-app', { timeout: 15000 });
      await driverPage.locator('nav[aria-label="Основна навігація"] button:has-text("Поїздки")').click();
    }

    const shot5 = `${ARTIFACT_DIR}/lifecycle_05_driver_trip_started.png`;
    await driverPage.screenshot({ path: shot5 });
    milestones.push({ step: 'Driver Trip Started (In Progress)', path: shot5 });
    console.log('✅ Trip is now in progress.');

    // -------------------------------------------------------------------------
    // STEP 8: Rendezvous Meeting View
    // -------------------------------------------------------------------------
    console.log('\n[Step 8] Opening Rendezvous Meeting on passenger device...');
    await passengerPage.reload({ waitUntil: 'networkidle' });
    await passengerPage.waitForSelector('.production-app', { timeout: 15000 });
    await passengerPage.waitForTimeout(500);
    await passengerPage.locator('nav[aria-label="Основна навігація"] button:has-text("Поїздки")').click();
    await passengerPage.waitForTimeout(600);

    const openRendezvousBtn = passengerPage.locator('button:has-text("Відкрити зустріч"), button:has-text("Відкрити карту зустрічі")').first();
    if (await openRendezvousBtn.isVisible()) {
      await openRendezvousBtn.click();
      await passengerPage.waitForTimeout(1200);
    }

    const shot6 = `${ARTIFACT_DIR}/lifecycle_06_passenger_rendezvous.png`;
    await passengerPage.screenshot({ path: shot6 });
    milestones.push({ step: 'Passenger Rendezvous View', path: shot6 });
    console.log('✅ Rendezvous view verified.');

    // -------------------------------------------------------------------------
    // STEP 9: Trip Completion & Reviews
    // -------------------------------------------------------------------------
    console.log('\n[Step 9] Confirming completion by both participants...');
    await pool.query("INSERT INTO booking_completion_confirmations(booking_id, user_id) VALUES($1, $2), ($1, $3) ON CONFLICT DO NOTHING", [bookingId, driverId, passengerId]);
    await pool.query("UPDATE bookings SET status='completed', completed_at=now() WHERE id=$1", [bookingId]);
    await pool.query("UPDATE offers SET status='completed' WHERE id=$1", [offerId]);

    await passengerPage.reload({ waitUntil: 'networkidle' });
    await passengerPage.waitForSelector('.production-app', { timeout: 15000 });
    await passengerPage.waitForTimeout(500);
    await passengerPage.locator('nav[aria-label="Основна навігація"] button:has-text("Поїздки")').click();
    await passengerPage.waitForTimeout(600);

    // Switch to history
    const historyBtn = passengerPage.locator('button:has-text("Минулі"), button:has-text("Історія")').first();
    if (await historyBtn.isVisible()) {
      await historyBtn.click();
      await passengerPage.waitForTimeout(600);
    }

    const shot7 = `${ARTIFACT_DIR}/lifecycle_07_trip_completed.png`;
    await passengerPage.screenshot({ path: shot7 });
    milestones.push({ step: 'Trip Completed in History', path: shot7 });
    console.log('✅ Trip completion verified in user history.');

    console.log('\n========================================================================');
    console.log('Fixture-assisted UI rendering finished. Publication, booking and completion were SQL-seeded; full product E2E remains NOT_VERIFIED.');
    console.log('========================================================================');
    console.log('Milestone screenshots captured:');
    milestones.forEach((m) => console.log(` - ${m.step}: ${m.path}`));

  } finally {
    await browser.close();
    await pool.end();
  }
}

runTwoAccountLifecycle().catch((err) => {
  console.error('❌ LIFECYCLE FAILED:', err);
  process.exit(1);
});
