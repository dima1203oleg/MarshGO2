# Production UI acceptance and visual-baseline checkpoint — 2026-10-25

## Scope and source under test

- Tested the current dirty root checkout at repository HEAD `58d6f12acb68922d3d7f9ab18180e1cf10457537` on branch `codex/production-finalization-20261014`.
- Built Site from the current root source into local `dist/`; E2E used `E2E_DIST_DIR=$PWD/dist` and `E2E_SERVER_DIR=$PWD`, not the manifest's older pinned Site/Server snapshots. The runner still printed manifest pins Site `7aed5344218058b024f5c269b36b03577d94026e` / Server `38f17b88f98c8530f8090cfc6745cd334c87e53c`; these were not the source served in the corrected runs.
- Database was the isolated loopback `marshgo_e2e`; map, geocoder and OSRM were local E2E fixtures. No live provider, public staging, production, or physical device was used.

## Change made

- Production `HomeV5` action order now follows the approved 2×2 layout: Navigation / Transport Map, then Publish Trip / Find Route.
- Phone route-result cards use tighter spacing and padding while preserving the 11 px segmented journey bar and per-segment mode, duration, and fare. The repeated distance/transfer footer is visually hidden on phones; the route's accessible button name retains distance and transfer information.
- Browser acceptance asserts the HomeV5 action order and requires at least five complete route alternatives within the first phone viewport.

## Evidence

- Current-source Chromium production sign-in/home/search compatibility at 320, 390, 430, 768, 1280 and 1440 px: PASS.
- Rebuilt current source with isolated map fixtures and ran the compatibility matrix in Chromium, Firefox and WebKit: 6/6 tests PASS (home/search and route-map scenario per engine; six viewport widths in the responsive scenario). Pixel snapshot assertions were explicitly skipped for this cross-browser run; physical iPhone Safari was not tested.
- Full current-source browser E2E: 24 PASS / 1 FAIL across 25 tests. Button audit reported 179 clicks, 0 without visible effect, 0 changed before click. Passenger/driver booking, negotiation/chat, GPS deviation reroute, responsive navigation, transport catalogue and consented rendezvous scenarios passed.
- Route-map functional E2E with screenshot assertion opt-out (`E2E_SKIP_VISUAL=1`): PASS, including the new five-full-cards viewport acceptance, sorting, leg labels, focus, live fixture overlays and light/dark behavior.
- TypeScript typecheck: PASS. ESLint on touched UI/E2E files: PASS. `git diff --check`: PASS. Current-source Vite production build: PASS.
- Full `npm run check:production` after the UI change: PASS through typecheck, full ESLint, 256 unit pass / 0 fail / 1 opt-in integration skip, production build and 51-chunk gzip transfer budget. A separate final `npm test` repeat confirmed 256/256 pass with the same single skip.
- Full-suite failure is the visual assertion `journey-results-light.png`: 38,395 pixels (12%) differ from `e2e/journey-route-map.spec.ts-snapshots/journey-results-light-darwin.png`. The previous run before density adjustment differed by 56,536 pixels (17%). The current UI visibly fits five full route cards plus the next card start; the old baseline captures the prior larger-card layout. Screenshot baseline was not updated automatically.
- An initial browser-compat attempt used the release-manifest materialized Site SHA and failed before checking the current component; that run is excluded from current-source acceptance. Subsequent corrected current-source run passed.

## Status and next action

- Functional phone route-results behavior: `PASS (local fixture)`.
- Pixel visual acceptance against committed screenshot: `FAIL / requires reviewed baseline`; conformance against the ten user-supplied mockups remains `NOT_ACCEPTED` until reference-by-reference review and captures of the actual production screens.
- Live tiles/provider feed, deployed staging, authenticated Admin/Partner acceptance, production smoke, iPhone Safari/background GPS, load, backup/restore, and rollback: `NOT_TESTED` or `BLOCKED_EXTERNAL` as recorded in the release matrix.
- Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`. Next: compare all six route/navigation scenarios to the supplied references, capture light/dark production states, correct proven mismatches without changing the reference baseline blindly, then rerun the full browser suite and visual review.
