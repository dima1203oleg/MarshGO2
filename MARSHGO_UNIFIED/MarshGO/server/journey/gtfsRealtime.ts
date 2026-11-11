export interface GtfsRealtimeTripUpdate {
  tripId: string;
  routeId: string;
  stopTimeUpdates: Array<{ stopId: string; arrival?: number; departure?: number }>;
}

export const cachedGtfsRealtimeTripUpdates = new Map<string, GtfsRealtimeTripUpdate[]>();
