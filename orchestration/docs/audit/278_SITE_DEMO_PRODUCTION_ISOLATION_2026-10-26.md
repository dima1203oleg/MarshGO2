# Site demo isolation from production — 2026-10-26

## Scope and source identity

- Repository: `MarshGO-Site`.
- Branch: `codex/sync-journey-mobility-ui`.
- HEAD before and after this checkpoint: `4afa7b30fa240c4e83d61b89d914ff61273e9468`.
- The Site tree was already dirty; this checkpoint preserves all unrelated work. No commit, push, deployment, account access, or production data was used.

## Finding and correction

- `main.tsx` is the real release entrypoint. It always mounted `ProductionMarketplace` and statically imported the synthetic rideshare simulator.
- `ProductionMarketplace` inferred a fake `guest-explorer` user from arbitrary URL parameters (`origin`, `demo`, `mode`, and `guest=true`) and exposed guest/test controls. This was not a valid server-authenticated guest session and could produce false UI state or unauthorized API errors.
- Removed URL-derived fake identity and guest booking special-case. Removed demo overlay from the production marketplace. Demo entry controls now appear only in Vite development with explicit `VITE_DEMO_MODE=true`.
- The simulator mounts in an isolated, dynamically imported entry only when both compile-time dev gates and one exact simulator alias are present. Arbitrary route parameters cannot bypass login.
- Production build confirmation: all emitted JavaScript assets were searched; simulator labels, synthetic Lviv copy, and simulator URL aliases are absent.

## Verification

- New demo-entry regression tests: 2/2 PASS.
- Simulator lifecycle regressions: 7/7 PASS.
- Full Site unit suite: 121/121 PASS.
- `NODE_ENV=production npm run typecheck`: PASS.
- `NODE_ENV=production npm run lint`: PASS.
- `NODE_ENV=production npm run build -- --mode production`: PASS. Main app chunk 728.50 kB raw; MapLibre chunk 1,062.56 kB raw. Existing large-chunk warning remains for MapLibre.
- The source dev server on port 3000 returned HTTP 200. This is only an HTTP smoke, not visual/interactive browser acceptance.
- Full `git diff --check` initially identified one extra blank line at EOF in the already-modified route-map test; trimmed the extraneous blank line. Re-run status is recorded in the next checkpoint.

## Remaining verification and disposition

- Antigravity completed a read-only source audit (no files changed). It confirmed independent passenger/driver GPS-consent actions and a both-consent gate; denial transitions to fixed-landmark fallback; offline failures are caught inline; the demo uses synthetic Lviv vectors; and the simulator/state machine import no API, fetch, Axios, or WebSocket client. Its audit exposed the previous production-page overlay/guest wiring; this checkpoint removes that integration and moves the demo to a development-only isolated entry.
- Antigravity's strongest suggested follow-ups are full browser E2E across all lifecycle stages, PIN entry with a mobile keyboard viewport, and testing actual browser `offline`/`online` events rather than only the simulator toggle.
- A separate local browser tab loaded `http://127.0.0.1:3000/?demo=simulator` and rendered the ordinary MARSHGO home with no simulator content. Root `.env` has `VITE_DEMO_MODE=false`. This confirms the closed demo path in the current local config; it does not prove session authentication by itself.
- Antigravity completed the bounded read-only browser smoke on both `/` and `/?demo=simulator`: both returned HTTP 200 and showed the same unauthenticated login/onboarding screen; `/api/v1/auth/me` returned HTTP 401. No simulator or navigation HUD rendered; no application runtime/render error was observed. The browser-driver download itself got HTTP 404 in the local sandbox, so this was not automated Playwright E2E. No forms, credentials, DB writes, staging, or production were used.
- The Antigravity task reported zero changed files. Its earlier source audit remains separate and predates this isolation change.
- This is local Site hardening, not a deployment. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.
