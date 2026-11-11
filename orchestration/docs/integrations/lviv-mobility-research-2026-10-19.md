# Львівська мультимодальна мобільність для MARSHGO

**Технічне дослідження джерел даних, прав використання та цільової архітектури**  
**Зріз репозиторію й відкритих фідів: 19 жовтня 2026 року**

## Висновок

Для Львова вже є придатний відкритий GTFS-розклад громадського транспорту. Публічний портал пов’язує набір із Львівською міською радою, вказує ліцензію Creative Commons Attribution та прямо дозволяє комерційне повторне використання за умови атрибуції. Локальна перевірка 19.10.2026 знайшла у статичному фіді 1 071 зупинку, 72 маршрути, 15 716 рейсів і 426 685 записів stop_times. [Портал набору](https://data.gov.ua/dataset/lviv-public-transport-gtfs-real-time) · [datapackage з URI та ліцензією](https://data.gov.ua/dataset/lviv-public-transport-gtfs-real-time/datapackage) · [локальний звіт](../audit/14_TRANSPORT_FEED_SMOKE_2026-10-19.json)

Realtime-ендпоінти віддали коректний GTFS-Realtime Protobuf, але перевірка о 04:09 за київським часом отримала нуль позицій, нуль оновлень рейсів і нуль сповіщень. Це підтверджує доступність і формат відповіді в ту мить, але не live-наповненість у години руху. Потрібні повторні виміри у робочі години до того, як заявляти гарантовані live-позиції чи ETA. [локальний звіт](../audit/14_TRANSPORT_FEED_SMOKE_2026-10-19.json)

Для операторів самокатів/велосипедів, Укрзалізниці, каршерингу й зовнішніх попуток немає підтвердженого production-доступу MARSHGO. Наявність URL, стандарту або адаптера не означає комерційного дозволу, покриття Львова, ціни, бронювання чи доступності місць.

## Перевірка та межі

Є різниця між каталогом і живим URL: data.gov.ua позначає метадані набору як востаннє оновлені 9 січня 2025 року, тоді як feed пройшов локальну перевірку доступності в жовтні 2026 року. Треба моніторити сам feed і підтверджувати актуального власника/умови, а не вважати свіжий HTTP-відгук доказом оновленого паспорта даних.

Висновки спираються на першоджерела специфікацій і державного каталогу, локальні read-only перевірки та фактичний код репозиторію. Smoke 19.10.2026 опитав 38 доступних відкритих URL і окремо перевірив CityBikes, Zelectra та Nextbike; «healthy» означає лише доступність/формат, не права чи роботу в пошуку. [Звіт аудиту](../audit/15_PROVIDER_COVERAGE_2026-10-19.md)

## Джерела й статус даних у Львові

| Категорія | Підтверджене джерело | Що воно дає | Статус і обмеження |
|---|---|---|---|
| Автобуси, трамваї, тролейбуси | [GTFS Львівавтодору](https://track.ua-gis.com/gtfs/lviv/static.zip), [каталог data.gov.ua](https://data.gov.ua/dataset/lviv-public-transport-gtfs-real-time) | Маршрути, зупинки, рейси, календарі, stop-times і форми за наявності відповідних файлів | Підтверджений розклад: 55 автобусних, 8 трамвайних і 9 тролейбусних маршрутів у перевіреному snapshot. route_type=3 не доводить, що це маршрутка. |
| Позиції транспорту | [GTFS-RT Vehicle Positions](https://track.ua-gis.com/gtfs/lviv/vehicle_position) | Координати, bearing, speed, trip/route ID — якщо producer їх передав | Валідний Protobuf; 19.10.2026 entities було 0. Портал не гарантує SLA чи частоту оновлення. |
| Затримки / TripUpdates | [Endpoint у каталозі MARSHGO](https://track.ua-gis.com/gtfs/lviv/trip_updates) | Затримки, прогноз часу, скасування — лише якщо вони є та зіставляються з активним GTFS | Каталог репозиторію і smoke містять URL; паспорт data.gov.ua перелічує ZIP і Vehicle Positions, але не TripUpdates. Підтвердити власника, наповненість, cadence і права саме для цього endpoint. У smoke фід був валідний і порожній. |
| Service Alerts | Стандартна GTFS-RT сутність; окремий активний львівський endpoint у державному каталозі не підтверджений | Детури, перекриття, проблеми сервісу чи доступності — якщо їх публікує транспортний орган | Не виводити підтримку Alerts із наявності стандарту. У перевірених львівських фідах 19.10.2026 Alert entities не було. |
| Залізниця і приміські поїзди | Перевірений у репозиторії [OSM-похідний GTFS mirror](https://jbb.ghsq.de/gtfs/ua-ukrzaliznytsya.gtfs.zip); офіційний продаж — канали УЗ | Mirror може дати орієнтовні зупинки й статичний графік | Це не офіційний фід УЗ і не доказ актуальності, тарифу, місця, факту курсування чи бронювання. Публічний контракт API продажу в перевірених джерелах не знайдений; потрібен письмовий партнерський доступ. |
| Метро | Міської мережі метро у Львові немає | — | Вимкнути metro у каталозі Львова. Не створювати штучні лінії із залізничних або трамвайних даних. Це твердження про послугу, не геологічне пояснення Полтвою. |
| Самокати й велосипеди | Стандарт GBFS; OSM rental points | Поточний стан станцій/транспорту, типи, іноді тарифні плани й геозони | Немає підтвердженого українського live-інвентарю для Львова. nextbike_lv повернув станції в Латвії, nextbike_vin — 404; CityBikes не знайшов мереж в Україні; Zelectra містить змішані координати Києва й Ліми. OSM — лише статичні точки. |
| Каршеринг | Getmancar — потенційний партнер | За контрактом — availability, тариф, pickup/dropoff-зони й deeplink/booking | Робочого B2B endpoint/договору в MARSHGO не підтверджено. Не показувати авто чи тарифи без погодженого каналу, правил кешування та геофенсів. Ціни з чернетки не мають перевіреного джерела. |
| BlaBlaCar: P2P та автобуси | [BlaBlaCar Pro IMS API](https://cdn.blablacar.pro/ims/api/blablacar-pro-ext-api.html); [українська партнерська програма](https://blog.blablacar.com.ua/dlia-partneriv/) | Pro IMS документує пошук і транзакції автобусного інвентарю; P2P API/affiliate має окремі умови | Не переносити властивості bus partner API на P2P. Зовнішнє джерело у MARSHGO не підключене; потрібне партнерське погодження. |
| Таксі | [Uber Riders API](https://developer.uber.com/docs/riders/references/api/v1.2/requests-post); Uklon/Bolt адаптери MARSHGO fail-closed | За наявності прав — estimates, ride request; deeplink передає параметри в зовнішній застосунок | Uber вимагає OAuth і привілейований scope request із Full Access для публічного production. Для інших операторів — окреме підтвердження доступу. У MARSHGO активного quote/dispatch доступу немає. |
| Трансфери | Kiwitaxi read-only каталог та адаптер партнерського URL | Каталог напрямків/класів авто | Не дорівнює live quote, наявності чи бронюванню. Унікальний affiliate ID і production quote відсутні; агрегатори — окремі переговори. |

## Уточнення стандартів і технологій

### GTFS і GTFS-Realtime

GTFS Schedule — пов’язаний набір текстових таблиць у ZIP. routes.txt, trips.txt, stops.txt, stop_times.txt, календарі та за наявності shapes.txt треба узгоджено версіонувати. Файл форм описує шлях конкретних рейсів, а не сам графік руху. [GTFS Schedule Reference](https://gtfs.org/documentation/schedule/reference/)

GTFS-Realtime використовує Protobuf і підтримує сутності VehiclePosition, TripUpdate та Alert. Наявність сутності у специфікації не означає, що конкретне місто публікує її. TripUpdate треба зіставляти з правильним trip і service date; позицію — з route/trip, перевіряючи координати, час спостереження і вік даних. [Огляд](https://gtfs.org/documentation/realtime/) · [Protobuf bindings](https://gtfs.org/documentation/realtime/language-bindings/overview/) · [практики якості](https://gtfs.org/documentation/realtime/realtime-best-practices/)

Не задавати polling 10–15 секунд як властивість фіда: частоту визначають publisher, його умови й політика MARSHGO. У коді вже є server-side poller із типовими 20 секундами та мінімумом 10 секунд. Узгодити частоту з TTL/каденсом джерела й рахувати свіжість за часом спостереження, а не лише за часом HTTP-відповіді.

### GBFS

GBFS — read-only формат публічних даних про поточний/напівпоточний стан. Це не API бронювання і не формат історії поїздок. vehicle_status.json описує поточний стан/позиції; vehicle_availability.json, доданий у v3.1-RC2, описує майбутню доступність vehicle, зарезервованих наперед, і не замінює поточний vehicle status. [Опис GBFS](https://github.com/MobilityData/gbfs) · [специфікація](https://github.com/MobilityData/gbfs/blob/master/gbfs.md)

На 19.10.2026 MobilityData позначає v3.0 як поточну рекомендовану версію, v3.1-RC3 як release candidate, а v2.3 як підтримувану. Клієнт має читати version і discovery gbfs.json, брати реальні URL із feeds[] і не конструювати адреси за припущенням. GBFS 3.0 містить license_id/license_url, але ліцензію та умови треба оцінювати для конкретного producer і набору. Відкритий протокол сам собою не дає дозволу на комерційне кешування.

### Маршрутизація й карта

MapLibre GL JS — renderer векторної карти, не мультимодальний timetable planner. [Плагін maplibre-gl-directions](https://github.com/maplibre/maplibre-gl-directions) працює з OSRM- або Mapbox Directions API-сумісними дорожніми бекендами й надає waypoints і кілька профілів геометрії. Він не рахує пересадки за розкладом, календарями, trip ID, тарифними правилами чи RAPTOR. Для транзитного пошуку потрібен серверний planner або окремий OTP-подібний рушій на базі OSM і GTFS. [OTP data sources](https://opentripplanner.readthedocs.io/en/latest/Interfaces-Data-Sources/)

Офіційний [MapLibre приклад](https://maplibre.org/maplibre-gl-js/docs/examples/animate-a-point-along-a-route/) демонструє Turf для анімації точки вздовж лінії. Для транспорту це лише візуальна інтерполяція між вимірами — не новий GPS факт і не ETA. Обмежувати екстраполяцію часом; прив’язувати до shape лише за впевненого зіставлення trip/shape; зупиняти анімацію або показувати STALE після порогу свіжості чи при відхиленні від форми. Для щільних шарів не використовувати окремі DOM-маркери на кожний vehicle.

## Стан MARSHGO в репозиторії

**Вже реалізовано:** React/Vite клієнт, MapLibre, PostgreSQL/PostGIS, Redis, каталог mobility providers, парсер і перевірка GTFS, GTFS-RT Protobuf parser, server-side poller, in-process VehiclePositionCache, REST snapshot /api/v1/transit/vehicles і SSE /api/v1/transit/live-stream. Браузер не опитує зовнішні фіди напряму. [gtfs.ts](../../server/mobility/gtfs.ts) · [vehiclePositionCache.ts](../../server/mobility/vehiclePositionCache.ts) · [realtimePoller.ts](../../server/mobility/realtimePoller.ts) · [ukraineCatalog.ts](../../server/mobility/ukraineCatalog.ts) · [index.ts](../../server/index.ts)

**Межі поточної реалізації:** polling cache перебуває в пам’яті процесу; за кількох API інстансів можливі дубльовані запити й різні snapshots. SSE підписники отримують broadcast від активних фідів; routeIds/city зберігаються, але перед розсилкою не застосовуються як фільтр. GTFS live-покриття та пошук мають обмеження з [матриці провайдерів](../PRODUCTION_PROVIDER_MATRIX.md): пошук може бути обрізаний, а тарифи й квитки не підтверджені. У залежностях немає Turf.js чи directions plugin — карта має власну реалізацію.

## Цільовий потік даних

~~~text
GTFS ZIP ──► ingest/validate ──► versioned GTFS snapshot ──► timetable planner
                                  │
GTFS-RT VP/TU/Alerts ─► poller ─► normalized observations ─► Redis/shared snapshot
                                                           ├─► REST initial snapshot
                                                           └─► SSE deltas by city/route/viewport
GBFS ────────────────► partner adapter ───────────────────► inventory only when licensed
partner API ─────────► isolated connector + credentials ──► quote/reservation/booking
~~~

1. **Реєстр джерел як контракт.** Для кожного джерела зберігати ідентифікатор, місто/геозону, власника, тип і URL, версію схеми, ліцензію та посилання на умови, атрибуцію, дозвіл на комерційне використання/кешування, TTL/частоту, останню перевірку, час завантаження й спостереження, кількість записів, capabilities та причину blocked/degraded. Статуси OPEN і HEALTHY не означають commercially approved.

2. **Статичний GTFS — версійований ingest.** За розкладом завантажувати з conditional HTTP, рахувати hash, валідувати ZIP і required files, календарі й часову зону, координати, унікальність ID та зв’язки маршрутів, рейсів, stop-times і зупинок. Нову версію публікувати атомарно; при помилці залишати last-known-good. Зберігати період дії версії, щоб GTFS-RT зв’язувався з відповідним графіком. Стопи й форми індексувати просторово; stop-times і календарі — за trip, stop, service date і часом. Не завантажувати повний дорожній граф у мобільний клієнт.

3. **Realtime — події з походженням і віком.** Окремо парсити VP, TU й Alerts; зберігати observation timestamp та fetch timestamp. Дедуплікувати за provider + vehicle ID + feed version. Невалідний, порожній і застарілий фід — окремі стани. Порожній фід не обов’язково означає збій формату, але його не можна показувати як інвентар із транспортом. Визначити stale threshold за виміряним cadence; після порогу знижувати точність до «за розкладом».

4. **Спільний кеш і доставка.** Для кількох API інстансів винести polling в один worker/leader із lock/lease та backoff. Останній нормалізований snapshot ділити через Redis; PostgreSQL зберігає статичні довідкові дані й потрібний аудит, а не кожен частий GPS пакет. REST віддає початковий snapshot із bbox/route filter; для переважно односторонніх оновлень достатньо SSE. Сервер має фільтрувати за viewport, містом і route, обмежувати розмір пакета та підтримувати reconnect із повторною видачею snapshot. WebSocket не потрібний лише заради односторонніх координат.

5. **Пошук через capabilities.** Пішохідні підходи та дорожні відрізки рахувати окремо; громадський транспорт — за GTFS/GTFS-RT planner. Розклад і геометрію не перетворювати на ціну, місце чи квиток. Вмикати мікромобільність у пошук лише після підтвердження локального фіда, доступності, pickup/dropoff/geofence, прав і ціноутворення.

6. **Ліцензії й атрибуція.** Для львівського набору показувати власника «Львівська міська рада» й посилання на сторінку data.gov.ua. Умови зберігати для кожного feed окремо; не переносити CC BY з міського набору на партнерський API чи інший GBFS.

## Пріоритет робіт

| Пріоритет | Результат | Критерій готовності |
|---|---|---|
| P0 | Лишити львівський GTFS основою розкладу; додати freshness/empty/parse-error метрики й атрибуцію | Історія health, окремий моніторинг у години руху, last-known-good та чіткий fallback «за розкладом» |
| P0 | Підтвердити TripUpdates та Alerts із власником | Підтверджені URL, частота й права; коректне зіставлення з GTFS; метрики наповненості |
| P1 | Довести planner до перевірюваної повноти | Усунути searchTruncated для приймальної OD/time матриці або явно показувати неповноту; перевірити пересадки, after-midnight, календар і detours |
| P1 | Зробити live-доставку безпечною для кількох інстансів | Єдиний poller/lease, shared snapshot, SSE з фільтрацією маршруту/міста/viewport і reconnect |
| P2 | Підтвердити операторів мікромобільності Львова | Офіційний URL, географія за координатами, ліцензія, тариф, geofence і deeplink; до того provider вимкнено в пошуку |
| P2 | Підключити комерційні API | Погоджені умови, production credentials, security review, capabilities, атрибуція, SLA та комерційна схема для кожного оператора |

## Корекції початкової чернетки

- vehicle_status.json — поточна назва колишнього free-bike status. vehicle_availability.json має іншу семантику майбутньої доступності й доданий у v3.1-RC2.
- Назви Bolt, Dott і Nextbike URL не доводять покриття Львова. Локальні перевірки велосипедних кандидатів знайшли географічно хибні/недоступні фіди; актуальні Bolt/Dott URL і умови в MARSHGO не підтверджені.
- Не приписувати GBFS автоматичний дозвіл на комерційне використання. Перевіряти ліцензію кожного producer/feed.
- Не заявляти, що кожен львівський GTFS-RT endpoint надає VP, TU й Alerts. Data.gov.ua перелічує static ZIP і Vehicle Positions; у каталозі MARSHGO є TripUpdates URI, але snapshot 19.10.2026 був порожній.
- Не називати УЗ, Getmancar, Uklon, Bolt або P2P BlaBlaCar відкритими підключеними API. Uber має Riders API, однак production-запит поїздки потребує OAuth і привілейованого доступу зі схваленням. Для інших операторів окремо підтвердити актуальні партнерські програми. [Uber scopes](https://developer.uber.com/docs/riders/guides/scopes) · [Ride Request API](https://developer.uber.com/docs/riders/references/api/v1.2/requests-post)
- Не вносити тарифи Getmancar із чернетки без датованого офіційного джерела чи quote. Показувати підтверджену ціну з валютою, часом отримання й терміном дії або позначати її відсутньою.
- Не ототожнювати MapLibre directions plugin із транзитним planner: він відображає дорожні directions; пересадки за розкладом лишаються серверним завданням.
- Не стверджувати, що скрапінг неодмінно призведе до миттєвого блокування IP, якщо немає зафіксованих доказів. Достатньо класифікувати непогоджений scraping як непідтримувану інтеграцію з невідомими умовами й ризиками.

## Першоджерела

- [Data.gov.ua: набір Львівської міської ради та правила повторного використання](https://data.gov.ua/dataset/lviv-public-transport-gtfs-real-time)
- [Data.gov.ua datapackage: ресурси фіда та CC-BY metadata](https://data.gov.ua/dataset/lviv-public-transport-gtfs-real-time/datapackage)
- [GTFS Schedule Reference](https://gtfs.org/documentation/schedule/reference/)
- [GTFS-Realtime Overview](https://gtfs.org/documentation/realtime/) і [Realtime Best Practices](https://gtfs.org/documentation/realtime/realtime-best-practices/)
- [MobilityData: статус версій GBFS](https://github.com/MobilityData/gbfs) та [текст специфікації](https://github.com/MobilityData/gbfs/blob/master/gbfs.md)
- [MapLibre: animation along a route](https://maplibre.org/maplibre-gl-js/docs/examples/animate-a-point-along-a-route/) і [MapLibre GL Directions](https://github.com/maplibre/maplibre-gl-directions)
- [OpenTripPlanner: data sources](https://opentripplanner.readthedocs.io/en/latest/Interfaces-Data-Sources/)
- [Uber Riders API scopes](https://developer.uber.com/docs/riders/guides/scopes)
- [BlaBlaCar Pro IMS API документація](https://cdn.blablacar.pro/ims/api/blablacar-pro-ext-api.html)
- [Локальний аудит інтеграції Львова](./lviv.md), [матриця провайдерів](../PRODUCTION_PROVIDER_MATRIX.md), [звіт provider coverage](../audit/15_PROVIDER_COVERAGE_2026-10-19.md).
