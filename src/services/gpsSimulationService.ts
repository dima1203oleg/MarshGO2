/**
 * Real-time GPS Vehicle Tracking & Telemetry Simulation Service
 * Provides realistic route interpolation, bearing calculation, and 3-second GPS telemetry ticks.
 */

export type Coordinate = [number, number]; // [latitude, longitude]

export interface ScheduledStop {
  id: string;
  name: string;
  city: string;
  coords: Coordinate;
  distanceKm: number;
  scheduledArrival: string;
  scheduledDeparture?: string;
  platform?: string;
  isOrigin?: boolean;
  isDestination?: boolean;
}

export interface GpsTelemetry {
  currentCoords: Coordinate;
  bearing: number;
  speedKmh: number;
  distanceTraveledKm: number;
  totalDistanceKm: number;
  progressPercent: number;
  nextStop: ScheduledStop;
  nextStopDistanceKm: number;
  nextStopEtaMinutes: number;
  timeRemainingMinutes: number;
  lastPingTimestamp: number;
  pingCountdownSeconds: number;
  satelliteCount: number;
  accuracyMeters: number;
  status: 'active' | 'paused';
  traveledPath: Coordinate[];
}

export interface GpsBusTelemetry {
  latitude: number;
  longitude: number;
  bearing: number;
  speedKmh: number;
  busNumber: string;
  busModel: string;
  routeTitle: string;
  driverName: string;
  nextStopName: string;
  nextStopEtaMinutes: number;
  accuracyMeters: number;
  satellites: number;
  lastPingTimestamp: string;
  traveledDistanceKm: number;
  remainingDistanceKm: number;
  totalDistanceKm: number;
  progressPercent: number;
  historyTrail: Coordinate[];
}

export interface GpsStop {
  id: string;
  name: string;
  city: string;
  coords: Coordinate;
  distanceKm: number;
  scheduledTime: string;
  isPassed: boolean;
  type: 'origin' | 'transfer' | 'destination';
}

/**
 * High-definition M06 Highway polyline coordinates between Lviv and Kyiv
 */
export const ROUTE_HIGHWAY_WAYPOINTS: Coordinate[] = [
  [49.8397, 24.0297], // Lviv Central Bus Station
  [49.8722, 24.1205], // Lviv Outer Ring M06
  [49.9234, 24.3811], // Zapytiv
  [49.9678, 24.6194], // Busk Bypass
  [50.0412, 24.9122], // Olesko Castle area
  [50.0825, 25.1438], // Brody interchange
  [50.1345, 25.2612], // Radyvyliv border
  [50.2589, 25.5012], // Dubno M06 exit
  [50.3951, 25.7489], // Varkovychi
  [50.5694, 26.1284], // Rivne South M06
  [50.6199, 26.2516], // Rivne Central Station
  [50.6288, 26.3512], // Rivne East / Babyn
  [50.6012, 26.6812], // Hoscha
  [50.6192, 27.1594], // Korets
  [50.5833, 27.6247], // Zviahel (Novohrad-Volynskyi)
  [50.4812, 28.0512], // Pulyny
  [50.2649, 28.6767], // Zhytomyr Central Bus Station
  [50.3125, 29.0412], // Korostyshiv bypass
  [50.3541, 29.4123], // Kocheriv
  [50.4124, 29.7891], // Makaryv intersection
  [50.4356, 30.0124], // Berezivka
  [50.4512, 30.2215], // Chaika / Petropavlivska Borshchahivka
  [50.4501, 30.5234], // Kyiv Main Bus Station (Demiivska)
];

export const DEFAULT_POLYLINE_COORDINATES: Coordinate[] = ROUTE_HIGHWAY_WAYPOINTS;

/**
 * Scheduled Stops along the Lviv -> Kyiv Route
 */
