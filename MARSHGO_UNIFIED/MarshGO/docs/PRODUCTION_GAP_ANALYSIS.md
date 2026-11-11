# MARSHGO production gap analysis

> **Актуальність:** заголовок і основна інвентаризація нижче — історичний зріз від 13.10.2026, не поточний стан. Її висновки/гілки не є чинним release tuple. Поточні шість репозиторіїв, точні SHA, PR-залежності, dirty worktree та актуальні production blockers зафіксовані у [інвентарі](REPOSITORY_INVENTORY.md), [PR-графі](PR_DEPENDENCY_DAG.md), [матриці реалізації](IMPLEMENTATION_MATRIX.md) й [аудиті 217](audit/217_CANONICAL_REPOSITORY_AND_PR_INVENTORY_2026-10-26.md). Жодні інші репозиторії не входять до актуального 5+1 scope.

Дата перевірки історичного зрізу: 13.10.2026. Інвентаризація тоді виконана на локальних робочих гілках після fetch віддалених main. Це стан коду й документів, а не доказ розгорнутого production.

## Перевірені репозиторії

| Репозиторій | Локальна гілка / SHA | Відносно origin/main | Робоче дерево | Висновок |
|---|---|---:|---|---|
| MarshGO | codex/marshgo-production / 10f8b93 | 307 ahead / 0 behind | Локальні скриншоти, інструменти й тестові зміни залишені як є; робочі дерева не очищались | Umbrella-код і cross-repo acceptance. Не архівувати до завершення міграції. |
| MarshGO-Site | codex/sync-journey-mobility-ui / cc5c198 | 75 ahead / 2 behind | Є незакомічені зміни цього завдання | Має production React UI, MapLibre, Journey results/detail та theme. Гілка істотно відрізняється від main; не скидати її. |
| MarshGO-Server | codex/sync-mobility-registry / 8d4232a | 63 ahead / 0 behind | Є незакомічені зміни цього завдання | Має наявні API, Postgres/PostGIS, Redis, Journey, booking, realtime та provider adapters. Production credentials/infra не налаштовані. |
| MarshGO-iOS | codex/reliable-capacitor-sync / b58b243 | 33 ahead / 0 behind | Clean | Спільний Capacitor shell. Simulator не доводить фізичні дозволи, background GPS, APNs або App Store readiness. |
| MarshGO2 | main / 8542f4b | 0 ahead / 0 behind | 26 незакомічених змін | Лише читання під час цієї роботи; дизайн-концепти не є production джерелом даних. |

Fetch не зливав і не перемикав гілки. Незакомічені файли MarshGO та MarshGO2 збережені.

## Що вже є

| Область | Підтверджена основа |
|---|---|
| Production UI shell | Site entry рендерить server-backed ProductionMarketplace; legacy UI відділена від production entry. |
| Результати поїздок | JourneyResultsPanel має три стратегії, ціни/unknown state, пересадки та сегменти з тривалостями. На картці видно коротку назву режиму, номер рейсу лишається в доступному описі, а піктограма оптимізації береться з rank=1 серверної стратегії. |
| Карта й деталі | JourneyRouteMapScreen має MapLibre, активний сегмент, синхронізовані картки/таймлайн і три snap points. |
| Тема | Сервіс system/light/dark є; існуючі екрани мають темні semantic styles. |
| Серверні операції | Site використовує productionApi; Server має авторизацію, booking, demand/proposals, messages, navigation та realtime contracts. |
| Маршрутизація й карта | MapLibreAdapter, MapLibre style manifest contract, tile health/error states і server routing adapter існують. |
| Підбір поїздок | Server search об'єднує GTFS timetable/realtime, fare rules, обмеження пересадок і підходів пішки, Community rides, Pareto frontier та ранжування BALANCED/FASTEST/CHEAPEST. Реальний львівський статичний feed успішно прочитано й перевірено HTTP-пошуком на ізольованій БД; результат чесно позначив невідомі walking/fare/realtime дані та обмеження пошуку. |

## Розриви до цільового продукту

