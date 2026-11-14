# API multimodal candidate diversity and walking-budget fix — 2026-10-26

## Baseline and scope

- Server repo: `MarshGO-Server`, branch `feature/transport-layer-availability`, base HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; the checkout had pre-existing unrelated dirty changes and those were preserved.
- This is a local source change only. No commit, push, PR merge, release-manifest promotion or deployment.

## Findings

1. GTFS router unit/replay could produce bus→tram candidates from the same registered Lviv feed, but the API could persist only bus routes. The API used `Promise.all` to route every candidate through one shared 32-request walking-routing budget. Completion order determined which candidate used each slot, so transfer chains could be starved nondeterministically.
2. Even without a walking service, global Pareto pruning could remove every candidate for a distinct transport chain when a direct chain dominated it on measured dimensions. That hid a valid bus→tram alternative although both modes were selected.

## Changes

- The API now groups walk-routed itineraries by exact provider/route chain, sorts the groups deterministically, routes candidates sequentially, and takes turns between chains. This removes concurrency races on the bounded route budget and avoids sending requests for candidates beyond an exhausted budget.
- Strategy selection now keeps the best strategy-ranked candidate for each distinct diversity key in addition to the Pareto frontier. Repeated runs remain capped at three per chain; the global result limit and CHEAPEST unknown-fare exclusion remain in force.
- Added a scorer regression proving a dominated direct-bus option does not erase the only distinct bus→tram chain. Earlier GTFS regression retains long direct service beyond the bounded transfer-edge span. API integration assertion remains strict and was not weakened.

## Evidence

Node `24.22.1`:

- `npm run typecheck`: PASS.
- Focused ESLint on changed Server source/test files: PASS.
- GTFS, journey completeness and scoring unit tests: 65/65 PASS.
- Full Server unit suite: 239 PASS, 0 FAIL, 1 opt-in integration test skipped by default.
- `npm run test:integration` on loopback `marshgo_e2e` PostgreSQL/Redis: PASS. Journey schema 2/2; live Journey 1/1; API booking + trip editing 21/21; navigation 2/2; realtime cluster 1/1; restart durability 1/1; Redis rate limit 1/1. The previously failing Lviv multi-select test persisted bus and bus→tram alternatives and passed geometry/stop checks.
- Integration script cleaned up its API and fixture processes on exit. No container data was deleted.

## Limits

- This validates the dirty local Server source against local database/cache and the currently enabled Lviv provider snapshot. It does not establish a clean immutable release SHA, hosted CI, staging, live-provider freshness/rights, visual acceptance, physical iPhone, backup/restore, load, or production deployment.
- Dense-feed GTFS searches remain truncated as recorded in audit 214. Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Next action

Run full Server lint and `git diff --check`, review this source diff against the pre-existing dirty worktree, then continue the next unresolved routing-search completeness item from audit 214. Preserve all unrelated changes; do not commit or deploy as part of this checkpoint.

## Resumed dense-feed profile after API fix

A read-only Node 24.22.1 replay used the same frozen ZIP (`bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`) and three current fixed O/D samples. It confirms the API fix does not resolve router truncation:

| O/D | Segments materialized | First legs | Search steps / candidates | Important truncation |
|---|---:|---:|---:|---|
| Малоголосківська → Сихів | 439,024 | 573 | 50,000 / 1,921 | stop selection, step ceiling, route-chain sampling, omitted segment spans |
| Наукова → Сихів | 175,100 | 676 | 40,313 / 2,500 | stop selection, candidate-pool limit, route-chain sampling, omitted segment spans |
| Ринок → Дубляни | 262,254 | 1,626 | 50,000 / 2,073 | stop selection, step ceiling, route-chain sampling, omitted segment spans |

All three still return 100 entries and honestly set truncation. A 50,000 traversal limit and candidate sampling remain real loss causes. Do not treat the now-green bus→tram persistence case as dense-feed completeness. The next algorithm change must be an experiment against this exact same feed/request set and the exhaustive small-feed oracle, preserving the current source on failure.

## Rejected experiment: route-round-robin first-leg order

- Hypothesis: chronological first-leg DFS might overuse its fixed search budget on the earliest busy lines; interleaving first departures by provider/route/direction could improve useful-chain recall without raising limits.
- Isolated change was tested against the exhaustive GTFS oracle (44/44 PASS), typecheck and focused ESLint (PASS), then replayed with the same Node 24.22.1, frozen archive and three O/Ds. It was reverted after the replay.
- Before → experiment unique displayed route chains: Holosko 48→48, Naukova 42→37, Rynok 52→60. Ordered result hashes changed for all three; truncation remained true for all. Since recall regressed for one corridor, the experiment fails the all-corridor improvement requirement and is not retained. Timings were mixed and do not support a performance claim.
- No production search limit was raised and no partial flag was cleared.
