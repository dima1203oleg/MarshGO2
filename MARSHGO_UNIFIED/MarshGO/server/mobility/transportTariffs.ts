export interface TransportFareEntry {
  routeId: string;
  type: string;
  priceMinor: number;
  currency: string;
}

export interface TransportFareCatalog {
  city: string;
  fares: TransportFareEntry[];
  updatedAt: Date;
}

export function getTransportFareCatalog(options?: { city?: string; mode?: string }): TransportFareCatalog {
  return { city: options?.city ?? '', fares: [], updatedAt: new Date() };
}
