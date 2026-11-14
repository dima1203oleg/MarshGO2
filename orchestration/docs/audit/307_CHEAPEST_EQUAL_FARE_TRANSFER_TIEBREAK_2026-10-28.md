# CHEAPEST equal-fare transfer tie-break — 2026-10-28

## Finding
On the exact PR #50 source, equal-fare candidates were sorted by the weighted composite score after price. A faster one-transfer chain could therefore beat a slower direct journey at exactly the same fare, despite adding no savings. A regression fixture reproduced this: before the change `same-fare-faster-connection` beat `same-fare-direct`.

## Change and verification
- For CHEAPEST only, known equal fares now compare transfer count before the weighted score; strict fare ordering is unchanged. FASTEST and BALANCED logic is untouched.
- Added a regression case with a faster one-transfer journey and a same-fare direct option; the direct option must win.
- `tests/journey-scoring.test.ts`: 22/22 pass. `git diff --check` passes.
- Exact candidate commit: `84f700e15f39d77575dd7e71ce52550751c22403`, pushed normally to PR #50.
- Exact Server CI: runs `40748525837` and `40748518705` are in progress. Frozen-Lviv replay `40748532354` is queued vs original base `1157b4df29736a7936f9fe5713cb7f9c522d6c26`, three paired runs, same pinned feed and OD/window.
- The isolated ESLint attempt in the worktree could not resolve `@eslint/js` because the worktree has no installed dependencies; no packages were installed. Hosted CI is authoritative for lint/typecheck/integration.

## Acceptance boundary
Await exact CI and replay to confirm the intended CHEAPEST tie-break on the real frozen route and verify FASTEST/BALANCED stability. No merge to default branch or production deployment. Production remains `NOT_RELEASED`.

## Frozen Lviv result
Replay `40748532354` completed with three repeat-stable runs against original base `1157b4df29736a7936f9fe5713cb7f9c522d6c26` on the same pinned feed/OD/window:
- CHEAPEST now selects the exact baseline direct chain at 06:12:30Z, zero transfers, 707 m, fare 2300 UAH minor units. Regression fixed.
- FASTEST and BALANCED preserve arrival 05:47:03Z, one transfer, 646 m, fare 2300; trip identity differs but reported route outcome is equal.
- Overall ordered-result and all-winner identity parity remain NO due to other added/removed candidates. Truncation remains on both.
- Median search remains +4.59% (5939.05→6211.66 ms); RSS +26.1 MiB (681.4→707.5 MiB). Stage medians: segment build +10.96%; itinerary ranking +3.35%.
- Exact Server CI runs `40748525837` and `40748518705` passed audit, lint, typecheck, unit, migrations, integration, production image, and PostGIS/Redis smoke. PR remains open, production NOT_RELEASED.
