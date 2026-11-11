# GTFS truncation diagnostics — 2026-10-26

## Change

- Server checkout: `MarshGO-Server`, branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; pre-existing dirty worktree preserved.
- `GtfsItinerarySearchResult` now carries typed internal causes: endpoint stop selection, per-depth search budget, global step cap, candidate-pool cap, same-chain candidate sampling, and response-page omission.
- `searchTruncated` is derived from candidate-loss/search caps only. Ordinary response pagination remains separate; route-chain sampling can correctly set both sampling and response-page causes.
- Added assertions for complete small-oracle results, page-only omission, and same-chain candidate sampling.
- Follow-up: provider-level typed reasons are now exposed as optional `gtfsSearchDiagnostics` on the journey-search response; the Site API type accepts the optional field and the results panel uses accurate wording for incomplete source search. Ranking and route results are unchanged.

## Verification

- Runtime: bundled Node `v24.22.1`.
- Focused GTFS timetable/calendar/realtime/oracle suite: **42/42 PASS**.
- Full Server unit suite after API propagation: **236 PASS, 0 FAIL, 1 opt-in integration SKIP**.
- Site unit suite: **99/99 PASS**; Server and Site typecheck and lint: PASS; Site production build and bundle budget: PASS.
- `git diff --check`: PASS on the scoped Server, Site, and documentation changes.
- Loopback runtime smoke: the guarded launcher accepted loopback DB/Redis configuration; `/readyz` reported ready. A real authenticated-development journey search returned HTTP 200, 12 journeys, `partial=true`, and one `gtfsSearchDiagnostics` group with stop-selection, candidate-pool, and candidate-sampling reasons set. `partialReasons` also contained candidate-generation truncation, unsupported preference, and unavailable walking routing. The API process started for this smoke was then stopped.
- Previous frozen Lviv replay and cause counters are recorded in [audit 210](210_GTFS_MODE_AWARE_STOP_SELECTION_2026-10-26.md). This diagnostics-only change does not reduce candidate loss; no fresh replay was needed to validate the boolean derivation because its cases are asserted in small deterministic tests.

## Limits

- Wire-level API exposure is verified locally. The Site accepts the optional field but currently renders the general incomplete-search notice; it does not display each typed reason. Browser UI consumption of this specific live response was not tested.
- Dense Lviv results remain incomplete; diagnostics reveal causes but do not reduce truncation. The live local response additionally confirms that not all requested conditions are supported and exact pedestrian routing is unavailable in this configuration. Server and Site remain dirty pre-existing checkouts, and no staging or production gate changed.
- `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
