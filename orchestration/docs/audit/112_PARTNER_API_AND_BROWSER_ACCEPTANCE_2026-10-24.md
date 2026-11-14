# Partner API and browser acceptance — 2026-10-24

## Exact source

- Repository: `dima1203oleg/MarshGO-Partner`
- Branch: `codex/p0-partner`
- Commit: `97a3727cc395dea092af6e3e24d6822370c2bc63`
- Pull request: #1
- Hosted Verify run `40126462889`: **PASS**.

## Defect fixed

Browser acceptance found that the development OTP was displayed as the input value but not passed to `api.verifyOtp` unless the user edited the input. The submit handler now uses the editable code, falling back to the displayed development code. The fix is intentionally limited to the local development OTP path.

## Checks

- Partner unit tests: 3/3 PASS.
- TypeScript: PASS.
- ESLint: PASS.
- Production build: PASS.
- `git diff --check`: PASS.
- Exact candidate Server `134ed017828a020e1d5f696b3cb9ea95527bb093`: fresh disposable PostGIS database, all migrations from an empty schema PASS; opt-in `partner-platform.integration.test.ts` 1/1 PASS (onboarding, organization tenant isolation, role denial, secret redaction, moderation state transitions and suspended permissions).
- Exact Partner browser flow against that local Server: OTP sign-in, all four sections (overview, organization, integrations, settings), onboarding form submission, pending status, honest unavailable integration state, logout: PASS; no page errors. Screenshot: `/tmp/marshgo-partner-browser-rc.png`.
- Temporary PostGIS/Redis containers and local API process were removed after the run. Existing dev containers/volumes were not touched. The PostGIS image ran under x86_64 emulation on the ARM host.

## Limits

This is local development-mode API/browser acceptance. It does not verify production OTP/SMS delivery, deployed auth/session behavior, staging, provider credentials/contracts, external integrations or production deployment. Admin browser/API acceptance and complete product visual acceptance remain open. Release status stays `NOT_RELEASED`; `PRODUCTION_READY=false`.
