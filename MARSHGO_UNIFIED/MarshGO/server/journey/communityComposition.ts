export interface CommunityRideOption {
  id: string;
  origin: string;
  destination: string;
  departureAt: Date;
  seats: number;
  priceMinor: number;
  driverId: string;
}

export function composeCommunityTransitJourneys(_options: unknown): CommunityRideOption[] {
  return [];
}
