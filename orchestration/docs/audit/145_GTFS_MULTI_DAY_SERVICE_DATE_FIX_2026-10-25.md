# GTFS multi-day service-date coverage — 2026-10-25

## Scope

Regression validation for GTFS timetable searches where a trip's service date precedes the local search date by two days. GTFS stop times can exceed 24:00; the current parser accepts values up to 71:59:59. A trip at `48:15:00` on Sunday therefore occurs at 00:15 Tuesday in the feed timezone.

## Candidate

- Repository: `MarshGO-Server`
- Branch: `feature/transport-layer-availability`
- HEAD: `182c77ae4f78d576a287007d8e0864fb130f43f8`
- Working tree: already contained extensive unrelated modifications and untracked files; preserved intact.
- Relevant implementation: `server/journey/gtfsTimetable.ts` enumerates the two prior local service dates through the full query/journey horizon for both direct and composed timetable searches.
- Regression tests: `tests/gtfs-timetable.test.ts` exercises direct and composed journeys with `48:15:00`/`48:55:00` and an active service-date exception two dates before query local date. A second direct-search case verifies that an active intermediate date is searched when the requested window spans multiple local days. Door-to-door itinerary time includes walking access; the test checks transit-segment event timestamps.

## Checks

Executed with Node `v25.4.0`; package engine requests `24.21.0`.

- `npx tsx --test tests/gtfs-timetable.test.ts` — PASS, 37/37.
- `npm test` — PASS, 227 pass, 1 opt-in integration skipped, 0 fail.
- `npm run typecheck` — PASS.
- `npm run lint` — PASS.
- `git diff --check` — PASS.

The opt-in integration skip is not a passing result. All relevant regression checks are local fixture/unit tests. No real feed probe, staging, production, or physical-device validation occurred.

## Release status

This establishes only the tested service-date behavior on the current dirty candidate. It does not establish complete dense-city route search or production readiness. No changes were broadly staged, committed, pushed, or deployed. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.

## Next

1. Preserve this checkpoint and do not promote the entire dirty Server tree as one change.
2. Continue algorithm parity work against frozen feed replay and exhaustive small-feed oracle; retain strategy winners and baseline itinerary identities.
3. Confirm the 71-hour parser ceiling against supported provider feeds and validator behavior; the official field definition permits extended service-day times above 24:00 without stating that ceiling. Decide a documented safe bound and test it before claiming broad GTFS conformance.
4. Continue exact-SHA cross-repository integration and external staging/provider/iOS/security/recovery gates; record blockers with evidence.

## Follow-up: current open-feed time scan and empty schedule health

At `2026-10-25T01:42:55Z`, downloaded all 15 `access: open`, `sourceType: gtfs` archives in the canonical Server Ukraine catalog using the existing SSRF-guarded `fetchBinary` helper (concurrency 2; 60 MiB cap). Parsed `arrival_time` and `departure_time` values only; no IDs or raw feed rows were logged. Across 1,207,262 non-empty time cells, the maximum was `63:30:00` in the VD-Express intercity archive; no values exceeded 71 hours and no malformed time cells were counted. Fourteen archives had at least one stop-time value. Khmelnytsky’s archive had a 1,077-byte ZIP and a header-only `stop_times.txt`.

At `2026-10-25T01:44:39Z`, the Server `testGtfsConnection` live probe for Khmelnytsky returned `offline`, zero stops/routes/trips/stop-times, and missing/invalid timezone. I added a separate explicit `Scheduled stop times` health check and made non-empty stop-time rows part of the critical-content gate, so a future archive with trips/calendar but an empty schedule cannot be called healthy. The live provider remains offline; this code change does not change provider data or enable it.

Additional evidence after these changes:

- `npx tsx --test tests/gtfs-timetable.test.ts` — PASS, 38/38, including direct/composed two-day carryover, the actual-feed maximum class (`63:30:00`), and multi-day intermediate service dates.
- `npx tsx --test tests/mobility.test.ts` — PASS, 20/20, including the empty-stop-times health gate.
- `npm test` — PASS, 229 pass, 1 opt-in integration skipped, 0 failures.
- `npm run typecheck`, `npm run lint`, `git diff --check` — PASS.

