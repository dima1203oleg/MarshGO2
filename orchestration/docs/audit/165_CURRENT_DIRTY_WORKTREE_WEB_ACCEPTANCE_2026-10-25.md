# Current dirty-worktree Web acceptance — 2026-10-25

## Scope and identity

- Repository: central `MarshGO` orchestration checkout.
- Branch: `codex/production-finalization-20261014`.
- HEAD: `0d068f7104d3cdedde9edb57a1be781df5e86491`; the shared working tree is already extensively dirty. Results below apply to this current working tree, not an immutable release candidate.
- Web build and Server source were both taken from the current working tree. Browser tests used isolated loopback database `marshgo_e2e_master_20261025`, local map/geocoder/OSRM fixtures, development OTP and Redis on the dedicated E2E port. Public provider feeds were disabled by the E2E profile.

## Changes made in this checkpoint

- `src/components/MapLayersControl.tsx`: the full map-layer panel now opens vertically centered from its control instead of extending downward over the persistent bottom navigation. The layer rows are denser on mobile and retain their internal scrolling behavior.
- `e2e/journey-route-map.spec.ts`: corrected stale expectations to match current code behavior: route focus leaves one selected segment on the map while the bottom strip retains context; current transport colors and dark token; the city-scoped provider availability label; and the actual `Пункти прокату` layer name.
- No screenshot baseline was rewritten. The current results screen remains subject to manual visual acceptance against the supplied mockups.

## Verification

| Check | Result | Boundary |
|---|---|---|
| `npm run check:production` | PASS: TypeScript, full ESLint, unit tests, production build and bundle budget | Local checkout only |
| `npm test -- --test-reporter=dot` | 256 PASS, 0 FAIL, 1 opt-in integration test SKIP (257 total) | The skipped test is not counted as PASS |
| Full fixture E2E, `E2E_SKIP_VISUAL=1` | 25/25 PASS | Functional suite; visual comparison deliberately excluded |
| Visible-control audit in the full E2E suite | 178 clicks, 0 without visible effect, 0 stale controls | Visible controls across audited passenger/driver routes; destructive actions are skipped by the audit |
| Route/map/layers E2E in Chromium, Firefox and WebKit | 3/3 PASS | Local browser engines, not physical Safari/iPhone |
| Responsive sign-in/home/search check | 3/3 PASS across Chromium, Firefox and WebKit at 320/390/430/768/1280/1440 px (prior current-worktree run) | Does not cover every route at every width |
| `git diff --check` | PASS | No whitespace errors |
| Screenshot regression, full route test without skip | FAIL: `journey-results-light.png`, 56,201 pixels / 17% differ from saved `darwin` reference | Current render and the older snapshot have structural layout differences; not automatically rebaselined and not accepted as matching all ten supplied mockups |

## Findings

The full functional browser suite passes on the current dirty tree. The interaction sweep exercised 178 controls. Two-account search/booking/chat, passenger demand negotiation, driver multi-rider stop ordering and GPS reroute, strategy/category selection, route focus, navigation permission recovery, rendezvous consent/revocation and transport layers passed with local fixtures.

The layer-panel test exposed and verified a real mobile defect: the panel covered the global bottom navigation. Centering the panel and tightening its rows fixed the tested iPhone viewport. Test assertions also contained old hard-coded feed counts and stale colors; they now assert the actual city-scoped availability text and the source-of-truth palette instead of implying live data.

The visual screenshot mismatch remains open. The actual light results screen has a newer card structure than the saved snapshot. This run did not establish parity across all ten supplied mockups or all twelve requested screenshot states. Licensed satellite imagery and live provider data also cannot be accepted from a local fixture map.

## Release status and next action

This is local working-tree evidence, not staging or production acceptance. No deployment was performed. The exact environment recheck in [audit 163](163_EXACT_RELEASE_CI_AND_LOCAL_ENV_RECHECK_2026-10-25.md) found no configured staging endpoint/secrets. Physical iPhone acceptance, live provider probes, backup/restore, rollback, security/load gates and final owner release approval remain open. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.

Next: compare the current screen captures to the ten user-supplied mockups, resolve the results-screen visual difference deliberately, capture/review the remaining light/dark route states, then run the exact five-component hosted/staging acceptance gates when the documented external prerequisites exist. Do not accept snapshots by bulk refresh.
