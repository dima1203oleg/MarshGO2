/**
 * GTFS Realtime (GTFS-RT) Vehicle Tracking & Delay Simulation Service
 */

export interface LiveVehiclePosition {
  id: string;
  routeId: string;
  vehicleNumber: string;
  type: 'carpool' | 'minibus' | 'bus' | 'train' | 'metro';
  title: string;
  latitude: number;
  longitude: number;
  bearing: number; // 0 - 360 degrees
  speedKmh: number;
  delayMinutes: number; // 0 = on time, >0 = delayed, <0 = early
  nextStopName: string;
  etaSeconds: number;
  occupancyStatus: 'many_seats' | 'few_seats' | 'full';
}

export interface NavigationStep {
  id: string;
  instruction: string;
  distanceMeters: number;
  direction: 'straight' | 'right' | 'left' | 'slight_right' | 'slight_left' | 'u_turn';
  streetName: string;
  coords: [number, number];
}

export const MOCK_NAVIGATION_STEPS: NavigationStep[] = [
  {
    id: 'step-1',
    instruction: 'Виїжджайте зі стоянки на вул. Стрийську',
    distanceMeters: 400,
    direction: 'straight',
    streetName: 'вул. Стрийська',
    coords: [49.8397, 24.0297],
  },
  {
    id: 'step-2',
    instruction: 'Через 250 м плавний поворот праворуч на трасу М06',
    distanceMeters: 1200,
    direction: 'slight_right',
    streetName: 'Траса М06 / Київське шосе',
    coords: [49.8123, 24.0621],
  },
  {
    id: 'step-3',
    instruction: 'Рухайтесь прямо 85 км у напрямку Броди / Рівне',
    distanceMeters: 85000,
    direction: 'straight',
    streetName: 'Автомагістраль Київ-Чоп (М06)',
    coords: [50.0812, 25.1432],
  },
  {
    id: 'step-4',
    instruction: 'З’їзд праворуч на АС Житомир (зупинка та пересадка)',
    distanceMeters: 800,
    direction: 'right',
    streetName: 'вул. Київська, 93',
    coords: [50.2547, 28.6587],
  },
  {
    id: 'step-5',
    instruction: 'Продовжуйте рух за маршрутом до в’їзду в Київ',
    distanceMeters: 130000,
    direction: 'straight',
    streetName: 'Житомирська траса / Берестейський проспект',
    coords: [50.4501, 30.5234],
  },
];

export const INITIAL_LIVE_VEHICLES: LiveVehiclePosition[] = [
  {
    id: 'veh-andriy-car',
    routeId: 'route-opt-1',
    vehicleNumber: 'AA 1254 AB',
    type: 'carpool',
    title: 'Попутка Андрія (Skoda Octavia)',
    latitude: 50.0512,
    longitude: 26.8521,
    bearing: 68,
    speedKmh: 82,
    delayMinutes: 0,
    nextStopName: 'АС Житомир',
    etaSeconds: 4200,
    occupancyStatus: 'few_seats',
  },
  {
    id: 'veh-minibus-112',
    routeId: 'route-opt-1',
    vehicleNumber: 'AM 7741 BA',
    type: 'minibus',
    title: 'Маршрутка №112 (Житомир-Київ)',
    latitude: 50.3121,
    longitude: 29.1124,
    bearing: 72,
    speedKmh: 74,
    delayMinutes: 3,
    nextStopName: 'м. Коростишів (Автостанція)',
    etaSeconds: 650,
    occupancyStatus: 'many_seats',
  },
  {
    id: 'veh-metro-m1',
    routeId: 'route-opt-1',
    vehicleNumber: 'Потяг 42',
    type: 'metro',
    title: 'Метро М1 (Червона лінія)',
    latitude: 50.4542,
    longitude: 30.3621,
    bearing: 88,
    speedKmh: 55,
    delayMinutes: 0,
    nextStopName: 'ст. м. Святошин',
    etaSeconds: 120,
    occupancyStatus: 'many_seats',
  },
  {
    id: 'veh-intercity-706',
    routeId: 'route-fast-4',
    vehicleNumber: 'ІС+ 706',
    type: 'train',
    title: 'Інтерсіті+ 706 (Hyundai)',
    latitude: 50.1823,
    longitude: 27.8124,
    bearing: 75,
    speedKmh: 140,
    delayMinutes: 1,
    nextStopName: 'Київ-Пасажирський',
    etaSeconds: 5400,
    occupancyStatus: 'few_seats',
  },
];

/**
 * Calculates updated position along direction vector
 */
export function tickVehiclePosition(veh: LiveVehiclePosition, deltaSeconds: number = 2): LiveVehiclePosition {
  // Speed in km/h -> degrees/second (rough approximation: 1 deg ~ 111 km)
  const distanceKm = (veh.speedKmh * deltaSeconds) / 3600;
  const deltaLat = (distanceKm / 111) * Math.cos((veh.bearing * Math.PI) / 180);
  const deltaLng = (distanceKm / (111 * Math.cos((veh.latitude * Math.PI) / 180))) * Math.sin((veh.bearing * Math.PI) / 180);

  // Fluctuating speed for realistic telemetry
  const speedJitter = (Math.random() - 0.5) * 4;
  const newSpeed = Math.max(30, Math.min(110, Math.round(veh.speedKmh + speedJitter)));

  return {
    ...veh,
    latitude: veh.latitude + deltaLat,
    longitude: veh.longitude + deltaLng,
    speedKmh: newSpeed,
    etaSeconds: Math.max(0, veh.etaSeconds - deltaSeconds),
  };
}
