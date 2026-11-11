# Current GTFS search-bound diagnostic — 2026-10-26

## Scope and identity

- Repository: `MarshGO-Server`, branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`.
- Dirty tracked diff was preserved; fingerprint for `server/journey/gtfsTimetable.ts` and `tests/gtfs-timetable.test.ts` at observation time: `1896c540cc5bd4ebb5c32a1006c1af00da839fc390a6d057d610aaebc9cb7f63`.
- Frozen Lviv GTFS archive: `/private/tmp/marshgo-lviv-gtfs-current-20261025.zip`, SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Result identities repeated three times serially per OD with Node `v24.22.1` (repository pins `24.21.0`). One separate Node `v25.4.0` debug run per OD recorded diagnostic counters only; its timing/RSS are excluded from comparisons. No live feed, DB, Redis, staging, or production was used.
- Verification on the same current dirty Server tree: GTFS timetable plus journey-search completeness oracles **80/80 PASS**; full `npm test` exit code **0** with dot reporter; `npm run typecheck` and `npm run lint` **PASS**. `MarshGO-Server` has no `check:production` or build script; an attempted nonexistent script exited before running checks. Opt-in DB/Redis integration was not run here.

## Repeated supported-major baseline

| OD | Median search ms (3 serial runs) | Ordered result hash, identical all 3 runs | Unique trip / route chains | Graph truncated | Search truncated |
|---|---:|---|---:|---|---|
| Maloholoskivska → Sykhiv | 2,285.03 | `53b9c9edbe7bad93e6300a5705f15ba5428b5bdf537d7ffb21de990c836429b6` | 63 / 45 | yes | yes |
| Naukova → Sykhiv | 1,631.06 | `fe39dcd31269de4f43df03129f0c5c8b67ce5f792978399ead639070cf9601d4` | 58 / 41 | yes | yes |
| Rynok → Dubliany | 3,003.72 | `db4a6ec11cd1dacb2af253ab61739054d1819e2ac501ed3f8672b2e571ae9661` | 66 / 36 | yes | yes |

All nine runs used the same frozen archive SHA, query date/window, transfer/walking limits, and production candidate code. Repeat timing ranges were 2,244.70–2,319.45 ms, 1,608.41–1,662.35 ms, and 2,936.36–3,133.71 ms respectively. This demonstrates deterministic output on these three queries, not complete candidate recall, global optimality, or a general latency SLA. Every query returned the 100-result page limit while marking search and graph truncation.

## Debug counters (one run per OD)

| OD | Estimated graph demand → built segments | Search steps / 1,000,000 hard ceiling | First legs | Candidate paths | Per-leg pool milestone steps |
|---|---:|---:|---:|---:|---|
| Maloholoskivska → Sykhiv | 415,997 → 100,000 | 109,242 | 411 | 1,611 | 2 legs: 37,779; 3 legs: 84,242 |
| Naukova → Sykhiv | 194,024 → 100,000 | 94,745 | 908 | 1,629 | 2 legs: 20,767; 3 legs: 69,745 |
| Rynok → Dubliany | 262,267 → 100,000 | 226,336 | 1,738 | 1,533 | 3 legs: 201,336 |

Every debug run reported `searchBudgetTruncated=true`, `candidateSamplingTruncated=true`, and `segmentGraphTruncated=true`, while `searchStepLimitReached=false` and `candidateResultLimitReached=false`. Thus the graph's fixed 100k budget is binding independently, and route search stops due bounded candidate/queue sampling well before the million-step ceiling. This narrows what a useful experiment must address; it does not prove that increasing any cap alone improves relevant recall.

## Next engineering direction

Do not repeat rejected shared-frontier, baseline-seeded, lazy event-label, topology-pruning, or cap-inflation experiments. Next, build an isolated candidate-pool scheduling prototype while leaving serving code, transfer authority, and current caps unchanged. First pass exhaustive small-feed path/fare/service-date/realtime/pathway and FASTEST/CHEAPEST/BALANCED winner oracles. Then compare against this exact frozen archive on all three OD pairs using repeated serial runs on the repository-pinned Node `24.21.0`, measuring route-chain and strategy-winner recall, explicit truncation causes, latency, and peak RSS. Reject changes that only spend a larger budget or hide truncation.

No production source was changed by this diagnostic. Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
