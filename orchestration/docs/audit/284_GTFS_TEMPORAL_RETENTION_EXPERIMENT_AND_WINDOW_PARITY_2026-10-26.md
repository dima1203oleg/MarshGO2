# GTFS temporal-retention experiment and stop-pair window parity — 2026-10-26

## Scope and baseline

- Server checkout: `MarshGO-Server`, branch `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`.
- The checkout already contains extensive unrelated dirty work. No bulk reset, cleanup, or whole-file restore was used.
- Frozen Lviv feed archive: SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.

## Rejected experiment

A temporary 15-minute temporal-wave ordering was applied to bounded whole-trip retention, while keeping the five feasibility tiers and graph limits. One warmup plus one measured replay per O/D on Node `v25.4.0` produced:

| O/D | trip chains | route chains | result ID hash | Previous baseline (audit 282) |
|---|---:|---:|---|---|
| Holosko → Sykhiv | 60 | 44 | `f5480e9c32fb2e4eb8a072637016cc3020c991c8210e5bb236a59d7f8628904a` | 63 / 45; `53b9c9ed…` |
| Naukova → Sykhiv | 55 | 38 | `663d4cf6faf9855120997621d7a4f9ccc85ff72d2be7aef4d3f6b6ff12d4657d` | 58 / 41 |
| Rynok → Dubliany | 60 | 33 | `44676a83dcac6f61aab31afec5417e9282acfc2db499155fe7c2b4d1e0b9ffd7` | 66 / 36 |

All three remained search-truncated and at the 100-result page cap. The temporal buckets looked more evenly represented, but useful route-chain diversity declined on all three O/D pairs. **Reject and remove this serving algorithm.** Timing is diagnostic only because the runtime was Node 25.4.0 and the replay had one measured repeat.

The temporal-wave code/test was removed surgically. It is not part of the current implementation.

## Antigravity review and accepted correction

- A narrow read-only Antigravity task was sent in a new conversation, visibly started, and selected `Gemini 3.8 Flash Medium`. The workspace still shows 636 pending changes across several checkouts, including `ag-work`; none were copied or accepted.
- Its partial review identified a parity risk between the prepass used to estimate route graph budgets and the actual stop-pair materializer: the materializer omits pairs beyond 20 stops only when transfers are allowed, but the prepass applied that omission regardless of transfer count.
- Independently verified both code paths and fixed the mismatch by extracting the shared predicate `shouldOmitGtfsStopPairBeyondLocalWindow` and using it in both locations. This preserves long direct stop pairs in zero-transfer searches and preserves the existing bounded rule for transfer searches.
- Antigravity also questioned Tier 0's endpoint flags. A trial requiring one retained segment to match both exact query endpoints reduced useful chain counts (Holosko→Sykhiv 63/45→63/44; Naukova→Sykhiv 58/41→52/34; Rynok→Dubliany 66/36→61/32). The original result hashes and all three winner identities returned when the previous tier policy was restored. **Reject and remove the Tier 0 change**; it discarded useful options without improving the observed winners. This remains a prioritization heuristic, not evidence that an invalid itinerary is emitted.
- Strengthened the constrained-budget survivor oracle: it captures the final retained graph and asserts that the exact feasible middle trip survives while the schedule-infeasible lower-hash decoy is absent before traversal. This localizes that fixture's result to the graph-retention stage rather than merely checking final output.
- Two other Antigravity findings were not supported by the code: `retainBoundedTripGroup` loops over cumulative evictions and correctly aborts if it would need to evict a group the candidate does not outrank; the `retainedTripSegmentsByRetentionTier` diagnostic counts whole-trip group retention, while overflow additions have separate `overflowSegmentsRedistributed` counters. Neither was changed.
- Added a focused regression test for zero transfers, distant non-destination pairs with transfers, and distant requested destinations.
- Antigravity completed its short read-only review, but its current IDE later reported `Agent process failed to restart after 5 consecutive crashes` and showed 637 pending changes across multiple roots. No files were accepted from that workspace; do not queue new work until it is healthy and ownership is clear.

## Verification

- `npm run typecheck`: PASS.
- Final current-tree full `tests/gtfs-timetable.test.ts` + `tests/journey-search-completeness.test.ts` after restoring the original Tier 0 policy and strengthening the graph-stage oracle: 81 PASS / 0 FAIL / 0 SKIP (29.1 s).
- `npm run typecheck`: PASS; `git diff --check`: PASS.
- No staging, production deployment, or live provider query was run.

## Current source fingerprints

- `server/journey/gtfsTimetable.ts`: `c522db549bd23f3177997d42de01fc27b63da64343d1d60e9a693e96469f4ed6`
- `server/journey/boundedTripRetention.ts`: `af4527465b25be317d34e7c1412b2393d6722a18dcd71f518bff746b88367e32`
- `tests/gtfs-timetable.test.ts`: `966f2f138a93a7fb7d1937e015c274761ddeea7dbee26dfdf058a5569d6e60d6`

## Next exact action

The final current-tree GTFS suite passed 81/81 with typecheck and diff-check. Next, continue from audit 283's stage-by-stage candidate-survivor oracle. Do not repeat global rank-first, temporal-wave, or exact-endpoint-only Tier 0 selection. Keep every truncation flag truthful and production `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
