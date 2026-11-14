# GTFS event projection alignment — 2026-10-23

## Scope

Server candidate branch `codex/gtfs-lazy-event-search-20261023`, based on the open GTFS candidate PR branch `codex/gtfs-candidate-diversity-750-20261022`.

## Change

The query-specific graph-demand pass previously resolved service-date eligibility and realtime stop times independently from graph materialization. It now calls the shared `eligibleTripInstanceStopEvents()` projection used by graph materialization. Both passes consequently share the same handling for active service dates, canceled/deleted trips, stop-vector alignment, realtime arrival/departure overlays, skipped stops, and pickup/drop-off restrictions.

The graph budgets, 100,000-segment cap, sampling policy, and search limits are unchanged. This change does not claim to solve dense-feed truncation.

## Exact revision and checks

- Server SHA: `927226d9e7c06efd24d9ed63f731d144fd810d15`.
- PR: [MarshGO-Server #30](https://github.com/dima1203oleg/MarshGO-Server/pull/30), open draft, targeting the GTFS candidate branch; not merged or deployed.
- `npm test`: 299 passed, 0 failed, 3 opt-in integration tests skipped.
- `npx tsx --test tests/gtfs-timetable.test.ts`: 66 passed, 0 failed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- Frozen-feed replay digest: `698e0e7538b5f0b9c0645ffdffd75be039ef921a2ebb79feb928237b29b6dd6f`; 100 itineraries; `searchTruncated=true`, `candidateGraphTruncated=true`. A diagnostic run took 1,980 ms and peaked at ~714 MB RSS under Node 25.4.0. It is a single diagnostic run, not a pinned-runtime performance result.
- `npm ci`: audit reported 0 vulnerabilities. The local runtime is Node 25.4.0; package engine requests Node 24.21.0.
- Hosted Server CI for final exact SHA: run `39869223686`, **SUCCESS**. Dependency audit, lint, typecheck, unit tests, DB migration, PostGIS/Redis integration suite, production API image build, and API image smoke with PostGIS+Redis all passed. Earlier run `39868863215` was for the previous head `08413d9`.

## Remaining gates

- Frozen Lviv search still has a known candidate-graph/search truncation blocker; the cap was deliberately not raised.
- Staging origin, HTTPS smoke, real commercial transport integrations, physical-iPhone GPS/APNs/background checks, backup/restore/rollback, and production deployment remain blocked or untested.
- Overall release status remains `NOT_RELEASED`.

## Next action

Wait for hosted CI `39869223686`; then continue the query-directed GTFS search work with exhaustive tiny-feed oracles and frozen-Lviv recall/resource comparisons. Do not merge to `main` or deploy as part of this checkpoint.
