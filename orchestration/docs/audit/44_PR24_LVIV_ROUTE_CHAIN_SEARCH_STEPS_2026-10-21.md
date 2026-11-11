# Route-chain cap diagnostic: bounded search steps

Date: 2026-10-21 (Europe/Kyiv)  
Server candidate: PR #24, exact baseline `c33651b1387e0d2b377216a0b88f6ae02cdbec32`  
Feed: frozen static Lviv GTFS snapshot SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`

## Question and method

The earlier cap sweep showed that route-chain cap 3/4 was slower than cap 8 on most corridors, but did not identify why. I instrumented the same search with the cap temporarily set to 3 and recorded its internal search-step counters for Naukova→Sykhiv and Center→Dubliany. No request/result data was changed. This focused diagnostic ran under Node 25.4.0; it is not a release-runtime or latency benchmark. The committed Server baseline uses Node 24.21.0 and route-chain cap 8.

## Findings

| Corridor | Cap | Search steps | Candidate pool reached by leg count | Max queued work | Search-step ceiling hit |
|---|---:|---:|---|---:|---|
| Naukova→Sykhiv | 3 | 922,511 | 3: 419,531; 4: 597,070; 5: 822,511 | 15,988 | No |
| Center→Dubliany | 3 | 1,000,000 | 3: 331,768; 4: 589,967; 5: 940,285 | 29,761 | Yes |

The Naukova run kept 100 results and reported `candidateSamplingTruncated=true`, `segmentGraphTruncated=true`, and `searchTruncated=true`. Center→Dubliany hit the one-million-step search ceiling and also remained truncated. The earlier cap-8 debug run recorded 589,757 steps for Naukova→Sykhiv and 782,833 for Center→Dubliany. Step counts are deterministic search-work counters; compare wall-clock times only within the repeated Node 24.21.0 sweep in report 43.

## Interpretation

Lowering the route-chain cap does not reduce enumeration cost. The full route-chain sample reaches its quota sooner; subsequent unseen candidates can bypass the general bounded-result admission condition so that the sampler can consider replacements. The result is more unique route-name chains in the returned sample, but more queued work is explored before the search reservoirs stop it. On one corridor this reaches the hard one-million-step ceiling. The cap reduction is rejected; retain the committed cap 8.

This is a diagnostic, not a production algorithm change. A future optimization should separate (a) a bounded, per-objective replacement reservoir from (b) the global search-work budget, then compare complete feasible-chain recall and FASTEST/CHEAPEST/BALANCED winners against exhaustive small-feed oracles, while reporting truncation. Do not mark dense-feed search complete from this experiment.

## Cleanup and next action

The temporary source cap change and benchmark script were removed; the isolated Server worktree is restored to exact clean HEAD `c33651b1387e0d2b377216a0b88f6ae02cdbec32`. No production code or commit was changed. Next: implement a test-only, deterministic work counter or bounded reservoir prototype in a separate experiment, validate it against the exhaustive transfer fixture and all five frozen Lviv corridors, and accept it only if recall/winners are not lost and latency/RSS improve or stay within a stated budget.