| Пріоритет | Статус | Розрив | Потрібна робота |
|---|---|---|---|
| P0 | PARTIAL | Playwright має regression snapshots для results light/dark, route map light/dark collapsed/half, dark expanded і navigation. Тест також порівнює layout geometry між темами та перевіряє, що вибраний сегмент повністю видно й центровано над sheet. Goldens ще не порівнюються з crop-ами референсних фото; pixel accuracy не доведена. | Підготувати узгоджені reference crops для однакових viewport-ів і контенту, виконати overlay/diff, далі довести типографіку, щільність карток і map styling. |
| P0 | PARTIAL | Спільний `transportModeRegistry` створено й підключено до results, легенди, route labels, transport catalog та map route/layer mapping. Повне візуальне приймання 12 піктограм і стилів ще відсутнє. | Додати каталог режимів у screenshot acceptance та звірити назви, glyph-и, кольори й accessibility labels з фото. |
| P0 | PARTIAL | Для Фото 1 додано navigation-variant шару карти, кнопку 2D/3D та E2E зі справжнім navigation API й локальним OSRM fixture. У повному вигляді ще немає референсних map overview/route selection/HUD, а поточна raster fixture не схожа на карту з фото. | Довести світлий overview → route preview → active maneuver і панель шарів на погодженому style provider; зберегти реальну server route geometry. |
| P0 | PARTIAL | GTFS search лишається bounded і повертає `partial`; до останньої зміни DFS міг заповнювати список лише ланцюжками з максимальною кількістю пересадок. Відбір тепер резервує бюджет і кандидатів для різної кількості ділянок, але global optimum не доведений. | Замінити bounded enumeration на multi-label/RAPTOR-подібний пошук із вимірюваним latency SLO та повною перевіркою Pareto-альтернатив на реальних feeds. |
| P0 | BLOCKED_EXTERNAL | Реальні production map tiles/style manifest і контракт/атрибуція не налаштовані. Live renderer probe не є SLA. | Обрати contracted або self-hosted vector provider, версіонувати manifest і перевірити права на cache/offline. |
| P0 | BLOCKED_EXTERNAL | SMS, production geocoder/routing origin, private S3, HTTPS domain і managed DB/Redis не налаштовані. | Налаштувати обрані провайдери у secret manager і staging; секрети не передавати у VITE_* або Git. |
| P1 | PARTIAL | Реальний львівський static GTFS feed віддав автобусні й трамвайні розклади; realtime endpoints відповіли порожніми даними. Ліцензія, власник, оновлення й production freshness/SLO ще не прийняті. | Зафіксувати умови використання та update monitor; під'єднати непорожні TripUpdates/VehiclePositions або показувати розклад без LIVE; перевірити інші міста/режими. |
| P1 | PARTIAL | Reconnect і server state є; повний push delivery, alerting, provider latency/freshness metrics та operational runbooks не закриті. | Додати/налаштувати Web Push/APNs, зовнішні error/metric alerts, черги/outbox health, feed freshness та incident workflow. |
| P1 | PARTIAL | iOS simulator збирається, але фізичний GPS/permissions, session restore, background strategy, push, signing і release metadata не підтверджені. | Погоджений physical iPhone acceptance і signed release pipeline. |
| P1 | PARTIAL | Cross-browser and functional E2E не дорівнюють production staging acceptance. | Прогнати exact-SHA paired-account, reconnect, provider failure, migration/restore та real-device acceptance на staging. |
| P2 | DISABLED_BY_DESIGN | Онлайн-платежі й commercial settlement не налаштовані; Community fee 0% не означає наявність платіжного процесингу. | Увімкнути лише після власника, договору, реального processor і затверджених business rules. |

## Візуальна матриця

Детальні відповідності фото, станів, API та тестів наведені в [UI Reference Matrix](./UI_REFERENCE_MATRIX.md). Фото не є джерелом тарифів або доступності.

## Перевірка алгоритмів підбору маршрутів

Production `/api/v1/journeys/search` використовує GTFS timetable engine та Community composer; результати проходять перевірки fare/transfer constraints, Pareto selection і ранжування стратегій. Тести охоплюють чотири транспортні сегменти й три пересадки, початкове очікування, нічний GTFS час, правила пересадки/платформи, різні timezone/provider feeds, затримки/скасування GTFS-Realtime та невідомі тарифи. Selection враховує відомий comfort як Pareto-вимір; невідомий comfort не прирівнюється до виміряного. Окремий planner helper відхиляє циклічні ланцюжки вузлів; HTTP endpoint напряму його не викликає.

