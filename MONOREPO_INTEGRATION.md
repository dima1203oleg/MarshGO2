# MARSHGO monorepo integration snapshot

Status: **PARTIAL — source trees gathered; integration build and acceptance pending**

This branch collects the current canonical product source trees under `apps/` and
the selected coordination/test material under `orchestration/`. It is a source
snapshot, not a history-preserving merge, and it is not a production release.

## Source pins captured

| Component | Source branch | Source HEAD | Dirty paths at capture | Snapshot |
|---|---|---|---:|---|
| Central orchestration | `antigravity/ultimate-premium-web-9` | `4fd9bd70dd36b49f1c538c7a3e1a2cd1dc5ae0fd` | 511 | selected docs, scripts, e2e, tests, ops, tools, shared, workflows |
| Server | `antigravity/ukraine-12-transports-multimodal` | `e9934abbd8fc973177de8d7f47548739758a1b74` | 41 | `apps/server/` |
| Site | `qoder/route-geometry-continuation-20261110` | `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7` | 40 | `apps/site/` from the active Qoder worktree |
| iOS | `codex/production-site-sync-20261014` | `4353cec3cacbaf662ceea047402f361024292b22` | 0 | `apps/ios/` |
| Admin | `main` | `d8afa64c4efda8ce4f10557a03651943effa52a7` | 0 | `apps/admin/` |
| Partner | `main` | `4d605d4353af281dd295fabf0c7c2ac05efe222e` | 0 | `apps/partner/` |

The snapshots include the source worktree edits present at capture time. Their
40-character HEAD pins alone do not describe those uncommitted edits; compare
the pinned source checkouts and their dirty diffs before accepting or releasing
this snapshot.

## Preservation and exclusions

- Integration work is isolated on `codex/consolidate-canonical-repos`, based on
  MarshGO2 `8542f4b5bd90512d8e22974bcdb9b1184c700821`.
- Existing MarshGO2 edits remain unstaged and uncommitted. They were not
  overwritten or included in the integration commit.
- No `.git`, `node_modules`, build output, or environment secrets were copied.
- Generated release snapshots under `apps/server/.release/` are present only in
  the local working directory and must remain excluded from Git.
- Root `.release/` evidence bundles, stale root `src/`, nested historical
  worktrees/caches, and generated artifacts were not imported.
- Git history from the six source repositories is not included in this snapshot.

## Acceptance still required

Before calling this a unified, usable monorepo, add and verify workspace-level
build/test commands, API-to-Site configuration, iOS project references, and
cross-app contract checks. Run those checks only when local resource gates allow.
Then review the exact staged diff and push this branch (never `main`).

Production status remains **NOT_RELEASED**.
