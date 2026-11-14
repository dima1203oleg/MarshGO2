# PR #24 Lviv GTFS search-limit sweep

Date: 2026-10-21 (Europe/Kyiv)  
Committed Server baseline: `27ca486d66fa9b30b8559e4b1041ccca67f1d283`  
Feed SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`  
Purpose: determine whether the observed dense-feed truncation can be resolved safely by increasing existing sampling bounds.

## Baseline and observed bottlenecks

On the frozen Малоголосківська→Сихів query, the baseline returned 100 options and 37 route-name chains. It explicitly reported `searchTruncated=true` and `candidateGraphTruncated=true`; FASTEST, CHEAPEST, and BALANCED all selected the same BUS→TRAM winner. Stage diagnostics estimated 216,735 graph segment opportunities against a 100,000 total budget. Candidate enumeration also saturated bounded pools. The feed archive used here matches the current download byte-for-byte, but a static download does not certify freshness or live vehicle availability.

Diagnostic counters and experiments were run in a temporary detached Server worktree. The code at the official PR worktree remained clean. Some timing tests used Node 25.4.0 and must not be treated as pinned-runtime performance acceptance.

## Rejected limit changes

| Change | Scope | Result | Decision |
|---|---|---|---|
| Route-pattern stop cap 8→12 | Same Lviv corridor, three repeats | Same 100-result response, 37 chains, same three strategy winners; median timing essentially unchanged (~3.50 s). | Reject: no recall gain. |
| Graph total/per-route 100k/5k→120k/6k | One corridor | Estimated graph grew from 98,031 to 117,496 retained segments, but the response still had 37 chains and the same winners; search remained truncated. | Reject: more work without better result breadth/winners. |
| Per-route segment cap 8k | One corridor | Chain count fell 37→30; same winners and truncation. | Reject: worse breadth. |
| Per-route segment cap 4k | One corridor | Chain count 35; same winners and truncation. | Reject: worse than baseline. |
| Objective reservoir 100k→200k | Six corridors; see report 47 | Median elapsed time grew 4,348→6,000 ms (~38%); 32 chains appeared and 33 disappeared across the capped results (net −1); winners unchanged; 4/6 searches hit the hard one-million-step limit. | Reject: slower without aggregate coverage or winner improvement. |

Full six-corridor details and methodology are in [report 47](47_PR24_LVIV_OBJECTIVE_RESERVOIR_100K_200K_AB_2026-10-21.md). Route-pattern cap details are in [report 46](46_PR24_LVIV_ROUTE_PATTERN_CAP_AB_2026-10-21.md).

## Conclusion and next step

Keep the committed finite limits and keep returning the partial-search signal. Do not increase caps or suppress truncation. A worthwhile change must alter candidate selection or search structure, rather than enumerate the same dense graph for longer. Next, prototype query-directed dominance/label search in isolation and compare it with the exhaustive small-feed oracle before measuring the same six frozen corridors on the pinned Node 24.21.0 runtime. No production readiness or complete Lviv route recall is established by these diagnostics.
