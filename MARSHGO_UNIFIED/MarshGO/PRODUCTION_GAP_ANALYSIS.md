# Production gap analysis — 2026-10-23

## Exact candidate recheck — 2026-10-23

The Site/iOS input pin is aligned: Site PR #20 is `a000b3cc07a956ae7ded4563ab5e97b11fe3db71`; iOS PR #12 head `6e825cd59df9529c9b88aab063989d7328497fef` pins that exact Site SHA with Server PR #31 base `b65882584a3ad1e8dd7512d13176f52299cded51`. iOS Simulator run `39996495495` passed, including exact source checkout, Capacitor build/sync, embedded manifest verification and simulator compile. Site hosted runs `39995439983` and `39995439935` attempt 2 passed, including browser acceptance. This is still not a full release tuple: Server PR #32 `d34601cf4385b32a06bb92f7ce79998a518dfee3` is an E2E-only OTP throttle child candidate, Admin #1 and Partner #1 are open/unmerged, and root PR #6's security workflow passes while umbrella CI fails. Exact PR refs/checks are recorded in `PR_DEPENDENCY_DAG.md`.

Site #20's local production gate passes (129 unit tests, 24/24 fixture browser E2E across Chromium/Firefox/WebKit, typechecks, lint, build, and bundle budget). Hosted workflows `39995439983` and `39995439935` attempt 2 both passed. Root fixture functional E2E passes 19/19. This adds review evidence but does not close cross-repository consistency, provider, staging, mobile, resilience, or pixel-acceptance gates.

## Release state

`PRODUCTION_READY = false`; `RELEASE_STATUS = NOT_RELEASED`. The root release manifest confirms these values. There is no verified staging URL/API origin or deployment record. No production deployment has been attempted.

## Blocking gates

1. **Exact tuple not consolidated:** root manifest now records a review-only candidate tuple: Server `b6588258...`, Site `a000b3cc...`, iOS `6e825cd5...`, Admin `9dbf7db0...`, Partner `c639257a...`, integration `39a18209...`. Component PRs remain unmerged, Admin/Partner auth workflows are not tested, and root umbrella CI still fails.
2. **Umbrella verification fails closed:** root PR #5/#6 `verify` cannot clone private Admin/Partner repositories because owner-managed `MARSHGO_REPOS_READ_TOKEN` is not configured. Other root security scans pass; this does not replace full verify.
3. **Staging absent:** no configured/verified host, stable DNS/HTTPS, test API origin, operational secrets, database, provider acceptance or deployed SHA is available. Existing localhost or old temporary tunnel is not staging.
4. **Routing completeness:** tested Lviv OD/transfer requests disclose `searchTruncated=true`; experimental replacements fail frozen-feed oracle/winner-retention criteria. Do not advertise complete optimal/fastest/cheapest results while this remains.

5. **Mockup visual acceptance:** ten owner images are references, but only targeted route-sheet visuals have been reviewed. The app's live map artwork/layers differ from mock assets; all ten screens have not passed state-matched visual review. Existing baseline mismatches remain open and must not be overwritten to force green.
6. **iOS/device gates:** exact iOS simulator build passed, but physical iPhone Safari/background GPS, signing, APNs and TestFlight are not tested.
7. **Recovery and load gates:** no authorized staging load test, backup/restore drill, or rollback verification exists.

## Next engineering actions

1. Resolve the owner-managed private repo read token for root CI without bypassing access controls, then rerun the umbrella checks against the exact tuple.
2. Continue the Server PR #31 frozen-feed routing-completeness investigation; keep `searchTruncated` explicit until an oracle-passing candidate exists.
3. Run authenticated Admin/Partner browser workflows using disposable accounts and the exact API contract.
4. Obtain a real staging origin/provider credentials and licensed map assets; run live staging acceptance, backup/restore and rollback.
5. Complete reference-matched visual acceptance and physical iPhone acceptance, then refresh all exact SHA pins and the manifest.
5. **Live transport proof:** GTFS-RT snapshots show sparse/zero positions in some requested cities, and no exact all-city vehicle-to-route-to-direction-to-UI acceptance. Catalog availability is not commercial/API permission or booking.
6. **Visual acceptance:** user supplied ten references. The audit found no complete pixel/functional acceptance for all six route/navigation states in both themes; map style/assets are not configured in the release candidate and one screenshot baseline is known to be a legacy layout mismatch.
7. **iOS field acceptance:** simulator CI is green for its pinned tuple; physical iPhone, live GPS/background, APNs, deep-link recovery and signed distribution are not tested.
8. **Operational gates:** staging backup/restore, migration rollback, monitoring/alerting, HTTPS smoke and production rollback are not evidenced.

## Production path

Continue independent code and CI work. Configure exact read-only private-repository CI access, reconcile candidate SHAs and rerun the umbrella checks. Then use an owner-controlled staging target to validate the exact artifact, data migrations, live provider capabilities and browser/device flows. Only after backup/restore, rollback and HTTPS smoke evidence should the release manifest become `WEB_DEPLOYED_VERIFIED`; production traffic remains separately gated by explicit owner approval.
