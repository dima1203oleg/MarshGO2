# Full UI and cross-repository test checkpoint — 2026-10-25

## Tested candidate

- Site PR #24, branch `codex/site-place-search-guard-20261025`, exact head `0235406e4bddb812935870e02f0cb21d76e0bfcd`, base `9569bb4f174a4bdf912a6f490e69a359148db342`; exact tree `e94d6a12d957c1c906e9569e1d836f72c6ec24b4`.
- Server fixture SHA `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- The full 25-case E2E suite was run against the identical tracked Site tree on an isolated candidate worktree, then the two affected regression cases were rerun against PR #24's own bundle. The PR head has the same exact tree hash. No staging/production endpoint was contacted.

## Findings and fix

- The broad button sweep clicked **179 enabled controls** on the main passenger/driver routes: **0 no-effect**, **0 stale**, with no uncaught page errors or unexpected HTTP 5xx.
- Initial full E2E found that the global status dismiss button had no accessible name. A first fix cleared status on every tab render, which then hid a newly-created success message after blocking a chat participant.
- Final behavior labels the dismiss action `Закрити повідомлення`, makes it explicitly `type="button"`, and clears old feedback only when a user selects a global bottom tab. Action feedback created during a section transition remains visible.
- The full E2E suite then passed **25/25**. The fixed status-lifecycle scenario and the full two-account search/booking/negotiation/chat/block/export flow passed **2/2** again on the pushed PR worktree.
- Route-map visual snapshot comparison passed **1/1** with screenshot assertions enabled and no snapshot update. It validates the existing synthetic fixture states; it is not approval of all ten supplied mockups or licensed live map assets.

## Checks by repository

| Repository / exact local checkout | Result |
|---|---|
| Site PR #24 `0235406…` | Typecheck, ESLint, **105/105 unit tests**, production build, full 25-case E2E on identical tree, two targeted E2E cases on the exact PR worktree; hosted Site CI **2/2 PASS**. PR is open and mergeable, not merged. |
| Server `feature/transport-layer-availability`, `182c77ae4f78d576a287007d8e0864fb130f43f8` (dirty checkout preserved) | Typecheck/lint; **224 passed, 0 failed, 1 opt-in test skipped**; isolated Postgres/PostGIS/Redis integration suites **29/29 PASS** covering Journey schema, live Journey, booking/edit/cancel, navigation, cross-instance realtime, restart durability and rate limits. |
| Admin `codex/p0-admin`, `bc37198ca139408907aaefa0d97dc9b60a568300` | Typecheck, lint, **2/2 unit tests**, production build PASS. Authenticated Admin API/UI authorization acceptance remains NOT_TESTED. |
| Partner `codex/p0-partner`, `97a3727cc395dea092af6e3e24d6822370c2bc63` | Typecheck, lint, **3/3 unit tests**, production build PASS. This pass does not replace the previously recorded authenticated tenant-isolation checks. |
| iOS `codex/production-site-sync`, `4353cec3cacbaf662ceea047402f361024292b22` | Unsigned generic iOS Simulator Xcode build PASS. No interactive simulator or physical-device acceptance was performed in this checkpoint. |
| MarshGO orchestrator dirty checkout `5ccef68dfdd58ab7fc44327018eafbc0c0102c0e` | `npm run check:production` exited 0: typecheck, ESLint, unit suite, production build and 51-chunk gzip budget. One opt-in integration test was skipped by this command. |

## Design and release boundary

- The route-map snapshot test is green, but **all-ten-reference visual acceptance remains NOT_ACCEPTED**. The synthetic map fixture differs from the supplied satellite/landmark imagery; live vehicle and rideshare approach states, licensed map style and a complete reference-by-reference screen review remain open.
- Full primary-route button sweep and local fixture journeys do not cover every conditional/destructive action, authenticated Admin workflows, live provider credentials, production SMS, physical Safari/iPhone, or all 12 transport providers.
- `RELEASE_MANIFEST.json` was not changed to the PR SHA. No deployment was run. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
- Remaining external/acceptance gates: verified staging and deployed SHA; contracted/licensed live map and provider configuration; authenticated Admin test identity; physical iPhone and Apple signing/APNs for release; security/load/recovery, backup/restore and rollback evidence; owner approval for any rollout.

## Next actions

1. Continue review of open PR #24 and integrate only through its normal checks; do not change the release manifest before the compatible Site/Server tuple is selected.
2. Continue the distinct GTFS bounded-search investigation from audit 137; preserve baseline chain identities and strategy winners and do not promote the incomplete test-only prototype.
3. Complete mock-reference review and remaining semantic button/role coverage; then continue verified staging and release gates. Keep production `NOT_RELEASED` while any required gate is open.
