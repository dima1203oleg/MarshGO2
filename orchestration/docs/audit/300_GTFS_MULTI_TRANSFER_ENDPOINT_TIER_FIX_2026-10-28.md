# PR #50 — multi-transfer endpoint retention regression (2026-10-28)

## Candidate

- Repository: `dima1203oleg/MarshGO-Server`
- Branch: `codex/argo-lviv-route-completeness-20261027`
- Commit: `657b2f936a09aa7faf7d6a13b11bd97b801067f2`
- PR: #50, open, stacked on PR #49

## Finding and change

Gemini 4 Argon reviewed the bounded retention tiers and proved a feasible 2+ transfer connector could lose a per-route slot to a dead-end endpoint trip: `retentionTier === 2` had priority before `temporallyConnectsQueryEnds`. A deterministic small feed reproduced the defect: exhaustive search retained the only feasible chain while a graph limited to three total segments and one per route returned none. The priority order now keeps both-endpoint trips, opposite-frontier feasible endpoint trips, other scheduled connectors, then dead-end origin/destination endpoint trips. Global and per-route graph caps are unchanged.

The same commit also closes Argon's earlier findings: urban retention uses the same 180-second default floor as boarding feasibility, and temporal prefilters preserve short-gap transfer-type-4 in-seat connections; the in-seat lookahead skips pathway walking for type 4.

## Evidence

- Before priority fix: new bounded-vs-exhaustive regression failed; bounded result was empty, exhaustive retained `access-trip,feasible-middle,egress-trip`.
- After fix: focused routing checks 3/3 pass, including disconnected-route oracle, dead-end endpoint competition, and type-4 sub-buffer connection.
- Full `tests/gtfs-timetable.test.ts`: 92/92 pass, zero skips.
- TypeScript typecheck: pass.
- `git diff --check` on the server changes: pass.
- Local ESLint: NOT_RUN successfully; isolated checkout did not resolve `eslint-plugin-unused-imports` from the available shared node_modules. Exact-head GitHub CI pending.
- Argon second read-only review: RUNNING at checkpoint time.
- Hosted frozen Lviv replay for 657b2f9 vs 3c14c28: NOT_RUN; next after CI pass.

No PR merge, production deployment, or external provider change. Release stays `NOT_RELEASED`.
