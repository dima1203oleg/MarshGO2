# Exact release-candidate full UI verification — 2026-10-24

## Tested source tuple

- Server: PR #36, `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- Site: PR #21, `df796e2c5d457332c11c39f3ba82fc4b3c6a3ae9`.
- iOS: PR #14, `6e5a3a63b200cc6e490878f889979ea0baf217f7`, pinned to the exact Site SHA above and Server SHA above.
- E2E used the pinned Server/Site sources, local deterministic geocoder/routing/map fixtures, and the isolated loopback `marshgo_e2e` PostgreSQL/PostGIS database. The runner found port 3302 occupied and selected another loopback port; the existing listener was left untouched.

## Defects found and fixed

1. Navigation tools were covered by the newly raised mini-basemap thumbnail on mobile. Moved “Інструменти навігації” into the navigation sheet. Site commit `df796e2c5d457332c11c39f3ba82fc4b3c6a3ae9` is pushed to PR #21.
2. The OTP E2E helper set `x-forwarded-for` as a page-wide extra header. This caused cross-origin map manifest requests to require a CORS preflight that the local map fixture intentionally does not implement. Scoped the header to `/api/v1/auth/otp/request`; the map fixture then loaded normally, allowing the test to exercise partial tile failure and retry. This is a test-harness-only root working-tree change.

## Verification evidence

- Full `npm run test:e2e`: **20/20 PASS**, 7.6 minutes. Includes all-button audit; route results, details, segment focus and light/dark states; twelve transport categories; two-account booking/reverse demand/chat; driver GPS deviation and reroute; iPhone 15 Pro Max and 16 Pro Max foreground navigation; denied GPS recovery; URL restore; Journey Planner partial warning/fare metadata; rendezvous consent and map.
- Button audit: **195 controls clicked** on 15 production-route paths, with no uncaught browser exceptions or unexpected HTTP 5xx. The audit logged 24 controls without a visible effect or that were not interactable in the captured state; these include already-selected/empty-form/native-validation states and controls behind active overlays. This is a smoke audit, not proof of every conditional or destructive state.
- Root unit suite: **256 PASS / 0 FAIL / 1 opt-in integration SKIP** (257 total); root TypeScript, ESLint, and Vite build PASS.
- Exact Site commit `df796e2c5d457332c11c39f3ba82fc4b3c6a3ae9`: TypeScript, production build, unit suite **102/102**, ESLint PASS.
- Exact-head GitHub CI: Site runs `40064037097`, `40064033933` SUCCESS; iOS Simulator Build runs `40064058349`, `40064055620` SUCCESS for iOS SHA `6e5a3a63b200cc6e490878f889979ea0baf217f7`.

## Remaining acceptance boundary

This establishes local fixture-backed Web/PWA behavior for the covered routes and flows. The reference mockups are **not visually accepted**: comparison of the captured route results and route detail against supplied references 4 and 8 shows different composition and a synthetic grid basemap instead of the illustrated real-map treatment. The E2E suite checks functional behavior and its existing snapshots, not pixel parity with all ten user images. Finish all ten corresponding visual states and compare them deliberately before claiming design compliance.

This also does not establish staging or production deployment, live commercial-provider acceptance, real map tile licensing/availability, full Admin/Partner tenant flows, physical iPhone GPS/background/push behavior, security/load/recovery gates. E2E executed under host Node 26.7.0 while the Site package requests Node 24.21.0; run the final exact candidate on the declared runtime before release. Release remains `NOT_RELEASED`; `production_ready=false`.
