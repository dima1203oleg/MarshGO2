# Audit 289 — GTFS candidate-sampler review and regressions

Date: 2026-10-27

## Source state

- Canonical Server checkout: `MarshGO/MarshGO-Server`, branch `feature/transport-layer-availability`, HEAD `877ac41195e9270008bd353cc143c32e0a71cb1e`.
- The checkout has 98 dirty paths from existing work. No source changes were reverted, staged, committed, pushed, or deployed in this checkpoint.
- Tested working-tree SHA-256: `server/journey/gtfsTimetable.ts` = `3b0990e2c104c2926813b420fdef8c02a2a48ef030987112b9223a59a40297d5`; `tests/gtfs-timetable.test.ts` = `0ef95f84fe358d438f2332f3733fef8bfe42e757206ea7a3982309fe9a3b6744`.
- Runtime: official Node `v24.21.0`, downloaded to `/tmp` and verified against the Node distribution SHA256 list.

## Verification

- GTFS timetable + journey-search completeness + journey-scoring: **102 PASS / 0 FAIL / 0 SKIP**, 30.539 s.
- Cross-provider Pareto witness tested both batch and incremental streaming selection over 9 cyclic and 32 deterministic seeded orders: **1 PASS / 0 FAIL**.
- Bounded BALANCED overflow reservoir keeps the full-set shared BALANCED winner over 32 deterministic candidate orders: **1 PASS / 0 FAIL**.
- Server `tsc --noEmit`: PASS.
- ESLint on `server/journey/gtfsTimetable.ts`, `server/journey/scoring.ts`, and the three changed test files: PASS.
- Scoped `git diff --check`: PASS.

## Antigravity review

- Gemini 3.8 Flash Low, read-only/plan sandbox, 97.321 s, provider-reported usage **80,362 tokens**. No files were edited by Antigravity.
- It reported five findings. The suspected missing incremental cross-provider Pareto regression was addressed locally; it passes the 41-order streaming check above. It also suspected global-pool sampling could discard objective witnesses; the existing overflow path retains bounded duration/fare/transfer/walking/BALANCED reservoirs and merges them into final ranking, and the BALANCED witness test now passes 32 orders. No universal completeness claim follows from these bounded fixtures.
- Its other observations were corroborated: replacements/rejections set truncation; unknown fares stay null/excluded from known-fare ranking. This is review evidence, not an independent production acceptance gate.
- Do not repeat a broad Antigravity request for this code. Its measured usage was much larger than the prompt suggested; use it only when a genuinely independent review has a clear expected value and the scope can be supplied without workspace-wide context.

## Limits and next action

- This run used deterministic fixtures only. Frozen-feed replay, live provider checks, staging, production, and load tests were **NOT_RUN**.
- System resource state: **YELLOW** (about 13 GB free disk, 37% system memory free). The 3-corridor frozen replay is deferred until resources are GREEN or a permitted remote runner is used; no heavy jobs were overlapped.
- Next exact action: run `.tmp-route-repeat-bench.mts` serially on the frozen archive `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` with Node 24.21.0 when resource limits permit. Compare ordered hashes, strategy-winner identities, trip/route-chain diversity, truncation, latency, and RSS against audit 282. Continue to report `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
