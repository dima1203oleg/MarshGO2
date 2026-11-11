import { locationFixSchema, type LocationFix } from '../../shared/navigation/contracts';
import { distanceMeters } from '../../shared/navigation/geometry';

export type LocationOptions = { enableHighAccuracy?: boolean; maximumAgeMs?: number; timeoutMs?: number };
export type LocationProviderStatus = 'IDLE' | 'ACTIVE' | 'UNAVAILABLE' | 'PERMISSION_DENIED';
export interface LocationProvider {
  start(options?: LocationOptions): Promise<void>;
  stop(): Promise<void>;
  subscribe(listener: (fix: LocationFix) => void): () => void;
  status(): LocationProviderStatus;
}

/** Normalize optional browser GPS fields before validating a position. Some
 * WebKit builds expose unavailable heading/speed/altitude values as NaN. */
export function parseGeolocationPosition(position: GeolocationPosition) {
  const finiteOptional = (value: number | null) => typeof value === 'number' && Number.isFinite(value) ? value : undefined;
  const heading = finiteOptional(position.coords.heading);
  const speed = finiteOptional(position.coords.speed);
  const altitude = finiteOptional(position.coords.altitude);
  const altitudeAccuracy = finiteOptional(position.coords.altitudeAccuracy);
  // WebKit's geolocation bridge may report Unix microseconds while the web
  // Geolocation API and JavaScript Date use milliseconds.
  const timestampMilliseconds = Number.isFinite(position.timestamp)
    ? Math.abs(position.timestamp) >= 100_000_000_000_000 ? position.timestamp / 1000 : position.timestamp
    : null;
  return locationFixSchema.safeParse({
    longitude: position.coords.longitude,
    latitude: position.coords.latitude,
    accuracyMeters: position.coords.accuracy,
    ...(altitude === undefined ? {} : { altitudeMeters: altitude }),
    ...(altitudeAccuracy === undefined || altitudeAccuracy < 0 ? {} : { altitudeAccuracyMeters: altitudeAccuracy }),
    ...(heading === undefined || heading < 0 || heading > 360 ? {} : { headingDegrees: heading }),
    ...(speed === undefined || speed < 0 ? {} : { speedMps: speed }),
    capturedAtClient: timestampMilliseconds === null ? 'invalid-timestamp' : new Date(timestampMilliseconds).toISOString(),
    source: 'gps',
  });
}

/** Foreground Web Geolocation adapter, also used by Capacitor WKWebView. */
export class WebGeolocationProvider implements LocationProvider {
  private watchId: number | null = null;
  private state: LocationProviderStatus = 'IDLE';
  private listeners = new Set<(fix: LocationFix) => void>();
  async start(options: LocationOptions = {}) {
    if (!('geolocation' in navigator)) { this.state = 'UNAVAILABLE'; throw new Error('GPS_UNAVAILABLE'); }
    if (this.watchId !== null) return;
    this.state = 'ACTIVE';
    this.watchId = navigator.geolocation.watchPosition((position) => {
      const parsed = this.toFix(position);
      if (parsed.success) for (const listener of this.listeners) listener(parsed.data);
    }, (error) => { this.state = error.code === error.PERMISSION_DENIED ? 'PERMISSION_DENIED' : 'UNAVAILABLE'; }, {
      enableHighAccuracy: options.enableHighAccuracy ?? true, maximumAge: options.maximumAgeMs ?? 5000, timeout: options.timeoutMs ?? 20000,
    });
  }
  getCurrentFix(options: LocationOptions = {}): Promise<LocationFix> {
    if (!('geolocation' in navigator)) return Promise.reject(new Error('GPS_UNAVAILABLE'));
    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition((position) => {
      const parsed = this.toFix(position);
      if (parsed.success) resolve(parsed.data); else reject(new Error('GPS_INVALID_FIX'));
    }, (error) => reject(new Error(error.code === error.PERMISSION_DENIED ? 'GPS_PERMISSION_DENIED' : 'GPS_UNAVAILABLE')), {
      enableHighAccuracy: options.enableHighAccuracy ?? true, maximumAge: options.maximumAgeMs ?? 0, timeout: options.timeoutMs ?? 25000,
    }));
  }
  private toFix(position: GeolocationPosition) {
    return parseGeolocationPosition(position);
  }
  async stop() { if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId); this.watchId = null; this.state = 'IDLE'; }
  subscribe(listener: (fix: LocationFix) => void) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  status() { return this.state; }
}

export type LocationPipelineResult = { accepted: true; fix: LocationFix } | { accepted: false; code: 'GPS_LOW_ACCURACY' | 'GPS_STALE' | 'GPS_INVALID_FIX' | 'GPS_TELEPORT_DETECTED' };
/** Stateless validation primitive; caller supplies authoritative time for deterministic replay. */
export function validateLocationFix(fix: LocationFix, nowMs: number, previous?: LocationFix): LocationPipelineResult {
  const parsed = locationFixSchema.safeParse(fix);
  if (!parsed.success) return { accepted: false, code: 'GPS_INVALID_FIX' };
  if (fix.accuracyMeters > 100) return { accepted: false, code: 'GPS_LOW_ACCURACY' };
  const ageMs = nowMs - Date.parse(fix.capturedAtClient);
  if (!Number.isFinite(ageMs) || ageMs < -120_000 || ageMs > 60_000) return { accepted: false, code: 'GPS_STALE' };
  if (previous) {
    const elapsed = (Date.parse(fix.capturedAtClient) - Date.parse(previous.capturedAtClient)) / 1000;
    if (elapsed <= 0) return { accepted: false, code: 'GPS_STALE' };
    const distance = distanceMeters([previous.longitude, previous.latitude], [fix.longitude, fix.latitude]);
    const maxSpeed = Math.max(fix.speedMps ?? 0, previous.speedMps ?? 0, 55);
    if (distance > maxSpeed * elapsed + fix.accuracyMeters + previous.accuracyMeters) return { accepted: false, code: 'GPS_TELEPORT_DETECTED' };
  }
  return { accepted: true, fix: parsed.data };
}
