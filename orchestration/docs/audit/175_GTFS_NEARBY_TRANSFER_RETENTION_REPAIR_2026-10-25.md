# GTFS nearby-stop retention repair — 2026-10-25

## Candidate

- Repository: `dima1203oleg/MarshGO-Server`.
- Isolated worktree: `/private/tmp/marshgo-gtfs-additive-discovery-20261025`.
- Branch: `codex/gtfs-nearby-stop-retention-20261025`.
- Parent: `38f17b88f98c8530f8090cfc6745cd334c87e53c` (`origin/codex/server-current-pr39-integration-20261025`).
- Commits: `11c4b0167e7a03b112c2351c7aa3433d31708ac1` (nearby-stop retention) and `4cd3b998313ef5e2596f2cf9d7fc998e2f3e11b7` (skip redundant query-frontier probes for direct segments).
- Final source SHA-256 for `server/journey/gtfsTimetable.ts`: `a15a323865ba5c2b11e46e674dc6655f47400ab7c42f051e1e034695c48eff60`.
- Both commits are pushed to branch `codex/gtfs-nearby-stop-retention-20261025`; draft PR [#41](https://github.com/dima1203oleg/MarshGO-Server/pull/41) targets the exact parent branch for PR #40. Neither commit is merged or deployed. The main Server checkout was not changed.
- GitHub Actions run `40188242109` (`Server CI`) for exact head `4cd3b998313ef5e2596f2cf9d7fc998e2f3e11b7` completed with `success`. This hosted CI result confirms only the configured workflow checks, not staging or product-wide release gates.

## Change and regression addressed

The route search allowed a same-provider walking transfer between nearby platform stop IDs, but bounded GTFS retention recognized only exact/shared nodes and GTFS pathways. A valid 33-minute Naukova → Sykhiv transfer chain was consequently omitted from the retained dense-feed graph. After adding spatial reachability, the reservoir still preferred short individual endpoint rides over segments that completed a query-feasible journey.

The candidate now indexes query-frontier arrival/departure events onto nearby cross-route stops within the configured transfer radius, with same-provider restriction for proximity-only transfers. Retention priority favors query-connected endpoints and ranks a connected destination segment by arrival time from the query start. The final transfer decision remains authoritative for transfer type, provider, pathway, distance, and buffer. No limits were raised and no route was synthesized.

A deterministic fixture now verifies the full access → connector → egress chain where both transfers use distinct, nearby stop IDs. Existing tests continue covering dense irrelevant interchanges, pathway direction, explicit forbidden transfers, trip-specific transfer minimums, and exact small-feed search parity.

## Verification evidence

- Runtime: Node `v24.21.0`.
- Full Server unit suite: **316 PASS, 0 FAIL, 3 opt-in integration SKIP** (319 tests total).
- TypeScript typecheck: **PASS**.
- ESLint: **PASS**.
- Full opt-in integration suite: **30 PASS, 0 FAIL, 0 SKIP**, including clean PostGIS migrations, journey schema, live journey authorization, booking race/cancellation, partner tenant isolation, navigation, two-instance realtime, restart durability, and shared Redis rate limit.
- Integration services ran in newly created tmpfs PostGIS 17 and Redis 7.4 containers on isolated loopback ports; the PostGIS image ran under amd64 emulation on the arm64 host. The containers were stopped and auto-removed. Existing `marshgo-db-1` and `marshgo-redis-1` were left running and untouched.
- `git diff --check`: **PASS** before commit.

## Frozen Lviv replay

Feed SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` (72 routes, 1,071 stops, 15,716 trips). Three OD pairs, five repeated runs each; every run returned the same itinerary-set hash and strategy winners. Timings are medians from this local run, not production SLAs.

| OD | Trip chains, prior baseline → candidate | Route chains, prior baseline → candidate | Median latency | FASTEST / CHEAPEST, baseline → candidate | BALANCED, baseline → candidate | Truncated |
|---|---:|---:|---:|---|---|---|
| Малий Голоско → Сихів | 44 → 65 | 31 → 44 | 1,307 → 2,711 ms | 54 → 47 min / 54 → 47 min | 54 → 47 min | Yes |
| Наукова → Сихів | 52 → 58 | 41 → 41 | 707 → 2,080 ms | 33 → 33 min / 33 → 33 min | 35.5 → 36 min | Yes |
| площа Ринок → Дубляни | 38 → 66 | 24 → 36 | 954 → 3,615 ms | 49.3 → 49.3 min / 49.3 → 49.3 min | 49.3 → 49.3 min | Yes |

The previously missing 33-minute Naukova FASTEST and CHEAPEST itinerary is restored. Holosko's tested winners improve from 54 to 47 minutes. Rynok winners remain unchanged. The candidate still has materially higher latency than the older baseline, and all three dense searches still report truncation. Balanced Naukova is 30 seconds slower than its baseline winner. A CPU profile over the replay showed material time in query construction/scoring and repeated tariff-city normalization; these are leads for isolated profiling, not confirmed single bottlenecks. The later five-repeat set measured lower medians than the first set, but no interleaved A/B profile proves the direct-segment optimization alone caused the reduction. This is a validated regression repair and useful candidate, **not** evidence of complete search or production readiness.

Exact stable-itinerary identity overlap was measured over each algorithm's top 100 results against release baseline Server `134ed017828a020e1d5f696b3cb9ea95527bb093`: Holosko→Sykhiv **45/100** (55 baseline-only), Naukova→Sykhiv **83/100** (17 baseline-only), Rynok→Dubliany **74/100** (26 baseline-only). Against direct parent PR #40 the overlaps are **65/100**, **83/100**, and **83/100**, respectively. Strategy winners are unchanged or improved, but route identity displacement plus truncation means this candidate is **not accepted as a replacement**. Counts measure identity overlap in bounded result lists, not exhaustive feasible-chain recall. Exact query and comparison details: [audit 176](176_GTFS_BASELINE_RESULT_OVERLAP_2026-10-25.md).

One instrumented Node 25.4.0 Naukova→Sykhiv request reported 2,129 ms through itinerary ranking, with 1,261 ms through segment-graph construction, 145 ms additional through reachability, and about 723 ms in the remaining expansion/ranking phase. The graph hit its 100,000-segment global ceiling against estimated demand of 194,024; 9 of 36 route budgets hit their 5,000 per-route cap, and the search reported both `segmentGraphTruncated` and `searchBudgetTruncated`. Heap was 391 MB and RSS 568 MB at the final diagnostic stage. This is one instrumented Node 25 sample, not a latency distribution or production measurement. Do not increase the graph cap based on this sample: previous cap experiments regressed latency and memory.

## Decision and next work

Keep PR #41 as a draft review candidate; do not replace the baseline in a release manifest yet. The measured bounded-result displacement needs route-chain quality review; exact itinerary-ID preservation is not itself a correctness requirement when routes remain equivalent and feasible. Continue profiling candidate retention/search latency and memory, then address truncation. Keep `searchTruncated` visible. Cross-repository SHA compatibility, staging, live providers, physical iPhone, security/load/recovery, backup/restore, rollback, and deployment approval remain separate gates. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.


## Addendum — exact PR #41 head and cache A/B

The branch advanced with a third commit, `c217d6e4aa33ba032464428415c0694c35ad4fd3`, which caches query-local nearby-stop retention neighbors. The exact-head hosted Server CI run `40189573482` succeeded. Node 24.21.0 full unit suite on this source passed **316/316** with **3 opt-in integration skips**; typecheck, ESLint, and diff check passed.

Seven-pair alternating frozen-feed comparison of source `4cd3b99` vs candidate `c217d6e` on Node 24.21.0 produced identical ordered top-100 IDs and strategy winners for all ODs. Median timings were Holosko 3,092.83→3,011.76 ms, Naukova 2,119.80→2,008.69 ms, and Rynok 3,418.66→3,240.45 ms. All six versions of the three OD searches remain truncated and at the result limit. This modest local improvement does not close completeness or production gates. Full method and boundaries: [audit 177](177_GTFS_NEARBY_RETENTION_CACHE_AB_2026-10-25.md).
