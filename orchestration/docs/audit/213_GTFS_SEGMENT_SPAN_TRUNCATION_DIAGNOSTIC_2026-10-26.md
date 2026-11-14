# GTFS segment-span truncation diagnostic — 2026-10-26

## Finding

- Canonical Server checkout: `MarshGO-Server`, branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; existing dirty source preserved.
- GTFS segment construction has an explicit bound `toCursor <= fromCursor + 20` over eligible route stops. On a long trip crossing more than 20 eligible stops, a passenger may board an origin-selected stop and alight at a destination-selected stop beyond that span. Search cannot compose a second segment from the same route as a substitute.
- Before this checkpoint, this candidate-generation bound was not represented in the truncation diagnostics; a no-route answer could therefore appear complete even though the trip segment had been omitted.

## Change

- Added typed `segmentSpan` to GTFS truncation diagnostics. It becomes true when an active service has an in-window pickup-eligible event and a permitted drop-off stop beyond the materialization span. The check uses a linear suffix index per active trip instance; it does not expand the segment graph or raise any cap.
- Included this reason in `searchTruncated` and provider-level loss diagnostics. The canonical Site API type now accepts the field; its existing `candidate_generation_truncated` status shows the user that some routes may be missing.
- Added a 50-stop synthetic feed regression: a long active direct ride is omitted by the current span bound, and the result is now explicitly incomplete instead of a complete empty response. Added a provider diagnostic propagation assertion.
- Supported-runtime debug replay of the frozen Lviv feed showed `segmentSpanTruncated=1` for all three controlled O/Ds. This confirms the hidden bound is active in the dense-feed candidate, alongside the pre-existing stop-selection, candidate-sampling, pool and/or step limits. No latency claim is made from this single diagnostic replay.

## Verification

- Bundled Node **24.22.1**: focused Server GTFS/completeness tests **47/47 PASS**; full Server unit suite **238 PASS / 0 FAIL / 1 opt-in integration SKIP**; Server typecheck and changed-file ESLint PASS.
- Isolated Server/PostGIS/Redis integration suite: **29/29 PASS**. Temporary API/OSRM processes exited; existing DB/Redis containers remained healthy.
- Canonical Site: typecheck, ESLint on the changed API type, **99/99 unit tests**, and Vite production build PASS.
- `git diff --check`: PASS on reviewed worktrees.

## Remaining work and limits

- This makes a hidden candidate loss visible; it does **not** recover the omitted long segment. Dense Lviv search remains truncated. It is still an open routing correctness gate and must not be described as complete or production-ready.
- Next algorithm work: replace bounded all-pairs segment materialization with query-directed generation or exact same-trip continuation, preserving pickup/drop-off, service calendars, realtime, transfer/pathway and fare semantics. First prove complete path identity and three-strategy winner parity against exhaustive small-feed oracles, then compare frozen Lviv recall, latency and RSS without silently increasing limits.
- Server and Site worktrees remain dirty. No commit, push, merge, manifest promotion or deployment. `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
