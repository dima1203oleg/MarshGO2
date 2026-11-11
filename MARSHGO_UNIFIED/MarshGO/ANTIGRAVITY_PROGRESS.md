# MARSHGO — ANTIGRAVITY PROGRESS TRACKER

## Phase 0: Non-Destructive Workspace Inventory & Repository Audit
- **Status**: `COMPLETED`
- **Accomplishments**:
  - Full read-only inventory performed across all 6 canonical repositories.
  - Zero files overwritten; zero destructive git commands issued (`no reset --hard`, `no clean -fd`).
  - Identified 376 dirty files in Root, 40 dirty files in Server, 80 dirty files in Site.
  - Verified local running service on port 3000 (Vite PWA dev server).
  - Captured dynamic UI screens using local Google Chrome instance across both mobile (393x852) and desktop (1440x900) resolutions.
  - Confirmed GitHub CLI `gh` authentication for `dima1203oleg`.
  - Mapped the exact branch ancestry for Server (PR #42 → #43 → #44 → #45 vs local `92a26a3`) and Site (PR #25 → #26 → #27 → #28 vs local `4afa7b3`).
  - Documented the Root CI blocker (`MARSHGO_REPOS_READ_TOKEN`).

---

## Phase 1: Repository Continuation & Branch Strategy
- **Status**: `IN_PROGRESS`
- **Accomplishments**:
  - Created master governance and architecture continuation documents:
    - `ANTIGRAVITY_MASTER_PLAN.md`
    - `ANTIGRAVITY_PR_DAG.md`
    - `ANTIGRAVITY_FEED_MATRIX.md`
    - `ANTIGRAVITY_PROGRESS.md`
    - `ANTIGRAVITY_NEXT_ACTIONS.md`
    - `ANTIGRAVITY_RELEASE_READINESS.md`
  - Defined branch naming convention `antigravity/*` for all downstream work.

---

## Phase 2: Server GTFS & Multimodal Routing Continuation
- **Status**: `PENDING`
- **Focus**:
  - Reconcile Server PR #45 with local `92a26a3` calendar parity.
  - Benchmark Lviv GTFS frozen feed on the 3 golden corridors.
  - Test memory-bounded frontier and 71h service day support.

---

## Phase 3: Site UI & Route Experience Consolidation
- **Status**: `PENDING`
- **Focus**:
  - Reconcile Site PR #28 with local `4afa7b3`.
  - Close the ~12% visual gap against golden reference mocks.
  - Verify `CanonicalRouteLip`, 12 transport modes, and MapLibre camera transitions.

---

## CHECKPOINT 2026-10-26 18:30 — Web-First Production Completion Milestone
- **Server (`MarshGO-Server` on branch `antigravity/server-continuation-20261026` @ `ccdc0b4`)**:
  - Aligned BALANCED multi-objective scoring weights with Section 20.3 oracle fixtures.
  - Typecheck: PASS; ESLint: 0 errors; Unit tests: 323 passed, 0 failed, 3 skipped (326 total); DB Integration tests (PostGIS 17 + Redis 7.4): 30/30 passed.
- **Site (`MarshGO-Site` on branch `antigravity/site-continuation-20261026` @ `317cca3`)**:
  - Implemented Section 19 Web-First responsive ergonomics across small phones (320px), iPhone 15/16 Pro Max (430px), tablets (768px), and desktops.
  - Aligned 12 canonical transport modes palette: ferry (`#1687FF`), funicular (`#B45309`), dark mode `--route-card: #111820;`.
  - Harmonized candidate generation truncation copy across unit and E2E suites.
  - Preserved default Lviv subtitle and city selector in `TransportMapView`.
  - Built premium Rendezvous & Active Ride Tracking view in `RendezvousLocationMap.tsx` matching the user reference mockup (`media_1793028462331.png`) with black Toyota Camry `BC 1234 AA` asset and driver Oleksiy profile.
  - Typecheck: PASS; Unit tests: 121 passed, 0 failed (10 suites).
- **Architecture & Storyboards**:
  - Created `rideshare_multimodal_lifecycle_storyboard.md` detailing Driver (D01–D12) and Passenger (P01–P12) lifecycles, 0% platform carpool commission, atomic seat booking, and multimodal hub transfers.
- **Root Playwright E2E Quality Gates (`MarshGO`)**:
  - **ALL 27 TESTS PASSING 100% (4.7m)** across:
    - `button-audit.spec.ts`: 184 buttons clicked, 0 dead clicks, 0 unhandled errors.
    - `conditional-cta.spec.ts`: 2/2 passed.
    - `journey-route-map.spec.ts`: 1/1 passed (all sheet snaps, segment focus, stop expansions, light/dark `--route-card: #111820;`, intermediate stops for metro, bus, tram, trolleybus, minibus, ferry `#1687FF`, funicular `#B45309`).
    - `marketplace.spec.ts`: 14/14 passed (two-account booking, negotiation `OFFERED → COUNTEROFFERED → ACCEPTED`, persisted chat, multi-rider re-routing, candidate warnings, iPhone 15/16 Pro Max layout stability).
    - `rendezvous-map.spec.ts`: 2/2 passed (live GPS telemetry, approach geometry, consent and revocation).
    - `browser-compat.spec.ts`: 1/1 passed across 6 viewports and browsers.

### 2026-10-26 19:05 Checkpoint — Full Multimodal Transit Feed Integration & Validation
- **Database & Feed Seeding**:
  - Ran `server/mobility/seedUkraine.ts` populating `mobility_providers` with live Ukrainian transit networks:
    - **Укрзалізниця (UZ)**: 167 stops, 125 train routes, 125 trips, 1,345 stopTimes (`healthy`).
    - **Київпастранс**: 1,492 stops, 161 routes (trams, trolleybuses, buses), 24,275 trips, 104,134 stopTimes (`healthy`).
    - **Львівавтодор**: 1,071 stops, 72 routes, 15,716 trips, 426,685 stopTimes, 626 live vehicles (`healthy`).
    - **Київ (Metro, City Express, Funicular, Marshrutkas)**: 52 metro stations, full interval timetables and transfer hubs (`healthy`).
    - **Zelectra**: 228 available scooters in Kyiv, 0s freshness, GBFS v3.0 (`healthy`).
    - **Івано-Франківськ, Біла Церква, Кам’янець-Подільський, Ужгород, VD-Express**: connected and validated.
- **Client Route Engine Fix (`MarshGO-Site` @ `03d52d1`)**:
  - Fixed `providerCanRoute` in `src/domain/transportPreferences.ts` to recognize `marshrutka` providers with `geojson` and `json` sources, preventing unintentional mode exclusion during Pareto journey candidate synthesis.
- **Empirical Multimodal Chain Verification**:
  - **Kyiv -> Lviv (Intercity)**: 12 real multimodal itineraries generated combining walking, city electric transport (trolleybuses, trams) to Kyiv-Pasazhyrskyi, and Ukrzaliznytsia trains to Lviv-Holovnyi.
  - **Lviv Station -> Rynok Square (Urban)**: 19 real multimodal itineraries generated combining walking, municipal buses, and trams (lines 1, 4, 9).
  - **Kyiv Khreshchatyk -> Kontraktova (Urban Hub)**: 15 real multimodal itineraries generated combining walking, Kyiv Metro (M2 Obolonsko-Teremkivska line), and Zelectra GBFS scooters.


