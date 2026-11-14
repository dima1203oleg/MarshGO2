# 288 — Retain a Pareto GTFS candidate for cross-provider BALANCED ranking

Date: 2026-10-26

## Scope and source state

- Server repository: `MarshGO/MarshGO-Server`, branch `feature/transport-layer-availability`, HEAD `877ac41195e9270008bd353cc143c32e0a71cb1e`.
- The canonical Server working tree already contained extensive unrelated uncommitted changes. This change touched only `server/journey/gtfsTimetable.ts` and `tests/gtfs-timetable.test.ts`; no existing edits were reverted or staged.
- Runtime: Node `v25.4.0`, outside the package pin `24.21.0`.
- No live feed, database, staging, or production service was contacted.

## Defect demonstrated

The route-chain sampler kept two duration, two known-fare, two local BALANCED, one transfer, and one walking witnesses. A deterministic nine-candidate synthetic route chain plus one external option demonstrated that a non-dominated GTFS candidate omitted by this local sample becomes the winner under the actual shared `scoreJourneys(..., 'BALANCED')` scoring after candidate sets are combined. This shows that local route-chain BALANCED sampling alone can discard a useful cross-provider winner.

## Change

- Kept the route-chain limit at eight.
- Retained the fastest and known-cheapest witnesses and one local BALANCED witness, plus low-transfer and low-walking candidates.
- Used the freed slot for a non-dominated candidate from `paretoFrontier`, ordered by the same local BALANCED ranking, before filling remaining capacity.
- Added a deterministic regression using the shared production scorer. It verifies that the fixture's cross-provider BALANCED winner survives the bounded route-chain sample.

This is a bounded improvement, not a proof that every possible cross-provider optimum survives when a route chain has more than eight non-dominated candidates.

## Verification

- Focused GTFS sampler and objective reservoir tests: **3/3 PASS**, 0 skipped.
- `tests/bounded-trip-retention.test.ts`: **7/7 PASS**, 0 skipped.
- `git diff --check -- server/journey/gtfsTimetable.ts tests/gtfs-timetable.test.ts`: PASS.
- Full GTFS suite, typecheck, supported-Node replay, and frozen-feed performance comparison: **NOT_RUN**. Current Node is outside the package pin; system resources are YELLOW (about 9.2 GB disk free, 34% memory free, about 4.8 GB swap used).

## Next action

Run the full GTFS timetable/completeness suites and pinned-runtime frozen three-corridor replay when Node 24.21 is available and resource headroom permits one heavy process. Compare exact result hashes, all three strategy winners, route/trip-chain diversity, truncation flags, latency, and peak RSS against audit 282. Revert or revise this sampling policy if it regresses those invariants. Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED` until broader acceptance gates pass.

## Follow-up permutation and model review

- The cross-provider counterexample now runs through 9 cyclic candidate orders and 32 deterministic seeded shuffles; the `c7` shared BALANCED winner is retained in all 41. Focused test: **1/1 PASS**; scoped `git diff --check`: PASS.
- A read-only Antigravity Gemini 3.8 Flash Low call reviewed a concise description of the algorithm (prompt-only, not a repository checkout): 21,309 provider-reported tokens, 40.987 s. It noted that one Pareto slot does not prove completeness if many non-dominated candidates exist, which is already an explicit limitation; it also raised tie-order concerns. Current route/objective sorts use stable candidate-ID tie-breaks, and the 41-order fixture now exercises this case. Antigravity remaining quota is not exposed. No source changes came from that review.
- Current Codex account usage snapshot: 89% of the 300-minute primary window, 39% of the weekly window; primary reset timestamp `1793059049` (2026-10-26 23:57 UTC). This is an account rate-limit snapshot, not a task-specific token count.
- Mac resource state remains YELLOW: 31% memory free, about 9.2 GB disk free, about 4.9 GB swap used. The hourly continuity heartbeat is ACTIVE but is not an always-on worker. Continue bounded work and checkpoint before the current Codex window is exhausted.
