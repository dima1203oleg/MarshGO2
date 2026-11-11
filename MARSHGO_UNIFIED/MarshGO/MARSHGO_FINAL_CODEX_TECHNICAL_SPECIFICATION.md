# MARSHGO: технічне завдання для Codex

Дата зрізу: 2026-11-06, Europe/Kyiv. Призначення: передати цей документ виконавцю для інтеграції та доведення продукту до перевіреної готовності. Цей аудит виконувався лише читанням; результати тестів нижче, якщо не зазначено інакше, походять із журналів проєкту і не були повторно запущені автором цього документа.

## 1. Межі доказів і обов’язкова повторна інвентаризація

Це **робоче ТЗ, а не доказ повного аудиту всіх гілок і комітів**. Переглянуто локальні стани чотирьох checkout, GitHub main усіх шести репозиторіїв, списки відкритих PR із обмеженням виводу 45 на репозиторій, вибрані PR та документи. Не перевірено кожен PR, закритий PR, Actions run, кожен diff, stash/reflog і кожну гілку; не проведено порівняння всіх версій функцій. Тому таблиці рішень нижче є початковими, а не вичерпними. Дати й SHA потрібно перевірити знову перед реалізацією: спільне середовище змінюється.

Джерела: [інженерний контракт](.qoder/rules/production-readiness.md), [NEXT_ACTIONS](NEXT_ACTIONS.md), [CODEX_PROGRESS](CODEX_PROGRESS.md), [матриця приймання](docs/PRODUCTION_ACCEPTANCE_MATRIX.md), [блокери](docs/EXTERNAL_BLOCKERS.md), [реєстр репозиторіїв](docs/REPOSITORY_INVENTORY.md), [дизайн](docs/design/CANONICAL_DESIGN.md). Історичні документи можуть суперечити поточному main. Вважати первинними поточні GitHub API, Git-об’єкти, код і повторювані результати перевірок.

**P0-INV.** До будь-яких змін у кожному з шести репозиторіїв зібрати `git status --porcelain=v1`, `git diff`, `git diff --cached`, `git branch -avv`, `git worktree list --porcelain`, `git stash list`, `git reflog --all`, `git remote -v`, `git log --all --decorate --oneline`, `git cherry -v origin/main <branch>` та `git rev-list --left-right --count origin/main...<branch>`. Зберегти untracked/ignored важливі артефакти й бінарні файли окремо; не вважати diff повним backup. Порівняти remote-tracking refs зі свіжим GitHub станом, не переписуючи локальні роботи. Переглянути всі сторінки відкритих/закритих/merged PR, Actions, releases і захист гілок, включно з base/head SHA та станом exact-head checks. Не виводити секрети. Для кожного branch/stash/worktree визначити унікальні коміти/файли, предка, upstream і стан інтеграції; prunable не означає безпечний до видалення. **DoD:** повна машинозчитувана інвентаризація з часом, пагінацією, помилками доступу й посиланнями, без втрати файлів.

## 2. Перевірений зріз

