# Lviv bounded-search reservoir A/B: 100k vs 200k

Date: 2026-10-21 (Europe/Kyiv)  
Committed baseline: Server PR #24 SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283`  
Feed: official Lviv GTFS static archive, SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` (matches the frozen route-search snapshot).  
Runtime: Node 25.4.0; diagnostic only, not the pinned Node 24.21.0 release runtime.

## Method

Changed only `MAX_OBJECTIVE_RESERVOIR_SEARCH_STEPS` from 100,000 to 200,000 in a detached temporary worktree. Graph limits, route-pattern sampling, transfer rules, service window, and 100-result output cap were identical. Replayed six corridors at 2026-10-22 08:00–08:30 Europe/Kyiv, using GTFS stop coordinates for the endpoints: Малоголосківська→Центр Довженка, Залізничний вокзал→Сихів, Площа Ринок→Дубляни, Площа Ринок→Автовокзал, Наукова→Сихів, Площа Ринок→Підзамче. Each pair was run in one process, baseline first, using the exact same archive and query.

## Results

- Both settings returned 100 results and kept `searchTruncated=true`, `candidateGraphTruncated=true`, and candidate-sampling truncation for all six corridors.
- The 200k window introduced 32 route-name chains across the six responses but removed 33 chains from the same 100-result samples; net result-set breadth was **one fewer chain**. It changed which alternatives survived but did not grow aggregate coverage.
- FASTEST, CHEAPEST, and BALANCED winner IDs were identical between settings on all six corridors.
- Median measured search time rose from **4,348 ms** to **6,000 ms** (about **38%**). Four of six 200k searches hit the one-million-step hard ceiling; the remaining two stopped just below it at 932,797 and 981,681 steps.
- RSS was omitted from per-query conclusions because both settings were run sequentially in one Node process and retained diagnostic objects made memory accumulate across pairs. No production-sized memory claim is made.

## Decision

Reject a 200k reservoir window. It spends substantially more search time, changes sampled alternatives, does not increase aggregate route-chain coverage or strategy winners, and pushes most requests to the hard step ceiling. Keep the committed 100k window and continue to report partial results. This diagnostic cannot prove exhaustive journey recall or production readiness.

The next algorithmic work should change how bounded work is prioritized or eliminate dominated partial paths; raising the same enumeration window is not an accepted improvement. Validate any prototype against the exhaustive tiny-feed oracle and the same six query set before considering a commit.
