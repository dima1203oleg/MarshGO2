# Site PR #28 canonical transport colors — 2026-10-26

## Scope

The first reference-color fix was pushed to Site PR #3 against `main`, outside the current release candidate's stacked branch. Revalidated GitHub metadata shows the current Site candidate is PR #28, head `codex/site-working-snapshot-20261026`, based on PR #27. Ported the same visual correction to a clean local PR #28 checkout without modifying the extensively dirty shared Site checkout.

## Change

- Transport registry: carpool `#E83E8C`; tram remains `#8B3CE6`.
- CSS map tokens: `--mode-carpool: #E83E8C`, `--mode-tram: #8B3CE6`.
- Route-map presentation test expects the reference colors.
- Added `tests/transport-color-token-parity.test.ts` so all public CSS mode tokens remain aligned with the canonical registry.
- Commit `d6c9a957a5f767a491daed2ffb5e70bb8ed8b559` pushed fast-forward to [Site PR #28](https://github.com/dima1203oleg/MarshGO-Site/pull/28).

## Verification

- Node `v25.4.0` local test suite: **117/117 PASS**.
- Typecheck: PASS.
- ESLint: PASS.
- Production Vite build: PASS.
- Bundle transfer budget: PASS, all 16 JS chunks <=350 KB gzip.
- `git diff --check`: PASS.
- Hosted PR #28 verification runs `40305831219` and `40305837568` passed on the exact head `d6c9a957a5f767a491daed2ffb5e70bb8ed8b559`.
- No visual baseline was changed. Full reference-by-reference E2E and licensed map-asset acceptance remain open.

## Release boundary

PR #28 remains open and stacked on PR #27; this change is in the current candidate branch but is not merged or deployed. No Site/Server tuple was released. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
