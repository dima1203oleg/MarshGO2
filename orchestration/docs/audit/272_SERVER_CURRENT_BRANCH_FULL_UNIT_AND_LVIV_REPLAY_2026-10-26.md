# Server current-source verification and frozen Lviv replay — 2026-10-26

## Source identity

- Repository: `MarshGO-Server`.
- Branch: `feature/transport-layer-availability`.
- Committed HEAD: `92a26a3f617f32d644a66c0af46cba096ccb0ce0`.
- Tracked working-diff SHA-256: `34c52a511003d11731960d5ba2661f339ca0f09e57261193dee0baba60d2710a`.
- The checkout also contains pre-existing untracked implementation and diagnostic files. They were preserved; the diff hash does not include them.
- Runtime: bundled Node `v24.22.1`; package pins Node `24.21.0`.

## Verification

- Focused GTFS timetable/realtime/calendar/fares/search-completeness tests: **62/62 PASS**.
- Full Server unit suite: **240 PASS / 0 FAIL / 1 opt-in integration SKIP**.
- `npm run typecheck`: **PASS**.
- `npm run lint`: **PASS**.
- `git diff --check`: **PASS**.
- No database integration is implied by the opt-in skip.

## Frozen-feed replay

The official frozen Lviv GTFS archive has SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164` and contains 72 routes, 1,071 stops and 15,716 trips. The three controlled O/D requests were each repeated three times serially on the current dirty source.

| O/D | Median search time | Unique trip chains / route chains | Stable result hash across repeats | Search state |
|---|---:|---:|---|---|
| Holosko → Sykhiv | 1,572.89 ms | 72 / 62 | `ab8378da9492541b4078fafefb613d45536b20ba77e040372383266a670003e9` | 100 returned; search and page truncated |
| Naukova → Sykhiv | 765.90 ms | 59 / 43 | `7f7c65d9e377edfb4713332208404c1163151184e6e54b381ead2f8d6fb4a877` | 100 returned; search and page truncated |
| Rynok → Dubliany | 1,484.60 ms | 63 / 45 | `a34f0f3c6f718158c01a5c8eece6a5a4f4a5b0bfd1f0997a8dc786983a5c9a6b` | 100 returned; search and page truncated |

Each repeated query preserved its FASTEST, CHEAPEST and BALANCED winner identity. This establishes deterministic bounded output for these cases, not completeness or globally optimal results. Peak RSS and cold-process performance were not measured in this replay.

## Disposition

The exact small-feed timetable, fare, transfer, calendar and three-strategy oracles pass. Dense city-feed search still drops candidates under existing stop/segment/search/candidate bounds. A temporary test hypothesis about skipping a faster transfer when a one-result page is full was exercised and disproved: the search explored both depths and selected the faster transfer; no test or production change from that hypothesis was retained.

Do not call dense-feed routing complete or release-ready. Next routing work must avoid repeating the rejected shared-frontier, baseline-seeded and lazy event-label prototypes; it needs a distinct bounded candidate-generation design with exhaustive small-feed identity/fare/strategy parity before another frozen-feed comparison. Keep `PRODUCTION_READY=false` and `RELEASE_STATUS=NOT_RELEASED`.
