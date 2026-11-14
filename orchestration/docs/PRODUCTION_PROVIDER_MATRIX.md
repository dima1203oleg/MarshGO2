## 2026-11-09 17:47 EET — current Lviv bus/minibus distinction

- Read-only local development API `127.0.0.1:3002/api/v1/mobility/providers?lat=49.8397&lon=24.0297` returns the Lviv GTFS provider for `bus` and `tram`; `marshrutka` is an empty provider group. This runtime has no pinned build identity and is not release evidence.
- The previously imported Lviv GTFS report had 72 routes (64 bus, 8 tram) and no route identified as marshrutka. Treat those counts as the last local import report, not a fresh import in this checkpoint.
- The parser preserves the distinction: generic GTFS bus (`route_type=3`, including extended bus types) stays `bus`; an explicit route name/description containing “маршрутка” or “minibus” becomes `marshrutka`. Focused Server test passed 1/1 on dirty checkout SHA `e9934abbd8fc973177de8d7f47548739758a1b74`.
- Official Lviv open-data catalog entry: https://data.gov.ua/dataset/lviv-public-transport-gtfs-real-time . It describes the city's GTFS/GTFS-Realtime public transport set; no separate minibus-specific feed was verified. This does not establish that no private minibus operates in Lviv; it establishes that MARSHGO currently has no separately classifiable feed in the connected registry.

## 2026-11-09 01:27 EET — provider code tests are not live feed acceptance

The Server parser/coverage/health/license/rental unit batch passed 43/43 on dirty Server SHA `e9934abbd8fc973177de8d7f47548739758a1b74`. Direct API is not running, so the current provider registry and source freshness cannot be queried. No feed was activated; the 2026-11-08 18:56 UTC snapshot remains historical only. Keep every category `NOT_VERIFIED_END_TO_END` pending source→ingest→planner→API→Site evidence.

## 2026-11-09 01:19 EET — current runtime evidence boundary

Direct API endpoints (`/healthz`, `/readyz`, `/api/v1/version`, place suggestions, provider registry) on `127.0.0.1:3002` failed to connect; API proxy `:3019/readyz` and the approved HTTPS `/readyz` returned 502. Therefore the last DB/provider snapshot (2026-11-08 18:56 UTC) is historical and must not be presented as current health. No feed was activated or changed. All twelve categories remain `NOT_VERIFIED_END_TO_END`; see the category table below for specific missing live availability, legal, credential, and booking evidence.

## 2026-11-09 00:49 EET — mode status and current runtime limitation

The API is currently unavailable (`127.0.0.1:3002` connection refused; `:3019` and approved HTTPS readiness return 502), so the provider snapshot below is not current runtime health. Last DB snapshot was checked 2026-11-08 18:56 UTC and is registry evidence only. No new feed was connected or activated in this checkpoint.

| Category | Last evidenced capability | Current acceptance status / blocker |
|---|---|---|
| Попутка | Internal MARSHGO offer/search/booking code exists. | NOT_VERIFIED_END_TO_END while API is down; no external carpool feed. |
| Маршрутка | Contract/category exists; Kyiv GeoJSON gives route geometry only. | NOT_VERIFIED; explicit operator/classification plus stops/schedule are missing. |
| Автобус | GTFS timetable records in supported cities. | SCHEDULE_PARTIAL; current API, route completeness, live availability and booking not verified. |
| Таксі | Adapter contracts only. | BLOCKED on operator credentials, quote contract and permissions. |
| Трамвай | GTFS schedules in subsets including Lviv/Kyiv/Odesa in last snapshot. | SCHEDULE_PARTIAL; no complete live/ticket proof. |
| Тролейбус | GTFS schedules in subsets including Kyiv/Odesa in last snapshot. | SCHEDULE_PARTIAL; no complete live/ticket proof. |
| Метро | Local timetable/geometry code in limited regions; no enabled metro provider row in last DB snapshot. | NOT_VERIFIED for current route search; do not infer live train position from static line geometry. |
| Поїзд | UZ/rail GTFS timetable records in last snapshot. | SCHEDULE_PARTIAL; no live seat inventory, confirmed fare or ticket booking. |
| Велосипед | Static OSM rental points; no verified Ukrainian live inventory/return rules. | NOT_IN_JOURNEY_SEARCH; no bookable route proof. |
| Самокат | Last Zelectra GBFS snapshot degraded, with zero stations. | NOT_IN_JOURNEY_SEARCH; regional inventory, end-zone, fare and booking unverified. |
| Каршеринг | Catalog/adapter candidates only. | BLOCKED on operator fleet API, credentials, geofences and booking rights. |
| Трансфер | Kiwitaxi/Intui catalog adapters and links only. | CATALOG_ONLY; live quote, partner credentials and booking contract missing. |

All 12 categories remain `NOT_VERIFIED_END_TO_END`. Do not translate source presence, catalog records or UI icons into feed-connected status. Restore API and then verify only currently permitted sources from ingestion through planner and Site; credentials/agreements remain external blockers.

## 2026-11-08 22:34 UTC — source-review qualification for the unmerged 12-mode candidate

The candidate test `MarshGO-Server/tests/ukraine-12-transports-all-regions.test.ts` is catalog/fixture evidence: it checks category IDs and calls deterministic catalog/composer functions. It does not exercise real provider ingestion or UI. `composeUkraineMultimodalChains` is reachable from the route handler only behind `isStaticMultimodalFallbackEnabled()` (`NODE_ENV=test` + explicit opt-in), so its hand-authored sample itineraries do not prove production coverage. The raw regional catalog contains contract-only mode records with `available:true`; its DTO helper partially overrides this by disabling taxi/carsharing/transfer and limiting bike/scooter/metro. However, the separate `/api/v1/mobility/providers` handler in the same unmerged branch hard-codes taxi/carsharing/transfer as available, contradicting the fail-closed helper and the DB snapshot. Hold this branch until provider truth is unified and exact live route acceptance succeeds.

## 2026-11-08 22:27 UTC — current local provider registry snapshot (not API acceptance)

Read-only inspection of the local `marshgo-server-main-7774a81-db-1` registry at 2026-11-08 22:27 UTC found 88 rows, 13 enabled; enabled entries were last checked around 2026-11-08 18:56 UTC. The API itself was unavailable (`:3002` refused; proxy/approved HTTPS readiness returned 502), so this snapshot does not prove current client connectivity or route results.

- **Schedule-backed records:** 8 healthy GTFS entries cover bus; Lviv/Kyiv/Odesa include tram, Kyiv/Odesa include trolleybus; UZ includes train and suburban trips. These are schedule/source evidence, not live ticket inventory or complete multimodal route proof.
- **Realtime/JSON:** 3 GTFS-RT entries (2 healthy, 1 degraded), with Lviv reporting 424 vehicle entities (391 fresh, 33 stale) and 459 trip updates; Sheptytskyi reports one fresh vehicle. Dnipro JSON reports 305 bus positions but degraded health. No user-specific trip map-match was performed.
- **GBFS:** one degraded Zelectra scooter entry reports 742 vehicles and zero stations. This is not evidence of return-zone compatibility, bookable availability, fare, or a route.
- **Not present as active sources in this DB snapshot:** taxi, carsharing, live transfer, explicitly classified minibus, and metro provider rows. Bike remains static/estimate-only per the existing evidence; internal carpool is product code, not an external feed.
- The current unmerged Server feature branch hard-codes taxi, carsharing and transfer providers as `available:true` despite these missing integrations. Hold that branch until the claims are removed or actual operator APIs, agreements and tests are provided.

All twelve categories remain **NOT_VERIFIED end-to-end**. No source was downloaded, imported, written, or activated in this checkpoint.

## Read-only Lviv producer recheck — 2026-11-07 01:40 UTC

Local development DB source `mdb:ua-lviv-lvivavtodor-gtfs-2374` is open/enabled/healthy, last synced `2026-11-06T22:37:13Z`, with 1,071 stops, 72 routes, 15,141 trips, 406,422 stop-times (64 bus, 8 tram routes). Direct GTFS-RT VehiclePositions and TripUpdates probes to the producer each returned a valid 15-byte protobuf FeedMessage with a fresh header (ages 3 s and 17 s respectively), but zero entities. Treat this as a fresh empty overnight snapshot; do not claim live vehicles or delays and do not call the feed broken from one probe. The Web's schedule-only labeling is appropriate. See [official linked GTFS schedule feed and coverage](https://mobilitydatabase.org/feeds/gtfs/mdb-2374) and [data.gov.ua producer description/update cadence/license notice](https://data.gov.ua/dataset/lviv-public-transport-gtfs-real-time/resource/eb31a65b-a22b-44b1-83ce-41add24ae652). The official feed record lists active service through 2027-08-26; exact dataset reuse terms still require release review.

# MARSHGO production provider matrix

## 2026-11-07 16:10 EET — Lviv GTFS rights and validation gate

