# Audit 230 — transfer-node array index prototype rejected — 2026-10-26

## Experiment

- Isolated `outgoingByTransferNodeId` as arrays rather than per-node `Set<GtfsDirectJourney>`, while de-duplicating equivalent primary/parent transfer node IDs when the list is constructed.
- Product source was not changed. The experiment used temporary Server source and test copies; those generated files were removed.

## Evidence

- Node `v24.22.1`: copied GTFS suite **45/45 PASS**, including exhaustive one- and two-transfer path identity and all three strategy-winner oracles.
- Frozen Lviv archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; three repeats per O/D. Ordered ID hashes, FASTEST/CHEAPEST/BALANCED winners, trip-chain and route-chain counts exactly matched current source. All requests remained truncated.
- Compared with the current-source three-repeat replay from audit 229, prototype median elapsed times were higher on every O/D: Holosko→Sykhiv **1,900 ms vs 1,670 ms** (+14%), Naukova→Sykhiv **932 ms vs 832 ms** (+12%), and Rynok→Dubliany **1,475 ms vs 1,405 ms** (+5%). Separate process timings are noisy; this is not an SLA, but there is no evidence supporting the change.
- `/usr/bin/time -l` observed about **782 MB maximum RSS** for the prototype's three-query replay process. No paired baseline RSS was captured, so no memory-reduction claim is made.

## Decision and next action

Rejected. The representation preserved semantics but did not improve latency in this comparison and did not clear any truncation cause. No prototype source was retained.

Next: investigate reducing the count/size of materialized transit segments before constructing the outgoing indexes. Keep current code as the reference; prove all tiny-feed oracle paths/winners, then measure frozen-feed identity/recall, truncation causes, paired latency and peak RSS. Do not replace sets with arrays again without a measured reason.

No commit, push, merge, staging or production deployment. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
