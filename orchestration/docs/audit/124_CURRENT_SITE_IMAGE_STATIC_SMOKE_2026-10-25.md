# Current Site candidate image and isolated static smoke — 2026-10-25

## Exact source and image

- Source: Site PR #23 exact SHA `9569bb4f174a4bdf912a6f490e69a359148db342`, materialized in `.release/site-9569bb4f174a4bdf912a6f490e69a359148db342`.
- Build: `docker buildx build --platform linux/arm64 --load --tag marshgo/web:RC-2026-10-25-review.6 --build-arg VITE_MAP_STYLE_MANIFEST_URL= --file .release/site-9569bb4f174a4bdf912a6f490e69a359148db342/Dockerfile.marshgo .release/site-9569bb4f174a4bdf912a6f490e69a359148db342` — PASS.
- OCI image digest / image ID: `sha256:150ce69d4787ef8ec99832b17627be604838c3bfe5f59b0e210f35ccfb7002bb`, `linux/arm64`.
- The map manifest URL was empty because no approved immutable HTTPS map-style manifest is configured. Do not publish or deploy this image.

## Static smoke

- A disposable Docker network and DNS-only `api` alias allowed Nginx startup; no API process or volumes were attached.
- PASS: `/healthz`, `/`, `/journeys/search`, `/profile` returned HTTP 200.
- PASS: five JS assets referenced by the production HTML each returned HTTP 200.
- Temporary containers and network were removed. A first smoke invocation hit zsh's read-only `status` variable name before assertions; those owned containers/network were explicitly stopped/removed and the complete smoke was rerun successfully with a non-reserved variable name.

## Boundary

This is exact-source local container/static acceptance only. It does not establish API/auth proxy, licensed map tiles, current four-image integrated smoke, staging, production, HTTPS/DNS, or authenticated journeys. Current image is not deployable. `PRODUCTION_READY=false`, `RELEASE_STATUS=NOT_RELEASED`; no production deployment occurred.
