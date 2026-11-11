# MARSHGO agent model routing

Last verified: 2026-10-26. This is an observed local catalog, not a quota report.

## Antigravity CLI models observed

| CLI model | Default use | Escalate when |
|---|---|---|
| `gemini-3.8-flash-medium` | Routine scoped review, tests, and small isolated fixes | A task remains ambiguous or fails after one clarified attempt |
| `gemini-4-argon-medium` | Architecture, difficult routing completeness, high-risk independent review | Use only when a high-impact question merits its separate quota |
| `claude-sonnet-5-5-medium` | Complex multi-file implementation after scope and tests are clear | Flash cannot handle the implementation safely |
| `claude-opus-5-5-medium` | Last-resort security, concurrency, or architecture escalation | Cheaper suitable models failed or impact is critical |
| `gpt-oss-120b-medium` | Optional auxiliary review | Never make the workflow depend on it |

`agy models` listed these model IDs on this Mac. The CLI did not expose remaining quotas; treat all model quota values as UNKNOWN. Use `agy --print --model=<id> --mode=plan --sandbox --output-format=json` for a bounded headless task. Do not use `--dangerously-skip-permissions`.

## Observed cost and operating policy

Two successful Flash calls returned provider usage of 20,840 and 57,296 total tokens and took about 38 and 59 seconds. These were not code changes. The large workspace context makes repeated small reviews expensive, so dispatch only independent tasks with concrete acceptance value, use one Antigravity call at a time, and do not run duplicate reviewers. The reported usage belongs to those calls only; it is not a quota balance.

## Codex subagents

Project defaults use `gpt-6-luna` at low reasoning and cap concurrent subagent threads at two. Prefer one read-heavy scout or reviewer. Give write tasks only after recording an isolated worktree, branch, and base SHA.

## Budget handoff — observed 2026-10-26

- Keep one model per task. Codex owns integration and final verification; Antigravity Gemini Flash Low/Medium handles a genuinely independent, bounded review or small task; Argon is reserved for high-impact routing/architecture questions; Sonnet for well-scoped complex implementation; Opus only after a cheaper suitable model fails or a critical-risk decision requires it; GPT-OSS is optional and must not be a dependency.
- Latest Antigravity Flash Low prompt-only review: 21,309 provider-reported tokens / 40.987 s. Remaining Antigravity quota is UNKNOWN. Previous large-workspace calls were substantially more expensive; avoid redundant workspace-wide calls.
- Codex account snapshot: primary 5-hour window 89% used, weekly window 39%; reset at 2026-10-26 23:57 UTC. This is a platform rate-limit meter, not a transferable token balance. At >80%, finish bounded verification, checkpoint, and avoid starting a heavy local job.
- The continuity heartbeat is ACTIVE hourly; it can resume only while the app/Mac are available and does not guarantee uninterrupted background execution. It cannot automatically switch to Antigravity based on a quota the CLI does not expose.
