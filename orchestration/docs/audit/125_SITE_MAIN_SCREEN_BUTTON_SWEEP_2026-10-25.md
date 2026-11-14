# Main-screen enabled-control sweep — 2026-10-25

## Exact sources

- Site PR #23: `9569bb4f174a4bdf912a6f490e69a359148db342`.
- Server PR #36: `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- Local run: `npm run test:e2e -- -g 'every button on every main screen responds without errors'`.

## Result

- **179** enabled, visible, same-origin controls clicked across 15 primary signed-in routes: `/journeys/search`, `/search`, `/trips`, `/trips/plan`, `/map`, `/profile`, `/offers/new`, `/demands/new`, `/demands`, `/demands/mine`, `/messages`, `/admin/verification`, `/navigate`, `/navigation`, `/`.
- **0** clicked controls without observed DOM, URL, state, or network change.
- **0** enumerated controls changed or disappeared before click.
- **0** page errors or unexpected HTTP 5xx responses.
- The audit now captures full page text, all visible control classes/ARIA state, form values, active focus, map state and request count. It asserts both no-effect and stale-control lists are empty. For Trips, it restores the Active tab between checks so the empty-state CTA is not incorrectly looked up while the Requests tab is selected.
- The strict audit passed again inside the complete 20-case E2E suite: full suite 20/20 in 4.9 minutes on the same exact source SHAs.
- The previous 17 no-effect log was a test measurement/context defect: fingerprinting omitted class changes and route resets retained selected trip tabs. The updated sweep passes with strict assertions.

## Coverage limits

- Disabled controls, destructive controls (logout/delete/cancel/finish/block/report), and external identity/documentation links are intentionally excluded from the click loop. They still require separate requirement-specific tests.
- The `/admin/verification` route was visited under a normal user and only exercises authorization denial/navigation; this is not authenticated Admin acceptance. Admin/Partner privileged workflows and tenant-isolation acceptance remain separate.
- This is a local fixture browser run, not live provider, staging, production, physical-device, or visual acceptance. No statement is made that all app pages and all possible conditional states are covered.
- Production remains `NOT_RELEASED`; `production_ready=false`.