export const DEFAULT_SCHEDULED_STOPS: ScheduledStop[] = [
  {
    id: 'stop-lviv',
    name: 'Львів (АС-8, Двірець)',
    city: 'Львів',
    coords: [49.8397, 24.0297],
    distanceKm: 0,
    scheduledArrival: '07:30',
    scheduledDeparture: '07:30',
    platform: 'Платформа 4',
    isOrigin: true,
  },
  {
    id: 'stop-brody',
    name: 'Броди (Автостанція M06)',
    city: 'Броди',
    coords: [50.0825, 25.1438],
    distanceKm: 98,
    scheduledArrival: '08:50',
    scheduledDeparture: '08:55',
    platform: 'Платформа 2',
  },
  {
    id: 'stop-rivne',
    name: 'Рівне (Центральний автовокзал)',
    city: 'Рівне',
    coords: [50.6199, 26.2516],
    distanceKm: 212,
    scheduledArrival: '10:30',
    scheduledDeparture: '10:45',
    platform: 'Платформа 1',
  },
  {
    id: 'stop-zhytomyr',
    name: 'Житомир (Автовокзал №1)',
    city: 'Житомир',
    coords: [50.2649, 28.6767],
    distanceKm: 395,
    scheduledArrival: '13:10',
    scheduledDeparture: '13:20',
    platform: 'Платформа 3',
  },
  {
    id: 'stop-kyiv',
    name: 'Київ (Центральний автовокзал)',
    city: 'Київ',
    coords: [50.4501, 30.5234],
    distanceKm: 540,
    scheduledArrival: '15:20',
    scheduledDeparture: '15:20',
    platform: 'Платформа 8',
    isDestination: true,
  },
];

/**
 * Haversine formula to compute distance in km between two geo coordinates
 */
export function calculateHaversineDistance(c1: Coordinate, c2: Coordinate): number {
  const [lat1, lon1] = c1;
  const [lat2, lon2] = c2;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate bearing/heading angle in degrees (0..360) between two coordinates
 */
export function calculateBearing(c1: Coordinate, c2: Coordinate): number {
  const [lat1, lon1] = c1;
  const [lat2, lon2] = c2;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  return (theta * 180 / Math.PI + 360) % 360;
}

/**
 * Calculate total cumulative distance of a polyline in km
 */
export function calculatePolylineTotalDistance(coords: Coordinate[] = ROUTE_HIGHWAY_WAYPOINTS): number {
  if (coords.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += calculateHaversineDistance(coords[i], coords[i + 1]);
  }
  return total;
}

export const TOTAL_ROUTE_DISTANCE_KM = Math.round(calculatePolylineTotalDistance(ROUTE_HIGHWAY_WAYPOINTS));

/**
 * Interpolate coordinate and bearing at a specific distance (in km) along a polyline
 */
export function getInterpolatedPositionAtDistance(
  coords: Coordinate[] = ROUTE_HIGHWAY_WAYPOINTS,
  targetKm: number
): { coords: Coordinate; bearing: number; segmentIndex: number; traveledPath: Coordinate[] } {
  if (coords.length === 0) {
    return { coords: [50.25, 27.8], bearing: 0, segmentIndex: 0, traveledPath: [] };
  }
  if (coords.length === 1 || targetKm <= 0) {
    return {
      coords: coords[0],
      bearing: coords.length > 1 ? calculateBearing(coords[0], coords[1]) : 0,
      segmentIndex: 0,
      traveledPath: [coords[0]],
    };
  }

  let accumulatedDist = 0;
  const traveledPath: Coordinate[] = [coords[0]];

  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const segDist = calculateHaversineDistance(p1, p2);

    if (accumulatedDist + segDist >= targetKm || i === coords.length - 2) {
      const remainingDist = Math.max(0, targetKm - accumulatedDist);
      const ratio = segDist > 0 ? Math.min(1, remainingDist / segDist) : 0;

      const lat = p1[0] + (p2[0] - p1[0]) * ratio;
      const lng = p1[1] + (p2[1] - p1[1]) * ratio;
      const currentPoint: Coordinate = [lat, lng];

      traveledPath.push(currentPoint);

      const bearing = calculateBearing(p1, p2);
      return {
        coords: currentPoint,
        bearing,
        segmentIndex: i,
        traveledPath,
      };
    }

    accumulatedDist += segDist;
    traveledPath.push(p2);
  }

  const last = coords[coords.length - 1];
  const prev = coords[coords.length - 2];
  return {
    coords: last,
    bearing: calculateBearing(prev, last),
    segmentIndex: coords.length - 2,
    traveledPath: [...coords],
  };
}

