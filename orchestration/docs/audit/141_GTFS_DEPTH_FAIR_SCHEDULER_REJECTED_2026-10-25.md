# GTFS depth-fair event scheduler — rejected

Date: 2026-10-25

## Scope

Test-only change in isolated checkout `/private/tmp/marshgo-pathway-retention-20261024`, branch `codex/gtfs-pathway-retention-20261024`. No production source, canonical release branch, PR, manifest, or deployment was changed.

The prototype introduced per-depth/per-first-route FIFO frontiers and a 32-candidate-visit quantum. The purpose was to avoid letting a large shallow frontier consume the candidate budget before paths with more transfers could be explored. A replay-only option also unioned the trip IDs used by the existing baseline results into the event-search candidate feed.

## Verification

- `npx tsx --test tests/gtfs-timetable.test.ts`: 75/75 pass.
- `npm run typecheck`: pass.
- Targeted ESLint: pass.
- `git diff --check`: pass.
- Runtime was Node `v25.4.0`; this is not the repository-declared Node 24.21.0 runtime, so it is not a release proof.
- Frozen Lviv archive SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.

At 10,000 candidate visits, Holosko→Sykhiv replay:

- Baseline: 100 itineraries / 100 chain signatures; search and graph both report truncation.
- Depth-fair event candidate: 155 event paths, 31 trip IDs, 100 final itineraries; still truncated; 94/100 baseline chain signatures missing; all three baseline strategy winners changed. Event-index stage took 5,326 ms; candidate itinerary stage took 1,657 ms.
- With `KEEP_BASELINE_TRIPS=1`, 49 trip IDs were offered to the candidate graph, but only 27/100 baseline chains remained and all three selected winner IDs changed. Event-index stage took 5,321 ms; candidate stage 1,268 ms. Thus unioning source trips and rerunning a bounded search is not equivalent to retaining baseline itineraries.

## Decision

Reject this scheduler and the trip-ID union as production candidates. Passing the tiny-feed tests does not compensate for losing existing dense-feed chains and strategy winners, and the event-index construction/search cost remains material. Keep the experiment isolated.

A future design must preserve already-materialized baseline itinerary results as immutable candidates, then add independently discovered alternatives through an explicit merge/rank stage. It must define deduplication, freshness, fare comparability, and truncation semantics, prove exact small-feed oracle parity, and pass repeated frozen multi-OD comparisons before any integration. Do not label partial results complete or hide truncation.
