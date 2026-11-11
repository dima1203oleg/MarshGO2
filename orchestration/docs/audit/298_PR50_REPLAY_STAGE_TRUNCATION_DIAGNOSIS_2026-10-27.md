# PR #50 replay: stage-level truncation diagnosis — 2026-10-27

## Evidence

- Frozen replay: `/tmp/marshgo-replay-40589548325/frozen-lviv-gtfs-replay-ced95300438f17f60b608aee971c46f103552d12/replay-results.jsonl`.
- Candidate Server SHA: `ced95300438f17f60b608aee971c46f103552d12`; baseline: `f35a095b7e3ff424d96dfccec635c2ea3cbc2d2f`.
- Feed SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; fixed Lviv OD; three repeat-stable runs per SHA.
- On candidate runs the graph emitted 100,000 segments for estimated demand 425,855; all 70 candidate routes were graph-budget-limited. Four routes reached 5,000, three reached the per-route cap, and 36 routes were underfilled. Graph truncation was reported.
- Ranked search stopped at 116,248 steps, below its 1,000,000 step limit; max queued work was 5,629, below its 10,000 queue cap; the retained-candidate cap was not reached. Candidate pools reached their per-leg caps at steps 28,538 (2 legs) and 91,248 (3 legs). The search continues the objective-reservoir scan for a bounded 25,000-step window after saturation; the final 3-leg pool therefore stops exactly at 91,248 + 25,000 = 116,248 with pending work. This explains `searchBudget=true` for this replay without implying that the global step or frontier cap fired.
- Baseline and candidate both report graph, search, candidate-sampling, and response-page truncation. Candidate medians: 5,399.51 ms and 677.6 MiB sampled RSS; winners match the baseline, with one trip-chain identity added and one removed. See audit 297 for the exact replay table and scope.

## Interpretation and limits

This pins two independent bounded stages: the 100k graph cap binds against roughly 4.26x estimated demand; after graph construction, search also stops with pending work after its per-leg candidate/objective windows. The new connector fix is repeat-stable and near-neutral in median runtime, but this replay does not show a net route-chain increase and is not a completeness win. Do not raise graph or search limits from this evidence alone. The debug counters do not identify a specific omitted user-optimal trip chain, so a budget increase or serving change still needs an exhaustive bounded-feed witness and an exact pinned-feed comparison.

## Next action

Existing tests already cover deterministic demand-weighted allocation, redistribution of unused route capacity, a feasible chain under a three-segment budget, and a long query-relevant connector. The uncovered interaction is narrower: after query filters and whole-trip retention leave one route underfilled, does the bounded overflow on another route preserve the exhaustive FASTEST/CHEAPEST winner? Build a two-route deterministic feed with a fixed global cap, compare bounded results to exhaustive results, and assert the specific strategy winner and truncation flags. Change serving code only if this oracle proves a mismatch. Run the focused test and exact-head CI; repeat the pinned feed only if implementation changes.

No Server code, PR, branch, feed, or deployment changed during this diagnosis. The separate local Mac has critically low free memory, so no local build/test was started. Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
