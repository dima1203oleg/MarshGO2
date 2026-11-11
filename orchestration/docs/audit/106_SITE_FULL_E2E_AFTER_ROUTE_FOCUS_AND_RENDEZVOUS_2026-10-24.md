# Site full browser acceptance — 2026-10-24

## Exact candidate

- Site repository: `dima1203oleg/MarshGO-Site`
- Branch: `codex/rideshare-route-detail-reference-20261024`
- Site SHA: `eb3005a6558b3688be4c30117c81b7a786f9a7a5`
- Existing draft PR #23: https://github.com/dima1203oleg/MarshGO-Site/pull/23
- Parent map-layers candidate SHA: `5a96e85630428c2ffc15dfe67308334eda9d7398`
- Server fixture SHA: `134ed017828a020e1d5f696b3cb9ea95527bb093`
- Browser build uses the isolated local map manifest at `127.0.0.1:3306`; local Postgres/Redis, geocoder, OSRM and map tiles. This is fixture/staging-like local acceptance, not production.

## Changes in this Site PR

- Partial journey searches now have an accurate, concise status message; assertions cover both partial and complete results.
- Selecting a general route segment keeps the entire itinerary visible and dims nonselected lines.
- The 12 transport labels and order match the approved grid: Попутка, Маршрутка, Автобус, Таксі, Трамвай, Тролейбус, Метро, Поїзд, Велосипед, Самокат, Каршеринг, Трансфер.
- A consented rendezvous map can expand to a full-screen, safe-area-aware view. The main “Я на місці” action remains available in that view and calls the existing server status action.

## Verification

- Site unit tests: 105/105 PASS.
- Site typecheck, full ESLint, production build and bundle-size budget: PASS. Bundle budget: 17 JS chunks at or below 350 KB gzip each.
- Focused route-map E2E: PASS; the test covered sheet snaps, stop details, segment focus, partial-search disclosure, light/dark states and screenshot baseline.
- Full local browser suite: 20/20 PASS in 4.2 minutes, Chromium with iPhone 16 emulation, isolated DB/cache/data fixtures. Includes a 177-control sweep, two-account search/booking/demand/chat, driver GPS/reroute, iPhone viewport navigation, partial-search disclosure and two rendezvous consent/map tests.
- Site hosted CI run `40123974041`: PASS on the exact SHA above.

## Acceptance boundary

- The 20 browser tests use deterministic local fixtures. They do not prove external transit provider rights/freshness, production GPS, staging deployment, physical iPhone background behavior, or visual parity for every supplied owner mockup.
- PR #23 is still an open draft and stacked on PR #22/#21; no merge or deployment is claimed.
- Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Stacked-PR integration and retest — 2026-10-24

- GitHub reported Site PR #23 conflicting with its parent PR #22 because the latter had advanced the rendezvous map implementation. Merged the current #22 head into the #23 branch with an ordinary merge; retained the full-screen safe-area map, arrival/approach/boarding/share controls and the newer route-search/map-focus/catalog changes.
- Integrated Site SHA: `10454f37b59a848e4a5b381689dfe7f701fe2b81`; branch `codex/rideshare-route-detail-reference-20261024`; pushed to existing draft PR #23. GitHub now reports PR #23 `MERGEABLE` (no longer conflicting).
- On the integrated tree: unit tests **105/105 PASS**, TypeScript, ESLint, production build and bundle budget PASS.
- Rebuilt the integrated Site with the isolated E2E map manifest and ran the full root browser suite against pinned local Server fixture `134ed017828a020e1d5f696b3cb9ea95527bb093`: **20/20 PASS in 4.3 minutes**, including all 177 safe visible-control interactions, route-map states, marketplace, driver reroute, iPhone-sized viewports and rendezvous consent/revocation.
- The first harness attempt correctly rejected a normal production-map build because it lacked the isolated test manifest; rebuilt with the test-only loopback manifest and reran successfully. No production deployment or provider endpoint was used.
- Exact-head hosted Site CI for `10454f37b59a848e4a5b381689dfe7f701fe2b81` started as run `40124900205` and was still in progress at this checkpoint. PR #23 remains draft/stacked, and ten-image visual acceptance, physical iPhone, staging and production remain open.

### Hosted integration result

- Site CI run `40124900205` completed SUCCESS on exact merged SHA `10454f37b59a848e4a5b381689dfe7f701fe2b81`.
- GitHub confirms Site PR #23 is `MERGEABLE` against the current PR #22 head. It remains a draft; visual mock acceptance and production gates are not satisfied by this result.
