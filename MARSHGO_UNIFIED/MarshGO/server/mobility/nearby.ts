import type { LiveVehicle } from './transportLayers';
import type { LineType } from './transportLayers';
import type { Bbox } from './types';

export interface GbfsSnapshot {
  assets: unknown[];
  stations: unknown[];
  fetchedAt: number;
  lastUpdated?: number | null;
  staleAfterSeconds?: number | null;
  geofences?: unknown[];
  globalRules?: Record<string, unknown>;
}

export function cachedSnapshot(
  _providerId: string,
  _feedUrl: string,
  _country?: string | null,
): Promise<GbfsSnapshot> {
  return Promise.resolve({ assets: [], stations: [], fetchedAt: Date.now() });
}

export function cachedGtfsRouteTypes(
  _providerId: string,
  _feedUrl: string,
  _sourceVersion?: string | null,
): Promise<Record<string, string>> {
  return Promise.resolve({});
}

export function cachedVehicles(
  _providerId: string,
  _sourceType: string,
  _feedUrl: string,
  _names: Map<string, { name: string; type: LineType }>,
): Promise<LiveVehicle[]> {
  return Promise.resolve([]);
}

export function selectFreshVehicles(
  received: unknown[],
  _box: Bbox,
  _types: string[],
): { vehicles: unknown[]; stale: number; unclassified: number } {
  return { vehicles: received, stale: 0, unclassified: 0 };
}

export function vehicleDataQuality(_timestamp: unknown): { level: string; ageMs: number } {
  return { level: 'unknown', ageMs: 0 };
}

export function layerFailures(_items: unknown[]): Record<string, string> {
  return {};
}

export function aggregateDataQuality(_qualities: unknown[]): unknown {
  return null;
}

export function selectNearby(_options: unknown): unknown[] {
  return [];
}
