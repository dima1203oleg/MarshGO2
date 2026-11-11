export interface WalkingRoutedItinerary {
  path: Array<[number, number]>;
  meters: number;
  durationSeconds: number;
}

export function applyRoutedWalkingPaths(_options: unknown): WalkingRoutedItinerary[] {
  return [];
}

export function createWalkingRouteBudget(_options: unknown): number {
  return 0;
}

export function routePedestrianPath(_options: unknown): WalkingRoutedItinerary | undefined {
  return undefined;
}
