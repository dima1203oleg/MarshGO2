# Admin and Partner candidate local checks — 2026-10-24

## Exact candidates

| Repository | Branch | SHA | Open PR |
|---|---|---|---|
| `MarshGO-Admin` | `codex/p0-admin` | `9dbf7db0a935498ac40c98b19bc36bce056d630d` | #1, `https://github.com/dima1203oleg/MarshGO-Admin/pull/1` |
| `MarshGO-Partner` | `codex/p0-partner` | `c639257a7f28aeda5b378a816038b01651146b83` | #1, `https://github.com/dima1203oleg/MarshGO-Partner/pull/1` |

## Local verification

- Admin: unit tests **2/2 PASS**, typecheck PASS, ESLint PASS, production build PASS.
- Partner: unit tests **3/3 PASS**, typecheck PASS, ESLint PASS, production build PASS.
- Source checkouts were clean before build; generated `dist` remains ignored build output.

## Coverage boundary

- Admin unit tests cover role presentation guard only (platform admin is recognized; partner role/frontend flags are not treated as platform authority).
- Partner unit tests cover onboarding/workspace gating for pending, inactive/rejected, and approved active membership.
- These tests do **not** prove authenticated real-API CRUD, server-enforced tenant isolation, provider operations, moderation, analytics, audit trails, or permissions against a deployed integrated service.
- No staging API, test credentials for actual roles, or integrated Admin/Partner deployment was exercised. Treat authenticated cross-tenant acceptance as **NOT_TESTED**, even though the standalone candidate builds cleanly.
