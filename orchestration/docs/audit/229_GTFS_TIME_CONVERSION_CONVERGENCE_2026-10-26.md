# Audit 229 — GTFS time conversion convergence fast path — 2026-10-26

## Change

- Server: `MarshGO-Server`, branch `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; the pre-existing dirty worktree was preserved.
- `localServiceTimeToUtc` now stops its existing offset-correction loop only when the formatted local timestamp exactly equals the target. A non-converged or daylight-saving edge case still follows the remaining correction iterations and the same local-date validation.
- This avoids redundant `Intl.DateTimeFormat.formatToParts` calls in the common converged case without changing its chosen UTC instant.

## Verification

- Node `v24.22.1`: GTFS timetable suite **45/45 PASS**, including service-date rollover, multiple GTFS timezones, and exhaustive one- and two-transfer path/ranking oracles.
- Full Server unit suite: **240 PASS / 0 FAIL / 1 opt-in integration SKIP** (241 tests total).
- Server `tsc --noEmit`: PASS; changed-file ESLint: PASS.
- Guarded loopback `test:integration`: Journey schema 2/2, live journey 1/1, booking/edit/cancel 21/21, navigation 2/2, cross-instance Redis realtime 1/1, restart durability 1/1, shared rate limit 1/1 (**29/29**).
- Frozen Lviv GTFS archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` (72 routes, 1,071 stops, 15,716 trips). Three repeated O/D searches retained identical ordered result hashes, FASTEST/CHEAPEST/BALANCED winners, and trip/route-chain counts versus a temporary no-fast-path copy. All three remain truncated.
- A sampled CPU profile attributed about 536 ms across nine frozen-feed searches to `localServiceTimeToUtc`; timing replays before and after were mixed by O/D. No general latency gain is claimed.

## Limits and next action

- This only removes redundant timezone formatting after convergence. It does not address the dominant bounded-search omissions: endpoint selection, search-step/depth budgets, candidate pool and route-chain sampling, and segment-span truncation.
- Next: prototype a query-directed, bounded transit-segment representation that avoids materializing hundreds of thousands of full segment objects. Require exact small-feed oracle paths and all strategy winners, then compare repeated frozen-feed route/trip-chain recall, latency and peak RSS. Preserve explicit truncation; do not raise caps as a substitute for the algorithm.
- No commit, push, merge, staging or production deployment. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