/**
 * Helper specifically for RouteMapScreen
 */
export function interpolatePositionAtDistance(targetKm: number): {
  latitude: number;
  longitude: number;
  bearing: number;
  segmentIndex: number;
} {
  const result = getInterpolatedPositionAtDistance(ROUTE_HIGHWAY_WAYPOINTS, targetKm);
  return {
    latitude: result.coords[0],
    longitude: result.coords[1],
    bearing: result.bearing,
    segmentIndex: result.segmentIndex,
  };
}

/**
 * Returns structured stops with pre-calculated distances along the highway
 */
export function getStopsWithDistances(): GpsStop[] {
  return [
    {
      id: 'stop-lviv',
      name: 'Львів (АС-8, Двірець)',
      city: 'Львів',
      coords: [49.8397, 24.0297],
      distanceKm: 0,
      scheduledTime: '07:30',
      isPassed: false,
      type: 'origin',
    },
    {
      id: 'stop-brody',
      name: 'Броди (АС траса M06)',
      city: 'Броди',
      coords: [50.0825, 25.1438],
      distanceKm: 98,
      scheduledTime: '08:50',
      isPassed: false,
      type: 'transfer',
    },
    {
      id: 'stop-rivne',
      name: 'Рівне (Центральний автовокзал)',
      city: 'Рівне',
      coords: [50.6199, 26.2516],
      distanceKm: 212,
      scheduledTime: '10:30',
      isPassed: false,
      type: 'transfer',
    },
    {
      id: 'stop-zhytomyr',
      name: 'Житомир (Автовокзал №1)',
      city: 'Житомир',
      coords: [50.2649, 28.6767],
      distanceKm: 395,
      scheduledTime: '13:10',
      isPassed: false,
      type: 'transfer',
    },
    {
      id: 'stop-kyiv',
      name: 'Київ (Центральний автовокзал)',
      city: 'Київ',
      coords: [50.4501, 30.5234],
      distanceKm: 540,
      scheduledTime: '15:20',
      isPassed: false,
      type: 'destination',
    },
  ];
}

/**
 * Find the next upcoming scheduled stop from the current position
 */
export function findNextScheduledStop(
  currentCoords: Coordinate,
  stops: ScheduledStop[] = DEFAULT_SCHEDULED_STOPS,
  traveledDistKm: number,
  totalRouteDistKm: number = TOTAL_ROUTE_DISTANCE_KM
): { nextStop: ScheduledStop; nextStopDistKm: number; nextStopEtaMinutes: number } {
  // Find stop with distance strictly greater than traveled
  let next = stops.find((s) => s.distanceKm > traveledDistKm + 0.5);
  if (!next) {
    next = stops[stops.length - 1];
  }

  const distToStop = Math.max(0, Math.round((next.distanceKm - traveledDistKm) * 10) / 10);
  const averageSpeed = 75; // km/h
  const etaMinutes = Math.max(1, Math.round((distToStop / averageSpeed) * 60));

  return {
    nextStop: next,
    nextStopDistKm: distToStop,
    nextStopEtaMinutes: etaMinutes,
  };
}

/**
 * Creates the initial telemetry state for RouteMapScreen
 */
