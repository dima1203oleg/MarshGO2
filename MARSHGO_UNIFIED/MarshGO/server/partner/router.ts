import { Router, type RequestHandler } from 'express';

export type PartnerRouterDeps = {
  pool: unknown;
  requireAuth: RequestHandler;
  requireAdmin: RequestHandler;
  ApiError: unknown;
};

export function createPartnerPlatformRouter(_deps: PartnerRouterDeps): Router {
  const router = Router();
  router.get('/health', (_req, res) => res.json({ status: 'ok' }));
  return router;
}

export type KiwitaxiStatus = { status: string; providerId: string; message: string | null } | null;

export function buildKiwitaxiAffiliateUrl(url: string): string {
  return url;
}

export function intuiTravelStatus(): KiwitaxiStatus {
  return null;
}

export function kiwitaxiStatus(): KiwitaxiStatus {
  return null;
}
