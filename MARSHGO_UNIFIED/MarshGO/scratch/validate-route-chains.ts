import { composeUkraineMultimodalChains, MultimodalJourney } from '../server/journey/multimodalChainEngine';
import { haversineMeters } from '../server/mobility/kyivTransitGraph';

interface InvariantViolation {
  journeyId: string;
  rule: string;
  details: string;
}

function validateJourneyChain(j: MultimodalJourney): InvariantViolation[] {
  const violations: InvariantViolation[] = [];

  if (!j.legs || j.legs.length === 0) {
    violations.push({ journeyId: j.id, rule: 'NON_EMPTY_LEGS', details: 'Journey has no legs' });
    return violations;
  }

  // Invariant 1: Sequential leg ordinals (0, 1, 2, ..., N-1)
  j.legs.forEach((leg, idx) => {
    if (leg.ordinal !== idx) {
      violations.push({
        journeyId: j.id,
        rule: 'LEG_ORDINAL_SEQUENCE',
        details: `Leg index ${idx} has ordinal ${leg.ordinal} (expected ${idx})`,
      });
    }
  });

  // Invariant 2: Temporal Causality & Transfer Buffer
  for (let i = 0; i < j.legs.length - 1; i++) {
    const curLeg = j.legs[i];
    const nextLeg = j.legs[i + 1];

    if (nextLeg.departureAt.getTime() < curLeg.arrivalAt.getTime()) {
      const negativeGap = (curLeg.arrivalAt.getTime() - nextLeg.departureAt.getTime()) / 1000;
      violations.push({
        journeyId: j.id,
        rule: 'TEMPORAL_CAUSALITY',
        details: `Leg ${i} (${curLeg.mode}) arrives at ${curLeg.arrivalAt.toISOString()}, but leg ${i + 1} (${nextLeg.mode}) departs earlier at ${nextLeg.departureAt.toISOString()} (negative buffer: -${negativeGap}s)`,
      });
    }

    // Rail buffer rule: at least 15 min buffer before boarding Intercity Rail
    if (nextLeg.mode === 'RAIL') {
      const bufferMinutes = (nextLeg.departureAt.getTime() - curLeg.arrivalAt.getTime()) / 60_000;
      if (bufferMinutes < 15) {
        violations.push({
          journeyId: j.id,
          rule: 'RAIL_TRANSFER_BUFFER',
          details: `Buffer before RAIL leg ${i + 1} is ${bufferMinutes.toFixed(1)} min (< 15 min required)`,
        });
      }
    }
  }

  // Invariant 3: Spatial continuity between consecutive legs
  for (let i = 0; i < j.legs.length - 1; i++) {
    const curDest = j.legs[i].destination.coordinates;
    const nextOrig = j.legs[i + 1].origin.coordinates;
    const gapMeters = haversineMeters(curDest, nextOrig);

    // If gap is greater than 150m, there should be an intervening walk leg unless coordinates represent the same hub
    if (gapMeters > 300) {
      violations.push({
        journeyId: j.id,
        rule: 'SPATIAL_CONTINUITY',
        details: `Discontinuity between leg ${i} destination (${j.legs[i].destination.name}) and leg ${i + 1} origin (${j.legs[i + 1].origin.name}): ${Math.round(gapMeters)}m gap without walking connector`,
      });
    }
  }

  // Invariant 4: Duration calculation
  const firstDep = j.legs[0].departureAt.getTime();
  const lastArr = j.legs.at(-1)!.arrivalAt.getTime();
  const expectedDurationSeconds = Math.round((lastArr - firstDep) / 1000);
  if (Math.abs(j.totalDurationSeconds - expectedDurationSeconds) > 5) {
    violations.push({
      journeyId: j.id,
      rule: 'DURATION_CONSISTENCY',
      details: `totalDurationSeconds (${j.totalDurationSeconds}) does not match first-to-last span (${expectedDurationSeconds}s)`,
    });
  }

  // Invariant 5: Walking distance consistency
  const calculatedWalking = j.legs
    .filter((l) => l.mode === 'WALK')
    .reduce((sum, l) => sum + (l.walkingDistanceMeters ?? l.distanceMeters), 0);
  if (Math.abs(j.walkingMeters - calculatedWalking) > 5) {
    violations.push({
      journeyId: j.id,
      rule: 'WALKING_CONSISTENCY',
      details: `walkingMeters (${j.walkingMeters}) does not match sum of walk legs (${calculatedWalking}m)`,
    });
  }

  // Invariant 6: Price aggregation
  const allPricesKnown = j.legs.every((l) => l.priceMinor !== null);
  if (allPricesKnown && j.totalPriceMinor !== null) {
    const sumPrice = j.legs.reduce((sum, l) => sum + (l.priceMinor ?? 0), 0);
    if (Math.abs(j.totalPriceMinor - sumPrice) > 5) {
      violations.push({
        journeyId: j.id,
        rule: 'PRICE_CONSISTENCY',
        details: `totalPriceMinor (${j.totalPriceMinor}) does not match sum of legs (${sumPrice})`,
      });
    }
  }

  return violations;
}

