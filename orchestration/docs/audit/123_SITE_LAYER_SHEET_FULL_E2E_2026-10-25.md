# Site layer sheet fit and exact candidate browser acceptance — 2026-10-25

## Change

- Site PR #23 head: `9569bb4f174a4bdf912a6f490e69a359148db342`.
- iOS PR #14 head: `0b404ca4dba62d1bba79847b79f052f0e0425ff7`, pinned to Site `9569bb4f174a4bdf912a6f490e69a359148db342` and Server `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- The map-layer sheet spacing was tightened so all expanded transport, display, and infrastructure controls fit above the persistent bottom navigation at the tested iPhone viewport. Each layer row retains a 44px minimum hit area. Two screenshot references were regenerated after reviewing the current rendering.

## Evidence

- Site exact-head hosted CI: runs `40135110464`, `40135106832` PASS.
- iOS exact-head hosted simulator CI: runs `40135128350`, `40135124223` PASS.
- Full local browser E2E on Server `134ed017828a020e1d5f696b3cb9ea95527bb093` + Site `9569bb4f174a4bdf912a6f490e69a359148db342`: 20/20 PASS in 5.0 minutes; after the audit harness was strengthened, the complete suite was repeated and passed 20/20 in 4.9 minutes (audit 125). Includes responsive sign-in/home/search, 178 visible controls clicked, canonical route-map and theme states, two-account booking/chat, driver/rider GPS reroute, iPhone 15/16 viewport, and rendezvous consent UI.
- The layer-sheet layout assertion measures `scrollHeight <= clientHeight` above the global navigation and passes. The final infrastructure control is in viewport without scrolling.
- Site source typecheck, ESLint and production build PASS on the final source sequence. Source build on this orchestration host used Node `v26.7.0`, while Site declares `24.21.0`; hosted Site CI is the pinned toolchain check.

## Findings and limits

- The button audit used in the original run logged 17 of 178 controls with no observed DOM, URL, or network change. A follow-up review found this was a measurement/context defect (partial state fingerprint and retained Trips tab). See audit 125: the strengthened sweep clicked 179 controls across 15 routes with zero no-effect/stale controls and asserts both conditions. Excluded and privileged flows remain separately unverified.
- The test suite is fixture-backed and local. It does not establish external provider coverage, production maps, live transport data, real-account payments, physical iPhone GPS/background, production load, or staging/production behavior.
- Screenshot acceptance covers the changed layer-sheet state and existing route states. The complete set of ten user mockups is still NOT_ACCEPTED as a visual match.
- Site and iOS PRs remain open/unmerged. OCI Site image remains stale; no exact current four-image smoke, staging, deployment, or production smoke is evidenced here.
- Production stays `NOT_RELEASED`; `production_ready=false`.

## Next

1. Rebuild the current Site image with an approved immutable map manifest and repeat integrated image smoke; the exact current image only has static smoke evidence.
2. Continue the open routing completeness, provider, Admin, physical-device, staging, operational recovery, backup/rollback and owner-release gates.
