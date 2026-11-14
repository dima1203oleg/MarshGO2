# Antigravity rideshare lifecycle handoff and acceptance

Date: 2026-10-26 (Europe/Kyiv)

## Purpose and scope

The user approved using Google Antigravity as a parallel engineering hand for a clearly labeled, synthetic rideshare lifecycle simulator. The simulator is for exercising UX and state transitions before production integration. It must not impersonate a real booking, payment, driver, passenger, or GPS session.

## Antigravity work record

- Conversation: **Аналіз Веб-Інтерфейсу На Порту 3000**.
- The read-only handoff request was first queued; it was explicitly sent with **Send Now** and Antigravity returned a detailed report.
- A separate implementation task was then sent and confirmed out of the queue with **Send Now**. Antigravity replied that it would work only in `/Users/dima1203/Desktop/MarshGO/MarshGO-Site`, branch `codex/sync-journey-mobility-ui`, HEAD `4afa7b30fa240c4e83d61b89d914ff61273e9468`.
- The implementation plan was approved by the user. Antigravity was told to proceed without another confirmation, avoid its existing Review accept/reject controls, preserve dirty work, and not commit or push.
- `~/Desktop/ag-work` is explicitly excluded. Server checkout `/Users/dima1203/Desktop/MarshGO/MarshGO-Server` and production services are outside Antigravity's implementation scope.
- At the time of this checkpoint, implementation is in progress. No new implementation diff has yet been accepted or independently reviewed.

## Canonical simulator acceptance contract

The demo must provide a usable, deterministic end-to-end simulation:

1. Driver offer → passenger request → driver acceptance/confirmed demo booking.
2. Separate driver and passenger consent actions. Only mutual consent unlocks the simulated live meeting map.
3. Meeting view shows both synthetic positions, the agreed pickup point, each participant's distance and ETA to that point, and a clear location freshness/offline state.
4. Arrival → simulated PIN/QR boarding verification → in-trip progress → completion → rating/history.
5. Cancellation before completion, GPS denial with a usable landmark fallback, stale position, offline/reconnect, and rejected invalid transitions.
6. Controls must change state; all synthetic people, vehicle details, coordinates, status, and any PIN must be visibly labeled as demo data. Never send demo actions to the production API.
7. Match supplied visual references, support Light/Dark and mobile/desktop layouts, and test critical transitions and failure paths.

Production acceptance is separate. Simulator evidence cannot establish production booking, live GPS, payment, driver identity, or device-background behavior.

## Findings verified in the existing implementation

### Web/Site

- Running local web process: port 3000, PID 30962, CWD `/Users/dima1203/Desktop/MarshGO/MarshGO-Site`.
- Site branch/HEAD: `codex/sync-journey-mobility-ui` / `4afa7b30fa240c4e83d61b89d914ff61273e9468`.
- The Site already has `productionApi.subscribeRealtime`, including reconnect and dispatch of `rendezvous.*` events, and `ProductionMarketplace` refreshes a rendezvous session after such an event. It also polls bookings while the Trips page is visible. This is stronger than the earlier Antigravity report's claim that no live event path exists.
- Existing rendezvous map/tracking components and tests are present as untracked/dirty work. Do not equate their presence or unit tests with an accepted simulator or production release.
- Existing `RideshareLifecycleExperience.tsx` contains fixed demo trip/driver/vehicle/coordinate data. It is suitable only as a simulator source after explicit demo labeling and state/behavior review.

### Server/API

- Running API process: port 3002, PID 30417, CWD `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`.
- Server branch/HEAD: `feature/transport-layer-availability` / `92a26a3f617f32d644a66c0af46cba096ccb0ce0`.
- Existing API has authenticated booking rendezvous endpoints, per-participant revocable consent, ephemeral Redis coordinates with TTL, freshness validation, participant-authorized approach reads, and `rendezvous.location.updated` delivery through the realtime broadcast path.
- These server capabilities are independent from the synthetic demo task. No server files were modified in this turn.

