# GitHub release state recheck — 2026-10-22

## Pull requests and exact heads

| Repo | PR | Head SHA | State | Checks |
|---|---:|---|---|---|
| MarshGO-Server | #24 | `27ca486d66fa9b30b8559e4b1041ccca67f1d283` | OPEN, draft, mergeable | Both exact-head `verify` checks SUCCESS |
| MarshGO-Site | #14 | `c50ba344b7dfde9859826363fea119d95e2cc54e` | OPEN, draft, mergeable | Three checks SUCCESS |
| MarshGO-iOS | #9 | `7df237845d8841a98a5c15082677ec4198728339` | OPEN, draft, mergeable | Four `simulator-build` checks SUCCESS |
| MarshGO-Admin | #1 | `9dbf7db0a935498ac40c98b19bc36bce056d630d` | OPEN, non-draft, mergeable | `verify` SUCCESS |
| MarshGO-Partner | #1 | `c639257a7f28aeda5b378a816038b01651146b83` | OPEN, non-draft, mergeable | `verify` SUCCESS |

The ownership-guidance PR #2 in Admin and Partner is still OPEN/draft/mergeable with no checks reported. PR state and workflow data are a live GitHub CLI snapshot, not production acceptance.

## Deployment records

GitHub's deployments API returned zero deployment records for each of the five application repositories (Server, Site, iOS, Admin, Partner). This proves only that GitHub has no tracked deployments there; it cannot exclude deployments on an external provider. No verified live URL or deployed SHA is currently established by this check.

## Release conclusion

Candidate code and CI are not equivalent to a deployed product. The app PRs have not been merged, and staging/production deployment evidence is absent. Keep the release manifest at `NOT_RELEASED`. Next, determine the actual hosting account/target and provide a staging origin/configuration, then run exact-SHA deployment, browser/provider smoke, backup/rollback and acceptance checks. Production rollout remains behind the owner approval gate.

## Recheck — 2026-10-22 21:46 UTC

- Re-read exact open PR heads via `gh pr list` across Server, Site, iOS, Admin, Partner and MarshGO. Server #24 `27ca486d66fa9b30b8559e4b1041ccca67f1d283`, Site #14 `c50ba344b7dfde9859826363fea119d95e2cc54e`, and iOS #9 `7df237845d8841a98a5c15082677ec4198728339` remain OPEN/DRAFT/MERGEABLE with all listed checks SUCCESS. Admin #1 `9dbf7db0a935498ac40c98b19bc36bce056d630d` and Partner #1 `c639257a7f28aeda5b378a816038b01651146b83` remain OPEN/MERGEABLE with `verify` SUCCESS.
- MarshGO PR #6 exact head `b2535369f4636f1f2bb63f96525f2a1b4f929f08` remains OPEN/DRAFT/MERGEABLE. Its root CI run `39658734667` passed install, audit, lint, typecheck, unit tests, migration, Postgres integration, build and bundle; then failed at “Configure read-only access to private Admin and Partner repositories”. Docker image build and E2E/browser steps were skipped. CodeQL and Gitleaks checks passed. The blocker is the absent Actions secret `MARSHGO_REPOS_READ_TOKEN`, not an application test failure.
- GitHub status is not staging acceptance. No staging URL, deployed SHA, private-repository CI credential, or owner-authorized production rollout has been established. Release remains `NOT_RELEASED`.
