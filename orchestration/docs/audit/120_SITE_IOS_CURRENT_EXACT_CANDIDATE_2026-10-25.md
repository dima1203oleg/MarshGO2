# Site and iOS current exact candidate acceptance — 2026-10-25

## Candidate identity

- Site: `dima1203oleg/MarshGO-Site`, PR #23, branch `codex/rideshare-route-detail-reference-20261024`, exact head `44a5e4a4b7281d78b72554d7ddfad3ee1bbe9492`. PR is OPEN, draft, mergeable (`CLEAN`). Hosted Verify runs `40132182053` and `40132186290` both PASS.
- iOS: `dima1203oleg/MarshGO-iOS`, PR #14, branch `codex/ios-final-rc-20261024`, exact head `94658424c73d7a7e5c1c916560993a460d11f7cb`. It pins Site `44a5e4a4b7281d78b72554d7ddfad3ee1bbe9492` and Server `134ed017828a020e1d5f696b3cb9ea95527bb093`. Hosted simulator-build runs `40133302719` and `40133306386` both PASS. PR is OPEN and mergeable; it is no longer draft.
- The umbrella checkout is still dirty and not an immutable release artifact. No unrelated root changes were staged or committed.

## Site verification

- Unit tests: 105/105 PASS.
- TypeScript, ESLint, production build, and 350 KB gzip chunk budget: PASS.
- Exact candidate production bundle exercised in local fixture Playwright E2E: 20/20 PASS in about 5.5 minutes. This includes route search/results, all route-map sheet sizes, light/dark states, layer controls, browser URL restore, booking/chat paths, driver GPS/reroute flow, rideshare rendezvous, partial-search/fare disclosure and mobile viewports.
- A 178-control sweep was run, but that count is not proof that every button has a meaningful successful backend action. Direct assertions covered the relevant flows above; unauthenticated, unavailable, and invalid-state controls may correctly produce no transition.
- Simplified the map layer sheet by removing the extra preset strip that duplicated layer toggles. The canonical 12 transport modes and truthful availability states remain.
- Updated two screenshot baselines for the changed sheet. Screenshots are local fixture comparisons using synthetic map tiles; they do not establish parity with the ten supplied design mockups or licensed production cartography.

## iOS verification

- Built the web bundle from the exact Site SHA, synced it with Capacitor, embedded the exact iOS/Site/Server manifest tuple, built an unsigned Xcode Simulator app, and installed/launched on iPhone 15 Pro Max and iPhone 16 Pro Max simulators.
- Screenshots: `/tmp/marshgo-final-44a5-iphone15.png` and `/tmp/marshgo-final-44a5-iphone16.png`.
- Simulator launch and first-screen rendering PASS. API `http://localhost:3002` was not listening during the native run, so authenticated API, booking, GPS, route map, reconnect and app-resume scenarios remain NOT_TESTED. No physical iPhone, background location, APNs, signing, TestFlight or App Store test was performed.

## Release boundary

- These are source candidate checks, not staging or production evidence. PRs remain unmerged.
- The previously built local OCI web image is still pinned to Site `10454f37b59a848e4a5b381689dfe7f701fe2b81`; it is stale for the new Site head and must be rebuilt before the image tuple is considered current. The old image digest remains historical evidence only.
- Ten-mockup visual acceptance remains NOT_ACCEPTED. Synthetic fixtures do not provide the real transport/live vehicle/map artwork shown in the references.
- Dense Lviv route-search truncation, live feed/provider rights and coverage, authenticated Admin acceptance, staging, security/load/recovery, backup/restore, rollback, physical-device acceptance and production deployment remain open.
- `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`. No production deployment was performed.
