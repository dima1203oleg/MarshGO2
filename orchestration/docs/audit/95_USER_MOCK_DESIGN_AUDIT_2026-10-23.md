# UI interaction and mock design audit — 2026-10-23

## Current exact-candidate status update — 2026-10-23

- Site PR #20 exact SHA `a000b3cc07a956ae7ded4563ab5e97b11fe3db71` passed local production checks and both hosted browser workflows (`39995439983`, `39995439935` attempt 2). Site/Server exact fixture E2E passed 19/19. These are later than the older replay rows below.
- No new full set of matching-state screenshots was captured for the ten references; the earlier mock-by-mock NOT_ACCEPTED / PARTIAL / NOT_TESTED statuses still apply. The local map artwork is synthetic and cannot prove visual parity with the supplied aerial/live-map mockups.
- Admin PR #1 and Partner PR #1 login pages were smoke-checked from their exact snapshots at 320, 390, 430, 768, 1280 and 1440 CSS px. Both had no horizontal overflow/page exceptions; empty required phone prevented OTP submission. The auth refresh was intercepted as 401 to isolate the UI, so this is not API or authenticated acceptance. Authenticated Admin/Partner flows remain NOT_TESTED.
- Deployment, physical iPhone, licensed map assets, live provider permissions, staging and recovery gates remain open. Release remains NOT_RELEASED.

## Tested candidate and scope

- Server: `b65882584a3ad1e8dd7512d13176f52299cded51`.
- Site: `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae`.
- Browser run uses isolated loopback PostGIS/Redis and deterministic geocoder, OSRM, and map-tile fixtures. It is local candidate evidence, not staging or production.
- Full route suite: 17/17 Playwright tests passed. Focused control sweep: 1/1 passed, 156 individual safe clicks across 12 primary Site routes, no JS exceptions or HTTP 5xx.
- Controls hidden behind state changes, authenticated Admin/Partner actions, and destructive actions are outside the individual-click sweep. Dedicated flows cover booking/chat/reverse marketplace, navigation/reroute, search and rendezvous; Admin/Partner authenticated workflows remain `NOT_TESTED`.
- Lint and typecheck passed after improving the audit to compare full DOM and address duplicate labels by role/name/occurrence.

## Controls with no observed DOM/text/URL/network change

The original 156-click sweep observed ten controls without a visible change. Three are now covered by direct state/validation assertions, leaving seven expected no-op observations:

1. Selected home banner button — clicking the already selected banner is a no-op.
2. `Головна` on `/` — current destination.
3. `Поміняти місцями` with empty route fields — no source/destination to swap; separately tested with selected places and coordinates, 1/1 PASS.
4. `Знайти маршрут` with empty fields — native required-field validation focuses the missing field; direct E2E assertion confirms no search API request is sent.
5. `Пошук` on `/journeys/search` — current destination.
6. `Майбутні` in the trips area — direct E2E assertion confirms its tab becomes `aria-selected=true`.
7. `Поїздки` on `/trips` — current section.
8. `Профіль` on `/profile` — current destination.
9. `Опублікувати заявку` on an empty demand form — direct E2E assertion confirms the form is invalid and sends no create request.
10. `Повідомлення` on `/messages` — current destination.

No destructive control was clicked. The three direct assertions above now pass in the isolated browser E2E run (`empty search, trip filter, and demand form show an intentional state change`: 1/1 PASS).

## Supplied mock-by-mock visual review

Review is against the ten user images, using the existing candidate captures for route detail, transport layers, and navigation. Because test maps use synthetic tiles and most states do not have an exact matching capture, this is a delta review, not a completed pixel/visual-acceptance pass.

