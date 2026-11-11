export interface LiveJourneySegment {
  id: string;
  status: string;
  updatedAt: Date;
}

export function buildLiveJourneySegment(_options: unknown): LiveJourneySegment {
  return { id: '', status: 'unknown', updatedAt: new Date() };
}
