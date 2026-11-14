# Dirty worktree full E2E and production quality gate — 2026-10-25

## Scope and exact trees

- Orchestrator: `codex/production-finalization-20261014`, HEAD `0d068f7104d3cdedde9edb57a1be781df5e86491`, dirty.
- Site source: `codex/sync-journey-mobility-ui`, HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`, dirty. E2E loaded the explicitly provided local fixture build at `MarshGO-Site/dist`, built from the dirty source; it was not the immutable Site release SHA.
- Server: materialized release-manifest candidate `38f17b88f98c8530f8090cfc6745cd334c87e53c`; E2E database `marshgo_e2e` on loopback, development OTP, local test map/geocoder/routing fixtures.
- No files were staged or committed. No push, merge, deployment, or production-data mutation occurred. `git diff --check` passed in root, Site, and Server worktrees.

## Verification

- `npm run check:production`: PASS (typecheck, lint, unit tests, production build, bundle budget). Unit suite recorded 256 pass, 0 fail, 1 opt-in integration test skipped. The skip is not a pass.
- Full `npm run test:e2e` with visual comparisons intentionally disabled: **25/25 PASS** in 6.3 minutes.
- Separate route-map browser flow `e2e/journey-route-map.spec.ts -g 'canonical route map synchronizes'`: **1/1 PASS** for the interactions and assertions. It is **not accepted as screenshot-comparison evidence**: Playwright created the missing project-specific Chromium baseline `e2e/journey-route-map.spec.ts-snapshots/journey-results-light-chromium-darwin.png` during this run, so at least the results-screen image was bootstrapped from the current render rather than compared to an existing approved reference. Keep this generated image unaccepted until manually reviewed against the supplied mockups and an intentional baseline is approved.
- The safe production-route button audit clicked **179** enabled visible controls: **0** without visible effect, **0** changed before click, no page errors or unexpected 5xx responses.
- Covered six viewport widths, route search criteria and transport categories, route-map segment focus, route-sheet states/theme, simulated navigation GPS start/end and permission recovery, two-account booking/chat/boarding/completion/reviews, passenger demand/driver proposal, rerouting after GPS deviation, account export/deletion request cancellation, and rendezvous consent/revocation.
- Stale E2E assumptions were corrected to current production labels and behavior (segment-strip accessible names, past/upcoming trip tabs, current rating buttons, profile privacy controls, and explicit rendezvous-map expansion). No production behavior was weakened to make tests green.

## Limits / release state

- This is dirty-worktree local integration evidence, not an exact 5+1 release tuple or staging run. The full suite used `E2E_SKIP_VISUAL=1`; the focused route-map flow passed functionally, but its missing Chromium baseline was auto-created, so visual acceptance remains open. A previous 17% Journey Results delta was recorded against a different saved baseline; reconcile the correct reference before accepting or changing any snapshot. All-ten-reference review remains open.
- Maps, timetable/provider responses, and GPS are fixture/simulated data. It does not verify live feeds, licensed satellite imagery, physical Safari/iPhone or background GPS, Admin/Partner authenticated production acceptance, external payment/SMS, security/load/recovery, backup/restore, HTTPS staging, deployment, or deployed SHAs.
- Lviv GTFS search still reports truncation. Do not claim complete route recall.
- `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Next actions

1. Review every one of the ten supplied mock states against the actual production components and capture/review paired screenshots; identify the approved Journey Results reference and validate it without relying on auto-created snapshots or bulk-updating baselines.
2. Keep the modified test helpers/expectations as local E2E maintenance; reconcile the dirty Site and Server changes with the reviewed candidate PR SHAs before integration.
3. Continue the dense-GTFS completeness investigation against the exhaustive tiny-feed oracle and frozen multi-OD replay.
4. Continue authenticated Admin/Partner, iOS physical-device, security, performance, recovery and exact-candidate staging gates. Preserve `NOT_RELEASED` until the required gates pass.
