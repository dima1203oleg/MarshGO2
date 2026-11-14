# Site full E2E and autumn DST proposal fix — 2026-10-25

## Candidate under test

- Site checkout: branch `codex/sync-journey-mobility-ui`, HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f` plus the pre-existing dirty working tree and this turn's local fix. Nothing was committed or pushed.
- Server fixture: exact manifest SHA `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- E2E bundle: built from the current dirty Site checkout with isolated MapLibre fixtures at `127.0.0.1:3306`.
- E2E database: new loopback-only database `marshgo_e2e_site_full2_20261025`; all server migrations through `055_provider_commercial_use_requires_license.sql` applied cleanly.
- No staging, external live providers, production service or physical device was used.

## Changes made in this turn

- The full two-account carpool/navigation scenario exposed a real autumn DST bug. When a server-provided demand's exact earliest UTC instant fell in the second occurrence of Kyiv's repeated local hour, formatting and reparsing a `datetime-local` value selected the earlier occurrence. The server correctly rejected the proposal as outside the demand window. The proposal form now preserves the server timestamp while the field remains untouched and falls back to normal Kyiv wall-time parsing after the user edits it.
- Existing dirty Site changes under test also provide accessible feedback dismissal, preserve the result of an automatic action transition, use canonical singular transport labels, hide the route preset while navigating, and expose rendezvous full-screen / “Я на місці” actions.

## Evidence

- Site: `npm run typecheck` PASS; `npm run lint` PASS; `npm test` 98/98 PASS; production Vite build PASS.
- Targeted full two-account scenario after the DST fix: 1/1 PASS in 52 seconds, including opt-in route match, booking request negotiation, persisted server booking, GPS deviation, reroute, and session restore.
- Full current-Site browser suite: 24/25 PASS in 5.4 minutes. The other 24 cases include all 169 enabled controls on the main tested pages (0 without an observed effect), responsive sign-in/search, passenger booking and chat, driver route matching/reroute, GPS denial/retry, route focus, transport catalogue, and rendezvous consent/revocation.
- The single failure is a visual screenshot comparison for the transport-map layers panel: 17,647 pixels, 6% of the image, differ from the currently tracked expected snapshot. The rendered panel was visually inspected; the mismatch is a real layout/content divergence (the expected image has grouped icon rows/card treatment while the current UI has a preset row and text-only flat rows). No snapshot was accepted automatically.

## Remaining action

Reconcile the production layers UI against the owner's layers mockup and canonical expected state, then re-run the screenshot comparison and the full Site suite. Continue role-specific Admin/Partner, provider, security, staging, load/recovery, backup/restore, rollback, iOS and physical-device gates. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.

## Addendum — layers panel and complete functional retest — 2026-10-25

The production transport-layers panel was updated toward the supplied reference: removed preset shortcuts, grouped the canonical transport categories and map/infrastructure display toggles, added category icons, and aligned the panel title and mobile row sizing. A follow-up semantic markup fix keeps the exact toggle label independently addressable from its explanatory availability caption.

Fresh verification on the current dirty Site tree:

- `npm run typecheck` PASS.
- `npm run lint` PASS.
- `npm test` PASS, 98/98.
- Production Vite build PASS; gzip budget check PASS (16 JS chunks, each <=350 KB gzip; largest maplibre chunk 285.81 KB and app chunk 261.25 KB).
- Focused canonical route/map/layers functional E2E PASS, 1/1.
- Full fixture functional E2E PASS, 25/25 in about 5.5 minutes. The control sweep observed effects for all 169 enabled controls, with no no-effect or stale controls. Visual comparison was explicitly skipped in this run.
- Screenshot comparison for the transport-map layers panel remains FAIL at about 5% pixel difference. The current expected screenshot has pre-existing local modifications, so it was not overwritten. Visual acceptance is still open.
- `git diff --check` PASS for the Site checkout.

The browser tests used loopback fixtures and a disposable local E2E database with the pinned Server SHA `134ed017828a020e1d5f696b3cb9ea95527bb093`; no staging, production, real provider, or physical iPhone was involved. Site branch/HEAD remain `codex/sync-journey-mobility-ui` / `6961afcf008e2c845c0fde68c687ce61fe744f2f` with a dirty working tree. No commit, push, manifest release transition, or deployment was made.

Next: review and resolve the remaining visual difference without accepting a snapshot blindly; then continue role-specific Admin/Partner and cross-repository acceptance, real-provider and staging gates, security/load/recovery, backup/restore/rollback, and iOS/device checks. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.

## Addendum — cross-browser run against the actual dirty Site candidate

- The root `npm run test:browser-compat` without an override materializes manifest Site SHA `9569bb4f174a4bdf912a6f490e69a359148db342`. Its route-focus assertion fails in Chromium, Firefox and WebKit because that pinned source still dims three non-selected route segments (`data-marshgo-dimmed-route-segment-count=3`, expected 0).
- The current Site working tree is newer by local uncommitted map-focus changes: `src/map/focusMode.ts` now returns only the selected segment, and its unit test asserts that contract. We rebuilt this current Site with isolated map-fixture assets and ran the full root browser-compat suite against that bundle (`E2E_ROUTE_MAP_ONLY=1`): **6/6 PASS**, including sign-in/home/search and route focus in Chromium, Firefox and WebKit.
- The focused route-map subset also passed **3/3** on the current Site bundle. The source checkout is still dirty, so this proves working-tree behavior but is not a deployable immutable release SHA. No commit, push, manifest edit, or deployment was made.
- This resolves the ambiguity: the functional bug remains in the manifest-pinned candidate; the local Site worktree contains the intended fix. Integration of that work into an exact reviewed SHA is still required. Visual snapshot acceptance remains separately open at about 5% diff for layers panel.
