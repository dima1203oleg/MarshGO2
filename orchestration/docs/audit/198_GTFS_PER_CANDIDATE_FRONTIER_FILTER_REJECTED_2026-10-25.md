# Per-candidate GTFS frontier filter rejected — 2026-10-25

## Experiment

- Isolated worktree branch: `codex/gtfs-query-feasible-edge-screen-20261025`, based on exact Server PR #41 SHA `70e11d8d8730e54311f13d73953ab565fd6b432a`.
- Hypothesis: for searches capped at two transfers, discard candidate segments that are neither a passenger-catchable origin leg, a destination leg, nor an event with both query-origin and query-destination transfer reachability.
- The filter reused the production `hasPriorEvent` and `hasNextEvent` checks for every candidate edge before bounded graph retention. It did not change behavior for requests allowing more than two transfers.

## Results

- The experiment preserved the targeted complete two-transfer, nearby-stop, pathway-direction, forbidden-transfer, and minimum-transfer tests. TypeScript and ESLint passed. After adjusting the small-budget assertions to reflect the pruned candidate space, the exact GTFS timetable suite passed **76/76**. These results only applied to the experimental source; no source change was retained.
- On the frozen Lviv archive SHA `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`, one Holosko → Sykhiv run took **9.34 s** versus the unmodified exact-PR diagnostic at **3.15 s** on Node `v25.4.0`; it reported RSS **650 MB** versus **268 MB** in the earlier non-alternating baseline run. This is a single diagnostic pair, not a stable performance estimate.
- A second Naukova → Sykhiv run took **8.50 s** versus the earlier **2.05 s** diagnostic on the same Node runtime. The second RSS observation was lower than the earlier baseline, so no general RSS conclusion is drawn from these non-alternating single runs.
- Both completed OD runs still reported `searchTruncated=true` and `candidateGraphTruncated=true`, returned different ordered IDs, and changed strategy winner identities. The third replay was stopped after the regression was clear; no result is claimed for Rynok → Dubliany.

## Decision

- **REJECTED; no implementation retained.** Per-candidate calls to the event-frontier scans multiply work and do not remove the hard graph truncation. The experiment worktree was restored clean to the base SHA; no commit, push, PR, manifest, or release status change.
- Keep the exact event/transfer semantics and replace per-edge frontier scans with a batched/indexed query-reachability structure before testing another materialization filter. Compare with the exhaustive small-feed oracle and run alternating baseline/candidate frozen-feed replays before accepting any change.
- Evidence limits: Node `v25.4.0`, two non-alternating single OD comparisons, no production/staging or supported-runtime benchmark. `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
