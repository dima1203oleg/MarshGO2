export type KyivScheduleKind = 'bus' | 'metro' | 'tram' | 'trolleybus' | 'city_train' | 'funicular';

export interface KyivScheduleEntry {
  kind: KyivScheduleKind;
  routeId: string;
  stops: string[];
  firstDeparture: string;
  lastDeparture: string;
  frequencySeconds: number;
}

export function loadKyivSchedules(_rows: unknown[], _kind?: KyivScheduleKind, _station?: string): KyivScheduleEntry[] {
  return [];
}
