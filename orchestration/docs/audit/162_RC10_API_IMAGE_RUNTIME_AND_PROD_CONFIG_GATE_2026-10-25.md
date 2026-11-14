# RC10 API image runtime and production configuration gate — 2026-10-25

## Candidate

- Server API image: `marshgo/api:RC-2026-10-25-review.10`, built from exact Server `38f17b88f98c8530f8090cfc6745cd334c87e53c` (linux/arm64); local image digest is recorded in `RELEASE_MANIFEST.json`.
- Test dependencies: existing local Postgres/PostGIS and Redis containers; API used the isolated `marshgo_e2e_rc10` database and a per-run Redis key prefix.
- Runtime bound to loopback port 3388. Temporary API container was stopped and auto-removed; no volume or production service was touched.

## Results

- Development-mode exact image runtime: `/healthz` **HTTP 200**; `/readyz` **HTTP 200**, database `connected`, realtime `connected`.
- Production-mode launch was **BLOCKED by validation**, as designed: after supplying only a synthetic HTTPS CORS origin, the process refused to start because `SMS_PROVIDER=twilio` and actual Twilio account credentials/number are required. Production configuration also requires approved public HTTPS geocoding, reverse-geocoding, routing and map style/data manifest endpoints; no such credentials/configuration was fabricated.
- No SMS, map, geocoder or routing provider was called. No development bypass was applied to production mode.

## Status

This proves that the immutable API image can connect to local Postgres/Redis in a development smoke; it does not prove production-mode readiness. Actual Twilio credentials and approved HTTPS service endpoints are external release blockers. Continue independent work while keeping `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.
