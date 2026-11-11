# GTFS route-chain diversity search experiment — 2026-10-26

## Scope and exact source boundary

- Canonical checkout: `MarshGO-Server`, branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; the worktree already had unrelated user/ongoing changes. The routing source and its tests remain uncommitted.
- Updated `server/journey/gtfsTimetable.ts`: reaching the per-depth candidate count no longer terminates the entire search pass. Search continues under the existing global step/result budgets and per-route-chain cap, so different route chains can still enter the ranking pool. The per-route-chain cap continues to set `searchTruncated=true` when it rejects a candidate.
- Added two regression tests: continuing to discover separate route chains after a page has enough items; and preserving the incomplete-search signal when repeated departures exceed the same-chain cap.
- No cap was raised. Existing bounds remain: global 50,000 search steps, at most 128 steps per first leg, `limit * 25` total candidate results, and 8 results per route chain.

## Correctness checks

- Focused GTFS timetable + calendar/realtime exhaustive oracles on Node `24.21.0`: **42/42 PASS**.
- Full Server unit suite on Node `24.21.0`: **234 PASS, 0 FAIL, 1 opt-in integration SKIP**. The skipped integration test is not counted as pass.
- Server `typecheck`: PASS. Server ESLint: PASS. `git diff --check`: PASS.
- The pre-existing isolated Server integration evidence is in audit 205 (29/29); it was not rerun after this search-only edit.

## Follow-up integration and truncation-cause evidence

- After the search edit, a fresh isolated Server integration run used a new loopback database `marshgo_e2e_routing_20261026`; migrations applied from empty state through `054_rendezvous_participant_consent.sql`, and the integration suites passed **29/29** across journey schema/ownership, booking and last-seat concurrency, trip changes/cancellation, navigation/GPS, cross-instance Redis realtime, restart durability and shared rate limiting. This remains local integration evidence, not staging or production.
- The integration run's test API listeners on ports 3336–3338 exited; no listener remained when checked. The shared local Postgres/Redis services were not stopped or modified. One realtime outbox retry was recovered and its test passed.
- A one-repeat diagnostic replay on the same frozen feed exposed why the candidate still reports partial results:

| O/D | Search steps | First legs | Candidate results | Candidate results by leg count | Truncation causes |
|---|---:|---:|---:|---:|---|
| Малий Голоско → Сихів | 46,421 | 909 | 2,500 | 0 / 953 / 1,547 | selected-stop cap, search-budget partition, total candidate-result cap, per-route-chain sampling |
| Наукова → Сихів | 38,992 | 1,852 | 2,500 | 38 / 780 / 1,682 | selected-stop cap, search-budget partition, total candidate-result cap, per-route-chain sampling |
| площа Ринок → Дубляни | 50,000 | 1,717 | 1,575 | 8 / 392 / 1,175 | selected-stop cap, search-budget partition, global search-step cap, per-route-chain sampling |

The three searches returned the requested 100 results but each remained truncated. There are 866 interchange stops in the parsed feed; the current chosen-stop/corridor pruning and bounded candidate generation do not yet prove that omitted stops are semantically redundant. In particular, returning a full page is not a completeness criterion. Next work must reduce candidates through destination-directed feasible labels while preserving calendars, exact transfer/pathway rules, realtime, fare comparability and walk feasibility; raising the current caps or clearing the partial flag is not acceptable evidence.

## Same-runtime frozen-feed A/B

Both implementations were loaded in one Node `24.21.0` process and run on the same parsed feed and the same three O/D requests. Frozen archive SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` (72 routes, 1,071 stops, 15,716 trips). Each request used the same 30-minute departure window, 6-hour horizon, 2 transfers, 900/1000/400 m access/egress/transfer bounds, 180-second transfer buffer and 100-item response limit.

| O/D | Baseline → candidate unique trip chains | Baseline → candidate unique route chains | Baseline → candidate elapsed (ms) | Baseline/candidate IDs shared | FASTEST/CHEAPEST/BALANCED winners | Truncated? |
|---|---:|---:|---:|---:|---|---|
| Малий Голоско → Сихів | 44 → 77 | 31 → 65 | 1401 → 1888 (+35%) | 22/100 | all three identities unchanged | yes / yes |
| Наукова → Сихів | 52 → 57 | 41 → 43 | 741 → 880 (+19%) | 65/100 | all three identities unchanged | yes / yes |
| площа Ринок → Дубляни | 38 → 57 | 24 → 46 | 1006 → 1368 (+36%) | 46/100 | all three identities unchanged | yes / yes |

The paired result confirms a larger route-chain variety and preservation of the three baseline strategy winners for these requests. It also substantially changes the remaining page composition and adds latency. Both implementations still report truncation. This is a bounded diversity improvement only: it does **not** prove exhaustive results or globally optimal strategies, and it does not close the dense-GTFS production blocker.

## Decision and next work

- Keep the bounded diversity change and honest truncation signal as a local, uncommitted candidate: all three measured winners stayed stable, route-chain variety increased, and tiny-feed exact oracles plus full local Server unit/type/lint gates passed.
- Do not promote it as a complete router or immutable release candidate. The worktree includes other dirty changes, and staging/live-feed/release tuple evidence is separate.
- Next algorithm milestone: query-directed candidate discovery/label-setting that preserves exact transfer, pathway, service-date, realtime, fare and cycle semantics; compare against the exhaustive small-feed oracle and frozen-feed strategy winners while reducing the remaining truncation. Do not suppress the warning or increase budgets without measured recall and resource evidence.
- `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
