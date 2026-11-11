# GTFS graph-budget overflow redistribution — 2026-10-24

## Candidate

- Server PR #39, branch `codex/gtfs-pathway-retention-20261024`, updated to `142ed4f76e9da94430048d4a31e7ad3962b4858b` (`perf(gtfs): redistribute unused graph budget`). It remains a draft stacked on PR #38 at `8e570768c7e1e4dd2f016764d7396d9776e92abc`.
- Retained whole-trip groups and the existing per-route overflow behavior are unchanged. After per-route fill, the new bounded pass fairly redistributes only otherwise-unused slots across route overflow samples, capped at the existing total graph limit and per-route maximum. Final transfer feasibility remains unchanged.
- Exact helper tests cover deterministic route ordering, duplicate elimination, total capacity, and per-route capacity.

## Checks

- Full Server unit suite: **313 PASS / 0 FAIL / 3 opt-in SKIP**. The skips remain separately covered by the latest isolated integration run recorded in audit 117.
- TypeScript, changed-file ESLint, and `git diff --check`: **PASS**.
- Frozen-feed archive SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- The repeated paired replay used the same harness, query window and runtime (Node `v25.4.0` on both sides; this is not the repository's declared Node `24.21.0` release runtime). Each of three OD pairs was run three times per variant. Results were deterministic within each variant:

| OD | Baseline → candidate trip / route chains | FASTEST / CHEAPEST / BALANCED winner | Median search time, base → candidate |
|---|---:|---|---:|
| Малий Голоско → Сихів | 59/38 → 60/43 | FASTEST/CHEAPEST 54:03 → 47:03; BALANCED 72:30 → 47:03; price remains 23 UAH | 2,157 → 2,279 ms |
| Наукова → Сихів | 51/38 → 51/38 | Same winner metrics: 31:00, 23 UAH | 1,613 → 1,664 ms |
| Площа Ринок → Дубляни | 56/30 → 55/31 | Same winner metrics: 49:32, 23 UAH | 2,534 → 2,588 ms |

- Aggregate median runtime across the three OD pairs: **6,304 → 6,531 ms (+3.6%)**. Single-machine replay only; RSS and heap samples were noisy and are not used for a memory claim.
- On the debug Holosko replay, the candidate materializes exactly **100,000/100,000** segments and redistributes the **937** previously unused slots. Estimated demand remains 415,997. `candidateGraphTruncated=true` and `searchTruncated=true` remain true; this does not establish completeness or remove the need to disclose truncation.
- This comparison is against PR #39's exact pre-change head `84f5b85544dac520af3a3e28119cb6ee6d4bf522`. The output hash changed on all three ODs; the top strategy metrics above are the observed acceptance signal, not a proof of global optimality.
- Exact-head hosted Server CI and Verify on `142ed4f76e9da94430048d4a31e7ad3962b4858b` completed successfully: runs [`40129471163`](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40129471163) and [`40129474650`](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/40129474650). Both include lint, typecheck, full unit suite, DB migrations, integration workflow, API image build, and PostGIS/Redis smoke; Security/Verify runs the additional audit/checks configured in CI.

## Decision and next step

- Keep the candidate in review; do not merge or deploy yet. This is a repeatable bounded-search quality improvement with a small observed runtime increase and preserved or improved strategy metrics on these ODs, but dense-feed graph/search truncation remains.
- Recheck exact-head Server CI. Then compare the branch with the current release SHA tuple and continue remaining Site visual/interaction, Admin/Partner authorization, provider, iOS, staging, security, load, backup/restore, and rollback gates. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.
