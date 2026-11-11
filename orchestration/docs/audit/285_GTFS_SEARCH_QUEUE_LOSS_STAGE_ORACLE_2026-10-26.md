# GTFS search queue loss-stage oracle — 2026-10-26

## Scope and source state

- Server checkout: `MarshGO-Server`, branch `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`.
- The Server checkout has extensive pre-existing dirty changes. This checkpoint changes one existing test file only; no serving behavior, limits, or production data were changed.
- Disk headroom at this checkpoint: 2.7 GiB. Avoid overlapping large runs.

## Change

- Extended the graph-relative lazy-search test with a bounded queue-stage oracle using the deterministic `connectingFeed` bus → train transfer fixture.
- With `maxQueuedSearchWork: 0`, the oracle proves that the bus first leg and onward train are present in the already-built production candidate graph, `successors()` returns the train, and the production transfer authority marks the edge feasible.
- The final itinerary omits this known feasible chain, `candidateGraph` truncation is false, and `searchBudget` truncation is true. This proves the test can distinguish a search-frontier loss from graph retention loss for this controlled fixture.
- This is a test-oracle improvement only. It does **not** establish that the same queue frontier is the first source of loss in the dense frozen Lviv replay.

## Verification

- `node --import tsx --test --test-name-pattern='graph-relative lazy search matches production itinerary materialization' tests/gtfs-timetable.test.ts`: **1 PASS / 0 FAIL**.
- `git diff --check -- tests/gtfs-timetable.test.ts`: PASS.
- Test source SHA-256: `0d1696bf01ef1db87969d92a5de7bc9d3866a9374686e4b195a4d4c5fde8588c`.
- No build, full test suite, live feed request, staging, or production action was run in this checkpoint.

## Next exact action

Extend the stage oracle with a tiny deterministic search where the graph survives but a normal nonzero frontier cap or candidate/result sampler removes an exhaustive-oracle path. Preserve exact fare, service-date, realtime, pathway and FASTEST/CHEAPEST/BALANCED semantics. Then use existing dense-feed diagnostics to identify whether the real Lviv case first loses useful chains at graph retention, queued expansion, candidate pool sampling, or final page selection. Do not change caps or serving behavior until that source is established. Keep production `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