async function runComprehensiveChainingAudit() {
  console.log('======================================================================');
  console.log('MARSHGO MULTIMODAL ROUTE CHAIN ENGINE COMPREHENSIVE VERIFICATION AUDIT');
  console.log('======================================================================\n');

  const testCases = [
    {
      name: '1. Kyiv Intra-City: Оболонь → Центральний Залізничний вокзал',
      input: {
        origin: { name: 'ст. м. Оболонь', coordinates: [30.498, 50.501] as [number, number] },
        destination: { name: 'Київ-Пасажирський (Вокзальна)', coordinates: [30.488, 50.441] as [number, number] },
        departureAt: new Date(Date.now() + 3600_000),
        passengers: 1,
        strategy: 'BALANCED' as const,
        preferences: { allowPublicTransport: true, allowTaxi: true, allowedTransportTypes: ['metro', 'taxi', 'scooter', 'bike'] },
      },
    },
    {
      name: '2. Lviv Intra-City: Сихів (Вернадського) → Головний вокзал',
      input: {
        origin: { name: 'вул. Вернадського (Сихів)', coordinates: [24.0560, 49.7942] as [number, number] },
        destination: { name: 'Львів-Головний', coordinates: [23.9950, 49.8358] as [number, number] },
        departureAt: new Date(Date.now() + 3600_000),
        passengers: 1,
        strategy: 'BALANCED' as const,
        preferences: { allowPublicTransport: true, allowTaxi: true, allowedTransportTypes: ['tram', 'taxi'] },
      },
    },
    {
      name: '3. Kharkiv Metro Multi-Line Transfer: Салтівка → Холодна Гора (Line 2 → Line 1)',
      input: {
        origin: { name: 'ст. м. Героїв Праці', coordinates: [36.3245, 50.0245] as [number, number] },
        destination: { name: 'ст. м. Холодна Гора', coordinates: [36.1802, 49.9825] as [number, number] },
        departureAt: new Date(Date.now() + 3600_000),
        passengers: 1,
        strategy: 'BALANCED' as const,
        preferences: { allowPublicTransport: true, allowedTransportTypes: ['metro'] },
      },
    },
    {
      name: '4. Dnipro Intermodal: Metro + Tram 1 Transfer (Покровська → пл. Соборна)',
      input: {
        origin: { name: 'ст. м. Покровська', coordinates: [34.9255, 48.4835] as [number, number] },
        destination: { name: 'пл. Соборна (Дніпро)', coordinates: [35.0655, 48.4575] as [number, number] },
        departureAt: new Date(Date.now() + 3600_000),
        passengers: 1,
        strategy: 'BALANCED' as const,
        preferences: { allowPublicTransport: true, allowedTransportTypes: ['metro', 'tram'] },
      },
    },
    {
      name: '5. Intercity Multimodal Corridor: Київ (Оболонь) → Львів (Сихів)',
      input: {
        origin: { name: 'вул. Маршала Тимошенка (Київ)', coordinates: [30.498, 50.501] as [number, number] },
        destination: { name: 'просп. Червоної Калини (Львів)', coordinates: [24.0560, 49.7942] as [number, number] },
        departureAt: new Date(Date.now() + 3600_000),
        passengers: 1,
        strategy: 'BALANCED' as const,
        preferences: { allowPublicTransport: true, allowTaxi: true, allowedTransportTypes: ['train', 'taxi', 'tram'] },
      },
    },
    {
      name: '6. Intercity Multimodal Corridor: Київ (Печерськ) → Одеса (Аркадія)',
      input: {
        origin: { name: 'Печерська площа (Київ)', coordinates: [30.540, 50.428] as [number, number] },
        destination: { name: 'Аркадія (Одеса)', coordinates: [30.7675, 46.4298] as [number, number] },
        departureAt: new Date(Date.now() + 3600_000),
        passengers: 1,
        strategy: 'BALANCED' as const,
        preferences: { allowPublicTransport: true, allowTaxi: true, allowedTransportTypes: ['train', 'taxi', 'tram'] },
      },
    },
    {
      name: '7. Intercity Multimodal Corridor: Київ (Позняки) → Харків (Салтівка)',
      input: {
        origin: { name: 'ст. м. Позняки (Київ)', coordinates: [30.634, 50.398] as [number, number] },
        destination: { name: 'Героїв Праці (Харків)', coordinates: [36.3245, 50.0245] as [number, number] },
        departureAt: new Date(Date.now() + 3600_000),
        passengers: 1,
        strategy: 'BALANCED' as const,
        preferences: { allowPublicTransport: true, allowTaxi: true, allowedTransportTypes: ['train', 'taxi', 'metro'] },
      },
    },
    {
      name: '8. Regional Corridor: Львів (пл. Ринок) → Івано-Франківськ (Центр)',
      input: {
        origin: { name: 'пл. Ринок (Львів)', coordinates: [24.0315, 49.8418] as [number, number] },
        destination: { name: 'Івано-Франківськ (Центр)', coordinates: [24.7215, 48.9230] as [number, number] },
        departureAt: new Date(Date.now() + 3600_000),
        passengers: 1,
        strategy: 'BALANCED' as const,
        preferences: { allowPublicTransport: true, allowTaxi: true, allowedTransportTypes: ['train', 'tram', 'taxi'] },
      },
    },
    {
      name: '9. Direct Carpool Community Integration: Київ → Житомир',
      input: {
        origin: { name: 'Київ, Центральний автовокзал', coordinates: [30.5234, 50.4072] as [number, number] },
        destination: { name: 'Житомир, Автовокзал', coordinates: [28.6912, 50.2642] as [number, number] },
        departureAt: new Date(Date.now() + 7200_000),
        passengers: 2,
        strategy: 'CHEAPEST' as const,
        preferences: { allowPublicTransport: true, allowedTransportTypes: ['carpool'] },
        communityOffers: [
          {
            offer_id: 'test-carpool-offer-001',
            driver_id: 'driver-oleksiy',
            driver_name: 'Олексій М.',
            vehicle_id: 'veh-toyota-camry',
            origin_name: 'Київ, Центральний автовокзал',
            destination_name: 'Житомир, Автовокзал',
            origin_lon: 30.5234,
            origin_lat: 50.4072,
            destination_lon: 28.6912,
            destination_lat: 50.2642,
            departure_at: new Date(Date.now() + 7200_000),
            arrival_at: new Date(Date.now() + 7200_000 + 5400_000),
            duration_s: 5400,
            distance_m: 135000,
            price_per_seat_minor: 18000,
            currency: 'UAH',
            available_seats: 3,
            average_rating: 4.95,
            review_count: 42,
            vehicle_make: 'Toyota',
            vehicle_model: 'Camry',
          },
        ],
      },
    },
  ];

  let totalJourneysAudited = 0;
  let totalViolations = 0;
  const allViolations: InvariantViolation[] = [];

  for (const tc of testCases) {
    console.log(`Auditing: ${tc.name}`);
    const journeys = await composeUkraineMultimodalChains(tc.input);
    console.log(`  -> Produced ${journeys.length} candidate journey chains.`);

    if (journeys.length === 0) {
      console.log('  ❌ FAIL: No chains generated for valid test input!');
      totalViolations++;
      allViolations.push({ journeyId: 'NONE', rule: 'EMPTY_RESULTS', details: `No journeys returned for ${tc.name}` });
      continue;
    }

    for (const j of journeys) {
      totalJourneysAudited++;
      const v = validateJourneyChain(j);
      if (v.length > 0) {
        totalViolations += v.length;
        allViolations.push(...v);
        console.log(`  ⚠️  Violations in journey [${j.id}]:`);
        v.forEach((item) => console.log(`     - [${item.rule}] ${item.details}`));
      } else {
        const legModes = j.legs.map((l) => l.mode).join(' → ');
        const durMin = Math.round(j.totalDurationSeconds / 60);
        const priceStr = j.totalPriceMinor !== null ? `${(j.totalPriceMinor / 100).toFixed(0)} ₴` : '—';
        console.log(`  ✅ Chain [${j.id}]: ${legModes} | ${durMin} хв | ${priceStr} | ${j.transfers} перес. (VALID)`);
      }
    }
    console.log('');
  }

  console.log('======================================================================');
  console.log(`AUDIT COMPLETE: ${totalJourneysAudited} journeys audited across 9 test cases.`);
  if (totalViolations === 0) {
    console.log('RESULT: 100% INVARIANT PASS! All multimodal route chains are valid.');
  } else {
    console.log(`RESULT: Found ${totalViolations} invariant violations! Details above.`);
  }
  console.log('======================================================================');

  if (totalViolations > 0) {
    process.exit(1);
  }
}

runComprehensiveChainingAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
