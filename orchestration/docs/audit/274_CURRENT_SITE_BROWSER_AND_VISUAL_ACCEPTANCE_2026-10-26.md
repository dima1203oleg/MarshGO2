# 274 — Current Site browser and visual acceptance (2026-10-26)

## Scope and preservation

- Root repository: `MarshGO`, branch `codex/production-finalization-20261014`, committed HEAD `affef61e4706b2b9ce95c3ab4c2f5e2c0607e1dd`.
- The shared working tree contains many pre-existing modified and untracked files, including screenshots and audit artifacts. They were preserved; no broad staging, reset, clean, or commit was performed.
- Browser/API test services and databases were isolated under the dedicated local E2E setup. No production deployment, production data, or existing Docker volumes were changed.

## Verified outcomes

| Area | Result | Evidence / limits |
|---|---|---|
| Production check | PASS | `npm run check:production`: typecheck, lint, unit tests, production build and bundle budget passed. Exact unit result: 256 passed, 0 failed, 1 opt-in DB integration test skipped. |
| Diff hygiene | PASS | `git diff --check` passed. |
| Main-route button audit | PASS | 4/4 Playwright audit tests passed. The main-route scan exercised 172 enabled buttons, tabs and links; zero enabled actions had no visible effect, zero stale controls, and zero browser page errors. Destructive actions and external destinations were intentionally not invoked. This does not prove every server-backed action works. |
| Route/map functional flow | PASS | `journey-route-map.spec.ts` passed in the functional Playwright configuration. It exercised route sheet sizes, segment focus, stop details, fixture-backed live bus/tram states, strategies, light/dark appearance, active navigation restoration and layer controls. |
| Pixel visual acceptance | FAIL / NOT ACCEPTED | Running the snapshot matcher with the regular Playwright config found 38,395 changed pixels (12%) in `journey-results-light.png`. The actual UI is coherent but differs from the stored screenshot in layout and content hierarchy. No snapshot was updated to hide this mismatch. |
| Manual geocoding | BLOCKED / NOT TESTED | The manually opened local app has no configured production geocoder/reverse geocoder. Unknown typed addresses do not resolve; fixture-backed E2E does not prove a live geocoder. |
| Production / staging / devices | NOT TESTED | No verified staging or deployed SHA, live provider acceptance, physical iPhone run, or production smoke is available from this check. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`. |

## Source changes present in the dirty working tree

- Aligned the shared bus/transfer/ferry/water highlight token to `#1687FF` and its unit expectation.
- Fixed dark surfaces for the journey segment card and horizontal segment-scroll cue, which had been overridden by a global surface rule.
- Updated stale route-map test expectations and selectors to reflect current source palette, Lviv provider metadata, and current Ukrainian labels.
- These edits are uncommitted and coexist with unrelated pre-existing changes. Do not commit or revert them as a group without first separating ownership and reviewing the full diff.

## Next actions

1. Review the actual `journey-results-light` screen against the user's provided design reference, not only the older repository screenshot. Decide which visible differences are genuine product defects and fix the source UI where required.
2. Re-run the pixel matcher after source changes; preserve the old baseline until an explicitly reviewed, approved new reference is available.
3. Repeat the same acceptance in dark mode and the remaining canonical navigation states. A passing route functional test is not a visual pass.
4. Configure and verify a permitted real geocoding provider, then repeat typed-address and map-pin search flows; keep provider calls out of fixtures-only claims.
5. Continue the independent integrated API, provider, staging, security, iOS, backup/restore, rollback, and release-manifest gates. No production deployment without the separate owner approval.

