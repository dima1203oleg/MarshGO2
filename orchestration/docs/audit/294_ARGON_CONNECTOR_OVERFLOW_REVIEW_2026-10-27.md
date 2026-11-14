# Argon review of PR #50 connector overflow — 2026-10-27

## Decision

Do not apply the suggested connector-overflow expansion. Antigravity Argon proposed retaining more query-feasible stop-pair connectors from each trip in the per-route overflow reservoir. The idea is bounded by the existing reservoir/global graph limits, but the review did not provide an exhaustive-oracle witness or measured replay evidence that it recovers a feasible journey.

## Independent evidence

- Argon read the isolated Server PR #50 `server/journey/gtfsTimetable.ts` and pointed to the one-connector-per-trip branch around `temporallyConnectsQueryEnds` and `connectorOverflow.consider()`.
- Codex verified that the branch does select at most one connector per trip group and that the resulting reservoir is bounded. The review's claim that more candidates would improve production route recall remains a hypothesis; no omitted winning itinerary was identified.
- This proposal repeats the direction already rejected in [`152_GTFS_OVERFLOW_CONNECTOR_RETENTION_REJECTED_2026-10-25.md`](152_GTFS_OVERFLOW_CONNECTOR_RETENTION_REJECTED_2026-10-25.md): a prior overflow expansion passed its unit suite but lost FASTEST and CHEAPEST winners on one of three frozen Lviv ODs, reduced chain diversity, and increased one OD's median latency by about 31%.

## Outcome and next action

Keep PR #50 unchanged and open. Do not expand endpoint/connector reservoirs or raise graph caps. Continue with an exact exhaustive small-feed oracle / feasible-but-omitted witness, then investigate how whole-trip-group sizes interact with route budget allocation. Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

Antigravity task: Gemini 4 Argon Medium, read-only, one Server source file; no code/test changes. Model quota telemetry was not exposed.

## Follow-up allocator check

A separate Gemini 3.8 Flash task inspected only `boundedGraphBudget.ts`. It did not produce a final result and initially cited a nonexistent line 123 in the 85-line file, so its partial reasoning was not accepted; the task was stopped to avoid further unproductive model use. Codex's direct inspection found no obvious violation of the allocator's documented slot/capacity invariants. Existing unit coverage was not rerun because no source change was made. Do not treat this as a new allocator correctness proof.
