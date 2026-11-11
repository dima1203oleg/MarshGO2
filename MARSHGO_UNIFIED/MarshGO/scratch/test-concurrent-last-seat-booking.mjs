import assert from 'node:assert/strict';

const API = 'http://127.0.0.1:3002';

async function registerUser(email, password, displayName, role = 'passenger') {
  const res = await fetch(`${API}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password, displayName, role }),
  });
  const data = await res.json();
  if (!res.ok) {
    // If user already exists, login
    const loginRes = await fetch(`${API}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(`Auth failed: ${JSON.stringify(loginData)}`);
    return { token: loginData.data.accessToken || loginData.data.token, user: loginData.data.user };
  }
  return { token: data.data.accessToken || data.data.token, user: data.data.user };
}

async function run() {
  console.log('--- STARTING CONCURRENT LAST-SEAT BOOKING TEST ---');

  const stamp = Date.now();
  const driver = await registerUser(`driver_lastseat_${stamp}@marshgo.test`, 'DriverSecurePass123!', 'Oleksiy Driver', 'driver');
  const passengerA = await registerUser(`pass_a_${stamp}@marshgo.test`, 'PassASecure123!', 'Passenger Alpha', 'passenger');
  const passengerB = await registerUser(`pass_b_${stamp}@marshgo.test`, 'PassBSecure123!', 'Passenger Beta', 'passenger');

  // Register vehicle for driver
  const plateLetters = ['AA', 'AB', 'AC', 'AE', 'AH', 'BC'];
  const prefix = plateLetters[Math.floor(Math.random() * plateLetters.length)];
  const randomPlate = `${prefix}${Math.floor(1000 + Math.random() * 9000)}AX`;

  const vehicleRes = await fetch(`${API}/api/v1/vehicles`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${driver.token}`,
    },
    body: JSON.stringify({
      make: 'Toyota',
      model: 'Corolla',
      modelYear: 2022,
      seats: 4,
      plate: randomPlate,
    }),
  });
  const vehicleData = await vehicleRes.json();
  assert.equal(vehicleRes.status, 201, `Vehicle creation failed: ${JSON.stringify(vehicleData)}`);
  const vehicleId = vehicleData.data.id;

  // Upload vehicle photo (PNG 1x1 valid signature)
  const png1x1 = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082', 'hex');
  const uploadRes = await fetch(`${API}/api/v1/vehicles/${vehicleId}/photos/file`, {
    method: 'POST',
    headers: {
      'content-type': 'image/png',
      authorization: `Bearer ${driver.token}`,
    },
    body: png1x1,
  });
  assert.equal(uploadRes.status, 201, 'Vehicle photo upload failed');

  // Publish carpool offer with EXACTLY 1 SEAT available
  const departure = new Date(Date.now() + 4 * 3600 * 1000).toISOString();
  const arrival = new Date(Date.now() + 6 * 3600 * 1000).toISOString();

  const offerRes = await fetch(`${API}/api/v1/offers`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${driver.token}`,
    },
    body: JSON.stringify({
      origin: [24.0311, 49.8429],
      destination: [24.7111, 48.9226],
      originName: 'Львів, Головний вокзал',
      destinationName: 'Івано-Франківськ, Центр',
      departureAt: departure,
      seats: 1,
      pricePerSeatMinor: 25000,
      currency: 'UAH',
      vehicleId,
    }),
  });
  const offerData = await offerRes.json();
  assert.equal(offerRes.status, 201, `Offer publishing failed: ${JSON.stringify(offerData)}`);
  const offerId = offerData.data.id;
  assert.equal(offerData.data.available_seats, 1, 'Offer must have 1 available seat initially');

  console.log(`[PASS] Offer created with ID ${offerId}, availableSeats: 1`);

  // CONCURRENT TEST: Passenger A and Passenger B attempt to book the last seat simultaneously
  console.log('[TEST] Firing synchronized concurrent booking requests for the last remaining seat...');

  const keyA = `idemp-pass-a-${crypto.randomUUID()}`;
  const keyB = `idemp-pass-b-${crypto.randomUUID()}`;

  const reqA = fetch(`${API}/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${passengerA.token}`,
      'idempotency-key': keyA,
    },
    body: JSON.stringify({ offerId, seats: 1 }),
  });

  const reqB = fetch(`${API}/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${passengerB.token}`,
      'idempotency-key': keyB,
    },
    body: JSON.stringify({ offerId, seats: 1 }),
  });

  const [resA, resB] = await Promise.all([reqA, reqB]);
  const [dataA, dataB] = await Promise.all([resA.json(), resB.json()]);

  console.log(`Passenger A status: ${resA.status}, Passenger B status: ${resB.status}`);

  // Assert mutually exclusive outcome: exactly one 201, exactly one 409
  const statuses = [resA.status, resB.status];
  assert.ok(statuses.includes(201), 'One competing booking must succeed with HTTP 201');
  assert.ok(statuses.includes(409), 'One competing booking must fail with HTTP 409 (not enough available seats)');

  const winner = resA.status === 201 ? { user: 'A', data: dataA, token: passengerA.token, key: keyA } : { user: 'B', data: dataB, token: passengerB.token, key: keyB };
  const loser = resA.status === 409 ? { user: 'A', data: dataA } : { user: 'B', data: dataB };

  console.log(`[PASS] Concurrent seat race winner: Passenger ${winner.user}`);
  console.log(`[PASS] Concurrent seat race rejected: Passenger ${loser.user} with error: ${loser.data.error?.message || loser.data.message}`);

  // Verify offer inventory state: available seats must be exactly 0
  const checkMineRes = await fetch(`${API}/api/v1/offers/mine`, {
    headers: { authorization: `Bearer ${driver.token}` },
  });
  const checkMineData = await checkMineRes.json();
  const driverOffer = checkMineData.data.find(o => o.id === offerId);
  assert.ok(driverOffer, 'Driver offer must be listed in offers/mine');
  assert.equal(driverOffer.available_seats, 0, 'Available seats must be exactly 0 after last seat is booked');

  // Verify public endpoint hides 0-seat offer
  const checkPublicRes = await fetch(`${API}/api/v1/offers/${offerId}`);
  assert.equal(checkPublicRes.status, 404, 'Public search must return 404 when 0 seats remain');
  console.log('[PASS] Seat inventory verified: exactly 0 remaining seats (no negative numbers or double-booking)');

  // Test idempotency replay from winner
  console.log('[TEST] Testing idempotency replay from winner...');
  const replayRes = await fetch(`${API}/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${winner.token}`,
      'idempotency-key': winner.key,
    },
    body: JSON.stringify({ offerId, seats: 1 }),
  });
  const replayData = await replayRes.json();
  assert.equal(replayRes.status, 200, 'Replay with same Idempotency-Key must return HTTP 200');
  assert.equal(replayData.replayed, true, 'Replay response must have replayed: true');
  assert.equal(replayData.data.id, winner.data.data.id, 'Replay must return identical booking ID');
  console.log('[PASS] Idempotency replay succeeds with HTTP 200 replayed: true');

  // Test cancellation of the booking by winner
  console.log('[TEST] Testing cancellation by booking owner...');
  const cancelRes = await fetch(`${API}/api/v1/bookings/${winner.data.data.id}/cancel`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${winner.token}`,
    },
    body: JSON.stringify({ reason: 'Plans changed' }),
  });
  assert.equal(cancelRes.status, 200, 'Cancellation must return HTTP 200');

  // Verify seat inventory restored to 1
  const checkMineAfterCancel = await fetch(`${API}/api/v1/offers/mine`, {
    headers: { authorization: `Bearer ${driver.token}` },
  });
  const checkMineAfterCancelData = await checkMineAfterCancel.json();
  const restoredOffer = checkMineAfterCancelData.data.find(o => o.id === offerId);
  assert.equal(restoredOffer.available_seats, 1, 'Available seats must be restored to 1 upon cancellation');

  const checkPublicAfterCancel = await fetch(`${API}/api/v1/offers/${offerId}`);
  assert.equal(checkPublicAfterCancel.status, 200, 'Public search must return 200 once seat is restored');
  console.log('[PASS] Seat inventory restored to 1 upon cancellation');

  // Now the loser can successfully book the released seat
  console.log('[TEST] Passenger who lost now books the freed seat...');
  const retryKey = `idemp-retry-${crypto.randomUUID()}`;
  const retryRes = await fetch(`${API}/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${loser.user === 'A' ? passengerA.token : passengerB.token}`,
      'idempotency-key': retryKey,
    },
    body: JSON.stringify({ offerId, seats: 1 }),
  });
  const retryData = await retryRes.json();
  assert.equal(retryRes.status, 201, 'Booking freed seat must return HTTP 201');
  console.log('[PASS] Previously rejected passenger successfully booked freed seat');

  console.log('--- ALL CONCURRENT BOOKING & INVENTORY INTEGRITY TESTS PASSED (100%) ---');
}

run().catch((err) => {
  console.error('[FAIL]', err);
  process.exit(1);
});
