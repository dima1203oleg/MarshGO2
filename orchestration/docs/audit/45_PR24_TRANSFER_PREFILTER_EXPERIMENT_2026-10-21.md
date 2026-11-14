# GTFS transfer prefilter prototype: rejected

Date: 2026-10-21 (Europe/Kyiv)  
Server exact baseline: PR #24 `c33651b1387e0d2b377216a0b88f6ae02cdbec32`  
GTFS input: frozen Lviv snapshot SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`

## Hypothesis

`expandNextChild` checks transfer feasibility for each candidate connection. I tested caching a feasibility-filtered transfer candidate list per exact previous trip/event, also pruning candidates beyond the maximum wait/horizon. The transfer-decision function itself was unchanged; the experiment aimed to avoid repeated infeasible checks while enumerating the same previous segment through multiple prefixes.

## Results

The existing focused GTFS suite passed **60/60** with the prototype. On Node 25.4.0, the two diagnostic corridors returned 100 results and still reported search truncation. Naukova→Sykhiv used 483,521 search steps and reached the ranked stage at 9.26 seconds; Center→Dubliany used 568,990 steps and reached it at 17.72 seconds. Peak RSS at that stage was about 540 MB and 515 MB respectively. These are single diagnostic runs, not latency percentiles; they cannot be compared directly to the Node 24.21.0 official benchmark.

Although the internal step counter fell, the prefilter performed substantial eager work and keyed more per-event candidate arrays. The observed wall time was poor, so the prototype is rejected. No result-winner-equivalence claim is made; the experiment does not establish improvement or production readiness.

## Cleanup

The prototype and temporary script were removed. The isolated Server worktree is restored to clean exact HEAD `c33651b1387e0d2b377216a0b88f6ae02cdbec32`; no product code was committed. Continue with a different design that reduces repeated enumeration without eagerly evaluating every transfer edge, and validate output set equality/recall against exhaustive small-feed oracles before benchmarking all five frozen corridors.
