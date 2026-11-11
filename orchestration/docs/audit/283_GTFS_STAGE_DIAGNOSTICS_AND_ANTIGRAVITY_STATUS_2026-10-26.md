# GTFS stage diagnostics and Antigravity status — 2026-10-26

## Current verified state

- Server checkout: `MarshGO-Server`, branch `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; working tree already contains extensive unrelated/ongoing changes. Preserve them.
- Latest full Server unit run after retaining debug-only stage counters: **323 PASS, 0 FAIL, 3 opt-in skips** (326 total; 40.5 s). Skips are not passes.
- `npm run typecheck`: PASS. `git diff --check`: PASS at checkpoint.
- Frozen feed: Lviv archive SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`, 72 routes / 1,071 stops / 15,716 trips. Three controlled O/D replay result hashes remained identical to audit 279, with 3 serial repeats each. Every search is still bounded/truncated and returns the 100-result page limit. Timings used Node 25.4.0 and are diagnostic only, not a supported-runtime benchmark.
- GTFS diagnostic counters now distinguish graph demand, trip-level generation/retention, route-group offers/retention by five tiers, and final bounded candidate pool. The targeted diagnostic contract test passes. Example dense case estimated 415,997 graph candidates, retained 100,000, and kept search truncation visible.

## Experiment disposition

- A rank-first route-group retention experiment passed a synthetic adversarial example but was **rejected** after paired frozen-feed replay: route-chain diversity declined on all three O/Ds (45→32, 41→39, 36→32); some strategy winners also shifted. The experimental rank-first policy was removed. Current route-group selection remains the prior deterministic hash policy; debug-only stage counters remain.
- A behavior-equivalent extraction of trip-segment retention ranking was retained for reuse. No caps were raised and no truncation flag was hidden.

## Antigravity

- Inspected the actual Antigravity IDE Agent panel. It reports `Error: Agent process failed to restart after 5 consecutive crashes`; there is no active task. The workspace reports **635 pending changes**, including changes across `MarshGO-Site`, `MarshGO-Server`, and a separate `ag-work` checkout. Do not enqueue new work or merge/copy files while the agent is failed and provenance is unclear.
- The app window is open; that does not mean its agent process is running. This explains the idle state. Recovery should be checked before delegating one small read-only task; confirm the task visibly starts before counting it as active.

## Exact next action

Design a distinct stratified candidate-pool sampler that preserves temporal-transfer relevance while retaining route/time diversity; do not repeat hash-only, global rank-first, shared-frontier, baseline-seeded, lazy-label, or topology-pruning variants already evaluated. First prove exact small-feed identities, fare/service-date/realtime/pathway semantics, and all FASTEST/CHEAPEST/BALANCED winners. Only then compare against the frozen feed on the same three O/Ds, reporting route-chain recall, winners, every truncation flag, latency and RSS. Keep production status `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Source fingerprints at checkpoint

- `server/journey/gtfsTimetable.ts`: `94780a139c009e4d990381361767a162e2ec40f68b957dfd59ba7abab7bb2438`
- `server/journey/boundedTripRetention.ts`: `af4527465b25be317d34e7c1412b2393d6722a18dcd71f518bff746b88367e32`
- `tests/gtfs-timetable.test.ts`: `89e96e1dac412df711a54ff509b643e0f0fbad1ea5f1a66dc9e3878eff6f1cfc`
