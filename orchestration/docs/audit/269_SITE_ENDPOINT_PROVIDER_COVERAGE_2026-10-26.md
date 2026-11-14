# Site endpoint provider coverage — 2026-10-26

## Scope and baseline

- Repository: `MarshGO-Site`, branch `codex/sync-journey-mobility-ui`, base `HEAD` `1a922010562f334fe77e79fd0a89181c2f2f9963`.
- The worktree already contained substantial uncommitted product changes. No unrelated files were reset, staged, or committed.
- Production `ProductionMarketplace` previously loaded `/mobility/providers` only for the origin coordinate. In a cross-city search that could omit providers that serve only the destination area.

## Change

- Provider discovery now queries both selected/geocoded endpoints, deduplicates equal coordinates, and merges provider groups by transport type and provider ID.
- If neither endpoint is selected, it retains the global provider discovery request.
- A failed request keeps discovery unknown (`null`) and does not falsely mark categories unavailable.
- Added a regression test for merging both endpoint responses without duplicate providers.

## Validation

- `npx tsx --test tests/transport-preferences.test.ts`: 12/12 PASS.
- `npm run typecheck`: PASS.
- `npm test`: 101/101 PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; production Vite bundle emitted successfully.
- Existing `git diff --check` reports a pre-existing trailing blank line at `tests/journey-route-map.test.ts:160`; this file was not changed in this step.

## Limits and next step

- No live browser, authenticated workflow, staging, production provider probe, or device acceptance is proven by these local checks.
- The Site worktree remains dirty and uncommitted; preserve its other in-progress changes.
- Next: resolve the local API readiness/database and Vite proxy mismatch in the central workspace, then run authenticated browser workflows and visual checks against the production entry point.
- `PRODUCTION_READY=false`; no deployment performed.
