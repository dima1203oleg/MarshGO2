# Audit 228 — GTFS route-chain portfolio sampling rejected — 2026-10-26

## Experiment

Tested an isolated replacement for the first-eight-per-route-chain policy. It kept up to eight candidates using a portfolio of the first-seen departures plus fastest, cheapest-known- fare and BALANCED anchors. Sampling loss remained explicitly marked. No product source was modified.

## Exact small-feed evidence

- The temporary GTFS suite passed **46/46**, including the one-transfer and two-transfer exhaustive oracles, all three strategy winners, the existing route-chain-cap regression, and a new sampler check that retained both fastest and later cheapest candidates.
- This established only local sampler behavior; the dense-feed replay is the decisive check for the production candidate pool.

## Frozen Lviv replay

- Feed SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; Node 24.22.1; three repeated searches per O/D.
- Compared with audit 227's current-source baseline:

| O/D | Baseline median | Portfolio median | Route chains baseline → variant | Trip chains baseline → variant |
|---|---:|---:|---:|---:|
| Holosko → Sykhiv | 1,738 ms | 2,322 ms (+34%) | 62 → 32 | 72 → 38 |
| Naukova → Sykhiv | 980 ms | 1,407 ms (+44%) | 43 → 27 | 59 → 34 |
| Rynok → Dubliany | 1,389 ms | 2,060 ms (+48%) | 45 → 33 | 63 → 46 |

- Ordered candidate hashes and winners were stable within the variant's three repeats, but changed from baseline. Holosko FASTEST/CHEAPEST winners and Naukova BALANCED changed.
- All O/D queries still returned 100 and remained `searchTruncated=true`; the experiment did not establish completeness.

## Decision and next action

Rejected. Retaining strategy anchors independently inside every route chain changed the global result pool and reduced visible route-chain diversity, while also adding 34–48% median latency. Generated temporary source/test files were removed; the current dirty Server source and prior user work are unchanged.

Next candidate must allocate the bounded global result pool across route chains and strategies, so local extrema do not crowd out global transport-chain diversity. Validate with the exhaustive oracles, all three ranking winners, repeated route-chain recall, latency and memory; keep all incomplete-search diagnostics truthful.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
