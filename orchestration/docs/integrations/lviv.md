# Lviv Transport Integration Specification

## 1. Official Data Sources (Lvivavtodor & Lviv City Council)

Lviv is powered by high-frequency open feeds provided by Lvivavtodor and Lviv City Open Data:

### GTFS Static Schedule
- **Endpoint**: `https://track.ua-gis.com/gtfs/lviv/static.zip`
- **Catalog ID**: `mdb:ua-lviv-lvivavtodor-gtfs-2374`
- **License**: Open Data Portal of Lviv City (`opendata.city-adm.lviv.ua`)
- **Coverage**: Trams, trolleybuses, and municipal buses across the Lviv urban community.

### GTFS Realtime Telemetry
- **Vehicle Positions**: `https://track.ua-gis.com/gtfs/lviv/vehicle_position` (Protobuf encoded GTFS-RT feed polled every 15 seconds).
- **Trip Updates & Delays**: `https://track.ua-gis.com/gtfs/lviv/trip_updates`.

### Micromobility
- The previously listed `nextbike_lv` GBFS URL is **not verified as Lviv coverage**. A live read-only probe on 2026-10-19 returned 44 stations around 24.01–24.25°E, 56.90–57.02°N, outside Ukraine.
- Do not expose this feed as Lviv inventory or use it in a route. OSM bicycle-rental points remain static discovery data only; live stock, prices, and return rights are unknown.
- Re-enable a Lviv Nextbike provider only after locating the exact Lviv system URL and validating current coordinates, freshness, and operator terms.

## 2. Ingestion & Freshness Guarantees

1. **Protocol Security**: All endpoints connect via TLS/HTTPS.
2. **Freshness Assessment**:
   - Vehicles with timestamp older than 120 seconds are flagged as `STALE`.
   - If feed header timestamp is older than 5 minutes, real-time indicators drop back to scheduled timetable mode.
3. **Spatial Filtering**: Positions outside Lviv bounding box `[23.8, 49.7, 24.2, 50.0]` are rejected to eliminate GPS drift artifacts.
