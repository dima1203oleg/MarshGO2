# GTFS retention tie-break: three frozen Lviv OD replay — 2026-10-25

## Setup

- Baseline source: Server `codex/gtfs-route-budget-followup-20261024`, clean tracked tree at `1c08a98dfe93224eb06cb8562bab2c9e64054573`.
- Candidate source: same exact HEAD plus the existing uncommitted retention change; patch SHA-256 `be0148bf66db8b3adf6d06a921ac8a492dc358b595fded0b62c25627c925e550`. No source was edited for this replay.
- Frozen static Lviv GTFS ZIP: SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Primary release-runtime recheck: Node `v24.21.0`. Three serialized paired runs per OD, baseline then candidate, with the same parser and script. Candidate/baseline source trees were separate; no DB, live feed, GPS, or external API was used. A separate Node `v26.7.0` replay had the same counts, hashes, winner parity, and truncation.
- ODs: Малий Голоско `[24.008217,49.864885]` → Сихів `[24.0175835,49.8013165]`; Наукова `[23.982540,49.805403]` → Сихів `[24.058326,49.791880]`; площа Ринок `[24.032271,49.841463]` → Дубляни `[24.086526,49.904511]`.
- Query: 2026-10-23 05:00–05:30 UTC, six-hour journey horizon, up to two transfers, 900/1,000/400 m access/egress/transfer walking bounds, 180 s transfer buffer, four-hour maximum wait, 100-result cap.

## Results

| OD | Trip/route chains baseline → candidate | Median search ms baseline → candidate | Ordered result hash preserved | FASTEST/CHEAPEST/BALANCED winners preserved | Search/result truncation |
|---|---:|---:|---|---|---|
| Малий Голоско → Сихів | 58/37 → 58/37 | 2046.26 → 2038.57 | Yes | Yes | Yes / Yes |
| Наукова → Сихів | 57/40 → 57/40 | 1534.27 → 1606.43 | Yes | Yes | Yes / Yes |
| площа Ринок → Дубляни | 58/32 → 58/32 | 2808.60 → 2715.25 | Yes | Yes | Yes / Yes |

Each version produced identical result hashes and strategy winner identities across its three repetitions. Each replay returned 100 results. The sum of per-OD medians is 6389.13 ms baseline and 6360.25 ms candidate (about 0.5% lower for the candidate); because the OD-level changes are mixed and these are local diagnostics, this is not evidence of a reliable performance gain. Peak RSS samples varied and are not used for a memory claim.

## Truncation-stage diagnostic on Node 24.21.0

A separate debug replay of the candidate against the same frozen feed shows both independent bounds are active on all three OD queries:

| OD | Estimated graph demand → retained segments | Candidate results | Search steps | `searchStepLimitReached` | Graph / candidate sampling truncation |
|---|---:|---:|---:|---|---|
| Малий Голоско → Сихів | 415,997 → 99,054 | 1,625 | 101,827 | No | Yes / Yes |
| Наукова → Сихів | 194,024 → 99,580 | 1,631 | 97,654 | No | Yes / Yes |
| площа Ринок → Дубляни | 262,267 → 99,488 | 1,506 | 203,255 | No | Yes / Yes |

The hard one-million step ceiling is not reached. Instead, bounded candidate sampling plus its objective-reservoir tail ends traversal while queued work remains; the 100,000-segment graph cap separately omits estimated feed segments. Thus raising the hard step ceiling alone would not address either cause, and simply increasing it is not justified by these measurements. Exact source currently sets a 750-item candidate cap per transit-leg count, up to `limit * 25` general results, and a 25,000-step objective-reservoir tail after a leg-count pool fills. These are implementation bounds, not proof that unseen candidates are dominated.

## Acceptance and decision

- Focused GTFS timetable, scoring, bounded graph budget, and transfer-feasibility tests under Node `v24.21.0`: **78/78 PASS**.
- TypeScript typecheck, targeted ESLint, and `git diff --check` under Node `v24.21.0`: **PASS**.
- The new dense irrelevant-interchange fixture verifies that an exact feasible connector survives bounded retention; the tiny-feed exhaustive oracle remains in the passing suite.
- Dense Lviv completeness: **FAIL / still open**. All six per-version three-OD runs report `searchTruncated=true` and `resultLimitReached=true`; the replay exposes no full-set recall oracle for a city-sized feed.
- Candidate decision: this patch preserves the baseline ordered results and three strategy winners on the frozen OD set, but it has no measured recall/completeness benefit. Keep it isolated; do not call it the dense-feed fix and do not promote it as production-ready.

## Evidence files

- Baseline JSONL: `/tmp/marshgo-three-od-baseline-20261025.jsonl`.
- Candidate JSONL: `/tmp/marshgo-three-od-candidate-20261025.jsonl`.
- Node 24.21.0 baseline/candidate JSONL: `/tmp/marshgo-three-od-baseline-node24-20261025.jsonl` and `/tmp/marshgo-three-od-candidate-node24-20261025.jsonl`.
- Node 24.21.0 stage diagnostics: `/tmp/marshgo-gtfs-node24-stage-debug-20261025.log`.
- Existing candidate files are uncommitted in its isolated worktree; no push, merge, or deployment occurred.
- Separate known candidate PR #39 remains OPEN/DRAFT at Server `142ed4f76e9da94430048d4a31e7ad3962b4858b`, based on PR #38 head `8e570768c7e1e4dd2f016764d7396d9776e92abc`; exact-head checks `40129471163` and `40129474650` are SUCCESS. Its overflow redistribution was already measured in audit 118 and fills the unused graph slots, but it still reports truncation and has a small aggregate replay-time regression. It is not a completeness fix and should not be blindly merged into the dirty release worktree.

Next engineering step: design a distinct query-directed bounded search candidate that can improve useful-chain recall without relying only on spare-slot fill or tie-break ranking. Require deterministic exhaustive-oracle parity, no loss of baseline winners, measurable useful-chain recall gain, and repeated frozen-feed measurements before promotion. Release remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
