# Audit 226 — Lviv GTFS access-stop selection A/B — 2026-10-26

## Current-source baseline

- Repository `MarshGO-Server`, branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; existing dirty source preserved.
- Runtime Node `v24.22.1`; frozen Lviv feed SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` (72 routes, 1,071 stops, 15,716 trips).
- Ran the same three deterministic O/D queries as the existing route-repeat benchmark, 30-minute departure window, maximum two transfers, limit 100. Three repeats per O/D returned stable ordered ID hashes and stable FASTEST/CHEAPEST/BALANCED identities. Search was partial in all cases.

| O/D | Median of 3 | Trip chains | Route chains | Truncation flags |
|---|---:|---:|---:|---|
| Holosko → Sykhiv | 2,130 ms (samples 1,489–2,542 ms) | 72 | 62 | access stop selection, per-depth search budget, 2,500-candidate pool, route-chain sampling, long segment span, response page |
| Naukova → Sykhiv | 824 ms (823–831 ms) | 59 | 43 | same as above except global 50,000 step ceiling not hit |
| Rynok → Dubliany | 1,495 ms (1,387–1,565 ms) | 63 | 45 | same flags plus global 50,000 step ceiling |

## Isolated experiment

Copied the current timetable implementation to a temporary module and changed only `MAX_STOPS_PER_SIDE` from 20 to `Number.MAX_SAFE_INTEGER`, thereby retaining every stop inside the existing configured access/egress walk radii. The experimental module was deleted after the replay; no product source or Git history was changed.

- The stop-selection truncation flag cleared on all three requests.
- All requests still returned 100 and remained truncated due to per-depth budget, result-pool/sampling and long-segment bounds. No request became complete.
- Returned route-chain diversity changed from 62/43/45 to 61/43/39; trip-chain diversity changed 72/59/63 to 68/51/54.
- Candidate identity hashes changed; FASTEST/CHEAPEST stayed identical on Holosko and Naukova, while the balanced identity on Holosko and some Rynok strategy identities changed. The experiment has no exhaustive dense-feed oracle to validate those replacement identities.
- Instrumented replay still built 194,355–415,838 segments, used 35,469–47,752 search states and reached the 2,500-candidate pool. Runtime was mixed (about 0.8–1.7 s in the benchmark's timed function; debug instrumented full stage totals were about 1.7–3.0 s). Single-sample variant timings are not a performance claim.

## Decision

Rejected the “remove the stop cap” change. It removes one truncation cause but neither completes the search nor improves returned chain diversity consistently, and it changes strategy candidates without proving those identities against an exhaustive dense-feed oracle. The production worktree remains unchanged and truthful partial-search flags stay enabled.

## Verification

- Current source Server unit suite: **239 PASS / 0 FAIL / 1 opt-in integration SKIP** (240 tests total), Node 24.22.1.
- Current source Server `tsc --noEmit`: PASS; ESLint: PASS.
- Baseline frozen-feed replay: three repeats per O/D with stable identities/hashes. Variant replay: one timed result per O/D plus instrumented truncation counters.
- No integration, external feed, staging, production, or physical-device claims are made by this audit.

## Next work

Profile the retained depth-first search's transfer-candidate traversal and per-state allocations; improve only a measured hot path without changing itinerary semantics. Benchmark one frozen O/D at a time with wall-time and peak RSS bounds. Any successor search must first pass the exhaustive one/two-transfer oracles, then repeated paired frozen-feed identity, winner, route-chain recall, truncation, latency and RSS comparisons. Keep bounded/partial disclosure until those checks prove completeness.

## Rejected shared-frontier prototype

A temporary rewrite of the bounded depth-first path walk was evaluated without changing product source. The first draft queued all feasible children and exceeded the Node heap limit (~2 GB) on the frozen city replay. Adding per-first-leg pending-state bounds preserved the small deterministic tests (44/44 PASS, including exhaustive one- and two-transfer oracles), but the three-OD replay was still running after 66 seconds for the full three-repeat batch; it was stopped as an isolated benchmark, not as a product process. This is materially slower than the current source baseline (under 2.6 seconds per query) and fails the performance acceptance bar. Both generated temporary files were removed; current source and user work remain unchanged.

Decision: reject this frontier implementation. A replacement must avoid materializing/enqueuing transfer permutations, reuse transfer expansions, and preserve deterministic strategy winners under a bounded memory/time budget. Required next benchmark: run one O/D at a time, publish per-query wall time and peak RSS, then do the paired three-repeat comparison only if each query stays within the established latency range.

## Rejected mutable DFS allocation optimization

A second isolated prototype kept the existing depth-first order and transfer rules, but reused one mutable path/visited set per recursion instead of copying path arrays and allocating two sets at every search node. It cloned the segment list only when storing an itinerary (without that, the exhaustive test exposed aliasing). The exact GTFS suite then passed **44/44**, including all exhaustive transfer oracles.

Three repeated runs per frozen Lviv O/D returned the same ordered candidate hashes and strategy winners as baseline, and the same route-chain counts (62/43/45). Runtime medians in this run were Holosko→Sykhiv **2,015 ms** vs baseline **2,130 ms**, Naukova→Sykhiv **1,222 ms** vs **824 ms**, and Rynok→Dubliany **1,587 ms** vs **1,495 ms**. Timings varied across repeats; one query regressed 48%, so the allocation change does not meet the no-regression bar and was rejected. The generated prototype/test files were removed; product source was not changed.

Next: analyze the current candidate admission/sampling boundary (2,500 candidates, per-route-chain cap, endpoint-stop selection, and segment span) and design a cheaper relevance/dominance mechanism that retains exact oracle semantics. Require per-OD benchmark latency and peak RSS plus identical/recalled strategy winners before integration; keep `searchTruncated=true` meanwhile.
