# GTFS queue pruning A/B — 2026-10-20

## Питання

Чи дає видалення вже вичерпаних route queues у циклі candidate-search відтворюване прискорення або зміну результатів на п'яти однакових коридорах?

## Входи та метод

- Статичний відкритий GTFS Львова: `/tmp/marshgo-lviv-static-20261020.zip`, SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Node `24.21.0`.
- Baseline: Server commit `4a9015c476cc8ead44617c4544456a5cbf1a8f06` (route-budget baseline; actual full SHA rechecked before recording below).
- Variant: Server commit `f235ca91c75996bd2d5645642780ba7467a7574c` (`perf: prune exhausted GTFS route queues`), one parent change only.
- Five static GTFS coordinate queries: station→Sykhiv, center→Dubliany, center→south terminal, Nauka→Sykhiv, center→Pidzamche. Departure window 08:00–08:30 Europe/Kyiv on 2026-10-20; journey horizon 3h; max 4 transfers; access/egress 900m; transfer walk 400m; output limit 100.
- Each process parsed the same archive and ran the five queries sequentially; the command was repeated once per variant. This is a small diagnostic A/B, not a load/performance SLO test. The two checkouts were not both warm-started in one randomized multi-round benchmark.

## Results

| Коридор | Baseline ms | Variant ms | Baseline/variant first-100 ID hash | Best duration, both | Truncation, both |
|---|---:|---:|---|---:|---|
| Station → Sykhiv | 3,317 | 3,369 | `e9da7514…` identical | 3,124 s | graph + result + search |
| Center → Dubliany | 3,354 | 3,350 | `05cd7812…` identical | 2,743 s | graph + result + search |
| Center → south terminal | 3,069 | 3,210 | `ed14d206…` identical | 1,816 s | graph + result + search |
| Nauka → Sykhiv | 2,709 | 2,788 | `6176f07d…` identical | 2,104 s | graph + result + search |
| Center → Pidzamche | 2,781 | 2,816 | `603df8ce…` identical | 784 s | graph + result + search |

Median measured search time was 3,069ms baseline and 3,210ms variant (+4.6% in this single ordered pass). That difference is not statistically conclusive. All five first-100 ordered itinerary ID lists were byte-for-byte equivalent by SHA-256. Every query still returned 100 and `searchTruncated=true`, `resultLimitReached=true`, and `candidateGraphTruncated=true`.

## Independent correctness checks

On variant commit `f235ca91c75996bd2d5645642780ba7467a7574c`, Node 24.21.0 `npm test`: 263 passed, 0 failed, 3 opt-in database/Redis integrations skipped; `npm run typecheck` and `npm run lint` passed. Dependency install required isolated `npm ci --ignore-scripts`, which reported 0 vulnerabilities. This validates the branch's local unit contract, not staging or production.

## Decision

Do not cherry-pick this optimization into Server PR #21. It made no observable improvement to the same result set and the one-run median was slightly slower; repeat randomized warm/cold benchmarking with more samples and broader feeds only if queue iteration is still measured as a bottleneck. It does not address the actual unresolved problem: bounded GTFS graph/search truncation. Production Server source and release candidate were not changed by this experiment.
