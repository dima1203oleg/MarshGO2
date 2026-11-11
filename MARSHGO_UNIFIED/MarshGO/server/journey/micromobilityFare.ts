export function micromobilityJourneyFareMinor(distanceMeters: number, durationSeconds: number): number {
  return Math.ceil(distanceMeters * 0.5 + durationSeconds * 0.1);
}
