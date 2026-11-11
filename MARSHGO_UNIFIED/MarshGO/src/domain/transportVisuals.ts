/** Category colors used by map layers, vehicle markers and transport legends. */
export const transportColors = {
  bus: '#0284C7',
  marshrutka: '#F59E0B',
  trolleybus: '#10B981',
  tram: '#EF4444',
  metro: '#8B5CF6',
  train: '#8B5CF6',
  suburban_train: '#8B5CF6',
  city_train: '#0D9488',
  funicular: '#B45309',
  walk: '#64748B',
  carpool: '#10B981',
  taxi: '#F59E0B',
  bike: '#16A34A',
  scooter: '#F59E0B',
  carsharing: '#13A66F',
  transfer: '#0284C7',
  ferry: '#0284C7',
  water: '#0284C7',
  air: '#7C3AED',
  community: '#10B981',
  community_demand: '#10B981',
  other: '#64748B',
} as const;

/** Route-line palette from the approved journey mockups; independent of map-layer identity colors. */
export const journeySegmentColors: Partial<Record<keyof typeof transportColors, string>> = {
  bus: '#1687FF',
  marshrutka: '#F2A817',
  trolleybus: '#13A66F',
  tram: '#8B3CE6',
  metro: '#7048E8',
  train: '#8B4CE0',
  suburban_train: '#8B4CE0',
  walk: '#8792A4',
  carpool: '#E83082',
  taxi: '#F2A817',
  bike: '#13A6B8',
  scooter: '#14A66F',
  carsharing: '#13A66F',
  transfer: '#1687FF',
  ferry: '#1687FF',
  water: '#1687FF',
  community: '#E83082',
  community_demand: '#E83082',
};

export type TransportVisualMode = keyof typeof transportColors;

export function normalizeTransportVisualMode(mode: string): TransportVisualMode {
  const normalized = mode.trim().toLocaleLowerCase('uk-UA');
  if (normalized === 'minibus') return 'marshrutka';
  if (normalized === 'rail') return 'train';
  if (normalized === 'walking' || normalized === 'foot') return 'walk';
  if (Object.hasOwn(transportColors, normalized)) return normalized as TransportVisualMode;
  return 'other';
}

export function transportColor(mode: string): string {
  return transportColors[normalizeTransportVisualMode(mode)];
}

export function journeySegmentColor(mode: string): string {
  const normalized = normalizeTransportVisualMode(mode);
  return journeySegmentColors[normalized] ?? transportColors[normalized];
}
