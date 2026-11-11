# GTFS bounded-result identity overlap — 2026-10-25

## Exact revisions

- Feed: frozen Lviv GTFS SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` (72 routes, 1,071 stops, 15,716 trips).
- Release baseline: Server `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- PR #41 parent: Server `38f17b88f98c8530f8090cfc6745cd334c87e53c` (PR #40 head).
- Candidate: Server `4cd3b998313ef5e2596f2cf9d7fc998e2f3e11b7` (PR #41 head).
- Identity-overlap runtime: Node `v25.4.0` (the five-repeat latency replay in audit 175 used Node `v24.21.0`).

## Method

For each of three fixed origin-destination pairs, run the exact frozen query against baseline, parent, and candidate timetable modules. All coordinates are longitude, latitude in WGS84. Query uses feed snapshot time `2026-10-22T08:00:00Z`, service date `2026-10-23`, departure window `05:00–05:30Z`, 900 m access, 1,000 m egress, 400 m transfer walk, 180 s minimum transfer buffer, two-transfer limit, six-hour journey horizon, four-hour maximum wait, and 100-result cap. Compare returned top-100 sets at three levels: stable itinerary identity (ordered provider/service-date/trip/stop/time tuple per leg), trip-chain identity, and route-chain identity. Also independently recompute FASTEST by duration, CHEAPEST among confirmed UAH fares, and BALANCED using the candidate-sampling ranker. This is bounded-list overlap, not exhaustive feasible-itinerary recall.

| Origin → destination | Origin coordinates | Destination coordinates |
|---|---|---|
| Малий Голоско → Сихів | `24.008217, 49.864885` | `24.0175835, 49.8013165` |
| Наукова → Сихів | `23.982540, 49.805403` | `24.058326, 49.791880` |
| площа Ринок → Дубляни | `24.032271, 49.841463` | `24.086526, 49.904511` |

For the PR #40→#41 comparison, the parent timetable module was materialized from the exact parent commit; its relative dependencies resolve to the branch files, which are identical because the PR changes only `server/journey/gtfsTimetable.ts` and `tests/gtfs-timetable.test.ts`.

## Results

| Origin → destination | Pair | Overlap | Pair-only identities | FASTEST (pair → candidate) | CHEAPEST (pair → candidate) | BALANCED (pair → candidate) |
|---|---|---:|---:|---|---|---|
| Малий Голоско → Сихів | Release `134ed` → PR #41 | 45/100 | 55 / 55 | 47 → 47 min | 47 → 47 min | 47 → 47 min |
| Наукова → Сихів | Release `134ed` → PR #41 | 83/100 | 17 / 17 | 35.5 → 33 min | 35.5 → 33 min | 36 → 36 min |
| площа Ринок → Дубляни | Release `134ed` → PR #41 | 74/100 | 26 / 26 | 49.3 → 49.3 min | 49.3 → 49.3 min | 49.3 → 49.3 min |
| Малий Голоско → Сихів | PR #40 → PR #41 | 65/100 | 35 / 35 | 47 → 47 min | 47 → 47 min | 47 → 47 min |
| Наукова → Сихів | PR #40 → PR #41 | 83/100 | 17 / 17 | 35.5 → 33 min | 35.5 → 33 min | 36 → 36 min |
| площа Ринок → Дубляни | PR #40 → PR #41 | 83/100 | 17 / 17 | 49.3 → 49.3 min | 49.3 → 49.3 min | 49.3 → 49.3 min |

On the direct PR #40→#41 comparison, unique trip-chain overlap was 41/60 on Holosko, 53/57 on Naukova, and 52/57 on Rynok. Unique route-chain overlap was 34/43, 37/40, and 30/32, respectively. Therefore some exact stop/time variants differ while retaining the same trip or route chain; a missing exact ID alone is not proof that a useful user-facing option disappeared.

Representative route-chain changes were inspected in the returned journey details. Naukova gains a 33-minute 1630→108 connection where PR #40's sampled parent-only chains were 46.5 minutes. Rynok gains multiple 60.3-minute connections into route 90 where sampled parent-only options were 66.3 and 84.1 minutes. Holosko sample gains include 61–67-minute itineraries compared with 67–113.5-minute sampled parent-only routes. These examples support that the candidate is finding useful query-connected alternatives, but they do not validate every changed route chain or remove search truncation.

Every OD returned 100 identities on both sides. The strategy winners are unchanged or improved, but the bounded top-100 set has significant churn: 17–55 itinerary identities compared with release baseline, and 17–35 compared with the direct PR parent. Dense search remains truncated. Candidate median latency remains above the release baseline (audit 175).

## Decision

The detailed sample shows useful improvements among changed routes, alongside route-pool churn and truncation. Keep PR #41 as a draft until broader route-chain quality, API ordering/limit behavior, latency, and completeness are reviewed. Exact itinerary-ID preservation is not itself a correctness requirement where the route remains equivalent and feasible. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
