# Search, geolocation, and live transport-mode acceptance — 2026-10-26

## Source and scope

- Site: `codex/sync-journey-mobility-ui`, HEAD `1a922010562f334fe77e79fd0a89181c2f2f9963`, dirty. Focused changes committed as `4afa7b3` (`fix: clarify geolocation fallback guidance`); other dirty changes preserved.
- Server: `feature/transport-layer-availability`, HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`, dirty.
- Orchestrator: `codex/production-finalization-20261014`, HEAD `affef61e4706b2b9ce95c3ab4c2f5e2c0607e1dd`, dirty.
- Local-only evidence. No production deployment, payment, real booking, actual user GPS coordinates, or user credential was used.

## Findings

- The visible browser's place-suggestion request returned an authentication-required response; a fresh tab showed sign-in/onboarding. “Сихів” is present in the public geocoder (an earlier low-volume Nominatim lookup returned matches). Autocomplete is verified in an authenticated fixture E2E, but not in the user's current session.
- Actual browser geolocation timed out, including the coarse/cached retry; it was not reported as permission-denied. App copy now distinguishes permission denial from unavailable/late coordinates and offers map selection. Synthetic browser GPS and map-point confirmation pass; this does not verify the host's location service.
- The stale Vite process on port 3000 was restarted from the current Site worktree. A fresh tab loaded without JavaScript console errors; the current page is onboarding because no valid session is available.

## Tests and live providers

- Site typecheck, focused ESLint, production build, and all 105 unit tests passed. The declared Node version is 24.21; this run used Node 26.7 and emitted an engine warning.
- Three E2E tests against a production build of the active Site worktree passed: map picker + synthetic GPS; “Сихів” autocomplete + clear buttons; all 12 mode labels/order. Separate isolated Community journey search → booking → cancellation E2E passed.
- Seeding/probing affected only local loopback database `marshgo`: 52 catalog records, 42 open with declared licenses, 37 enabled after checks.
- Fresh source probes: Lviv GTFS has 72 routes (64 bus, 8 tram), 1,071 stops, and 15,716 trips. Lviv realtime returned 621 vehicles (3-second feed age) and 727 trip updates (17 seconds). Zelectra GBFS returned 947 vehicles, including 911 points in its declared country.
- One synthetic authenticated live Server search in Lviv, with all 12 modes selected and Community excluded, returned 17 itineraries containing bus, tram, and walking legs. The result correctly had `partial=true` because the UZ schedule feed failed during this request. Eight selected types were unsupported in this Lviv corridor: minibus, taxi, trolleybus, metro, train, bike, carsharing, transfer. This is not complete all-mode routing.

## Acceptance

| Requirement | Status | Boundary |
|---|---|---|
| Twelve category labels/order | PASS | Fixture-backed browser acceptance |
| Map selection without reverse geocoder | PASS | E2E with synthetic map point |
| “Сихів” autocomplete and clear | PASS (fixture auth); BLOCKED_USER_SESSION (current tab) | Current browser is not authenticated |
| Actual host/browser GPS | NOT_TESTED / TIMEOUT | No coordinates returned; no actual coordinates logged |
| Lviv live bus/tram search | PARTIAL | 17 results; UZ feed failed; completeness unproven |
| Other eight selected categories in Lviv corridor | BLOCKED / UNSUPPORTED | Explicitly returned unsupported |
| Production | NOT_RELEASED | No staging or deployment proof |

Next: sign in through the local app and verify suggestions with that session; retest GPS after checking OS location services; re-probe UZ and per-city mode coverage. Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
