# GTFS query endpoint allocation experiment — rejected

Date: 2026-10-25

## Scope

Isolated worktree: `/private/tmp/marshgo-gtfs-query-relevance-20261025`  
Branch: `codex/gtfs-query-relevance-budget-20261025`  
Base: PR #39 head `142ed4f76e9da94430048d4a31e7ad3962b4858b`  
Working tree contains an uncommitted experiment only; no push or PR update was made.

## Experiment

Added optional route allocation weights while preserving estimated candidate demand as the hard supply/per-route cap. The added weight came from scheduled stop-pair opportunities serving the query origin or destination. Added an allocator unit test for deterministic weighted shares and supply bounds.

## Evidence

- Node 24.21.0 typecheck: PASS.
- Targeted ESLint for edited files: PASS.
- Weighted allocator test: PASS.
- Combined focused GTFS/budget set: 80 PASS, 1 FAIL.
- The failing dense-interchange regression passes on the exact clean base `142ed4f76e9da94430048d4a31e7ad3962b4858b` and fails on this candidate at the assertion that the fixture is graph-truncated.
- Candidate diagnostics: 12 estimated segments, 3 graph slots, 3 retained segments, but only 3 eligible trips/segments were retained versus 4 eligible trips on base; the candidate no longer reaches the expected 3-leg chain. Its `candidateGraphTruncated=false` is therefore accompanied by loss of a useful route, not improved completeness.
- Frozen-feed replay was not run because the candidate failed the small-feed route-recall regression gate.

## Conclusion

Reject this weighting design. It overweights first/last endpoint-serving routes without measuring whether a middle route connects both endpoint event sets. The required next experiment must score time-feasible connector routes using origin-reachable arrivals and destination-reachable departures (while preserving transfer/pathway validation as final authority), then pass the small-feed exhaustive oracle and regression suite before any frozen-feed replay. No production readiness claim follows from this experiment.
