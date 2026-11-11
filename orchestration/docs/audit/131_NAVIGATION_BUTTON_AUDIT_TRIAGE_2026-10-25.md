# Navigation-screen control audit — 2026-10-25

## Exact candidate and method

- Site `9569bb4f174a4bdf912a6f490e69a359148db342`; Server `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- Node.js `v24.22.1`; isolated loopback `marshgo_e2e` database, test map/geocoder/OSRM, and Playwright browsers. No staging or production services were contacted.
- Ran `e2e/button-audit.spec.ts` with `E2E_BUTTON_AUDIT_ROUTE=/navigation` separately in Chromium, Firefox, and WebKit.

## Results

| Browser | Navigation controls clicked | Other button-audit scenarios | Result |
|---|---:|---:|---|
| Chromium | 5 | 3 | 4/4 PASS; no-effect 0, stale 0 |
| Firefox | 5 | 3 | 4/4 PASS; no-effect 0, stale 0 |
| WebKit | 7 | 3 | 4/4 PASS; no-effect 0, stale 0 |

The three accompanying scenarios verify empty-search and invalid-demand feedback, accessible home-banner switching, and canonical trips navigation. The navigation screen's buttons behaved as expected on each engine.

## Reconciliation with the longer sweep

The longer Firefox/WebKit sweep reported generic no-effect candidates, including a stale simulated GPS fix on navigation. The isolated navigation run passes on all three engines. This indicates the long-run fixture's simulated fix can age before the final route is exercised; it does not establish fresh-device or live GPS acceptance. The broader sweep remains PARTIAL because other no-effect observations still need explicit semantic classification.

The empty-query geocoder buttons are enabled intentionally: clicking them displays a localized minimum-three-character message. They are not dead controls. Invalid form submits remain blocked and do not create records.

## Limits

- These are local fixture browser checks for a specific signed-in route, not a complete app-wide semantic audit.
- Live GPS, provider data, physical Safari/iPhone, staging and production are NOT_TESTED.
- No application source or release manifest was modified by this check. `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`.
