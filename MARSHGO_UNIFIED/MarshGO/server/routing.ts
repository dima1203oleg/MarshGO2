import crypto from 'node:crypto';

export { RoutingUnavailableError } from './routing/providers/osrmTransport';
export type { RoadRoute, RoadRouteLeg, RoadRouteManeuver } from './routing/providers/osrmTransport';
export type { RoutingProvider, RouteRequest, RouteResult, ProviderHealth } from './routing/RoutingProvider';
export { OsrmRoutingProvider } from './routing/providers/OsrmRoutingProvider';
export { routingMetricsPrometheus } from './routing/osrmGateway';

export interface RouteCalculationInput {
  requestId: string;
  origin: [number, number];
  destination: [number, number];
  waypoints?: [number, number][];
  profile: { mode: string };
}

export async function calculateCanonicalRoute(input: RouteCalculationInput): Promise<{ geometry: [number, number][]; distanceMeters: number; durationSeconds: number; maneuvers?: unknown[] }> {
  const provider = new OsrmRoutingProvider(process.env.ROUTING_ENGINE_URL);
  const result = await provider.route(input);
  return { geometry: result.geometry.value as [number, number][], distanceMeters: result.distanceMeters, durationSeconds: result.durationSeconds, maneuvers: result.maneuvers };
}

export async function getRoadRoute(origin: [number, number], destination: [number, number]): Promise<{ geometry: [number, number][]; distanceMeters: number; durationSeconds: number }> {
  return calculateCanonicalRoute({ requestId: crypto.randomUUID(), origin, destination, profile: { mode: 'CAR' } });
}

export async function getRoadRouteThroughPoints(points: [number, number][]): Promise<{ geometry: [number, number][]; distanceMeters: number; durationSeconds: number }> {
  return calculateCanonicalRoute({ requestId: crypto.randomUUID(), origin: points[0], destination: points[points.length - 1], waypoints: points.slice(1, -1), profile: { mode: 'CAR' } });
}

export async function getWalkingRoute(origin: [number, number], destination: [number, number]): Promise<{ geometry: [number, number][]; distanceMeters: number; durationSeconds: number }> {
  return getRoadRoute(origin, destination);
}
