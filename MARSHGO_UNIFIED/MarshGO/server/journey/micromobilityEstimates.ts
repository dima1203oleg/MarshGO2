export interface MicromobilityRouteEstimate {
  id: string;
  mode: 'BIKE' | 'SCOOTER';
  meters: number;
  durationSeconds: number;
  priceMinor: number;
  arrivalAt?: Date;
}

export interface RentalRouteNetwork {
  providerId: string;
  stations: Array<{ id: string; location: [number, number] }>;
  compatibilityStatus?: string;
  returnRule?: string;
  returnRuleSource?: string;
}

export interface RentalRoutePoint {
  location: [number, number];
  type: 'pickup' | 'dropoff';
  id?: string;
  availability?: string;
}

export interface ScooterRouteProvider {
  id: string;
  name: string;
  available: boolean;
  providerId?: string;
}

export function buildBicycleRouteEstimates(_options: unknown): MicromobilityRouteEstimate[] {
  return [];
}

export function buildScooterRouteEstimates(_options: unknown): MicromobilityRouteEstimate[] {
  return [];
}
