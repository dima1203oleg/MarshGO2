# GTFS connector reservoir key-index A/B — 2026-10-28

## Candidate and checks
- Repository: `dima1203oleg/MarshGO-Server`, PR #50, final candidate `e42f8f42b0fb2814cf1767cd591967b4530d2368`.
- Baseline: immediately preceding PR head `9d39d377891fd7624155e17d38232077da78a93f`.
- CI: exact candidate Server CI run `40747729154` passed. Earlier attempts on `73416741652b370dd5bf2094340a63150773506b` failed only ESLint `prefer-const`; behavior-preserving fix is in `e42f8f4`.
- Focused `bounded-trip-retention` test: 9/9 passed; diff check passed.
- Replay run `40747963352`, three paired and repeat-stable runs, pinned feed SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`, identical OD and UTC window.

## Result
- Ordered result identity parity: YES.
- FASTEST, CHEAPEST, BALANCED winner parity: YES; all reported winner metrics equal.
- Median search: 6538.51 ms → 6313.60 ms (-3.44%).
- Peak sampled RSS: 737.4 MiB → 697.2 MiB (-40.2 MiB, about -5.45%).
- Candidate reports `connectorReservoirItemsInspected=0`; graph, candidate-sampling, and search truncation remain unchanged.

## Decision and limits
Keep this isolated optimization in PR #50: it improves the immediately preceding head without changing route results. This does **not** accept the full PR against its original baseline; prior aggregate replay `40746820588` showed changed route winners and slower total search. PR #50 stays open; production stays `NOT_RELEASED` pending route-quality review and remaining staging/release gates.