### Реальний львівський feed і HTTP-пошук

13.10.2026 статичний GTFS із каталогу України успішно завантажився та пройшов parser: 1,071 зупинка, 72 маршрути (64 автобусні й 8 трамвайних), 15,716 рейсів і 426,685 stop-times. У поточному статичному фіді немає міської залізниці, метро або тролейбуса. Два доступні GTFS-Realtime endpoints на попередньому health probe відповідали, але не містили даних; отже перевірений пошук спирається на розклад, не на live-позиції.

На ізольованій локальній БД через справжній HTTP `/api/v1/journeys/search` повторно перевірено вул. Мало-Голосківська, 24 → вул. Стрийська, 32, 14.10.2026 о 08:00 за Києвом, з дозволеними `bus` і `tram`. Пошук упорядковує початкові рейси за часом готовності пасажира й обмежує перебір кожної стартової гілки, щоб порядок записів у feed не забирав увесь бюджет. Відповідь містила реальний 74-хвилинний ланцюжок автобус А37 → трамвай Т09 → трамвай Т08 → трамвай Т08, із трьома пересадками та 593 м пішки. Час усіх послідовних сегментів монотонний.

Після останніх змін відбір кандидатів повторно пройшов через актуальний `MarshGO-Server` checkout і реальний HTTP endpoint на ізольованій `marshgo_e2e` БД (14.10.2026, 08:00 за Києвом, ті самі координати OD, `bus` + `tram`, до 3 пересадок). HTTP 200 повернув 6 варіантів; найкращий за часом у відповіді — той самий А37 → Т09 → Т08 → Т08 за 73 хв 44 с. В усіх чотирьох транзитних сегментах є `routeGeometry` та `stops[]`; для першого ланцюжка довжини shape — 175/10/13/61 точок, stop-times — 12/2/2/8 (10/0/0/6 проміжних). Кінці всіх чотирьох shape збігаються з посадкою/висадкою з похибкою 0 м. На шести повернутих альтернативах перевірено 24/24 транзитні відрізки з geometry та списком зупинок.

Перший API journey передано безпосередньо в Site `buildJourneyRouteMapModel`: модель сформувала 6 окремих map segments — чотири shape громадського транспорту з кольорами автобуса `#1687FF` і трамвая `#F43F7B`, плюс два пунктирні walking estimates `#91A6BB`; `missingShapeCount=0`, 23 унікальні waypoint-и. Playwright `journey-route-map.spec.ts` окремо підтвердив вибір сегмента, його колір та zoom-to-segment на детермінованій карті. Пошук був `partial=true` через обмежений обхід і відсутню точну пішу маршрутизацію, не лише через те, що GTFS-рейси є розкладними.

Site map model зібрав 6 окремих GeoJSON route segments: чотири рейсові форми GTFS на 175, 10, 13 і 61 точках, та два пунктирні наближені пішохідні конектори. Кінці кожної транзитної лінії збігаються з координатами її посадки/висадки з похибкою 0 м; `missingTransitShapes=0`. Кольори відповідають реєстру режимів: автобус синій, трамвай рожевий. Пішохідний routing provider не налаштований, тому connectors чесно позначені як оцінки.

Контрольний HTTP-прогін до останнього налаштування бюджету повернув `candidateGenerationTruncated: true` та `partial: true`: GTFS enumerator розглянув 7,289 кроків, зібрав 1,000 варіантів (тодішній ліміт `limit × 10`) і передав 100 альтернатив далі в endpoint. Після серверних фільтрів лишилося 5 Pareto-маршрутів (`candidateCount=100`, `paretoCount=5`, `returnedCount=5` у відповіді); доступні стратегії — BALANCED і FASTEST. CHEAPEST не показувався, бо feed не дає надійної ціни. Теплий HTTP-повтор відповів за 2.2 с; перший виклик після старту процесу — за 11.8 с, тож перший запит і холодне завантаження фіду ще потребують окремого SLO. Відповідь містить `blockedProviders` для walking та режимів без налаштованого routed provider, а UI показує попередження для обрізаного пошуку. Це підтверджує працездатне автобусно-трамвайне стикування, але не повний перебір і не глобальний оптимум.

