# iOS Simulator: pinned web bundle and first paint — 2026-10-22

## Candidate tuple used

- iOS app implementation exercised: `ec586d63e1c07a4807c8991b20c35d1193e0f73d` (open PR #11).
- Follow-up CI pin update: `1d1e9763ec99d7e77b22998c4212ce71a7fa924a`, workflow-only change to the Server fallback SHA; pushed to PR #11. Exact-head GitHub run `39839632165` completed successfully.
- Site bundle: `1d2aaa012b88519273eae7a2b8d703ec32c212f6` (open PR #15).
- Server reference in the first simulator run: `30fa1cfa52621e7ed4ca47ad61794711ac484e62` (open PR #27).
- Server reference in the repeated simulator run: `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe` (open PR #28).
- Local build API URL: `http://localhost:3002`; no local API was listening during the test.
- API contract field: `v1`. The applied database migration version was not supplied, so the repeat build correctly left it `null` rather than inventing a version.

## Checks

- `npm run build:simulator`: Site production build, Capacitor sync, Xcode Simulator build, install and launch completed successfully on iPhone 18 Pro / iOS 27.0.
- Repeated the build under the declared Node `24.21.0` runtime after an initial Node `25.4.0` diagnostic run. The repeat had no engine warning; the Site build and Xcode Simulator build succeeded.
- The initial embedded `release-manifest.json` contained the PR #27 Server reference; after updating the workflow pin, a repeated local build embedded Server PR #28, Site PR #15 and the tested app implementation SHA `ec586d63e1c07a4807c8991b20c35d1193e0f73d`. The pushed workflow-only commit has exact-head hosted run `39839632165` **SUCCESS**; its manifest verification and iOS Simulator compile passed at iOS SHA `1d1e9763ec99d7e77b22998c4212ce71a7fa924a`. These artifacts are not a release manifest because the API URL and applied migration version are not production-verified.
- First screenshot was taken during the simulator's cold WebKit startup and showed the launch surface. WebKit logs recorded delayed layer-tree paint during that first launch. A subsequent app relaunch rendered the full Ukrainian welcome/onboarding screen by the 8-second capture; the 20-second capture remained rendered. No blank-screen reproduction on the warmed relaunch.
- The first diagnostic run used Node `25.4.0` and emitted the expected engine warning. It was superseded by the successful Node `24.21.0` repeat. Hosted iOS CI also pins Node `24.21.0`.

## Acceptance boundary

**PASS:** simulator compilation, Capacitor asset synchronization, exact candidate SHA embedding, visible welcome-screen render on warmed relaunch.

**NOT TESTED:** live authenticated API, booking, maps against production origins, push/APNs, physical iPhone, background GPS, TestFlight signing, deployed bundle, production HTTPS smoke. The simulator run used a local API URL with no API process available and did not establish network-backed product acceptance.

**Next:** align a single release tuple with merged/approved Server and Site SHAs, use the owner-provided HTTPS staging origin and applied migration version, then repeat authenticated browser and physical-device acceptance before any release claim.
