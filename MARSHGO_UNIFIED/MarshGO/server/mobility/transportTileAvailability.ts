export interface TransportTileProviderRow {
  id: string;
  name: string;
  url: string;
  attribution: string;
}

export function selectTileProviders(_options: unknown): TransportTileProviderRow[] {
  return [];
}

export const transportTileDefinitions: TransportTileProviderRow[] = [];
