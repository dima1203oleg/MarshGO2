# Audit 258 — earliest-arrival label ordering rejected — 2026-10-26

## Scope and source boundary

- Isolated Server worktree: `/private/tmp/marshgo-gtfs-time-label-setting`.
- Branch: `codex/gtfs-time-label-setting-20261026`, based on clean Server PR #43 SHA `4ed81b47e45520475470b699deac115fb0000b69`.
- Local experimental commit: `9cab22c56afdd15f89cedc578882f24d42fd9173` on the isolated branch; it was not pushed.
- Test-only changes: a min-heap traversal over the exact captured production candidate graph, a parity assertion in the tiny exhaustive graph-relative test, and a frozen-Lviv replay script. Production Server source and PR #43 were not modified.
- Frozen Lviv GTFS SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Runtime was Node `v25.4.0`, while Server declares `24.21.0`; results are diagnostic, not release proof.

## Hypothesis

Process complete itinerary labels in ascending last-segment arrival time on the exact production candidate graph. Do not merge or prune labels. This isolates the effect of time-ordered scheduling from stop selection and unsafe dominance assumptions.

## Verification

- GTFS timetable suite: **76/76 PASS** including the new complete tiny-graph path identity, fare allocation and FASTEST/CHEAPEST/BALANCED parity assertion.
- `npm run typecheck`: PASS.
- Targeted ESLint for changed files: PASS.
- Frozen Lviv Holosko→Sykhiv replay, 10,000 expansion limit, same 100,000-segment truncated production graph:
  - Earliest-arrival queue: 10,000 labels expanded; 0 candidate itineraries; 0/65 production trip-chain recall; retained 0/3 baseline strategy winners; search 4.17 s; Node telemetry reported ~1.78 GB `heapUsed` but ~853 MB RSS (an inconsistent pair; memory readings are not reliable enough to treat as a benchmark); search and graph both truncated.
  - Depth-first control in the same harness: 10,000 labels; 100 candidates; 1/65 chain recall; retained 0/3 baseline winners; search 214 ms; heap ~444 MB; RSS ~695 MB; search and graph both truncated.
- The control is not a production baseline reproduction; both candidate traversals are limited by the already truncated captured graph and 10,000-label budget.

## Decision

Rejected. Sorting individual labels by arrival time lets the large initial-origin frontier consume the entire expansion limit before any destination path is reached. It materially increases memory and loses the bounded candidate set. Do not integrate this scheduler or increase its cap.

## Next action

Stop changing search order alone. Inspect the existing production scheduler and exact graph caps for a safe composition that preserves the 100 baseline itineraries/winners as immutable seeds while discovering additional alternatives under a shared explicit budget. Any candidate must pass the exhaustive small-feed identity/fare/three-strategy oracle and the same frozen multi-OD recall/resource checks before production changes.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
