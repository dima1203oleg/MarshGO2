# Exact Site/Server/iOS candidate checkpoint — 2026-10-26

## Immutable candidates

- Server PR #43: `24c70dc31d652ac6ba9fbc5fcd7abd138378b457` (`dima1203oleg/MarshGO-Server`). Hosted verification is green. Local checks recorded for this candidate: typecheck, lint, 316 unit tests passed (3 opt-in skips), and 30/30 Postgres/PostGIS/Redis integration checks.
- Site PR #28: `df0d61d3ff6c36c8522e8d57721a361d94ec16b9` (`dima1203oleg/MarshGO-Site`), draft, base `codex/site-gtfs-truncation-reasons-20261025`. Hosted `verify` checks passed (runs 40292993643 and 40292999186). Candidate local evidence: typecheck, lint, 116 unit tests, production bundle build, and the browser acceptance described below.
- iOS PR #15: `808685022654925de3bbbe911a9ebd25d381db7c` (`dima1203oleg/MarshGO-iOS`), draft, base `codex/ios-final-rc-20261024`. Its CI fallback pins target the exact Site and Server SHAs above; API contract fallback is `v1`, migration fallback `055`. Both hosted `simulator-build` checks passed (runs 40293246120 and 40293264988). This is simulator CI, not physical iPhone acceptance, TestFlight, or App Store proof.

## Site/browser acceptance

- Full browser suite on the immutable Site/Server pair: 24/25 passed. The one failure is the strict existing `journey-results-light.png` screenshot comparison (38,818 pixels, about 12%). Baseline and threshold were not changed. All other route, segment, booking, chat, navigation, rendezvous, mode, responsive, and truncation scenarios passed.
- Control audit: 169 buttons exercised; 0 inert buttons and 0 controls stale before click.
- Focused rechecks after the final search-warning wording change: rendezvous, GPS reroute, and truncated-search warning passed 3/3. Full suite has not been rerun after that wording-only change.
- The visual run used deterministic local map/geocoder/OSRM fixtures. It does not prove real licensed map/satellite assets, live provider data, or visual equivalence to all ten supplied mockups.
- PR #28 hosted checks are green, but screenshot acceptance remains a documented failure; no snapshots were updated.

## Release decision

`PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`. No production deploy was attempted. These candidates are not a fully verified production release tuple. Still absent or unverified: current exact Admin/Partner builds and authenticated tenant acceptance; production/staging URL and deployed SHA; licensed/authorized real map assets; provider credentials/contracts and live capability probes; physical iPhone acceptance; production security acceptance; load target evidence; backup/restore and rollback exercise; complete visual review of all ten mockups; and owner approval for deployment. Root orchestrator CI also remains gated on the private-repository `MARSHGO_REPOS_READ_TOKEN`; do not weaken that check or copy a personal token into CI.

## Next exact actions

1. Read the final result for iOS PR #15 `simulator-build`. If green, record only simulator-build evidence and update the exact tuple; do not call it device acceptance.
2. Re-run the full Site browser suite against the exact PR #28 SHA after the last copy change. Keep the light-results screenshot gate strict and diagnose the remaining raster delta without replacing the baseline.
3. Check out the exact Admin/Partner PR candidates and run their server-backed tenant/auth acceptance against Server `24c70dc…`; report missing repositories/credentials as external blockers.
4. Resolve staging endpoint, authorized map asset/imagery terms, provider keys/contracts, and private cross-repo CI access through the project owner. Continue independent checks meanwhile.
5. Complete security, load, backup/restore, rollback, and mockup-by-mockup visual gates; then prepare manifest/runbooks and request only the separately required deployment approval. Keep production NOT_RELEASED until all gates are evidenced.
