# Site transport color alignment — 2026-10-26

## Change

Compared the current production route-results screenshot with the supplied MARSHGO route mockups and the transport design registry. The mockups show tram in purple and private rideshare in pink. The shared registry previously used pink for tram and purple for rideshare, while the CSS map tokens had the old colors, so result cards, route overlays and map layers could disagree.

Updated the canonical registry and CSS tokens together:

- Tram: `#8B3CE6` (purple).
- Carpool/rideshare: `#E83E8C` (pink).
- Added a test that asserts every public transport CSS map token matches the canonical registry.

The changes are in Site commit `1a922010562f334fe77e79fd0a89181c2f2f9963` on `codex/sync-journey-mobility-ui`, pushed to [Site PR #3](https://github.com/dima1203oleg/MarshGO-Site/pull/3). Existing unrelated local Site changes were not staged or committed.

## Verification

- Site unit tests: **100/100 PASS**.
- Typecheck: PASS.
- ESLint: PASS.
- Production Vite build: PASS.
- Bundle budget: PASS, 16 JavaScript chunks each at or below 350 KB gzip.
- GitHub Site CI on the exact pushed PR head: both `verify` checks PASS (workflow runs `40303800436` and `40303808897`).
- Full Playwright/screenshot comparison was not rerun after this color-only change. Existing strict visual comparison still needs reference-by-reference acceptance; no screenshot baseline or threshold was changed.

## Release status

This improves color consistency but does not close all mockup visual acceptance or any staging/production gate. The PR is still open. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
