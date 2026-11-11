# GTFS service-day DST semantics — 2026-10-27

## Finding

On Server head `8443bb71cba6be09e08d874b17c693d3a2bfcc8d`, `localServiceTimeToUtc` interprets GTFS seconds as wall-clock time on `serviceDate + floor(seconds / 86400)`. A focused fixture for `Europe/Kyiv`, service date 2026-03-29, and a `00:30` trip reproduced two observable outcomes:

- Querying the prior local evening (2026-03-28 23:25–23:35) returned no trip because candidate service dates stop at the query's last local date.
- Querying 2026-03-29 00:25–00:35 returned service date 2026-03-29 at `2026-03-28T22:30Z` (local 00:30).

A literal elapsed-time interpretation of the GTFS reference (“noon minus 12h”) computes noon as `2026-03-29T09:00Z`; minus 12 hours plus 30 minutes gives `2026-03-28T21:30Z` (local 23:30). This would require both a different converter and a one-day service-date lookahead for this edge case.

## Evidence and uncertainty

- The [GTFS Schedule reference](https://github.com/google/transit/blob/master/gtfs/spec/en/reference.md) defines Time as measured from “noon minus 12h” and says this is effectively midnight except on DST-change days.
- The [GTFS community issue #325](https://github.com/google/transit/issues/325) derives exactly this unusual transition-day mapping but is marked stale; its author also reports that producers often do not publish special transition-day schedules. This is evidence of unresolved producer/consumer practice, not a settled implementation consensus.
- Antigravity (Gemini 3.8 Flash Medium) independently noticed transition-day divergence, but its claim that wall-date mapping is universal practice was not backed by a source and is not accepted as evidence.
- The same-day DST fixture used for this probe is deterministic; it does not prove how current Ukrainian operators encode transition-day trips.

## Decision / next action

No production code changed. Do not alter the verified per-feed lookback PR based on this unresolved edge case. First inspect actual licensed/public Ukrainian GTFS feeds for service times and calendar behavior across transition dates and check maintained reference consumer behavior. Then add spring-forward, fall-back, prior-evening, and extended-hour regressions and implement a compatible service-day conversion plus service-date candidate window as a separate change if evidence supports it.

PR #46 remains open/unmerged. Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Current reference-consumer source check

- Inspected the official OpenTripPlanner `dev-2.x` source at commit `bc0eb6ef3323004f00aab46bd4656f5a75ebaacb` through its GitHub tree API. [`ServiceDateUtils.java`](https://raw.githubusercontent.com/opentripplanner/OpenTripPlanner/bc0eb6ef3323004f00aab46bd4656f5a75ebaacb/core/utils/src/main/java/org/opentripplanner/utils/time/ServiceDateUtils.java) documents GTFS service dates as starting 12 hours before noon; `asStartOfService(LocalDate, ZoneId)` implements `ZonedDateTime.of(localDate, LocalTime.NOON, zoneId).minusHours(12)`, and `toZonedDateTime(...)` adds GTFS seconds to that instant. The tree response was not truncated. This is direct current-consumer evidence for noon-minus-12 elapsed-time semantics, not evidence of what every feed producer emits.
- Correction to the candidate-window hypothesis: `floor(23h/24h)=0` by itself does not prove a missing prior service date under the current wall-date converter. Under the pinned OTP service-day rule, the 2026-03-29 service day in Europe/Kyiv starts at 2026-03-28 23:00 local; therefore GTFS `00:30` for service date 2026-03-29 maps to 2026-03-28 23:30 local. The actual edge is a *forward* service-date candidate: a query in that prior-evening window must consider service date 2026-03-29, while the current query scans only through the query's local date. The current converter also maps that `00:30` to calendar-date 2026-03-29 00:30. Regression should assert both the exact instant and inclusion of the next service date before changing conversion or candidate bounds.
- The current source branch is mutable (`dev-2.x`); pin its branch commit SHA and relevant test evidence before citing it in an implementation decision. Antigravity's independent source lookup is still active and has not returned an exact-source result; its repeated searches are not evidence.

## Next action

Create an isolated Server worktree from `8443bb71cba6be09e08d874b17c693d3a2bfcc8d`, add a deterministic spring-forward regression: active service date 2026-03-29 with `00:30` stop time, queried 2026-03-28 23:25–23:35 local. First confirm the current implementation misses it; then implement a pinned-rule conversion plus a bounded next-service-date candidate check and run only that test. Keep PR #46 unchanged until this behavior and its feed-compatibility implication are reviewed. Antigravity has been sent the pinned source and exact counterexample for a short read-only review.

## Isolated regression reproduction

- Created Server worktree `/tmp/marshgo-server-dst-lookback`, branch `codex/gtfs-dst-lookback-20261027`, based on `8443bb71cba6be09e08d874b17c693d3a2bfcc8d`. Existing PR #46 worktree and files remain unchanged.
- Added `includes the next GTFS service date during the prior-evening spring-forward overlap` to `tests/gtfs-timetable.test.ts`: active exception date 2027-03-28, GTFS 00:30 departure / 00:45 arrival, query 2027-03-27 23:25–23:35 Europe/Kyiv. Under the pinned OTP rule, expected instants are 2027-03-27T21:30Z and 21:45Z.
- Targeted baseline run fails as expected at `direct.length`: 0 returned, expected 1. This confirms the current production query path neither uses the next service date for this overlap nor the elapsed noon-minus-12 conversion. No production logic changed yet. Dependencies are shared by a local symlink to the existing Server worktree; no install/build was run.
- Antigravity has been sent a concise, read-only reconciliation request with the pinned OTP source URL and this exact boundary case. The prompt was visibly sent and its response is still `Working`.
- Antigravity first confirmed the pinned OTP 2.x source, but its explanation that a ≤23h maximum drops late trips from the *previous* service date was not accepted: the transition-origin shift is for the service date on the transition day, so this fixture's missing candidate is the *next* service date when queried on the previous local evening. A second concise clarification was explicitly sent immediately; it is now `Working`.

## Public-feed inspection update

- Downloaded the catalogued Kyiv HTTPS mirror on 2026-10-27: 1,214,651 bytes, SHA-256 `8a2911ca31b54d80c0bc401e68423c9f597d6a252b5ab1f9881e214da1140a00`; `feed_info` version `20261027` declares service validity only 2026-10-27 through 2026-10-30. Although its calendar has Sunday service and rows at GTFS hours 00–03, those rows cannot be treated as valid for the 2026-10-25 DST date because that date is outside the feed's declared window. This corrects the initial calendar-only inference.
- Downloaded the catalogued Lviv static feed on 2026-10-27: 3,755,976 bytes, SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; `feed_info` version `6.506` declares 2026-10-12 through 2027-08-26 and agency timezone Europe/Kiev. Its 2026-10-25 Sunday services have no stop-time events at GTFS hours 00–04, and Saturday service on 2026-10-24 has no times >=24:00. Therefore this current Lviv feed also does not exercise the transition-hour ambiguity.
- The actual-feed probe confirms that the question is not resolved by currently available sample rows; a historic feed version spanning the transition and containing service around the changed hours, or authoritative producer guidance, is still needed. No production behavior change is justified from these samples.
- Historical consumer evidence: the official [OpenTripPlanner 1.5.0 `ServiceDay.java`](https://raw.githubusercontent.com/opentripplanner/OpenTripPlanner/v1.5.0/src/main/java/org/opentripplanner/routing/core/ServiceDay.java) derives a service day's `midnight` from `ServiceDate.getAsDate(timeZone)` and implements `time(secondsSinceMidnight)` as `midnight + secondsSinceMidnight`. This is a primary-source example of civil-midnight arithmetic in a maintained historical consumer, but it does not establish current OTP 2.x behavior or universal practice.
- Follow-up implementation checkpoint: isolated worktree `/tmp/marshgo-server-dst-lookback`, branch `codex/gtfs-dst-lookback-20261027`, based on `8443bb71cba6be09e08d874b17c693d3a2bfcc8d`. The baseline failing regression is now fixed in the isolated diff: conversion uses the pinned OTP 2.x noon-minus-12 elapsed origin, and all three service-date scans (direct journeys, routed itineraries, stop arrivals) use a window helper that includes the next service date only when its service start overlaps the query's prior local evening. Exact Kyiv 2027-03-28 expected instants: 21:30Z departure, 21:45Z arrival.
- Verification: full `tests/gtfs-timetable.test.ts` 79/79 at first commit; spring and fall focused DST regressions pass; `npm run typecheck`; scoped ESLint; `git diff --check` pass. Antigravity Gemini 3.8 Flash Medium completed the scoped read-only review. The code is in draft PR #47, not PR #46.
- Antigravity completed the scoped review with no concrete ordinary-day or fall-back candidate-window regression. Its request to read `.git/HEAD` was rejected; it received no broader project access.
- The implementation commit `338ebce3f2c1b592be3bef98f144984dbe65ffd4` and fall-back regression commit `ab9b99d6ab6b1f7fa3e4f68592d26d20200b6129` are on isolated branch `codex/gtfs-dst-lookback-20261027`. Draft PR #47 is stacked on PR #46. Exact-head CI runs `40437755965` and `40437760193` both PASS. Do not merge/deploy.
