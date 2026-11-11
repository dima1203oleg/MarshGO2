import type {
  SharedVehicleProvider,
  SharedVehicleItem,
  SharedStationItem,
  Coordinate,
} from '../../../shared/mobility/interfaces';
import { fetchJson } from '../../mobility/safeFetch';

export function stationsWithinBbox<T extends { lat: number; lon: number }>(
  stations: T[],
  bbox: [number, number, number, number],
): T[] {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  return stations.filter((station) => Number.isFinite(station.lon) && Number.isFinite(station.lat)
    && station.lon >= minLon && station.lon <= maxLon
    && station.lat >= minLat && station.lat <= maxLat);
}

export class NextbikeGbfsAdapter implements SharedVehicleProvider {
  readonly id = 'nextbike-gbfs';
  private readonly gbfsDiscoveryUrl: string;

  constructor(gbfsDiscoveryUrl: string) {
    this.gbfsDiscoveryUrl = gbfsDiscoveryUrl;
  }

  async getStations(bbox: [number, number, number, number]): Promise<SharedStationItem[]> {
    try {
      const { data } = await fetchJson(this.gbfsDiscoveryUrl, 8000);
      const root = data as {
        data?: {
          en?: { feeds?: Array<{ name: string; url: string }> };
          uk?: { feeds?: Array<{ name: string; url: string }> };
        };
      };

      const feeds = root.data?.uk?.feeds ?? root.data?.en?.feeds ?? [];
      const infoFeed = feeds.find((f) => f.name === 'station_information');
      const statusFeed = feeds.find((f) => f.name === 'station_status');

      if (!infoFeed || !statusFeed) return [];

      const [infoRes, statusRes] = await Promise.all([
        fetchJson(infoFeed.url, 8000),
        fetchJson(statusFeed.url, 8000),
      ]);

      const infoData = (infoRes.data as { data?: { stations?: Array<{ station_id: string; name: string; lat: number; lon: number }> } }).data?.stations ?? [];
      const statusData = (statusRes.data as { data?: { stations?: Array<{ station_id: string; num_bikes_available: number; num_docks_available: number; is_renting: boolean; is_returning: boolean }> } }).data?.stations ?? [];

      const statusMap = new Map(statusData.map((s) => [s.station_id, s]));

      return stationsWithinBbox(infoData, bbox).map((station) => {
        const status = statusMap.get(station.station_id);
        return {
          id: station.station_id,
          name: station.name,
          coordinate: [station.lon, station.lat] as Coordinate,
          availableVehicles: status?.num_bikes_available ?? 0,
          availableDocks: status?.num_docks_available ?? 0,
          isRenting: status?.is_renting ?? true,
          isReturning: status?.is_returning ?? true,
        };
      });
    } catch (err) {
      console.warn('[NextbikeGbfsAdapter] Failed to fetch station feeds:', err);
      return [];
    }
  }

  async getVehicles(_bbox: [number, number, number, number]): Promise<SharedVehicleItem[]> {
    return [];
  }
}

export class GetmancarAdapter implements SharedVehicleProvider {
  readonly id = 'getmancar';
  private hasActiveContract: boolean = false;

  constructor(hasActiveContract: boolean = false) {
    this.hasActiveContract = hasActiveContract;
  }

  async getVehicles(_bbox: [number, number, number, number]): Promise<SharedVehicleItem[]> {
    if (!this.hasActiveContract) {
      // Do not display cars without verified B2B feed credentials
      return [];
    }
    return [];
  }
}
