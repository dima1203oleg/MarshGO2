# GTFS dense graph query-relevance profile — 2026-10-26

## Exact replay

- Clean source: Server PR #45 candidate `cb16fe8352c78917eaf6d89f675d6ae58461916f`; no production code was changed during this probe.
- Frozen Lviv archive SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Used the same three O/D pairs as the five-repeat release-candidate replay, with one diagnostic iteration each, a six-hour horizon and at most two transfers.
- Temporary local-only instrumentation classified every generated stop-pair segment using existing first-side/last-side reachability helpers with zero extra transfer buffer (optimistic for counting; not used to omit candidates or alter returned routes). The instrumentation and dependency symlink were removed afterward; the candidate checkout is clean.

| O/D | Generated segment opportunities | Retained graph | Direct | First-leg only | Middle by both query sides | Last-leg only |
|---|---:|---:|---:|---:|---:|---:|
| Maloholoskivska–Sykhiv | 415,997 | 100,000 | 240 | 18,838 | 205,316 | 16,630 |
| Naukova–Sykhiv | 214,869 | 99,949 | 1,208 | 20,733 | 141,429 | 13,183 |
| Rynok–Dubliany | 258,070 | 100,000 | 384 | 20,700 | 91,065 | 1,931 |

For each replay, the production debug fields still showed `segmentGraphTruncated=true`, `searchBudgetTruncated=true`, and `candidateSamplingTruncated=true`. Observed search steps were well below the 1,000,000 hard step cap. The principal limit is not fixed by merely keeping direct and first/last legs; the query-relevance middle set itself remains over the current 100,000 graph budget on all three O/Ds.

## Decision / next engineering gate

- Do not ship an optimistic segment filter or increase the graph cap by guesswork. First-leg/last-leg probes are necessary but not sufficient proof for paths with up to five transit legs, pathway/nearby transfers, in-seat rules, realtime events, and fare ranking.
- Next: prototype an on-demand, stop-event-based candidate generator in an isolated branch. Preserve a complete tiny-feed oracle for all returned route chains, fare allocations, transfer rules/pathways, service dates, and OPTIMAL/FASTEST/CHEAPEST winners; then compare all three frozen O/Ds, latency, peak RSS, candidate recall, and honest truncation behavior. Keep the current serving implementation untouched until the prototype passes.

Production remains `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
