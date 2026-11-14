# Server dirty-worktree GTFS replay and verification — 2026-10-25

## Scope and exact source

- Repository: `MarshGO-Server`, branch `feature/transport-layer-availability`.
- Committed HEAD: `92a26a3f617f32d644a66c0af46cba096ccb0ce0`.
- Working tree: 37 modified/untracked paths; dirty timetable source SHA-256 `9486b5f3f4e693acaa8e389bc105f081109b6e01af62f16f7f7502574794a1fe`.
- Compared with exact `HEAD:server/journey/gtfsTimetable.ts`, materialized as `.tmp-gtfsTimetable-head.ts` (SHA-256 `1bdacbb6356805b463faa06338143bb1923458ba3ba485eea37203a4c6196a0b`). Other imported dependencies were shared, isolating the timetable-file delta.
- Runtime: Node `v25.4.0`, while the repo pins Node `24.21.0`. Treat timing as exploratory until rerun under the pinned runtime.
- Feed: frozen Lviv GTFS archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; 72 routes, 1,071 stops, 15,716 trips. Three ODs, 30-minute departure window, six-hour horizon, two transfers, 900/1000/400 m access/egress/transfer bounds, 180 s transfer buffer, 100 results. Three repeated searches per OD.

## Paired replay

| OD | HEAD median ms | Dirty median ms | Trip / route chains (both) | Same result IDs and all 3 strategy winners? | Truncated? |
|---|---:|---:|---:|---|---|
| Maloholoskivska → Sykhiv | 1,239.47 | 1,270.29 | 44 / 31 | Yes | Yes; page limit reached |
| Naukova → Sykhiv | 603.99 | 663.62 | 52 / 41 | Yes | Yes; page limit reached |
| Rynok → Dubliany | 892.81 | 970.40 | 38 / 24 | Yes | Yes; page limit reached |

Each version produced a stable itinerary-set hash across its three repeats. The dirty timetable delta produced no candidate-recall or winner change. The observed timing difference is based on one paired series under an unpinned runtime; it is not enough to claim a regression or improvement. Dense-feed search completeness remains **NOT MET**. Keep truncation visible; do not promote this diff as a completeness fix.

## Checks on current dirty Server checkout

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: 233 passed, 0 failed, 1 opt-in integration test skipped (234 total).
- Focused GTFS timetable and worker tests: 45 passed, 0 failed.
- No staging, production provider, deployment or production data was used; no production deployment performed.

## Next action

Do not discard or commit the pre-existing dirty changes. Under Node 24.21.0, repeat paired benchmarks with p50/p95 and resource sampling. Then test a separately isolated, query-directed candidate-discovery strategy against the current exact result set and exhaustive tiny-feed oracle. Promote only if it improves useful itinerary recall without losing baseline IDs/winners, preserves all GTFS feasibility rules, avoids the 100,000-edge materialization, and meets measured resource limits. Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
