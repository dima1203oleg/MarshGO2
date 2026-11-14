# Routing review — 2026-10-24

## Current implementation checks

- Server checkout: `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, branch `feature/transport-layer-availability`, HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`, with pre-existing uncommitted changes. No source files were edited in this review.
- `npx tsx --test tests/gtfs-timetable.test.ts tests/journey-scoring.test.ts`: **51/51 PASS** on Node `v25.4.0`.
- `npm run typecheck`: PASS.
- ESLint on the GTFS search/scoring sources and tests: PASS.
- The broader Server suite also ran via the repository's `npm test` script: **224 pass, 0 fail, 1 opt-in skip** (225 total).

These checks confirm fixture-level timetable, transfer-feasibility, fare, freshness, realtime, and strategy-scoring behavior on this dirty local checkout. They do not prove dense-feed completeness or staging/production behavior.

## Dense-feed evidence and candidate review

- Frozen-feed objective-window evidence remains in `GTFS_OBJECTIVE_WINDOW_SWEEP_2026-10-23.md`: on three Lviv OD pairs, 25k/50k/100k objective windows retained identical FASTEST/CHEAPEST/BALANCED winners, while all results remained truncated and the upstream graph budget was binding. Raising the later search window is not a fix.
- The bounded round/event-search experiments documented in `GTFS_ROUND_BASED_SEARCH_V2_2026-10-23.md` were rejected: dense-Lviv winner retention/route-chain recall were inadequate and event caps were hit. Those prototypes remain unwired.
- The bounded endpoint-overflow candidate recovered some additional alternative journey IDs in six paired queries and kept winners, but transfer searches remained truncated. Timing results were inconclusive and that candidate is based on an older stack. It is not integrated into the current `feature/transport-layer-availability` checkout.
- GitHub PR #33 (`e7e695ee337f64af97679c283c3988dfe883c200`) and stacked docs PR #34 (`904a15a57ed7332b0620d048b4d724e7e681beb3`) are OPEN, mergeable, with both CI checks SUCCESS on each PR. They do not claim to fix dense-feed completeness. No PR was merged.

## Decision and next action

Keep the current bounded search and its truthful `searchTruncated` / `candidateGraphTruncated` signals. Do not wire the rejected round-search prototypes or promote the older overflow patch based only on winner stability. The next routing implementation should reduce repeated expansion or improve candidate retention on the active stack, first prove exact oracle parity on small feeds, then replay the frozen Lviv feed and compare all three strategy winners, candidate diversity, runtime, and memory. Maintain `NOT_RELEASED` until staging and required release gates are independently satisfied.
