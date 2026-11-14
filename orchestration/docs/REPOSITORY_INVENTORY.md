# Canonical repository inventory — 2026-10-26

Scope is the six repositories explicitly named by the MARSHGO 5+1 architecture. This is a read-only checkout/PR inventory; no branches were merged or deleted.

| Role | Repository | Local branch / HEAD | Worktree | Manifest SHA | Finding |
|---|---|---|---|---|---|
| Release orchestrator | `MarshGO` | `codex/production-finalization-20261014` / `febd5008fbf7bba058b0e1bf2bfab647a0c735c5` | Dirty (303 paths); ahead 2 | `integration_sha=0d3ed4accecbb5623f0c20c55c69ff0f23f14a4d` | Current checkout is not the manifest integration SHA. |
| Server | `MarshGO-Server` | `feature/transport-layer-availability` / `92a26a3f617f32d644a66c0af46cba096ccb0ce0` | Dirty (40 paths); ahead 2 | `a403a51a203d9d89685c10c69658c8fd95b70e9b` | Local tests cover dirty source, while the manifest pins a different commit. |
| Passenger/driver Web/PWA | `MarshGO-Site` | `codex/sync-journey-mobility-ui` / `ae2c8aaf140305c4a1124c0b9a232f21b09eed0e` | Dirty (45 paths) | `6961afcf008e2c845c0fde68c687ce61fe744f2f` | Local UI/E2E evidence is not tied to the pinned manifest SHA. |
| iOS shell | `MarshGO-iOS` | `codex/production-site-sync-20261014` / `4353cec3cacbaf662ceea047402f361024292b22` | Clean | `be5478bed577b91a89035fe6785ab938f0335799` | Current checkout and manifest differ; manifest's simulator Site SHA matches its old Site pin, not current Site. |
| Admin | `MarshGO-Admin` | `codex/p0-admin` / `bc37198ca139408907aaefa0d97dc9b60a568300` | Clean; behind 2 | `f39c4b74839a393f4487c830930669eabc8c0390` | Local branch is behind; current checkout is not the manifest snapshot. |
| Partner | `MarshGO-Partner` | `codex/p0-partner` / `97a3727cc395dea092af6e3e24d6822370c2bc63` | Clean | `97a3727cc395dea092af6e3e24d6822370c2bc63` | Local HEAD matches the manifest Partner pin. |

## Current release evidence

- `RELEASE_MANIFEST.json` reports `status: NOT_RELEASED`; `deployed_site_sha` is null.
- No single immutable tuple covers the current local source trees because the working Server, Site, iOS, Admin, and orchestrator commits differ from the manifest pins.
- Server and Site worktrees contain uncommitted changes. Preserve them; do not reset, clean, or stage the entire trees.
- Server has 75 registered Git worktrees, 30 marked `prunable`. This count alone does not establish that their contents are disposable; none were removed.
- Admin and Partner have open P0 PRs; authenticated tenant-level acceptance is not established by the local build/unit checks.
- Deployment, staging, live provider entitlements, physical iPhone and production smoke are not evidenced by this inventory.

## Admin/Partner refresh — 2026-11-07 06:15 EET

The 2026-10-26 table above is historical. Freshly located copies and remote main refs:

| Repository | Local copy / state | Fresh remote main SHA | PR evidence |
|---|---|---|---|
| Admin | `/Users/dima1203/Desktop/Робота/MarshGO-Admin`; clean Qoder branch `qoder/admin-email-auth-moderation-20261031`, HEAD `4eb5d15d1692ebcdb5aae40dbcffc39446138fb5` | `02b28940ee017523f2feed01de458f8d0aa20279` | PR #3 merged at main SHA; verify run `41332954531` passed. PR #1 merged; #2 open and docs-only. |
| Partner | `/Users/dima1203/Desktop/Робота/MarshGO-Partner`; clean Qoder branch `qoder/partner-email-auth-20261031`, HEAD `544e5d8c71a04601fae5f0d92dd5ec186f7ac241` | `179631f45e984c5712bef83af43912125e3521d1` | PR #3 merged at main SHA; verify run `41332956900` passed. PR #1 merged; #2 open and docs-only. |

Both local checkouts are clean and their PR #3 head commits are ancestors of current remote main refs. The local main branches themselves are stale. No branch switching or worktree cleanup was performed. Other registered temporary worktree directories marked `prunable` were checked and are absent. Local copies do not resolve Root PR #12 Actions' inability to clone private repos (HTTP 403).

## Root PR #12 candidate pins — 2026-11-07 06:19 EET

