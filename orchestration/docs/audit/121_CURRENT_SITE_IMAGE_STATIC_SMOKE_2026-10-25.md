# Current Site image build and static HTTP smoke — 2026-10-25

## Exact input and artifact

- Source: Site PR #23 exact SHA `44a5e4a4b7281d78b72554d7ddfad3ee1bbe9492` from the clean materialized checkout `.release/site-44a5e4a4b7281d78b72554d7ddfad3ee1bbe9492`.
- Build: `docker buildx build --platform linux/arm64 --load --tag marshgo/web:RC-2026-10-25-review.1 --build-arg VITE_MAP_STYLE_MANIFEST_URL= --file .release/site-44a5e4a4b7281d78b72554d7ddfad3ee1bbe9492/Dockerfile.marshgo .release/site-44a5e4a4b7281d78b72554d7ddfad3ee1bbe9492` — PASS.
- OCI image ID / digest: `sha256:7116784c116468f3458c4d339cf4e4af8efd0560b53cdb29afeb5eec0cacd1b5`, linux/arm64.
- Vite map style manifest build argument was explicitly empty because no approved production map manifest URL is configured. This image is useful for source/container verification only and must not be published or treated as the deployable web artifact.

## Static smoke

- Started the Site container in a temporary isolated Docker network with a sleeping DNS-only `api` alias. Nginx resolves its configured upstream at startup, so a standalone first launch without that alias exited; this was environment setup, not an HTTP assertion failure.
- PASS: `/healthz`, `/`, `/journeys/search`, `/profile`, and the three HTML-referenced JavaScript entry/runtime/icon assets all returned HTTP 200 with HTML/JavaScript content types.
- No API server was present; `/api/*`, authentication, proxy behavior, account flows, and real map assets were not tested here. The temporary smoke containers and network were removed; no volumes or persistent user data were attached.

## Release boundary

- This replaces the stale Site image digest in the manifest but does not re-run the four-image API/Admin/Partner integrated smoke on the current Site SHA.
- The current Site image tuple is marked partial. Rebuild with the approved immutable map manifest and repeat the integrated API/static-route/proxy smoke before treating the image tuple as deployable.
- `PRODUCTION_READY=false`; `RELEASE_STATUS=NOT_RELEASED`. No staging or production deployment occurred.
