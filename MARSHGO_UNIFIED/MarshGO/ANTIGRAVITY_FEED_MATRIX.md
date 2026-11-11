# MARSHGO — PROVIDER FEED ACCEPTANCE MATRIX
**Status Date: 26.10.2026 | Antigravity Feed Audit**

| Provider / Agency | Transport Mode | City / Region | Static / Realtime | Auth Mechanism | Last Verified State | Production Status | Next Required Action |
|---|---|---|---|---|---|---|---|
| **Lviv Transport (EasyWay / Lviv City)** | Tram, Trolleybus, Bus | Lviv | GTFS Static + GTFS-RT | Open / Public URL | Static parsed; RT vehicle positions intermittent depending on time of day | `CONDITIONALLY_VERIFIED` | Validate live vehicle direction filtering and ETA calculation downstream of origin |
| **Kyiv Digital / Kyivpastrans** | Metro, Bus, Tram, Trolleybus | Kyiv | GTFS Static + API | Open / Public | Static feed mapped in regional catalog; schedule times aligned | `VERIFIED_STATIC` | Verify live GPS update frequency and line availability |
| **Ukrzaliznytsia (UZ)** | Intercity, Regional Trains | Ukraine National | Timetable / Schedule | Partner / Public Scraping | Rail corridor stops seeded across Ukraine regional catalog | `CATALOG_ONLY` | Keep booking as external link / provider redirect; mark ticket purchase as external |
| **Nextbike (Lviv / Kyiv)** | City Bicycle (Docked) | Lviv, Kyiv | GBFS | Public GBFS Feed | GBFS station status and free bike discovery verified | `VERIFIED` | Enforce station-dock return rule (no floating return outside zones) |
| **BikeNow** | Bike & E-bike | Kyiv | GBFS / API | Public GBFS Feed | Feed mapped in Ukraine regional catalog | `VERIFIED` | Validate operating zone boundaries |
| **Zelectra** | Electric Scooter | Lviv, Kyiv, Odesa | GBFS / Private API | Private API Key | Vehicle positions mapped; zone checks active | `CONDITIONALLY_VERIFIED` | Verify token rotation and commercial rate limit bounds |
| **Bolt Scooters** | Electric Scooter | Lviv, Kyiv, regional | GBFS / Commercial API | Partner Key | Schema mapped; dockless return constraints active | `DEMO_ONLY` / `PENDING_KEY` | Validate production API credentials |
| **Dott** | Electric Scooter | Kyiv, Dnipro | GBFS / Commercial API | Partner Key | Regional registry active | `DEMO_ONLY` / `PENDING_KEY` | Verify production feed contract |
| **INFOBUS** | Intercity Bus | Ukraine / EU | B2B Commercial API | Partner API Key | Adapter interface defined; ticket query mapped | `BLOCKED_EXTERNAL` | Production credentials required for real-time seat booking |
| **Kiwitaxi / Intui.travel** | Private Transfer | Regional Airports & Cities | Commercial API | Partner Key / Affiliate | Catalog adapter implemented (`KiwitaxiCatalogAdapter.ts`) | `DEMO_ONLY` | Needs active production affiliate key; separate search from booking |
| **Karhoo / Mozio / Splyt** | Taxi / Rideshare Aggregator | International / Ukraine | B2B API | Commercial Contract | Stubs and adapter interfaces defined | `BLOCKED_EXTERNAL` | Commercial contract required |
| **838 / Taxi Services** | On-demand Taxi | Ukraine National | Dispatch API | Partner Protocol | Dispatch adapter contract defined | `DEMO_ONLY` | Requires live dispatch dispatch contract |
| **Getmancar** | Carsharing | Kyiv, Dnipro | Fleet API | Commercial Partner | Regional fleet adapter mapped | `DEMO_ONLY` | Pending production fleet telemetry access |
| **MARSHGO Rideshare (Попутка)** | P2P Carpool | Ukraine National | In-house DB / WebSocket | JWT User Auth | 0% platform fee; consent-based GPS tracking; atomic booking | `PRODUCTION_CANDIDATE` | Full regression test of rendezvous & boarding confirmation |

---

## Strict Operating Rules for Feeds:
1. **Never Display Passed Vehicles**: A bus or marshrutka that has already passed the rider's boarding stop must never appear active on the user's route map.
2. **Never Fabricate ETAs**: If real-time feed telemetry is older than 90 seconds or missing, explicitly display scheduled timetable times instead of stale or invented ETA predictions.
3. **No Cross-Operator Returns**: A user on a Nextbike or Zelectra can only return the vehicle according to that specific operator's zone and docking rules.
4. **Transparent Status**: When an external commercial provider lacks production keys, mark as `BLOCKED_EXTERNAL` or `DEMO_ONLY`; do not disguise stubs as completed integrations.
