# Exact release candidate cross-browser acceptance — 2026-10-25

## Exact inputs

- Orchestrator: current dirty checkout `codex/production-finalization-20261014` at `a75fc5fd94adf4aa067c481da23681df1c1fdaac`.
- Materialized Server: `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- Materialized Site: `9569bb4f174a4bdf912a6f490e69a359148db342`.
- Runtime: Node.js `v24.22.1` (within the repositories' declared Node 24 range).
- Test: `npm run test:browser-compat`, Playwright Chromium, Firefox and WebKit.
- Database: existing isolated loopback `marshgo_e2e` fixture database. No production or staging endpoint was configured or used.

## Result

- Production sign-in, home and search responsive checks: Chromium, Firefox, WebKit all PASS, each across 320, 390, 430, 768, 1280 and 1440 px.
- Canonical route map/sheet/stop details/segment focus/light-dark scenario: Chromium, Firefox, WebKit all PASS.
- Total: **6/6 browser cases PASS in 2.8 minutes**; no retries or failures were reported.
- The script rebuilt the exact materialized Site PWA before executing the browser cases. It did not modify the canonical Site working tree.
- Post-run process check found no browser-compat, Playwright, Vite fixture server or API test process left running. Existing local `marshgo-db-1` and `marshgo-redis-1` containers remain up and healthy; they were not stopped or modified.

## Boundaries

This is exact-source local fixture browser evidence. Map tiles, identity, journey data and providers are test/development fixtures. It does not establish licensed production map rendering, real provider/live transit behavior, staging/deployed HTTP behavior, authenticated Admin workflows, physical iPhone/Safari behavior, or production readiness. Release remains `NOT_RELEASED`; `production_ready=false`.