The 71-hour ceiling is sufficient for the 15 currently open catalog archives at this probe time, not a proof of a universal GTFS limit. The official [GTFS Schedule Reference](https://gtfs.org/documentation/schedule/reference/) describes service-day times above 24:00 but does not state a 71-hour maximum in the field definition. Keep the parser-bound decision documented and re-check when new feeds are enabled.

## Frozen live-feed route-search benchmark

At `2026-10-25T01:46Z`, replayed the saved Lviv OD benchmark against the local `marshgo_e2e` database and the same current static GTFS snapshot. With search debug enabled, the GTFS stage completed in 1,158 ms and returned its requested 100 journeys from 800 retained itinerary candidates. It built 308,387 timed segments from 15,716 trips across three service dates, found 20 origin and 20 destination access stops, and selected a 421-stop corridor from 1,071 feed stops. The result contained 329 segments, all 329 with geometry and valid stop-time details. The original scratch harness incorrectly checked `fare.total`; this field is absent from the fare contract, so its reported zero priceable journeys was invalid. See the correction below.

The search correctly reports `searchTruncated=true` and `resultLimitReached=true`. Debug counters identify three causes: access-stop selection (`stopSelectionTruncated=1`), candidate search budget (`searchBudgetTruncated=1`), and candidate sampling (`candidateSamplingTruncated=1`). It did not hit the global 50,000 step cap or the `limit * 25` result cap. The current benchmark is therefore evidence of useful bounded results, not complete candidate coverage or a validated cheapest strategy. It does not establish that returned chains preserve the exhaustive baseline or optimal winners.

The earlier depth-fair and route-group budget experiments (audits 140/141) are rejected and remain unpromoted because they lost baseline chains and changed all three strategy winners. Next routing work must compare stable itinerary-chain identities and FASTEST/CHEAPEST/OPTIMAL winners against a frozen unbounded or exhaustive small-feed oracle, then replay multiple frozen Lviv OD pairs. Do not merely raise caps or suppress truncation: that risks higher memory/CPU while leaving ranking bias intact.

## Server loopback integration checkpoint

After the GTFS health and timetable regressions, ran `npm run test:integration` from the canonical Server checkout against its loopback-only `marshgo_e2e` database and local Docker Postgres/PostGIS + Redis. The script applied current Server migrations and ran: Journey schema 2/2, live journey 1/1, booking + trip editing 21/21, navigation 2/2, two-instance realtime 1/1, booking process-restart durability 1/1, Redis shared rate-limit 1/1 — **29/29 integration tests passed**. The script explicitly disabled mobility health polling while APIs were under test, so it did not write provider health or represent a live-provider acceptance. Temporary API processes exited through the script cleanup trap. These are local infrastructure integrations, not staging/production or device evidence.

## Full current-working-tree Web E2E retest

After review, updated only the two light-mode layer screenshots whose visual design intentionally changed (transport-mode tones, icons and availability labels): `transport-map-layers-light-darwin.png` and `navigation-light-layers-darwin.png`. The combined route-map scenario then passed with sheet states, stop details, segment focus and Light/Dark palettes.

Ran the complete root Playwright suite against the current dirty Site build and current dirty Server checkout, using a newly isolated loopback database `marshgo_e2e_candidate_20261025` and local map/geocoder/OSRM fixtures. The first run found only the stale layer screenshot (5% pixel difference); after updating the two reviewed baselines, the full repeat completed **25/25 PASS in 5.3 minutes**. The button audit clicked **169 controls**, with zero showing no visible effect. Covered responsive sign-in/home/search, route map and sheet states, all 12 transport categories, search/date/time/deep link, navigation, booking, demand/driver offers, persisted chat, two-rider GPS rerouting, GPS denial, truncation messaging, strategy metadata, and rendezvous consent/revocation.

The E2E command used local dirty worktrees (Server branch `feature/transport-layer-availability`, HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`; Site branch `codex/sync-journey-mobility-ui`, HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`), not the root manifest's pinned release artifacts. The check confirms browser behavior against local fixtures and local Postgres/PostGIS/Redis only. It does not provide immutable clean-candidate SHA evidence, external provider acceptance, staging, physical iPhone, or production evidence. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.

## Cross-browser compatibility

Ran the browser-compatibility matrix on the same current dirty Site build and local current Server/API plus the isolated loopback E2E DB and fixture services: **6/6 PASS across Chromium, Firefox, and WebKit** (responsive sign-in/home/search and the full route-map/sheet/stop-detail/segment-focus/light-dark scenario). This does not equal physical Safari/iPhone acceptance; no licensed production map tiles, live providers, staging, or deployed SHA were involved.

## Site static checks

On the same current dirty Site checkout after the E2E run: `npm run typecheck` PASS, `npm run lint` PASS, `npm test` **98/98 PASS**, and production `npm run build` PASS (1,862 modules transformed). Build output contains a 1,063 kB minified MapLibre vendor chunk; the bundle budget gate should be checked on a clean exact candidate, since this local build itself does not establish the release artifact budget.

## Exhaustive small-feed routing oracle — 2026-10-25

On the same dirty Server candidate (`feature/transport-layer-availability`, HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`), added two isolated test cases to `tests/gtfs-timetable.test.ts`. They independently enumerate feasible one-transfer pairs and two-transfer chains on deterministic small feeds, compare exact feasible itinerary identities with the production search, and assert the expected FASTEST, CHEAPEST, and BALANCED winners. The fixture also asserts `searchTruncated=false` so a test cannot pass by silently omitting candidates.

- Targeted timetable suite: `npx tsx --test tests/gtfs-timetable.test.ts` — **40/40 PASS**.
- Full Server suite: `npm test` — **231 PASS / 0 FAIL / 1 opt-in integration SKIP** (232 tests total).
- `npm run typecheck` — PASS; `npm run lint` — PASS.
- The two tests were copied from a clean historical route-oracle worktree only; no production algorithm from that divergent branch was merged. The canonical Server worktree was already dirty, and its changes remain preserved without broad staging or commit.

This proves exact parity only for these small deterministic fixtures. It does not resolve the dense Lviv replay's stop-selection, search-budget, and candidate-sampling truncation, nor validate large-feed ranking completeness. Next: extend oracle coverage for service calendars, explicit and nearby-platform transfers, realtime delays/cancellations, and add frozen multi-OD Lviv chain/winner comparisons before any production search change. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.

## Replayed dense Lviv search with stage counters — 2026-10-25

Repeated `.tmp-route-bench.mts` using the loopback-only `marshgo_e2e` database and the current catalog GTFS snapshot. This run used local departure `2026-10-25T05:00:00Z` (08:00 Europe/Kyiv), a 30-minute boarding window, up to four transfers, a 100-result page, and Node `v25.4.0` (repository engine declares `24.21.0`).

- Provider snapshot: 1,071 stops, 15,716 trips, 72 routes, 426,685 stop-time rows.
- Search: 1,197 ms in the summary run; 1,189 ms to final ranked debug stage in the counter run.
- Materialized 308,387 timed segments from 15,559 trips with eligible corridor stops; corridor 421 stops, interchange index 866 stops.
- Selected 20 origin and 20 destination access stops. The 30-minute request produced 221 first-leg candidates.
- Search explored 11,475 steps and retained 800 candidates: 200 each for 2, 3, 4, and 5 transit legs; zero one-leg itineraries. It returned 100 journeys across 50 line patterns / 9 mode sequences.
- `stopSelectionTruncated=1`, `searchBudgetTruncated=1`, and `candidateSamplingTruncated=1`; the hard global step and result caps were not reached. `searchTruncated=true` and `resultLimitReached=true` remain correctly exposed.
- Returned geometry/endpoints and chronological stop times: 329/329 valid; comparable UAH fares: 0.

This repeats the incomplete-search finding with fresh current-date evidence. It does not demonstrate stable baseline/winner parity across multiple OD pairs. The previous depth-fair/route-group approaches remain rejected. Next experiment should preserve existing materialized itinerary candidates as an immutable baseline pool and evaluate alternative discovery separately, with exact chain-identity/winner parity. Do not raise fixed limits or declare cheapness from missing fares.

## Correction: fare field and Lviv baseline prices — 2026-10-25

The previous temporary replay harness counted fares with `fare.total`. The `GtfsItineraryFare` contract instead carries `currency` and `priceMinor`; the former check reported zero priceable results even when a valid static Lviv tariff was attached. Fixed the harness to count only a UAH currency plus a safe integer `priceMinor`.

- Replayed the original 4-transfer, 08:00 Europe/Kyiv query: **100/100** results had a comparable UAH price from `city-tariff-registry`. Search remained truncated; geometry and stop-time validation remained 329/329.
- Ran two repeated baseline searches for each of three frozen ODs on 2026-10-23, 08:00 Europe/Kyiv, with a six-hour horizon and at most two transfers. Results were deterministic across each pair: Maloholoskivska→Sykhiv 100 journeys / 78 route chains / 1,435 and 1,743 ms; Naukova→Sykhiv 100 / 94 / 776 and 725 ms; Rynok→Dubliany 100 / 79 / 962 and 994 ms. Every run had 100/100 comparable fare values. Search/result truncation remained true in all six runs.
- All three strategy scores selected the same 23 UAH option in each OD. That is consistent with the current flat Lviv LeoCard fare and means these samples do not demonstrate distinct strategy winners. The deterministic small-feed oracle separately covers distinct winners.
- The official [АТП-1 payment page](https://atp1.lviv.ua/passengers/payment/) currently lists 23 UAH by LeoCard, 26 UAH by bank card/NFC, 30 UAH cash and an 11.5 UAH student fare; it also confirms free transfers up to 40 minutes for LeoCard/LeoCard app. I refreshed `lastVerifiedAt` only for these Lviv single-fare records and the associated transfer rule to `2026-10-25`. Other tariff records were not refreshed.

This corrects fare reporting only. It does not fix incomplete search, validate fares for other cities/providers, or establish a global cheapest result. Keep `searchTruncated=true` and the release NOT_RELEASED.

## Directional endpoint selection candidate — rejected, 2026-10-25

A temporary candidate reserved 15 of 20 nearest stop slots, then used up to five slots for stops progressing toward the opposite endpoint (`distance + 0.25 × onward distance`). The adversarial fixture proved the heuristic can retain a farther progressing stop, while keeping the truncation signal. Focused suite passed 41/41, full Server unit suite passed 233/0/1 opt-in skip, typecheck/lint passed, and local Postgres/PostGIS/Redis integration passed 29/29.

To avoid comparing against a historical branch with different dirty changes, the candidate was replayed against a generated copy of the exact pre-hunk current source, using the same cached Lviv feed, query date, coordinates, two-transfer limit, 180-second transfer buffer, runtime and scoring projection.

| Frozen OD | Baseline → candidate mode/route patterns | Exact trip-chain IDs preserved | FASTEST | CHEAPEST | BALANCED | Search truncated |
|---|---:|---:|---|---|---|---|
| Малий Голоско → Сихів | 31 → 33 | 82/100 | preserved | preserved | preserved | yes / yes |
| Наукова → Сихів | 41 → 40 | 78/100 | preserved | preserved | **changed** | yes / yes |
| площа Ринок → Дубляни | 24 → 24 | 92/100 | preserved | preserved | preserved | yes / yes |

Candidate-only new chains equaled the lost baseline chains in count (18, 22 and 8). One paired run per OD is exploratory, and timings varied (baseline/candidate 1,537/1,369 ms; 746/830 ms; 1,060/1,024 ms), so no performance gain is claimed. Candidate geometry endpoints, stop chronology and UAH price values were valid for all 100 returned items on each OD. All searches remained incomplete.

**Decision:** reject and revert this heuristic from the current Server working tree because it changed the BALANCED winner for one OD and replaced baseline chains without establishing a net reliability/completeness gain. Keep nearest-stop ranking unchanged. Next design must preserve a baseline itinerary pool while discovering alternatives independently; any later endpoint-selection change needs all three winners preserved across repeated runs, broader OD/time windows, and bounded-resource evidence. Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

### Baseline-preserving union replay

As a non-production experiment, the exact baseline and directional candidate options were merged by itinerary ID and passed through the existing Pareto/strategy-selection functions. The baseline 100 options were all retained; the merged pool contained 118, 122 and 108 options (18, 22 and 8 genuinely new candidates). The three baseline winners remained represented in the UI recommendation set on every OD, including Naukova→Sykhiv. This validates the *pool-merging concept* for preserving baseline candidates, not the directional search heuristic: that heuristic remains rejected. A production second pass would repeat substantial work, needs explicit latency/memory budgets, repeated feed/time-window validation and an honest truncation status; no source implementation was added.

### Time-window alternative-pool replay

On the same local Lviv snapshot, exact current source and frozen 08:00 query date, split the 30-minute departure window into two 15-minute searches (or three 10-minute searches for one OD), normalize durations to the original request time, and deduplicate by exact trip-chain ID.

| OD | 30-minute baseline | Two 15-minute pools | Union with baseline | Baseline winners represented | Single-run elapsed |
|---|---:|---:|---:|---|---:|
| Малий Голоско → Сихів | 100 options / 31 patterns | 200 / 57; 0 baseline IDs omitted | 200 unique (+100) | all 3 | 1,308 → 2,713 ms |
| Наукова → Сихів | 100 / 41 | 200 / 66; 2 baseline IDs omitted | 202 unique (+102) | all 3 after baseline union | 734 → 1,412 ms |
| площа Ринок → Дубляни | 100 / 24 | 200 / 53; 0 baseline IDs omitted | 200 unique (+100) | all 3 | 1,131 → 2,184 ms |

Every split search remained truncated. Across alternatives, geometry endpoints and stop chronology were valid and 200/200 had comparable UAH fares. On the first OD, three 10-minute windows yielded 300 results / 91 patterns, added 200 unique identities over baseline, preserved all three winners, and cost 4,405 ms versus 1,308 ms (3.37×). A single replay is not a latency distribution or load test.

**Decision:** time-slicing is a potential opt-in progressive “more alternatives” path, not the default first response: the tested 30-minute query roughly doubled latency with two windows and tripled it with three. A production continuation needs a bounded asynchronous design and realistic 120-minute query tests. Keep baseline results visible and preserve their candidates while appending alternatives; continue to report incomplete search. No source implementation was added.
