# PR #50 — frozen Lviv feasible-chain segment retention check (2026-10-28)

## Evidence

- Server PR #50 branch `codex/argo-lviv-route-completeness-20261027`, candidate `98ba8884f5b2316ed49d775fd947bc4f6ca3819a`; baseline `3c14c28b5e3a8dfe50c806f8bb45ade2f3d6a942`.
- Hosted replay `40599384540`, frozen Lviv GTFS SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`, OD Bryukhovychi `[23.93108,49.90840]` → Sykhiv `[24.07259,49.79686]`, Friday 2026-10-23, 04:00–04:30 UTC. Both revisions were repeat-stable (3 runs); result identity and all strategy winners matched. Candidate graph, search budget, sampling and response page were truncated on both.
- The public archive checksum was reverified. Service 31 is active Fridays. Exact schedule witness: A67 `32952_0_1` Bryukhovychi DOK 07:07 → stop `44250` 07:35; A11 `30617_0_1` stop `44250` 07:45 → `4595` 08:21; A41 `32656_0_1` stop `4595` 08:32 → Sykhiv stop `4847` 08:44 (842 m egress) or `4816` 08:46 (584 m egress). Same-stop waits are 10 and 11 minutes; the archive has no `transfers.txt`.
- Replay trace contains the exact A67 access pair `2563299→44250`, but A11 retains only `4767→4768` and A41 retains seven pairs, none boarding at `4595`. Thus trip-ID presence does not imply preservation of the needed stop-pair edges. The exact three-trip chain was not completed/generated in either revision. A17/T07 alternatives were generated and ranked on both.
- Source inspection localized candidate projection and bounded group selection to `materializeTripInstanceLegs` and `findGtfsItinerariesWithStats` in `server/journey/gtfsTimetable.ts`; existing evidence does not yet isolate whether the missing pair is excluded by corridor/interchange eligibility, the long-stop-pair projection guard, or downstream bounded retention.

## Decision and next action

- This is a raw-GTFS feasible-chain recall gap under the tested query, not a regression between PR base and candidate. Do not infer the exact cause from trip-ID presence alone; do not raise graph/search caps.
- Gemini 4 Argon was sent one bounded read-only review of the relevant source/test regions to distinguish eligibility/projection from retention and propose the smallest fixed-budget regression oracle. Antigravity UI confirmed `Working`; quota telemetry is unavailable. No code change, merge or deployment was made.
- Independently validate Argon’s diagnosis; then add a deterministic miniature-feed regression asserting this three-leg witness under a fixed cap. Change serving logic only if the test demonstrates a bounded-vs-exhaustive mismatch. Run the focused test and hosted exact-head replay/CI; keep production `NOT_RELEASED`.

## Bounded projection diagnosis follow-up

- Gemini 4 Argon's source review identified two sequential losses in `gtfsTimetable.ts`: per-trip `BoundedBestK` ranks stop-pairs by the segment's own arrival, then a connector scan evaluates at most two feasible candidates and retains one best continuation. This explains how an earlier intermediate stop can displace a later stop with a faster complete journey; the diagnosis is independently inspectable but not yet test-confirmed on this worktree.
- A test-only fixed-budget regression draft now compares an exhaustive feasible chain with the bounded graph and asserts the required hub-to-hub segment plus returned three-trip itinerary. It has not run yet; fixture validity and candidate route-budget allocation remain unverified.
- Argon has a separate source-only implementation task on `server/journey/gtfsTimetable.ts`; Codex owns only the test file. Antigravity shows `Working`. No quota data is exposed.
- Local heavy tests are deferred: macOS reports 32% memory free, ~7.1 GiB swap used, 11 GiB disk free, and high system load. No serving changes have been accepted. Next: inspect Argon's source diff, verify scope, then run the single focused test when resource pressure permits; keep graph caps fixed and production `NOT_RELEASED`.

## Argon implementation delivered; review pending

- Argon changed only `server/journey/gtfsTimetable.ts`: memoizes `hasPriorEvent`, changes through-connector ranking to use earliest complete onward arrival where available, and feeds each feasible connector into the already bounded overflow reservoir. Declared total/per-route caps remain unchanged.
- Codex static review only so far: `git diff --check` PASS. Unit/regression tests have NOT_RUN; commit/push/merge/deploy have NOT occurred. Review still must assess CPU work per candidate and validate that the weak-map cache's fixed transfer-buffer assumption holds at all call sites.
- Local verification deferred because host reported 28% free memory, ~6.5 GiB swap used, 12 GiB free disk and load averages ~370/255/147. Next: finish static review, then test only when host load is safe; otherwise use hosted CI after a reviewed commit.

## Candidate committed for remote verification

- Argon recommended retaining the old connector-loop cutoff after the onward-arrival comparator change; Codex restored that bound. Argon's stated overflow capacity of 64 was not source-accurate; the constant is 8.
- The remaining change (memoized prior-event predicate and onward-arrival ranking) plus the fixed-cap test is committed as `09a229acc6f240ac9e81d5250a05845e6cd9ec9f` and pushed to the existing open PR branch.
- Exact-head CI runs `40640579189` and `40640574332` are IN_PROGRESS. Local focused test remains NOT_RUN due resource pressure. Next: monitor these runs, then perform the pinned-feed replay only if exact-head CI passes. No merge/deploy; production stays NOT_RELEASED.

## Exact-head type correction

- CI at `09a229a` failed in typecheck because the test fixture's coordinate arrays inferred as `number[]`; both jobs reported this same compile error, with no product tests executed.
- Added tuple annotations only in the test and pushed follow-up `8dea03f6d5e523fc7d52ef92cfa6d0b2306e0952`. Exact-head CI runs `40640742965` and `40640738043` are IN_PROGRESS. Continue to treat tests as pending until these finish.
