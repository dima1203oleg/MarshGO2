# Довгий прямий GTFS-сегмент і межі пошуку — 23.10.2026

## Зміна

На Server commit `648e481c9439633fd786613c457645c4c25753b7` виправлено bounded GTFS stop-pair graph. Коли кінцева зупинка запитаного маршруту розташована далі ніж за 20 проміжних interchange-capable зупинок, direct ride до неї тепер залишається кандидатом. Водночас пошук із дозволеними пересадками не приховує, що за цією межею були пропущені інші придатні сегменти: результат позначається як частковий. Для запиту з нульовою кількістю пересадок нерелевантні пропущені ребра не створюють хибний truncation.

Доданий regression fixture моделює 26-зупинкову наскрізну поїздку та interchange-capable проміжні зупинки. Спершу тест виявив false-positive truncation у direct-only пошуку; реалізацію звужено до пошуків, де пересадки дозволені. Assertions не видалялися й не послаблювалися.

## Перевірки

| Перевірка | Результат | Межа доказу |
|---|---|---|
| `node --import tsx --test tests/gtfs-timetable.test.ts tests/bounded-graph-budget.test.ts` | 69/69 PASS, 0 FAIL, 0 SKIP | Fixture/oracle tests |
| `npm run lint` | PASS | Локальний ESLint |
| `npm run typecheck` | PASS | Локальний TypeScript |
| `npm test` | 297 PASS, 0 FAIL, 3 opt-in SKIP (300 всього) | Пропущені інтеграційні сценарії тут не зараховані як пройдені |
| `npm run test:integration` | 30/30 PASS на loopback PostGIS/Redis, окрема БД `marshgo_e2e_pr29_integration_20261023`, API ports 3312/3313 | Локальні integration fixtures, без production provider entitlements |
| `git diff --check` | PASS | Формат diff |
| Frozen Lviv GTFS replay, Maloholoskivska→Sykhiv, 23.10.2026 08:00–08:30 | 100 результатів; 58 різних trip chains; 37 route chains; `searchTruncated=true`, `candidateGraphTruncated=true` | Один parser-level replay на фікстурі; пошук досі неповний |

Replay повернув balanced/fastest/cheapest кандидатів, але через truncation його не можна вважати доказом глобально найкращого маршруту. Цей результат також не є перевіркою актуального live-фіда чи staging API.

Додатково порівняно п'ять зафіксованих Львівських коридорів між базовим `e21536d` і кандидатом `648e481` на одному snapshot та однакових параметрах. Усі 15 strategy winner signatures (FASTEST/CHEAPEST/BALANCED × 5 OD) збіглися. У station→Sykhiv кількість представлених ланцюгів зросла з 30 до 33 route chains (50→54 trip chains); у center→south-terminal стало 40 route chains в обох, 51→52 trip chains; решта chain counts не змінились. `searchTruncated`, `candidateGraphTruncated` і `resultLimitReached` залишилися true для кожного коридору. Це підтримує відсутність ranking regression і показує кращу різноманітність у двох OD, але загальна повнота пошуку не поліпшена.

## GitHub

