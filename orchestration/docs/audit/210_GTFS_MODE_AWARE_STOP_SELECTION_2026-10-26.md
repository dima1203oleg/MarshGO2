# GTFS mode-aware endpoint stop selection — 2026-10-26

## Scope and source boundary

- Canonical Server checkout: `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`.
- Branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; the checkout was already dirty. The existing dirty GTFS router and test file were preserved and not committed.
- Changed `server/journey/gtfsTimetable.ts` so `allowedModes` and `allowedTransportTypes` filter endpoint-stop eligibility before the nearest-stop cap and transport-type augmentation. A stop served only by an excluded mode no longer consumes the selected endpoint candidate budget or creates a false stop-truncation signal.
- Added a regression case with 15 nearby bus stops and three farther rail stop candidates. The two earlier rail services are outside the query window; the third valid rail stop is still selected and returned.

## Verification

- Runtime: bundled Node `v24.22.1`.
- `tests/gtfs-timetable.test.ts`: **42/42 PASS**, including one/two-transfer exhaustive small-feed oracles.
- Full Server unit suite: **235 PASS, 0 FAIL, 1 opt-in integration SKIP** (236 total), on Node `v24.22.1`.
- `tsc --noEmit`: PASS.
- ESLint on the two changed files: PASS.
- `git diff --check` on the changed files: PASS.
- The isolated first run under system Node `v25.4.0` also passed the targeted regression, but is supplemental and not used as the supported-runtime gate.

## Frozen-feed regression replay

- Replayed the fixed archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` (72 routes, 1,071 stops, 15,716 trips) twice per O/D on Node `v24.22.1`, with no mode filter, using the same 30-minute window and 6-hour horizon as audit 206.
- Both repeats per O/D returned the same 100-result identity hash. Elapsed-time ranges were 1,839.69–2,117.62 ms (Малий Голоско → Сихів), 840.51–1,328.56 ms (Наукова → Сихів), and 1,355.85–1,493.35 ms (площа Ринок → Дубляни).
- Every search still reported both `searchTruncated=true` and `resultLimitReached=true`. This confirms the filter change does not alter unfiltered result sets in this replay; it does not resolve or conceal dense-feed truncation. Timings are two local samples, not a load/performance SLA.
- A debug-counter replay of the same three requests confirmed the remaining causes. All three had `stopSelectionTruncated=1` and `candidateSamplingTruncated=1`; all also hit the per-depth search budget. The first two materialized 415,180 and 194,355 segments and reached 2,500 candidates; the third materialized 263,812 segments and hit the 50,000 global step cap at 1,575 candidates. The 50,000 step cap was not reached for the first two. Selected endpoint counts were 20/20, 16/20, and 20/14. This suggests that reducing relevant graph work and replacing depth-first enumeration with bounded destination-directed labels are both still required; simply expanding caps is not justified by these figures.

## Limits and next work

- This fixes endpoint-candidate selection for explicit transport filters; it does not make the general dense-feed search exhaustive.
- The earlier frozen-feed audit 206 records all three Lviv searches as `searchTruncated=true`; that replay was not repeated for this mode-filtered change. Do not claim global candidate completeness, live-feed correctness, staging, or production readiness from this focused test.
- The worktree contains pre-existing dirty changes in the same source and test files, so this change remains local and uncommitted pending safe review/splitting.
- `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
