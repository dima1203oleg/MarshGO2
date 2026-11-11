export interface TransportLayerAvailability {
  layerId: string;
  available: boolean;
  lastChecked: Date;
  lines?: string[];
  micro?: string[];
  stationsAvailable?: boolean;
  staticBikeLocationsAvailable?: boolean;
}

export function buildTransportLayerAvailability(_options: unknown): TransportLayerAvailability {
  return { layerId: 'all', available: true, lastChecked: new Date() };
}
