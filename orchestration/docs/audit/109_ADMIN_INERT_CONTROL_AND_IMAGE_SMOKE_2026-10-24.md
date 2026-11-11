# Admin inactive control and exact image smoke — 2026-10-24

## Change

- Admin PR #1 branch `codex/p0-admin`, commit `13f4791d627badb1cfa89247a8a668b4429ecd14`.
- Removed the topbar “Сповіщення” button. Inspection found no notification handler in the Admin UI and no Admin notification API; leaving it clickable-looking was misleading.
- The change touched one line in `src/App.tsx`. No roles, API contracts, or business operations changed.

## Checks

- Unit tests: 2/2 PASS.
- TypeScript: PASS.
- ESLint: PASS.
- Production build: PASS.
- Hosted PR #1 Verify run `40125895481`: SUCCESS on exact commit; PR remains OPEN/MERGEABLE.
- Exact-source release materialization passed origin/SHA/cleanliness guards for Admin `13f4791…`.
- Local Docker image: `marshgo/admin:RC-2026-10-24-admin-13f4791`, linux/arm64, OCI manifest digest `sha256:bf07d63dafcd07577936908a75f949244249a495c61db65e084932ab508c22c4`.
- Temporary isolated HTTP smoke: root, `/partners`, `/integrations`, referenced JS bundle and `/healthz` all returned HTTP 200; local test containers/network were removed after the check. A DNS-only `api` alias let Nginx resolve its expected upstream. No API response or authenticated action was tested.

## Limits

- Admin test suite remains only 2 unit tests; this is not complete page/button or authenticated CRUD acceptance.
- No Admin/API integration, tenant isolation, live hosting, staging or production behavior is claimed. The separately built Admin image is not a full six-service release tuple.
- Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