export function createInitialBusTelemetry(): GpsBusTelemetry {
  const initialTraveledKm = 145; // Start mid-way through trip near Dubno/Rivne for active demo
  const initialPos = interpolatePositionAtDistance(initialTraveledKm);
  const total = TOTAL_ROUTE_DISTANCE_KM;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const progress = Math.min(100, Math.round((initialTraveledKm / total) * 100));

  return {
    latitude: initialPos.latitude,
    longitude: initialPos.longitude,
    bearing: initialPos.bearing,
    speedKmh: 76,
    busNumber: 'BC 4921 AA',
    busModel: 'Mercedes-Benz Tourismo 15 RHD',
    routeTitle: 'Львів → Київ (Експрес)',
    driverName: 'Олександр Коваленко',
    nextStopName: 'Рівне (Центральний автовокзал)',
    nextStopEtaMinutes: 28,
    accuracyMeters: 2.8,
    satellites: 12,
    lastPingTimestamp: timeStr,
    traveledDistanceKm: initialTraveledKm,
    remainingDistanceKm: Math.max(0, total - initialTraveledKm),
    totalDistanceKm: total,
    progressPercent: progress,
    historyTrail: [
      [49.8397, 24.0297],
      [50.0825, 25.1438],
      [initialPos.latitude, initialPos.longitude],
    ],
  };
}

/**
 * Updates telemetry on each 3-second heartbeat ping
 * Moves the bus forward along polylineCoordinates according to realistic highway speed
 */
export function tickBusTelemetry(
  prev: GpsBusTelemetry,
  speedMultiplier: number = 1
): GpsBusTelemetry {
  // Advance distance based on 3 seconds at current speed:
  // Speed ~ 75 km/h -> in 3 seconds = 75 / 3600 * 3 = 0.0625 km (62.5 meters per ping)
  // With speedMultiplier, scale accordingly
  const baseDeltaKm = (76 / 3600) * 3 * speedMultiplier;

  let newTraveledKm = prev.traveledDistanceKm + baseDeltaKm;
  if (newTraveledKm >= prev.totalDistanceKm) {
    // Loop back to start smoothly if journey complete
    newTraveledKm = 0;
  }

  newTraveledKm = Math.round(newTraveledKm * 100) / 100;
  const newPos = interpolatePositionAtDistance(newTraveledKm);

  // Slight speed fluctuation for realism (72 - 82 km/h)
  const speedNoise = Math.floor(Math.sin(Date.now() / 6000) * 5);
  const newSpeed = Math.max(50, Math.min(88, 76 + speedNoise));

  const total = prev.totalDistanceKm;
  const remaining = Math.max(0, Math.round((total - newTraveledKm) * 10) / 10);
  const progress = Math.min(100, Math.max(0, Math.round((newTraveledKm / total) * 100)));

  // Identify next upcoming stop
  const stops = getStopsWithDistances();
  let upcomingStop = stops.find((s) => s.distanceKm > newTraveledKm);
  if (!upcomingStop) upcomingStop = stops[stops.length - 1];

  const kmToNext = Math.max(0, Math.round((upcomingStop.distanceKm - newTraveledKm) * 10) / 10);
  const etaMinutes = Math.max(1, Math.round((kmToNext / Math.max(40, newSpeed)) * 60));

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const updatedTrail = [...prev.historyTrail];
  if (
    updatedTrail.length === 0 ||
    calculateHaversineDistance(
      updatedTrail[updatedTrail.length - 1],
      [newPos.latitude, newPos.longitude]
    ) > 0.5
  ) {
    updatedTrail.push([newPos.latitude, newPos.longitude]);
    if (updatedTrail.length > 50) updatedTrail.shift();
  }

  return {
    ...prev,
    latitude: newPos.latitude,
    longitude: newPos.longitude,
    bearing: newPos.bearing,
    speedKmh: newSpeed,
    traveledDistanceKm: newTraveledKm,
    remainingDistanceKm: remaining,
    progressPercent: progress,
    nextStopName: upcomingStop.name,
    nextStopEtaMinutes: etaMinutes,
    lastPingTimestamp: timeStr,
    historyTrail: updatedTrail,
    accuracyMeters: 2.5 + (Math.floor(Date.now() / 3000) % 2 ? 0.3 : 0),
  };
}