Після цього збільшено внутрішню стелю кандидатів з `limit × 10` до `limit × 25`, не змінюючи жорсткий бюджет у 10,000 кроків. Прямий профіль GTFS engine на тому самому реальному feed зібрав 1,079 кандидатів за 10,000 кроків, повернув 100 за 1.965 с і все ще позначив пошук як обрізаний. Найкращий знайдений варіант лишився 74-хвилинним А37 → Т09 → Т08 → Т08. Це вимір саме актуального engine, не повторний HTTP-прогін після зміни cap; воно показує, що наступний blocker — перебір/порядок пошуку, а не ліміт видачі кандидатів. Глобальний оптимум не доведений.

У наступному проході бюджет обходу зріс до 50,000 кроків із окремою межею 64 кроки на кожну стартову гілку та збереженням найкращих кандидатів за часом, відомою ціною, кількістю пересадок, пішою відстанню й балансом. Прямий профіль того самого реального feed з API-обмеженнями (6 годин маршруту, до 4 годин очікування, максимум 3 пересадки; 14.10.2026, 08:00 за Києвом) завершився за приблизно 2.57 с: 26,457 кроків, досягнуто межі 2,500 внутрішніх кандидатів, endpoint-ліміт для цього профілю — 100. Повернутий найшвидший відомий ланцюжок лишився А37 → Т09 → Т08 → Т08 за 73 хв 44 с. `searchTruncated=true` і `resultLimitReached=true`: алгоритм явно повідомляє про неповний перебір; підняття межі не доводить глобальний оптимум. Це профіль прямого engine, не HTTP-виклик після останньої зміни. Перед релізом потрібні контрольований multi-label/RAPTOR-подібний алгоритм і повторний HTTP-прогін із заміром cold/warm latency та перевіркою різних цілей.

Окремо перевірено transfer continuity: А37 прибуває на «Шухевича (30)», Т09 відправляється з тієї самої зупинки через 6 хв; Т09 → Т08 з’єднані на «Саксаганського (36)» через 3 хв; наступний Т08 — на «Площа Франка (311)» через 5 хв. Усі три міжрейсові gaps — 0 м, кінці кожної GTFS shape — 0 м від відповідних API stop coordinates, часи монотонні. Отже показаний chain має просторово й часово сумісні пересадки; загальна повнота альтернатив усе ще обмежена.

MapLibre selection E2E на детермінованій геометрії окремо вибрав автобус, трамвай і метро: активний сегмент отримав mode-color, решта ліній приглушувалася, а камера кадрувала форму вибраного сегмента. Для тестових bus і metro shapes зафіксовано збільшення zoom відносно огляду маршруту. Метро тут підтверджене лише як підтримуваний UI/тип даних; воно відсутнє в перевіреному Lviv GTFS і не є реальним львівським сегментом.

### Деталізація зупинок за сегментами

Повторне читання реального Lviv GTFS 13.10.2026 підтвердило для знайденого маршруту повні stop-time зрізи між посадкою та висадкою: А37 `31183_1_0` — 12 зупинок (10 проміжних), Т09 `28152_1_1` — 2 кінцеві, перший Т08 `28795_1_0` — 2 кінцеві, другий Т08 `27979_2_0` — 8 зупинок (6 проміжних). Їхні `block_id` — `31183`, `28152`, `28795` і `27979`; сусідні Т08 мають різні block ID, тому це реальна пересадка. У фіді немає правила `transfer_type=4`, яке означало б продовження поїздки тим самим транспортним засобом.

У Site вибір розкладного сегмента розгортає його картку, а expanded sheet розгортає всі розкладні картки; UI перебирає весь список `stops[]`, показує час кожного виклику й окремо маркує посадку та висадку. Браузерний E2E на актуальних робочих Site/Server checkout пройшов 1/1: проміжна зупинка та фокус/колір сегмента перевірені для BUS, MINIBUS, TROLLEYBUS, TRAM, METRO, RAIL, FERRY і FUNICULAR. Пором і фунікулер у цьому E2E — UI-фікстури; production Lviv feed цього запуску надає тільки bus і tram, без metro, trolleybus або міської залізниці.

У двох GTFS-сегментів без проміжної зупинки (Т09 і перший Т08) фід справді містить тільки посадковий та висадковий stop-time, тому UI не додає неіснуючих викликів. Для таксі, попутки й мікромобільності GTFS stop-times не застосовуються: там мають показуватися provider geometry та точки pickup/dropoff; E2E окремо підтвердив це для scooter-сегмента.

