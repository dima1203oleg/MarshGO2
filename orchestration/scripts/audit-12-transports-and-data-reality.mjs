import fetch from 'node-fetch';

const base = 'http://127.0.0.1:3019/api/v1';

async function getToken() {
  const email = `audit_${Date.now()}@marshgo.local`;
  const password = 'Password2026!';
  const res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName: 'Audit Bot' }),
  });
  const data = await res.json();
  return data.data?.accessToken;
}

async function search(token, origin, destination, departureAt, preferences = {}) {
  const res = await fetch(`${base}/journeys/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      origin,
      destination,
      departureAt,
      passengers: 1,
      strategy: 'BALANCED',
      preferences,
    }),
  });
  return await res.json();
}

async function main() {
  console.log('🔍 Starting Forensic Audit of 12 Transport Modes & Data Reality...');
  const token = await getToken();
  if (!token) {
    console.error('Failed to obtain token');
    process.exit(1);
  }
  console.log('✅ Authenticated successfully.');

  const testCases = [
    {
      name: '1. Kyiv -> Lviv (Intercity Corridor)',
      origin: { name: 'Київ, Хрещатик', coordinates: [30.5234, 50.447] },
      destination: { name: 'Львів, пл. Ринок', coordinates: [24.0316, 49.8419] },
      departureAt: '2026-11-06T08:00:00.000Z',
    },
    {
      name: '2. Lviv Intra-city (Local Transit & GTFS)',
      origin: { name: 'Львів, Сихів', coordinates: [24.056, 49.7942] },
      destination: { name: 'Львів, Головний вокзал', coordinates: [23.995, 49.8358] },
      departureAt: '2026-11-06T09:00:00.000Z',
    },
    {
      name: '3. Kyiv Intra-city (Rapid Metro)',
      origin: { name: 'Київ, ст. Лісова', coordinates: [30.645, 50.465] },
      destination: { name: 'Київ, ст. Вокзальна', coordinates: [30.4884, 50.4418] },
      departureAt: '2026-11-06T08:30:00.000Z',
    },
    {
      name: '4. Dnipro -> Zaporizhzhia (Regional Express)',
      origin: { name: 'Дніпро, Вокзал', coordinates: [35.0165, 48.476] },
      destination: { name: 'Запоріжжя, Вокзал', coordinates: [35.195, 47.795] },
      departureAt: '2026-11-06T10:00:00.000Z',
    },
  ];

  const modesAudit = {};

  for (const tc of testCases) {
    console.log(`\n======================================================`);
    console.log(`Testing Case: ${tc.name}`);
    console.log(`======================================================`);

    const result = await search(token, tc.origin, tc.destination, tc.departureAt);
    const journeys = result.data?.journeys || [];
    console.log(`Found ${journeys.length} candidate itineraries.`);

    for (let i = 0; i < journeys.length; i++) {
      const j = journeys[i];
      console.log(`\n--- Journey #${i + 1} (id: ${j.id}, strategy: ${j.strategy}, totalDur: ${Math.round(j.totalDurationSeconds / 60)} min, price: ${(j.totalPriceMinor / 100).toFixed(2)} ₴) ---`);
      console.log(`Source: ${j.source}, Provider: ${j.providerName || 'N/A'}`);
      console.log(`Legs: ${j.legs.length}`);

      for (const leg of j.legs) {
        const mode = leg.mode;
        const geom = leg.routeGeometry || [];
        const stops = leg.stops || [];

        console.log(`  * Leg #${leg.ordinal}: [${mode}] ${leg.origin.name} -> ${leg.destination.name}`);
        console.log(`    - Duration: ${Math.round(leg.durationSeconds / 60)} min, Distance: ${leg.distanceMeters} m`);
        console.log(`    - Price: ${leg.priceMinor ? (leg.priceMinor / 100).toFixed(2) + ' ₴' : '—'} (${leg.priceStatus || 'N/A'})`);
        console.log(`    - Provider: ${leg.providerName || leg.providerType || 'N/A'} (source: ${leg.source})`);
        console.log(`    - Geometry Points: ${geom.length}`);
        if (geom.length > 0) {
          console.log(`      Start point: [${geom[0]}], End point: [${geom[geom.length - 1]}]`);
        }
        console.log(`    - Stops Count: ${stops.length}`);
        if (stops.length > 0) {
          console.log(`      Stops: ${stops.map(s => s.name).slice(0, 3).join(', ')}${stops.length > 3 ? '...' : ''}`);
        }

        if (!modesAudit[mode]) {
          modesAudit[mode] = {
            mode,
            sampleSources: new Set(),
            hasGeometry: geom.length > 0,
            sampleGeomLength: geom.length,
            hasStops: stops.length > 0,
            priceStatus: leg.priceStatus,
            sampleProvider: leg.providerName || leg.providerType,
          };
        }
        modesAudit[mode].sampleSources.add(leg.source);
      }
    }
  }

  console.log('\n======================================================');
  console.log('SUMMARY AUDIT BY TRANSPORT MODE:');
  console.log('======================================================');
  for (const [mode, info] of Object.entries(modesAudit)) {
    console.log(`Mode: [${mode}]`);
    console.log(`  Sources: ${Array.from(info.sampleSources).join(', ')}`);
    console.log(`  Geometry: ${info.hasGeometry ? `YES (${info.sampleGeomLength} pts sample)` : 'NO'}`);
    console.log(`  Stops: ${info.hasStops ? 'YES' : 'NO'}`);
    console.log(`  Price Status: ${info.priceStatus}`);
    console.log(`  Sample Provider: ${info.sampleProvider}`);
  }
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
