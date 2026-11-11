# Server lazy GTFS transfer reachability — 2026-10-26

## Scope

An isolated optimization in `/private/tmp/marshgo-server-release-candidate`, based on clean Server candidate `24c70dc31d652ac6ba9fbc5fcd7abd138378b457` (PR #43 head `codex/server-partner-integration-20261026`). The shared Server checkout was not modified. The candidate changes only `server/journey/gtfsTimetable.ts`.

The reverse-reachability prepass needs to know whether more than one reachable route can continue from a transfer state. Previously it materialized a `Set`, sorted the entire transfer candidate pool, then stopped after finding two route IDs. The new iterator visits the same candidate superset and allows early termination; itinerary expansion still uses the existing cached, sorted candidate pool. The existing same-route GTFS type-4 in-seat feasibility check is retained.

## Verification

- `npm test`: 319 tests, 316 passed, 3 explicitly skipped opt-in integrations, 0 failed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- Paired A/B replay used frozen GTFS archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`, three fixed Lviv O/D pairs, identical query parameters, and three alternating baseline/candidate runs per pair.
- Baseline source SHA-256: `7cdaa3ab682e642b865c7396a68c9ef278a254eef92ba872537ed572d66ea381`.
- Candidate source SHA-256: `aca9cfce1340fff3bd6d9def5c89f4232dc16b354a90fef237babb16c0dc0067`.
- For all three O/D pairs, the ordered itinerary identity hash, FASTEST, CHEAPEST and BALANCED winners, and every truncation flag were identical across all paired runs.
- Median elapsed time (baseline → candidate): Holosko–Sykhiv 2249 → 2272 ms; Naukova–Sykhiv 1964 → 1628 ms; Rynok–Dubliany 3230 → 3038 ms. This small sample is mixed and does not establish a general latency improvement. Process RSS/heap samples were cumulative and are not used as memory evidence.

## Decision and remaining work

The change preserves the frozen replay outputs and avoids full pool materialization/sort in the reverse prepass, so it is suitable for the clean integration candidate. It was committed as `4ed81b47e45520475470b699deac115fb0000b69` and pushed as a fast-forward update to [Server PR #43](https://github.com/dima1203oleg/MarshGO-Server/pull/43). Both hosted `verify` runs passed on this exact SHA (`40304476493`, `40304482350`), including dependency audit, lint, typecheck, unit tests, migration, PostGIS/Redis integration, production API image build and image smoke test. The replay still reports graph/search-budget/candidate-sampling/response-page truncation; this optimization does not solve Lviv search completeness. It is not a production deployment or release gate. Staging, licensed live-provider and map verification, physical iPhone acceptance, backup/restore, rollback, and owner release approval remain outstanding.
