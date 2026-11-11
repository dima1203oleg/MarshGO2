import fs from 'node:fs';
import path from 'node:path';

const API_BASE = 'http://127.0.0.1:3002/api/v1';

async function main() {
  console.log('=== Step 1: Sign in as driver ===');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'driver@marshgo.ua', password: 'DriverPass123!' }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
  const loginData = await loginRes.json();
  const token = loginData.data.accessToken;
  console.log('Driver signed in. User ID:', loginData.data.user.id);

  console.log('\n=== Step 2: Create a vehicle ===');
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const plate = `BC ${randNum} AA`;
  const vehicleRes = await fetch(`${API_BASE}/vehicles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      make: 'Skoda',
      model: 'Octavia',
      modelYear: 2021,
      seats: 4,
      plate,
    }),
  });
  if (!vehicleRes.ok) throw new Error(`Create vehicle failed: ${vehicleRes.status} ${await vehicleRes.text()}`);
  const vehicle = (await vehicleRes.json()).data;
  console.log('Vehicle created:', vehicle.id, `${vehicle.make} ${vehicle.model} (${vehicle.plate}), initial trust_level:`, vehicle.trust_level);

  console.log('\n=== Step 3: Upload vehicle photo via POST /vehicles/:id/photos/file ===');
  // Use a real valid JPEG image buffer (1x1 pixel JPEG)
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

  const uploadRes = await fetch(`${API_BASE}/vehicles/${vehicle.id}/photos/file`, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
      'Authorization': `Bearer ${token}`,
    },
    body: jpegBytes,
  });
  if (!uploadRes.ok) throw new Error(`Upload photo failed: ${uploadRes.status} ${await uploadRes.text()}`);
  const uploadData = await uploadRes.json();
  console.log('Upload response:', uploadData);
  console.log('Vehicle auto-promoted trust_level:', uploadData.data.trust_level);
  if (uploadData.data.trust_level !== 1) throw new Error('Expected trust_level to be 1 after valid photo upload');

  console.log('\n=== Step 4: Verify photo URL and media stream ===');
  const photoUrl = uploadData.data.url;
  console.log('Photo stream URL:', photoUrl);
  const mediaRes = await fetch(`http://127.0.0.1:3002${photoUrl}`);
  if (!mediaRes.ok) throw new Error(`Media fetch failed: ${mediaRes.status}`);
  const mediaContentType = mediaRes.headers.get('content-type');
  console.log('Media content-type:', mediaContentType);
  if (mediaContentType !== 'image/jpeg') throw new Error(`Expected image/jpeg, got ${mediaContentType}`);
  const downloadedBytes = await mediaRes.arrayBuffer();
  console.log('Media downloaded successfully! Bytes:', downloadedBytes.byteLength);

  console.log('\n=== Step 5: Driver publishes carpool trip using this verified vehicle ===');
  const departure = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
  const tripRes = await fetch(`${API_BASE}/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      vehicleId: vehicle.id,
      originName: 'Львів, пл. Ринок',
      destinationName: 'Київ, Хрещатик',
      origin: [24.0297, 49.8397],
      destination: [30.5234, 50.4501],
      departureAt: departure,
      seats: 3,
      pricePerSeatMinor: 35000,
    }),
  });
  if (!tripRes.ok) throw new Error(`Publish trip failed: ${tripRes.status} ${await tripRes.text()}`);
  const offer = (await tripRes.json()).data;
  console.log('Offer published successfully! Offer ID:', offer.id, 'Status:', offer.status);

  console.log('\n✅ 100% PASS: Vehicle photo uploaded via standard API, vehicle promoted, offer published cleanly without SQL photo insertion!');
}

main().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
