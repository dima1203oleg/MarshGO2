# PR #35 vs PR #50 unique delta reconciliation — 2026-10-27

Read-only comparison of canonical Server refs; no source files, branches, or PRs changed.

## Verified refs

- PR #35 `codex/server-final-rc-20261024`: `6cd3b6c5613e4165576fdb4bc2662a02c9e54818`
- PR #50 `codex/argo-lviv-route-completeness-20261027`: `a66044e0d5ec5f34bbff945d2352dc24624921d6`
- Their common ancestry is `feature/transport-layer-availability`; PR #35 has four unique commits beyond it, while #50 follows the newer stacked #49 lineage. Both PRs remain separate candidates; do not blind-merge.

## Findings

- PR #35's dependency-lock updates are already represented by #50: `body-parser` 1.20.9, `ip-address` 10.7.4, `markdown-it` 14.3.3, and `zod` 4.6.7. No lockfile port is indicated by this comparison.
- `server/migrations/054_rendezvous_participant_consent.sql` and `server/journey/requestSearchMemo.ts` have identical blob IDs in #35 and #50; these changes are already present exactly.
- `gtfsSearchWorker.mjs`, `gtfsSearchWorkerClient.ts`, `gtfsSearchWorkerCore.ts`, and `liveJourneySegments.ts` exist in both branches but have different blob IDs. #50 contains substantial later edits (including a large GTFS timetable rewrite); file presence alone does not establish semantic equivalence. Review their behavior and tests before accepting or porting anything.
- Both branches retain the same worker client class and its public operations (`search`, `searchGroup`, `stopArrivals`, `tripMetadata`, `diagnostics`, `close`), the same GTFS worker-core exports, and `buildLiveJourneySegment`. In #35, `LiveJourneyTripData` is an internal type imported by `server/index.ts`; #50 removes that type and its explicit annotation while retaining the helper call. This type cleanup does not reveal a missing public contract. #50 also adds test-fixture directory wiring to the worker client; that is a scoped testability difference, not evidence of a production feature loss.
- A declaration-level comparison across every test file changed by #35 found exactly three removed test names and no removals in worker, live-journey, realtime routing, scoring, booking, mobility, or transport-layer test files. #50 adds 56 GTFS timetable cases plus dedicated tests in the other affected areas. The nearest-stop test is replaced with a distinct-route/bounded-stop case; the candidate-sampling case now uses the actual 750 bound; the 160-route pagination case was restored at PR #50 head `f35a095`.
- Realtime/live-vehicle code in #50 is evolved rather than omitted: boarding selection can now use fresh GTFS-RT arrival predictions after observed-progress candidates, with explicit evidence and ETA checks; realtime trip updates use schema-validated smart-cache serialization; provider health reports per-vehicle position freshness. #50 has added live-journey and realtime regression cases. Exact equivalence across all production paths is not asserted by this declaration/diff review.
- The #35 delta spans 31 paths; all 31 paths exist in #50. Seven have identical blobs (`package-lock.json`, migration 054, `requestSearchMemo.ts`, `jsonVehicles.ts`, `timestamps.ts`, `mobility.test.ts`, and `request-search-memo.test.ts`); the other 24 have later, different contents. No changed path is simply absent from #50.
- PR #35's bounded GTFS candidate-pool change (commit `098b85c`) widened per-leg candidates from `min(limit*2, 500)` to `min(limit*5, 1000)`. The regression suite is `tests/gtfs-timetable.test.ts` (hyphenated filename). #50 retains the file but removes three old test declarations; it adds/rewrites objective-reservoir cases, including late cheap direct/transfer options and a cheap three-leg option surviving dense pools. The current #50 implementation uses a fixed 750 per-leg cap plus separate objective samples. The path-level test diff is therefore a rewrite, not a missing file. This is evidence of a later mechanism addressing candidate loss, but does not prove parity for every feed/query or eliminate #35's exact experiment result.

## Decision / next action

Do not merge PR #35 wholesale. Its changed paths and worker API surface are represented in #50; candidate retention has later dedicated objective-reservoir tests. Remaining risk is behavioral coverage across the changed internals, not an obviously missing file or API. Next compare PR #35's unique behavior/tests with #50's corresponding oracles and pinned replay; if no unique behavior remains, record #35 as superseded by #50's later implementation rather than porting duplicated code. Keep production `NOT_RELEASED`.

## Evidence limits

Git ancestry, all 31 changed paths, blob IDs, lockfile versions, GTFS test declaration deltas/assertions, and candidate-cap implementation were inspected. No local builds or tests were run due to critically low free memory and disk pressure; no full semantic-equivalence claim is made.

## Existing replay review and duplicate CLI attempt

- The exact PR #50 vs PR #49 replay already has an accepted Argon review in `docs/audit/293_PR50_WINNER_TUPLE_CROSSCHECK_2026-10-27.md` and `AGY-PR50-OBJECTIVE-TUPLES-20261027`. It established that the three strategy winners change only the first trip ID; the visible stop sequences, scheduled times, transfer count, and transit span are equal. The prior trip chain remains among the candidate's retained chains. Fare, door-to-door duration, and walking metres remain unverified; replay truncation remains.
- A later, redundant headless Argon request failed before reading the artifact: sandbox denied `read_file`, response was empty. CLI-reported usage was 21,315 total tokens over 40.618 seconds. No retry or permission bypass was attempted. The failed call is recorded in `docs/AI_AGENT_QUEUE.json`.
- Decision remains: no demonstrated winner regression from this tie-break, but no full objective/completeness proof. Reuse audit 293; do not pay for another identical review.

## Current PR #50 test-gate follow-up

- Found that two objective-reservoir fixtures contained only 520 and 501 candidates despite asserting behavior beyond a 500-item bound. The current PR #50 cap is 750 candidates per leg count, so those fixtures did not exercise the claimed cap.
- Updated only `tests/gtfs-timetable.test.ts`: it now exercises 751 transfer alternatives and 751 direct alternatives and asserts `candidateSampling`/`searchTruncated` when the per-leg cap excludes candidates, while preserving the cheapest result. Also restored a 160-route / 50-result-page case asserting pagination without incomplete-search status.
- Commits pushed to existing PR #50: `1f62dbadc05aebc66f830de500c6620813aa8862` and `f35a095b7e3ff424d96dfccec635c2ea3cbc2d2f`. At final head `f35a095`, exact-head CI runs `40584499772` and `40584508076` both PASS in 2m41s and 2m42s, including full unit tests, lint, typecheck, DB migrations, Postgres/Redis integration, API image build, and smoke. Local tests were not run due to low free memory; no serving code changed.
- PR #50 remains OPEN and CLEAN. This verifies these test corrections and existing CI scope only; it does not prove routing completeness or production readiness. Next: compare PR #35's remaining unique behavioral oracles against #50 and frozen-feed results; keep production `NOT_RELEASED`.