## Verification performed in this turn

- A first run of `tests/api-bookings.integration.test.ts` against the normal local API on port 3002 failed at the test's environment-specific assertion that approaches must be `ROUTING_UNAVAILABLE`; that API has a working routing endpoint and returned `ROUTED`. No assertion was weakened.
- Re-ran the single rendezvous integration case against a temporary API on loopback port 3305, using the isolated local Postgres/Redis containers, test fixture mode, development-only test identity header, and routing disabled. Result: **1 passed, 0 failed** (`shares confirmed rendezvous locations ephemerally and requires both users to confirm arrival`).
- The temporary API process on 3305 was stopped after the test. Existing web/API processes (3000/3002) and the database/cache containers (5434/6380) were not stopped or reconfigured.
- This is a local isolated API integration test, not staging, production, a second physical device, or iPhone acceptance.

## Review and data-integrity rules

- Antigravity currently has a pending Review diff. It has not been accepted or rejected.
- Earlier Review summary included changes from both the canonical Site and `~/Desktop/ag-work/site`; that mixed proposal is not evidence of integration. Only inspect/accept canonical Site changes after exact diff/path verification.
- Preserve all pre-existing dirty files. Do not treat the current 35 modified / 15 untracked Site files or the 42 modified / 39 untracked Server files as Antigravity-authored without comparing exact diffs and timestamps.
- Do not claim production readiness from the simulator, local tests, or a successful build.

## Live browser validation and incomplete follow-up — 2026-10-26

- Antigravity wrote `src/domain/rideshareLifecycleMachine.ts`, `tests/rideshare-lifecycle-machine.test.ts`, `tests/rideshare-lifecycle-simulator.test.ts`, and `src/components/RideshareLifecycleSimulator.tsx`. It also added a separate simulator mount to `ProductionMarketplace.tsx`; the existing `RideshareLifecycleExperience` remains the booking Live HUD. Exact review is still pending and nothing has been accepted/rejected.
- The local URL `http://127.0.0.1:3000/?demo=simulator&guest=true` opens the new simulator. Browser-driven synthetic happy path passed: proposal → request → confirmed → GPS meeting → driver arrival → PIN → in transit → completed → rating/history. The page labels itself DEMO / synthetic; no real booking action was taken.
- Independent focused tests: **10/10 PASS** (`npx tsx --test tests/rideshare-lifecycle-machine.test.ts tests/rideshare-lifecycle-simulator.test.ts`). Independent Site `npm run typecheck`: PASS.
- Browser defects found and sent to Antigravity: (1) toggling Offline and then submitting the request replaces the whole app with its startup-failure page; the reducer throw escapes because it occurs inside a React state updater. Keep the simulator mounted and present an inline transition error, with a retry/reconnect browser test. (2) One GPS button grants consent for both roles; consent must be two distinct role actions and map access must wait for both.
- Visual browser review: the new responsive desktop simulator uses a synthetic schematic map rather than actual GPS data, which is correct for demo scope. It still needs verified viewport/map fitting and mobile review. The older `?demo=rideshare_live` Live HUD was observed fitting nearly all of Europe for a Lviv trip; this is a separate existing visual issue, not yet fixed or reaccepted.
- Antigravity reported `Agent process failed to restart after 5 consecutive crashes` while its Review was still working on map-fit files. Partial diff remains on disk; preserve it, do not accept/reject the mixed Review automatically, and independently inspect all paths before treating the work as integrated.

## Next actions

1. Let Antigravity complete the approved simulator implementation and report exact paths plus command output.
2. Independently inspect every changed path against the pre-existing dirty tree; reject demo-to-production API calls, hard-coded personal/location data, decorative controls, and state transitions not guarded by the state machine.
3. Re-run focused state-machine/component/E2E tests, typecheck, lint, and build in the canonical Site. Check the simulator visually against the supplied mockups.
4. Update this record with actual diff and verification evidence. Keep production gates and release status unchanged until separately proven.
