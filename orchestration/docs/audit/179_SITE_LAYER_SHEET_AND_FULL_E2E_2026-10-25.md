# Site mobile layer sheet and full browser acceptance — 2026-10-25

## Change

- The release candidate's mobile “Шари карти” sheet could grow to almost the full viewport and leave only a thin strip of map visible. The supplied layer-sheet mock keeps a substantial map area above the sheet.
- On the isolated Site worktree at base `7aed5344218058b024f5c269b36b03577d94026e`, capped the mobile sheet at `min(60dvh, available-height)` with a matching `max-h-[60svh]` fallback. The existing bottom safe-area offset and desktop popover sizing remain intact.
- Committed and pushed as `1b5986de5af875c5c2945df4752c23603c135ed3` on `codex/site-map-layers-fit-20261025`; draft [Site PR #26](https://github.com/dima1203oleg/MarshGO-Site/pull/26), stacked on Site PR #25. Exact-head hosted Site CI run `40192350958` completed successfully.
- The root E2E harness had stale assertions relative to the checked-in candidate behavior: focused routes dim the other `N−1` segments, layer group names are expandable buttons, and the existing infrastructure label is “Пункти оренди”. Updated only these test expectations in the already-dirty orchestration worktree; no app code was changed there.

## Verification

- Site PR #26 source, Node 24.21.0: typecheck PASS, lint PASS, unit tests **109/109 PASS**, production build PASS.
- Current root `npm run check:production`, Node 24.21.0: typecheck/lint/build/bundle PASS; unit tests **256 PASS / 0 FAIL / 1 opt-in integration SKIP**. The skip is not counted as a pass.
- Full Playwright browser suite, local fixtures, pinned API Server PR #40 SHA `38f17b88f98c8530f8090cfc6745cd334c87e53c` and Site PR #25 plus the exact #26 source change `1b5986d`: **25/25 PASS** in 4.9 minutes.
- Control sweep: **179 visible controls clicked, 0 without visible effect, 0 changed before click**.
- Route/map, layer scrolling and persistent navigation, all 12 transport categories, two-account search/booking/demand/chat, driver matching and GPS reroute, iPhone 15/16 viewport, GPS denial recovery, URL restore, truncated-search disclosure, and rendezvous consent/revocation scenarios passed.
- One `realtime.outbox_retry` fixture log entry appeared during the passing suite; it did not fail an assertion. Keep realtime delivery/retry observability in the broader release acceptance.

## Boundaries

- The full Playwright run disabled screenshot comparison. It proves the asserted layout and interactions against deterministic map/provider fixtures, not pixel approval for all ten supplied references.
- The larger map styles/satellite assets, live transit vehicles and rideshare movement in the mockups still lack production-licensed assets or authorized live sources. Full mockup parity remains `NOT_ACCEPTED`.
- This is not staging, production smoke, live-provider, physical iPhone/background GPS, security/load/recovery, backup/restore, rollback, or deployment evidence. PR #26 is not part of the release manifest; no PR was merged and no deployment occurred.
- Root orchestration CI run `40190716714` failed at “Configure read-only access to private Admin and Partner repositories”; all earlier checks in that run passed. Required Actions secret `MARSHGO_REPOS_READ_TOKEN` remains unavailable, so private-repository materialization and downstream hosted image/E2E gates were skipped.
- Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.

## Next

1. Preserve PR #26 as a draft until the stacked Site PR ancestry is reviewed and the release candidate is reconciled; do not update the manifest to include it yet.
2. Obtain the least-privilege Admin/Partner read token for root hosted CI; verify approved map/style entitlements and a real staging origin/configuration.
3. Continue the remaining role, provider, all-ten-reference visual, physical-device, security/performance/recovery and data-restore acceptance. Keep production rollout separately gated by owner approval.
