# GTFS direction-aware candidate sampling — 2026-10-26

## Change

- Canonical Server checkout: `MarshGO-Server`, branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; shared dirty worktree preserved.
- The timetable parser already retained `trips.direction_id`, but itinerary-segment construction dropped it before route-chain sampling. Carry that optional GTFS direction onto each direct journey and include direction changes in the route-chain sampling key.
- The cap remains eight candidates per route-chain key. This prevents two published directions of one GTFS `route_id` from consuming the same sample allowance. Feasibility, transfers, ranking weights, result/step caps, and response limit are unchanged.
- Added a regression with 18 trips on one route across two direction IDs. The result keeps an eight-item sample for each direction and continues to flag omitted candidates as truncation.

## Verification

- Supported runtime: Node `v24.22.1`.
- GTFS timetable tests: **43/43 PASS**.
- Full Server unit suite: **237 PASS, 0 FAIL, 1 opt-in integration SKIP**.
- Server `tsc --noEmit` and ESLint on changed source/test files: PASS.
- `git diff --check`: PASS.
- Frozen Lviv feed SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` (72 routes, 1,071 stops, 15,716 trips), three repeated searches per OD. Each OD had a stable ordered-result hash across all three repeats. The three prior immediate-baseline winners (FASTEST/CHEAPEST/BALANCED) remained identical.

| O/D | Returned | Unique trip chains | Unique route chains (route-ID metric) | Median elapsed | Truncated |
|---|---:|---:|---:|---:|---|
| Малий Голоско → Сихів | 100 | 77 | 64 | 1,926 ms | yes |
| Наукова → Сихів | 100 | 59 | 43 | 846 ms | yes |
| площа Ринок → Дубляни | 100 | 63 | 45 | 1,683 ms | yes |

The immediate baseline was one sample per O/D, so it is not a paired performance comparison. Its route-ID chain counts were 65/43/46 and trip-chain counts 77/57/57. Candidate timing varied by OD; no performance gain is claimed. Results remain truncated for all three O/Ds. Direction-aware sampling is a targeted semantics fix, not a dense-feed completeness solution.

## Limits and next work

- This change does not prove exhaustive search, solve endpoint-stop truncation, or remove candidate-pool/search-budget losses.
- Frozen-feed repetition confirms determinism and winner preservation for these requests only; it is not live-provider, staging, production, or load evidence.
- A subsequent debug-only profile (one search per OD, same archive/runtime) located the remaining cost: stop selection 11–14 ms, corridor selection 186–218 ms, direct-segment construction 657–962 ms, total through reverse reachability 937–1,720 ms, and complete search 1,177–2,285 ms. It built 194,355–415,180 segment objects, then made 35,203–50,000 search steps and retained 1,873–2,500 candidate results. All three still reported stop-selection, search-budget, and candidate-sampling loss; the third also hit the global step limit. Full counters are in the command output from this checkpoint; do not interpret one profile as an SLA.
- The shared Server tree remains dirty and uncommitted. No merge, push, release-manifest promotion, or deployment occurred. `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
- Next: reduce direct-segment object materialization and repeated reverse-reachability transfer-pool construction without losing any oracle-feasible path. Prove parity on exhaustive small-feed oracles, then run paired frozen-feed candidate recall, winner, latency, and RSS comparisons.

## Follow-up — reverse-reachability allocation reduction — 2026-10-26

- Replaced reverse-reachability's full transfer-pool construction/sort with a callback over the same candidate superset. Reachability exits after finding two distinct viable onward routes; DFS still materializes, deduplicates and sorts the complete cached pool as before. Candidate ordering and ranking logic are unchanged.
- Focused GTFS/completeness suite: 46/46 PASS; full Server suite on bundled Node **24.22.1**: 237 PASS, 0 FAIL, 1 opt-in integration SKIP; `tsc --noEmit`, changed-file ESLint, and `git diff --check`: PASS. The isolated loopback PostGIS/Redis integration script was rerun on the same dirty source and passed **29/29** across Journey schema, live journey, booking/concurrency/edit/cancel, navigation, multi-instance realtime, restart durability, and shared rate limiting. Temporary API/OSRM processes exited; existing Postgres and Redis containers remained healthy.
- Repeated three times on the same frozen archive SHA and Node 24.22.1. Each O/D retained the same ordered result hash in all repeats and returned the same 100 journeys, trip-chain/route-chain counts, and strategy winners as the direction-aware baseline. Median elapsed times were: Holosko→Sykhiv 1,548 ms; Naukova→Sykhiv 1,052 ms; Rynok→Dubliany 1,336 ms. Compared with the prior unpaired medians (1,926 / 846 / 1,683 ms), two O/Ds were lower and one higher. These are noisy, unpaired samples; no general performance gain is claimed.
- The supported-runtime debug replay still reaches 194k–415k materialized segments and 35k–50k search steps. Every O/D remains `searchTruncated=true` and `resultLimitReached=true`; stop selection, candidate-pool/sampling and/or step budget still limit completeness. This optimization does not make dense-feed routing complete or production-ready.
- Worktree remains pre-existing dirty and uncommitted. No merge, push, manifest promotion, or deployment. `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
- Next: prototype a query-directed/label-setting search against exhaustive small-feed identity and all-strategy winner oracles; only then run paired frozen-feed recall, truncation, latency and RSS evaluation. Do not increase caps or suppress incompleteness.
