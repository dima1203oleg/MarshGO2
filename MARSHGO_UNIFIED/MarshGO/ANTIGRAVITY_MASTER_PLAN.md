# MARSHGO — ANTIGRAVITY MASTER CONTINUATION PLAN
**Canonical Repository Continuation · Git Safety · Multimodal Routing · Provider Feeds · Cache · UI/UX · Production Readiness**
*Date: 26.10.2026 | Principal AI Architect: Google Antigravity*

---

## 1. Executive Summary & Mission
Google Antigravity officially accepts custody of the MARSHGO multi-repository ecosystem from OpenAI Codex. 
Per the strict engineering directive:
- **No rewrite from scratch**: We do NOT create a new project or rewrite working code.
- **Git Safety First**: Preserving all dirty working trees, untracked test fixtures, and verified local progress in `MarshGO` (central), `MarshGO-Server`, and `MarshGO-Site`.
- **Target Architecture**: 5 Product Repositories + 1 Central Release Orchestrator.
- **Production Status**: `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED` until all quality gates, physical iOS tests, and feed verifications pass.

---

## 2. Canonical Repositories & Current Exact State

| Repository | Current Local Branch | Local HEAD SHA | GitHub Reference PR / Candidate | Status / Dirty Tree |
|---|---|---|---|---|
| **MarshGO** (Root) | `codex/production-finalization-20261014` | `affef61` (+5 ahead of origin) | PR #5 (`688b58c`), PR #6 (`2b87b8b`) | **376 dirty files** (97 modified, 278 untracked audit docs) |
| **MarshGO-Server** | `feature/transport-layer-availability` | `92a26a3` (+2 ahead of origin) | PR #45 (`cb16fe8`), PR #44 (`aaa1328`), PR #43 (`4ed81b4`) | **40 dirty files** (20 modified, 19 untracked) |
| **MarshGO-Site** | `codex/sync-journey-mobility-ui` | `4afa7b3` (+1 ahead of origin) | PR #28 (`d6c9a95`), PR #27 (`cc14995`) | **80 dirty files** (34 modified, 45 untracked) |
| **MarshGO-iOS** | `codex/production-site-sync-20261014` | `4353cec` | PR #15 (`7468cee`), PR #14 (`4353cec`) | **Clean** (Pinned to previous Site/Server) |
| **MarshGO-Admin** | `codex/p0-admin` | `a008dba` | PR #1 (`a008dba`) | **Clean** (Ready, matches PR #1) |
| **MarshGO-Partner** | `codex/p0-partner` | `5ec9f36` | PR #1 (`5ec9f36`) | **Clean** (Ready, matches PR #1) |

---

## 3. Seven Phases of Execution

### Phase 0: Safe Audit & Preservation (COMPLETED)
- Conducted non-destructive, read-only audit across all 6 canonical repositories (`git status`, `git branch -avv`, `git rev-parse HEAD`, `gh pr list`).
- Identified 496 total dirty/uncommitted files across root, Server, and Site.
- Verified that `gh` is authenticated under `dima1203oleg`.
- Documented divergence between local worktrees and remote PR stacks.

### Phase 1: Canonical Branch Selection & DAG Alignment
- Construct non-destructive Antigravity working branches with prefix `antigravity/`:
  - `antigravity/server-continuation-20261026`
  - `antigravity/site-continuation-20261026`
  - `antigravity/release-continuation-20261026`
- Reconcile Server PR #45 (71h GTFS service day, bounded queue frontier) with local calendar/realtime parity commits (`92a26a3`).
- Reconcile Site PR #28 (route/rendezvous/truncation status) with local color alignment and geolocation guidance (`4afa7b3`).

### Phase 2: Priority 1 — Multimodal Journey Engine & GTFS Routing
- **Problem**: Lviv dense GTFS feeds trigger `searchTruncated=true` and `candidateGraphTruncated=true` under heavy candidate segment volume (~100,000 edges).
- **Core Investigation**:
  - Replay frozen Lviv GTFS fixture with exact checksums.
  - Test query-directed frontier pruning, indexed temporal events, RAPTOR round search, and multicriteria Pareto dominance.
  - Verify departure windows, stop_times > 24:00 (handling up to 71:59:59), transfers type 2/3/4, walking transfer limits.
  - Mandatory comparative benchmark on 3 golden corridors:
    1. *Голоско → Сихів*
    2. *Наукова → Сихів*
    3. *Площа Ринок → Дубляни*
  - Ensure honest `searchTruncated` reporting if bounds are hit; zero false assurances.

### Phase 3: Priority 2 — All Provider Feeds & Live Telemetry
- Validate all transit feeds:
  - **GTFS Static**: Lviv, Kyiv, regional feeds (ZIP integrity, timezone consistency, calendar/service dates).
  - **GTFS Realtime**: `VehiclePositions`, `TripUpdates`, `Alerts`. Validate individual GPS timestamps (<90s freshness) and trip progress.
  - **Live Bus / Marshrutka Filter**: Only display active vehicles that are downstream of origin and heading toward boarding stop with valid ETA. Dim passed vehicles.
  - **GBFS**: Zelectra, BikeNow, Nextbike, Bolt Scooters, Dott. Strict adherence to operator-specific zone boundaries and dock rules.
  - **Commercial Providers**: INFOBUS, Kiwitaxi, Intui.travel, Karhoo, Mozio, Splyt, 838, Getmancar. Mark unverified integrations as `BLOCKED_EXTERNAL` or `DEMO_ONLY`.
- Generate `PROVIDER_FEED_ACCEPTANCE_MATRIX.md`.

### Phase 4: Priority 3 — Redis Smart Cache & Radius Gateway
- Prevent cache duplication: build upon existing `server/mobility/redisGateway.ts` and `Server PR #5`.
- Validate L1 memory + Redis L2 hierarchy with single-flight request deduplication and stampede locks.
- Ensure strict privacy boundary: never cache private GPS coordinates or user bookings in public shared keys.
- Run load tests: 100 concurrent identical requests, 1,000 RPS benchmark target, Redis outage fallback.

### Phase 5: Priority 4 — UI/UX, Navigation & Visual Acceptance
- Preserve canonical navigation tokens:
  - Bottom navigation: *Головна | Пошук | + | Поїздки | Профіль*
  - 12 transport modes in 4×3 grid.
  - `CanonicalRouteLip` with time, fare, transfers, segmented route strip, mode icons, active leg details.
  - 6 mandatory scenarios in Light & Dark modes.
  - MapLibre: *Discover → Preview → Active* camera transitions without standalone `+/-` zoom buttons.
- Resolve the ~12% visual regression gap against golden mocks (typography, padding, button hitboxes).

### Phase 6: Multi-repo Integration & iOS Pinned Verification
- Materialize exact SHA tuple across all 6 repos.
- iOS sync (Capacitor) only after Server and Site reach unified candidate status.
- Build Xcode simulator bundle and test native gestures, location permissions, and offline recovery.

### Phase 7: Production Release Gate & SRE
- Resolve `MARSHGO_REPOS_READ_TOKEN` external blocker with owner.
- Build production Docker images, verify SHA256 digests.
- Validate database migrations rollback, Postgres/PostGIS integrity, and disaster recovery.
- Final sign-off: strictly maintain `PRODUCTION_READY=false` until owner approves.
