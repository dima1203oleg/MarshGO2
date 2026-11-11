# Routing engine and Lviv GTFS acceptance checkpoint — 2026-10-25

## Exact source and GitHub state

- Server checkout: `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `feature/transport-layer-availability`, HEAD/origin HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`.
- The checkout has extensive pre-existing modified and untracked source/test files. No reset, cleanup, broad staging, commit, push, or merge was performed. PR #7 is OPEN/DRAFT, mergeable, based on PR #3 branch `codex/sync-mobility-registry`. Exact committed-head CI run `38827477340` succeeded; that CI does not include the dirty worktree changes tested below.

## Local verification

- Current dirty Server source: `npm run typecheck` PASS; `npm run lint` PASS; complete unit suite **224 PASS / 0 FAIL / 1 opt-in database SKIP**.
- Focused GTFS timetable, strategy scoring, transfer feasibility and worker-core tests: **59/59 PASS**.
- Complete isolated loopback integration workflow passed after correcting a test's provider-health predicate to match API eligibility (`enabled` and `healthy` or `degraded`): migrations and Journey schema 2/2; live-journey API 1/1; booking/editing suites 21/21; navigation 2/2; cross-instance Redis realtime 1/1; process-restart durability 1/1; shared rate-limit 1/1. Test database is the local `marshgo_e2e`; API ports were 43016–43018 and have stopped.
- The integration journey-mode matrix read the registered Lviv GTFS and returned six bus itineraries for the requested OD. The multi-select search produced real bus+tram and bus chains; no direct carpool leaked into the transit-only response. Unsupported categories were reported blocked. These are local API integration results, not staging.
- A separate direct GTFS replay against the registered Lviv provider loaded 72 routes, 1,071 stops, 15,716 trips and 426,685 stop-time rows. It returned 100 candidate journeys across 50 route-chain patterns in 1,346 ms. All 329 rendered segment geometries had valid endpoints and all stop times were ordered. No candidate had a known fare. `searchTruncated=true` and `resultLimitReached=true`; this is explicit evidence of useful output, not complete search.
- `git diff --check` PASS. The route replay used a loopback DB URL read from the local root env file; credentials were not printed or added to logs/docs.

## Test correction

The integration test previously checked only `health='healthy'` when deciding whether the Lviv GTFS provider could produce transit results. Production search accepts enabled `healthy` and `degraded` feeds, so the test failed despite a valid degraded provider. It now measures the same eligibility predicate. No routing eligibility was loosened or altered by this test-only correction.

## Next routing action

Keep `searchTruncated` visible. Continue dense-feed work from the exhaustive small-feed feasible-set oracle: capture repeated current-candidate outputs for the frozen Lviv OD set, compare route-chain recall and all three strategy winners, then prototype a bounded candidate-retention change only if it preserves the oracle and improves useful recall within latency/memory limits. Do not push the dirty checkout or promote it into the release manifest. Overall release stays `NOT_RELEASED`; no staging or production run occurred.
