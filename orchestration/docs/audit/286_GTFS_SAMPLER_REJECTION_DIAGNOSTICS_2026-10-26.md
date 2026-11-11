# GTFS sampler rejection diagnostics and route-chain cap A/B — 2026-10-26

## Exact source state

- Server checkout: branch `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`.
- Frozen Lviv feed: `/tmp/marshgo-lviv-gtfs-current-20261025.zip`, SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Runtime: Node `v25.4.0`, not the pinned `24.21.0`; times are diagnostic only.
- Preserve the extensive dirty Server tree. The experiment modified only `MAX_RESULTS_PER_ROUTE_CHAIN` temporarily and restored it to 8 before checkpointing.

## Debug-only instrumentation

Added `candidateSamplingEventsByReason` under `MARSHGO_GTFS_SEARCH_DEBUG=1`, distinguishing:

- `candidatePoolFull`
- `tripChainCap`
- `routeChainCap`
- `globalCandidateCap`
- `sampleReplacement`

The counters do not alter candidate selection. Targeted tests passed **2/2** for the diagnostics contract and a controlled global-pool saturation fixture. `npm run typecheck` passed. `git diff --check` passed for the touched Server source and tests. After restoring cap 8, the full GTFS timetable + search-completeness suite passed **81/81, 0 skipped** (28.6 s).

## Frozen-feed replay (Holosko → Sykhiv)

### Baseline route-chain cap = 8

- Ordered result hash `53b9c9edbe7bad93e6300a5705f15ba5428b5bdf537d7ffb21de990c836429b6`.
- 63 unique trip chains / 45 unique route chains; FASTEST/CHEAPEST/BALANCED winner IDs match the audit 282 baseline.
- 2,208 ms observed runtime; peak reported heap during current diagnostics about 275 MB, RSS samples varied (diagnostic only).
- Estimated graph demand 415,997; exactly 100,000 segments built; graph cap binding and `segmentGraphTruncated=true`.
- 109,242 search steps, 411 first legs, 1,611 candidate results, max pending queue 3,635 / cap 10,000. `searchStepLimitReached=false`, but `searchBudgetTruncated=true`, `candidateSamplingTruncated=true`, and overall `searchTruncated=true`.
- Sampler events: `candidatePoolFull=3,288`, `tripChainCap=12,724`, `routeChainCap=22,883`, `globalCandidateCap=0`, `sampleReplacement=3,029`.

### Temporary route-chain cap = 16

- Ordered result hash `b88826e686aed188ebcec3f4684d539c8ec45dc5db148eb34203d19bbf390209`.
- 50 trip chains / 34 route chains, down from 63 / 45. FASTEST/CHEAPEST/BALANCED winner IDs did not change.
- 2,247 ms; peak reported heap during the search about 477 MB. Single-run diagnostics only.
- Still exactly 100,000 graph segments and `searchTruncated=true`; no truncation cause was removed.
- Sampler events: `candidatePoolFull=8,899`, `tripChainCap=11,150`, `routeChainCap=4,553`, `globalCandidateCap=0`, `sampleReplacement=2,436`.

**Decision: reject cap 16 and restore 8.** Widening the route-chain variant cap reduced route and trip-chain diversity, increased heap use, retained the same three winners, and did not eliminate any truncation. Do not repeat this direct cap increase.

## Interpretation and limits

- The dense query has multiple simultaneous constraints: graph construction reaches 100k/100k; candidate sampling rejects many path variants; search budgeting stops before the million-step ceiling while the queue itself remains below its 10k maximum.
- Event counts identify which sampler branches fire, but they do not prove that every rejected candidate was inferior or identify which specific omitted chains would be globally useful. The current results remain incomplete and rank winners are only the winners of the retained sample.
- This was one O/D, one run per cap, Node 25.4.0. It is not a supported-runtime benchmark, repeated A/B, load test, staging test, or production evidence.
- No live feed, external provider, database, staging, or production system was contacted.

## Next exact action

Use the measured rejection categories to design an offline candidate-sampler oracle that preserves more route-chain diversity under the same graph/search caps. First compare exact candidate identities and FASTEST/CHEAPEST/BALANCED winners on exhaustive small feeds; then run paired three-O/D frozen-feed replay on pinned Node 24.21.0, measuring route/trip-chain recall, winners, all truncation causes, latency and RSS. Do not increase caps or change serving behavior until that comparison establishes a real improvement. Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
