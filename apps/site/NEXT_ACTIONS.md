
## 2026-11-12 follow-up

1. **Home routes fixed and visually verified on existing zrok/7777** at 398×728: all three popular route cards now fit above the tab bar. Focused tests: 31/31 pass.
2. **Multi-search live check blocked by address autocomplete:** `/api/v1/places/suggest?q=Львів` on the zrok API returns 503 `geocoder_unavailable`; health is 200. Restore the approved geocoder configuration/service, then test a real public Lviv–Kyiv search with several modes selected. Do not call the multimodal planner broken based on arbitrary map pins/zero candidates.
3. Keep all existing dirty edits and the current 7777/zrok processes intact; production remains `NOT_RELEASED` until the live planner and remaining release gates have evidence.
## 2026-11-13 RESUME BLOCK — feeds after route-details visual check

1. **Route details visual checkpoint completed:** authenticated existing zrok/7777 at 345×728 showed title, summary pills, stop list, paired CTAs, and global dock without overlap. “На карті” opened full-route overview at half detent without GPS and retained the dock; details were expanded afterward. Screenshot is captured in the browser session. This was not the iPhone 15 Pro Max 430×932 viewport and is not pixel-perfect proof.
2. Focused tests in this worktree: map-aware navigation + bottom-sheet density **22/22 passed**; scoped `git diff --check` passed. Active GPS Start and 390/430 responsive widths remain to verify.
3. Continue Ukraine feed discovery. Require legal status, freshness, valid geometry/schedules, and real route usability before enabling a source. Existing candidate caveats remain above; production remains `NOT_RELEASED`.
4. Preserve all Qoder/Codex dirty changes and canonical 7777/zrok processes.

## 2026-11-13 passive Qoder sheet checkpoint

1. Qoder is still active. Its current four-detent sheet, content-based resize measurement, gesture settling, and dock visibility rules were inspected read-only; no Qoder process, browser, port, or source file was touched.
2. Keep the prior 345×728 result as the only current visual proof. On Qoder handoff, verify all four detents, sheet height/scroll behavior, dock hide/show transitions, and Start/“На карті” actions on the existing zrok at iPhone 15 Pro Max viewport (430×932). Do not duplicate Qoder's work while it is active.
3. Maintain release status `NOT_RELEASED`; no new tests were run in this passive checkpoint.
