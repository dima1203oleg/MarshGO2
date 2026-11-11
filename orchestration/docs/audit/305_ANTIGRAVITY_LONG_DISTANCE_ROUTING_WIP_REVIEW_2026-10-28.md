# Antigravity long-distance routing WIP review — 2026-10-28

## Scope and evidence
- Read-only inspection of tracked diff in `/Users/dima1203/Desktop/ag-work/server`, branch `antigravity/server-continuation-20261026`, HEAD `ccdc0b43e85fe9f925c61d8ef2d91aae266412be`.
- The worktree has 18 modified/untracked paths. All were preserved. `git diff --check` passed for tracked changes; no tests were run.
- This branch is based on `cb16fe8352c78917eaf6d89f675d6ae58461916f`, not the current PR #50 head `9dbbe42d0dd64fb6573142f5fedff2c8ba4910e7`.

## Review findings
- Transfer walking cap changes from 400 m to 800 m without a corresponding acceptance test or product-policy evidence.
- Cross-provider transfer eligibility is broadened based on transport mode (train/metro/intercity bus), even without a canonical merged stop or declared transfer. This can create false interchanges.
- Long-distance access/egress walking expands to 2.5 km; rail interchange radius expands from 150 m to 350 m; route anchor-cell size expands from 2.5 km to 18 km. These alter feasibility and candidate selection and need isolated, evidence-based tests.
- Search pruning adds local caps (`enqueuedCountByPattern` and `skipExcessLocal`); no test evidence was found in the tracked diff. Error details are also added to provider failures and should be checked for sensitive URL/token exposure before use.
- Fifteen scratch scripts are untracked; do not execute or delete them without inspection.

## Decision
Do not copy or integrate this dirty WIP into the current release branch. It has no verified test results, uses an older base, and changes transfer semantics in ways that can generate infeasible routes. Keep it intact; evaluate individual changes only with fixed-cap route witnesses and tests on a current isolated branch.
