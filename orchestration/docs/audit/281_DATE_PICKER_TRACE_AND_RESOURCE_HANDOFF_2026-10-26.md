# Audit 281 — Date picker trace and resource-aware handoff

Date: 2026-10-26

## Date selection trace

- `MarshGO-Site/src/components/DepartureDateTimePicker.tsx` keeps a local date/time draft and commits it through `onChange(`${date}T${pad(hour)}:${pad(minute)}`)` when the user presses “Застосувати”.
- `MarshGO-Site/src/views/ProductionMarketplace.tsx` synchronizes that value into `journeyDeparture` and the date-only state. `searchJourney()` parses `journeyDeparture` with `kyivDateTimeInputToDate` and serializes `departureAt` for `productionApi.searchJourneys`.
- Source inspection does not show a broken date-to-request path. This is not browser acceptance: actual picker interaction and the request payload after submitting a search remain `NOT_TESTED`.
- “Інша дата” calls `showPicker()` on a visually hidden 1px date input, with `click()` fallback. Browser/platform behavior for that control has not been verified; only revisit if the user-facing issue persists.

## Antigravity and host capacity

- The narrow date trace completed read-only with no file changes.
- The Antigravity Agent panel now shows `Error: Agent process failed to restart after 5 consecutive crashes`; it is not currently executing a task. The workspace indicates 633 pending changes. No new task was queued and none of those changes were inspected or altered.
- `df -h /` reports 2.7 GiB available on a 460 GiB volume. No files, containers, or caches were deleted.
- Operating policy: do not overlap heavyweight tests/builds/replays; delegate only a small independent read-only task once Antigravity is healthy; explicitly click Send Now and verify `Working`. Do not create artificial keepalive work.

## Next step and release status

- Continue the isolated GTFS candidate-pool scheduling oracle/prototype described in audit 279. Preserve current serving behavior and caps until the small-feed correctness oracle passes.
- Production remains `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`.