The root PR manifest at head `0fc36cf1ec588d42b0f43eb51374b6b18b9f4757` is `NOT_RELEASED` and pins the following commits. Every pinned commit is present in its canonical repository, but current main has advanced as shown; ancestry is not compatibility evidence.

| Component | PR #12 pin | Current remote main | Main commits ahead of pin | Compare status |
|---|---|---|---:|---|
| Server | `44f954b3ce6099dde86cebfe7984079a078a5872` | `5a137bd79a55da5a8a96cd99da548938e7e42d41` | 90 | ahead, 0 behind |
| Site | `fef697e2603b43c5bc76a9f98e78dba50cc8b480` | `f8334a0a9b768060b6d816ce6db9f52f7febff7e` | 108 | ahead, 0 behind |
| iOS | `4353cec3cacbaf662ceea047402f361024292b22` | `ad27b6f70b6255d1dd323bafcffafe4558232224` | 4 | ahead, 0 behind |
| Admin | `4eb5d15d1692ebcdb5aae40dbcffc39446138fb5` | `02b28940ee017523f2feed01de458f8d0aa20279` | 1 | ahead, 0 behind |
| Partner | `544e5d8c71a04601fae5f0d92dd5ec186f7ac241` | `179631f45e984c5712bef83af43912125e3521d1` | 1 | ahead, 0 behind |

The candidate needs targeted API/client compatibility review and exact-SHA revalidation. Root `main` is still the scaffold. PR #12 checks also remain blocked by GitHub Actions HTTP 403 when cloning private Admin. GitHub's full PR diff endpoint returned HTTP 406 because the change exceeds its 300-file cap; paginated changed-file listing completed.

## Snapshot timing

The branch/HEAD values above record the inventory captured before the audit documentation was committed. Since that capture, the orchestrator has received documentation-only audit commits; no Server/Site/iOS/Admin/Partner source or release pins were modified by those commits. Read-only GitHub PR metadata was collected separately and is in the DAG report.

## Evidence collection

Collected with `git status --short --branch`, `git rev-parse HEAD`, `gh pr list --state open`, and `jq` against the current root `RELEASE_MANIFEST.json` on 2026-10-26. The detailed open PR graph is in [PR_DEPENDENCY_DAG.md](PR_DEPENDENCY_DAG.md).

## Fresh working-tree and runtime inventory — 2026-11-07 15:42 EET

This supersedes the old local checkout rows above for the named canonical repositories. It does not replace the remote main SHA and PR evidence in `NEXT_ACTIONS.md` or certify a release candidate.

| Repository | Local root / branch / HEAD | Working changes | Preservation status |
|---|---|---:|---|
| MarshGO | `/Users/dima1203/Desktop/MarshGO`; `antigravity/ultimate-premium-web-9`; `4fd9bd70dd36b49f1c538c7a3e1a2cd1dc5ae0fd` | 110 tracked/staged paths; 354 untracked paths | Mixed dirty worktree; untouched |
| MarshGO-Server | `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`; `antigravity/ukraine-12-transports-multimodal`; `e9934abbd8fc973177de8d7f47548739758a1b74` | 3 tracked/staged paths; 4 untracked paths | Geometry/provenance and fallback work preserved; untouched |
| MarshGO-Site | `/Users/dima1203/Desktop/MarshGO/MarshGO-Site`; `antigravity/ultimate-premium-web-9`; `eda449f008025b2126c92fd24cd68deb513ca3ad` | 21 tracked/staged paths; 2 untracked paths | Mixed dirty worktree; untouched |
| MarshGO-iOS | `/Users/dima1203/Desktop/MarshGO/MarshGO-iOS`; `codex/production-site-sync-20261014`; `4353cec3cacbaf662ceea047402f361024292b22` | Clean | Untouched |
| MarshGO-Admin | No checkout at expected Desktop sibling path | N/A | Historical alternate checkout exists under Desktop/Робота; no changes made |
| MarshGO-Partner | No checkout at expected Desktop sibling path | N/A | Historical alternate checkout exists under Desktop/Робота; no changes made |

At 15:42 EET, `/` had 18 GiB free, system memory free was 31%, encrypted swap use 9.1 GiB and CPU idle was 55.8%. This is below the project GREEN gates (20 GiB and 35% free memory), so heavy local work remains deferred. `:4181` serves HTTP 200 from a detached clean preview at pre-PR-#88 SHA `cf2fa64c8b8545e3c4554aa1438d0ed06021014b`; browser automation returned `browser.user is unavailable`, so the signed-in state and visual result are NOT_VERIFIED. No worktree, container, cache, user data or code was changed in this inventory update.
