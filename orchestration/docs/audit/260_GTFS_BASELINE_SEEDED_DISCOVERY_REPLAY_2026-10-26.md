# Audit 260 — bounded GTFS discovery with retained production baseline chains — 2026-10-26

## Scope and source boundary

- Isolated Server worktree: `/private/tmp/marshgo-gtfs-time-label-setting`.
- Branch: `codex/gtfs-time-label-setting-20261026`, based on Server PR #43 candidate `4ed81b47e45520475470b699deac115fb0000b69`.
- Test-only commits: `9cab22c56afdd15f89cedc578882f24d42fd9173` (arrival-order prototype, rejected) and `fe9961b532d26795769c634d3580a14b715f550b` (baseline-seeded bounded discovery). Neither was pushed.
- No serving-path code, canonical PR, production config, release manifest, or deployment was changed.
- Frozen Lviv GTFS archive SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Runtime: Node `v25.4.0`; Server package declares Node `24.21.0`. Results are local diagnostics, not release proof.

## Method

The test-only traversal receives the exact candidate graph snapshot produced by the current Server PR #43 search. It validates each edge through the production transfer authority, materializes fare using the existing GTFS/city fare functions, and keeps the bounded production result set as immutable seeds. Selection first keeps one baseline itinerary per distinct trip chain and all exact baseline FASTEST/CHEAPEST/BALANCED winner identities, then fills the remaining response slots with one discovery itinerary per new trip chain before allowing duplicate-chain variants. No candidate graph or search cap was raised.

## Verification

- GTFS timetable suite: **76/76 PASS**, including complete tiny-graph identity/fare/strategy parity and seed-coverage assertions.
- Full Server unit suite: **316 PASS / 0 FAIL / 3 opt-in database integration SKIP** (319 total).
- `npm run typecheck`: PASS; targeted ESLint: PASS; `git diff --check`: PASS.
- Three frozen Lviv O/D replays, each with the current 100,000-segment graph cap and a 10,000-label supplemental traversal budget:

| O/D | Discovered paths | New trip chains found | Baseline chain recall in 100 results | New chains selected | Exact baseline strategy winners retained | Graph/search complete? |
|---|---:|---:|---:|---:|---|---|
| Holosko → Sykhiv | 9,938 | 464 | 65/65 (100%) | 34 | 3/3 | No |
| Naukova → Sykhiv | 9,974 | 584 | 100% | 40 | 3/3 | No |
| Rynok → Dubliany | 9,861 | 692 | 100% | 33 | 3/3 | No |

- Holosko’s final selected result identity hash was `4e6f292b0619814671b318921632cf61e5725783f62ed8f819ea812e9322f288` in three repeated runs; exact winner identities and selected hash were stable. Naukova and Rynok were each replayed once in this checkpoint.
- The `searchMs` field measures only the supplemental graph traversal after the base production graph and result pool have been built (about 190–343 ms in these runs). It is not end-to-end latency. RSS samples varied (roughly 360–712 MB) and are not a load benchmark or a capacity guarantee.

## Limits and decision

Promising test-only result, **not yet a production implementation**. The bounded pass discovers 33–40 additional trip chains within a 100-item response while retaining all baseline chain representatives and exact strategy winners. It does not establish recall against the complete GTFS graph: all three base candidate graphs and supplemental searches report truncation. It also retains one representative per baseline trip chain, not every baseline itinerary identity. The route results are not yet wired through the production endpoint and client E2E.

Next: port the candidate selection into an isolated server-source branch only if the production path can reuse exact `addPath` cost/transfer logic, keep all three exact baseline winners and every baseline chain representative, remain under explicit memory/latency bounds, and preserve `searchTruncated=true`. Then run the full Server suite, three paired frozen-feed replays (at least three repeats), API contract tests, and exact Site E2E. Do not push or merge until that evidence passes.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
