---
name: marshgo-resource-control
description: Protect the 8 GB MacBook Pro while coordinating local builds, tests, browsers, Docker, and Antigravity calls.
---

# MARSHGO Resource Control

- Check `memory_pressure`, swap trend, CPU/load, active heavy processes, and `df -h /` before heavyweight work; do not kill user processes or delete data.
- Owner-set canonical memory threshold (2026-11-09): **20% free memory**. Defer heavy local work below 20%; 20% or more clears only the memory-percentage gate, not the other safety checks.
- Allow one heavy local build/test/browser/Docker/GTFS process at a time; remote read-only review may be parallel if independent. Do not start another heavy task while Qoder, Docker/Virtualization, or another local build/test/browser/import is actively consuming resources.
- GREEN: memory free at least 25% and disk free at least 20 GB. YELLOW: memory free 20–24% or disk 8–19 GB; the 20% memory minimum is met, but run at most one bounded heavy task only if memory pressure is not elevated, swap is not worsening, and no competing heavy process is active. RED: memory free below 20% or disk below 8 GB; checkpoint and defer heavy local work.
- Record actual provider-reported model usage and duration. If quota telemetry is absent, label it unknown.
- Never create dummy tasks to keep an agent busy; prefer a useful scoped task or no dispatch.
