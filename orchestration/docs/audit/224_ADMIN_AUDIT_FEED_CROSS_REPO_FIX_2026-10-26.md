# Admin audit feed — cross-repository fix — 2026-10-26

## Finding

Authenticated browser acceptance revealed that successful partner onboarding and moderation were recorded in `audit_events`, but the Admin “Журнал аудиту” called `/admin/mobility/audit`, which only returned mobility-provider events. The UI also read `actor_id` although the endpoint returned `actor`, so the actor was not displayed. This left an important Admin action invisible to the operator.

## Implemented changes

- Server `GET /api/v1/admin/audit` now returns the latest 100 platform-relevant events for mobility providers, partner organizations, and explicit account-admin actions. It returns event ID/action/entity/time and actor display name, and deliberately omits arbitrary audit `details`.
- The route is protected by the existing `requireAuth` and `requireAdmin` guards.
- The portal integration test verifies non-admin denial, presence of the partner approval event and actor, and absence of the `details` property.
- Admin now calls `/admin/audit` and renders the returned actor.
- Admin E2E proved the approved organization appears in the journal with `partner.application.approved` and `Admin Browser QA`; the screenshot was reviewed at `/tmp/marshgo-admin-audit.png`.

## Exact source and PR state

- Server PR #43 head `24c70dc31d652ac6ba9fbc5fcd7abd138378b457`, based on Server PR #42 (`codex/gtfs-sorted-frontier-scan-20261025`). PR #43 contains only the audit endpoint and its regression assertions relative to that base.
- Admin PR #1 updated head `a008dbad8edc5d81d716a0913e10c325f739540b`.
- Previous exact PR checks for Server #42, Admin #1 at `f39c4b7`, and Partner #1 `97a3727` passed. New Server #43 and updated Admin #1 checks are pending as of this checkpoint.

## Verification

- Server Node 24.22.1 typecheck and ESLint: PASS.
- Server unit tests: 316 PASS, 0 FAIL, 3 opt-in integration skips.
- Full isolated Postgres/PostGIS/Redis integration workflow: PASS (30 checks: journey schema 2, live journey 1, booking/editing 21, partner platform 1, navigation 2, realtime 1, restart durability 1, Redis rate limit 1).
- Admin exact-source typecheck, ESLint, 4/4 unit tests, production build: PASS.
- Authenticated Admin/Partner local browser workflow, followed by the integrated audit-feed assertion: PASS; no JS errors observed.
- `git diff --check`: PASS before commit.

## Boundaries

PR #43 and Admin PR #1 are open, not merged or deployed. This local acceptance uses synthetic users and the isolated loopback DB `marshgo_e2e_codex_20261026`. It does not establish staging, live provider access, production deployment, or the full cross-repository release tuple. The release manifest stays unchanged, `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.

## Next action

Wait for checks on Server PR #43 and updated Admin PR #1. If green, reconcile the PR dependency DAG/manifest tuple without merging or deployment; continue routing completeness and remaining production gates.
