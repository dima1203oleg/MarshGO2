export interface MicromobilityGeoFeature {
  type: string;
  geometry: unknown;
  properties: Record<string, unknown>;
}

export function buildMicromobilityGeofenceFeatures(_options: unknown): MicromobilityGeoFeature[] {
  return [];
}

export function buildMicromobilityPointFeatures(
  _provider: unknown,
  _snapshot: unknown,
  _bbox: { west: number; south: number; east: number; north: number },
  _assetTypes: Set<string>,
  _options?: { includeStations?: boolean },
): MicromobilityGeoFeature[] {
  return [];
}

export function buildStaticRentalPointFeature(_row: unknown): MicromobilityGeoFeature | null {
  return null;
}
