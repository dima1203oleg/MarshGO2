import type { LineType } from './transportLayers';
import type { Bbox } from './types';

export interface RentalLocation {
  id: string;
  providerId: string;
  networkId: string | null;
  mode: LineType | 'BICYCLE' | 'SCOOTER';
  rentalModel: 'STATION_BASED' | 'FREE_FLOATING' | 'STAFFED' | 'CONFIRMED_ONE_WAY' | 'UNKNOWN';
  name: string;
  pickupAllowed: boolean | null;
  dropoffAllowed: boolean | null;
  availability: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';
  availableVehicles: number | null;
  availableDocks: number | null;
  vehicleTypes: string[];
  availabilityCheckedAt: Date | null;
  openingAtPickup: boolean;
  openingAtDropoff: boolean;
  geofenceAllowsPickup: boolean | null;
  geofenceAllowsDropoff: boolean | null;
}

export interface RentalNetworkRule {
  networkId: string;
  providerIds: string[];
  status: 'CONFIRMED' | 'DISABLED' | 'UNKNOWN';
  returnRule: 'SAME_LOCATION' | 'ANY_NETWORK_LOCATION' | 'FREE_FLOATING_ZONE' | 'ONE_WAY_CONFIRMED' | 'UNKNOWN';
  returnRuleSource: 'OWNER_ATTESTED' | 'PROVIDER_API' | 'PROVIDER_DOCUMENTATION' | 'UNKNOWN';
  crossProviderReturnConfirmed: boolean;
  maximumSnapshotAgeSeconds: number | null;
}

export function canRent(_options: unknown): { compatible: boolean; reasons: string[] } {
  return { compatible: true, reasons: [] };
}

export function bboxContains(_box: Bbox, _lon: number, _lat: number, _marginKm?: number): boolean {
  return true;
}

export const UKRAINE_BBOX: Bbox = [22, 44, 41, 53];
export function centerInUkraine(_box: Bbox | undefined): boolean {
  return true;
}
