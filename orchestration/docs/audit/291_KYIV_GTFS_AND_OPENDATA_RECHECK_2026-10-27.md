# Kyiv transport source recheck — 2026-10-27

## Evidence

- The catalogued Kyivpastrans HTTPS mirror `https://jbb.ghsq.de/gtfs/ua-kyiv.gtfs.zip` returned HTTP 200. The in-memory archive was 1,214,651 bytes, SHA-256 `8a2911ca31b54d80c0bc401e68423c9f597d6a252b5ab1f9881e214da1140a00`.
- GTFS `feed_info` identifies publisher КП «Київпастранс», version `20261027`, validity `2026-10-27` through `2026-10-30`. Parsed counts: 1,492 stops, 161 routes (17 `route_type=0` tram, 43 `route_type=11` trolleybus, 101 `route_type=3` bus), 24,275 trips, and 104,134 stop-time rows. Stop coordinates fall within the Kyiv urban bounding box.
- This is a short-lived static schedule snapshot. It proves neither live vehicle positions nor schedule validity after 2026-10-30. It has no metro route type.
- The Kyiv open-data portal's three tested GeoJSON download links redirected to `gisserver-stage.kyivcity.gov.ua`. Bounded count-only probes to layers 1 (route taxi), 4 (metro stops), and 5 (metro geometry) received HTTP 403. They are not currently verified usable production sources; do not bypass access controls.
- Zelectra GBFS root answered HTTP 200 with JSON content type and 968-byte HEAD metadata. This HEAD probe alone does not verify vehicle availability, Ukraine-only coverage, return rules, or booking support.

## Assessment

| Capability | Result | Evidence boundary |
|---|---|---|
| Kyiv bus/tram/trolleybus timetable | PARTIAL | Static GTFS archive structure and counts verified; short validity window; no route search/replay against this exact archive in this check |
| Kyiv metro routing | NOT_TESTED | Separate city datasets are catalogued, but tested portal endpoints currently return 403; GTFS archive has no metro routes |
| Kyiv minibuses | BLOCKED | Catalogued geometry endpoint redirects to the 403 stage service; geometry would not prove schedule, vehicle availability, or booking even if accessible |
| Kyiv realtime | NOT_VERIFIED | The legacy GTFS-RT URL is insecure HTTP; no live GPS evidence established |
| Kyiv micromobility | NOT_TESTED | GBFS root HEAD only; no station/vehicle status or rental conditions validated |

No provider activation, code change, production request, or data write was made. Next step: obtain an HTTPS production endpoint or operator-supported access for Kyiv geometry/metro, then validate a bounded real-data corridor against the exact static GTFS version before changing provider runtime status.

