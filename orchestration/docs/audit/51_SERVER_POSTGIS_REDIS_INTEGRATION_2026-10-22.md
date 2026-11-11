# Server exact-candidate integration checkpoint — 2026-10-22

- Repository/branch: MarshGO-Server `codex/gtfs-route-oracle-20261021`.
- Exact HEAD: `27ca486d66fa9b30b8559e4b1041ccca67f1d283`.
- Runtime: Node 24.21.0.
- Worktree: clean before/after test.
- Command: `npm run test:integration`.

## Result

**30 passed, 0 failed, 0 skipped.** Suites: Journey schema/PostGIS (2), live-journey API (1), booking/trip-editing and concurrency (21), Partner tenant isolation (1), navigation (2), Redis-backed realtime across two API instances (1), booking persistence across API process restart (1), shared Redis rate limit (1).

The integration script checks that PostgreSQL is loopback and the database is prefixed `marshgo_e2e`; target was `marshgo_e2e`. It applied migrations and created test data in that isolated DB. Providers were deterministic fixtures. No deployed/staging provider, real SMS, external payment, live operator inventory, or physical iPhone was exercised.

After completion the API/OSRM test processes had exited. Only the local root Compose PostGIS and Redis services used for the tests were stopped; named volumes were preserved. Both `docker compose ps` and `docker ps` were empty afterward.

## Release relevance

This strengthens exact Server API/DB/Redis evidence for booking, navigation, tenant isolation and restart durability. It does not clear dense Lviv search truncation, strict screenshot review, staging, external credentials, backup/restore, rollback, physical-device or production deployment gates. Keep release `NOT_RELEASED`.