- Official portal recheck confirms the Lviv dataset is presented as open data reusable commercially with attribution; cite the source in product attribution: [dataset page](https://data.gov.ua/en/dataset/lviv-public-transport-gtfs-real-time). The feed resource metadata still shows its last update as 2025-01-09, while prior local imports report service dates extending to 2027-08-26. This metadata/content tension means a fresh archive and service-calendar check is still required before enabling a new runtime source.
- The local snapshot recorded at 2026-11-07 01:40 UTC had 1,071 stops, 72 routes, 15,141 trips and 406,422 stop-times, but it is not the active `:3002` API database. The latter had zero provider rows on the prior read-only check. Do not infer route availability from the snapshot or feed URL reachability.
- No new archive download, parse, database write or provider activation was performed at this checkpoint. Resource gate at 16:08 EET: 18 GiB free disk, 31% memory free, 8.7 GiB swap used. A fresh GTFS import/test is deferred until the resource gate is green and should use an isolated disposable DB.
- Capacity inventory: Xcode DerivedData 34 MiB; CoreSimulator cache 0 B; simulator device data 13 GiB with no booted simulator. `/Volumes/500` is not mounted (only Recovery is present). Simulator device data may contain app/user state, so it was preserved; no cache/data was deleted or moved. No Xcode build was active.
- A bounded HTTP `HEAD` probe to the official static-feed URL returned 200 `application/zip`, 3,568,789 bytes, `Last-Modified: 2026-11-02T08:06:59Z` (observed 2026-11-07 14:11:51 UTC). This verifies endpoint/archive metadata only, not archive contents or active service.
- Current evidence level: `VERIFIED_SCHEDULE` for the previously imported snapshot only; current app runtime `NOT_CONFIGURED`; live vehicles `NOT_VERIFIED`; dense-city search remains incomplete because historical frozen searches were truncated.

## 2026-11-07 16:13 EET — idle acceptance stack paused

The acceptance DB and Redis containers had no host-published ports; PostgreSQL reported zero other sessions, Redis client lists contained only the inspection connection, and no test/build/GTFS process was running. Stopped only `marshgo-acceptance-db-1`, `marshgo-acceptance-redis-1`, and `marshgo-acceptance-redis-cache-1` with `docker stop`; containers and volumes were preserved. Local API DB/Redis, server-main DB/Redis/cache, and Lviv/Kyiv walking routers remain running. Before: 18 GiB disk free, 31% free memory, swap 8.7 GiB. After: 18 GiB disk free, 28% free memory, swap 8.1 GiB. Memory gate remains YELLOW; no GTFS download/parse/import started.

Docker inventory found 468.8 MiB of builder cache, last used about 20 hours ago with cache usage references present; this is recent and not clearly disposable, so no prune was run. No safe 100 GB cleanup candidate was identified.

Останні додані live-перевірки: 23.10.2026. Історичні заміри нижче мають власні timestamps і не стають актуальними лише через оновлення цього заголовка. Наявність adapter/інтерфейсу не означає, що провайдер налаштований або погоджений для production.

## Read-only повторна перевірка українських транспортних фідів — 23.10.2026

`npm run acceptance:transport-feeds` перевірив 38 із 43 каталогових записів: 32 відповіли структурно, 4 degraded, 2 offline, 5 пропущені політикою. Це перевірка доступності/формату, не комерційного дозволу, надійності маршруту, ціни чи бронювання. Збережений [повний результат probe](audit/96_TRANSPORT_FEED_SMOKE_2026-10-23.json).

| Джерело | Зріз | Межі |
|---|---|---|
| Львів GTFS | 1,071 зупинка, 72 маршрути, 15,716 рейсів, 426,685 stop-times; service у найближчі 7 днів | Розклад підтверджено на момент probe; пошук по щільному фіду ще повертає `searchTruncated=true` |
| Львів GTFS-RT VehiclePositions | 625 позицій, вік header 3 с | Не всі позиції доведено зіставлені з напрямком/рейсом та показані клієнту; endpoint також окремо повернув 0 TripUpdates/Alerts |
| Львів GTFS-RT TripUpdates | 700 оновлень, header 12 с | Не є доказом правильного vehicle-to-trip map match чи результатом для конкретного користувача |
| Стрий GTFS / GTFS-RT | 295 зупинок/34 маршрути/1,061 рейс; 32 позиції віком 6 с | Формат і свіжість одного probe; потрібна географічна/рейсова відповідність і приймання у продукті |
| Ужгород GTFS / GTFS-RT | 217 зупинок/18 маршрутів/2,376 рейсів; 66 позицій віком 16 с | Формат і свіжість одного probe; не доводить доступність усіх ліній в UI |
| Івано-Франківськ GTFS / GTFS-RT | 291 зупинка/21 маршрут/2,113 рейсів; 58 позицій віком 5 с | Одна позиція може бути не окремим транспортним засобом/рейсом без дедуплікації та map-match |
| Київ GTFS | 1,496 зупинок, 162 маршрути, 24,259 рейсів | Наступні 7 днів активного service на цьому probe; це timetable, не live/квитковий інвентар |
| Рівне GTFS-RT, Трускавець GTFS-RT | Структурна відповідь без vehicles, TripUpdates та Alerts | `DEGRADED`; не малювати порожній фід як live транспорт |
| Дніпро iCity JSON | 95 валідних і 387 невалідних координат | `DEGRADED`; відкинути точки, що не проходять координатну/міську валідацію |
| Конотоп EasyWay JSON | 0 записів | `DEGRADED`; наявність URL не означає наявність транспорту |
| inbus.ua, Чорноморськ GTFS | Архів валідний, але немає активного service протягом наступних 7 днів | `OFFLINE` для поточного планування; не виводити в пошуку як доступний рейс |
| CityBikes/Nextbike/Zelectra | CityBikes: 815 мереж, жодної підтвердженої української; окремі city URL мають неправильне місто/404; Zelectra payload включає інші країни | Не активувати як українську оренду без перевірки міста, покриття, тарифу, availability і правил бронювання |

Окремий read-only replay Львівських маршрутів на цьому ж feed у 06:13 UTC 23.10.2026 перевірив 2 OD × 3 значення `maximumTransfers` (0/1/2). Усі шість пошуків досягли ліміту 10 повернених альтернатив і заявили `searchTruncated=true`; при 1–2 пересадках також `candidateGraphTruncated=true`. [Збережені відповіді](audit/97_LVIV_GTFS_DEPTH_PROBE_2026-10-23.jsonl) містять лише обмежену вибірку маршрутів, не є performance SLA чи доказом повного міського покриття. Висновок: live фіди частково дають дані, та продуктова інтеграція/придатність не підтверджена автоматично.

| Домен | Поточна основа | Production стан | Що закрити перед запуском |
|---|---|---|---|
| SMS / OTP | Production config requires `SMS_PROVIDER=twilio` plus `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` (`MarshGO-Server/server/config.ts`). Unverified GetOtp now fails closed; focused test proves it makes no outbound request. | BLOCKED_EXTERNAL · API and local PostGIS/Redis are down; Twilio sender/credentials absent | Configure approved Twilio secrets in the authorized runtime and verify real OTP delivery and rate limits. GetOtp stays unavailable until its official contract is verified and implemented. |
| Geocoding | Server-side Nominatim-compatible adapter і Places API; тестові та live probe існують | BLOCKED_EXTERNAL · production endpoint не затверджений | Контракт або власний сервіс, географія, quotas, attribution/privacy та fail-closed |
| Road routing | OSRM-compatible Server adapter, route validation, reroute contracts | BLOCKED_EXTERNAL · production URL/service не налаштований | Self-hosted або contracted OSRM/Valhalla, profile, capacity/SLO, timeout/error checks |
| Vector map tiles/styles | MapLibre, PMTiles support, versioned style manifest та attribution contract | BLOCKED_EXTERNAL · production MARSHGO manifest/CDN не налаштований | Контракт або self-host, 4 versioned day/night styles, immutable URLs, cache/offline rights, attribution |
| Satellite imagery | UI може читати окремий provider URL і attribution | UNAVAILABLE unless configured | Підключати лише з погодженими правами, coverage, cache і attribution |
| PostgreSQL/PostGIS | Міграції та локальний Compose; інтеграційні тести | PARTIAL · local foundation не є production DB | Managed private DB, TLS, backups, restore drill, migration rollout/rollback plan |
| Redis | Pub/Sub, socket ticket GETDEL, shared rate-limit contracts, cluster tests | PARTIAL · production managed instance/alerting не прийняті | Managed Redis, HA/persistence policy, outage/recovery drill, queue/socket health alerts |
| S3-compatible object storage | Приватний signed upload/download adapter для vehicle documents/photos | BLOCKED_EXTERNAL · bucket/credentials не налаштовані | Private bucket, encryption, lifecycle/retention, CORS, malware review, IAM least privilege |
| GTFS static | Server parser/planner/provider registry; живий probe 2026-10-21: 1,071 stops, 72 routes, 15,716 trips у `Europe/Kyiv`; кодовий маршрутний пошук повертає результат, але bounded graph/search може бути обрізаним і не гарантує глобального оптимуму. Data.gov.ua вказує CC BY і дозволяє комерційне повторне використання з обов’язковою атрибуцією, але сторінка ресурсу має застарілу дату і суперечить текстовому опису оновлення 1–2 рази на тиждень. | PARTIAL · одна отримана версія фіда не доводить розкладної SLA, чинності кожного тарифу чи staging/production; UI має лишити невідомі тарифи невідомими | Фіксувати feed hash/дату при кожному ingest, перевіряти календарі/винятки й свіжість; показувати атрибуцію; закрити routing truncation і OD/time acceptance з SLO |
| GTFS-Realtime | Server parser застосовує freshness 90s до feed та окремого TripUpdate. Read-only probe 2026-10-21T16:07Z: 614 VehiclePositions (580 ≤90s), 775 TripUpdates (header 16s); 574 свіжі VehiclePositions точно співпали з static route/trip. При цьому всі 614 raw positions не містили `currentStopSequence` або `stopId`. Виправлено protobuf presence у Server PR #23 SHA `b702fc1738e5d6e49e9114aef95f6c79a667aff3`; UI Site PR #14 SHA `cb854ba6c46094e412fe6b89ba54b42c3d873f02` тримає невідомий progress muted через MapLibre `setOpacity`. | PARTIAL · source повертає свіжі координати, але не дає точного прогресу до зупинки; single probe не доводить SLA, staging або production; candidate CI PASS, але обидва PR OPEN | Контролювати freshness; не вигадувати stop progress/ETA; підтвердити behavior з API/вебом на staging і дізнатися в оператора, чи може VehiclePositions включати stop sequence/stop ID |
| Zelectra / GBFS v3 | Server auto-discovery, vehicle/status/geofence parsing і nearby assets | `DEGRADED · READ_ONLY_PROBE 2026-10-19`: discovery відповів; 848 vehicle records із валідними координатами, 0 станцій; свіжість 0s. Bounding box включав Київ і Ліму (-77.11, -12.05), тому джерело змішане й не є самодостатнім proof of Ukraine coverage. Не доводить rental availability, ціну чи booking | Фільтрувати кожну точку за дозволеним регіоном до відповіді; не трактувати live vehicles як rental offer; підтвердити pickup/dropoff, права використання та deeplink; не маршрутизувати в planner до наявності цих правил |
| Nextbike `nextbike_lv` / `nextbike_vin` | Раніше каталогізовані feed URLs для Львова та Вінниці | `UNVERIFIED · READ_ONLY_PROBE 2026-10-19`: `nextbike_lv` відповів 44 станціями, bbox 24.01–24.25°E і 56.90–57.02°N — поза Україною; `nextbike_vin` повернув HTTP 404. Обидва записи прибрано як підтверджене міське покриття, адаптер більше не має неправильного default URL | Знайти окрему чинну мережу/URL, перевірити координати, свіжість та умови оператора; до того не показувати як Lviv/Vinnytsia live inventory |
| Велопрокати з OSM/Geofabrik | Повний `ukraine-latest.osm.pbf` importer, provider resolver, просторовий dedupe та звіт/CSV/GeoJSON | `ACTIVE_STATIC` · 317 об’єктів зі snapshot 2026-10-12: 66 Nextbike, 9 BikeNow, 6 Veliki, 236 без провайдера. Live inventory, pickup і dropoff rights: 0 | Підтвердити кожного оператора/мережу й правила повернення. Статичні точки не маршрутизуються як наявні велосипеди |
| CityBikes | Public JSON API каталогу мереж і станцій; attribution вимагає помітного посилання на CityBikes/PyBikes | `CANDIDATE · READ_ONLY_PROBE 2026-10-19`: API повернув 815 мереж, жодна не мала `country=UA` чи міста України; українське покриття не підтверджене | Не додавати як джерело українських точок. Повторити перевірку перед запуском або використовувати лише для міст, де знайдено мережу та перевірено умови |
| MobilityDatabase / GBFS Registry | Каталог посилань на GTFS, GTFS-RT і GBFS фіди; не є самим транспортним оператором | `DISCOVERY_ONLY` · публічний каталог доступний; FAQ вимагає обліковий запис для API. Запис каталогу не підтверджує доступність endpoint, свіжість, ліцензію чи реальне покриття | Для кожного фіда перевіряти URL, формат, місто, ліцензію, freshness і capability окремо; додати автоматичний import лише після API access та перевірки поточного каталогу |
| CarpoolWorld | [Developer REST API](https://www.carpoolworld.com/developers.html) потребує developer account; їхній [Quick Search RSS](https://www.carpoolworld.com/documentation/quick_search_rss.html) описаний як доступний без developer account | `RSS_DOCUMENTED · NOT_VERIFIED_LIVE`: на 2026-10-19 запит Київ → Львів із радіусом 30 км повернув HTTP 200, але `text/html` замість RSS/XML; офіційний тестовий Jersey City → New York приклад теж повернув HTML. Жодної української пропозиції не підтверджено | Повторити перевірку endpoint/формату з їхньою підтримкою; лише після отримання валідного RSS/XML перевірити актуальні поїздки в різних областях, умови показу, PII/consent і посилання/бронювання |
| Fluctuo Bridge | Комерційний агрегований API спільної мобільності для велосипедів, самокатів, мопедів та авто | `AWAITING_COMMERCIAL_ACCESS` · документація описує автентифікований Bridge API; наявність українських операторів не підтверджена | Запросити перелік підтримуваних міст/операторів України, ціну, SLA, ліцензію, freshness і booking capabilities; не вмикати без договору |
| Kiwitaxi | Server-side allowlisted TSV streaming client, parser with `\\N`/locale fields, official deep-link builder with `pap`, fixture tests; read-only live catalog probe on 2026-10-19 returned 7 domains, 35 currencies, 224 countries, 1,461 regions, 5 place types, 32,132 places, 151,785 routes, 14 vehicle classes, 811,710 transfer records (`payment_type=partial`) | PARTIAL · shared documented read-only token works, but unique partner credentials and affiliate ID are not configured; no verified quotes, coordinate matching, booking or attribution | Confirm use rights/current partner credentials and affiliate ID via secret manager; persist the verified catalog atomically; validate polygon/coordinate mapping and quote freshness before exposing journey offers |
| Intui.travel | Partner adapter contract prepared | `AWAITING_CREDENTIALS` / `AWAITING_AGREEMENT` · API Light credentials відсутні; API Wide вимагає окремого договору й актуальної документації | Надати partner access та умови; активувати тільки реально підтримані quotes/booking |
| Web Push / APNs | Realtime WebSocket delivery існує; persistent push delivery не завершений | MISSING | VAPID/APNs, consent, token lifecycle, deep links, delivery/revocation tests |
| Online payments | Community flow freezes 0% fee snapshot; commercial settlement disabled | DISABLED_BY_DESIGN | Не вмикати без processor, contract, currency/fees, refunds, reconciliation та owner approval |
| Monitoring / error reporting | Health/readiness і outbox metrics endpoints є | PARTIAL · зовнішній alerting/error service не налаштований | Frontend/backend errors, request IDs, provider latency/freshness, DB/Redis, SLO alerts, runbooks |
| iOS native delivery | Shared Site UI, Capacitor, simulator CI/build | PARTIAL | Production API origin, signed build, privacy strings, physical iPhone, GPS lifecycle, APNs/deep links |

## Фактичний стан 12 канонічних категорій (код і live-перевірки 19.10.2026)

Це статуси інтеграції в поточному пошуку, а не перелік потенційних джерел. Партнерські каталоги й назви в регіональному довіднику самі по собі не означають робочий провайдер.

| Категорія | Що реально працює зараз | Межа / статус |
|---|---|---|
| Попутка | Власні опубліковані пропозиції MARSHGO шукаються в API; наявні offer/booking та GPS-модулі | Працює на внутрішніх даних; зовнішні CarpoolWorld/Mobicoop/BlaBlaCar не підключені |
| Маршрутка | Є окремий тип у контрактах; окремі джерела можуть дати маршрутні лінії | Лише за явною класифікацією джерела; звичайний GTFS bus не доводить, що це маршрутка. Київський GeoJSON не дає сам собою часу/рейсу для пошуку |
| Автобус | Planner приймає прямі розклади з активних здорових GTFS фідів | PARTIAL: нема universal global-optimal search, гарантії місця, актуального тарифу чи квитка |
| Таксі | Є адаптерні інтерфейси для Uber/Uklon/Bolt із fail-closed поведінкою | BLOCKED: робочі quote/dispatch credentials і партнерський контракт відсутні; не генерувати фіктивні тарифи |
| Трамвай | GTFS planner може видати прямий рейс там, де feed містить відповідний route type | PARTIAL: залежить від міського фіда; без ticket/booking inventory |
| Тролейбус | GTFS planner може видати прямий рейс там, де feed містить відповідний route type | PARTIAL: залежить від міського фіда; без ticket/booking inventory |
| Метро | Пошук використовує підтверджені GTFS/міські джерела там, де вони підключені; маршрутні дані Києва перевірялись локально окремо | PARTIAL: немає повного live ETA/квиткового API; геометрія або граф не означають live-поїзд |
| Поїзд | GTFS timetable дає графікові відрізки/зупинки для доступних фідів | PARTIAL: ціна, наявність місць, випуск/скасування квитка УЗ не підключені |
| Велосипед | Є статичні OSM rental points і GBFS nearby inventory framework | NOT IN JOURNEY SEARCH: немає підтвердженого українського live BikeNow/Nextbike повернення. CityBikes probe: 815 мереж, 0 з України; Nextbike міські URL перевірку не пройшли |
| Самокат | GBFS assets можуть відображатися як найближчі об’єкти; Zelectra feed доступний | NOT IN JOURNEY SEARCH: mixed-country payload; немає підтверджених booking/price/end-zone правил для маршруту |
| Каршеринг | Категорія й provider candidates є в каталозі | BLOCKED: Getmancar/інші fleet API та договірні доступи не налаштовані; активного інвентарю/бронювання немає |
| Трансфер | KiwiTaxi TSV catalog adapter і партнерське посилання як технічна основа | PARTIAL CATALOG ONLY: route/transfer записи не є live quote чи наявністю; affiliate ID і booking API доступ відсутні. Intui теж чекає доступу |

Пішки залишається автоматичним сполучним відрізком, а не додатковою категорією. Невідомі ціна, availability, геометрія чи квиток не перетворюються на нуль або на підтверджену пропозицію.

## Повторні live-smoke перевірки відкритих GTFS і міських GeoJSON — 19.10.2026

Це read-only перевірки доступності й структури наборів. Вони не завантажують фіди в production, не означають партнерське право перепродажу квитків і не вмикають непідтверджені маршрути в пошуку.

| Джерело | Результат перевірки | Межі доказу |
|---|---|---|
| [Львівавтодор GTFS](https://track.ua-gis.com/gtfs/lviv/static.zip) | HTTP/архів валідні; 1,071 зупинка, 72 маршрути, 15,716 рейсів, 426,685 stop-times; 55 автобусних, 8 трамвайних і 9 тролейбусних маршрутів; є активний сервіс у наступні 7 днів | Підтверджує розклад/географію фіда. Не підтверджує ціну квитка, продаж або live-позицію зараз |
| Поточний Server validator, 2026-11-07, той самий [Львівавтодор GTFS](https://track.ua-gis.com/gtfs/lviv/static.zip) | Healthy; 1,071 зупинка, 72 маршрути, 15,141 рейс, 406,422 stop-times; валідатор класифікував 64 bus і 8 tram routes; сервіс у найближчі 7 днів. Фід додано лише в disposable local DB і planner видав 9 розкладних варіантів центр Львова→Сихів | Counts/classification differ from the older snapshot above; reconcile feed snapshot and trolleybus mapping before claiming trolleybus coverage. Static schedule ≠ live GPS, confirmed fare or booking |
| [Київ GTFS mirror](https://jbb.ghsq.de/gtfs/ua-kyiv.gtfs.zip) | 1,492 зупинки, 161 маршрут, 24,307 рейсів, 104,187 stop-times; 101 автобусний, 17 трамвайних, 43 тролейбусних маршрутів | HTTPS mirror, не первинний міський endpoint. У route types немає метро; метро перевірене нижче окремим міським GeoJSON, який не містить розкладу |
| [УЗ GTFS mirror](https://jbb.ghsq.de/gtfs/ua-ukrzaliznytsya.gtfs.zip) | 167 зупинок, 122 рейси/маршрути, 1,251 stop-times; 119 далекого сполучення та 3 приміських | Mirror сформований з OSM і не є офіційним inventory Укрзалізниці. Не підтверджує продаж, місця, актуальні зміни чи квиток |
| [Рівне Dozor GTFS](https://city.dozor.tech/rivne/gtfs/static.zip) | 48 зупинок, 2 маршрути, 290 рейсів, 4,714 stop-times; обидва маршрути автобусні | Підтверджує наявний статичний розклад фіда; окремо потрібна регулярна перевірка свіжості та використання live API |
| [Київ — маршрутки, геометрія](https://data.kyivcity.gov.ua/dataset/rozklad-rukhu-miskoho-elektrychnoho-ta-avtomobilnoho-transportu-dep-transport) | Офіційний GeoJSON читається; 127 геометрій маршрутів у bbox Києва | Геометрія не має зупинок/розкладу й не запускає пошук маршрутки; її не можна показувати як підтверджений рейс |
| [Київ — метро, геометрія](https://data.kyivcity.gov.ua/dataset/rozklad-rukhu-miskoho-elektrychnoho-ta-avtomobilnoho-transportu-dep-transport) | Офіційний GeoJSON читається; 6 напрямків/ліній у наборі, bbox у межах Києва | Лише лінійна геометрія; розклад/рейс беруться з окремого metro timetable path, live-позицій ці дані не дають |
| Київ — міська електричка, геометрія | Офіційний GeoJSON читається; 6 напрямків/геометрій у межах Києва | Не є GTFS-розкладом або підтвердженням доступності рейсу |

У live-пробі GTFS використовувалися валідатори проєкту та доступні публічні URLs. Геометрії міста перевірялися через `cachedGeoJsonNetwork`; результат для кожного джерела містив число розібраних route features і bbox. Зміни реєстру тепер не приписують GeoJSON-лініям список зупинок або timetable capability. Адаптери Uklon/Bolt/Uber також не декларують ціни, ETA чи dispatch, доки не підтверджені їхні конкретні API-продукти й credentials.

Повторний read-only запуск `npm run acceptance:transport-feeds` перевірив 38 із 43 відкритих каталогових записів: 28 джерел відповіли структурно, 7 — degraded, 3 — offline; 5 пропущені за політикою (3 HTTP без TLS, 2 з ключем). Звіт і сирі підрахунки збережені в [14_TRANSPORT_FEED_SMOKE_2026-10-19.json](audit/14_TRANSPORT_FEED_SMOKE_2026-10-19.json). У Львові GTFS-RT на момент перевірки мав 0 VehiclePositions, 0 TripUpdates і 0 Alerts; два міські запити до статичного GTFS побудували до 10 ланцюгів кожен, але пошук обрізався на ліміті. Свіжі GTFS-RT VehiclePositions були у фідах Івано-Франківська (4; вік 3 с) та Ужгорода (2; вік 16 с), без TripUpdates і Alerts. Це точковий моментальний замір, а не постійний SLA.

JSON-фіди Dozor/EasyWay/iCity відповіли в кількох містах, але деякі bbox охоплювали точки поза очікуваним містом; у стрийському/білоцерківському JSON-записі зафіксовано координату в районі Ліми, Перу. Такі відповіді не можна показувати як міський live-флот без фільтрації кожної точки геозоною міста та перевірки свіжості. Свіжість HTTP payload не гарантує правильності координат або відповідності транспортному рейсу.

## Тарифний реєстр і київське метро — перевірка 13.10.2026

Server має єдиний тарифний каталог у `MarshGO-Server/server/mobility/transportTariffs.ts` та authenticated endpoint `GET /api/v1/transport/fares`. Відомі суми зберігаються в копійках, із містом, видом транспорту, продуктом, датою чинності, способом оплати та посиланням на джерело. Пошук застосовує тариф міста лише коли всі сегменти покриті відповідними міськими правилами. Невідомі або змішані тарифи повертаються як невідомі; це не нульова ціна.

| Місто / режим | Перевірена ціна | Умови та межі |
|---|---:|---|
| Київ, комунальні метро/автобус/трамвай/тролейбус/міська електричка/фунікулер | 30 грн разово | Чинне з 15.07.2026; транспортна картка має знижені ціни за кількістю поїздок, окремо заведені 25.00–28.90 грн/поїздка; безлімітні квитки на 24/48/72 год — 375/563/750 грн; проїзні на 46/62/92/124 поїздки — 1088/1463/2156/2888 грн. |
| Київ, QR пересадковий квиток | 60 грн | З 01.08.2026; безлімітні пересадки між міськими видами протягом 90 хвилин. Не поширюється на приватні маршрутки. |
| Львів, автобус/трамвай/тролейбус | 23 грн ЛеоКарт/застосунок; 26 грн банківська картка/NFC; 30 грн готівка | Студентська ЛеоКарт — 11.50 грн. 40-хвилинна безоплатна пересадка з ЛеоКарт/застосунком. Приватні маршрутки не успадковують цей тариф. |
| Дніпро, метро | 10 грн | Місячні комбіновані продукти занесені окремо; це не окремий тариф міського автобуса. |
| Харків, метро | 0 грн за останнім доступним оголошенням оператора | Джерело старіше за цю перевірку: перед релізом тариф треба повторно підтвердити. |
| Міжміські автобуси, УЗ, таксі, велосипед/самокат/каршеринг, трансфер | Немає фіксованої суми | Каталог повертає `dynamic_quote`/невідому ціну. Потрібні тариф конкретного рейсу, live quote, GBFS pricing plan чи партнерський доступ і права на використання. Універсальні «60 грн» для міжміської маршрутки не задаються. |

Джерела: [Портал Києва — тариф 30 грн і карткові знижки](https://kyivcity.gov.ua/news/iz_15_lipnya_vartist_razovogo_prozdu_v_komunalnomu_transporti_stanovitime_30_grn_dlya_postiynikh_pasazhiriv_diyatime_sistema_znizhok/), [Портал Києва — QR на 90 хвилин](https://kyivcity.gov.ua/news/iz_1_serpnya_v_kiyevi_zaprovadzhuyut_peresadkoviy_QR-kvitok_iz_bezlimitnimi_peresadkami_protyagom_90_khvilin/), [ЛК АТП-1 — оплата у Львові](https://atp1.lviv.ua/passengers/payment/), [Дніпровський метрополітен — оплата](https://metro.dp.ua/payment/), [Харківський метрополітен — доступне оголошення про безоплатний проїзд](https://www.metro.kharkiv.ua/kp-%C2%ABkhakrkivskyi-metkropoliten%C2%BB-vitaie-z-dnem-mistsevoho-samovkriaduvannia%21.html).

Офіційні відкриті дані київського метро тепер підключені умовно до пошуку, коли область маршруту перетинає Київ і дозволений режим METRO. Інтеграція об’єднує джерела станцій, геометрії, першого/останнього поїзда, інтервалів і переходів між платформами. У live-перевірці зібрано 3 лінії, 52 станції, 6 напрямків, 2,261 оцінені відправлення та форми ліній; це розкладна оцінка за інтервалами, не GTFS-Realtime і не хвилина точного прибуття.

Київський metro fare fallback у пошуку наразі використовує найнижчу застосовну комунальну схему між разовими квитками та QR 90-хвилинним продуктом. Користувацький спосіб оплати/наявність квитка ще не запитується, тому UI має позначати суму як оцінку. Карткові знижки й багатопоїзкові абонементи є в каталозі, але їх не можна автоматично застосовувати без профілю квитка користувача. Львівський місячний тариф заведений за опублікованою ціною, але його точну тривалість та дату чинності каталог не вигадує.

Прямий engine-прогін для «Вокзальна → Палац спорту» з офіційним metro dataset побудував M1 → пішу пересадку 116 м → M3: 1 пересадка, 21:05 оціненого часу, 6,000 копійок тарифу. Обидві transit geometry мали 0 м помилки на кінцях відносно платформ; послідовність зупинок і часів валідна. Прямий пошук повернув 20 результатів із `truncated=true` і `limitReached=true`, отже не доводить повний перебір чи глобальну оптимальність.

Окремо пройшов ізольований HTTP-пошук на актуальному Server: шість київських metro source rows були ввімкнені тільки в `marshgo_e2e`, а після тесту їхні статуси відновлено. `POST /api/v1/journeys/search` повернув 2 варіанти. Найкращий має M1 «Вокзальна → Театральна» (3 stop calls, 27 shape points), пішу пересадку до «Золотих Воріт» і M3 до «Палацу спорту» (2 stop calls, 7 shape points), близько 21:05, 1 пересадку й 60 грн оціненого QR-тарифу. Обидві metro geometry завершуються у відповідних stop coordinates з відхиленням 0 м. API чесно повернув `partial=true` із `candidate_generation_truncated` і `walking_routing_unavailable`; 116 м пішого переходу не є перевіреним реальним pedestrian route. Цей прогін підтверджує повний шлях provider registry → live public data → API planner → persisted response, але не приймання production map provider чи повний перебір.

## Змінні конфігурації та секрети

Точні змінні задокументовані в Server [DEPLOYMENT.md](../MarshGO-Server/docs/DEPLOYMENT.md), Server .env.example, Site [PRODUCTION_MAP_SETUP.md](../MarshGO-Site/docs/PRODUCTION_MAP_SETUP.md) та iOS release docs. Секретні значення мають надходити з Secret Manager/runtime environment. Не додавати provider secrets у репозиторій або клієнтські VITE_* змінні.

## Що потрібно від власника MARSHGO

Для завершення зовнішнього production gate потрібні вибрані SMS, geocoder/routing, map assets, storage, DB/Redis та push провайдери; права/договори й production origins; доступ до secret manager; політика commercial fees/payments; staging environment і фізичний iPhone для acceptance. До появи цих ресурсів UI має чесно показувати недоступність функцій і не видавати fixture за live дані.

## Точкова live-перевірка — 22.10.2026

На точному Server PR #24 SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283` статичний GTFS Львова був доступний; два денні пошуки віддали варіанти, але обидва — із прапорцями truncation. Це розклад, не live-позиції. Фільтр країни в Zelectra GBFS дав 49 свіжих доступних самокатів у перевіреній київській області. Для цих одиниць немає індивідуального `returnAllowed`; допустимість фінішу залежить від перевірки geofence у конкретному пункті. Вісім UAH pricing plans не підтверджують booking, checkout або права MARSHGO на комерційну транзакцію.

`nextbike_lv` повернув Ригу, не Україну; `nextbike_vin` відповів 404; CityBikes discovery повернув 815 мереж без української мережі. Деталі/часове вікно/межі — `docs/audit/52_LIVE_UKRAINE_FEED_PROBE_2026-10-22.md`. Показники — одноразове спостереження, не гарантія SLA чи покриття інших районів Києва.

### 2026-10-29 — official commercial API recheck

- **Uber / taxi:** official Ride Requests docs expose product, price and time estimates, but the integration requires an application with Developer Dashboard client credentials and the `ride_request.estimate` OAuth scope; booking uses separate `ride_request.ride_booking` privileges. Until MARSHGO receives approved credentials/scopes and verifies service coverage in launch cities, keep taxi routing disabled and do not synthesize quote, ETA, booking or driver availability. Sources: [Ride Requests API](https://developer.uber.com/docs/riders/ride-requests/tutorials/api/introduction), [scope migration guide](https://developer.uber.com/docs/riders/guides/migration-steps).
- **Bolt / taxi:** Bolt Support states there is no public or private rider API. Its separate Fleet API is for fleet-partner company/driver/vehicle data, not a consumer quote/dispatch API. Keep Bolt taxi routing unavailable unless Bolt supplies a documented partner product and agreement. Sources: [Bolt public API statement](https://bolt.eu/en/support/articles/360017256060/), [Bolt Fleet API](https://developer.bolt.eu/fleet-integration/main/).
- **Uklon / taxi:** the official public partner material found is driver/fleet onboarding and terms, not a rider quote/dispatch API contract. Treat it as partner-only/unverified for MARSHGO route estimates; do not reverse-engineer mobile endpoints. Source: [Uklon partner terms](https://uklon.com.ua/en/terms-and-conditions-en/offer-partner/).
- **Kiwitaxi / transfer:** current adapter status remains catalog-only pending credentials/affiliate attribution and a verified quote/booking contract. Catalog route rows are not a price quote or availability. Existing status remains `PARTIAL`, not a routable offer.

## 2026-11-07 16:51 EET — Lviv GTFS-Realtime VehiclePositions spot check

Used the current Server `testGtfsRealtimeConnection` parser against the public Lviv `vehicle_position` endpoint. The parser source SHA-256 is `3127b48fd04c59a09844536ae5236e94e4440e4b4ad1e15a6916b5e47ef12a27`, identical in current Server `origin/main` and the local parser checkout. Probe result: HTTP/feed access and protobuf decode succeeded; feed header age 8 s; 428 vehicle entities, each with valid coordinates and a timestamp; 401 positions were within the 90 s LIVE freshness window and 27 were stale. No missing timestamps/positions. The source reported 0 TripUpdates and 0 Alerts; this URL is the VehiclePositions feed. Validator status is `degraded` because some individual positions are stale.

Evidence level: **LIVE_FEED_VERIFIED (single observation)** for a fresh vehicle-position snapshot in the feed. This does not prove the MARSHGO API response, trip/route identity matching, map rendering, journey-search integration, continuous availability, or staging/production readiness. Do not label the 27 stale records LIVE. Production remains `NOT_RELEASED`.


## 2026-11-07 17:09 EET — Photon adapter live city-sample probe

- Using the current Server main `server/geocoding.ts` at local checkout `/private/tmp/marshgo-server-main-20f64a8`, called its actual `suggestPlaces` adapter with `GEOCODING_PROVIDER=photon`, `GEOCODING_ENGINE_URL=https://photon.komoot.io/api/`, and only generic queries `Lviv` and `Kyiv`. Photon returned HTTP 200; adapter parsing returned 6 unique suggestions for each city with OSM-based provider IDs. No personal addresses were queried.
- An exploratory request adding `lang=uk` returned HTTP 400; the app adapter correctly omits that unsupported parameter and uses the country/bbox settings already in code.
- This validates the adapter against two live sample queries only; it does not verify the currently running API, attribution in rendered UI, sustained rate, exact address selection, reverse geocoding, or production SLA. The current local API still has public Nominatim autocomplete configured and returns 503. No live config was changed.
- Photon’s official README describes `photon.komoot.io` as a public demo: reasonable request volume only, extensive use may be throttled/banned, and availability is not guaranteed. OSM data requires attribution and license notice. Therefore do not silently make this public demo the production default; use an approved provider or provision a managed/self-hosted Photon service with operations and attribution addressed. Sources: [Photon project README](https://github.com/komoot/photon), [OSM copyright and license](https://www.openstreetmap.org/copyright).

## 2026-11-08 UTC — Photon reverse adapter city-point sample

- On exact Server main `180e30b8d066a650e95ed1cdfdf6314ce6b42ad6`, called `reverseGeocode(49.841952, 24.0315921)` with ephemeral `GEOCODING_PROVIDER=photon` and `GEOCODING_REVERSE_URL=https://photon.komoot.io/reverse/`. It returned the same coordinates, label `Львів, Львівська область`, and OSM provider ID `r:2032280`.
- This is one public sample-point adapter test only. The user-approved dev API is still configured for public Nominatim, so this does not prove the runtime reverse endpoint, arbitrary addresses, continuous availability, production operations, or user-interface attribution. No runtime or deployment config changed.


## 2026-11-08 05:53 UTC — Lviv GTFS/GTFS-RT spot check

- Static producer `https://track.ua-gis.com/gtfs/lviv/static.zip`: read-only HEAD 200, `application/zip`, 3,568,789 bytes, Last-Modified `2026-11-02 08:06:59 GMT`; no archive/calendar parse in this checkpoint. Catalog attribution states CC BY 4.0; preserve attribution and recheck license at release.
- VehiclePositions producer probed by exact Server-main GTFS-RT decoder: header age 7 s, 395 entities, all 395 had valid coordinates, 368 positions were fresh (<90 s), 27 stale, none missing timestamps/coordinates; 0 TripUpdates/Alerts. Probe latency 258 ms; health is DEGRADED due to stale entities. Do not show the 27 stale positions as live.
- Sample scope: single live snapshot, not a service guarantee; arrival predictions, API planner consumption, map display and user journey are not verified.


## 2026-11-08 06:00 UTC — exact-main static Lviv timetable planner probe

- Ran the Server-main in-memory GTFS planner against the public Lviv static feed `https://track.ua-gis.com/gtfs/lviv/static.zip` for two generic city O/D samples, without API authentication or database writes. Validation worktree: `/private/tmp/marshgo-server-main-f0326ca-validation`, HEAD `3db97b5563d8f4049927aa90c360037dc54d8a17`; its source tree was confirmed equal to `origin/main` SHA `408d54b5531191885069e057b405cc50444eb268` before the probe. Parsed feed: 1,071 stops, 72 routes, 15,141 trips, 169 shapes, timezone `Europe/Kyiv`.
- Center → main-station sample: 10 candidates returned; `searchTruncated=true` and `resultLimitReached=true`. Top A52/A25 options have scheduled transit from Магнус (feed stop 13) to Скриня (stop 113), approximately 07:04–07:16 UTC in the queried service window. A52 shape has 37 points/~2.51 km; A25 has 38/~2.50 km. This establishes feed-backed schedule/shape output for the sample, not complete candidate enumeration or a best-route claim.
- North → Sykhiv sample: 10 candidates; likewise truncated and result-limit reached. Top A37 option connects Академія друкарства (stop 815) to Центр Довженка (stop 455), with planner-reported journey approximately 06:54–07:56 UTC.
- Evidence level: `LIVE_STATIC_FEED_FIXTURE_VERIFIED` for these two read-only planner samples. No fare was asserted; this probe did not verify live vehicle position, API/auth/DB persistence, walking legs, UI/map, navigation, booking, or staging. Truncation remains visible and blocks any claim of complete/optimal search.
- Resource gate: before the one-at-a-time feed parse, disk had 17 GiB free, memory free 38%, swap used ~8.6 GiB. At 05:56 UTC afterward: disk 17 GiB free, memory free 33%, swap used 8,447 MiB; long-running local Vite/API processes remained untouched, and no second heavy task was started. Docker images/volumes/build cache were not changed; no safe cache was deleted. Defer further heavy local work until memory is at least 35% free and disk at least 20 GiB. Production stays `NOT_RELEASED`.


## 2026-11-08 06:06 UTC — live foot-router integration and exact-main walking tests

- Confirmed the two already-running OSRM-compatible foot graphs from their published local ports, without changing containers: Lviv `127.0.0.1:3013/route/v1/foot/` and Kyiv `127.0.0.1:3014/route/v1/foot/`. Then called the exact Server-main `routePedestrianPath` adapter (validation worktree HEAD `3db97b5563d8f4049927aa90c360037dc54d8a17`; `HEAD` and `origin/main` both have tree `f3cdee185b3921fce1d8070446ef92ef075b0edd`, origin/main commit `408d54b5531191885069e057b405cc50444eb268`). It returned Lviv 2,379 m / 1,717 s / 119 WGS84 points and Kyiv 654 m / 471 s / 68 points, with endpoints matching requested coordinates. This verifies two sample router responses through the app's adapter; it does not verify a stored journey, transit walk join, API response, or rendered map.
- Active API process environment contains two bbox-routed foot graphs: Lviv `[23.9,49.75,24.2,49.95]` → port 3013 and Kyiv `[30.2,50.25,30.8,50.62]` → port 3014. `/readyz` was HTTP 200 (`ready`); generic autocomplete `/api/v1/places/suggest?q=Lviv` remained HTTP 503. Thus the foot-router host/config is present; the older saved journey's missing geometry is not explained by absent foot-router containers/config, and needs a fresh authenticated search to isolate route-specific causes.
- Exact-main focused suite: `node --import tsx --test tests/journey-walking-routes.test.ts` → **19 passed, 0 failed, 0 skipped**, duration 0.66 s. Covers measured geometry replacement, transfer feasibility, missing-provider truthful fallback, per-city endpoint selection, and bounded requests. The clean tracked tree was verified against origin/main; existing untracked `node_modules` in this worktree was preserved.
- Browser attempt used the existing in-app preview tab; UI bridge returned `browser.user is unavailable`, so no authenticated visual/API-to-map flow was performed. The API search endpoint is authenticated; no credentials or browser data were read.
- Resource after the focused check (06:05 UTC): 16 GiB disk free, 33% memory free, swap 8,673.62 MiB, CPU 31.25% user / 34.82% system / 33.92% idle. No build/E2E/GTFS job active. Existing 5 project containers and dev processes were retained; no cleanup or restarts. Heavy local work remains deferred (disk <20 GiB and RAM <35%); production remains `NOT_RELEASED`.


## 2026-11-08 06:17 UTC — Antigravity/Qoder Server branch comparison; static nationwide fallback rejected for release

- Preserved and inspected canonical Server dirty checkout `/Users/dima1203/Desktop/MarshGO/MarshGO-Server`: branch `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`, remote main `408d54b5531191885069e057b405cc50444eb268`, merge-base `fcdf9d8bca2206f30a5e95b578165b0dc0be89c7`, **91 commits behind / 4 ahead**. Its four unique commits add ~7,070 lines across 14 files; working-tree edits/untracked provenance/policy/tests also remain untouched. No cherry-pick/merge/delete.
- Decision by component: (a) static catalog claim “all 12 modes in all 26 regions” is **REJECTED for production availability**: its test verifies enum/shape presence, not source freshness, legal coverage, route, or booking; e.g. metro is asserted present nationwide. (b) 72-corridor `UkraineTransitGraph`/`multimodalChainEngine` is **REJECTED for provider-backed journey results** pending authoritative schedules/shape/fare/availability and route oracle; station/time/fare tables are embedded and generated pedestrian grid paths are not street geometry. (c) old foot-route implementation is **SUPERSEDED** by current main's bbox-selected OSRM foot graphs, bounded routing budget, and source/mode provenance; exact current-main tree already passed `journey-walking-routes.test.ts` 19/19 and live adapter samples for two cities. (d) branch's coordinate-only `sourceRouteGeometry` helper is **SUPERSEDED** by main's stricter `trustedRouteGeometry`, which checks mode/source provenance and sanitizes persisted legs. (e) Photon adapter contribution is **ALREADY_IN_MAIN/SUPERSEDED** by current main Photon support plus production-demo guard; public Photon remains sample-only. Keep the branch and its dirty data as a future provider-discovery reference, not release code. Short decision record appended to `docs/PR_DEPENDENCY_DAG.md`.
- `scripts/local-stack-status.sh` was run read-only: Site preview 4178, API health/readiness 3002, Postgres 5434, Redis 6380/6381, and Docker respond; `SERVICES_INCOMPLETE` because expected local Server checkout is dirty e993 while running API is dirty SHA `20f64a8b745137f08808d0198ea554f8da8a3911`. The running API reports build ID `local-20f64a8b7451-dirty-20261107T074421Z`; its `/readyz` is 200, but generic address suggestion is 503. `start-local-api.sh --check` passes for the e993 checkout; no runtime restart attempted.
- Resource checkpoint 06:16 UTC: 17 GiB disk free, 33% free RAM, swap 8,510.94 MiB, CPU 26.82% user / 30.24% system / 42.92% idle. Existing Docker cache review shows no safely reclaimable builder cache; images/volumes are preserved. No cleanup or heavy build/test was performed. Keep services and all dirty branch work intact; production stays `NOT_RELEASED`.

## Geocoding runtime probe — 2026-11-08 08:37 UTC

| Provider | Current evidence | Capability/status | Production decision |
|---|---|---|---|
| Public Nominatim | Current Server build returns `503 geocoder_unavailable` for autocomplete; implementation explicitly rejects public Nominatim for `places/suggest`. | Reverse geocoding is separate; no route/search acceptance from autocomplete. | Do not use public Nominatim for typeahead. |
| Photon public demo | One direct `Львів` query using the Server's `countrycode=UA`, Ukraine bbox and `limit=6` parameters returned HTTP 200 and six candidates. This did not traverse MARSHGO API/UI. | Dev/provider smoke only. Photon official README permits reasonable API use, warns extensive use may be throttled or banned and gives no availability guarantees. | Not a production dependency. Configure an approved hosted provider or owner-approved infrastructure; do not self-host planet data on this Mac (README: ~95 GB data and 64 GB RAM recommended). |

Source: [Photon official repository and demo-server policy](https://github.com/komoot/photon), checked 2026-11-08. Test used generic city name only; no personal address data.
## 2026-11-09 00:56 EET — current feed-to-runtime gate is unavailable

- Read-only checks: API `127.0.0.1:3002` refuses `/healthz` and `/readyz`; proxy `127.0.0.1:3019` and approved HTTPS host return 502. Docker inventory shows PostgreSQL/Redis and walking-router containers only; no MARSHGO API container is running.
- No feed health probe, download, import, activation, or provider-data mutation was performed. The most recent provider DB evidence remains the 2026-11-08 18:56 UTC snapshot and must be treated as stale.
- Consequently all 12 categories remain `NOT_VERIFIED_END_TO_END`. CI success for Site does not prove provider connectivity. Restore an exact-SHA API first; then verify only sources with documented rights and available credentials, separately measuring source freshness, planner consumption, route geometry, fare/availability truth, and UI behavior.
## 2026-11-09 01:01 EET — no API process to verify feed ingestion

- Exact Server main SHA is `d8c25a560187a89aaa42422d602802854c19c694`. Server component CI `42479353894` passed; local runtime does not serve this (or another) API: port `:3002` is down and proxy `:3019` is 502. Database and Redis are reachable, but no API container is running.
- Therefore the 2026-11-08 18:56 UTC provider registry remains stale. No feed-to-planner probe or provider activation occurred. All 12 categories remain `NOT_VERIFIED_END_TO_END`.
- Next validation must use an isolated exact-main API/DB fixture first, then permitted live sources. Do not enable commercial integrations without credentials and usage/booking rights.



## 2026-11-09 01:48 EET — runtime and page-acceptance recheck

- The current runtime still has no direct API listener on `127.0.0.1:3002`; the local search proxy and approved HTTPS readiness path return 502. The Site dev/preview paths return the HTML shell for all 20 registered route/deep-link shapes, but this is not a rendered page or transport-feed acceptance. Browser control is unavailable in this session and no feed was enabled.
- The preceding provider table remains a registry/history summary, not current live status. All 12 transport categories remain `NOT_VERIFIED_END_TO_END` until source → ingestion → planner → API → Site is verified at one exact SHA.


## 2026-11-09 02:33 EET — provider acceptance checkpoint

- No feeds were activated or modified in this UI task. The API is unavailable locally (`:3002/:3007` down; readiness/proxies return 502), so current provider-to-search-to-map validation could not run.
- All 12 transport categories remain `NOT_VERIFIED_END_TO_END`. Existing limited GTFS evidence includes Lviv bus/tram itineraries, but searches truncate; no complete three-leg chain survived. Feed presence or UI icons do not establish availability, geometry, price, or booking.
- Maintain per-category source/rights/coverage/credentials blockers from the provider table. Resume source → ingest → planner → API → UI checks on a pinned, ready candidate; do not represent catalog or fixture data as live.


## 2026-11-09 02:37 EET — no live feed verification possible

- Current API is absent (`:3002` connection-refused; local readiness/API proxies return 502). Database, Redis and walking routers are up, but no Server container is running. No feed was enabled or modified.
- All 12 categories remain `NOT_VERIFIED_END_TO_END`; fixtures, catalogs, schedule rows and UI icons are not proof of live availability/booking. Resume provider validation only on a ready, SHA-pinned API and keep rights/credential blockers explicit.


## 2026-11-09 02:45 EET — source probes versus integrated feeds

- Generic Photon Lviv lookup succeeded (HTTP 200, 3 Point results), and local pedestrian router `:3013` returned OSRM `Ok` with a GeoJSON LineString. These are source-level probes only; API/provider planner/UI integration remains unverified.
- A current-main Server candidate is prepared with local Photon and walking-router URLs, but the API stack has not started because memory is 29% free (<35% gate). No feed was activated; all 12 modes remain `NOT_VERIFIED_END_TO_END`.


## 2026-11-09 02:47 EET — planner oracle coverage is not feed coverage

- Exact-main route oracle/scoring suite passed 40/40, including a valid three-leg-only fixture. This proves composition logic on bounded synthetic graphs, not current transport-provider availability. Photon and local foot-router direct source probes pass, but API and Site integration remains unrun.
- All 12 categories remain `NOT_VERIFIED_END_TO_END`; no feeds activated.

- Follow-up direct source probe: Photon autocomplete returned HTTP 200 and 5 Point features for both `Львів` and `Lviv`; this confirms the sample query works at Photon, not that the MARSHGO API route is healthy.


## 2026-11-09 02:58 EET — Lviv catalog seed scope prepared

- Server PR #122 (`a287266c071f2e6dcf8723ba7de033904b709ffc`) adds `mobility:seed --lviv`, selecting Lviv's static GTFS and two GTFS-RT entries without probing the full catalog. Four selector tests and lint pass; exact-head CI pending.
- This is a reproducible seed path only; no feed request or DB update has occurred. Source→import→planner→API→UI remains unverified; all 12 categories remain `NOT_VERIFIED_END_TO_END`.


## 2026-11-09 03:02 EET — Lviv seed scope available on main, not yet run

- Server main `ba158074ee45ca70486cef10462f9860942e1fa7` now has `mobility:seed --lviv` (PR #122 merged after both CI checks passed); tests verify Lviv GTFS and GTFS-RT selection.
- The command has not been run against a database, so no feed is considered connected or enabled by this change. Next validation is the isolated API plus disposable DB seed, then route/API/UI proof. All 12 categories remain `NOT_VERIFIED_END_TO_END`.

## 2026-11-09 03:16 EET — feed status recheck

The current preview and approved HTTPS API path return HTTP 502 for readiness and place suggestions; there is no direct local Server API listener. No feed was activated or queried in this checkpoint. The category statuses above remain historical/implementation evidence, not current runtime health. All 12 are still NOT_VERIFIED_END_TO_END until each enabled source is observed through ingestion → planner → API → Site with its rights, freshness, fare and availability semantics intact.

## 2026-11-09 03:23 EET — Lviv live source observation

On Server SHA `ba158074ee45ca70486cef10462f9860942e1fa7`, workflow run `42544916064` parsed Lviv GTFS (1,071 stops, 72 routes, 15,141 trips) and found schedule-backed bus and bus→tram candidates, with graph/stop/pool/page truncation; not complete search or API/UI proof. The same observation's fresh GTFS-RT feed had 0 entities and was DEGRADED for live positions. One direct OSRM foot query returned real geometry, but was not integrated through the API. No feed/DB state was changed; 12/12 end-to-end statuses remain unverified.

## 2026-11-09 04:01 EET — canonical catalog endpoint probe

- Read-only probe used the exact Server `main` catalog at SHA `ba158074ee45ca70486cef10462f9860942e1fa7`: 52 unique endpoint rows, 47 marked open. HTTP `HEAD` with redirect-following returned 200 for 32 and no response for 15; 5 rows were excluded by catalog access policy. A 200 HEAD proves only endpoint reachability, not a valid feed payload, fresh data, route generation, licensing beyond the catalog entry, fare, inventory, or booking.
- The [Kyiv official data portal transit dataset](https://data.kyivcity.gov.ua/dataset/rozklad-rukhu-miskoho-elektrychnoho-ta-avtomobilnoho-transportu-dep-transport) documents the resources and Open Data Licence. Its [routeTaxi GeoJSON resource](https://data.kyivcity.gov.ua/dataset/rozklad-rukhu-miskoho-elektrychnoho-ta-avtomobilnoho-transportu-dep-transport/resource/77325f5c-57d0-4f79-844a-cc73675f9743) currently redirects to `gisserver-stage.kyivcity.gov.ua`; that host and `gisserver.kyivcity.gov.ua` returned no A records via both 1.1.1.1 and 8.8.8.8. The catalog's direct ArcGIS REST entries therefore are not currently resolvable from this environment. The portal's `datastore_search` answered for 8 resource IDs, but returned catalog metadata (`resource_url`, `resource_name`, `resource_format`), not the actual transit payload. Do not count those metadata responses as connected transport feeds.
- No catalog, provider, database, or runtime config was changed. All 12 categories remain NOT_VERIFIED_END_TO_END; source-to-ingestion-to-planner-to-UI acceptance remains outstanding.

## 2026-11-09 04:25 EET — direct geocoder and walking-router recheck

- The user-approved public Photon sample query `Львів` returned 3 features (first result Львів, Україна). Existing local OSRM foot router `:3013` returned `code=Ok`, one GeoJSON `LineString` with 90 points, 1,836 m and 1,322 s for the sample coordinate pair. These verify the direct components only; they do not verify MARSHGO API or map integration.
- Correct Site endpoint `GET /api/v1/places/suggest?q=Львів` returned HTTP 502 both through local Site `:4179` and the approved staging origin. API `:3002` has no listener. Current failure is at the API relay/upstream before Photon is called; walking geometry has not been traced through the API/planner/UI.
- No runtime, provider, DB or feed configuration changed. This is not feed activation evidence; all 12 categories remain NOT_VERIFIED_END_TO_END.
## 2026-11-09 04:46 EET — current page/API probe

- Static route fallback on Site preview `:4179` returned HTTP 200 for 20 known tab and entity-link paths, each with the same 5,027-byte SPA shell. This does not verify client rendering or interactions.
- Lightweight Site route-resolver unit test passed 2/2 (0 failed/skipped) on dirty HEAD `eda449f008025b2126c92fd24cd68deb513ca3ad`; this does not verify API-backed screens.
- Vite transformed 10 key Site modules with HTTP 200 and no import/transform errors; client rendering and interactions remain unverified.
- Current API remains unavailable (`:3002` connection refused; relay `:3019` readiness and place suggestion return 502). No provider-backed search was possible, and no feed was activated or changed.
- Direct walking OSRM sample `:3013` returned HTTP 200 / `Ok`; this is not planner/API/UI geometry proof. All 12 categories remain `NOT_VERIFIED_END_TO_END`.
- Resource gate: 23 GiB free disk, 30% free RAM, ~12.2 GiB swap; defer heavy browser/build/import work until free RAM is stably at least 35%.
## 2026-11-09 05:28 EET — exact Qoder-branch live comparison

- Read-only workflow on Qoder PR #119 head `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`, run `42556382366`, parsed the Lviv static feed (1,071 stops, 72 routes, 15,141 trips) and observed one healthy GTFS-RT probe. Both route cases returned 10 candidates but failed the completeness gate: truncation flags `stopSelection`, `candidateGraph`, `candidatePoolLimit`, `candidateSampling`, `responsePage` were true; `searchBudget` was false. The primary candidate pool recorded no 3-leg result.
- Current Server main run `42544916064` at SHA `ba158074ee45ca70486cef10462f9860942e1fa7` had the same shared truncation conclusion; one example contained bus→tram. Different snapshot times mean exact results are not controlled-comparable.
- Qoder's accepted safe changes from PR #120 are present in current main (merge SHA `d8c25a560187a89aaa42422d602802854c19c694` is its ancestor). PR #119 remains conflicting and is not a candidate for wholesale merge. This run proves schedule-backed route candidates, not all transport modes, fare, booking, geometry, or UI acceptance.
## 2026-11-09 05:33 EET — near-time Qoder/main recheck

- Read-only Lviv acceptance ran on Qoder PR #119 SHA `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3` (`42556382366`, checked `03:26:29Z`) and exact current main SHA `ba158074ee45ca70486cef10462f9860942e1fa7` (`42556902140`, checked `03:32:18Z`). Both parsed the same feed size (1,071 stops, 72 routes, 15,141 trips), had one healthy GTFS-RT probe, produced 10 candidates per corridor, and shared truncation flags for stop selection, graph, pool, sampling and response page; neither used the search-step budget, both had zero primary-pool 3-leg candidates.
- This does not establish all route completeness or prove a code regression. Qoder's accepted fixes from PR #120 are in current main. PR #119 remains conflicting and is not merged. No providers or configuration changed.

## 2026-11-09 06:27 EET — exact-main all-catalog provider probe and 12-mode disposition

- Server main SHA `4db6e97b392cb9f01e07fea035b8346826119333`; manual workflow run [42561583860](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/42561583860), artifact `transport-feed-acceptance-4db6e97b392cb9f01e07fea035b8346826119333/transport-feed-acceptance.json`, checked `2026-11-09T04:24:45Z`. Probe covered all 88 selected catalog rows: 83 public/eligible sources were actually checked, 5 were skipped by access policy, with 49 HEALTHY, 13 DEGRADED and 21 OFFLINE. This is source/parser health only; it is not 83 route integrations.
- The probe summary previously counted skipped entries in `providerSourcesProbed`. Server PR #125 fixed the count and made the Actions summary print the artifact counts; exact-head checks passed, merge SHA is `4db6e97...`, and post-merge Server CI run `42561570045` passed. The canonical all-feed workflow was rerun on that merged SHA.
- Lviv static GTFS parsed 1,071 stops, 72 routes and 15,141 trips. Exact-main planner samples returned bus A25/A46 and a two-leg bus A21 → tram T04 candidate. Both corridors are still incomplete: `stopSelection`, `candidateGraph`, `candidatePoolLimit`, `candidateSampling` and `responsePage` are true; `searchBudget` and `searchStepLimit` are false. This proves schedule-backed candidates and one transfer in the planner, not complete/global-optimal search or API/UI integration.
- Lviv vehicle-position GTFS-RT was DEGRADED: 235 entities, 215 fresh positions, 20 stale, 0 TripUpdates and 0 Alerts. The separate Lviv TripUpdates endpoint parsed 189 updates and 0 Alerts. At the earlier same-main sample run `42560026875`, the vehicle feed also had stale positions and the route-completeness gate failed; repeated counts vary by observation time.
- Offline source reasons: 15 Kyiv REST/GeoJSON rows could not resolve their host; five parse-valid GTFS feeds had no service in the next seven days (Inbus, Rivne, Chornomorsk, Khmelnytskyi, Oleksandriia); Uzhhorod GTFS lacks a valid agency timezone. Five skipped rows are insecure endpoints or require credentials. Degraded rows include stale/empty realtime and invalid vehicle positions.

| Transport category | Current exact-main evidence | Status |
|---|---|---|
| Попутка | Internal offer/search/booking code exists; local API is down, so two-account UI→API→DB acceptance did not run. No external carpool feed. | IMPLEMENTED; NOT_VERIFIED_END_TO_END |
| Маршрутка | Kyiv route-geometry catalog rows are currently unreachable by DNS; geometry alone would not provide a timetable. GTFS bus routes are not relabelled as marshrutky. | SOURCE_OFFLINE; NOT_VERIFIED_END_TO_END |
| Автобус | 13 healthy GTFS rows had active service in this probe. Lviv planner returned scheduled bus candidates, but search was truncated and API→Site is unavailable. | SCHEDULE_PARTIAL; NOT_VERIFIED_END_TO_END |
| Таксі | No eligible quote/dispatch feed; operator credentials, contractual scope and quote/booking APIs are absent. | BLOCKED_EXTERNAL |
| Трамвай | Lviv/Kyiv/Odesa GTFS contains tram routes; Lviv returned a tram leg in a bus→tram candidate. Search is truncated; no ticket inventory/booking. | SCHEDULE_PARTIAL; NOT_VERIFIED_END_TO_END |
| Тролейбус | Active GTFS parses route types in Ivano-Frankivsk (1), Kyiv (44) and Odesa (7); no current API→planner→Site trolleybus acceptance. | SCHEDULE_PARTIAL; NOT_VERIFIED_END_TO_END |
| Метро | Kyiv schedule and geometry catalog rows are among the 15 DNS failures; no current metro journey proof. | SOURCE_OFFLINE; NOT_VERIFIED_END_TO_END |
| Поїзд | UZ GTFS parsed 115 train and 3 suburban route types; no live seats, confirmed fares or ticket booking. | SCHEDULE_ONLY; NOT_VERIFIED_END_TO_END |
| Велосипед | CityBikes discovery found 815 networks, 0 in Ukraine; Nextbike Latvia data is in Riga. Static OSM points are not live inventory or return permission. | STATIC_ONLY; NOT_VERIFIED_END_TO_END |
| Самокат | Zelectra GBFS discovery is reachable (986 vehicles, 0 stations) but has mixed/global geography; no verified Ukraine-specific geofence, fare or booking. | GLOBAL_FEED_ONLY; NOT_VERIFIED_END_TO_END |
| Каршеринг | No eligible fleet feed, credentials, geofences or booking rights are present in the current catalog. | BLOCKED_EXTERNAL |
| Трансфер | Kiwitaxi/Intui records are catalog/links, not live quotes or availability; partner credentials/booking contract are absent. | CATALOG_ONLY; NOT_VERIFIED_END_TO_END |

All 12 remain `NOT_VERIFIED_END_TO_END`. Do not infer that healthy feed rows enable those modes in current app search. Local web API is currently unavailable (`:3002` refused; preview/staging readiness 502); no provider, database or runtime configuration was changed by this probe.


## 2026-11-09 06:35 EET — Kyiv official feed endpoint reconciliation; preserve Qoder runtime

- Opened the existing Site preview at `http://127.0.0.1:4179/journeys/search`; it renders the guest welcome screen. Its API proxy returns 502; direct `:3002` has no listener. No login was attempted, and neither `:4179` nor Qoder-owned worktrees were restarted or edited.
- Server current `origin/main` remains `4db6e97b392cb9f01e07fea035b8346826119333`. The latest exact-main 88-row probe remains the only complete source snapshot: 83 probed, 5 policy-skipped; 49 healthy, 13 degraded, 21 offline. It does not prove route/API/UI use.
- Fresh official-source review: [Kyiv Open Data's transport dataset](https://data.kyivcity.gov.ua/dataset/rozklad-rukhu-miskoho-elektrychnoho-ta-avtomobilnoho-transportu-dep-transport) reports commercial reuse under its Open Data Licence and an update on 2026-10-14. Its published metro/funicular/route resource links on [the national data.gov.ua mirror](https://data.gov.ua/dataset/96128887-4f36-4c19-a96e-5d4765fade16) point to `gisserver-stage.kyivcity.gov.ua`. The catalog's production `gisserver.kyivcity.gov.ua` and the published stage host both failed DNS from this Mac; the web fetcher also returned 502/timeouts on stage queries. This is an endpoint/network blocker, not proof that the city dataset was deleted. Do not silently switch production to a stage endpoint or fabricate metro/marshrutka routes.
- Mode disposition remains: bus/tram/trolleybus have partial scheduled GTFS evidence; train has schedule-only evidence; bike is static-only; scooter's global GBFS is not verified for local rentable stock; carpool code is not API/UI verified; marshrutka, metro, taxi, carsharing, and transfer have no verified end-to-end route/booking evidence. All 12 remain `NOT_VERIFIED_END_TO_END`.
- No provider URL, database, Qoder source, or production config changed.
- Resource checkpoint: disk 23 GiB free; memory free 28%; encrypted swap 12,402.81 MiB; load 1.52/2.10/2.36; Qoder, Docker Desktop, and Virtualization are still running. No heavy local build/test/import/browser suite started.
- Next: preserve both active browser previews; after memory is stably >=35%, run only the exact-Server-SHA isolated API + disposable DB/Redis acceptance. Then verify sample autocomplete → provider route → geometry → Site map. Keep inaccessible provider endpoints and missing partner credentials explicit; production remains `NOT_RELEASED`.


## 2026-11-09 06:48 EET — Zelectra feed-through-parser verification (corrects scooter row above)

- Rechecked the existing Web preview without restarting it: `http://127.0.0.1:4179/journeys/search` returns HTTP 200. Its `/readyz` and `/api/v1/places/suggest?q=Львів` return HTTP 502; direct Server `:3002` has no listener. The approved HTTPS origin returns the same two 502 responses. Therefore the preview shell is up, while search/API acceptance is unavailable.
- On the preserved Qoder Server worktree (`antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74`), ran a read-only live request using the existing `loadGbfsSnapshot` parser, `selectNearby`, and map-feature builders. Every file used for parsing/selection/features was byte-identical to Server `origin/main` `4db6e97b392cb9f01e07fea035b8346826119333` at this checkpoint (`git diff --quiet origin/main -- <those files>` returned 0). Feed fetched at `2026-11-09T04:47:32.247Z`; source timestamp `04:47:31.890Z`; source TTL 0 and parser stale-after 30 seconds. It normalized 706 fresh, available SCOOTER assets, all returned within 15 km of Kyiv center `[30.5234, 50.4501]`; map feature builder emitted 706 scooter points and 300 geofence features for a Kyiv viewport. There were 0 stations and 8 pricing plans. A feed plan is `UAH 12 + UAH 5.6/min`; this is a tariff description, not a final ride quote or booking confirmation.
- This advances scooter evidence to `LIVE_FEED + NORMALIZER/NEARBY/MAP_MODEL_VERIFIED (single live snapshot, Kyiv)`; **API endpoint, database activation, Site rendering, per-vehicle/time return eligibility, booking and commercial terms are not verified**. MobilityData lists the feed as CC BY 4.0 ([feed record](https://mobilitydatabase.org/feeds/gbfs/gbfs-66)); the Qoder regional catalog labels its Zelectra source `CONTRACT_ONLY`, while the provider registry says `ACTIVE_LIVE`. Treat this policy/config discrepancy as a gate; do not enable or seed it from this probe alone. GBFS pricing has base/unlock and variable fields; follow the [GBFS specification](https://github.com/MobilityData/gbfs/blob/master/gbfs.md) and never present the example as a guaranteed total.
- The older 06:27 entry's “global feed only/no verified Ukraine stock” statement is superseded by the Kyiv-filtered observation above. The other 11 category dispositions have not changed. All 12 remain `NOT_VERIFIED_END_TO_END`. No source code, provider config, database, container, Qoder tree, or release manifest was changed.
- Resource checkpoint: `df -h /` 23 GiB free; `memory_pressure` 28% free; encrypted swap 12,101 MiB used; load averages 2.81/3.26/3.04; Virtualization VM active at >100% CPU, with Qoder/Docker/browser running. No heavy work was started. Production remains `NOT_RELEASED`.


## 2026-11-09 07:00 EET — safe API preflight and read-only local feed inventory

- `./scripts/start-local-api.sh --check` passed without starting the API. It validated loopback DB/Redis/geocoder/router targets; the launcher forces auth dev bypass/OTP off, SMS disabled, fixtures off, and static multimodal estimates off. It would run the **dirty Qoder checkout** at `e9934abbd8fc973177de8d7f47548739758a1b74` (`sourceState=dirty`), so this is a preflight only, not a release build or runtime acceptance.
- Read-only `BEGIN READ ONLY` queries to the validated local Postgres showed the existing provider table has 13 enabled rows (11 healthy, 2 degraded) and 75 disabled/offline rows (60 `DISCOVERED`, 15 `TEMPORARILY_UNAVAILABLE`). Last checks were around `2026-11-08T18:56Z`; successful sync timestamps around `12:37Z`. This database inventory is old local state, not current live API health, and it does not prove all 12 user-facing modes.
- PostgreSQL `pg_isready` on the local target accepted connections; the mapped Redis container returned `PONG`. These are existing shared containers/data, not a disposable test stack; no writes, migration, restart, or container changes were made. API `:3002` remains down.
- Current resource gate at 06:57 EET: disk 22 GiB available, RAM free 28%, encrypted swap 13,090 MiB used, load 1.96/3.44/3.55. Do not start API against the shared DB or build/start a container under the memory threshold.
- Next safe runtime gate: when free RAM is stably >=35%, create/use an isolated disposable DB+Redis, build/run one pinned Server candidate, verify build identity/readiness, then connect the existing Site preview. Keep dirty Qoder code isolated and preserve all local provider/database state.

# Incremental live URL recheck — 2026-11-09 07:49 EET

| Source | Probe | Result | What it proves |
|---|---|---|---|
| Львів GTFS Static | HTTPS request, body discarded | HTTP 200 | Endpoint reachable only; no current payload parsing or service-date validation in this probe |
| Zelectra GBFS v3 root | HTTPS request, body discarded | HTTP 200 | Root endpoint reachable only; does not prove Ukraine inventory, freshness, return rules, booking or route use |
| Kyiv official metro ArcGIS layer 13 | HTTPS query, body discarded | HTTP 000; DNS resolution failed | Source unavailable from this machine at probe time |

These spot checks do not upgrade any transport mode to route-to-UI verified. Keep current category status and access policy unchanged. No provider was enabled.

## 2026-11-09 09:01 EET — Qoder local registry coverage snapshot (not route acceptance)

On local Qoder API build `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`, read-only `GET /api/v1/mobility/providers` returned:

| City | Registry entries by canonical category | Evidence boundary |
|---|---|---|
| Lviv | Carpool 1; bus 1; tram 1; train 1; suburban train 1; static bike networks 2; other canonical modes 0 | Internal carpool code, GTFS schedule metadata and static network records; no new route/price/booking proof |
| Kyiv | Carpool 1; bus 1; tram 1; trolleybus 1; train 1; suburban train 1; static bike networks 3; scooter 1; other canonical modes 0 | GBFS provider record is not a verified rentable vehicle or return-eligible ride |
| Odesa | Carpool 1; bus 1; tram 1; trolleybus 1; train 1; suburban train 1; static bike networks 2; other canonical modes 0 | Registry and static-network presence only |

Registry counts do not prove provider health, live inventory, source rights, fares, journeys, geometry, booking or route-to-UI use. Runtime SHA is a clean Qoder branch, not Server main; the exact-main 88-row probe above remains a separate source-level result. All twelve modes remain `NOT_VERIFIED_END_TO_END`.

## 2026-11-09 09:39 EET — Lviv live-bus layer, Qoder runtime only

| Category | Live source evidence | Scope and limit |
|---|---|---|
| Bus (Lviv) | Local Qoder Server `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3` + Site `e26c598572a0b032d1cd8f6503e65902f45ae387`: map showed 23 live GPS markers; ages 9–30 s; A01 moved 13 m and A34 27 m between polling snapshots; 72 scheduled routes / 1,071 stops | `LOCAL_LIVE_MAP_VERIFIED` on Qoder pair only; one city and one runtime; no booking/ticket proof and not a current-main/staging result |
| Other 11 categories | Existing provider matrix evidence unchanged | Continue the previously recorded per-category statuses and access blockers; all 12 remain `NOT_VERIFIED_END_TO_END` as a full product journey |

An active A21 journey did not receive a matching fresh vehicle for 32 polls and remained `SCHEDULED / no_fresh_matching_vehicle`, even while other buses on the same line moved. Do not infer that the generic Lviv live layer is down, and do not attach a nearby bus to a user's journey without GTFS trip identity matching. No provider was enabled by this check.

## 2026-11-09 09:56 EET — current-main feed probe and planner candidate update

- Exact Server main `4db6e97b392cb9f01e07fea035b8346826119333`; GitHub Actions [canonical feed acceptance run 42570088420](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/42570088420) completed successfully at `2026-11-09T05:57:39Z`. Artifact saved at `/tmp/marshgo-feed-42570088420/transport-feed-acceptance-4db6e97b392cb9f01e07fea035b8346826119333/transport-feed-acceptance.json`.
- Source-only snapshot: 88 selected catalog rows, 83 actually probed, 5 policy-skipped, 48 healthy, 14 degraded, 21 offline. A healthy endpoint is not proof of a journey, legal commercial use, availability, fare or booking.
- Lviv `Львівавтодор` GTFS parsed 1,071 stops / 72 routes / 15,141 trips. Two planner corridors returned 10 candidates each. The north-to-Sykhiv sample included a scheduled bus A21 → tram T04 chain, but both route cases were truncated by `stopSelection`, `candidateGraph`, `candidatePoolLimit`, `candidateSampling` and `responsePage`; neither `searchBudget` nor `searchStepLimit` was set. Candidate-graph demand was 130,144 and 224,728 against a 100,000 segment budget; each search materialized about 99k segments and used up to 966 MB RSS. This proves one scheduled two-leg candidate, not complete results, a three-leg route, live trip matching or UI acceptance.
- Supplementary snapshot: CityBikes discovery 815 networks / 0 Ukrainian networks; Zelectra GBFS 994 fresh global vehicles / 0 stations with global bounds, marked inventory candidate only; Nextbike Riga had 44 stations / 0 valid vehicles and is not Ukrainian coverage. None proves a Ukraine-specific booking flow.
- The category dispositions remain unchanged: only partial Lviv bus live-map evidence exists on the Qoder local pair. All 12 categories remain `NOT_VERIFIED_END_TO_END` as complete user journeys. No feed was activated by this probe.


## 2026-11-09 10:42 EET — Qoder runtime health recheck (no feed status promotion)

- Qoder Site e26c598572a0b032d1cd8f6503e65902f45ae387 served the search route with HTTP 200; its Server dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3 readiness endpoint returned HTTP 200; sample-city “Львів” autocomplete through the Site proxy returned HTTP 200. These are development-runtime checks only.
- No feed/provider endpoint was activated or changed. The previous category matrix remains authoritative: Lviv local live-map evidence covers buses only; static/scheduled/source registry records for other categories do not establish a routable journey, current availability, fare, or booking. All 12 modes remain NOT_VERIFIED_END_TO_END.


## 2026-11-09 10:53 EET — CI status and evidence-scope correction

- Site PR #118 head a59b67646e80519eaa8a8e7810dae24248406bd4: exact-head GitHub Actions run 42589422740 completed SUCCESS. Steps passed lint, typecheck, unit suite, token check, build, bundle check, single-React check, Chromium install and boot-smoke. This is not a full user-flow E2E or visual acceptance.
- Server PR #126 head 39d76899ee829bced26212ab3f8609c2c0d058ea: run 42589392341 has passed audit, lint, typecheck, unit tests, DB migrations and integration tests; production image build is still IN_PROGRESS, image smoke/lifecycle checks pending.
- Evidence nuance: prior checkpoint text saying only bus had live evidence was too broad. Bus has Qoder Lviv live-map observation; scooter also has one Kyiv GBFS snapshot processed through the unchanged main parser/nearby/map-model functions (706 fresh UA-filtered vehicles, 706 points, 300 geofences, 0 stations). That scooter result does not verify API/DB activation, Site display, per-ride return eligibility, fare quote or booking; the catalog/registry contract-status discrepancy remains a gate. Current 12-mode end-to-end status remains NOT_VERIFIED_END_TO_END. Historical Kyiv metro API acceptance from 2026-10-13 is not current live evidence; 2026-11-09 source checks currently show DNS failure.
- Browser inspection was attempted but computer control reports the Mac locked. Existing IAB has Qoder :4202 open; stale :3000/:4178 and zrok tabs show unavailable/bad gateway. Qoder :4202 HTTP and API readiness remain 200. No page visual test performed.
- Next: await Server run 42589392341 to terminal state; then review logs/result. Keep PRs draft until paired runtime/API smoke. Do not change Qoder or main.
## 2026-11-09 11:24 EET — current Qoder region-filtered journey provider registry

Read-only `GET /api/v1/mobility/providers?lat=…&lon=…` on Qoder Server checkout `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3`; development runtime only, with no commit/build identity in `/api/v1/version`. It returns candidate provider groups, not proof of route generation or service use.

| Canonical mode | Lviv endpoint snapshot | Kyiv endpoint snapshot | Odesa endpoint snapshot | Evidence boundary |
|---|---|---|---|---|
| Carpool | MARSHGO Community | MARSHGO Community | MARSHGO Community | Internal feature entry; no real offer/booking acceptance in this probe |
| Marshrutka | None | None | None | No local journey-provider entry; do not infer it from generic GTFS bus |
| Bus | Львівавтодор (GTFS) | Київпастранс (GTFS) | Одеса (GTFS) | Scheduled feed listing; no complete route-to-UI proof |
| Taxi | None | None | None | No connected quote/dispatch provider entry |
| Tram | Львівавтодор (GTFS) | Київпастранс (GTFS) | Одеса (GTFS) | Scheduled feed listing; no booking proof |
| Trolleybus | None | Київпастранс (GTFS) | Одеса (GTFS) | Scheduled feed listing; no route-to-UI proof |
| Metro | None | None | None | Current registry lists none; official Kyiv endpoint DNS failure recorded above |
| Train | UZ (GTFS, nationwide) | UZ (GTFS, nationwide) | UZ (GTFS, nationwide) | Schedule source; no live seats/fare/booking proof |
| Bicycle | BikeNow, Nextbike (static estimate) | BikeNow, Nextbike, Veliki.ua (static estimate) | Nextbike, Veliki.ua (static estimate) | Network points/estimate only; no live rental stock/return confirmation |
| Scooter | None | Zelectra (GBFS) | None | Provider listing only; earlier single Kyiv parser snapshot is not current availability, return eligibility or booking evidence |
| Carsharing | None | None | None | No connected fleet-provider entry |
| Transfer | None | None | None | Catalog/affiliate data is not a live quote or booking; no transfer journey provider returned here |

This is region-scoped source discovery only. Earlier Lviv bus live-map and single Kyiv GBFS parser evidence remain separately scoped; neither promotes an entire mode to route→geometry→UI verified. All 12 remain `NOT_VERIFIED_END_TO_END`; do not seed or enable unsupported sources to fill the table.

## 2026-11-09 09:41 UTC — refreshed read-only source inventory

**Evidence boundary:** Qoder's existing `/api/v1/mobility/providers` was queried read-only at `:3002` for coordinates in Lviv (49.8397,24.0297), Kyiv (50.4501,30.5234), and Odesa (46.4825,30.7233). The UI endpoint returned 200. Rows below indicate provider discovery at a point only; they do not prove a usable journey, geometry, fare, live availability, booking, or complete coverage. A separate source-probe artifact is attached to Server main SHA `4db6e97b392cb9f01e07fea035b8346826119333`, run `42570088420`, measured `2026-11-09T05:57:35Z`: 88 catalog rows, 83 sources probed, 48 healthy, 14 degraded, 21 offline, 5 skipped.

| Canonical mode | Lviv | Kyiv | Odesa | What is actually evidenced / next blocker |
|---|---|---|---|---|
| Carpool | MARSHGO Community | MARSHGO Community | MARSHGO Community | Internal provider listing only. Still needs two-account publish→request→atomic booking→MarshPass acceptance. |
| Marshrutka | none | none | none | Kyiv Dozor JSON probe reported 186 `vehicles_bus` positions; that does not classify vehicles as minibuses or provide schedule/route geometry. Dedicated Kyiv GeoJSON route source was OFFLINE in the same probe. Do not relabel generic buses. |
| Bus | Львівавтодор GTFS | Київпастранс GTFS | Одеса GTFS | Schedule feeds are probed healthy; Lviv RT positions and several JSON vehicle feeds are separate and some degraded. Need route→geometry/UI acceptance. |
| Taxi | none | none | none | No quote/dispatch source; operator API, credentials and commercial permission required. |
| Tram | Львівавтодор GTFS | Київпастранс GTFS | Одеса GTFS | Schedule evidence only; no fare/ticket proof. |
| Trolleybus | none | Київпастранс GTFS | Одеса GTFS | Schedule evidence only; coverage is city-specific. |
| Metro | none | none | none | No current enabled metro route source in point discovery; source/API health and routes need re-verification before claiming coverage. |
| Train | Укрзалізниця GTFS | Укрзалізниця GTFS | Укрзалізниця GTFS | Source probe reported 115 train routes and 3 suburban routes nationwide. No live seat inventory, verified fare, or booking proof. |
| Bicycle | BikeNow/Nextbike static estimates | BikeNow/Nextbike/Veliki static estimates | Nextbike/Veliki static estimates | Static locations only; live fleet, price, network return rules and booking are unverified. |
| Scooter | none | Zelectra GBFS | none | Feed probe reported 992 vehicles but 0 stations; return-zone/fare/booking suitability is unverified. |
| Carsharing | none | none | none | No connected fleet API; operator permission, credentials, geofences and booking required. |
| Transfer | none | none | none | Catalog links are not live quotes or bookings; partner credentials/agreement required. |

The same read-only acceptance artifact ran two Lviv planner cases; each found 10 routes but had `searchTruncated=true` due to stop-selection, candidate-graph, pool/sampling, and response-page limits. Search-budget and search-step-limit flags were false. Keep the reported limits visible in diagnostics and resolve them with same-input before/after/oracle evidence. The artifact is source-probe and planner evidence, not twelve-category end-to-end acceptance.

The local app remains available at `http://127.0.0.1:4202/journeys/search`; Qoder was not modified. This checkpoint made no provider activation, feed download/import, database write, or production change. All 12 modes remain `NOT_VERIFIED_END_TO_END`.

### Latest measurement correction — run 42595606467 (2026-11-09 09:44 UTC)

This newer source-probe artifact supersedes the 05:57 UTC sample above for volatile counts: Kyiv Dozor JSON reported **137** timestamped `vehicles_bus` (previous sample: 186); Zelectra GBFS reported **987** vehicles and **0** stations (previous sample: 992). The status summary remained 83/88 probed, 48 healthy, 14 degraded, 21 offline, 5 skipped. Dozor's data remains bus vehicle positions, not a marshrutka schedule/route; Zelectra remains a nearby inventory candidate without verified return rules or booking.

The same current probe failed Kyiv Open Data metro/funicular/routeTaxi download resources with `Host cannot be resolved`. The official Kyiv data portal currently lists these resources (including routeTaxi GeoJSON and metro GeoJSON/timetable material), shows an Open Data Licence allowing personal or commercial reuse, and lists the dataset updated 2026-10-14. The official resource pages point downloads to `gisserver-stage.kyivcity.gov.ua`; following the resource download from this Mac also failed. Therefore this is a provider endpoint/DNS availability blocker at the moment, not proof the source or data license disappeared. Do not alter resource IDs or invent a mirror. Revalidate after the official resource host recovers. [Official Kyiv transit dataset](https://data.kyivcity.gov.ua/dataset/rozklad-rukhu-miskoho-elektrychnoho-ta-avtomobilnoho-transportu-dep-transport), [official Kyiv marshrutka route geometry resource](https://data.kyivcity.gov.ua/dataset/rozklad-rukhu-miskoho-elektrychnoho-ta-avtomobilnoho-transportu-dep-transport/resource/77325f5c-57d0-4f79-844a-cc73675f9743).

### Provider registry persistence defect — 2026-11-09

Code review found that rerunning the catalog seed command could set any existing provider to `disabled` after a single offline probe, and could re-enable a deliberately disabled/paused provider after a healthy probe. This is a plausible mechanism for feeds disappearing between runs. Fix is isolated in Server PR #127 (`dc69252a48bd2d0a164ee3ab19db564e510bddd9`), not merged: status is now assigned for newly inserted, access-validated rows only; probe results update health/freshness, not an existing administrative status. An offline source remains excluded by health filters, but an enabled entry remains eligible for the health monitor to retry. Exact-head CI is pending; no existing provider row was modified by this work.

### Qoder runtime direct-feed recheck — 2026-11-09 10:21 UTC

Scope: read-only checks against the running Qoder Server and public source endpoints. Qoder Site `411cb45794d70ce744f64099d4d9d3b19d71588a` (`:4202`) and Server `dc1eae7b2095d01d41b6c1c6645c9e4f4d09e5c3` (`:3002`) were not restarted or modified. The current city provider list was read for Lviv, Kyiv and Odesa. A listed provider means registry/discovery only unless a row below explicitly says a live payload was parsed.

| Mode | Current source evidence | Capability proven by this check | Remaining gap |
|---|---|---|---|
| Carpool | Internal MARSHGO provider appears in city catalog | Provider registration only | No two-user route→booking→MarshPass acceptance in this check |
| Marshrutka | No explicit active route provider in city list | None | Kyiv routeTaxi metadata is listed by city portal, but download host currently fails DNS; Dozor vehicle records must not be relabeled marshrutka |
| Bus | Lviv/other-city GTFS catalog entries; Lviv static URL HTTP 200, 3,568,789-byte ZIP, Last-Modified 2026-11-02; Kyiv Dozor parser returned 163 timestamped `vehicles_bus` (8-second age at probe) | Lviv schedule source reachable; Kyiv live bus-position payload parsed | No new GTFS import or exact route→geometry→UI acceptance; Dozor is not a schedule or booking feed |
| Taxi | No connected taxi operator | None | Authorized operator API/credentials and quote/booking support absent |
| Tram | Lviv, Kyiv and Odesa GTFS registry entries | Schedule-source registration | No new trip/geometry/UI replay in this check |
| Trolleybus | Kyiv and Odesa GTFS registry entries | Schedule-source registration | No new trip/geometry/UI replay in this check |
| Metro | No usable feed response in this run; official Kyiv resource host failed DNS | Official resource metadata exists, no payload | Recheck the official download host when DNS recovers; no mirror substituted |
| Train | UZ train/suburban GTFS registry entries | Schedule-source registration | No new route/geometry/UI replay in this check |
| Bicycle | `nextbike_ua` and `veliki_ua` are `ACTIVE_STATIC` | Static location estimates only | No live fleet, confirmed price, network-return rule or booking proof |
| Scooter | Zelectra `ACTIVE_LIVE`; GBFS snapshot at `2026-11-09T10:17:57Z`: 854 retained UA vehicle assets, 138 rejected rows, 0 stations, 300 geofences, 8 price plans; TTL 0, internal stale threshold 30s | Fresh live inventory payload parsed at source | No station in snapshot and no verified return/eligibility/booking; provider health is degraded due to rejected rows |
| Carsharing | No connected operator | None | Operator agreement/API, credentials, geofences and booking absent |
| Transfer | Kiwitaxi CSV/catalog and Intui partner API are `AWAITING_CREDENTIALS`, disabled; BikeNow is `AWAITING_AGREEMENT` | Catalog metadata only | Credentials, agreement, current quote and booking confirmation required |

Other source notes: Kyiv static GTFS metadata points to an HTTP-only endpoint and is currently marked insecure; it was not downloaded/imported. Kyiv routeTaxi/metro resources are documented on the official data portal, but the linked host was unresolved during this probe. The two local walking-router containers are in `Restarting(1)` because `/data/lviv.osrm.*` and `/data/kyiv.osrm.*` are absent, so real street walking geometry is not available from those containers. No source was activated or imported. These statuses describe source evidence, not a 12-mode journey acceptance; all 12 remain `NOT_VERIFIED_END_TO_END`.

## 2026-11-09 21:42 EET — Lviv category evidence reconciliation

| Category | Current evidence | Current user-visible status |
|---|---|---|
| Bus | Lviv GTFS static + GTFS-RT; isolated main-based import reports 55 bus routes in the 72-route feed. | Scheduled route source exists; active runtime does not have a pinned current import. |
| Trolleybus | Same Lviv GTFS; isolated import reports 9 trolleybus routes after explicit label mapping in Server PR #129. | Active runtime has no trolleybus provider group and displays `Тр24` as bus because it is running older Server code/data. |
| Tram | Same Lviv GTFS; isolated import reports 8 routes; active registry exposes a tram provider. | Feed is present, but a tram itinerary for the user's exact query has not been proven; check feasibility, saved preferences and search truncation. |
| Marshrutka | No separate source with operator metadata, licensing and feed contract verified. Eway is a consumer map; checked EasyWay/Dozor endpoints returned 404. | Unavailable in current verified Lviv sources; do not relabel generic buses. |
| Scooter | Zelectra GBFS 3.0 has Kyiv coverage; live snapshot has zero vehicles in Lviv bounds. | No verified Lviv scooter feed. |
| Bicycle | Nextbike public live dataset has no Ukraine/Lviv city; BikeNow rows are static estimates. | Estimate only; no live Lviv rental availability proven. |

The GTFS count above is Qoder's isolated main-based import snapshot, not a fresh import on the active `:7777` server. Active provider API remains on an unpinned/old Server runtime; no production or staging claim follows from this table.

## 2026-11-09 21:49 EET — Shared zrok provider endpoint snapshot

Read-only GET `https://marshgo-dima.shares.zrok.io/api/v1/mobility/providers?lat=49.794117&lon=24.057585` returned HTTP 200. The response lists Lviv bus and tram provider metadata, but no Lviv provider under marshrutka, trolleybus, or scooter. `/healthz` and `/readyz` each returned HTTP 200, without a commit/build identifier. This snapshot must not be treated as live-position or feasible-journey verification.

| Category | Shared endpoint snapshot | Interpretation |
|---|---|---|
| Bus | Lviv provider entry, source `gtfs`, services include `bus`/`tram` | Registry metadata; route search still needs exact journey evidence. |
| Tram | Lviv provider entry, source `gtfs` | Feed reported; feasibility for the user's route is unresolved. |
| Trolleybus | No provider entry | Conflicts with Qoder's isolated 9-route import and current Server main classification; likely stale/missing runtime import, but active SHA/DB are unknown. |
| Marshrutka | No provider entry | No independently verified permitted Lviv feed. |
| Scooter | No provider entry | Zelectra's checked live snapshot had zero Lviv vehicles; no verified Lviv inventory. |

This endpoint check is a single live metadata snapshot. No service restart, database change, source import, or release verification occurred.

## 2026-11-09 22:14 EET — Lviv chain participation clarified

| Mode | Lviv source evidence | Chain status | Why it may be absent |
|---|---|---|---|
| Bus | Lviv GTFS static/RT; Qoder's isolated import reports 55 bus routes. | Feed supports scheduled route legs; exact route query not verified. | Active shared runtime import/SHA is unpinned. |
| Trolleybus | Same GTFS; isolated main-based import reports 9 trolleybus routes, while shared provider endpoint omits this category. | Supported by current Server route normalization; live runtime inclusion not verified. | Likely stale importer/runtime mapping or provider registry; this is suspected, not proven. |
| Tram | Same GTFS; isolated import reports 8 routes and shared registry lists a tram provider. | Transit leg supported; exact trip feasibility not verified. | Origin/destination walking reach, time/calendar, selected preferences, transfer bounds, or search truncation can exclude a route. |
| Marshrutka | No verified distinct Lviv source/route metadata. Generic bus routes are not proof of marshrutka operation. | NOT_AVAILABLE with current evidence. | Needs licensed operator/official route classification or authorized feed. |
| Scooter | Zelectra GBFS snapshot had zero vehicles in Lviv bounds; no other Lviv public GBFS was verified. | NOT_AVAILABLE in Lviv; Server candidate prevents Kyiv assets/global rules from fabricating a Lviv route. | Requires fresh available scooter inventory and applicable zones in Lviv. |
| Bicycle | Existing route estimates use static rental points; live Lviv rental inventory was not verified. | Estimate-only where confirmed provider network/stations exist; no live Lviv claim. | Public Nextbike dataset had no Ukraine/Lviv city; OSM points do not prove stock or booking. |
| Taxi, carsharing, transfer | No connected Lviv public provider feed/contract was verified. | No journey legs proven. | Authorized operator API, coverage, quote and booking contracts are absent. |
| Train | Countrywide UZ GTFS source exists; freshness and Lviv local usefulness are unverified. | Potential schedule leg, NOT_VERIFIED for the current Lviv urban query. | Verify service dates, trips, station and geometry on an exact source snapshot. |
| Metro | No metro in Lviv, per owner instruction. | Not applicable; excluded from Lviv routing. | Do not enable or show as Lviv service. |

Feed availability is distinct from inventory, a feasible trip, booking, and rendered geometry. This table reports source evidence only; it does not claim that all modes work in Lviv.

## 2026-11-09 22:41 EET — Candidate route classification update

The isolated Server candidate emits neutral `bus_unspecified` journey legs for generic GTFS `route_type=3` where no explicit, unambiguous minibus marker exists. The canonical bus filter includes these; marshrutka does not. Extended type `1501` maps to marshrutka. This is parser behavior only: no persistent `route_classification` provenance table or Lviv route-by-route review has been implemented, and the current Lviv snapshot has not been re-imported on a pinned runtime.

| Category | Candidate evidence/status | Live Lviv status | Remaining action |
|---|---|---|---|
| Bus | Generic type-3 leg is represented neutrally and selectable as bus. | Snapshot reports 55 generic bus-class routes; exact itinerary unverified. | Verify exact source snapshot and search; do not call every route a confirmed conventional bus. |
| Marshrutka | Extended 1501 and explicit unambiguous name markers are recognized; generic type 3 is not relabeled. | No separately permitted Lviv feed or current marshrutka route verified. | Review route-level evidence and persist classification provenance before claiming coverage. |
| Trolleybus | Existing mapping includes explicit trolleybus markers; candidate removes stale-count feed pruning. | Isolated import reported 9 routes; shared registry currently omits trolleybus. | Re-import in disposable DB and verify feasible journey on exact SHA. |
| Tram | Existing Lviv GTFS parser and candidate selected-mode search support tram legs. | Isolated import reported 8; shared registry lists tram, but exact journey is unverified. | Verify dated itinerary and rendered geometry. |
| Scooter | Candidate requires fresh available local GBFS inventory and zone rules before emitting a leg. | No Lviv provider/vehicle; checked Zelectra data was Kyiv-only. | Keep unavailable until permitted Lviv source and inventory are proven. |
| Bicycle | Static estimates may exist under confirmed return rules; they do not prove stock or road geometry. | Live Lviv inventory and cycling-route geometry unverified. | Require operator inventory and suitable bike graph for live/accurate claims. |

Candidate remains uncommitted and locally untested; only static diff and worker syntax checks passed. No live runtime or database was changed.


## 2026-11-10 02:30 EET — Lviv all-mode read-only check

Read-only `GET /api/v1/mobility/providers?lat=49.8397&lon=24.0297` returned HTTP 200 with identical provider groups through `127.0.0.1:7777` and direct API `127.0.0.1:3002`. The server `/api/v1/version` returns `commitSha`, `buildId`, and `builtAt` as null and `sourceState=unknown`; the provider result cannot be tied to a verified release SHA. `POST /api/v1/journeys/search` without a session returned 401, as required by `requireAuth`; no authenticated route search or booking was attempted.

| Canonical Lviv category (metro excluded) | Current API registry snapshot | What this proves / what remains unverified |
|---|---|---|
| Попутка | `MARSHGO Community` listed; internal source, no city coverage listed. | Product code/provider listing only. No current Lviv driver offer or passenger-to-driver route was tested. |
| Маршрутка | Empty provider group. | No verified Lviv minibus source or route; do not relabel generic bus routes. |
| Автобус | `Львівавтодор`, GTFS; services list bus/tram. | Schedule source metadata only; no dated feasible itinerary was returned. |
| Таксі | Uklon, Bolt, Opti listed with generic `taxi-ridehailing-api`. | Registry says available, but no authenticated operator API, Lviv quote, fare, or booking was verified. Treat as unverified metadata. |
| Трамвай | `Львівавтодор`, same GTFS source. | Schedule source metadata only; exact trip and route geometry were not replayed. |
| Тролейбус | Empty provider group. | Current runtime does not expose a Lviv trolleybus provider. Earlier isolated feed parsing reported trolleybus-class routes, but that is not current runtime proof. |
| Поїзд | UZ GTFS, nationwide service listing. | No exact Lviv-area rail itinerary, current service-date validation, fare, or ticket availability was tested. |
| Велосипед | BikeNow and Nextbike listed as `static-bike-network-estimate`. | Static estimate locations only; live stock, price, return permission, and Lviv cycling-road geometry are not verified. |
| Самокат | Empty provider group. | No verified Lviv operator inventory or return geofence. Kyiv Zelectra data must not be used as Lviv availability. |
| Каршеринг | Getmancar listing names Kyiv and Dnipro only. | No Lviv coverage; not available for this city based on the current registry. |
| Трансфер | Kiwitaxi and MARSHGO Intercity listed through generic `transfer-api`. | Provider metadata/catalog only; no Lviv quote, credentials, agreement, or confirmed booking. |
| Метро | Explicitly excluded by owner instruction; Lviv has no metro. | Not applicable and must not be enabled for Lviv. |

Targeted Server suite on dirty checkout `antigravity/ukraine-12-transports-multimodal`, HEAD `e9934abbd8fc973177de8d7f47548739758a1b74` (remote Server main is `f61993013e5abf6fbf6afca96bc6eda3d0ff1c27`): 171 tests passed, 0 failed, 0 skipped across 16 files covering GTFS parsing/timetables, mode selection, route planning, provider coverage/license, bus/tram layers, micromobility, fares, transfers, and carpool composition. These are fixture/unit checks and include uncommitted candidate changes; they do not prove that all categories work as live Lviv routes.

Current conclusion: only bus and tram have Lviv GTFS provider metadata in the active registry. No end-to-end live route was verified for any of the 11 categories in this checkpoint. The running API has no build identity, and the protected route-search endpoint requires an authenticated session. Keep metro excluded and do not present taxi/carsharing/transfer metadata as bookable capability.

## 2026-11-10 16:56 UTC — Fresh public-service autocomplete check

- A generic request through the existing zrok API `GET /api/v1/places/suggest?q=Lviv` returned six normalized place suggestions (sample: Львів, 49.841952, 24.0315921). No personal address or authenticated search was sent.
- The same zrok API reports `/healthz=200`, `/readyz=ready`, but version metadata is `environment=development`, `sourceState=unknown`, with null build/commit identifiers. Treat this as unpinned dev evidence only.
- The API response does not reveal which upstream geocoder served suggestions, so source rights/freshness and production reliability remain unverified. Photon’s official repository calls its shared endpoint a demo, says heavy use can be throttled/banned, and gives no availability guarantee; production needs an owner-approved contracted or operated service, not the public demo. [Photon official repository](https://github.com/komoot/photon).
- No production config or credentials were changed. No authenticated route search was attempted.
