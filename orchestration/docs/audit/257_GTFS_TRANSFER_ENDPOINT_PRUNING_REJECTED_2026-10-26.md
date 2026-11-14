# Audit 257 — query-directed GTFS transfer-endpoint pruning prototype rejected — 2026-10-26

## Scope and source boundary

- Isolated Server worktree: `/private/tmp/marshgo-gtfs-transfer-endpoint-prune`.
- Branch: `codex/gtfs-transfer-endpoint-prune-20261026`, based on exact Server PR #43 candidate `4ed81b47e45520475470b699deac115fb0000b69`.
- Changes are test-only: an over-approximate candidate transfer-endpoint selector, an optional alighting-stop filter in the independent lazy event-label helper, a tiny-feed exhaustive-oracle assertion, and an isolated replay diagnostic. No serving-path source, canonical PR or production limits were changed.
- Frozen feed: Lviv GTFS archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.

## Hypothesis

Materializing legs only to query endpoints and plausible transfer points might reduce downstream segment objects while preserving all feasible paths. The endpoint set intentionally over-approximates candidates from route intersections, explicit transfer rules, pathways, shared parent stations, and nearby different-route stops; the production transfer decision remains the final feasibility authority in the helper.

## Verification

- The exhaustive two-transfer fixture matched every feasible trip chain and fare value; all three production ranking winners remained present.
- Full Server unit suite: **316 PASS / 0 FAIL / 3 opt-in DB integration SKIP** (319 total), Node `v25.4.0`.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- Frozen Holosko → Sykhiv replay at a 10,000-label cap: production returned 100 journeys / 65 distinct trip chains and was truncated. Prototype selected 814 possible alight endpoints after production selected 27 origin and 25 destination stops; it projected 34,892 legs and 2,025 boarding expansions, visited the 10,000-label cap, and took 5,552 ms in the event phase. It produced 171 destination paths but only 17 distinct trip chains and 3 route chains.
- Prototype retained **0/65** production result trip chains and **0/3** production strategy winners. Both searches were explicitly truncated. Replay runtime is Node `v25.4.0`, not the pinned CI runtime; these are diagnostic measurements, not performance claims.

## Decision

Rejected. The endpoint filter does not fix the depth-first label-order bias and loses all bounded baseline chains/winners on the dense feed. Do not integrate this pruning or raise its work cap. The test-only branch is retained as a reproducible rejected experiment; PR #43 and the release candidate are unchanged.

## Next technical direction

Avoid enumerating path permutations in depth-first order. Prototype a bounded time-dependent label-setting search that coalesces equivalent boarding states while retaining required fare-v1 coverage state, transfer count and path identity. Use the current Server transfer authority for every transition. Before any frozen-feed run, prove exhaustive small-feed identity/fare and FASTEST/CHEAPEST/BALANCED winner parity, including service-date, pathway, trip-specific rule, realtime cancellation/delay and type-4 in-seat cases. On Lviv, require exact retention of all current bounded result chains and winners, then measure additional distinct chains, truncation causes, wall time and peak RSS across all three O/Ds. Keep the experiment isolated until it meets those gates.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
