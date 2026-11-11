# GTFS search budget A/B on Node 24.21.0 — 2026-10-25

## Source and replay

- Server branch `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`; pre-existing worktree remains dirty.
- Dirty `server/journey/gtfsTimetable.ts` SHA-256: `9486b5f3f4e693acaa8e389bc105f081109b6e01af62f16f7f7502574794a1fe`. The experiments below were reverted; source now matches that recorded hash.
- Frozen Lviv GTFS SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`: 72 routes, 1,071 stops, 15,716 trips. Three fixed ODs; 30-minute departure window, six-hour journey horizon, at most two transfers, 100 returned journeys.
- Runtime Node `v24.21.0` (`npm exec --package=node@24.21.0`). Each case warmed once and then ran five repeats. Results, itinerary identity hashes, and FASTEST/CHEAPEST/BALANCED winners were stable in every five-run set. Resource/CPU sampling was not performed.

## Dirty baseline versus exact HEAD

| OD | HEAD median ms | Dirty median ms | Trip chains | Route chains | Same itinerary-set hash and all three winners | Truncated |
|---|---:|---:|---:|---:|---|---|
| Малий Голоско → Сихів | 1,294 | 1,307 | 44 | 31 | Yes | Yes |
| Наукова → Сихів | 629 | 707 | 52 | 41 | Yes | Yes |
| площа Ринок → Дубляни | 905 | 954 | 38 | 24 | Yes | Yes |

The current dirty timetable source is deterministic and output-equivalent to its committed HEAD on these three ODs, but the searches remain incomplete. Diagnostic logs show 194k–415k candidate segments are built and only 5.9k–10.2k search steps run; each OD reports stop-selection, budget and candidate-sampling truncation.

## Rejected budget experiments

### Per-first-leg walk budget 128 → 512

All three strategy winners remained unchanged, but output diversity fell: trip chains changed 44/52/38 → 42/46/34; route chains changed 31/41/24 → 28/36/25. Median latency changed 1,307/707/954 ms → 1,467/740/1,179 ms. All runs stayed truncated. This budget increase did not improve useful discovery; it was reverted.

### Candidate cap per leg count 200 → 500

| OD | Trip chains 200 → 500 | Route chains 200 → 500 | Median ms 200 → 500 | Baseline journeys retained in the 100-result response | Strategy winners |
|---|---:|---:|---:|---:|---|
| Малий Голоско → Сихів | 44 → 65 | 31 → 49 | 1,307 → 1,722 (+31.7%) | 38/100 | All 3 unchanged |
| Наукова → Сихів | 52 → 57 | 41 → 43 | 707 → 806 (+14.0%) | 73/100 | All 3 unchanged |
| площа Ринок → Дубляни | 38 → 46 | 24 → 36 | 954 → 1,395 (+46.2%) | 56/100 | All 3 unchanged |

The larger pool found more distinct chains but displaced 27–62 of the previous 100 returned itineraries, increased latency materially, and did not clear truncation. Do not deploy this as a default cap change. Both source constants were restored; focused GTFS/realtime/scoring tests pass **64/64** after restoration.

## Decision and next implementation target

Keep the current bounded runtime. A useful improvement must retain the existing candidate itineraries as an immutable pool, add independently discovered alternatives, then merge/deduplicate and rank under explicit response limits while preserving all three strategy winners. It must pass the exhaustive tiny-feed oracle, show exact identity overlap and chain diversity on these frozen ODs, and meet agreed latency/memory budgets. Do not claim exhaustive coverage while any truncation flag is true.

No routing change from either budget experiment remains in the source. No commit, push, or deployment was made. Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
