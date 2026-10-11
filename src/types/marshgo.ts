/**
 * MARSHGO - Core Data Types & Interfaces
 */

export type TransportType =
  | 'carpool'    // Попутка
  | 'minibus'    // Маршрутка
  | 'bus'        // Автобус
  | 'taxi'       // Таксі
  | 'trolleybus' // Тролейбус
  | 'metro'      // Метро
  | 'tram'       // Трамвай
  | 'train'      // Поїзд
  | 'bike'       // Велосипед
  | 'scooter'    // Самокат
  | 'carshare'   // Каршеринг
  | 'transfer';  // Трансфер

export interface TransportCategoryMeta {
  id: TransportType;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  description: string;
}

export interface RouteSegment {
  id: string;
  type: TransportType | 'walk';
  title: string;
  subtitle?: string;
  carrier?: string;
  vehicleDetails?: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  distanceKm?: number;
  costUah: number;
  stops?: string[];
  driverName?: string;
  isCarpool?: boolean;
}

export interface TransitRoute {
  id: string;
  title: string; // e.g. "Попутка + Маршрутка + Метро"
  tagType: 'optimal' | 'cheapest' | 'fastest';
  fromCity: string;
  fromAddress: string;
  toCity: string;
  toAddress: string;
  departureTime: string;
  arrivalTime: string;
  durationFormatted: string; // "6 год 40 хв"
  transfersCount: number;
  totalCostUah: number;
  segments: RouteSegment[];
  polylineCoordinates: [number, number][]; // Lat, Lng
  isDirectCarpool?: boolean;
}

export interface CarpoolRide {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatar: string;
  driverRating: number;
  driverReviewsCount: number;
  driverJoinedYear: number;
  carModel: string;
  carPlate: string;
  carColor: string;
  fromCity: string;
  fromAddress: string;
  toCity: string;
  toAddress: string;
  departureDate: string; // "Сьогодні, 30 жовтня"
  departureTime: string; // "14:40"
  arrivalTime: string;   // "17:45"
  totalDistanceKm: number;
  costPerSeatUah: number;
  availableSeats: number;
  totalSeats: number;
  distanceFromUserKm: number;
  intermediateStops: {
    name: string;
    time: string;
    stopDurationMin: number;
  }[];
  bookedPassengers: {
    id: string;
    name: string;
    avatar: string;
    seat: string;
  }[];
}

export interface MarshPassTicket {
  id: string;
  bookingCode: string; // e.g. "MG7246"
  fromCity: string;
  toCity: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  durationFormatted: string;
  transfersCount: number;
  totalCostUah: number;
  seatNumber: string;
  totalSeats: number;
  carModel: string;
  carPlate: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  status: 'active' | 'completed' | 'cancelled';
  segmentsSummary: {
    type: TransportType | 'walk';
    time: string;
    city: string;
    cost: number;
  }[];
  routeId?: string;
  carpoolId?: string;
  qrPayload: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  isDriver: boolean;
  isVerifiedDiia: boolean;
  rating: number;
  completedRides: number;
  car?: {
    model: string;
    plate: string;
    color: string;
    year: number;
  };
}

export type ScreenId =
  | 'home'
  | 'search'
  | 'results'
  | 'route-map'
  | 'route-details'
  | 'ride-details'
  | 'marshpass'
  | 'marshpass-details'
  | 'messages'
  | 'profile';

export type MainTab = 'home' | 'search' | 'publish' | 'rides' | 'profile';