- Repository: `dima1203oleg/MarshGO-Server`
- Branch: `codex/gtfs-candidate-diversity-750-20261022`
- Pull request: [#29](https://github.com/dima1203oleg/MarshGO-Server/pull/29), залишається відкритим draft.
- Точний head: `648e481c9439633fd786613c457645c4c25753b7`.
- Exact-head CI run: [39863527878](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39863527878) завершився SUCCESS за 2 хв 34 с. Успішні кроки: npm audit, lint, typecheck, npm test, міграції, PostGIS/Redis integration, production API image та його smoke test.
- `e2e/journey-route-map.spec.ts` після CI пройшов 1/1 за 58.6 s на Server API `648e481...`, Site `1d2aaa0...`, окремій loopback DB та порту 3310. Запит `/api/v1/journeys/search` у тесті intercept-иться fixture, тому це UI route-map acceptance, не перевірка реального GTFS пошуку.
- Повний `npm run test:e2e` на цій парі пройшов 17/17 за 8.6 хв, окрема БД `marshgo_e2e_fullpr29_20261023`, API port 3311. Увійшли двоакаунтні booking/negotiation/chat, driver multi-rider GPS/reroute, responsive mobile viewport, denied GPS, search restore, route map, Planner partial/Community та rendezvous consent. Browser/route/search fixtures визначені локально; зовнішні provider API й staging не викликались.
- `npm run test:integration` пройшов 30/30 для Server API `648e481...` на окремій БД `marshgo_e2e_pr29_integration_20261023` і наявних loopback PostGIS/Redis. Зокрема перевірені HTTP booking/search, last-seat concurrency, negotiation, navigation/GPS ownership, Partner tenant isolation, realtime між двома API processes, restart durability і rate limiting. Міграції тестової БД пройшли до `055_provider_commercial_use_requires_license.sql`; БД збережено, тестові API-процеси завершилися trap-ом suite.
- Button audit пройшов 152 controls, 0 зафіксованих JS/HTTP помилок, 13 heuristic “no visible effect” сигналів. Це не assertion failures і не підтверджені дефекти; серед них tabs/empty-state actions і MapLibre attribution.
- Push виконано звичайним fast-forward з попереднього PR head `e21536d5f97e7876aae0a360ed3ff4126ba5c78c`; force-push не застосовувався.

### Exact RC.21 API image runtime smoke — 2026-10-23

- Зібрано `marshgo/api:RC-2026-10-23-current-review.21` з точного Server SHA `648e481...`; image ID `sha256:b4f32df4a20cf68d62de9e532607036788a2a378aa913061e37d102e7a1bb348`, локальна архітектура `linux/arm64`.
- На окремій одноразовій PostGIS БД `marshgo_rc21_smoke` застосовано 52 міграції; найновіша — `055_provider_commercial_use_requires_license.sql`. Redis запускався окремим тестовим контейнером. Існуючі RC.20 preview і постійні `marshgo-server-db-1` / `marshgo-server-redis-1` не змінювались.
- У контейнер передані лише тестові placeholder credentials та HTTPS endpoints на `example.invalid`; зовнішні URL не викликалися. Після першої діагностичної помилки встановлено обов'язковий `TRUST_PROXY_HOPS=1`; production-config validation пройшла.
- Точний image стартував: `/healthz` 200, `/readyz` 200 (`database=connected`, `realtime=connected`), захищені `/api/v1/journeys/me` та `/api/v1/transport/cities` повернули очікувані 401 без сесії.
- Це чистий local image+runtime smoke у placeholder конфігурації, не HTTPS, staging, зовнішня автентифікація, live-provider чи production acceptance. Тестові RC.21 API/PostGIS/Redis контейнери зараз залишені для огляду; нічого не видалялось.

### Exact RC.21 Web image через API proxy — 2026-10-23

- Зібрано `marshgo/web:RC-2026-10-23-current-review.21` з pinned Site SHA `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; image ID `sha256:fe815477ca388a594fdf64f393440661f2f9b75054bb778ee41b8bd51d9c868e`, `linux/arm64`. Build ішов з чистого materialized Site SHA з доданими лише задекларованими generated Docker/Nginx inputs; production Vite build пройшов, `npm ci` повідомив 0 vulnerabilities.
- В окремій Docker smoke network під'єднано цей Web image до exact RC.21 API на окремій PostGIS/Redis базі. HTTP перевірка: `/healthz`, `/healthz-api`, `/readyz`, `/`, `/journeys/search` — **5/5 HTTP 200**, proxied `/api/v1/journeys/me` — очікуваний **401** без сесії.
- Browser smoke через Playwright відкрив `/` та `/journeys/search` на 390×844 і 1440×1000: **4/4 HTTP 200**, `main` видимий, горизонтального overflow немає, uncaught JS errors — **0**, local HTTP 5xx — **0**. Відсутня авторизована сесія викликала очікуваний `/api/v1/auth/refresh` 401; тест навмисно блокував усі зовнішні ресурси.
- Це лише точне local Web→API image wiring і базовий responsive/JS smoke. Через навмисне блокування мережі та `.invalid` map/geocoder/SMS конфігурації тут не підтверджено карту, live API data, OTP чи реальний вход. Не є staging/HTTPS/production acceptance.

### Exact RC.21 Admin і Partner web images — 2026-10-23

- Зібрані з manifest SHAs Admin `9dbf7db0a935498ac40c98b19bc36bce056d630d` image `sha256:5947cb121781cd9d9ab69035754b616c18fd1ac9177ee449c1e84c81ead0e44c` та Partner `c639257a7f28aeda5b378a816038b01651146b83` image `sha256:8465971cc2ff9cd687adcaa99f0c944e3626289a1d6e12db36c86be5fe7413fc`; обидва `linux/arm64`.
- Обидва контейнери з'єднані в тій самій ізольованій smoke network з RC.21 API. Для кожного `/healthz`, `/healthz-api`, `/readyz`, `/` дали 4/4 HTTP 200; browser root показав правильні українські заголовок/мову і видимий main на viewport 390×844, без горизонтального overflow та uncaught JS errors. Через проксі `POST /api/v1/auth/refresh` повертає очікуваний 401 без сесії.
- Це підтверджує збірку, shell, health і proxy wiring; не перевіряє автентифіковану організацію, адмінські права, модерацію, ingestion, Partner memberships/tenant isolation або справжні операції. Для цього потрібні тестові організації/акаунти й acceptance на staging; локальні API role/isolation suites та CI є окремими доказами, не взаємозамінними з browser acceptance.

## Production status

Це точкове покращення пошукової коректності, а не завершення Journey Engine. Щільний frozen Lviv replay усе ще обрізаний, тому повноту міського пошуку не підтверджено. Browser E2E та API-backed booking/integration є на локальних ізольованих fixture середовищах; це не доводить живе transit itinerary API на staging. RC.21 manifest pin-ить цей SHA, але PR не злитий. Staging, live-provider acceptance, production HTTPS smoke, backup/restore/rollback і фізичні iPhone/GPS перевірки не виконувалися. Deployment status залишається `NOT_RELEASED`.

## Наступна дія

1. Продовжити query-directed пошук щільного GTFS без підняття graph/search limits навмання; зберігати exhaustive tiny-feed oracle і чесний truncation indicator.
2. Довести запити з багатьма результатами та узгодити route results API/browser fixtures з фідовим replay без підміни live data.
3. Отримати staging origin/access, виконати live-provider acceptance, backup/restore/rollback rehearsal та HTTPS smoke; до того не позначати версію production-ready.

### Повторний frozen Lviv replay і межі пошукового бюджету — 2026-10-23

- Незалежний read-only replay точного Server SHA `648e481c9439633fd786613c457645c4c25753b7` використав той самий публічно отриманий frozen ZIP із SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`. Один запуск на Node 25.4.0: 1,071 stops / 72 routes / 15,716 trips; 423 corridor stops / 814 interchange stops; estimated candidate graph demand **415,997**, cap **100,000**, retained **99,054**. Усі 70 маршрутів були budget-limited принаймні для частини сегментів; route allocation не використала 946 слотів через розподіл по маршрутах.
- Search пройшов **114,901 крок**, зібрав 531 first leg і 1,573 candidate itineraries (750 двосегментних, 775 трисегментних), повернув 100. `searchTruncated=true`, `candidateGraphTruncated=true`, `candidateSamplingTruncated=true`, `searchBudgetTruncated=true`; `searchStepLimitReached=false`, `candidateResultLimitReached=false`. Тобто hard 1,000,000-step ceiling не вичерпано: інші candidate-pool/per-depth stop conditions зупинили пошук із непереглянутими варіантами. Разовий debug run ~2.04 s; RSS peak близько 485 MB у цьому прогоні, не є стабільним benchmark.
- Алгоритмічний review окреслив безпечний експеримент: замінити матеріалізацію всіх пар зупинок у кожному trip на індекс подій відправлення й ліниве породження допустимих сегментів при досяжному label. Обов’язково зберегти існуюче `transferDecision()` для transfer rules 2/3/4, pathways, фізичних walk distance/time, календарів/exceptions, pickup/dropoff, realtime cancellations/skips та horizon. Окремо потрібна незалежна exhaustive oracle на малих випадкових feeds, включно з >24:00, pathway-only platforms, loops і fare unknown; lazy graph сам по собі не усуває bounded candidate-search truncation. Ліміти не піднімати навмання, flags не приховувати.

### Exact RC.21 iOS Simulator first-paint — 2026-10-23

- Локальна збірка з точним Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`, Server `648e481c9439633fd786613c457645c4c25753b7` і iOS `71f993ae342c440e6ea1343e0b1e40ad72f3e210` пройшла Site production bundle, Capacitor sync і `xcodebuild` (`BUILD SUCCEEDED`); embedded `public/release-manifest.json` звірений із tuple.
- Застосунок `ua.marshgo.app` встановлено й запущено на iPhone 18 Pro / iOS 27 Simulator. Перший скриншот зафіксував splash під час відкладеного WebKit paint; наступний показав український welcome/onboarding екран. Це підтверджує запуск і перше видиме відображення, але не auth, API user flow, карту, дозволи GPS чи польове iOS acceptance. Артефакти локально: `/tmp/marshgo-rc21-ios-firstpaint.png` та `/tmp/marshgo-rc21-ios-secondpaint.png`.
- Hosted iOS exact-pin run `39866649246` також завершився SUCCESS. Фізичний iPhone, APNs, background GPS, TestFlight — NOT_TESTED.

### Поточний release gate recheck

- Release reviewer повторно перевірив GitHub Deployments і Environments для MarshGO, Server, Site, iOS, Admin та Partner: **0 deployments, 0 environments**. Кандидатні PR-и залишаються відкритими/не злитими; root umbrella PR #5 не завершує checkout приватних Admin/Partner без read-only `MARSHGO_REPOS_READ_TOKEN`.
- Це не доводить відсутність будь-якого зовнішнього хостингу, але доступного перевіреного staging/production origin, deployed SHA, HTTPS smoke або rollback evidence наразі немає. Релізний стан — **`NOT_RELEASED`**.

### Live Львівський GTFS-Realtime probes — 2026-10-23

- У точному Server checkout використано наявний безпечний validator `testGtfsRealtimeConnection()` для відкритих каталожних URL vehicle positions і trip updates. Обидві відповіді були доступні, валідні GTFS-Realtime protobuf; feed timestamps були свіжими на 6 та 16 секунд при порозі 90 секунд, response time 259/256 мс.
- Два послідовні вимірювальні вікна: у першому feed timestamps були віком 6/16 секунд і відповіді 259/256 мс; у повторному — 5/3 секунди і 236/232 мс. Кожен із двох snapshot-ів містив **0 vehicles, 0 trip updates, 0 alerts** і отримав `degraded`. На двох вимірах не було live-маркерів чи оперативних затримок, хоча URL/формат/timestamp працювали. Це все одно не доводить, що feed завжди порожній; перевірку слід повторити у вікно підтвердженого руху.
- Висновок для UI: статичний розклад і плановий сегмент можна показувати незалежно; live vehicle icons/ETA/пріоритет машин до посадки не можна показувати як наявні без ненульових свіжих даних. Тут не було auth token або персональних даних.

### Static GTFS feeds повторно перевірені на live джерелах — 2026-10-23

`testGtfsConnection()` із цього Server SHA завантажив і валідовував три каталожні ZIP напряму:

| Місто | GTFS stops / routes / trips | Перевірки | Ліцензія в каталозі |
|---|---:|---|---|
| Львів | 1,071 / 72 / 15,716 | ZIP, required files, координати, timezone, calendar, сервіс у найближчі 7 днів — PASS | Open data portal attribution; юридичні/комерційні умови треба звіряти з джерелом |
| Стрий | 295 / 34 / 1,061 | ті самі перевірки — PASS | відсутня в реєстрі; seeder залишає source неактивним |
| Ужгород | 217 / 18 / 2,376 | ті самі перевірки — PASS | відсутня в реєстрі; seeder залишає source неактивним |

Отже, реальні статичні розклади для трьох міст доступні й структурно валідні на час перевірки, але комерційний дозвіл для Стрия та Ужгорода не підтверджений. Їхні валідні маршрути не можна трактувати як production-enabled. Статичний розклад не дає реальних позицій транспортних засобів; обидва поточні Львівські realtime snapshots вище були порожні.

### Exact RC.21 iOS pin CI завершено — 2026-10-23

- iOS PR #11 head `71f993ae342c440e6ea1343e0b1e40ad72f3e210`; GitHub Actions run `39866649246`, job `simulator-build` завершився **SUCCESS**.
- Перевірені кроки: checkout точного Site SHA, `npm ci` для Site та оболонки, production bundle + Capacitor sync, embedded release manifest verification і compile для iOS Simulator — усі PASS. Release archive кроки були штатно skipped для branch build.
- Це підтверджує відтворювану simulator build на заданих Site/Server SHAs. Фізичний iPhone, реальний API origin/auth, дозволи GPS, APNs, background location і TestFlight лишаються NOT_TESTED; iOS PR #11 не злитий.
