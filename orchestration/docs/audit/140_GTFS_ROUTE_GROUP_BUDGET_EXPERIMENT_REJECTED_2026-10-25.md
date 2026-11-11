# GTFS route-group budget experiment rejected — 2026-10-25

## Exact source and isolation

- Server experiment worktree: `/private/tmp/marshgo-pathway-retention-20261024`.
- Base commit: `142ed4f76e9da94430048d4a31e7ad3962b4858b`, branch `codex/gtfs-pathway-retention-20261024`.
- Test-only source diff SHA-256: `8e606ebdd660568a7c2abc1f75c6389dcb215e50938e8095403eb9daddf26ac7`.
- Replay harness: `.tmp-route-group-replay.mts`, SHA-256 `30c3b0d99dfc2f3408776801153091128f5622cb48e7929130435e5a48037ccf`.
- Frozen Lviv GTFS SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Runtime available in this session: Node `v25.4.0` (the repo declares Node 24.21.0); treat timings as exploratory and do not compare directly with Node 24 evidence.
- No production Server source, canonical branch, release manifest, PR, or deployment changed.

## Experiment

The test-only event-label prototype schedules candidate expansion by the first-leg route group, adds per-group visit quotas, and preserves successor cursors across quota boundaries. The intended effect is to prevent one route group from consuming the entire candidate-visit budget. It uses exact first-leg signatures and selected stop IDs from the production candidate graph, then retains trips identified by the prototype and asks the unchanged production router to build/rank those trips.

## Results

The full timetable suite passed **75/75** on Node 25.4.0, including the small-feed exhaustive two-transfer oracle, pathway/transfer/realtime rules and all three strategy winners.

On the frozen Lviv feed, one exploratory replay per OD at a 10,000-visit limit produced:

| OD | Baseline itinerary signatures | Candidate results / signatures | Baseline signatures absent from candidate | Strategy winners preserved | Event-index time |
|---|---:|---:|---:|---|---:|
| Малий Голоско → Сихів | 100 | 2 | 99 | No | 5,329 ms |
| Наукова → Сихів | 100 | 10 | 94 | No | 5,304 ms |
| площа Ринок → Дубляни | 100 | 0 | 100 | No | 5,741 ms |

All baseline searches were graph/search truncated. The candidate router itself did not reach the baseline's route set, and its winners differed on every OD. Raising the first OD's event visit cap from 10,000 to 100,000 did not help: it still retained one trip ID and two candidate itineraries, missed 99 baseline chains, did not preserve any strategy winner, and spent 5.74 seconds in event indexing/search. Disabling reverse-reachability pruning also did not restore the baseline set.

The replay and code path show that route-group balancing alone is insufficient. The FIFO queue drains many seeded first-leg paths before exploring enough deeper paths; adding a larger global cap scales work without recovering the missing route set. The approach is rejected for production integration.

## Decision and next step

- Keep the candidate test-only and isolated. Do not commit, push, merge, or use it in a release.
- Next design must reserve work explicitly across transfer depth and route group, while guaranteeing every production first-leg candidate is retained. Search depth and destination-reaching candidates must be tested separately so a broad first-transfer fanout cannot starve later rides.
- Add adversarial dense-feed tests that assert preserved baseline trip-chain identities and FASTEST/CHEAPEST/BALANCED winners at small, fixed budgets. Require exhaustive tiny-feed parity, then frozen multi-OD identity/winner/resource comparisons before another promotion decision.
- Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
