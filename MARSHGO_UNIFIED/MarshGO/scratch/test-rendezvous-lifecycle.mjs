import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import pg from 'pg';

const API_URL = process.env.API_URL || 'http://127.0.0.1:3002';
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://marshgo:local_only_change_me@127.0.0.1:5434/marshgo';

const pool = new pg.Pool({ connectionString: DATABASE_URL });

async function run() {
  console.log(`Starting Two-Account Carpool & Rendezvous Verification against ${API_URL}...`);

  const runId = crypto.randomUUID().slice(0, 8);
  const driverEmail = `driver.${runId}@marshgo.ua`;
  const passengerEmail = `passenger.${runId}@marshgo.ua`;
  const password = 'SecurePassword2026!';

  // 1. Register Driver
  console.log('1. Registering Driver...');
  const regDriverRes = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: driverEmail,
      password,
      displayName: `Водій Тестовий ${runId}`,
      role: 'driver'
    }),
  });
  if (regDriverRes.status !== 201) {
    throw new Error(`Failed to register driver (${regDriverRes.status}): ${await regDriverRes.text()}`);
  }
  const driverData = (await regDriverRes.json()).data;
  const driverToken = driverData.accessToken;
  const driverId = driverData.user.id;
  console.log(` Driver registered: ID=${driverId}`);

  // 2. Register Passenger
  console.log('2. Registering Passenger...');
  const regPassRes = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: passengerEmail,
      password,
      displayName: `Пасажир Тестовий ${runId}`,
      role: 'passenger'
    }),
  });
  if (regPassRes.status !== 201) {
    throw new Error(`Failed to register passenger (${regPassRes.status}): ${await regPassRes.text()}`);
  }
  const passData = (await regPassRes.json()).data;
  const passengerToken = passData.accessToken;
  const passengerId = passData.user.id;
  console.log(` Passenger registered: ID=${passengerId}`);

  // 3. Driver creates vehicle
  console.log('3. Registering vehicle for Driver...');
  const plate = `AA${Math.floor(1000 + Math.random() * 9000)}TT`;
  const vehRes = await fetch(`${API_URL}/api/v1/vehicles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${driverToken}`
    },
    body: JSON.stringify({
      make: 'Skoda',
      model: 'Octavia',
      modelYear: 2021,
      seats: 4,
      plate
    })
  });
  if (vehRes.status !== 201) {
    throw new Error(`Failed to create vehicle (${vehRes.status}): ${await vehRes.text()}`);
  }
  const vehicle = (await vehRes.json()).data;
  console.log(` Vehicle created: ID=${vehicle.id}, Plate=${plate}`);

  // Ensure vehicle is verified with photo in DB for trust_level=1
  await pool.query(
    `INSERT INTO vehicle_photos (vehicle_id, object_key, is_primary, sort_order)
     VALUES ($1, $2, true, 0)`,
    [vehicle.id, `vehicle-photos/${driverId}/${vehicle.id}/${crypto.randomUUID()}`]
  );
  await pool.query(
    `UPDATE vehicles SET trust_level=1, is_active=true WHERE id=$1`,
    [vehicle.id]
  );
  console.log(' Vehicle trust_level upgraded to 1 with verified photo.');

  // 4. Driver creates offer
  console.log('4. Driver publishing carpool offer...');
  const departureAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes from now (within 15m rendezvous window)
  const offerRes = await fetch(`${API_URL}/api/v1/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${driverToken}`
    },
    body: JSON.stringify({
      vehicleId: vehicle.id,
      originName: 'Київ, Метро Житомирська',
      destinationName: 'Житомир, Автовокзал',
      origin: [30.3649, 50.4560],
      destination: [28.6700, 50.2547],
      departureAt,
      pricePerSeatMinor: 25000,
      seats: 3
    })
  });
  if (offerRes.status !== 201) {
    throw new Error(`Failed to create offer (${offerRes.status}): ${await offerRes.text()}`);
  }
  const offer = (await offerRes.json()).data;
  console.log(` Offer published: ID=${offer.id}, Total Seats=${offer.total_seats}, Available=${offer.available_seats}`);
  assert.equal(offer.available_seats, 3);

  // 5. Passenger searches and discovers offer
  console.log('5. Passenger discovering offer via /api/v1/offers...');
  const searchUrl = `${API_URL}/api/v1/offers?origin=${encodeURIComponent('Київ')}&destination=${encodeURIComponent('Житомир')}&originLon=30.3649&originLat=50.4560&destinationLon=28.6700&destinationLat=50.2547&seats=1`;
  const searchRes = await fetch(searchUrl, {
    headers: { 'Authorization': `Bearer ${passengerToken}` }
  });
  if (searchRes.status !== 200) {
    throw new Error(`Search failed (${searchRes.status}): ${await searchRes.text()}`);
  }
  const searchResults = (await searchRes.json()).data;
  const foundOffer = searchResults.find(o => o.id === offer.id);
  assert.ok(foundOffer, `Expected offer ${offer.id} in search results (got ${searchResults.length} offers)`);
  console.log(` Found offer in search: ${foundOffer.origin_name} -> ${foundOffer.destination_name}`);

  // 6. Passenger books 1 seat
  console.log('6. Passenger booking 1 seat...');
  const bookRes = await fetch(`${API_URL}/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${passengerToken}`,
      'idempotency-key': `book-${crypto.randomUUID()}`
    },
    body: JSON.stringify({
      offerId: offer.id,
      seats: 1
    })
  });
  if (bookRes.status !== 201) {
    throw new Error(`Booking failed (${bookRes.status}): ${await bookRes.text()}`);
  }
  const booking = (await bookRes.json()).data;
  console.log(` Booking confirmed: ID=${booking.id}, Status=${booking.status}`);
  assert.equal(booking.status, 'confirmed');

  // 7. Verify atomic decrement of seats
  console.log('7. Verifying seat inventory decrement...');
  const offerCheckRes = await fetch(`${API_URL}/api/v1/offers/${offer.id}`);
  assert.equal(offerCheckRes.status, 200);
  const updatedOffer = (await offerCheckRes.json()).data;
  console.log(` Available seats after booking: ${updatedOffer.available_seats} (was 3)`);
  assert.equal(updatedOffer.available_seats, 2, 'Available seats must decrement from 3 to 2');

  // 8. Rendezvous Session Inspection
  console.log('8. Fetching Rendezvous Session for booking...');
  const rzRes = await fetch(`${API_URL}/api/v1/bookings/${booking.id}/rendezvous`, {
    headers: { 'Authorization': `Bearer ${passengerToken}` }
  });
  if (rzRes.status !== 200) throw new Error(`Fetch rendezvous failed: ${await rzRes.text()}`);
  const rzSession = (await rzRes.json()).data;
  console.log(` Rendezvous Session ID=${rzSession.id}, State=${rzSession.state}`);

  // Activate rendezvous explicitly
  const activateRes = await fetch(`${API_URL}/api/v1/bookings/${booking.id}/rendezvous/activate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${driverToken}` }
  });
  if (activateRes.status !== 200) throw new Error(`Activate rendezvous failed: ${await activateRes.text()}`);
  console.log(' Rendezvous activated successfully.');

  // 9. Dual-Consent Verification
  console.log('9. Verifying Dual-Consent location tracking rules...');
  // Check location transmission before consent -> must be forbidden
  const preConsentLocRes = await fetch(`${API_URL}/api/v1/rendezvous/${rzSession.id}/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${passengerToken}`
    },
    body: JSON.stringify({
      latitude: 50.4561,
      longitude: 30.3650,
      accuracyMeters: 10,
      recordedAt: new Date().toISOString()
    })
  });
  assert.equal(preConsentLocRes.status, 403, 'Location transmission must fail before mutual consent');
  console.log(' Pre-consent transmission rejected (403 Forbidden) as required.');

  // Passenger gives consent
  const passConsentRes = await fetch(`${API_URL}/api/v1/rendezvous/${rzSession.id}/consent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${passengerToken}`
    },
    body: JSON.stringify({ enabled: true })
  });
  if (passConsentRes.status !== 200) throw new Error(`Passenger consent failed: ${await passConsentRes.text()}`);
  const passConsentData = (await passConsentRes.json()).data;
  assert.equal(passConsentData.currentParticipantConsent, true);
  assert.equal(passConsentData.locationSharingEnabled, false, 'Location sharing must remain false until DRIVER also consents');
  console.log(' Passenger consent registered. locationSharingEnabled = false (waiting for driver).');

  // Driver gives consent
  const driverConsentRes = await fetch(`${API_URL}/api/v1/rendezvous/${rzSession.id}/consent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${driverToken}`
    },
    body: JSON.stringify({ enabled: true })
  });
  if (driverConsentRes.status !== 200) throw new Error(`Driver consent failed: ${await driverConsentRes.text()}`);
  const driverConsentData = (await driverConsentRes.json()).data;
  assert.equal(driverConsentData.currentParticipantConsent, true);
  assert.equal(driverConsentData.locationSharingEnabled, true, 'Location sharing must be true when BOTH consent');
  console.log(' Driver consent registered. locationSharingEnabled = true (DUAL CONSENT ACTIVE!).');

  // Now location transmission succeeds for driver
  const driverLocRes = await fetch(`${API_URL}/api/v1/rendezvous/${rzSession.id}/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${driverToken}`
    },
    body: JSON.stringify({
      latitude: 50.4562,
      longitude: 30.3651,
      accuracyMeters: 8,
      recordedAt: new Date().toISOString()
    })
  });
  if (driverLocRes.status !== 200) throw new Error(`Driver location update failed: ${await driverLocRes.text()}`);
  console.log(' Driver location transmission verified under active mutual consent.');

  // Passenger checks rendezvous view and sees driver location
  const passViewRes = await fetch(`${API_URL}/api/v1/bookings/${booking.id}/rendezvous`, {
    headers: { 'Authorization': `Bearer ${passengerToken}` }
  });
  const passView = (await passViewRes.json()).data;
  assert.equal(passView.locationSharingEnabled, true);
  assert.ok(passView.locations.driver, 'Passenger must see driver location under locations.driver');
  console.log(` Passenger sees driver location: lon=${passView.locations.driver.coordinates[0]}, lat=${passView.locations.driver.coordinates[1]}, freshness=${passView.locations.driver.freshness}`);

  // 10. Cancellation and Capacity Restoration
  console.log('10. Testing Passenger Booking Cancellation...');
  const cancelRes = await fetch(`${API_URL}/api/v1/bookings/${booking.id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${passengerToken}`
    },
    body: JSON.stringify({ reason: 'Plans changed' })
  });
  if (cancelRes.status !== 200) throw new Error(`Cancel booking failed: ${await cancelRes.text()}`);
  console.log(' Booking cancelled successfully.');

  // Verify seat capacity restored
  const offerRestoredRes = await fetch(`${API_URL}/api/v1/offers/${offer.id}`);
  assert.equal(offerRestoredRes.status, 200);
  const restoredOffer = (await offerRestoredRes.json()).data;
  console.log(` Available seats after cancellation: ${restoredOffer.available_seats} (restored to 3!)`);
  assert.equal(restoredOffer.available_seats, 3, 'Seat inventory must be restored to 3 after cancellation');

  // Cleanup
  await pool.query('DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE booking_id=$1)', [booking.id]);
  await pool.query('DELETE FROM conversations WHERE booking_id=$1', [booking.id]);
  await pool.query('DELETE FROM rendezvous_events WHERE rendezvous_id=$1', [rzSession.id]);
  await pool.query('DELETE FROM rendezvous_sessions WHERE id=$1', [rzSession.id]);
  await pool.query('DELETE FROM bookings WHERE id=$1', [booking.id]);
  await pool.query('DELETE FROM offers WHERE id=$1', [offer.id]);
  await pool.query('DELETE FROM vehicle_photos WHERE vehicle_id=$1', [vehicle.id]);
  await pool.query('DELETE FROM vehicles WHERE id=$1', [vehicle.id]);
  await pool.query('DELETE FROM user_roles WHERE user_id IN ($1, $2)', [driverId, passengerId]);
  await pool.query('DELETE FROM sessions WHERE user_id IN ($1, $2)', [driverId, passengerId]);
  await pool.query('DELETE FROM audit_events WHERE actor_id IN ($1, $2)', [driverId, passengerId]);
  await pool.query('DELETE FROM users WHERE id IN ($1, $2)', [driverId, passengerId]);

  console.log('\n ALL TWO-ACCOUNT CARPOOL & RENDEZVOUS CHECKS PASSED PERFECTLY!');
  await pool.end();
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  pool.end();
  process.exit(1);
});