| Image | Intended state | Observed delta / evidence | Status |
|---|---|---|---|
| 1 | Dark active navigation with turn card, speed, map controls, bottom navigation | Candidate navigation capture uses fixture road-grid tiles and a different guidance/bottom-sheet composition; actual licensed/aerial map appearance is not represented by the fixture. | Not accepted |
| 2 | Dark layers sheet with transport, display and infrastructure toggles | Candidate layer capture groups controls differently and exposes a smaller set; category availability must reflect real provider coverage rather than fake toggles. | Known visual/functional delta |
| 3 | Active navigation with ETA and finish action | Core route guidance and active-session controls exist in candidate; no exact same-state screenshot/viewport comparison has been recorded. | Partial; not accepted |
| 4 | Light carpool offer with driver/car, arrival estimate and pickup guidance | No candidate capture in the same offer, passenger-location, and sheet state. | Not tested |
| 5 | Light multimodal result with walking + tram + walking + bus + walking | Candidate route-detail capture uses a different fixture itinerary (walk + tram + scooter + bus); data and segment count cannot be compared as a matching state. | Partial; not accepted |
| 6 | Active carpool approach with both parties and moving vehicle | No exact paired-participant/live-approach candidate capture; fixtures cannot prove live GPS. | Not tested |
| 7 | Selected bus line, stop times and approaching vehicles | Candidate has stop-detail UI, but the fixture screenshot does not prove a complete line in both directions or real approaching fleet positions. | Partial; live behavior not tested |
| 8 | Dark full route details with walk/tram/walk/bus/walk | Candidate dark sheet uses a different route fixture and synthetic map background; exact segment/color/layout parity is not established. | Partial; not accepted |
| 9 | Dark route overview/detail | Visually duplicates image 10. No exact matching-state candidate capture. | Not tested |
| 10 | Dark route overview/detail | Visually duplicates image 9. No exact matching-state candidate capture. | Not tested |

## Acceptance conclusion

- Main Site click smoke: `PASS_WITH_OBSERVATIONS`.
- Exact visual parity against the ten reference images: `NOT_ACCEPTED`.
- Product readiness: this audit does not change the release state. No live provider acceptance, physical iPhone run, authenticated Admin/Partner acceptance, staging, deployed SHA, HTTPS smoke, or rollback rehearsal is included. Release remains `NOT_RELEASED`.

## Next concrete actions

1. Capture the exact ten states at matching mobile dimensions on one immutable candidate; use approved/licensed map styles instead of fixture imagery for visual acceptance.
2. Correct layer-sheet composition and any card/route hierarchy differences against the accepted references while preserving truthful provider availability.
3. Run authenticated Admin/Partner acceptance and physical iPhone/Safari acceptance before any release claim.

## Latest retest — 2026-10-23

This section supersedes the earlier run counts above; the older observations remain as historical evidence.

- Full Playwright: **17/18 PASS** in 13.1 minutes on manifest-materialized Server `b65882584a3ad1e8dd7512d13176f52299cded51` and Site `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae`, isolated local services/DB. Sole failure: the light results screenshot differs by 54,604 pixels (16%) from the repository screenshot baseline.
- Production quality gates: typecheck, lint, 256 unit tests, Vite build and bundle budget pass; one opt-in unit/integration test is skipped.
- Updated button audit: **181 safe visible controls clicked on 12 routes**, no browser exceptions or HTTP 5xx. Twelve controls had no observed visible change or were not clickable (including already-active navigation, selected banner, and map-canvas affordances); these are observations, not 12 confirmed product defects. The audit skips destructive actions and cannot prove every conditional control.
- The focused route-map functional run passed **1/1** with screenshot comparisons disabled. It verifies current map behavior but does not establish reference-image parity.
- The supplied mock review table remains in force: images 1–10 are **NOT_ACCEPTED / PARTIAL / NOT_TESTED** as individually recorded. The repository snapshot is not a substitute for the user's design references, and neither snapshot set was overwritten.
- A live provider poll reported five consecutive EasyWay Konotop position-feed errors before backoff. Freshness is degraded.
- No staging or production deployment, public HTTPS smoke, deployed SHA/rollback, physical iPhone, or authenticated Admin/Partner acceptance was performed. Release remains `NOT_RELEASED`.

### Screenshot failure attribution

- Inspected `test-results/journey-route-map-canonica-57cf6-cus-and-light-dark-palettes/journey-results-light-{actual,expected,diff}.png` and the Playwright trace/context. The 54,604-pixel difference is a layout/content hierarchy change, not random antialiasing: the checked-in expected PNG shows the legacy compact route-list header with route editing and dense cards; the actual production screen shows the current “Результати пошуку” header, route/date/passenger summary, filters, and larger result cards.
- The same E2E flow's DOM assertions pass for selected route, strategy switching, segment semantics, prices, and card constraints before the screenshot assertion. This localizes the failure to visual-baseline drift, but it does **not** prove the actual layout matches the ten supplied references. None depicts this exact unselected search-results state.
- Kept the screenshot assertion failing and did not refresh the PNG. The actual UI may be an intentional redesign, but image parity for the user-provided mocks still requires matching-state captures and review.

