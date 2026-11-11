# Production button audit — environment blocker — 2026-10-26

## Attempt

- Requested Playwright audit: `e2e/button-audit.spec.ts` using `playwright.functional.config.ts`, covering the configured signed-in production routes and visible controls.
- Ran only against the script-enforced loopback database name `marshgo_e2e` on the host-local PostgreSQL 14 instance (`127.0.0.1:5432`). The isolated database was created; no production or shared application database was used.
- Release tuple materialized exactly: Server `4ed81b47e45520475470b699deac115fb0000b69`, Site `d6c9a957a5f767a491daed2ffb5e70bb8ed8b559`.

## Result

- The E2E runner stopped before Playwright at database migration: local PostgreSQL 14 has no installed PostGIS control file (`postgis.control`). Therefore no button/page assertion ran; this is NOT_TESTED, not a product pass or fail.
- The isolated fixture database has no migrated application schema and only the test setup attempted to create it. No containers, volumes, databases or files were deleted. Docker CLI `ps` hung and was interrupted; no Docker mutation was made.
- The earlier zrok browser tab returned a bad gateway. The local `/map` tab showed the phone-login screen; authenticated navigation was not available in the browser snapshot.
- Root `npm run check:production` completed with exit code 0 after the E2E attempt: TypeScript, ESLint, root unit suite, Vite production build, and JavaScript gzip bundle budget all passed. This does not substitute for the blocked browser acceptance.

## Next action

- Restore an isolated supported PostGIS + Redis test fixture (Docker daemon or compatible local extensions/services), rerun the full button audit and visual route suites, inspect generated screenshots, and record per-route results. Until then, production UI acceptance remains NOT_TESTED.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
