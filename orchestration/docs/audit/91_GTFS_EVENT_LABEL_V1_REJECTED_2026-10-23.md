# GTFS query-directed event-label prototype v1 — rejected

Date: 2026-10-23  
Base: Server PR #31 exact SHA `b65882584a3ad1e8dd7512d13176f52299cded51`  
Branch: `codex/gtfs-event-label-oracle-20261023`  
Runtime: Node `24.21.0`  
Frozen feed: Lviv GTFS ZIP SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`  
Scope: isolated test-only helper; no production routing files, limits, release pins, or containers changed.

## Tests

- Targeted GTFS timetable/fare suite: **75 passed**.
- TypeScript typecheck: PASS.
- Targeted ESLint: PASS.
- Fixtures covered exhaustive small-network identity comparison, service exception and 24:15 event, two transfers, fare-v1 allocation/zones, unknown fare, and type-4 in-seat continuation. These small fixtures passed; this does not prove dense-feed completeness.

## Frozen replay

The same three queries, window, walk/transfer limits, and feed archive as the previous replay were used. All three prototype searches reached their explicit 100,000 candidate-leg-visit limit and returned `truncated=true`.

| OD | Baseline IDs retained | Route chains retained | Strategy winners retained | Candidate paths / trips | Materialized legs | Prototype time | Production-candidate time |
|---|---:|---:|---:|---:|---:|---:|---:|
| Мале Голоско → Сихів | 1/100 | 1/37 (2.7%) | 1/3 | 1,140 / 34 | 123,744 | 2.865 s | 0.113 s |
| Наукова → Сихів | 29/100 | 11/40 (27.5%) | 3/3 | 3,100 / 289 | 116,593 | 2.610 s | 4.137 s |
| Площа Ринок → Дубляни | 6/100 | 1/32 (3.125%) | 3/3 | 870 / 55 | 209,452 | 2.608 s | 9.330 s |

“Production-candidate time” is the unchanged production router run on the subset of trip instances selected by the test helper; it is not a baseline timing. It remained `candidateGraphTruncated=true` and/or `searchTruncated=true`. Prototype leg-visit counters are not equivalent to the production router's graph-retention or search-step budgets.

## Decision

**FAIL — reject the prototype as a production replacement.** Passing tiny-feed correctness tests is necessary but insufficient: the event-label helper still expands too many possible legs, truncates all three dense-feed searches, loses substantial route-chain recall, and loses two strategy winners for the primary OD.

The worktree remains isolated and uncommitted. No change was copied into Server PR #31 or the release candidate.

## Next gate

Before another frozen replay, inspect the helper's combinatorial expansion and propose a genuinely different pruning/search-state representation. Any dominance rule must preserve exact fare assignment alternatives, service date/trip/call identity, cycle constraints, transfer feasibility, route-chain diversity, and type-4 semantics. No scalar-fare or stop-and-time merge may be assumed safe. First establish full itinerary identity equality against exhaustive fixtures; do not raise production limits to hide truncation.
