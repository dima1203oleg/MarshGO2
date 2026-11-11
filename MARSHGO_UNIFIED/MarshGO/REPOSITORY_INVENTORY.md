# MARSHGO canonical repository inventory — 2026-10-23

## Current recheck — 2026-10-25 17:36 UTC

Scope remains the authorized 5+1 repositories only. GitHub open PR inventory rechecked: MarshGO 6, Server 39, Site 26, iOS 12, Admin 2, Partner 2 (87 total). Current release-facing candidates are still open, and their exact branch ancestry is recorded at the top of `PR_DEPENDENCY_DAG.md`.

| Repository | Current local checkout / exact SHA | Local state | Current GitHub head and evidence |
|---|---|---|---|
| `MarshGO` orchestrator | `/Users/dima1203/Desktop/MarshGO`, `codex/production-finalization-20261014`, `58d6f12acb68922d3d7f9ab18180e1cf10457537` | One audit-only local commit beyond PR #5 head; 286 dirty status entries, preserved. Not an immutable RC checkout. | PR #5 head `40a46aced468830ca7c3ab5a7648b6a05a6e6f95`, verify `40203469261` FAIL at private Admin/Partner materialization; CodeQL/Gitleaks pass. PR #6 head `2b87b8b016ce8b4c309adc4399ad31b81781cd09` targets #5. |
| `MarshGO-Server` | `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, `feature/transport-layer-availability`, `92a26a3f617f32d644a66c0af46cba096ccb0ce0` | 37 dirty status entries, preserved. Not the current PR #41/#42 source. | Current routing stack: PR #42 `d5a1067e637ffcab3a2ea3f4f30e41c7fdbb5e24` → #41 `70e11d8d8730e54311f13d73953ab565fd6b432a` → #40 `38f17b88f98c8530f8090cfc6745cd334c87e53c` → #39 → #38 → #36. PR #42 exact-head CI both PASS; graph truncation remains. Separate PR #35 targets the dirty feature branch. |
| `MarshGO-Site` | `/Users/dima1203/Desktop/MarshGO/MarshGO-Site`, `codex/sync-journey-mobility-ui`, `6961afcf008e2c845c0fde68c687ce61fe744f2f` | 41 dirty status entries, preserved. | Current UI chain #3 → #21 → #22 → #23 → #24 → #25 → #26 → #27, exact #27 `cc1499573732a41e8ff31d7ab634d15421d45df1`; exact-head checks pass. Still separate open PRs, not integrated in root release SHA. |
| `MarshGO-iOS` | `/Users/dima1203/Desktop/MarshGO/MarshGO-iOS`, `codex/production-site-sync-20261014`, `4353cec3cacbaf662ceea047402f361024292b22` | Clean at inspection, but behind latest source candidates. | PR #14 head `7dfd35bf5f06169d7df82fa8d0879fcaf02431b5`, Simulator CI pass; pins Server #40 `38f17b88...` and Site #25 `7aed5344...`, not current #42/#27. |
| `MarshGO-Admin` | No nested Git checkout. `.release/admin-9dbf7db0a935498ac40c98b19bc36bce056d630d` detached snapshot | 3 dirty/untracked entries, preserved. Snapshot is older than current candidate. | PR #1 head `f39c4b74839a393f4487c830930669eabc8c0390`, verify pass. |
| `MarshGO-Partner` | No nested Git checkout. `.release/partner-c639257a7f28aeda5b378a816038b01651146b83` detached snapshot | 3 dirty/untracked entries, preserved. Snapshot is older than current candidate. | PR #1 head `97a3727cc395dea092af6e3e24d6822370c2bc63`, verify pass. |

**Current tuple conclusion:** there is not one proven cross-repository release tuple. iOS #14 pins Server #40/Site #25 while Server #42/#41 and Site #27 are newer stacked drafts; root PR #5 itself pins the #40/#25-era tuple and its hosted cross-repo checkout is blocked by the missing read-only private-repository Actions secret. No repo, branch, history, volume, or user file was deleted/reset during this recheck.

Scope is the user-authorized five product repositories plus the MarshGO release/orchestration repository. No other repositories were inspected or included.

| Repository | Local checkout / exact HEAD | Local state | GitHub candidate evidence |
|---|---|---|---|
| `dima1203oleg/MarshGO` (orchestrator) | `/Users/dima1203/Desktop/MarshGO`, `codex/production-finalization-20261014`, `39a182094c82f58d84b3dbabd4a18808569bd206` | Dirty: many pre-existing source, test, docs, generated, and config changes. Preserved; none staged by this audit. | PR #5 exact head; `verify` FAILURE, CodeQL/Gitleaks SUCCESS. PR #6 is child/parallel security stack at `b2535369...`, verify FAILURE. PR #4 exact head `9610da57...`, checks SUCCESS. |
| `MarshGO-Server` | `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`, `feature/transport-layer-availability`, `182c77ae4f78d576a287007d8e0864fb130f43f8` | Dirty: journey, GTFS/RT, mobility, scoring, API, tests, and one temporary benchmark. Preserved. | PR #31 head `b6588258...` checks SUCCESS; #30 `14b3abfa...` and #29 `648e481c...` are open draft parents; #28 `d83fa585...` checks SUCCESS. Do not treat local `182c77...` as that candidate. |
| `MarshGO-Site` | `/Users/dima1203/Desktop/MarshGO/MarshGO-Site`, `codex/sync-journey-mobility-ui`, `6961afcf008e2c845c0fde68c687ce61fe744f2f` | Dirty: design docs, transport preference, map, navigation, search and journey UI/API changes. Preserved. | PR #19 head `3ca69574...` and #18 `e01bef59...` checks SUCCESS. PR #15 head `1e8ce1d4...` is draft and has a CANCELLED verify plus successful checks. Local HEAD is not the PR #19 candidate. |
| `MarshGO-iOS` | `/Users/dima1203/Desktop/MarshGO/MarshGO-iOS`, `codex/production-site-sync`, `4353cec3cacbaf662ceea047402f361024292b22` | Clean at inspection. | PR #12 head `b68be012...` checks SUCCESS and pins a specific Site/Server candidate; not the same as Site #19. Physical device acceptance is not evidenced. |
| `MarshGO-Admin` | `.release/admin-9dbf7db0a935498ac40c98b19bc36bce056d630d`, detached `9dbf7db0...` | Snapshot contains untracked `.dockerignore`, `Dockerfile.marshgo`, and `deploy/`; preserved. Not a branch checkout. | PR #1 exact head checks SUCCESS; PR #2 is docs-only and open. |
| `MarshGO-Partner` | `.release/partner-c639257a7f28aeda5b378a816038b01651146b83`, detached `c639257a...` | Snapshot contains untracked `.dockerignore`, `Dockerfile.marshgo`, and `deploy/`; preserved. Not a branch checkout. | PR #1 exact head checks SUCCESS; PR #2 is docs-only and open. |

The two Admin/Partner snapshots are exact SHA materializations, not clean working branches. There are other local worktrees of the same six repositories; they are not silently substituted for the six current pointers above. `AGENTS.md` was not found in the scoped checkout trees. Package manifests require Node `24.21.0`; the interactive shell currently resolves Node `26.7.0`, so local validation must explicitly use the repository-pinned runtime.

## Release pins observed

The root `RELEASE_MANIFEST.json` currently says `NOT_RELEASED`, `production_ready: false`, candidate `RC-2026-10-23-current-review.26`, API `v1`, and migration `055_provider_commercial_use_requires_license.sql`. It pins Server `b65882584a3ad1e8dd7512d13176f52299cded51`, Site `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae`, iOS `b68be01275d4a170c76d44bbd34218a21a45a71a`, Admin `9dbf7db0a935498ac40c98b19bc36bce056d630d`, and Partner `c639257a7f28aeda5b378a816038b01651146b83`. Those pins are not all on one latest compatible PR tuple: Site #19 is newer than the pinned Site SHA and iOS #12 does not pin Site #19.

## Preservation boundary

This inventory is read-only evidence. No checkout, branch, container, database, volume, remote, or generated file was deleted or reset. The existing unstaged changes listed above predate this audit and remain untouched.
