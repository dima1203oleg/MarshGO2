# Cross-browser control audit and semantic follow-up — 2026-10-25

## Exact inputs

- Site `9569bb4f174a4bdf912a6f490e69a359148db342`; Server `134ed017828a020e1d5f696b3cb9ea95527bb093`.
- Node.js `v24.22.1`; Playwright Firefox and WebKit projects; loopback `marshgo_e2e` DB and isolated fixture services.
- Primary enabled-control sweep covers 15 signed-in routes and enumerates 179 visible/enabled same-origin controls per browser.

## Primary sweep

| Browser | Clicked | Generic no-effect reports | Stale targets | Page errors / unexpected 5xx | Result |
|---|---:|---:|---:|---:|---|
| Chromium | 179 | 0 | 0 | 0 | PASS; see audit 125 |
| Firefox | 179 | 2 | 0 | 0 | PARTIAL: generic 100 ms DOM/URL/network heuristic flagged the demand CTA and publish CTA; semantic follow-up passed both. |
| WebKit | 179 | 14 | 0 | 0 | PARTIAL: includes already-selected tabs/banner, unchanged empty-form inputs/search, and a navigation retry whose test GPS fix was reported stale. Semantic follow-up passed both primary CTAs. |

Every listed target remained locatable until click. No unexpected runtime or server errors occurred. The generic audit clicks current-state/idempotent controls and does not prime all forms with valid values, so its no-effect list is a triage signal rather than proof each control is broken.

## Semantic follow-up

Added `e2e/conditional-cta.spec.ts` with explicit outcome assertions. Against the same exact materialized Site/Server pair, Firefox and WebKit passed **4/4**:

- “Створити заявку” on `/demands/mine` changes route to `/demands/new` and shows the request form.
- The home “Опублікувати поїздку” action changes route to `/trips/plan` and shows the role-choice screen (the current exact candidate does not open a modal for this action).

Root `npm run typecheck` and ESLint on the new spec pass. No application source or release manifest changed in this follow-up.

## Remaining coverage

- The raw 14 WebKit no-effect observations have not all been converted into semantic checks. The empty-input search/swap cases need primed values or an explicit validation-state expectation; already-active tabs are expected no-ops.
- Navigation start with the simulated WebKit location produced the existing stale-GPS message. A fresh-fix acceptance case is still needed; this result is not evidence of successful live GPS navigation.
- Destructive controls and authenticated Admin/Partner workflows are outside this sweep. Production providers, physical devices, staging and production remain untested.
- Evidence is local fixture browser testing, not production readiness. `NOT_RELEASED`; `production_ready=false`.
