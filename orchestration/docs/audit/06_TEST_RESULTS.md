# Результати перевірок

Дата: 12.10.2026. У таблицях вказано конкретні локальні SHA та CI run. Проходження build не вважається доказом production-приймання.

## Локальні перевірки трьох кодових баз

| Репозиторій | SHA / середовище | Перевірки | Результат |
|---|---|---|---|
| MarshGO (legacy branch) | `a008749cbc6b8dadd6eb15ff51c861b08f507e3f`, Node 24.21.0 через тимчасовий `npx --package=node@24.21.0` | `npm run check:production`; окремий `npm test` | Production check: exit 0 (typecheck, lint, unit, build, bundle). Unit: 230 тестів, 229 pass, 0 fail, 1 skipped. DB-backed integration і browser E2E рахуються окремо нижче. |
| MarshGO-Server | `cf82c68bc00d343f3a4e691e860259f5ca1acd04`, Node 24.21.0 | typecheck, lint, `npm test`; GitHub Actions [38279343797](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/38279343797) | Локально 158 тестів: 157 pass, 0 fail, 1 opt-in integration skipped. CI для цього SHA пройшов PostGIS/Redis integration suite. |
| MarshGO-Site | `570ea7b9faa3d55a7e24599657c86fb2903d4cce`, Node 24.21.0 | typecheck, lint, `npm test`, production build, bundle check; GitHub Actions [38295522056](https://github.com/dima1203oleg/MarshGO-Site/actions/runs/38295522056) | 60 тестів pass, 0 fail, 0 skipped; build і bundle перевірки успішні. Звітний bundle audit: 17 JS chunks, gzip до 350 KB; MapLibre chunk 275.7 KB gzip. |
| MarshGO-iOS | `68f69a32886d6db248bbac627b78f076bc7efe7a`; Simulator CI [38286540826](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/38286540826) | Capacitor sync / Xcode Simulator build за workflow | Simulator build успішний. Це не підтверджує фізичний GPS, APNs, background location, signing або App Store readiness. Workflow pin використовує Site SHA `1745822ce1162dcaee2728fd87f2593844960268`, предка поточної перевіреної Site гілки; потрібна нова збірка з конкретно погодженим актуальним Site SHA. |

## Повторний CI старого MarshGO

Pull request: [MarshGO #1](https://github.com/dima1203oleg/MarshGO/pull/1), SHA `34ad4798237ef836da3c652daf762984cc7bd908`, run [38297112997](https://github.com/dima1203oleg/MarshGO/actions/runs/38297112997).

Поточний повторний run завершив успішно такі етапи: встановлення залежностей, Bun audit, lint, typecheck, unit tests, міграція ізольованої CI БД, API integration, build, bundle check і матеріалізація release package. Перший запуск на тому самому SHA мав один `ECONNRESET` у DB/API integration test; повторний API integration suite пройшов. Це слід відстежувати як нестабільність.

Повний висновок цього старого run відкладений: на останній перевірці виконувався `npm run test:e2e` із Site SHA `1745822…`, зафіксованим у manifest. Повторне попереднє CI на цьому SHA дало 5 pass / 7 fail; частина тестів перевіряла UI, який уже змінений у Site `570ea7b…`. Manifest зараз оновлюється на перевірений Site SHA, і саме наступний root CI буде основним актуальним E2E результатом. Browser compatibility для нового SHA теж має пройти окремо.

## Тестове покриття та межі

- У Site branch `570ea7b…` всі канонічні результати та маршрутні референси з наданих вкладень перевірено за SHA-256: світло-темна дошка, світлі деталі й карта та чотири фінальні темні кадри побайтно збігаються з файлами `docs/design/canonical/**`. Site `npm test` включає перевірку цілісності цих reference assets. Це доводить правильність еталонних файлів; саме по собі не доводить pixel-diff готового UI. |
- Локальні unit та окремі CI integration результати відтворювані для наведених SHA.
- Server локальні integration тести за замовчуванням не запускаються без явного opt-in; green локальний `npm test` сам по собі не є доказом DB/Redis integration.
- Legacy API integration у GitHub використовує ephemeral PostGIS/Redis service. Локальні persistent база й Redis не очищалися.
- Немає підтвердження живих OTP/SMS, зовнішніх партнерських booking API, production database, production backup/restore, фізичного iPhone acceptance чи реального навантажувального тесту.
- Браузерні E2E і Chromium/Firefox/WebKit треба оцінювати лише за повним GitHub run; не переносити історичні `5/7` як актуальну цифру.

## Наступний крок

Отримати фінальний стан run `38297112997`, записати браузерні E2E результати та причини кожного невдалого сценарію, якщо вони є. Після кожної зміни повторити відповідні тести на новому точному SHA та оновити цей звіт.

## Продовження маршрутизатора — 19.10.2026

Зріз виконано на dirty worktree: Server HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8` плюс незакомічена зміна ранжування; Site HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f` плюс наявні незакомічені UI/map зміни. Це не GitHub CI й не production/staging.

| Репозиторій / target | Перевірка | Результат |
|---|---|---|
| MarshGO-Server | `npm run typecheck` | Успішно. |
| MarshGO-Server | ESLint для `server/journey/scoring.ts`, `server/index.ts`, `tests/journey-scoring.test.ts`, `tests/api-bookings.integration.test.ts` | Успішно. |
| MarshGO-Server | Цільові routing/timetable/fare/transfer тести | 66 pass, 0 fail, 0 skipped. |
| MarshGO-Server | Повний `npm test` | 214 total: 213 pass, 0 fail, 1 opt-in integration skipped. |
| MarshGO-Server | `npm run test:integration:journey` на loopback `marshgo_e2e` | 2 pass, 0 fail. Тестові зміни транзакцій відкочуються. DB migration ledger перед прогоном уже був на `054_rendezvous_participant_consent.sql` (57 назв міграцій). |
| MarshGO-Server | Повний `npm run test:integration` на loopback `marshgo_e2e` і Redis service | Успішно: Journey schema 2/2, live Journey API 1/1, bookings + trip editing 21/21, navigation 2/2, Redis realtime 1/1, restart durability 1/1, shared rate limit 1/1; сумарно 29 перевірок у цих suite. Інтеграційний runner сам обмежує БД loopback `marshgo_e2e`; провайдерні фіди вимкнені, тому run не доводить реальне міське покриття. |
| MarshGO-Site | Повний `npm test` + `npm run typecheck` | 95 pass, 0 fail, 0 skipped; typecheck успішний. |

### Зміна логіки ціни

`CHEAPEST` раніше повністю зникав, коли хоч один candidate мав невідому ціну. Тепер стратегія доступна, якщо є хоча б один маршрут із відомою порівнянною ціною; її ranking відфільтровує маршрути з `priceMinor: null`. Невідомі тарифи лишаються невідомими в інших режимах. API booking integration assertion перевіряє наявність CHEAPEST для відомої UAH ціни попутки та те, що жоден маршрут із невідомою повною ціною не має `strategyRanks.CHEAPEST`. Site уже фільтрує CHEAPEST картки без відомого підсумку.

### Межі доказу

- Повний Server integration пройшов із локальними Docker PostGIS/Redis сервісами; це не production/staging приймання.
- Feed matrix вивела 1 попутку; громадський транспорт/мікромобільність були недоступні або вимкнені в цій конфігурації. Маршрути фідів на реальних актуальних джерелах цим run не доведені.
- Зміни залишаються незакоміченими; GitHub CI/PR статус для цього diff не існує. Фізичний iPhone, Site production build screenshot acceptance і production deploy у цьому продовженні не виконувалися.


## Оновлення після baseline

| Репозиторій | SHA / середовище | Перевірки | Результат |
|---|---|---|---|
| MarshGO legacy | локальний робочий набір після змін E2E/GTFS timestamp; parent `1e8fbca…` | `npm run check:production`, `npm test` | exit 0: typecheck, lint, unit, build і bundle audit. Unit suite: **232 total, 231 pass, 0 fail, 1 opt-in integration skip**. Browser E2E на root SHA до цих змін: run [38301176574](https://github.com/dima1203oleg/MarshGO/actions/runs/38301176574), 6 pass / 6 fail. |
| MarshGO-Server | `4e32ac3ede97aff715d0604dcf02af7fedd00547` | локально typecheck/lint/unit; GitHub push CI [38305019352](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/38305019352) і PR CI [38305024597](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/38305024597) | локально 160 pass / 1 opt-in integration skip; exact-SHA CI успішний, включно з DB/PostGIS/Redis integration. |
| MarshGO-Site | `570ea7b9faa3d55a7e24599657c86fb2903d4cce` | Site CI [38295522056](https://github.com/dima1203oleg/MarshGO-Site/actions/runs/38295522056) | 60 тестів pass; typecheck/lint/build/bundle успішні. |
| MarshGO-iOS | `d9a9c4392031cb08b2ecbc31cb959d44e483ab72` | exact-SHA push CI [38303892342](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/38303892342), PR CI [38303901032](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/38303901032) | обидві Simulator/Capacitor перевірки успішні; workflow пінить Site `570ea7b…`. Фізичний пристрій не тестувався. |

Root unit-test count підтверджено локальним друкованим результатом вище. Точний root commit SHA буде додано після коміту; E2E після оновлення manifest/селекторів та browser-compat залишаються очікуваними; production/staging, physical iOS і навантажувальні перевірки не виконані.

## Перевірка свіжості realtime-фідів — 19.10.2026

Поточний зріз виконано на незакоміченому `MarshGO-Server` HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8` та незакоміченому `MarshGO` HEAD `d75748311ae981ade2fe61113f00379fe810e68c`. Код перевірок фідів у Server змінений локально; GitHub CI, staging і production не запускалися.

| Джерело | Поточний результат прямої read-only перевірки | Інтерпретація |
|---|---|---|
| Dozor JSON, Івано-Франківськ | 49 валідних координат із 49, усі з часовою позначкою; найновіша позиція 21 с | Зараз фід придатний до live-відображення за freshness-порогом 90 с; відповідність позицій конкретним розкладам і геометріям маршруту перевіряється окремо. |
| Dozor JSON, Ужгород | 52 валідні координати із 52, усі з часовою позначкою; найновіша позиція 44 с | Зараз фід придатний за свіжістю, але попередня перевірка GTFS цього міста виявила відсутній/невалідний `agency_timezone`; це не доводить сумісність позицій із поїздками GTFS. |
| EasyWay JSON, Полтава | 124 валідні координати, 1 позиція без валідних координат; найновіша позначка 935 с | Health тепер `degraded`; позиції не можна видавати за live або використовувати для наближення до посадки. |

У Server додано парсинг часових міток Dozor як локального `Europe/Kyiv` часу, коректну обробку DST fold/gap, обов'язкову перевірку `agency_timezone` у GTFS та єдиний 90-секундний поріг свіжості для live-телеметрії. Це усуває хибну оцінку фіду Полтави як актуального впродовж 30 хвилин. На цьому checkout пройшли `npm test` (**219 total: 218 pass, 0 fail, 1 opt-in integration skip**), точкові тести (**39 pass**), `npm run typecheck` і ESLint для змінених фід-модулів. Повний `npm run test:integration` теж пройшов: Journey schema 2/2, live Journey API 1/1, bookings/trip editing 21/21, navigation 2/2, Redis realtime 1/1, restart durability 1/1, shared rate limit 1/1 (**29 перевірок, 0 невдалих**). Інтеграційний runner використовує локальний loopback PostGIS/Redis; provider feeds у ньому вимкнені.

Поточний dirty checkout `MarshGO-Site` HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f` перевірено окремо: `npm test` (**95/95**), `npm run typecheck`, `npm run lint` і `npm run build` завершилися успішно. Це підтверджує локальну компіляцію й модульні перевірки зміненого UI/мапи, але не browser E2E, pixel-diff референсів або запуск у staging. На цьому Site commit/diff і вбудований Site checkout в iOS ще не синхронізовані.

Це одноразовий зріз часу й доказ локальної інтеграції з публічними фідами, не гарантія їхньої безперервної доступності. У Dozor GTFS-RT раніше виявлялися непов’язані route/trip IDs, а для частини маршрутів була лише геометрія stop sequence. Поки provider identity, точний напрямок/рейс і достовірна геометрія не зіставлені, повну лінію й акцент на тих, що їдуть до посадки, не можна вмикати для цих позицій. І навіть коли feed відповідає, це не є staging acceptance: хостинг, секрети, моніторинг, backup/restore та physical iPhone GPS досі не підтверджені.

## Повний E2E повтор після виправлення двох невідповідностей — 19.10.2026

На локальному незакоміченому робочому дереві MarshGO (`codex/production-finalization-20261014`, HEAD `d75748311ae981ade2fe61113f00379fe810e68c`) і MarshGO-Site (`codex/sync-journey-mobility-ui`, HEAD `6961afcf008e2c845c0fde68c687ce61fe744f2f`) повний `npm run test:e2e` завершився **13/13 pass за 7,1 хвилини**. E2E використовував актуальний локальний Site build, локальний Server checkout `182c77ae4f78d576a287007d8e0864fb130f43f8`, loopback PostGIS `marshgo_e2e`, Redis і локальні фікстури карти/geocoder/OSRM. Це не GitHub CI, staging, production або реальні міські дані.

Покриті сценарії: browser compatibility і responsive 320–1920 px; аудит натискань; синхронізація картки/карти, stop details і світла/темна теми; Kyiv date/time; 12 категорій транспорту; onboarding; два незалежні акаунти з бронюванням, чатом, переговорами, оплатою/підтвердженням, посадкою, завершенням і відгуками; GPS deviation/rerouting; iPhone 15/16 viewport; відмова в GPS; відновлення URL-пошуку; Journey Planner price/strategy; consented rendezvous map.

Під час повтору усунуто дві першопричини попереднього падіння: унікальні React `key` для чотирьох дочірніх SVG-вузлів кастомної іконки самоката (прибрали `Each child in a list…` warnings), та E2E очікування застарілої назви поля автомобіля й застарілої навігації. Тепер тест перевіряє фактичну мітку «Перевірене авто», активацію зустрічі до розкладу та підтвердження зустрічної ціни зі сторінки deep link заявки. Попередній запуск спершу оголив ці неточності: вони були виправлені в тесті/іконці без видалення перевірок бізнес-логіки.

Після цього Site перевірено локально: `npm test` **95/95**, typecheck, lint, production build та bundle budget успішні (17 JS chunks, кожен ≤350 KB gzip). E2E button audit окремо повідомив про **16 із 155 натискань без видимої реакції**; для повного приймання ці результати треба класифікувати по конкретних кнопках, навіть попри успішний статус самого аудиту.

Висновок лишається обмеженим локальним прийманням. Для production готовності ще бракує узгодженого GitHub commit/PR для цих змін, exact-SHA міжрепозиторного CI, staging і live feed acceptance, зовнішніх сервісів та physical iPhone GPS/background перевірки. Старі записи цього звіту про «E2E очікуються» належать попереднім станам і замінені цим повним локальним результатом; старі GitHub run-и не переписуються.

## Current pinned production candidate browser verification — 2026-10-19

Exact pins: Server `7c459ded4f96b106f85aa2e76bfd9440e3de6293`, Site `2db040528ab1bbd4dbc97de285ca16dff392bbc5`; isolated loopback E2E database `marshgo_e2e`, deterministic local map/geocoder/OSRM fixtures. The runner built the exact pinned Site and migrated the isolated test DB. This is local fixture evidence, not staging, production, or live municipal-data acceptance.

| Suite | Result | Scope / limitation |
|---|---|---|
| Production check on root orchestration checkout | PASS, exit 0; typecheck, lint, build and bundle budget passed; 252 unit passed, 1 skipped, 0 failed | Dirty root checkout at `f944560a3babf7423befc53741217d9281f44dab`; not an exact multi-repository release build |
| Production button audit | PASS, 1/1; clicked 156 visible actions | 13 had no detected DOM/URL/network change; no runtime/HTTP/internal-text errors. Review these individually; empty-state and same-route actions may be expected |
| Remaining pinned candidate E2E | 11/12 passed | Booking/negotiation/chat, multi-rider driver stops and GPS reroute, denied GPS, search URL restore, Journey Planner, mobile navigation and consented rendezvous passed. One macOS screenshot assertion failed |
| Cross-browser compatibility | PASS, 6/6 | Chromium, Firefox and WebKit: responsive entry flow plus route-map behavior/geometry. Screenshot comparison is skipped for named browser projects; physical Safari/iPhone is untested |
| Route-results screenshot | FAIL / visual gate open | 38,126 pixels (12%) differ from the root stored `journey-results-light.png` snapshot. Snapshot was not regenerated. The pinned Site's actual render was compared visually with canonical references; root regression snapshot provenance is not equivalent to approved-reference pixel acceptance |

The original one-shot E2E run was interrupted during the long button audit after repeated `networkidle` waits. The audit was isolated and passed after replacing per-navigation network-idle waits with `.production-app` readiness plus the same 400 ms render settling interval; click coverage and assertions were unchanged. The other 12 tests were then run separately. Resolve the screenshot delta against the exact canonical reference/crop and review 13 no-effect controls before marking visual acceptance PASS.


## Pinned five-repository candidate E2E continuation — 2026-10-19

Exact browser pair: Server `d249df1aff79b33344ee161cca5cfca47dd87691` / Site `d17360f01e05fa3c878587b8f149746e57ba36f8`; Node `24.21.0`; isolated loopback `marshgo_e2e` PostGIS, Redis at `6381`, and deterministic local map/geocoder/OSRM fixtures. The pinned Site production bundle built successfully. This is local fixture acceptance, not staging, production, live-provider, or physical-device acceptance.

- Full behavioral Playwright suite with screenshot assertions disabled: **14/14 passed** in 6.1 minutes. It exercised responsive entry, all route/map/sheet interactions, date/time, canonical transport categories, welcome/onboarding, two-account booking/negotiation/persisted chat, driver stop ordering and GPS reroute, iPhone viewport, denied GPS, URL search restoration, Journey Planner, and mutual rendezvous consent/map.
- Production button audit: **1/1 passed**, 152 visible controls clicked; 13 were reported with no detected URL/DOM-text/HTML-length/network change. This heuristic does not observe ARIA or CSS-only changes; same-route navigation and empty-state actions may be intentional. Individually classify these controls before treating the button audit as complete.
- Strict screenshot run on the current dirty root checkout: **13 passed, 1 failed** at `journey-results-light.png`; expected workspace snapshot differs by 38,126/342,504 pixels (12%). The actual screenshot matches the clean committed-HEAD snapshot pixel-for-pixel (0 changed pixels). The workspace snapshot had pre-existing modifications; it was not overwritten or restored.
- Focused route-map test repeated on Node 24.21.0 with screenshot comparison disabled: **1/1 passed** in 1.4 minutes. The strict visual acceptance gate remains open until the modified snapshot provenance is resolved and the exact clean-baseline comparison passes.
- The first all-suite strict attempt used host Node 26.7.0, outside the package's declared Node 24.21.0 engine. The complete 14/14 behavioral rerun and focused map rerun used Node 24.21.0.

No screenshot baseline was changed. No live API provider or production/staging endpoint was used.


## Transit line-focus cross-contract check — 19.10.2026

| Target | Verification | Result |
|---|---|---|
| Server `d249df1aff79b33344ee161cca5cfca47dd87691` | `live-journey-segment.test.ts`, `live-journey-vehicles.test.ts`, plus opt-in `live-journey.integration.test.ts` command | 13 assertions passed, 0 failed. The API integration suite was skipped in this focused invocation because opt-in API/database variables were not set; the exact Server loopback integration suite separately passed 30/30 and hosted checks `39252440448` / `39252449566` passed. |
| Site `d17360f01e05fa3c878587b8f149746e57ba36f8` + Server above | `e2e/journey-route-map.spec.ts --grep "canonical route map synchronizes" --ignore-snapshots` | 1/1 Chromium browser scenario passed on Node 24.21.0. It verified two exact route directions, four fresh fixture vehicles, exactly three emphasized approaches, removal of transit overlay when selecting scooter, and a visible warning for `candidateGenerationTruncated=true`. Uses isolated loopback PostGIS/Redis and deterministic provider/map fixtures. |
| Admin `9dbf7db0a935498ac40c98b19bc36bce056d630d` | typecheck, lint, build, unit | All passed; 2/2 unit tests. |
| Partner `c639257a7f28aeda5b378a816038b01651146b83` | typecheck, lint, build, unit | All passed; 3/3 unit tests. |

The browser assertions establish that existing production Site code consumes and renders the contract; they do not establish currently operating city feeds, commercial rights, staging behavior, physical-device behavior, or visual screenshot acceptance. No visual baseline was rewritten.

## Server cross-provider GTFS candidate cap — 2026-10-20

PR [#20](https://github.com/dima1203oleg/MarshGO-Server/pull/20), exact SHA `c7948bd88c36e03c0a5d81ba7f4c49906e92bc5c`, based on Server PR #17 head `1a3598cc270af0d353a2b22cda740f81daa0da73`:

- Focused GTFS timetable + strategy scoring: **73 passed, 0 failed, 0 skipped**.
- Complete Server unit suite: **275 passed, 0 failed, 3 opt-in integration skipped** locally.
- TypeScript typecheck: PASS.
- ESLint: PASS.
- Hosted exact-head workflow [39355083958](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39355083958): PASS; includes dependency audit, lint, typecheck, unit suite, migrations, and Postgres/Redis integration tests.
- Local host ran Node 25.4.0 while package pins 24.21.0; the exact-head GitHub workflow ran the repository CI runtime. Docker was unavailable locally, hence local opt-in database tests were skipped.

This validates the targeted bounded candidate-retention change; no live operator-feed/staging or production deployment was exercised.

## Production map focus and iOS Site synchronization — 2026-10-20

- Site PR #13 exact SHA `7e704142bd6ad07ae544e78bd569fa29718ced62`: local `npm run check:production` passed typecheck, E2E typecheck, lint, **124/124 unit**, production build, bundle gate, and **12/12 Playwright** across Chromium/Firefox/WebKit. Targeted map tests after diagnostics assertions: unit **4/4**, Chromium E2E **1/1**.
- Site hosted exact-head runs [39355497894](https://github.com/dima1203oleg/MarshGO-Site/actions/runs/39355497894), [39355501509](https://github.com/dima1203oleg/MarshGO-Site/actions/runs/39355501509), and [39355501591](https://github.com/dima1203oleg/MarshGO-Site/actions/runs/39355501591) PASS; final run includes browser acceptance against the production build and immutable artifact upload.
- iOS PR #8 exact SHA `fc603e5b07d818b9d9577355449a58d7b1e0cf1e` pins Site `7e704142bd6ad07ae544e78bd569fa29718ced62`. Hosted [39355771601](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/39355771601) and [39355775363](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/39355775363) PASS: verified Site checkout, production web bundle, Capacitor sync, and iOS Simulator build.
- No staging, physical iPhone, live API sign-in/booking, GPS field, push/background, or production deployment was tested by these runs.

## Combined Server fixture + candidate-cap branch — 2026-10-20

Server PR #21 combines the already passing PR #19 authenticated GTFS fixture path with the PR #20 objective-preserving API cap without rewriting either history. Exact combined SHA: `cbf17c2ccf05d7a7e3126fa0caf74ef8049bc7a2`, based on PR #19 head `c6e481dcab1c0bd520e40458b5387375b8c9a0b8`.

- Local full unit suite: **276 passed, 0 failed, 3 opt-in integration skipped**; typecheck PASS; ESLint PASS; diff check PASS.
- Combined hosted workflows [39356020667](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39356020667) and [39356033329](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39356033329) both PASS on this exact combined SHA, including migrations and Postgres/Redis integration. The PR remains OPEN/unmerged; no live provider or staging acceptance was exercised.

## GTFS candidate budget replay — 19.10.2026

Read-only, local replay on exact Server source `d249df1…` against the public Lviv static GTFS. Baseline cap 100,000 retained 70,627 candidate segments; 41 of 72 candidate routes reached the per-route quota; 1,561 first-leg candidates. A temporary, uncommitted 160,000 cap retained 100,514 segments, reduced capped routes to 33, and produced 2,286 first-leg candidates. Both remained truncated, hit the 250 internal candidate result ceiling, and returned the 10 requested results. The temporary cap was reverted because final-result benefit and safe concurrent memory were not proven. This is a single-query performance experiment, not acceptance or production-load evidence.

### E2E rerun after laptop restart — 2026-10-21

- Local `npm run check:production` on Node 24.21.0: typecheck, lint, 252 tests, production build, and bundle budget PASS; one opt-in DB integration test remains SKIP.
- Started only local Compose `db` (PostGIS 17-3.5 at `127.0.0.1:5434`) and `redis` (`127.0.0.1:6380`) for the E2E harness. On exact Server `c33651b1387e0d2b377216a0b88f6ae02cdbec32` + Site `c50ba344b7dfde9859826363fea119d95e2cc54e`, migrations applied to isolated `marshgo_e2e`; PWA build passed. Full Chromium run: 12/14 pass, with two stale assertions (strategy badge semantics and copy string) corrected in the existing working E2E files. After corrections, URL criteria restore passed 1/1 default Chromium; route-map interactions passed 1/1 Firefox and 1/1 Chromium through the compatibility config. Both containers were stopped afterward, preserving volumes.
- Chromium visual comparison remains FAIL/NOT_ACCEPTED: 38,106 pixels (12%) differ from the already modified local `journey-results-light-darwin.png` snapshot. Snapshot provenance is unresolved; no snapshot was overwritten. Full 14-test rerun after test corrections remains NOT_RUN. These fixture tests do not prove staging, live provider, or production behavior.

### Server DB/Redis integration on exact PR #24 head — 2026-10-21

- Server worktree `codex/gtfs-route-oracle-20261021`, SHA `c33651b1387e0d2b377216a0b88f6ae02cdbec32`, Node 24.21.0, local PostGIS 17-3.5 and Redis 7.4: `npm run test:integration` **30 passed / 0 failed / 0 skipped**.
- Coverage: Journey schema 2, live Journey API 1, bookings/trip editing 21, Partner tenant isolation 1, navigation 2, Redis realtime 1, booking restart durability 1, Redis rate limiting 1. Tests passed on loopback-only `marshgo_e2e`; external providers were fixture/disabled. Worktree clean and `git diff --check` PASS. Containers stopped afterward; no production or staging endpoint was used.

### Corrected complete browser E2E — 2026-10-21

- Exact Server `c33651b1387e0d2b377216a0b88f6ae02cdbec32` + Site `c50ba344b7dfde9859826363fea119d95e2cc54e`, Node 24.21.0, local isolated PostGIS/Redis, production PWA and deterministic local map/geocoder/OSRM fixtures: **13/14 Chromium scenarios PASS, 1 FAIL**.
- The remaining failure is strict pixel comparison for `journey-results-light.png`: 38,180 pixels (12%) differ from the already modified workspace snapshot. No snapshot was overwritten. All other passenger, driver, journey, route restore, navigation, GPS-denial, and rendezvous checks passed. Route-map behavior also passed 1/1 in Chromium and Firefox named compatibility projects, where snapshot matching is intentionally skipped.
- Button audit passed its assertions after 158 control clicks, while logging 13 heuristic “no visible effect” observations that still need classification. Docker `db`/`redis` stopped after the suite; volumes preserved. Not staging or production acceptance.

### Ручний перегляд маршрутової карти — 19.10.2026

Порівняно browser screenshot із затвердженими light/dark reference images pinned Site `d17360f…`. Кольори/картки сегментів візуально близькі, однак кадр використовує локальні тестові map tiles (схематична світла сітка), а еталон — карту Львова; кадри не є зіставними для visual PASS. Strict screenshot gate також має невирішене походження раніше зміненого робочого snapshot. Baseline збережено, ніяких скриншотів еталонів не переписано; visual acceptance залишається `NOT_TESTED / PARTIAL`.


## RC.6 exact-head checks and current static GTFS probe — 2026-10-20

- Server PR #21 exact SHA `cbf17c2ccf05d7a7e3126fa0caf74ef8049bc7a2`: runs `39356020667` and `39356033329` PASS, including migration and PostgreSQL/Redis integration.
- Site PR #13 exact SHA `0a773f55f512fd14a57600d6817f7e938cf10886`: runs `39356765911`, `39356769504`, `39356769512` PASS, including production build and browser acceptance.
- iOS PR #8 exact SHA `68749c5ee1bbd59afb8e47584403795034b7c88b`, pins that Site SHA: runs `39356792059`, `39356796291` PASS for revision assertion, Site build, Capacitor sync and iOS Simulator compile.
- Current static-feed diagnostic on Server #21: five same-process queries on Lviv GTFS SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; all returned the same first five IDs, 100 results and explicit truncation. Median 2,791 ms on local Node 25.4.0, 5-run single-query replay only. Estimated graph 225,883 vs cap 100,000; search stopped at 615,046 steps with pending queue, under the 1,000,000 hard ceiling. Full probe and limits: `27_GTFS_CURRENT_RC6_PROBE_2026-10-20.md`.
- Root production-deployment contract tests: 3/3 PASS; release manifest copies byte-identical; `git diff --check` PASS.
- None of the above establishes staging, real-time feed positions, physical device, backup/restore, deployed SHA or production rollout. PRs remain open.

## Server balanced GTFS overflow retention — 2026-10-21

- Exact Server candidate SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283`, Node `24.21.0`: focused GTFS suite **61/61 PASS**; full `npm test` **293 PASS / 0 FAIL / 3 opt-in Postgres/Redis SKIP**; `npm run typecheck`, `npm run lint`, and `git diff --check` PASS.
- New regression verifies that after the general GTFS candidate pool fills, its overflow backstop keeps a distinct winner of the same shared `BALANCED` scorer, alongside the existing fastest/cheapest/transfer/walking objective samples. The initial checkpoint said hosted checks were pending; the follow-up below records their completed SUCCESS state. Local tests do not establish staging/live-feed or production readiness.

## Dense Lviv feed bounded-search experiments — 2026-10-21

- Current official static-feed download SHA-256 matches the frozen archive (`bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`). The retrievable static file is not evidence of schedule freshness or live-vehicle coverage.
- Exact Server PR #24 SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283` returned 100 options / 37 route-name chains for Малоголосківська→Сихів; `searchTruncated=true`, `candidateGraphTruncated=true`. The three strategy winners were identical. This one-query diagnostic ran on Node 25.4.0 and is not a pinned-runtime acceptance test.
- On six frozen corridors, reservoir 100k→200k increased median measured time by ~38%, yielded one fewer net route-name chain across the six capped responses, did not change FASTEST/CHEAPEST/BALANCED winners, and hit the hard million-step ceiling in four cases. Route-pattern and graph-budget cap increases likewise gave no useful winner/breadth improvement. These are rejected experiments, not tests passing for completeness.
- Exact-head hosted Server runs `39672268416` and `39672277029` PASS for PR #24 code/DB/Redis CI. No staging or production route acceptance is claimed.

## Canonical route-map browser follow-up — 2026-10-22

- On the materialized exact Server/Site candidate SHAs `27ca486d66fa9b30b8559e4b1041ccca67f1d283` / `c50ba344b7dfde9859826363fea119d95e2cc54e`, the focused Chromium behavior scenario passed **1/1** using deterministic local API, database, map, geocoder and OSRM fixtures. It exercised search strategies, route sheet and stop details, segment map focus, fixture-backed two-direction transit line and vehicle overlay (4 vehicles, 3 emphasized), alternate route focus and return navigation. Snapshot assertions were intentionally skipped in this behavior-only rerun.
- Strict screenshot comparison against images extracted from clean orchestration HEAD failed at `journey-route-map-light-half.png`: 121 pixels differ, localized to one intermediate map marker. The current working-tree screenshot for the same state has materially different layout and was preserved; no baseline was regenerated. This is visual `PARTIAL`, not PASS.
- The independent exhaustive button audit passed, clicking 157/158 controls (the sole unclicked element was non-clickable map attribution). Thirteen no-visible-effect heuristic observations remain to classify; no assertions were weakened.
- Test containers `marshgo-db-1` and `marshgo-redis-1` were stopped after the run; `docker compose ps` is empty and named data volumes were preserved. This is local fixture acceptance only, not staging, live-provider, production or physical-device evidence.

## Three-browser responsive and map checkpoint — 2026-10-22

- `npm run test:browser-compat`: **6/6 PASS** on exact materialized Server/Site `27ca486d66fa9b30b8559e4b1041ccca67f1d283` / `c50ba344b7dfde9859826363fea119d95e2cc54e`. Production sign-in, home and search were exercised at viewport widths 320/390/440/768/1440/1920 px; canonical route-map scenario passed in Chromium, Firefox and WebKit.
- Browser run used local Node `v26.7.0`; candidate CI is pinned to Node 24.21.0. Named browser projects intentionally skip screenshot comparisons. This is local deterministic-fixture coverage, not live providers, staging, or physical iPhone Safari.
- First invocation ran immediately after Compose startup and failed connecting to Postgres before Playwright. After waiting for both PostGIS and Redis health checks, the rerun passed all 6 tests. Both test services were stopped afterward; named volumes remained intact.

## Pinned-runtime cross-browser confirmation — 2026-10-22

- Repeated `npm run test:browser-compat` under the repository's pinned **Node 24.21.0**. Result: **6/6 PASS** on exact materialized Server `27ca486d66fa9b30b8559e4b1041ccca67f1d283` / Site `c50ba344b7dfde9859826363fea119d95e2cc54e`.
- Chromium, Firefox and WebKit each passed production sign-in/home/search at 320/390/440/768/1440/1920 px and the canonical route-map scenario. Exact production Site bundle was rebuilt from the pinned SHA; tests used isolated loopback PostGIS/Redis and deterministic map/geocoder/OSRM fixtures.
- Browser projects skip pixel snapshots by design. This does not clear the separate screenshot mismatch, live-provider or staging/production gates, or physical Safari/iPhone acceptance. Post-run local DB/Redis containers were stopped and named volumes preserved.

## Exact Server PostGIS/Redis integration — 2026-10-22

- Ran `npm run test:integration` on clean Server PR #24 worktree, branch `codex/gtfs-route-oracle-20261021`, exact SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283`, Node 24.21.0.
- Result: **30/30 PASS / 0 FAIL / 0 SKIP**. Journey schema/PostGIS 2, live-journey API 1, booking and trip-edit API 21 (including last-seat concurrency/idempotency), Partner tenant isolation 1, navigation 2, Redis realtime across two API instances 1, booking durability across actual API process restart 1, shared Redis rate-limit window 1.
- The official integration script refuses non-loopback or non-`marshgo_e2e*` databases. It migrated the isolated local DB and used fixtures/test-created accounts. It does not establish staging or live-provider behavior. Exact Server worktree stayed clean; local DB/Redis containers were stopped after the suite and persistent volumes preserved.

## Live-source read-only probe — 2026-10-22

- Exact Server PR #24 SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283`, Node 24.21.0: two daytime Lviv GTFS queries returned options and both correctly reported truncation; Zelectra GBFS country filter found 49 fresh/available Kyiv scooters.
- PASS for observed responses only. This does not establish route completeness, rental return feasibility, booking/payment, commercial rights, staging or production; details and source status are in audit 52.

## Current workspace production gate — 2026-10-22

- `npm run check:production` on pinned Node 24.21.0 exited 0 at MarshGO branch `codex/production-finalization-20261014`, HEAD `f944560a3babf7423befc53741217d9281f44dab`, with dirty/untracked work preserved. Typecheck, lint, 252/252 unit tests (1 opt-in DB integration skipped), production build and bundle budget (51 chunks, ≤350 KB gzip each) passed.
- The workspace is not clean, so these results are not an immutable release candidate or production deployment proof.

## Query-aware GTFS graph allocation experiment — 2026-10-22

- Temporary route-budget weighting variant: focused tests **67/67 PASS**, including exhaustive small-feed oracle. Same-feed/six-corridor baseline had 56 unique chains; variant also 56, all six queries still truncated, elapsed 10,424 vs 10,329 ms. No coverage improvement; change rejected and reverted. Exact candidate baseline suite after revert **66/66 PASS**. See audit 53.

## Strict route-map visual and behavior rerun — 2026-10-22

- Exact candidate Server/Site `27ca486d66fa9b30b8559e4b1041ccca67f1d283` / `c50ba344b7dfde9859826363fea119d95e2cc54e`, Node 24.21.0, local fixture services. Default Chromium strict screenshot gate failed at `journey-results-light.png` (**38,180 px / 12%** against an already modified working-tree screenshot). No baseline was overwritten.
- Same route-map scenario in the compatibility Chromium project passed **1/1 in 48.0 s**; this skips only visual snapshots and runs the remaining geometry/interaction assertions. Report 49 has evidence and limits.

## Rejected bounded GTFS search-window experiments — 2026-10-22

- Three temporary per-chain/per-pass budget variants were exercised on the exact Server PR #24 baseline and the same six official Lviv static-GTFS corridors. The focused GTFS/budget suite passed **66/66** for each variant.
- No returned top-20 contained a three-transit-leg result (0/6 corridors); separate diagnostics found 169 valid but slower/equal-fare 3-leg candidates in the first corridor, while the other five did not reach the 3-leg pass. The unbounded per-chain window hit the 1,000,000-step hard ceiling in every search; the bounded variants either reproduced baseline exactly or took ~29% longer while changing only 1/2-leg samples. All changes were reverted; exact Server worktree is clean at `27ca486d66fa9b30b8559e4b1041ccca67f1d283`.
- Full Server unit suite on that clean SHA: **293 PASS / 0 FAIL / 3 opt-in integration SKIP**; `npm run typecheck` and `npm run lint` passed. Exact 30/30 loopback PostGIS/Redis integration remains documented above. Detailed timing and decisions: audit 53.

## Current Server exact-head acceptance — 2026-10-22

- Server PR #24 current SHA `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c`, Node 24.21.0: focused live-journey assembly tests **17/17 PASS**, full unit suite **296 PASS / 0 FAIL / 3 opt-in integration SKIP**, typecheck PASS, lint PASS, diff-check PASS.
- GitHub exact-head CI runs `39689590022` and `39689594787` both **SUCCESS**: dependency audit, lint, typecheck, full unit suite, clean DB migrations, and PostGIS/Redis integration all passed. This is candidate CI, not staging or production acceptance.
- Added a regression for a valid fresh-but-empty GTFS-RT snapshot: schedule directions remain available, vehicle position status is unavailable, prediction is absent, and no vehicle marker is fabricated.
- Fresh official Lviv static-feed replay on the same Server code returned 100 routes but explicitly reported graph/search/result truncation; nighttime direct live-feed probe returned fresh empty protobufs. See audits 54 and 55. Daytime/live API and deployed behavior remain NOT_TESTED.

## Exact PR #26/#15 two-account acceptance — 2026-10-22 15:42 UTC

- Pinned source pair: Server `a1961324a2a46bd062231d35720fe349d39d9d76` + Site `348eca22e45df6a57960676bbda2745c2feaca30`, Node 24.21.0. `two independent accounts search, book, negotiate a demand, and exchange persisted chat messages`: **1/1 PASS, 23.2 s**, isolated loopback PostGIS/Redis database `marshgo_e2e_pr15_market_final10_20261022`.
- Assertions cover account/role isolation; journey search and selected offer; server booking and seat inventory; ticket issue/boarding/start/mutual completion; two persisted reviews and duplicate-review rejection; session refresh and deep-link history; 55-message older-history pagination; unread/read cursor; passenger demand, driver offer, counteroffer and second confirmed booking; block denial/unblock; privacy export and reversible account-deletion request. Fixture SMS, identities and map inputs were used; this is not field or staging proof.
- Root local `npm run check:production` on pinned Node 24.21.0 exited 0: typecheck, ESLint, production build, bundle gate (51 chunks ≤350 KB gzip). Unit suite independently reported **256 PASS / 0 FAIL / 1 opt-in integration SKIP**. `git diff --check` PASS.
- Full root Playwright suite on the same exact source pair completed: **15/16 PASS** in 7.3 minutes. Passing tests include 152-click button audit, 2-account marketplace, multi-rider GPS reroute, iPhone viewport layout, denied-GPS recovery, URL restoration, Journey Planner and two rendezvous scenarios. The sole failure is strict `journey-results-light.png`: **54,144 pixels / 16%** differ from the existing legacy golden. The actual view and diff were inspected; no snapshot was changed and no pixel threshold was relaxed. Visual acceptance remains open pending an owner-approved baseline.

## Перевірки кандидата — 2026-10-22, точна Site/iOS синхронізація

- Orchestration checkout `f944560a3babf7423befc53741217d9281f44dab`: `npm run check:production` **exit 0**; typecheck, lint, 256 unit PASS / 0 FAIL / 1 opt-in integration SKIP, production build, bundle guard 51 JS chunks (кожен ≤350 KB gzip).
- Server PR #26 `a1961324a2a46bd062231d35720fe349d39d9d76`: exact-head CI `39777928826`, `39777958708` SUCCESS; попередньо локально unit 296/296, PostGIS/Redis integration 30/30.
- Site PR #15 `1d2aaa012b88519273eae7a2b8d703ec32c212f6`: exact-head CI `39812983985`, `39812990396`, `39812990434` SUCCESS; локальний `check:production` + 126 unit PASS, 21/21 Site Playwright across Chromium/Firefox/WebKit; focused root map acceptance 6/6 cross-browser.
- iOS PR #9 `976ede9e8c61fcae7653d815a46c22a9a234ba7e` pins Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`: local bundle build, Capacitor sync, Xcode Simulator compile/install/launch/first-render screenshot PASS; hosted CI `39813329879`, `39813552470`, `39813560229` SUCCESS. Loopback API build only; live API/physical iPhone not tested.
- Root E2E exact Server/Site tuple: 15/16 PASS. Non-button suite 14/15; booking/chat, reverse marketplace, multi-rider stops and reroute, GPS denial, route reload, Journey Planner and rendezvous pass. Sole failure: stale/different `journey-results-light.png` screenshot, 54,604 px / 16%; actual and golden inspected, golden preserved pending an approved canonical reference.
- Button audit separately PASS after 152 clicks with no runtime/page error. 13 no-visible-effect notices are unclassified by the current heuristic, which does not compare input `.value`, focus/validation or ARIA state.

## Server PR #27 — GTFS same-route in-seat continuation — 2026-10-22

- Branch `codex/bounded-timetable-multicriteria-20261022`, commit `30fa1cfa52621e7ed4ca47ad61794711ac484e62`, based on release-candidate SHA `a1961324a2a46bd062231d35720fe349d39d9d76`.
- Regression: two scheduled trips share a `route_id` and are connected by exact trip-level GTFS `transfer_type=4`; search must retain the zero-walking, zero-count in-seat continuation through both candidate selection and bounded reachability.
- Local results on Node 24.19.0: Server full unit suite **296 PASS / 0 FAIL / 3 opt-in integration SKIP**; GTFS timetable suite **63 PASS / 0 FAIL**; TypeScript PASS; ESLint PASS; `git diff --check` PASS. Project requires Node 24.21.0; CI is the exact supported-runtime check.
- PR #27 exact-head runs `39817276374` and `39817284271` both completed **SUCCESS**, including dependency audit, lint, typecheck, full unit tests, clean migration run, and PostgreSQL/Redis integration. PR is open/unmerged; no deployment or production claim.

## iOS PR #11 exact Server/Site manifest pin — 2026-10-22

- iOS branch `codex/ios-pin-server-pr27-20261022`, commit `ec586d63e1c07a4807c8991b20c35d1193e0f73d`, stacked on open PR #9. Non-tag iOS builds now embed Server PR #27 SHA `30fa1cfa52621e7ed4ca47ad61794711ac484e62`; Site remains exact PR #15 SHA `1d2aaa012b88519273eae7a2b8d703ec32c212f6`. Hosted workflow compares embedded Server/Site/iOS SHAs before compiling.
- Local: exact Site production bundle, Capacitor sync, Xcode Simulator build, install, launch and screenshot of first rendered screen all passed. Manifest metadata also includes API `v1` and migration `055_provider_commercial_use`. Build used loopback API origin; no live server was claimed.
- Hosted exact-head iOS Simulator runs `39818386979` and `39818394871`: **SUCCESS**, including new release-manifest check.
- iOS PR #11 remains OPEN/unmerged. Physical iPhone, signed archive/TestFlight, APNs/background GPS, live API and deployment remain NOT_TESTED.
- GitHub deployment inventory: zero records across MarshGO, Server, Site, iOS, Admin, Partner.

## Повторний integrated browser E2E exact candidate — 2026-10-22

- Використано pinned production PWA Site #15 `1d2aaa012b88519273eae7a2b8d703ec32c212f6` та Server #27 `30fa1cfa52621e7ed4ca47ad61794711ac484e62` з локальними E2E fixture servers.
- Playwright завершився зі статусом `failed`, `.last-run.json` має 15 failed IDs. Збережені докази показують три OTP request 500 responses і один `ECONNREFUSED` до PostGIS `127.0.0.1:5544`. Docker Desktop VM log зафіксував `no space left on device`, після чого VM зупинилась; ці помилки не класифіковані як підтверджені продуктові дефекти.
- Docker Engine не відновився штатною командою `docker desktop restart`; status/CLI зависає через активні backend/build процеси. На системному Data volume лишалося 1.1 GiB. Локальний Postgres 5432 не має PostGIS і не використовувався для підміни. Нічого не видалено, чистка не запускалась.
- **Результат:** повний інтегрований browser acceptance — `BLOCKED_LOCAL_INFRA`; до відновлення loopback PostGIS/Redis прогін необхідно повторити з нуля на тих самих SHA. Не рахувати часткові UI тести як повний E2E PASS.