### Expanded route-map sheet follow-up

- On isolated Site branch `codex/route-sheet-map-window-20261023` (commit `e01bef59db362071954b8fc9279a0d06a3bd5d70`), reduced the expanded sheet cap from 88% to 78% viewport height. This exposes at least 20% of the mobile viewport for the map while keeping the segment list scrollable inside the sheet.
- Added a route-flow E2E assertion for the exposed map ratio. `npm run check:production` passed: 128 unit tests, typechecks, lint, build, bundle budget, 21 browser E2E across Chromium/Firefox/WebKit. Site PR #18 is open; hosted exact-head CI was still in progress at the time of this note.
- Browser output included unauthenticated local API refresh errors and tile requests cancelled during camera movement; it did not establish a tile fixture 401. These results confirm panel geometry and UI behavior only. They do not confirm actual map artwork/data or physical iPhone presentation. Exact visual parity with the supplied images remains `NOT_ACCEPTED`.

### Reference image 2 — layer sheet update

- PR #19 updates the production map-layer panel to three grouped sections (`Транспорт`, `Відображення`, `Інфраструктура`) with colored mode icons, collapsible group headings, touch-size rows, and disabled states where no provider data is connected.
- Presets remain available under collapsed `Швидкі налаштування карти`, keeping the primary sheet uncluttered without deleting the actions.
- Fixed narrow-grid text overlap by removing inline availability messages; disabled state and reason remain exposed to assistive technology.
- Browser test exercises the twelve categories, available/unavailable switches, turning a layer on, accordion state, preset action, and close action. Full Site production check: **24/24 E2E PASS** in Chromium, Firefox, and WebKit, plus typechecks, lint, unit tests, build, and bundle budget.
- Exact visual parity has not been accepted against a matching 390px reference capture. The browser test uses a synthetic map and does not prove real provider coverage. Exact parity for images 1 and 3–10 remains open.

### Image 2 follow-up verification — 2026-10-23

- PR #19 latest head `3ca6957461e5d3967fb0ca1e450f9e2495f4cc34` hides the shared header in the transport-map tab, displays the MARSHGO map title, and caps the mobile layer sheet at 66svh.
- The panel-height change came from a real WebKit assertion miss (19.92% exposed map at 68svh); at 66svh the focused WebKit test passes.
- Full local Site production check passed again: 24/24 E2E across Chromium, Firefox and WebKit, along with typechecks, lint, 128 unit tests, build and bundle budget.
- GitHub CI for the latest head was still in progress at the time of this note. The synthetic map fixture and this one screen do not prove real provider tiles/data or visual acceptance of the remaining nine mock states.

### Full safe-control pass on the pinned passenger Site — 2026-10-23

- Replayed `e2e/button-audit.spec.ts` against the release-manifest tuple Server `b65882584a3ad1e8dd7512d13176f52299cded51` + Site `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae`, using isolated loopback `marshgo_e2e` and a test OTP flow. The run builds the exact Site from the manifest; it does not hit production.
- First test passed: **161 safe visible controls clicked across 12 primary passenger routes**, with no browser JS exceptions or unexpected HTTP 5xx. Ten controls had no detected visible effect; they include already-selected navigation/tab states, empty-field swap/search, and invalid empty-form submit. Destructive actions were deliberately excluded. This is a broad sweep, not proof that all conditional controls or Admin/Partner pages work.
- The second test initially exposed two stale assumptions in the audit itself: empty route fields are native `required` controls (so the browser focuses the field rather than rendering an app `role=alert`), and the production trip tab is named `Майбутні`, not `Заплановані`. Updated the assertions to match observed production semantics; focused rerun passed and confirmed the empty form does not POST, the trip filter selects `Майбутні`, and the invalid demand form does not POST.
- `npm run typecheck`, ESLint on `e2e/button-audit.spec.ts`, and `git diff --check` passed after the audit fix.
- Map-layer PR #19 local/hosted checks are tracked separately above. None of these fixture-backed results is a production deployment or visual acceptance for the ten supplied designs; release remains `NOT_RELEASED`.
