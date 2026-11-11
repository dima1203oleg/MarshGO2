# MARSHGO — ANTIGRAVITY NEXT ACTIONS

### Action 1: Consolidate Server PR #45 with Local Routing Improvements
- **Objective**: Create clean candidate branch `antigravity/server-continuation-20261026` based on PR #45 (`cb16fe83...`).
- **Integration**: Bring in local commit `92a26a3` (calendar and realtime transfer parity) and `6cef355` (Lviv tariff metadata), preserving the 40 dirty files in the main worktree by working in a dedicated safe worktree or clone.
- **Verification**: Run unit test suite and frozen Lviv GTFS corridor replay:
  - `npm test tests/gtfs-timetable.test.ts`
  - `npm test tests/journey-search-completeness.test.ts`
  - Golden corridor queries: *Голоско → Сихів*, *Наукова → Сихів*, *Площа Ринок → Дубляни*.

### Action 2: Consolidate Site PR #28 with Local UI & Geolocation Refinements
- **Objective**: Create clean candidate branch `antigravity/site-continuation-20261026` based on PR #28 (`d6c9a957...`).
- **Integration**: Bring in local commits `1a92201` (transit mode colors) and `4afa7b3` (geolocation fallback guidance) plus dirty fixes.
- **Verification**:
  - `npm run typecheck`
  - `npm test`
  - Run Playwright E2E and visual snapshot comparisons against reference mockups.

### Action 3: Verify Admin & Partner API Compatibility
- **Objective**: Verify that `MarshGO-Admin` (`a008dba`) and `MarshGO-Partner` (`5ec9f36`) interact cleanly with Server PR #43's audit feed endpoint `/api/admin/audit`.
- **Verification**: Run build and API contract tests in both workspaces.

### Action 4: Synchronize iOS Pinning
- **Objective**: Once Server and Site candidate branches pass all regression suites and exact SHA hashes are minted, update `MarshGO-iOS` configuration:
  - Pin the new Site commit SHA.
  - Pin the new Server commit SHA.
  - Run Capacitor sync and Xcode simulator smoke test.

### Action 5: Root Orchestration & Secret Configuration
- **Owner Action Required**: Configure GitHub secret `MARSHGO_REPOS_READ_TOKEN` in `dima1203oleg/MarshGO` repository settings with read permissions for private Admin and Partner repos.
- **Objective**: Unblock Root CI in PR #5 and PR #6 to allow full multi-repo release packaging and automated Docker digest generation.
