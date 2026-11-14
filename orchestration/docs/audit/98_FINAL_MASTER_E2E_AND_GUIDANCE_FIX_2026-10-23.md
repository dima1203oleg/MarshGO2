# Final master production checkpoint — browser acceptance and live guidance

Date: 2026-10-23 (Europe/Kyiv)

## Scope and exact code

- Browser acceptance ran against the production UI built from the existing release Site baseline `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae` plus Site commit `f0b07f8fc4fdacbf6fa7fa0388da341e74ad988c` on branch `codex/guidance-progress-20261023`.
- The E2E API ran from Server baseline `b65882584a3ad1e8dd7512d13176f52299cded51` plus Server commit `b6c0efd9c0d06b8dc4011791e2f2d96eeba05c72` on branch `codex/dev-otp-test-throttle-20261023`.
- The root release manifest still names the baseline SHAs; these two follow-up commits have **not** been merged into the candidate manifest, pushed, or deployed.

## Changes

1. Site turn-by-turn progress now projects a GPS position continuously onto route geometry. Previously, guidance snapped to the nearest route vertex, so displayed distance-to-turn and remaining distance could stay frozen while a vehicle moved along a long road segment. A deterministic unit test covers continuous mid-segment progress.
2. Local E2E can raise the OTP **network** request ceiling only when `NODE_ENV=development` and `AUTH_DEV_OTP=true`; the default remains 20, values are bounded, and production configuration rejects the override. This lets the full suite exercise more than 20 independent accounts without weakening production throttling.
3. Playwright now forwards an explicitly selected `E2E_SERVER_DIR` and pinned SHA to its isolated API process. Previously the runner silently started the materialized manifest server even when a separate test checkout was selected.

## Verification

- Root `npm run check:production`: **PASS** — TypeScript, ESLint, 257 tests (256 passed, one opt-in integration skipped), Vite production build and bundle gate (51 JavaScript chunks within 350 KB gzip each).
- Isolated Server branch: typecheck and lint **PASS**; 308 unit tests (305 passed, three opt-in integrations skipped); full PostGIS/Redis integration script **PASS**, 30 assertions across clean migrations through version 055, journey, booking concurrency, trip edits/cancellation, Partner tenant isolation, navigation/GPS, cross-instance realtime, process restart and Redis rate-limit.
- Isolated Site branch: typecheck, lint, production build **PASS**; 129/129 unit tests **PASS**.
- Full Playwright release-browser suite: **19/19 PASS** on the isolated loopback API, test geocoder/OSRM and local map tile fixture. It includes 195 visible-control clicks over 16 production paths, responsive browser checks, Light/Dark map and route states, the 12 transport categories, search validation, two-account booking/demand/chat, driver GPS deviation/reroute, rendezvous consent and recovery from an unsupported legacy URL.
- The full run initially exposed the stale guidance behavior; after the fix, the GPS/deviation scenario passed independently and then in the final 19/19 suite.
- The click audit logged 12 actions with no DOM/URL/network delta. They include already-selected navigation/banner actions, an empty search or invalid empty form, and controls that return to their current page. These are signals logged by the audit, not failed tests; the empty-form and route-swap companion tests verify the relevant validation/coordinate behavior. Destructive actions are intentionally excluded.
- Design screenshots used the deterministic local map fixture, not licensed live production map tiles. This is functional/browser acceptance, not pixel acceptance of all ten supplied mockups.

## Environment and release status

- Test-only database: `marshgo_e2e_codex_master_final4_20261023`; local services only. No production or staging URL was contacted.
- No production traffic, external provider, persistent container/volume, other database, branch history, or pre-existing dirty checkout was modified or deleted.
- The candidate is still **NOT_RELEASED**. There is no evidenced owner-controlled HTTPS staging/deployment target, deployed SHA, provider entitlement for all requested modes, verified production map style, backup/restore/rollback drill, physical iPhone acceptance, or explicit production rollout approval. Dense Lviv search remains a known truncation gap documented in earlier routing audits.
- Next: validate the follow-up commits against the latest compatible stacked PR heads, publish reviewable PRs if ancestry/checks allow, update the exact SHA manifest only after compatibility verification, and continue the independent external/product release gates. No production deployment is authorized by this checkpoint.

## Follow-up: route sheet and transport map acceptance

- Latest Site PR #20 head: `d761d4b6d8d909caa22e7c72713f0ea3badede41`, based on earlier PR #20 commit `8f922134ca5e4551520b762bf981583a8d7c3103` and latest PR #19 stack. Commit was pushed to the existing review branch; exact hosted CI run `39993143251` was still in progress when recorded.
- Fixed a quick downward swipe that incorrectly skipped the middle sheet snap, aligned expanded details to the reference full-height sheet with a 112 CSS-pixel map band, and added a screen-reader heading on the transport map without changing visible styling.
- On this head: typecheck, lint, build, 129/129 unit tests, route-sheet unit tests 3/3 and bundle budget pass. The targeted route-map functional Playwright test passes 1/1 using local fixture services. CSS-pixel screenshot comparison passed for the expanded route-details view.
- The full root E2E suite on the earlier PR #20 head had a single route-sheet failure. On the fixed head, targeted E2E reached the legacy transport-layers screenshot and showed a visual mismatch against the root suite's old baseline; that snapshot was not overwritten. The PR #19-specific map-layers reference E2E had separately passed 1/1. This difference needs design/reference reconciliation; full integrated E2E remains PARTIAL until a full rerun and compatible visual gate pass.
- No production/staging, live provider, physical-device or rollout gate was exercised. The product remains **NOT_RELEASED**.
