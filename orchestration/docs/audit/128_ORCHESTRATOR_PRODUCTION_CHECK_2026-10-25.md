# Orchestrator local production check — 2026-10-25

## Result

On the current dirty local MarshGO orchestration checkout, `npm run check:production` exited 0:

- TypeScript: PASS.
- ESLint: PASS.
- Unit tests: 256 PASS, 0 FAIL, 1 opt-in local integration test SKIP.
- Production bundle build: PASS.
- Bundle transfer budget: PASS; 51 JavaScript chunks each ≤350 KB gzip.
- `git diff --check` and both JSON release manifests: PASS; manifests are byte-identical.

The single opt-in test is covered only where a separately recorded isolated integration test matches its scope; this command's skip is not itself a PASS.

## Boundary

This validates the current dirty orchestration checkout, not a clean immutable source tuple or hosted release artifact. The full exact Site/Server browser suite is separately 20/20 PASS (audit 125). The four-image local smoke is separately documented in audit 126. No staging or production runtime was used. Current Site image remains non-deployable because the map style manifest is unset. Production remains `NOT_RELEASED`; `production_ready=false`.