Release manifest досі закріплений за Server `4e32ac3e…` і Site `570ea7b9…`; актуальні робочі checkout на момент перевірки — Server `8d4232a2…` і Site `cc5c1988…`, обидва з незакоміченими змінами. Раніший pinned E2E зупинився на старому assertion значка «Найшвидший». Після локальної перебудови з ізольованим map manifest браузерний E2E на актуальних робочих checkout пройшов 1/1. Release pin не оновлювався, бо ці робочі зміни ще не мають перевіреної та зафіксованої release ревізії.

### Оновлення перевірок пошуку й completeness, 13.10.2026

Server тепер повертає `partialReasons`: `candidate_generation_truncated`, `provider_error`, `unsupported_preference` та `walking_routing_unavailable`. Наявність маршруту лише за розкладом або Community-кандидата сама по собі більше не виставляє `partial`; порожній список також може бути повним, якщо перевірені всі джерела. Стан scheduled/live лишається окремим на кожному сегменті.

Фіксований HTTP-пошук через актуальний Server повторно повернув 6 маршрутів. Найшвидший: автобус А37 → трамвай Т09 → Т08 → Т08, 4,424 с, 3 пересадки. У кожному з 4 транзитних сегментів є route shape та stop calls; shape endpoints мають похибку 0 м, а виклики зупинок ідуть за часом. Пошук чесно повернув `partialReasons=[candidate_generation_truncated, walking_routing_unavailable]`: глобальний оптимум не гарантований, пішохідні підходи приблизні.

Окремий opt-in HTTP integration сценарій тепер перевіряє змішане `bus + tram`, а не вимагає неіснуючого прямого tram-only маршруту. Він пройшов 1/1: із 12 категорій bus/tram мають доступні feed-кандидати, carpool прийшов з Community offer, недоступні для цього коридору категорії не були вигадані, а відповідь `bus→tram` містить геометрію та посадкові/висадкові виклики. Фіксований час пошуку — наступний ранок у часовій зоні Kyiv.

Перевірка `partialReasons` через HTTP також пройшла: запит лише на відсутній у Lviv feed `metro` повернув HTTP 200, 0 маршрутів, `partial=true` і причину `unsupported_preference`.

### Контроль для адреси користувача та часу пошуку, 13.10.2026

Геокодер повернув дві близькі точки для перехрестя «Стрийська—Наукова»; у замірі нижче використано перший результат. Старт: «Малоголосківська, 8Є» `[24.0041473, 49.8662447]`; фініш `[24.0175835, 49.8013165]`; відправлення — 14.10.2026 о 08:00 за Києвом. Перевірявся саме статичний GTFS engine для всіх фактично наявних у цьому feed автобусних і трамвайних режимів, без Community, realtime або зовнішньої пішої маршрутизації.

Після зміни перебору кандидатів один пошук повернув 100 показуваних варіантів із 400 кандидатів, що пройшли ранжування; серед видимих 100 було 38 різних послідовностей номерів маршрутів. Вони розподілилися за кількістю пересадок так: 38 із однією, 28 із двома, 20 із трьома та 14 із чотирма. За послідовністю транспортних режимів: автобус→автобус — 38; три автобусні ділянки — 28; чотири автобусні — 20; п’ять автобусних — 12; автобус→автобус→автобус→трамвай→автобус — 2. Прямих варіантів у цьому вікні розкладу не знайшло; фід не містить тарифу, тому вкладку «Найдешевший» цей пошук підтвердити не може.

У повторних холодних запусках завантаження/розбір фіду зайняли 4.36–7.29 с, а саме обчислення — 2.44–3.01 с. Це прямі вимірювання GTFS engine без геокодування, HTTP API, рендерингу карти та мережевої затримки карти; повний холодний прохід у цих запусках склав приблизно 6.8–9.7 с. Відповідь лишилася `searchTruncated=true` і `resultLimitReached=true`: це вибірка, не точна загальна кількість можливих ланцюжків і не гарантія глобального оптимуму.

