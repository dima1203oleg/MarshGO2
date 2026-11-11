# Audit 282 — Current GTFS replay and small-feed oracles

Date: 2026-10-26

## Exact scope

- Server repo: `MarshGO-Server`, branch `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0` (two commits ahead of origin at observation time).
- The working tree was already dirty. Current SHA-256: `server/journey/gtfsTimetable.ts` = `3573caf330b965097cdfddb83e56e3c2bd360978fa81c862e79459d8bc7a0b29`; `tests/gtfs-timetable.test.ts` = `4e8f8e760a1e78b08ebfe36a672e4ffbcd73c1b1042f469211ea7e48c2869037`. This differs from the audit 279 checkpoint fingerprints; no files were overwritten in this audit.
- Frozen feed: `/private/tmp/marshgo-lviv-gtfs-current-20261025.zip`, SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; parsed counts: 72 routes, 1,071 stops, 15,716 trips.
- Runtime was Node `v25.4.0`, not the repository pin `24.21.0`; timings are diagnostic and not comparable with supported-runtime performance results.

## Deterministic tests

Command:

```sh
node --import tsx --test --test-name-pattern='exhaustive|candidate pool|candidate-pool|late cheapest|globally cheapest|three-leg option|strategy winners|pathways, transfer rules' tests/gtfs-timetable.test.ts
```

Result: **8/8 PASS**, 0 skipped, 28.3 seconds total. It covered bounded-pool late-cheapest/direct/three-leg cases, exhaustive one- and two-transfer path identity, all three ranking winners, production materialization parity, fare and deterministic pathways/transfer/realtime semantics. The dense three-leg candidate-pool test took 27.4 seconds, so avoid overlapping heavyweight work.

## Current frozen-feed replay

Used `.tmp-route-repeat-bench.mts` read-only, with one warmup and three measured serial runs per O/D, exact archive SHA above, 30-minute departure window, six-hour horizon, at most two transfers, and a 100-result request.

| O/D | Search ms, 3 serial runs (Node 25.4; diagnostic only) | Ordered result hash (all three repeats) | Unique trip/route chains | Truncation |
|---|---:|---|---:|---|
| Holosko → Sykhiv | 2,430.93 / 2,094.95 / 1,960.14 | `53b9c9edbe7bad93e6300a5705f15ba5428b5bdf537d7ffb21de990c836429b6` | 63 / 45 | yes; 100 returned |
| Naukova → Sykhiv | 1,440.31 / 1,639.82 / 1,590.69 | `fe39dcd31269de4f43df03129f0c5c8b67ce5f792978399ead639070cf9601d4` | 58 / 41 | yes; 100 returned |
| Rynok → Dubliany | 2,918.10 / 3,162.70 / 2,838.40 | `db4a6ec11cd1dacb2af253ab61739054d1819e2ac501ed3f8672b2e571ae9661` | 66 / 36 | yes; 100 returned |

All ordered hashes match audit 279. FASTEST/CHEAPEST/BALANCED winner identities were stable within each three-run group. This establishes reproducibility and no observed result-ID regression against that checkpoint; it does not establish candidate completeness, global optimality, production readiness, or performance improvement.

## Current bottleneck counters (Holosko → Sykhiv, debug run)

- Estimated graph demand `415,997`; built exactly `100,000` segments across 70 routes, so `globalGraphBudgetBinding=1` and `segmentGraphTruncated=1`.
- 30 route allocations were underfilled and 809 overflow candidates redistributed; the overflow reservoir retained 6,522 candidates and 31 route reservoirs were at their cap. Per-route segment ceiling was 5,000.
- Search visited 109,242 steps (hard ceiling 1,000,000 not reached); 411 first legs and 1,611 candidate results were considered. Per-leg candidate-pool milestones were 37,779 (2 legs) and 84,242 (3 legs). `searchBudgetTruncated=1`, `candidateSamplingTruncated=1`, `candidateResultLimitReached=0`, `searchTruncated=1`.
- Peak observed debug RSS was about 576 MB during segment construction; this is one diagnostic process, not a load test.

## Engineering conclusion and next step

The current dirty source already has proportional graph budgets, per-trip/per-route bounded retention, overflow reservoirs and redistribution, round-robin first-leg route-group search, and objective reservoirs. Do not repeat those as though absent. Do not raise graph/search caps or change transfer semantics.

Next, identify which precise candidate-retention stage discards the exhaustive small-feed winners under production-shaped pressure. Add/extend a bounded synthetic oracle that records each stage's survivor set and proves an improved retention/scheduling rule preserves exact path identity, fare, service date, realtime, pathway, and all three strategy winners. Only then run a supported-runtime paired frozen-feed replay. Until a candidate improves useful-chain/winner recall without hiding truncation or materially regressing CPU/RSS, preserve current serving code.

Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
