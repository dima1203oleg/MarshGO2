# Local working-tree browser E2E — 2026-10-26

## Candidate and method

- Site checkout: branch `codex/sync-journey-mobility-ui`, committed HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`, dirty tracked/untracked files preserved. Built `MarshGO-Site/dist` with Node `24.21.0` and the isolated fixture map manifest at `http://127.0.0.1:3306/maps/v1.0.0/manifest.json`.
- Server checkout: branch `feature/transport-layer-availability`, committed HEAD `92a26a3f617f32d644a66c0af46cba096ccb0ce0`, dirty tracked/untracked files preserved.
- Browser E2E used the root Playwright suite, local working-tree Server, local Site bundle, isolated `marshgo_e2e` loopback DB and fixture map/geocoder/OSRM services. No public provider or production endpoint was used.
- A first run against the exact pinned release tuple was stopped after repeated 180-second waits caused by the test suite expecting newer labels/classes than that release. This candidate run then completed all 25 tests.

## Result

**6 PASS / 19 FAIL**. The broad button audit passed: 179 controls clicked, 0 without visible effect, 0 stale controls. Individual feature assertions still fail; this is not an acceptance pass.

| Area | Evidence | Initial classification |
|---|---|---|
| Home/responsive | Tests expect `.home-v5-action-card`; current production renders `HomeHero` / `.home-action-grid`; quick-action buttons are present | Test/UI contract mismatch; supplied canonical home layout is not yet implemented by the production entrypoint |
| Trips labels | Tests expect `Заплановані`; production shows `Майбутні` | Copy/contract mismatch; no evidence of broken trip data |
| Search empty/form feedback | Empty-search and form sequence timed out while moving through route/trips/demand states; transient feedback dismissal passed separately | Needs focused trace to find the blocked transition; not accepted |
| Publish CTA | Click path did not produce the expected publish-choice dialog | Functional gap or UI flow mismatch; needs trace/source review |
| Search swap/date-time | Buttons/dialog/listbox labels expected by tests are absent; several flows waited 15–180s | Accessibility/interaction contract mismatch and possible functional gaps; trace/source review required |
| GPS navigation | Start-session request did not receive expected response; denied-GPS test also failed | Functional/API-flow gap; not accepted |
| Route map | Theme token differs by RGB values; selected segment's route-point count does not match the assertion | Visual token mismatch plus map state/telemetry mismatch; inspect actual rendered screen before deciding implementation fix |
| Marketplace/booking/chat | Two-account search/booking/demand/chat scenario failed; driver multi-rider/reroute flow failed at layer availability text | Functional/integration gaps or test contract mismatch; inspect per-test traces and persisted state |
| Realtime/rendezvous | Expected approach point-count attribute is missing; consent control not present in tested state | Live map telemetry/consent-state contract mismatch; not accepted |
| Provider mode catalog | All 12 canonical modes in order and disabled unroutable modes passed | Local fixture/UI evidence only |
| Welcome | Entry guides to phone sign-in without forcing location permission passed | Browser fixture evidence only |

## Scope limits

- Test-only fixture tiles mean no real-map visual comparison against the supplied mockups.
- No physical iPhone, staging, live provider entitlement, production smoke, load/security/recovery, backup/restore or rollback gate was exercised.
- The passing button audit detects visible/state/navigation/network effects, not semantic correctness of every destination or transaction.
- The canonical release manifest still pins older component commits; this dirty tuple is not immutable and is not deployable as a release artifact.

## Next steps

1. Inspect traces for the first failure in each shared flow and classify assertion drift versus product defect; shorten brittle waits to bounded actionable assertions.
2. Fix product behavior against the approved UX, beginning with production home hierarchy, search controls/date-time, navigation session start, route-map focus and rendezvous consent.
3. Rebuild the local candidate, rerun focused specs, then rerun the full suite and visual review in both themes against actual production components.
4. Keep `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`; reconcile and pin immutable component SHAs only after integration and required release gates.
