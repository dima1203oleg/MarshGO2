# GTFS event-search v4 dedupe/cache prototype — rejected

Date: 2026-10-23  
Base: Server PR #31, `b65882584a3ad1e8dd7512d13176f52299cded51`  
Runtime: Node `v25.4.0`; frozen GTFS ZIP SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`  
Scope: isolated test-only prototype; production search code, budgets, PRs, and release pins were not changed.

## Checks

- Full GTFS tests: **69 passed, 0 failed**.
- Focused exhaustive/convergent-path oracle: PASS, including distinct route chains and fare/type-4 behavior.
- Typecheck and lint: PASS.
- The replay used the same archived Lviv feed, Node runtime, query window and limits as the previous experiments: Мале Голоско → Сихів, Наукова → Сихів, and Площа Ринок → Дубляни, 2026-10-23 08:00–08:30 Europe/Kyiv, six-hour horizon, at most two transfers, access/egress/transfer walk limits 900/1000/400 m, 180-second transfer buffer, four-hour maximum wait, 100-result limit. This pass collected prototype-only counters; it did not rerun the baseline or v4 candidate.
- The `unique transition pair` / cache counters below are internal to this test prototype. They are not interchangeable with production `searchSteps`, graph-retention budgets, or result-reservoir counters.

## Replay result

| Query | Neighborhood lookups / cache hits | Unique transition pairs | Reused feasible transitions | Preflights | Time | Post-run RSS | Outcome |
|---|---:|---:|---:|---:|---:|---:|---|
| Primary | 155 / 37 | 100,001 (budget reached) | 203,953 | 100,000, about 97k feasible | 8.85 s | 889 MiB | 0/3 strategy winners retained |
| Naukova | 116 / 80 | 100,001 (budget reached) | 1,031,483 | 100,000, about 97k feasible | 13.70 s | 973 MiB | 0/3 strategy winners retained |
| Rynok | 184 / 26 | 100,001 (budget reached) | 26,935 | 100,000, about 97k feasible | 5.13 s | 556 MiB | 0/3 strategy winners retained |

Approximate post-run heap used: 1.34 / 1.78 / 0.65 GiB, respectively.

## Decision

**FAIL — reject v4.** Neighborhood caching and transition dedupe reuse substantial work, but each query still reaches the 100,001 unique-transition-pair budget before recovering the baseline route chains. Baseline route-chain recall was 0%, 0%, and 3.125%; winner retention was 0/3 for each query. More caching cannot address the remaining explosion in unique states. Do not wire this prototype into production and do not increase production limits on this evidence.

The next design review found no currently proven Pareto relation that preserves all three ranking winners under fare-v1 ticket coverage and type-4 in-seat transfers. A test-only event-label prototype is the next gate; it must preserve full path identity against exhaustive tiny feeds before any frozen-feed comparison. It must carry the exact current arrival event (trip, service date, stop-call index), transfer constraints, cycle state, and fare assignment frontier. Type-4 ride-through is a segment but not a passenger transfer. Do not assume scalar fare or arrival-at-stop alone is a safe dominance key.

## Release impact

Dense Lviv search remains truncated and therefore is not complete for production claims. The release stays `NOT_RELEASED`. This experiment does not change any deployed service or existing container/database state.
