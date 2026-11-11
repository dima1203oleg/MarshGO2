export type GtfsWorkerMetroSources = string[];
export type GtfsWorkerGroup = string;

export interface GtfsStopArrival {
  stopId: string;
  routeId: string;
  routeName: string;
  headsign: string;
  transportType: string;
  tripId: string;
  scheduledArrivalAt: Date;
  predictedArrivalAt: Date;
  source: string;
  confidence: string;
  realtimeUpdatedAt?: Date;
  etaSeconds: number;
}

export interface GtfsStopArrivalsResult {
  arrivals: GtfsStopArrival[];
  stopKnown: boolean;
  scheduleUpdatedAt: Date;
  realtimeStatus: string;
  realtimeUpdatedAt?: Date;
  realtimeFeedTimestamp?: Date;
}

export const gtfsSearchWorker = {
  stopArrivals: async (_options: unknown): Promise<GtfsStopArrivalsResult> => {
    return { arrivals: [], stopKnown: false, scheduleUpdatedAt: new Date(), realtimeStatus: 'NOT_CONFIGURED' };
  },
};

export function gtfsSearchWorkerFn(_options: unknown): Promise<unknown> {
  return Promise.resolve({});
}