Для 100 повернутих варіантів перевірено всі 310 транзитних сегментів: кожен мав GTFS shape, кінці всіх геометрій збіглися з координатами посадки/висадки, помилок послідовності stop-times не було; у деталях було 2,004 проміжні зупинки. Перевірки Site на детермінованій MapLibre-карті окремо підтверджують колір і zoom-to-segment; цей контроль не є production-provider або pixel-identity прийманням живої карти.

Повний локальний integration harness після підняття тестового Redis пройшов без помилок на loopback `marshgo_e2e`: Journey schema 2/2, booking/trip lifecycle 21/21, navigation 2/2, Redis realtime між двома API 1/1, restart persistence 1/1 та shared rate limits 1/1 — разом 28/28, без пропусків. У booking run підтверджено змішаний bus→tram пошук, Community пропозицію, атомарне бронювання останнього місця серед 20 конкурентних акаунтів, idempotent cancellation, rendezvous та перевірки driver/vehicle authorization. Це локальні інтеграційні дані, не staging acceptance.

Локальна БД зберігала provider health report від 03:29 UTC: на момент probe він показував 246 TripUpdates, 283 VehiclePositions та 0 Alerts. Станом на 03:55 UTC 13.10.2026 цей report старший за 25 хвилин. Поле `health=healthy` не є доказом свіжого realtime; production freshness має спиратися на новий timestamp кожного feed.

## Порядок робіт

1. Зафіксувати нові референси та transport mode registry у Site.
2. Звірити Results → Route Map → Details із реальними reference crops в обох темах; regression snapshots уже зафіксовані, але не є візуальним прийманням.
3. Довести Фото 1 navigation overview/preview/HUD/layers; active route geometry і окремий navigation layers sheet уже перевіряються на локальному fixture.
4. Завершити provider selection/configuration та провести staging acceptance.
5. Завершити iOS physical-device/release gates.

Статуси й зовнішні блокери узгоджені з [RELEASE_STATUS.md](./RELEASE_STATUS.md), [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md), Server [PRODUCTION_PROGRESS.md](../MarshGO-Server/docs/PRODUCTION_PROGRESS.md) та iOS [IOS.md](../MarshGO-iOS/IOS.md). Production readiness зараз: **NO**.

## Перевірки цього проходу

- Site: lint і typecheck пройшли; 65 unit tests пройшли; production build і bundle budget пройшли. MapLibre chunk — 274.5 KB gzip.
- Server: lint/typecheck пройшли; `npm test` — 169 passed, 1 opt-in integration skipped; повний ізольований `npm run test:integration` — 28/28 без пропусків.
- Root: раніше в цьому завданні lint/typecheck і 231 unit test пройшли, 1 opt-in integration skipped.
- HTTP route search на реальному Lviv static GTFS (профіль до останнього cap tuning): 73 хв 44 с, bus A37 → tram T09 → T08 → T08; перевірено 4 транзитні shape, нуль відсутніх або зміщених кінців, усі часи послідовні. Пошук partial: 1,000 GTFS-кандидатів зібрано за 7,289 кроків, endpoint передав 100 на наступний етап і повернув 5 Pareto-альтернатив.
- Повторний HTTP route search на актуальному `MarshGO-Server`: HTTP 200, 6 альтернатив, найшвидша — 73:44, A37 → T09 → T08 → T08, 3 пересадки; 24/24 транзитних сегментів у відповіді мають geometry і stop-times. Для першої альтернативи Site map model створив 6 сегментів (4 точні GTFS shapes + 2 пунктирні walking estimates), 23 waypoint-и, без відсутніх transit shapes. Відповідь залишилась `partial=true`.
- Прямий профіль engine на проміжному cap tuning: 10,000/10,000 кроків, 1,079 кандидатів, 100 виданих, 1.965 с; `searchTruncated=true`. Це історичний прямий профіль до наступного підняття меж.
- Останній прямий профіль engine після підняття меж: 26,457 кроків із 50,000, досягнуто 2,500 внутрішніх кандидатів; 100 виданих, близько 2.57 с; `searchTruncated=true`, `resultLimitReached=true`. Подальший HTTP прогін на актуальному Server checkout виконаний і задокументований вище; найшвидший відомий ланцюжок збережено, але глобальний оптимум не гарантований.
- Map model probe для цього реального API-відгуку: 6 окремих ліній (4 GTFS + 2 пунктирні оцінки ходьби); відхилення кінців усіх транзитних geometry — 0 м.
- Playwright `journey-route-map.spec.ts`: 1/1 пройшов на актуальних робочих Site/Server із локальним map fixture. Перевірено light/dark, sheet, проміжні зупинки, колір/focus для BUS/MINIBUS/TROLLEYBUS/TRAM/METRO/RAIL/FERRY/FUNICULAR, а також scooter pickup/dropoff без штучного списку зупинок. Bus/tram/metro додатково перевірені на zoom-to-segment.
- Site lint/typecheck і 65/65 unit tests пройшли; production build з порожньою map-provider конфігурацією пройшов, bundle gate — 18 chunks ≤350 KB gzip (найбільший 274.5 KB gzip). Цей bundle чесно лишає карту `unconfigured`; локальний E2E manifest не потрапив у production bundle.
- Server lint/typecheck пройшли; 168 unit tests пройшли, 1 opt-in integration skipped. Root lint/typecheck пройшли; 231 unit test пройшов, 1 opt-in integration skipped.
- Playwright `journey-route-map.spec.ts` повторно пройшов 1/1 (56.4 с) після локальної E2E-збірки з `127.0.0.1:3306` map manifest. Попередні 6% diff були наслідком звичайного build без тестового manifest; golden не оновлювався.
- Новий повний Playwright прогін: 6 пройшли, 6 впали. Серед збоїв — довгі marketplace/navigation сценарії з таймаутами або teardown, а також два search-flow тести, що не знайшли очікуваний heading. Загальний E2E gate не зелений; ці помилки треба розібрати перед релізом.
- Server opt-in integration: 28/28 пройшли на ізольованій `marshgo_e2e` БД із loopback Redis, включно з двома API instances, restart persistence і rate-limit sharing.
- Playwright goldens і код не порівнювалися crop-by-crop з фото; ідентичність дизайну не заявляється як прийнята.