| Репозиторій | GitHub `main` SHA на момент запиту | Локальний checkout |
|---|---|---|
| [MarshGO](https://github.com/dima1203oleg/MarshGO) | `1e7d0ee74f11121a7d5a29c6379944a5360581c4` | `antigravity/ultimate-premium-web-9`, `4fd9bd70dd36b49f1c538c7a3e1a2cd1dc5ae0fd`; 460 записів porcelain, у т.ч. untracked |
| [Server](https://github.com/dima1203oleg/MarshGO-Server) | `b54a833aec3f370c0b883d642ea24f03da183d7c` | `antigravity/ukraine-12-transports-multimodal`, `e9934abbd8fc973177de8d7f47548739758a1b74`; 7 записів porcelain; 1 stash |
| [Site](https://github.com/dima1203oleg/MarshGO-Site) | `f37839128452f1a0039f27928892cc5b519e0876` | `antigravity/ultimate-premium-web-9`, `eda449f008025b2126c92fd24cd68deb513ca3ad`; 11 змінених файлів |
| [iOS](https://github.com/dima1203oleg/MarshGO-iOS) | `ad27b6f70b6255d1dd323bafcffafe4558232224` | `codex/production-site-sync-20261014`, `4353cec3cacbaf662ceea047402f361024292b22`; clean |
| [Admin](https://github.com/dima1203oleg/MarshGO-Admin) | `02b28940ee017523f2feed01de458f8d0aa20279` | sibling checkout за очікуваним шляхом не знайдено; локальний стан невідомий |
| [Partner](https://github.com/dima1203oleg/MarshGO-Partner) | `179631f45e984c5712bef83af43912125e3521d1` | sibling checkout за очікуваним шляхом не знайдено; локальний стан невідомий |

Кількість dirty-файлів — зріз, не оцінка змісту; `origin/main` є локальним ref, а таблиця main перевірена GitHub API. Відсутній каталог не доводить відсутності інших копій. Віднайти Admin/Partner через безпечний inventory та GitHub без припущень про credentials.

Кореневий `RELEASE_MANIFEST.json` містить `NOT_RELEASED`, `production_ready=false` і кандидатні Server `44f954b3ce6099dde86cebfe7984079a078a5872`, Site `fef697e2603b43c5bc76a9f98e78dba50cc8b480`, iOS `4353cec3cacbaf662ceea047402f361024292b22`, Admin `4eb5d15d1692ebcdb5aae40dbcffc39446138fb5`, Partner `544e5d8c71a04601fae5f0d92dd5ec186f7ac241`. Вони не збігаються з поточними GitHub main; це не узгоджений підтверджений реліз. Звірити також `docs/RELEASE_MANIFEST.json` та реальні артефакти, перш ніж оновлювати будь-який pin.

На локальному зрізі `:4178` слухає Node; `:3002` і `:5434` не мали слухача. Це лише моментальний стан. `NEXT_ACTIONS.md` описує preview 200, `/readyz` 502 та недостатні ресурси; автор не повторював наскрізний маршрут. Перевірити `lsof`, точні cwd/PID, Docker Compose labels, HTTP `/readyz`, API target, DB/Redis, порт, версію bundle і iOS перед тестуванням. Не плутати preview із production.

## 3. Матриця напрацювань і рішень

| Джерело / доказ | Де | Рішення та умова |
|---|---|---|
| Antigravity | Site `eda449f008025b2126c92fd24cd68deb513ca3ad`, Server `e9934abbd8fc973177de8d7f47548739758a1b74`; обидва dirty | **Вибірково порівняти**, не переносити гілки цілком. Перевірити ancestry проти актуального main, геометрію, камеру, фіди та кожен сегмент. Незакомічені файли зберегти. |
| Antigravity, заяви про 12 режимів/стратегії | `CODEX_PROGRESS.md`, блоки 2026-11-05 19:10/19:58 UTC | **Не приймати як доказ.** Пізніший Codex review вказує, що `scripts/test-strategy-filtering-cheapest-optimal-fastest.mjs` друкує значення без перевірки переможців. Додати assertions і identity parity; повторити на закріпленому стеку. |
| Qoder, RT-OVERLAY-HONESTY-1 | `CODEX_PROGRESS.md`, 2026-11-06 03:05 UTC; там названі `src/views/liveJourneyVehicle.ts` та tests | **Вибірково перенести після перевірки фактичного worktree/diff:** звіт описує усунення синтетичного наближення й 23/23 fixture-тести. Browser/live не перевірені. Не представляти таймер або створені координати як телеметрію. |
| Qoder, CRASH-RESILIENCE-1 | `/tmp/mg-pg-crash` base `b54a833aec3f370c0b883d642ea24f03da183d7c`, uncommitted `server/index.ts`, `server/db/`, `tests/db-resilient-pool.test.ts`; також `/tmp/mg-pg-crash2` base `e9934abbd8fc973177de8d7f47548739758a1b74` із власними dirty файлами | **Порівняти обидва diff**, не обирати за назвою. Звіт про 6/6 unit не доводить живий обрив з’єднання. В ізольованій БД перевірити active/idle `pg` error, подвійний release, транзакцію та `/readyz` після відновлення. |
| Qoder, геометрія | `/tmp/mg-geo-fix`, base `b54a833aec3f370c0b883d642ea24f03da183d7c`; dirty `server/index.ts`, `server/journey/legGeometry.ts`, `tests/leg-geometry.test.ts` | **Порівняти частково** із поточним Server `shared/navigation/pedestrianGeometry.ts` і `server/journey/routeGeometryProvenance.ts`; провести перевірку фактичної геометрії, provenance та fallback без вигаданого шляху. |
| Codex, GTFS | [Server PR #59](https://github.com/dima1203oleg/MarshGO-Server/pull/59), head `90ec8cb1ce` на момент переліку; [історичний replay](docs/audit/308_EXACT_COORDINATE_LVIV_TARGET_CHAIN_REPLAY_CORRECTION_2026-10-29.md) | **Не зливати автоматично.** Перевірити актуальний повний head і ancestry; історичні replay залишали truncation і раніше фіксували регресію latency. Потрібен exact-head A/B без детальних діагностик, oracle і репрезентативні маршрути. |
| Qoder/інші автори PR | [Server #78](https://github.com/dima1203oleg/MarshGO-Server/pull/78) head `d3995c71d024ebcb152ed4a5dd9ceba50f59d206`, base `a632d873252c6d51687918f831e39bdb77240cb9` | **Конфліктує.** GitHub показав два успішні `verify`, але це не вирішує конфлікт чи live-приймання. Порівняти `server/index.ts`, `server/journey/{gtfsTimetable,gtfsFares,walkingRoutes,scoring,search,searchCompleteness}.ts` і відповідні тести з поточним main та dirty checkout. |
| Qoder/інші автори PR | [Site #58](https://github.com/dima1203oleg/MarshGO-Site/pull/58) head `5d897d37d2c66c653adb33b73478907cfeb45b6c`, base `8d927e8098a36f94f2ac519e52f7c720f1e0d239` | **Конфліктує.** Порівняти `src/index.css`, `src/views/{HomeHero,JourneyResultsPanel,ProductionMarketplace,TransportMapView,resultsDiagnostics}.tsx/ts`, `tests/results-diagnostics.test.ts`; зберегти виправлення і canonical UX лише після поведінкової перевірки. |
| iOS | [PR #16](https://github.com/dima1203oleg/MarshGO-iOS/pull/16), head prefix `e1cf623ecc`, base `codex/reliable-capacitor-sync` | Перевірити повний SHA, точний Site pin, CI та фізичний пристрій. Не стверджувати, що simulator build доводить роботу iPhone. |
| Gemini / AI Studio | Назви/файли потребують повного пошуку | **Не встановлено авторство чи якість.** Знайти за commits, PR, локальними файлами і документами; не приписувати авторам за назвою гілки. |

Серверні локальні зміни містять `server/index.ts`, `server/journey/multimodalChainEngine.ts`, `shared/navigation/pedestrianGeometry.ts` і untracked `routeGeometryProvenance.ts`, `staticMultimodalFallbackPolicy.ts` та їхні тести. Site має dirty `MapLibreAdapter.ts`, `journeyRouteModel.ts`, `routeCameraController.ts`, `JourneyRouteMapScreen.tsx`, `routeSheet.ts` та інші файли. Це **зони можливого конфлікту**, а не доказ, що всі зміни несумісні. Root містить 107 змінених tracked файлів за `git diff --stat` плюс untracked; не stage усе дерево.

## 4. Канонічна архітектура й продукт

Використовувати `.qoder/rules/production-readiness.md`: активний UI і дизайн — `MarshGO-Site`; API, PostGIS, Redis, провайдери й маршрутизатор — `MarshGO-Server`; Capacitor shell — `MarshGO-iOS`; root — оркестрація та E2E, його `src/` є застарілим; Admin/Partner — окремі репозиторії. `MarshGO2` виключити. Підтвердити кожну роль поточним кодом.

Дані: власні поїздки, офіційні/дозволені API й транспортні фіди → backend adapters/validated storage → планувальник → версійований API → Site/iOS і карти. Зберігати походження, права, час джерела, свіжість, розклад/позицію/прогноз/ціну/наявність/booking окремо. OSM геометрія не доводить розклад або наявність транспорту. Секрети лише на сервері. Підкладка карти, геокодування, транспортна геометрія та планувальник — окремі залежності.

12 категорій: попутка, маршрутка, автобус, таксі, трамвай, тролейбус, метро, поїзд, велосипед, самокат, каршеринг, трансфер; пішки — зв’язок. Львів → Україна → міжнародне покриття. Не робити висновок про маршрутку зі звичайного bus `route_type`; метро не показувати у Львові. Невідомі тариф і наявність не дорівнюють нулю чи підтвердженню.

## 5. Backlog: конкретні результати

### P0 — безпека даних та одна версія

**P0-STACK.** Після P0-INV вибрати одну узгоджену пару Server/Site, зафіксувати source SHA, dirty-digest/перелік файлів, build ID, PID/cwd, порти й API target; перевірити PWA service worker і iOS `web` pin. Відновити локальну роботу лише після resource gate `.agents/skills/marshgo-resource-control/SKILL.md`; не запускати важкі процеси паралельно. DoD: відтворюваний start/status/stop і browser network доказ, що сторінка та API походять з очікуваної пари. Не використовувати dev bypass у публічному тунелі.

**P0-TRUTH.** Перевірити реальний diff `server/journey/staticMultimodalFallbackPolicy.ts`, виклики `multimodalChainEngine.ts`, `server/index.ts` і тести. З журналу: fallback жорстко обмежено test-only opt-in; `2/2` policy тестів історично пройшли, але жива система не перевірена. Переконатися, що prod/dev не видає статичні графи за live/доступність/бронь; ізольовано протестувати позитивний test-only та всі негативні режими. DoD: provider outage дає чесний стан, жодного підробленого ETA/квитка/тарифу.

**P0-ROUTE.** Пройти `server/journey/gtfsTimetable.ts`, `search.ts`, `scoring.ts`, `walkingRoutes.ts`, API response contract та Site result selectors. На малих графах — повний oracle для прямих, трисегментних, календаря, DST, >24:00, заборонених/мінімальних пересадок; на frozen Lviv — exact-head A/B з однаковим фідом, OD і часом, diagnostics off, p50/p95 та truncation flags. Окремо перевірити unknown fare, FASTEST/CHEAPEST/BALANCED winner IDs і відповідний порядок UI на тому самому payload. Стрий→Львів та короткі львівські маршрути перевірити з реальними походженням і геометрією. DoD: повернені шляхи зв’язні, часово здійсненні; неповний пошук явно позначений, найкращий результат не гарантовано при truncation.

**P0-RENTAL.** GBFS discovery/system/station/vehicle/geofencing із source/version/TTL; не дозволяти повернення в мережу іншого оператора або довільну точку за невідомих правил. Порожня станція, заряд, обмеження і застаріла доступність мають коректно впливати на план. DoD: fixture + live у реально покритому місті; відсутність українського джерела показати як gap.

**P0-RIDESHARE.** Водій у навігації явно вмикає підбір; пасажир створює запит; matching враховує напрям, час, pickup/dropoff і detour. Погодження, резерв останнього місця в транзакції, ідемпотентність, QR/MarshPass, обопільна згода GPS, посадка, скасування та завершення перевіряються двома ізольованими обліковими записами. DoD: UI→API→DB→UI; race останнього місця і повторний запит не створюють подвійне бронювання; fixture GPS чітко позначено.

**P0-AUTH/DB.** Перевірити реальний `server/index.ts`, `server/db/`, міграції, ownership/role checks і актуальні SMS/OTP/password flows. Не вмикати debug OTP у production. Розв’язати candidate pool-guards за матрицею вище й відтворити аварію активного з’єднання у disposable DB. DoD: відновлення API без втрати транзакцій і без витоку приватних даних; недоступний провайдер аутентифікації не створює фальшивий успіх.

### P1 — функціональність, UX і продуктивність

**P1-WEB.** У `MarshGO-Site` звірити всі екрани, головну/пошук/+/поїздки/профіль, result sheet, карту, 2D/3D, супутник, фокус сегмента, теми й Reduce Motion із `docs/design/CANONICAL_DESIGN.md` та погодженими reference assets. Виправити лише реальні прогалини; кожна кнопка працює або показує unavailable. DoD: перевірка 320–desktop, keyboard/VoiceOver, 44px targets, sheet states і screenshots з exact build SHA.

**P1-MAP.** У `src/map/MapLibreAdapter.ts`, `routeCameraController.ts`, `journeyRouteModel.ts`, `src/views/JourneyRouteMapScreen.tsx` не змішувати запланований рух із фактичним GPS. Вибір сегмента фокусує його геометрію, інші сегменти приглушені; зупинки й транспорт відповідають маршруту, позиція свіжа і прив’язана до trip/route/direction. Після повернення в застосунок навігація відновлюється. Перевірити style/tile URL, attribution, ліцензію й якість джерела, супутник лише з наданими правами. DoD: реальний/fixture доказ окремо, degraded state, map camera і PWA.

**P1-IOS.** Звірити `MarshGO-iOS/scripts/checkout-site.mjs`, `write-build-info.mjs`, Capacitor config, URL API, permissions, push/GPS і pin Server/Site. `npm run site:checkout`, `npm run site:build`, `npm run sync`, `npm run build:simulator` виконувати лише в ізольованій копії з дозволеною конфігурацією. DoD: signed build ID/SHA, тест на фізичному iPhone користувача, GPS/foreground/background, мережа та автентифікація; simulator не замінює фізичний тест.

**P1-PORTALS.** Отримати дозволений checkout Admin/Partner; перевірити їхні `package.json`, versioned API, авторизацію та tenant isolation, approval/audit сценарії. Не вважати попередні PR/CI доказом поточного стану. DoD: два tenants і ролі, заборонені доступи, журнал без персональних секретів, браузерний E2E.

**P1-PERF.** Профілювати реальні маршрути, PostGIS індекси, Redis/Radius, cache keys/TTL і concurrency; measured baseline, p50/p95, пам’ять та truncation до/після. Тест 1000 RPS лише на погодженому відповідному стенді. Для MapLibre вимірювати frame/memory під щільним шаром; не змінювати UX без доказів.

**P1-PROVIDERS.** Побудувати матрицю всіх 12 категорій: source URL, власник, права, категорія, географія, verified HTTP, importer, planner, map, тариф, наявність, booking, дата та блокер. Перевірити вже надані CSV Kiwitaxi, права й freshness; read-only каталог не є live booking. Запити, які потребують договору/ключа, позначити окремо. Для кожного ввімкненого джерела — контрольний дозволений запит і тест від джерела до UI.

### P2 — борг і супровід

Інвентаризувати мертві експорти, дублікати, залежності, міграції та старі екрани з посиланням на call sites і tests. Видаляти лише після перевірки використання, заміни, узгодження ownership і без втрати історії/функцій. Розширити runbooks, спостереження, безпечну роботу із секретами, retention і документацію додавання провайдера. Платежі — лише за підтвердженими вимогами й авторизованою інтеграцією; sandbox не є production.

## 6. Порядок інтеграції і безпечна паралельність

1. P0-INV → резервні копії dirty/stash/untracked → граф залежностей PR за фактичними `baseRefOid/headRefOid`, включно зі stacked PR. Для кожної пари однієї функції — diff, ancestry, тести, acceptance та рішення: повністю/частково/об’єднати/переробити/відхилити/лишити; видалення — лише після доказу.
2. Створити окремі integration worktrees і гілки з актуальних узгоджених main. Дотримуватися актуального `.qoder/rules/production-readiness.md` і політики власника; якщо префікси гілок для різних агентів суперечать один одному — перевірити застосовність для виконавця. Не reset/clean/force-push, не переписувати чужі зміни.
3. Server contract/migrations/provider truth → Site API/UX → Admin/Partner → iOS pin → root orchestration/release manifest. Не переносити неперевірені старі PR пачкою. Кожен конфлікт вирішувати по обох семантиках та перевірках, а не за віком коміту.
4. Можливі незалежні субагенти у worktree: Server routing/oracle; Site map/UX; Admin/Partner contract; iOS pin/review; provider inventory. У кожного один owner і scope, SHA, acceptance; не редагувати ті самі файли паралельно. На 8 GB Mac один важкий локальний процес. Результати переглядає інтегратор.
5. Після tests створити PR для кожного репозиторію з залежностями та доказами, виконати review/checks, інтегрувати відповідно до дозволів і захисту GitHub. Користувач описав бажаний merge в main у майбутньому завданні; виконавець повинен врахувати чинні правила репозиторію, конкретну авторизацію і захист гілок, без bypass. Після дозволеного merge/push зафіксувати SHA й перевірити сумісність; відсутній дозвіл — явно заблокований крок.

## 7. Тести та релізні гейти

Команди запускати із відповідного перевіреного checkout, з версією Node з його конфігурації, після resource check і тільки на ізольованих даних:

```sh
git status --short --branch
npm run typecheck
npm run lint
npm test
```

Server додатково `npm run test:integration` (після перевірки скрипта/ізоляції БД та Redis); Site `npm run verify` після focused перевірок; root Playwright E2E — після вивчення його налаштувань та точних Site/Server джерел. iOS команди — розділ P1-IOS. Для Admin/Partner зчитати їхні scripts із checkout, не вигадувати назви. Не припускати, що вихід 0 означає всі тести: фіксувати passed/failed/skipped і реальний target SHA.

Матриця сценаріїв: Львів прямий/з пересадками; Київ за доступними даними; міжнародний рейс; прокат у місті з дійсним фідом; змішаний маршрут; цінові стратегії та невідома ціна; скасування/застарілість; SSRF/архіви/429; два користувачі та останнє місце; iOS фізичний GPS; Admin/Partner і tenant isolation; мережевий обрив; browser accessibility; резервне копіювання, перевірка відновлення в порожню disposable БД, rollback і smoke на staging.

Кожен гейт має result, дату, environment, повні SHA/build, команди, дані/fixture/live, logs/artifacts, причину skip/fail. Після кожного змістовного етапу оновлювати наявні `CODEX_PROGRESS.md` і `NEXT_ACTIONS.md`, матрицю та єдиний manifest, зберігаючи чужий вміст.

## 8. Production Definition of Done

Працюють і перевірені потрібні функції Web, Server, iOS, Admin, Partner; законні джерела для кожного оголошеного режиму з підтвердженим покриттям; реальна побудова й здійсненність ланцюгів; двостороннє бронювання й MarshPass; відповідні browser/device/security/performance tests; сумісні міграції й API; staging, HTTPS, health/readiness, моніторинг, backup/restore, rollback та smoke. Невідомі джерела/угоди, відсутній пристрій або staging залишають відповідний гейт незакритим, а не знімають вимогу.

`NOT_RELEASED` зберігається до всіх обов’язкових доказів і перевіреного rollout. Налаштувати кандидатні artifacts і план розгортання; не купувати, не публікувати App Store і не розгортати production без визначеної цілі, доступу й авторизації. Наприкінці надати таблицю implemented / fixture / live / staging / physical iOS / deployed, точні SHA, PR/CI, невирішені блокери та наступну дію. Не називати цей документ чи попередні агентські заяви доказом завершення продукту.
