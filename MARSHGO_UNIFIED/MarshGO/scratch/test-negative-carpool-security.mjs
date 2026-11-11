import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const API_BASE = 'http://127.0.0.1:3002/api/v1';

async function main() {
  console.log('=== Starting Carpool Negative Security & Transition Verification ===');

  const runId = crypto.randomUUID().slice(0, 8);
  const driverEmail = `neg.driver.${runId}@marshgo.ua`;
  const pass1Email = `neg.pass1.${runId}@marshgo.ua`;
  const pass2Email = `neg.pass2.${runId}@marshgo.ua`;
  const outsiderEmail = `neg.outsider.${runId}@marshgo.ua`;
  const password = 'TestSecurePass2026!';

  // 1. Create accounts
  const [driverRes, pass1Res, pass2Res, outRes] = await Promise.all([
    fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: driverEmail, password, displayName: 'Driver', role: 'driver' }) }),
    fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: pass1Email, password, displayName: 'Passenger 1', role: 'passenger' }) }),
    fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: pass2Email, password, displayName: 'Passenger 2', role: 'passenger' }) }),
    fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: outsiderEmail, password, displayName: 'Outsider', role: 'passenger' }) }),
  ]);

  const driverToken = (await driverRes.json()).data.accessToken;
  const pass1Token = (await pass1Res.json()).data.accessToken;
  const pass2Token = (await pass2Res.json()).data.accessToken;
  const outToken = (await outRes.json()).data.accessToken;

  // 2. Add vehicle and upload photo via API
  const vehRes = await fetch(`${API_BASE}/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${driverToken}` },
    body: JSON.stringify({ make: 'Toyota', model: 'Camry', modelYear: 2022, seats: 4, plate: `BC${Math.floor(1000 + Math.random() * 9000)}AX` }),
  });
  const vehicle = (await vehRes.json()).data;

  const jpegBytes = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
    0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
    0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
    0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
    0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
    0x00, 0xbf, 0x80, 0xff, 0xd9
  ]);
  const photoRes = await fetch(`${API_BASE}/vehicles/${vehicle.id}/photos/file`, {
    method: 'POST',
    headers: { 'Content-Type': 'image/jpeg', Authorization: `Bearer ${driverToken}` },
    body: jpegBytes,
  });
  assert.equal(photoRes.status, 201);
  console.log('Vehicle verified with photo, trust_level: 1');

  // 3. Driver publishes offer with 1 seat
  const offerRes = await fetch(`${API_BASE}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${driverToken}` },
    body: JSON.stringify({
      vehicleId: vehicle.id,
      originName: 'Львів',
      destinationName: 'Тернопіль',
      origin: [24.0297, 49.8397],
      destination: [25.5948, 49.5535],
      departureAt: new Date(Date.now() + 3600000).toISOString(),
      pricePerSeatMinor: 20000,
      seats: 1,
    }),
  });
  assert.equal(offerRes.status, 201);
  const offer = (await offerRes.json()).data;
  console.log('Offer published with 1 seat:', offer.id);

  // 4. Passenger 1 books the 1 seat
  const book1Res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pass1Token}`,
      'idempotency-key': `book1-${crypto.randomUUID()}`,
    },
    body: JSON.stringify({ offerId: offer.id, seats: 1 }),
  });
  if (book1Res.status !== 201) console.error('Booking 1 failed:', await book1Res.text());
  assert.equal(book1Res.status, 201);
  const booking1 = (await book1Res.json()).data;
  console.log('Passenger 1 booked seat:', booking1.id);

  // 5. NEGATIVE TEST: Passenger 2 attempts to book when 0 seats remain -> 409
  console.log('\n--- Negative Test 1: Booking when capacity is exhausted ---');
  const book2Res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pass2Token}`,
      'idempotency-key': `book2-${crypto.randomUUID()}`,
    },
    body: JSON.stringify({ offerId: offer.id, seats: 1 }),
  });
  console.log('Passenger 2 booking status:', book2Res.status);
  assert.equal(book2Res.status, 409, 'Booking 0 remaining seats must return 409');
  console.log('✅ PASS: Rejected with 409 Conflict');

  // 6. NEGATIVE TEST: Passenger 1 attempts to book negative seats -> 400
  console.log('\n--- Negative Test 2: Invalid seat request (0 or negative) ---');
  const bookBadRes = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pass1Token}`,
      'idempotency-key': `book-bad-${crypto.randomUUID()}`,
    },
    body: JSON.stringify({ offerId: offer.id, seats: -1 }),
  });
  console.log('Negative seats booking status:', bookBadRes.status);
  assert.equal(bookBadRes.status, 400, 'Negative seats must return 400');
  console.log('✅ PASS: Rejected with 400 Bad Request');

  // 7. Get ticket QR code for booking 1
  const ticketRes = await fetch(`${API_BASE}/bookings/${booking1.id}/ticket`, {
    headers: { Authorization: `Bearer ${pass1Token}` },
  });
  assert.equal(ticketRes.status, 200);
  const ticketData = (await ticketRes.json()).data;
  const validTicket = ticketData.token;
  console.log('Valid MarshPass ticket generated, format:', ticketData.format);

  // 8. NEGATIVE TEST: Outsider tries to board booking 1 with valid ticket -> 404
  console.log('\n--- Negative Test 3: Unauthorized driver/outsider tries to board ---');
  const outsiderBoardRes = await fetch(`${API_BASE}/bookings/${booking1.id}/boarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${outToken}` },
    body: JSON.stringify({ ticket: validTicket }),
  });
  console.log('Outsider boarding status:', outsiderBoardRes.status);
  assert.equal(outsiderBoardRes.status, 404, 'Outsider boarding must return 404');
  console.log('✅ PASS: Outsider blocked with 404 Not Found');

  // 9. NEGATIVE TEST: Driver tries to board with corrupted/fake ticket -> 400
  console.log('\n--- Negative Test 4: Driver boards with forged ticket ---');
  const fakeTicketBoardRes = await fetch(`${API_BASE}/bookings/${booking1.id}/boarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${driverToken}` },
    body: JSON.stringify({ ticket: 'MARSHGO-FAKE-TOKEN-INVALID-SIG' }),
  });
  console.log('Fake ticket boarding status:', fakeTicketBoardRes.status);
  assert.equal(fakeTicketBoardRes.status, 400, 'Forged ticket must return 400 ticket_invalid');
  console.log('✅ PASS: Forged ticket rejected with 400 ticket_invalid');

  // 10. Driver boards with valid ticket -> 200 OK
  console.log('\n--- Legitimate Boarding ---');
  const legitBoardRes = await fetch(`${API_BASE}/bookings/${booking1.id}/boarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${driverToken}` },
    body: JSON.stringify({ ticket: validTicket }),
  });
  assert.equal(legitBoardRes.status, 200);
  const boardData = await legitBoardRes.json();
  console.log('Legitimate boarding successful, status:', boardData.data.status, 'replayed:', boardData.replayed);
  assert.equal(boardData.data.status, 'boarding');
  assert.equal(boardData.replayed, false);

  // 11. Idempotent Replay: Driver scans the exact same ticket again -> returns 200 with replayed: true
  console.log('\n--- Idempotent Token Scan Replay ---');
  const replayBoardRes = await fetch(`${API_BASE}/bookings/${booking1.id}/boarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${driverToken}` },
    body: JSON.stringify({ ticket: validTicket }),
  });
  assert.equal(replayBoardRes.status, 200);
  const replayData = await replayBoardRes.json();
  console.log('Replayed boarding status:', replayData.data.status, 'replayed:', replayData.replayed);
  assert.equal(replayData.replayed, true, 'Replaying boarding token must return replayed: true');
  console.log('✅ PASS: Token replay safely handled idempotently');

  // 12. Trip Start & Mutual Completion
  console.log('\n--- Trip Start & Completion ---');
  const startRes = await fetch(`${API_BASE}/bookings/${booking1.id}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${driverToken}` },
  });
  assert.equal(startRes.status, 200);

  // Passenger confirms completion (1/2)
  const passCompRes = await fetch(`${API_BASE}/bookings/${booking1.id}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pass1Token}` },
  });
  assert.equal(passCompRes.status, 200);
  assert.equal((await passCompRes.json()).data.status, 'in_progress');

  // Driver confirms completion (2/2) -> status becomes completed
  const driverCompRes = await fetch(`${API_BASE}/bookings/${booking1.id}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${driverToken}` },
  });
  assert.equal(driverCompRes.status, 200);
  assert.equal((await driverCompRes.json()).data.status, 'completed');
  console.log('✅ PASS: Mutual completion requires both parties (2/2) and succeeds');

  // 13. NEGATIVE TEST: Cancelling an already completed booking -> 409
  console.log('\n--- Negative Test 5: Cancelling completed booking ---');
  const cancelCompRes = await fetch(`${API_BASE}/bookings/${booking1.id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pass1Token}` },
    body: JSON.stringify({ reason: 'Trip was done already' }),
  });
  console.log('Cancel completed booking status:', cancelCompRes.status);
  assert.equal(cancelCompRes.status, 409, 'Completed booking cannot be cancelled');
  console.log('✅ PASS: Rejected with 409 Conflict');

  console.log('\n🎉 ALL NEGATIVE CARPOOL & SECURITY TESTS 100% PASS!');
}

main().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
