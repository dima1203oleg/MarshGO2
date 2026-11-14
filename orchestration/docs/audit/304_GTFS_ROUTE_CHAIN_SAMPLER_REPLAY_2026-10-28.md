# Audit 304 — GTFS route-chain sampler paired replay

## Scope

Compared Server baseline `30f9691f1789b28400a3995469677bd4f5f32ca9` with experimental sampler candidate `20d9615ba9de3ece12a570633679ddee3345aac7`. All runs used the same publisher-verified Lviv static GTFS archive (`bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`), departure window `2026-10-23T05:00:00Z`–`05:30Z`, Node 24.21.0, and three serial repeats per revision and OD. This is a static diagnostic replay, not live/staging/production acceptance.

## Results

| OD | Unique trip chains baseline → candidate | Unique route chains baseline → candidate | Strategy winner identity parity | Median search | Median `itineraries-ranked` stage | Peak RSS |
|---|---:|---:|---|---:|---:|---:|
| Holosko → Sykhiv | 44 → 20 | 31 → 15 | No | 2,612 → 2,885 ms (+10.44%) | 200 → 543 ms (+171.50%) | 719.0 → 688.5 MiB |
| Chornovola → Dovzhenka | 45 → 32 | 32 → 20 | Yes | 2,263 → 2,456 ms (+8.55%) | 151 → 439 ms (+190.73%) | 647.1 → 662.6 MiB |
| Sknylivok corridor | 32 → 37 | 25 → 24 | Yes | 2,362 → 2,612 ms (+10.60%) | 151 → 444 ms (+194.04%) | 720.1 → 683.3 MiB |

Every baseline/candidate set was repeat-stable; ordered result identities changed on all three ODs. Every search returned 100 results and remained truncated. The sampler did not establish completeness, and it imposed a consistent total-search and ranking-stage latency penalty. Two ODs lost substantial route-chain diversity; the third was nearly flat on route chains while gaining trip-chain variants. This repeats the global-diversity risk recorded in rejected Audit 228 and is insufficient for production acceptance.

Replay runs: `40688769927`, `40689017133`, `40689208650`. The first two runs on candidate `214616f` failed only because the report script assumed a diagnostic field absent from the older baseline. That harness compatibility bug was fixed and the corrected runs produced the evidence above; those initial failures are not routing results.

## Antigravity review

Gemini 3.8 Flash received a data-only independent assessment (no repository access or tool use, 53.5 s, 22,570 reported tokens). It advised blocking rollout based on the diversity and latency signal and checking another OD before deciding. A separate broad-workspace CLI review timed out without findings and reported 153,015 total tokens; no quota telemetry was exposed. No claim is made that the model used a quota-derived limit.

## Decision and follow-up

Rejected the experimental per-route-chain sampler for the serving path. Commit `63af75d0701291a55d86796c91f54fdd9c7b6114` restores `server/journey/gtfsTimetable.ts` to the pre-sampler implementation, removes the sampler-only test that referenced the rejected helper, preserves the independent fare-test correction and frozen-feed replay harness, and moves its ranking projection into `scripts/`. Exact CI and one post-revert parity replay are pending.

Post-revert verification: Server exact-head CI runs `40689621757` (push) and `40689629700` (PR) both passed audit, lint, typecheck, unit, migrations, and integration. Replay `40689659417` compared `30f9691` with `63af75d` on the same OD/feed, three repeats each: ordered identity parity YES, strategy-winner parity YES, both 44 unique trip chains / 31 route chains. Search remained truncated. Median time was 2,493→2,618 ms (+5.03%), so this single replay is parity evidence, not a performance claim.

PR #7 remains draft/open at `63af75d0701291a55d86796c91f54fdd9c7b6114`. No merge, staging promotion, or production deployment occurred.

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
