# Bounded query-directed event search prototype on frozen Lviv GTFS

Date: 2026-10-25

## Exact setup

- Server base: PR #39 `142ed4f76e9da94430048d4a31e7ad3962b4858b`.
- Temporary worktree: `/tmp/marshgo-pathway-retention-20261024`.
- Test-only patch SHA-256: `3f4d8e66df8ea9dd641cb72c279fdf78d1bc4f5eedca095eb737ab4f993c3a26`.
- Frozen feed SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Runtime: Node `v24.21.0`; Малий Голоско → Сихів, 05:00–05:30 UTC, six-hour horizon, 2 transfers, 400 m transfer radius, 180 s buffer, 4 h max wait.
- Service dates were both `20261022` and `20261023`, matching the production query-date expansion.
- The prototype constrained its stop universe to the 390 stops appearing in the production candidate graph and its initial legs to the exact 402 production first-leg signatures. It then generated downstream stop-pair legs from feed events and validated path transfers with the production transfer authority.

## Results

- Baseline production search: 100,000 candidate segments, 402 first legs, 100 returned itineraries / 60 trip chains. Graph and search remain truncated. Graph construction took 2,503 ms in this run.
- Prototype indexed 199,083 boarding events, materialized 368,346 stop-pair legs and visited its 10,000-leg work cap; it remained truncated.
- It generated 9,836 candidate paths; the production transfer validator accepted 8,652. These represented 552 distinct trip chains: 549 additional chains versus the 60-chain production sample, with 57 of the 60 production chains missing at this bound.
- Event-search phase took 5,537 ms after graph construction; whole-process RSS sample was 496,058,368 bytes.
- The exhaustive two-transfer small-feed oracle covering identities, fares and FASTEST/CHEAPEST/BALANCED winners passed. The focused GTFS/search/scoring/transfer/budget suite passed 125/125, with TypeScript, targeted ESLint and diff-check passing.

## Interpretation and decision

Query-directed downstream materialization can expose many additional feasible trip chains from the retained spatial stop universe. The current traversal is not acceptable as a production replacement: its fixed work bound misses 57 baseline chains, remains truncated, adds about 5.5 seconds after the existing graph build, and does not yet compute/rank complete itinerary metrics for the added paths. Keep the experiment isolated and test-only; do not merge or claim production improvement.

Next experiment: balance event-label work across production first-leg route groups while retaining exact baseline result identities and strategy winners. Materialize full access/egress, transfer, fare and reliability measures before comparing winners. Require exhaustive tiny-feed parity and frozen-feed multi-OD non-regression before any runtime integration.

Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