## Оновлення: тарифний реєстр та київське метро, 13.10.2026

Перевірені суми й умови винесено в єдиний Server-каталог `server/mobility/transportTariffs.ts` та authenticated `GET /api/v1/transport/fares`. Наразі він покриває комунальні тарифи Києва, міські тарифи Львова, метро Дніпра й Харкова, часові/поїзкові продукти Києва, а також явно невідомі dynamic quote записи для міжміських автобусів, УЗ, таксі, шерингу та трансферів. Суми не заповнюються за аналогією: наприклад, приватна київська маршрутка не отримує тариф комунального транспорту, а 60 грн не задається як універсальна ціна міжміського автобуса.

Київські відкриті дані метро тепер мають builder і умовне підключення до пошуку, коли запит географічно перетинає Київ та дозволено метро. Джерела дають 3 лінії, 52 станції, напрямки, геометрію, години/перші й останні поїзди, інтервали та зв’язки переходів між станціями. Оскільки немає реального GTFS-Realtime, проміжні відправлення й тривалості є `frequency_estimate`; UI не має називати їх live чи обіцяти точні хвилини.

На ізольованому прямому engine-запиті для «Вокзальна → Палац спорту» (14.10.2026, 06:00 за Києвом) пошук створив ланцюг M1 «Вокзальна → Театральна» → 116 м пішої пересадки → M3 «Золоті Ворота → Палац спорту». Це 1 пересадка й близько 21 хвилини; застосовано оцінку тарифу 60 грн за QR-продукт на 90 хвилин. Для обох транзитних сегментів geometry мала 0 м endpoint error, а зупинки йшли в часовому порядку. Видача була обмежена 20 варіантами й мала `truncated=true`/`limitReached=true`; результат доводить, що builder може зібрати й промалювати цей маршрут, але не доводить повний перебір чи глобальний оптимум.

Ізольований HTTP пошук на актуальному Server checkout із тимчасово ввімкненими офіційними київськими джерелами також пройшов. Запит «Вокзальна → Палац спорту» повернув дволінійний метро-ланцюг, одну пересадку, 21:05, оцінку 60 грн та дві окремі geometry: 27 і 7 точок, 0 м відхилення кінців від координат посадки/висадки; обидва списки stop calls упорядковані. Після тесту metro provider statuses відновлені, а створені тестові user/journey записи видалені. API позначив видачу `partial=true` з причинами `candidate_generation_truncated` і `walking_routing_unavailable`; 116 м пішого переходу не були перевірені реальним pedestrian router. Окремо прогнано автентифікований `GET /api/v1/transport/fares`: місто Київ повернуло 30 грн і 60 грн продукти; без входу endpoint повернув 401.

