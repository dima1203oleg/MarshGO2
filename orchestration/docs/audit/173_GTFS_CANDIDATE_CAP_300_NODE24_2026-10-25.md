# GTFS candidate-cap 300 experiment on Node 24.21.0 — 2026-10-25

## Scope

- Server `feature/transport-layer-availability` at HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; dirty timetable SHA-256 restored to `9486b5f3f4e693acaa8e389bc105f081109b6e01af62f16f7f7502574794a1fe`.
- Frozen Lviv feed SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; same three ODs, 30-minute query, six-hour horizon, 2-transfer maximum and 100-result output as audit 172.
- Five repeats per OD under Node `v24.21.0`. The tested change raised the per-leg candidate cap from 200 to 300 only; all source and harness changes were reverted after measurement.

## Results against the 200-candidate baseline

| OD | Trip chains 200 → 300 | Route chains 200 → 300 | Median ms 200 → 300 | Baseline IDs kept in final 100 | Winners | Truncated |
|---|---:|---:|---:|---:|---|---|
| Малий Голоско → Сихів | 44 → 57 | 31 → 42 | 1,307 → 1,865 (+42.6%) | 72/100 | All 3 preserved | Yes |
| Наукова → Сихів | 52 → 56 | 41 → 42 | 707 → 809 (+14.4%) | 79/100 | All 3 preserved | Yes |
| площа Ринок → Дубляни | 38 → 34 | 24 → 26 | 954 → 1,362 (+42.8%) | 82/100 | All 3 preserved | Yes |

All five runs per OD had stable result IDs and strategy winners. The replay remained visibly incomplete. Cap 300 adds some chain diversity for two ODs but loses trip-chain diversity for the third; the timing cost is high and non-uniform. It is not a good default compromise and was rejected.

## Verification after reverting the experiment

- Full Server unit suite on Node 24.21.0: **233 pass, 0 fail, 1 opt-in local integration test skipped** (234 total).
- TypeScript typecheck: PASS.
- ESLint: PASS.
- `git diff --check`: PASS.
- The committed/dirty changes already present in the shared checkout were preserved. No routing change, commit, push, or deployment remains from this experiment.

## Decision

Do not continue scalar cap tuning as a proxy for a completeness fix. Implement an additive candidate-discovery/search strategy with explicit diversity and resource accounting, retain the current candidate pool before final selection, and validate exact chain/winner behavior against both the exhaustive tiny-feed oracle and frozen dense ODs. Keep current caps and `searchTruncated` reporting until such a candidate passes. Release remains `NOT_RELEASED`.
