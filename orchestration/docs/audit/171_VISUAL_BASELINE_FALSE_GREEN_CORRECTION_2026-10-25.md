# Visual baseline result correction — 2026-10-25

## Finding

The focused Playwright scenario `e2e/journey-route-map.spec.ts -g 'canonical route map synchronizes'` completed 1/1, but this result is functional-flow evidence, not approved visual acceptance. Playwright created the previously missing project-specific Chromium snapshot `e2e/journey-route-map.spec.ts-snapshots/journey-results-light-chromium-darwin.png` during the run. The resulting untracked file represents the current render; its existence allowed the next run to compare against a newly captured image, not a pre-existing approved design reference.

The route flow's interactions and its local screenshot comparison machinery execute, but the new Chromium reference is unreviewed. The user-supplied mockups have not all been paired with matching production states, and the live/licensed basemap shown in those designs is not configured in this fixture run. Therefore visual acceptance remains `NOT_ACCEPTED`.

## Corrected evidence

- Root E2E: **25/25 PASS** with `E2E_SKIP_VISUAL=1` — functional fixture evidence only.
- Focused route-map flow: **1/1 PASS** — functional assertions pass; do not count the bootstrapped Chromium snapshot as visual acceptance.
- `npm run check:production`: typecheck, lint, unit suite, build and bundle gate pass; 256 unit tests pass and one opt-in integration test is skipped.
- Enabled visible controls: 179 clicked, zero reported inert; this covers only the configured safe controls/routes.
- The previously recorded 17% results-screen delta was measured against a different saved baseline. It remains unresolved until the intended reference is identified and reviewed; do not bulk-refresh snapshots.
- Production UI does share `JourneySegmentStrip`, but it does not contain the spec's single `CanonicalRouteLip`: the summary/action rows are independently rendered in `JourneyResultsPanel.tsx` and `JourneyRouteMapScreen.tsx`. Treat shared segment strip as partial reuse, not proof of the full canonical three-row component or visual consistency.

## Release and next action

All results are from dirty local trees and fixtures, not an immutable six-repository release tuple or staging. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`. Next, map each of the ten supplied references to an actual production route/state, capture matched screenshots on the exact candidate, manually review differences, and approve only intentional baselines. Continue live-provider, licensed map, physical-device, security/performance/recovery, staging and release checks independently.
