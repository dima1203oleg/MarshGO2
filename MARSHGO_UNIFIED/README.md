# MARSHGO Unified Source Snapshot

This additive import gathers the six MARSHGO repositories under one directory while preserving the original MarshGO2 prototype at the repository root. It is a source snapshot, not a production release candidate.

- `MarshGO/`: release orchestration and shared documentation; legacy root `src/`, `server/`, and duplicate nested product checkouts are excluded.
- `MarshGO-Server/`, `MarshGO-Site/`, `MarshGO-iOS/`, `MarshGO-Admin/`, `MarshGO-Partner/`: product source snapshots.
- `integration/site-antigravity-overlay/`: concurrent Site worktree changes preserved separately; not applied because the map/sheet edits overlap and require reconciliation.
- `SOURCE_MANIFEST.json`: source branches, exact HEAD SHAs, dirty path counts, target base, and release status.

Excluded from this public snapshot: environment files and credentials, local caches/dependencies/build outputs, temporary probes, operational progress logs, and zrok/audit screenshot artifacts. No source worktree was modified. Release remains `NOT_RELEASED` until API compatibility, migrations, and the canonical test/release gates are verified.
