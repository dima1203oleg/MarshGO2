# Canonical repository PR reconciliation — 2026-10-25

Read-only GitHub snapshot. All six canonical repositories were checked; no PR was merged, branch deleted, or force-pushed.

| Repository | Selected candidate / open PR state | Integration consequence |
|---|---|---|
| MarshGO-Server | PR #36 `134ed017828a020e1d5f696b3cb9ea95527bb093` is OPEN/CLEAN. Newer routing work is stacked separately: PR #38 `8e570768…`, PR #39 `142ed4f…` (draft). PR #37 is another draft candidate. | Manifest uses #36, not #39. PR #39 has route retention work but does not establish dense-feed completeness; latest frozen-feed evidence still reports truncation. |
| MarshGO-Site | PR #21 `df796e2…` → #22 `5a96e856…` → #23 `44a5e4a…`; all OPEN/CLEAN; #22/#23 drafts. | #23 full local fixture acceptance and current hosted Verify pass. Source stack remains unmerged. |
| MarshGO-iOS | PR #14 `94658424…` OPEN/CLEAN; pins current Site #23 and Server #36. | Exact pin, hosted simulator CI and local simulator launch pass. Physical-device/API acceptance remains open. |
| MarshGO-Admin | PR #1 `bc37198…` OPEN/CLEAN; PR #2 is governance documentation only. | Local/static image checks exist; authenticated Admin role and API actions remain untested. |
| MarshGO-Partner | PR #1 `97a3727…` OPEN/CLEAN; PR #2 is governance documentation only. | Local dev OTP, API/onboarding and tenant checks pass for tested paths; production OTP/provider operations remain open. |
| MarshGO | PR #5 head `566a17e…` and PR #6 head `2b87b8b…` are OPEN/draft; PR #6 state UNSTABLE. | PR #6 Verify `40125100349` fails closed at private Admin/Partner source checkout because `MARSHGO_REPOS_READ_TOKEN` is absent. CodeQL and Gitleaks runs `40125098012`, `40125100364` pass. No alternate access or gate bypass used. |

The current local orchestration checkout is branch `codex/production-finalization-20261014`, HEAD `a75fc5fd94adf4aa067c481da23681df1c1fdaac`, four commits ahead of origin and extensively dirty. Its local HEAD is not interchangeable with the manifest's prior immutable `integration_sha` `8741bd1936115941386148104dff130525aa5f5d`, and is not a clean release artifact. Preserve both facts in the manifest.

The current Site and iOS SHAs are recorded in the manifest. The Site image is source-current but configuration-incomplete (no approved map-style manifest); full four-image integration was not repeated. Overall remains `NOT_RELEASED` and `production_ready=false`.
