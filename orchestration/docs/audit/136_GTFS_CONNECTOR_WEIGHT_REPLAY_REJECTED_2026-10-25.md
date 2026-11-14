# GTFS query-connected route weighting — replay rejected

Date: 2026-10-25

## Exact inputs

- Clean base: Server PR #39 head `142ed4f76e9da94430048d4a31e7ad3962b4858b` in `/private/tmp/marshgo-pathway-retention-20261024`.
- Candidate: isolated branch `codex/gtfs-query-relevance-budget-20261025`, same base plus local diff SHA-256 `8a130fa5b23f01a8e6823a5911117f0a67a510bcfc13b1d28b2bc62d78031062`.
- Frozen feed: `/tmp/marshgo-lviv-static-20261024.zip`, SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Runtime: Node `v24.21.0`; 3 serialized paired runs per OD, base then candidate, same replay script and query parameters as audit 134.
- No production/staging services or external APIs used. No commit, push, PR update, or deployment.

## Candidate changes

The first implementation boosted routes with origin/destination stop-pair opportunities, but failed the existing dense-interchange fixture and dropped its 3-leg connector. A second iteration pre-indexed query endpoint events, then added allocation weight to a candidate route when its scheduled stop pair was time-aligned between an origin-reachable arrival and destination-reachable departure. The endpoint events were collected in a bounded endpoint-directed prepass. This signal remained a budget heuristic; the normal transfer validator remained final authority.

## Checks

- Focused connector and pathway transfer cases: 3/3 PASS.
- GTFS/search-worker/realtime-routing/fares/health/scoring/transfer/budget suite: 126/126 PASS, zero skipped.
- TypeScript typecheck: PASS.
- Targeted ESLint: PASS.
- Three repetitions per OD were stable within each version: result hashes, trip/route chain counts, and strategy winners did not vary between repeats.

## Frozen Lviv replay comparison

| OD | Unique trip chains base → candidate | Unique route chains base → candidate | Median ms base → candidate | FASTEST/CHEAPEST/BALANCED winners same? | Search/result truncation |
|---|---:|---:|---:|---|---|
| Малий Голоско → Сихів | 60 → 59 | 43 → 39 | 2399.91 → 2769.14 | No | true / true in both |
| Наукова → Сихів | 57 → 59 | 40 → 41 | 1699.57 → 1806.73 | Yes | true / true in both |
| площа Ринок → Дубляни | 57 → 57 | 32 → 33 | 2744.82 → 2975.44 | Yes | true / true in both |

The sum of OD medians increased from 6844.30 ms to 7551.31 ms (+10.3%). Ordered result hashes differ between base and candidate for every OD. Although candidate outputs were repeatable and two ODs gained a small number of chains, the Holosko query lost four route chains, lost one trip chain, and changed strategy winners. All queries remain truncated.

## Decision

Reject both endpoint-only and query-connected weighting candidates; leave PR #39 and the canonical integration worktree untouched. Do not claim a completeness or production improvement. Further routing work should target candidate selection without destabilizing strategy winners, and must measure route recall plus CPU cost on the exhaustive small-feed oracle and frozen ODs. Evidence JSONL:

- `/tmp/marshgo-gtfs-query-relevance-v3-baseline.jsonl`
- `/tmp/marshgo-gtfs-query-relevance-v3-candidate.jsonl`

Release remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
