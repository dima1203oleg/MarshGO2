import { defineConfig, devices } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const databaseUrl = process.env.E2E_DATABASE_URL ?? 'postgres://marshgo:local_only_change_me@127.0.0.1:5434/marshgo_e2e';
const apiPort = process.env.E2E_API_PORT ?? '3302';
const e2eRunId = randomUUID();

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 180_000,
  reporter: [['list']],
  use: {
    ...devices['iPhone 16'],
    browserName: 'chromium',
    timezoneId: 'Europe/Kyiv',
    baseURL: 'https://a602584pesfa.shares.zrok.io',
    trace: process.env.E2E_CAPTURE_TRACE === '1' ? 'on' : 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node tests/fixtures/map-tile-server.mjs',
      url: 'http://127.0.0.1:3306/health',
      reuseExistingServer: false,
      timeout: 10_000,
      env: { MAP_TILE_STUB_PORT: '3306' },
    },
    {
      command: 'node tests/fixtures/geocoder-stub.mjs',
      url: 'http://127.0.0.1:3304/health',
      reuseExistingServer: false,
      timeout: 10_000,
      env: { GEOCODER_STUB_PORT: '3304' },
    },
    {
      command: 'node tests/fixtures/osrm-stub.mjs',
      url: 'http://127.0.0.1:3305/health',
      reuseExistingServer: false,
      timeout: 10_000,
      env: { OSRM_STUB_PORT: '3305' },
    },
    {
      command: 'node scripts/run-e2e-server.mjs',
      url: `http://127.0.0.1:${apiPort}/healthz`,
      reuseExistingServer: false,
      timeout: 30_000,
      env: {
        ...(process.env.E2E_SERVER_DIR ? { E2E_SERVER_DIR: process.env.E2E_SERVER_DIR } : {}),
        ...(process.env.E2E_SERVER_PINNED_SHA ? { E2E_SERVER_PINNED_SHA: process.env.E2E_SERVER_PINNED_SHA } : {}),
        NODE_ENV: 'development',
        DATABASE_URL: databaseUrl,
        API_HOST: '127.0.0.1',
        API_PORT: apiPort,
        // The E2E web proxy is the only trusted hop, allowing isolated tests
        // to use per-account RFC 5737 source IPs without changing production.
        TRUST_PROXY_HOPS: '1',
        REDIS_URL: process.env.REDIS_URL ?? 'redis://127.0.0.1:6380',
        API_RATE_LIMIT_PREFIX: `marshgo:e2e:${e2eRunId}:`,
        API_RATE_LIMIT_LIMIT: '5000',
        // Development E2E creates many accounts from one loopback IP. Raise
        // only this test server's cap; production keeps the default 20/hour.
        // The complete sequential E2E suite signs into many isolated test users.
        // Keep production defaults untouched while preventing an artificial
        // loopback-IP cap from stopping later scenarios in the same run.
        AUTH_DEV_OTP_NETWORK_LIMIT: '100',
        // Browser E2E must be deterministic and must not fetch public GTFS zip
        // files. Provider reachability and live feed parsing are covered by
        // their dedicated local integration/probe checks.
        MOBILITY_ROUTING_FEEDS_DISABLED: 'true',
        // Keep polling and provider health probes out of browser E2E. These
        // tests use isolated fixtures and must not compete with auth/search
        // requests for database connections or hit external providers.
        TRANSIT_REALTIME_DISABLED: 'true',
        MOBILITY_HEALTH_DISABLED: 'true',
        SESSION_SECRET: process.env.E2E_SESSION_SECRET ?? `test-only-marshgo-e2e-${e2eRunId}-session-secret`,
        AUTH_DEV_OTP: 'true',
        GEOCODING_ENGINE_URL: 'http://127.0.0.1:3304/search',
        OSRM_URL: 'http://127.0.0.1:3305/route/v1/driving',
        ROUTING_ENGINE_URL: 'http://127.0.0.1:3305/route/v1/driving',
        CORS_ORIGINS: 'http://127.0.0.1:3300',
      },
    },
    {
      command: 'node tests/fixtures/e2e-web-server.mjs',
      url: 'http://127.0.0.1:3300',
      reuseExistingServer: false,
      timeout: 30_000,
      env: { E2E_API_PORT: apiPort },
    },
  ],
});