Фінальні локальні перевірки після змін: Server lint і typecheck пройшли; Server unit suite — 180 passed, 1 opt-in test skipped; окремий integration harness — 28/28; Site lint/typecheck, 65/65 unit tests, production build і gzip bundle budget пройшли (18 JS chunks ≤350 KB gzip; найбільший MapLibre chunk 274.5 KB gzip). `git diff --check` пройшов для Server і Site. Це локальні гейти; вони не замінюють staging або фізичний iPhone.

Production readiness лишається **NO**. Треба під’єднати production map/routing/geocoding/SMS/storage/push, підтвердити спосіб оплати й відповідні карткові продукти в UI та виправити наявні browser E2E failures. GTFS-пошук має bounded candidate sampling; live bike/scooter/taxi/intercity prices потребують умов/доступу провайдерів. Metro HTTP протік перевірений лише ізольовано на відкритих джерелах, але ще не є staging soak або production SLO. Не виконано деплой або зміни production-конфігурації.

## UI follow-up: route results, map focus та теми, 13.10.2026

Для результатів ущільнено заголовок маршруту до двох рядків і скориговано розмір кнопки редагування. У Journey map sheet прибрано внутрішню рамку summary-картки, а map fit тепер резервує простір відповідно до фактичної висоти нижньої панелі. Вибраний сегмент кадрується в незакритій області карти, не під sheet.

Цільовий Playwright acceptance пройшов 1/1 у строгому режимі після оновлення reviewed goldens. Перевірено light/dark, geometry parity основних блоків, три snap points, розгортання stop calls і підсвічування/focus автобусного, трамвайного та метро-сегментів; усі точки кожного вибраного сегмента залишилися видимими над панеллю. Site `typecheck`, `lint:all`, production build, gzip budget (18 JS chunks ≤350 KB gzip; MapLibre 274.5 KB gzip) пройшли. Тестові `127.0.0.1` map endpoints відсутні у production bundle.

Це підтверджує правильну поведінку layout і камери на локальному схематичному map fixture, але не точну тотожність наданим фото: тестові тайли не мають міських назв і реальної підкладки, а reference crops ще не пройшли pixel overlay. Загальний browser suite історично мав 6/12 невдалих сценаріїв і не був перевірений цим цільовим прогоном; релізний manifest лишається `NOT_RELEASED`. Production не розгортався.

## UI follow-up: touch sheet і Pure Drive, 13.10.2026

У Journey map нижню панель тепер можна вести пальцем між compact/half/expanded: висота змінюється без React-перемальовування на кожен pointer move, snap враховує напрямок і швидкість, а новий жест починається з фактично видимої висоти навіть під час попередньої анімації. Compact показує маршрутний підсумок і кольорову смугу сегментів без списку деталей; expanded лишає щонайменше 112 px карти. У найвищому стані камера MapLibre центрує маршрут у видимій смузі й обертає лінію горизонтально; у нижчих станах bearing повертається на північ. Вибір сегмента і далі кадрує його власну геометрію.

У Pure Drive прибрано плаваючу кнопку завершення: завершення доступне в розгорнутій нижній панелі. E2E перевіряє відсутність основної навігації та глобальної кнопки створення під час активного ведення, голос вимкнений за замовчуванням і кнопку завершення в панелі.

Після цих змін Site пройшов 68/68 unit tests, typecheck, lint, production build і gzip-бюджет (18 JS chunks ≤350 KB gzip); у production `dist` не знайдено локальних E2E map URLs. Playwright: маршрутна карта 1/1 двічі (перший прогін оновив reviewed snapshots; повтор без update — 1/1), foreground navigation 1/1 на iPhone 15 Pro Max та 16 Pro Max. E2E фікстура використовує локальні test tiles, не production map style.

Загальний production readiness лишається **NO**: у production не налаштований ліцензований map style/tiles provider, staging acceptance не виконана, release manifest лишається зафіксованим на старих SHA, а загальний browser suite має раніше зафіксовані провали 6/12. Зміни не закомічені, PR/merge і production deploy не виконувались.
