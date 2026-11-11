# MARSHGO — RELEASE READINESS REPORT
**Status: NOT_RELEASED | PRODUCTION_READY=false**
*Audit Date: 26.10.2026 | Google Antigravity*

---

## Current Status Flags
```ini
PRODUCTION_READY=false
RELEASE_STATUS=NOT_RELEASED
RELEASE_GATE_BLOCKERS_PRESENT=true
```

---

## 1. Quality Gates Assessment

| Quality Gate | Description | Current State | Blocker / Requirement |
|---|---|---|---|
| **Gate 1: Multi-repo SHA Alignment** | All 6 repos pinned to exact, mutually compatible SHA hashes | ⚠️ DIVERGED | Server PR #45, Site PR #28, and local worktrees need consolidated candidate SHAs. |
| **Gate 2: GTFS Routing & Truncation** | Lviv dense GTFS feeds return complete, diverse multimodal journeys | ⚠️ PARTIAL | Complex queries trigger memory & queue truncation; 71h service day support merged in PR #45, needs verification with local commits. |
| **Gate 3: Provider Feeds & Live GPS** | Fresh (<90s) vehicle telemetry; no display of passed vehicles | ⚠️ CONDITIONAL | Live GTFS-RT feeds validated conditionally; downstream stop filtering logic needs strict verification. |
| **Gate 4: Redis Smart Cache** | Single-flight deduplication; radius caching; zero privacy leaks | ✅ VERIFIED IN PR | PR #2 / PR #5 caching architecture verified; needs load benchmark on consolidated server. |
| **Gate 5: UI & Visual Acceptance** | 12 modes, CanonicalRouteLip, dark/light modes match golden mocks | ⚠️ ~12% GAP | Visual regression test on light mode search results shows styling delta against mock baseline. |
| **Gate 6: iOS Native Simulator & GPS** | Capacitor bundle builds; foreground & background GPS permissions | ⏳ PENDING SYNC | Pinned to earlier Site/Server. Sync pending candidate consolidation. |
| **Gate 7: Central Orchestration & Secrets** | Automated Docker image builds, digests, and multi-repo tests | ❌ BLOCKED | `MARSHGO_REPOS_READ_TOKEN` secret missing in GitHub Actions. |
| **Gate 8: Staging & Owner Sign-off** | Live staging environment verified; physical iPhone tested | ⏳ PENDING | Physical iPhone test, backup/restore runbook, and explicit owner sign-off required. |

---

## 2. External Blockers

### 1. `MARSHGO_REPOS_READ_TOKEN` (Critical Release Blocker)
- **Scope**: GitHub Actions workflow in `dima1203oleg/MarshGO` (Root).
- **Issue**: Root CI fails during checkout because `MarshGO-Admin` and `MarshGO-Partner` are private repositories, and GitHub Actions default `GITHUB_TOKEN` does not have cross-repository read access.
- **Required Owner Action**: Add `MARSHGO_REPOS_READ_TOKEN` secret with `read:repo` scope to GitHub repository secrets in `dima1203oleg/MarshGO`.

### 2. Commercial B2B Provider Keys
- **Scope**: INFOBUS, Kiwitaxi, Karhoo/Splyt, Getmancar.
- **Issue**: Lacking live production API contracts and credentials.
- **Handling**: Labeled honestly as `BLOCKED_EXTERNAL` or `DEMO_ONLY`. Core P2P rideshare and open public transit functions operate fully independent of these external dependencies.
