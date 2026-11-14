# MARSHGO — детальний аудит чистки, консолідації та оптимізації

**Дата зрізу:** 18.10.2026, Europe/Kyiv  
**Статус:** read-only інвентаризація; жоден код, Git ref, checkout, база даних чи файл користувача цим звітом не видалявся.  
**Призначення:** перетворити «велику чистку» на перевірюваний перелік рішень: що зберегти, що об’єднувати, що є кандидатом на очищення, що оптимізувати і які докази потрібні перед дією.

## 1. Висновок для власника

Зараз не можна безпечно запускати загальне видалення. Найбільше місця займають не очевидно мертві вихідні файли, а повторні release materialization-и, залежності та iOS/build outputs. При цьому `.release/` використовується release/E2E скриптами й містить SHA-прив’язані checkout-и та докази перевірок. Виявлені checkout-и не можна вважати кешем лише за їхнім розташуванням.

Найважливіші рішення:

1. **Зберегти все поточне незакомічене:** umbrella має 47 status entries; Server — 16; Site — 30; вкладений Site у iOS — 2. Серед них активний код/тести, reference snapshots, lockfile, звіти та локальні докази. Це не кандидати на загальну чистку.
2. **Не видаляти `.release/` цілком.** Виявлено 80 безпосередніх піддиректорій із SHA-іменованими Server/Site checkout-ами, build outputs, screenshots, Playwright traces, manifest і staging logs. Існуючі скрипти та CI прямо читають цю структуру. Частина Git worktree pointers веде до відсутніх зовнішніх gitdir; ще один checkout має staged deletions. Спершу потрібна звірка кожного елемента з manifest, комітами та звітами.
3. **Упорядкувати повторну власність коду між umbrella, Server і Site.** За локальним порівнянням: `server/` umbrella↔Server: 61 ідентичний файл і 24 різні; `src/` umbrella↔Site: 48 ідентичних і 48 різних; `shared/` umbrella↔Server: 4 ідентичні файли. Це база для пофайлової міграційної матриці, не доказ дозволу видалити копії.
4. **Знизити ризик заповнення диска.** Файлова система показала лише 4,7 GiB вільного місця при 99% заповнення. Поточні build outputs і повторні залежності потребують retention-політики; очищати їх можна лише після закріплення точних SHA та збереження потрібних релізних доказів.
5. **Не чіпати жодне сховище даних у рамках файлової чистки.** PostgreSQL/PostGIS, Redis, Firebase Auth і S3 мають різних власників, семантику та ризики. Їхній окремий порядок read-only discovery наведений у [12_DATA_STORES_AND_SAFE_CLEANUP_PLAN_2026-10-18.md](12_DATA_STORES_AND_SAFE_CLEANUP_PLAN_2026-10-18.md).

### Коротка класифікація

| Об’єкт | Поточний статус | Висновок |
|---|---|---|
| Незакомічені зміни у чотирьох основних checkout-ах | `KEEP / OWNER_WORK` | Не чистити; спершу зафіксувати власника, гілку й SHA, далі завершити/закомітити окремими логічними комітами. |
| `.release/` SHA-checkout-и | `BLOCKED_UNKNOWN` | Є активні посилання з CI/scripts і неповні/застарілі gitdir; зберегти до інвентаризації. |
| `.release` screenshots/traces/logs | `EVIDENCE_CANDIDATE` | Частина підкріплює релізні звіти; звірити посилання, хеші й дублікати до архівації/видалення. |
| `dist/`, `ios/build/`, `DerivedData`, coverage, `node_modules` | `GENERATED_REBUILDABLE_CANDIDATE` | Ігноровані/генеровані; імовірно відновлювані, але зберегти актуальні релізні артефакти й перевірити відсутність процесу, який їх використовує. |
| Копії `server/` і `src/` між umbrella та цільовими репо | `CONSOLIDATION_REQUIRED` | Визначити один власник кожної функції, перенести унікальне, довести parity тестами; не робити механічне видалення. |
| 50 SQL migrations у Server | `KEEP / SCHEMA_HISTORY` | Не видаляти/переписувати застосовані міграції; перевірити ledger та дублікати з umbrella. |
| DB/Redis/S3/Firebase та browser state | `BLOCKED_UNKNOWN` | Немає підтвердженого production endpoint/власника/retention; жодних destructive cleanup-команд. |
| Тимчасові route bench та screenshots у корені | `OWNER_REVIEW` | Перевірити призначення, чи є доказом поточної роботи та чи посилаються на них; не видаляти автоматично. |

## 2. Межі та метод

Цей зріз включає локальні checkout-и umbrella `MarshGO`, `MarshGO-Server`, `MarshGO-Site`, `MarshGO-iOS`, видимі Git status, конфігурації ignore, entrypoints, release scripts, manifest і статичне порівняння файлів. Значення файлів секретів, персональні записи та вміст зовнішніх сховищ у звіт не виводилися.

Це **не** доводить, що весь GitHub ref space, кожен локальний orphan checkout, зовнішня БД чи production bucket повністю інвентаризовані. Відсутність статичного `import` також не є достатнім доказом мертвого коду: потрібні перевірки dynamic imports, route registration, plugin discovery, migrations, jobs, scripts, CI та iOS bridge.

## 3. Робочі дерева і незакомічені зміни

| Checkout | SHA на момент зрізу | Що видно у робочому дереві | Рішення |
|---|---|---|---|
| Umbrella `MarshGO` | `d75748311ae981ade2fe61113f00379fe810e68c` | Змінені audit/readiness файли, E2E spec і reference screenshots, `package-lock.json`; нові master spec, gap analysis, checkpoint/audit docs, E2E rendezvous spec, local-start script, screenshot evidence і route-check scratch script. | Не видаляти. Розділити продуктову зміну, тести, доказові скриншоти та локальні тимчасові артефакти; вирішити, які знімки мають залишитись як E2E baselines, а які — тільки як audit evidence. |
| `MarshGO-Server` | `182c77ae4f78…` | Змінені API, GTFS, live vehicles, transport layers, тести та test runner; нові live journey modules, consent migration `054`, тести й route bench. | Не видаляти; завершити кодову ревізію, перевірити SQL migration order і потім включити через PR. Тимчасовий `.tmp-route-bench.mts` — окремий кандидат лише після підтвердження, що результати перенесені/не потрібні. |
| `MarshGO-Site` | `6961afcf008e…` | Змінені map focus/adapter, journey route model/results, API, navigation, CSS, preference і тести; нові rendezvous map/location modules та hit testing; audit/design spec. | Не видаляти; активна реалізація канонічної карти й зустрічі. Після завершення перевірити, чи umbrella копії еквівалентні, перш ніж визначати їх власником. |
| `MarshGO-iOS` | `4353cec3cacb…` | Root git status чистий; iOS генерує/ігнорує `web/` та build output. | Підтримувати як Capacitor shell. Перевірити nested `web/` origin/SHA і збірку окремо; не додавати другий UI у iOS. |
| `MarshGO-cache`, `MarshGO-nav6` | `55a8f1384e55…`, `9610da570471…` | Окремі існуючі Git worktree checkout-и, не доведені як зайві. | Зберегти до звірки `git worktree list`, dirty state, PR/branch і унікальних комітів. |

Umbrella status містить багато змінених та untracked screenshot artifacts. Це свідомо зберігається: Playwright snapshots можуть бути тестовими baseline-ами, а `.release` screenshots — доказами звітів. Спершу визначити ownership та зв’язки, потім окремо прийняти рішення про локальні файли.

## 4. Детальний кандидатний реєстр

### 4.1 Git/worktree та release snapshots

| Шлях/об’єкт | Доказ | Рішення/дія | Ризик і умова перед дією |
|---|---|---|---|
| `.release/` загалом | У кореневому `.gitignore` ігнорується; релізні scripts і CI читають `.release/compose.production.yml`, `.release/server-${SHA}`, `.release/site-${SHA}/dist`; індекс manifest має pinned SHA. | `KEEP + RETENTION_POLICY`; не видаляти оптом. Ввести реєстр: pinned current release, останні N перевірених кандидати, evidence, disposable cache. | Видалення directory може прибрати єдину копію checkout, Docker/compose input, лог/trace або screenshot-доказ. Перед прибиранням кожного child path звірити SHA, посилання з Markdown/CI, clean/dirty state, gitdir, backup і rebuildability. |
| `.release/server-*`, `.release/site-*` | Знайдені численні SHA-іменовані worktree-like каталоги. Серед них є detached clean checkout-и з незакоміченими generated `Dockerfile.marshgo`/`.dockerignore`; деякі `.git` files посилаються на відсутні зовнішні `.git/worktrees/...`. | `BLOCKED_UNKNOWN`; скласти машинний індекс name→HEAD→gitdir exists→status→size→manifest refs→docs refs. Відновити source parent для orphan pointer або зберегти snapshot. | У разі відсутнього gitdir поточний каталог може бути єдиним доступним checkout-контентом. Не запускати `git worktree prune`, `rm -rf`, re-materialization поверх нього, поки не збережено diff/файли. |
| `.release/site-ac15b3bd0650ed25a5166229ca1c3f2d2215b24c` | Git status має staged видалення багатьох tracked Site файлів у branch `main`. | `OWNER_REVIEW / PROTECT`; ізолювати як підозрілий/неповний snapshot; зафіксувати `git diff --cached --stat` і порівняти з його HEAD перед будь-якою дією. | Це не cache, який можна прибрати за назвою. Staged deletions можуть бути помилкою або свідомим станом; не скидати й не відновлювати без аналізу provenance. |
| `.release/materialized.json` | Маніфест: schema v2; Server `182c77…`, Site `aff0ead…`, integration `196784…`; вказує `pinnedSourceTreesClean=true`. Теперішній Site checkout — `6961af…` і dirty, отже manifest candidate не тотожний поточній роботі. | `KEEP / UPDATE ONLY WITH RELEASE`; зберегти як exact candidate provenance, не переписувати під час cleanup. Окремо додати індекс усіх materializations, якщо система дозволяє. | Не приймати `pinnedSourceTreesClean` за чистоту поточного Site checkout або за production deploy; довести reproducibility на точних SHA. |
| `.release/compose.production.yml`, Docker inputs | Compose має SHA-256 у manifest; CI виконує Docker build із цим файлом. | `KEEP`; перевірити, що source template має єдиного власника, а generated копія відтворюється за SHA. | Видалення зламає production-build CI або зробить manifest неповторюваним. |
| `.release/staging-*.png`, `*.trace.zip`, `*.json`, `*.log` | Є прямі посилання у `docs/RELEASE_STATUS.md`, `docs/FINAL_PRODUCTION_GAP_AUDIT.md` та інших звітах. Частина traces фіксує E2E failure і ENOSPC. Є повторні назви/суфікси-кандидати. | `EVIDENCE`; побудувати references + SHA256 + size index, об’єднати ідентичні byte-for-byte лише після того, як усі звіти посилаються на canonical copy; великі traces архівувати за політикою evidence. | Це аудиторські докази; видалення може обірвати пояснення висновку. PII/tokens у traces потрібно перевіряти без друку значень і обмежувати доступ. |
| `.release/*.pid`, `*.log` provider/edge-staging | Малі локальні pid/log файли, можуть бути застарілими, але pid reuse можливий. | `OWNER_REVIEW`; перед cleanup перевірити процес за PID, command/cwd та портом; тільки після цього прибирати застарілий pid-файл. | Не вбивати процес за вмістом PID без перевірки, що це саме створений MARSHGO процес. |

### 4.2 Build output, залежності й диск

| Шлях | Поточний доказ | Рішення | Перевірка перед очищенням/оптимізацією |
|---|---|---|---|
| `dist/`, `MarshGO-Site/dist/`, `MarshGO-iOS/web/dist/`, `.release/site-*/dist/` | Ігноровані build outputs; Vite/PWA artifacts; release scripts очікують `.release/site-*/dist`. | `GENERATED_REBUILDABLE_CANDIDATE`; тримати latest pinned output, старі повторно створювані outputs — retention cleanup після посилань/manifest check. | Переконатись, що не подається поточним локальним сервером, iOS preview чи E2E; для pinned candidate зберегти відтворюваність і SBOM/hash, якщо потрібен релізний доказ.
| `MarshGO-iOS/ios/build/`, `ios/DerivedData/` | Ігноровані Xcode/Capacitor outputs. Попередня оцінка розміру iOS build cache ~209 MiB; iOS дерева/артефакти можуть включати native output. | `GENERATED_REBUILDABLE_CANDIDATE`; чистити через Xcode/Capacitor штатний clean після закриття build, не видаляти вихідний native код чи signing config. | Перевірити, що немає active Xcode build і що output можна відтворити з pinned Site SHA. Не видаляти signed archive/IPA, якщо з’явиться і буде єдиним release artifact.
| `MarshGO-iOS/ios/` | 31 tracked files на root repo; сама папка містить реальний Xcode проєкт і близько 200 MiB у попередньому disk scan. | `KEEP SOURCE / SEPARATE BUILD`; чистити тільки підтверджений `build`, `DerivedData`, simulator cache. | Перевірити `git ls-files` і `.gitignore` для кожної підпапки: не прирівнювати всю `ios/` до build cache.
| `node_modules/` в усіх активних та `.release` checkout-ах | Ігноровані залежності, у `.release` багато окремих dependency installs. | `OPTIMIZE`; після збереження потрібних pin builds, використовувати lockfile/cache-стратегію або спільний npm cache, не ділити один mutable `node_modules` між incompatible SHA. | Для кожного пакету зберегти `package-lock.json`, Node pin і platform; перевірити clean install без зміни lockfile. Не видаляти залежності активного процесу.
| Кореневий диск | `df -h .`: 4,7 GiB available, 99% capacity у момент аудиту. | `P1 SPACE`; спершу підготувати size report за directory і retention policy, потім окремо чистити доведені generated outputs. | Не пропонувати масовий `rm -rf`; пріоритет — orphaned rebuild outputs після exact SHA/evidence inventory.

### 4.3 Вихідний код і дублювання власності

| Область | Виявлений overlap | Рішення |
|---|---|---|
| Umbrella `server/` ↔ `MarshGO-Server/server/` | 61 однаковий за SHA-256 файл; 24 однойменні файли мають різний вміст. Зокрема різними є entry/config/geocoding/storage/provider/navigation/journey код. | Побудувати file-level diff index з імпортами, API routes, migrations, тестами й останнім commit. Owner за цільовою архітектурою — Server для backend. Спершу перенести/зіставити унікальну поведінку і підтвердити endpoint parity, лише потім видаляти копію з umbrella окремим reviewable commit.
| Umbrella `src/` ↔ `MarshGO-Site/src/` | 48 однакових і 48 різних однойменних файлів. Entry point/CSS/platform/navigation та ряд компонентів розходяться. | Owner користувацького UI — Site; iOS має лише Capacitor shell. Порівнювати по feature modules, не видаляти цілий `src/` або підміняти поточний Site на стару копію.
| Umbrella `shared/` ↔ `MarshGO-Server/shared/` | 4 однакові файли контрактів/геометрії. | Визначити єдиний контрактний owner або package-export з версіонуванням. До цього синхронізувати hash у CI, щоб копії не дрейфували.
| API і UI у umbrella | Umbrella має активні production-oriented entrypoints поряд із standalone Server/Site. | Перевести umbrella на orchestration/docs/integration tests після підтвердження еквівалентності; не видаляти runtime до проходження canonical flows у цільових репо.
| SQL migrations | Server має 50 міграцій в історичній інвентаризації; у поточних змінах додана `054_rendezvous_participant_consent.sql`. | Зберегти append-only історію. Перевірити реальний migration ledger у disposable DB, checksum, порядок, forward/rollback policy та повторний запуск. Не squashing/delete applied migrations.
| Транспортні фіди/провайдери | Реєстри/адаптери можуть мати дубльовані contracts, але каталог feed-ів не доводить доступність. | Єдиний provider registry має жити на Server; Site лише рендерить перевірений контракт. Під час cleanup не прибирати адаптери лише через відсутність секретів у local env; позначати `BLOCKED_EXTERNAL`.

Ці цифри — точне байтове порівняння доступних поточних дерев, не повна семантична перевірка. 61 ідентичний файл може мати різні споживачі та релізні залежності; 24 різні — не автоматично «новіша/краща» версія.

### 4.4 Root scratch/evidence файли

Umbrella має `.tmp-live-route-check.mjs`, `scratch_screenshot_home.png`, `test_1_home.png`, `zrok_*.png`, `tools/screenshots/`, `tools/zrok-screenshot.png` і новий `scripts/start-local-api.sh`. Рішення: **не видаляти зараз**. Побудувати список з розміром, SHA-256, датою та посиланнями; визначити, що є єдиним доказом/відтворювачем дефекту, що є повтором, а що можна перенести з робочого дерева в контрольований audit evidence каталог. Усі test snapshots у `e2e/*-snapshots/` — тестові очікування, не одноразові screenshots; змінювати їх лише разом із поясненням візуального diff та прийняттям нового baseline.

## 5. Бази й інші сховища: окремий контур

Не змішувати source cleanup з data cleanup.

| Сховище | Що інвентаризувати | Наразі дозволене рішення |
|---|---|---|
| PostgreSQL/PostGIS | host/database/schema, owner, migration ledger, FK/trigger, extensions, table/index size, backup/restore, retention, environment proof | Read-only discovery. Невідомий target — `BLOCKED_UNKNOWN`. Не видаляти таблиці/рядки, не reset-ити migration history. |
| Redis | endpoint/role, logical DB, prefixes, TTL, writers/readers, persistence/eviction, memory | Read-only namespace/TTL інвентаризація. Заборонені глобальні flush-команди. |
| S3-compatible object store | account/bucket/region, privacy/versioning/lifecycle, object prefixes, DB references, retention | Read-only aggregate inventory; не видаляти об’єкти або версії без списку і restore plan. |
| Firebase Auth/OTP | project/tenant, issuer, callback, user ownership, session revocation policy | Не видаляти user identities; перевірити config provenance і production project через безпечні metadata. |
| Browser local/session storage | ключ, writer/reader call sites, logout/account switch behavior, PII/token handling | Інвентаризація по активних entrypoints; ніколи не використовувати глобальний `localStorage.clear()` як cleanup рішення. |
| In-memory cache/queue | namespace, TTL, process ownership, behavior on restart | Відділити volatile state від durable queue; не видаляти код до proof, що його writer/reader не reachable. |
| Test DB, Redis, S3 mock, fixtures | exact local endpoint/container/profile, seed/reset script, isolation | Очищати лише після доказу disposable target, dry-run, backup або підтвердження відтворюваності й окремого погодження мутації. |

Детальна схема полів та безпечний порядок наведені у звіті 12. У цій перевірці вміст live DB/bucket/auth не читався, не змінювався; підтвердженого production endpoint наразі немає.

## 6. Конкретний план оптимізації

### P0 — захистити роботу і зафіксувати правду

1. Зробити read-only індекс усіх checkout-ів: canonical path, gitdir, repo, branch/detached, full SHA, status porcelain, upstream, PR, чи містить унікальні/untracked дані. Зберегти окремо для `.release/` orphan pointers.
2. Для кожного dirty дерева зняти patch/diffstat і список untracked з SHA-256; не копіювати секрети/PII. Визначити їх власника та призначення.
3. Скласти size manifest: directory size, file count, generated/source/evidence/unknown, ignore rule, creator command, last referenced commit/doc.
4. Уточнити, що є canonical checkout, а що release snapshot. Поточний manifest Site SHA відрізняється від поточного Site checkout; спершу узгодити це, не підміняти жодну версію.

### P1 — звільнити місце контрольовано

1. Додати retention policy для `.release`: pinned candidate ніколи не чистити автоматично; зберігати snapshots, на які посилаються актуальні звіти; непотрібні materialization-и лише перемістити в тимчасовий quarantine/backup після inventory і підтвердження rebuildability.
2. Винести довгі Playwright traces з постійних локальних worktrees у контрольоване тимчасове сховище CI з retention/обмеженням доступу; залишати trace лише для failure або релізного доказу.
3. Не запускати паралельні незалежні `npm ci` для кожного SHA без потреби; використовувати npm cache, lockfile та pinned Node. Спільний `node_modules` між checkout-ами не шарити.
4. Очистити Xcode DerivedData/build і старі Site `dist` тільки після перевірки active processes, latest candidate SHA, iOS webDir та відтворюваності build.
5. Додати автоматичний report-only cleanup command, який за замовчуванням лише показує кандидати; destructive mode має вимагати точний allowlist SHA/path, dry-run та підтвердження.

### P1 — визначити єдину архітектурну власність

1. Server owns: API, DB schema/migrations, realtime, journey engine, provider adapters, prices, bookings.
2. Site owns: всі веб/PWA UI, map screens, route results, account flows.
3. iOS owns: Capacitor/Xcode bridge, native permissions, deep links, push/background integration; UI syncs from exact Site SHA.
4. Umbrella owns: product/audit docs, cross-repo orchestration, integration/E2E, release manifest — доки migration завершена. Не прибирати runtime з umbrella перед доказом функціональної parity.
5. Для дублікатів `server/`, `src/`, `shared/` створити файл-level matrix: identical/different/missing + exported symbols + callsites + tests + target owner + exact SHA + migration PR.

### P2 — прибирання/якість коду

1. Мертвий код визначати через TS/JS dependency graph та runtime registrations, окремо `rg` по dynamic import/string references, scripts/workflows, migration/seed discovery, Capacitor plugins і route registries.
2. На кожен кандидат завести рядок: module, evidence, owner, confidence, behavior replaced, tests to run, rollback. Спершу зробити невеликий PR із видаленням одного підтвердженого модуля.
3. Consolidate design tokens/transport colors only після звірки canonical references; не переіменовувати 12 mode identifiers в рамках cleanup.
4. Перевірити залежності: `package.json`↔lockfile, прямі imports, unused deps, duplicate versions, scripts, license/security status. Видаляти dependency лише після build/test coverage і перевірки plugins/transitive use.
5. Технічні оптимізації вимірювати: bundle size (main/chunks), image formats/weights, map layer count/viewport culling, route rendering, API query/indices, Redis hit/miss/eviction. Не робити «оптимізацію» без baseline.

### P3 — завершити дані та production housekeeping

Лише після визначення реальних target-ів: backup restore drill, retention policy, test fixture cleanup, Redis key retention, S3 lifecycle, DB index review. Production readiness/дані не чистити в межах цього етапу без окремого погодженого плану.

## 7. Gate перед кожною файловою чи data дією

Перед `delete`, `reset`, `clean`, `prune`, `truncate`, `flush`, `drop` або видаленням зовнішнього object/file потрібен запис:

1. **Що саме** — точний абсолютний path/ref/db/schema/key prefix/object prefix.
2. **Чому кандидат** — доказ, що не є source, evidence, active build, open PR, only copy, migration чи rollback point.
3. **Хто використовує** — runtime, CI, scripts, docs, worktrees, open PR, app processes.
4. **Середовище і owner** — dev/test/staging/prod/unknown; unknown блокує мутацію.
5. **Відновлення** — backup/diff/restore/build recipe та перевірений SHA.
6. **Dry-run** — точний перелік об’єктів і очікуваний обсяг, без мутації.
7. **Погодження** — необоротне видалення даних/гілок/release evidence потребує окремого конкретного погодження.
8. **Післядія** — checks, build/test, git status, size impact і журнал cleanup.

## 8. Що зараз конкретно можна і не можна робити

### Можна готувати автономно

- розширювати read-only inventory та evidence index;
- шукати references на `.release`/scratch paths;
- створити пофайлову матрицю code overlap;
- визначити owner/reachability candidates;
- виміряти bundle/asset/DB query baseline без даних користувачів;
- підготувати cleanup script у dry-run-only режимі та retention proposal.

### Не можна вважати схваленим видаленням

- видалення будь-якого `.release/server-*`/`site-*`, orphan checkout, branch чи worktree;
- видалення dirty/untracked файлів, screenshot baselines, traces, logs або staged deletions;
- видалення папки `ios/`/`MarshGO-iOS/`, усіх `node_modules` чи глобальний clean;
- видалення/очищення PostgreSQL, Redis, Firebase users, S3 objects або browser state;
- merge/reset/force push/archive/deployment.

## 9. Відкриті блокери аудиту

1. Зовнішні `.git/worktrees/...` target-и недоступні або відсутні для частини `.release` pointers. Потрібно звірити sibling folders/`.git` worktree metadata і зберегти orphan snapshot до будь-якого прибирання.
2. У `.release` є багато SHA snapshots; ще не доведено, які з них referenced у всіх історичних документах/CI/release evidence і який найменший безпечний retention set.
3. Один `.release/site-*` має staged deletions; потрібно знайти, хто й навіщо їх створив.
4. Немає доведеного production/staging storage inventory або restore drill. Жоден data deletion candidate поки не отримав статус `CLEAN_CANDIDATE`.
5. Поточна локальна Site робота dirty і відрізняється від Site SHA у `.release/materialized.json`; треба спершу закріпити candidate SHA.
6. Повна semantic reachability/code-dead audit ще не виконана; наведені duplicate counts — механічний byte comparison, не рішення про видалення.

## 10. Порядок великої чистки наступного робочого сеансу

1. **Freeze baseline:** зберегти exact SHA/status/patch lists всіх чотирьох репозиторіїв і кожного живого worktree.
2. **Знайти власника `.release`:** побудувати інвентар 80 піддиректорій та файлів верхнього рівня; відокремити valid gitdir, orphan worktree, build output, manifest, evidence і runtime files.
3. **Визначити keep-set:** поточний candidate SHA, найближчий known-good rollback SHA, докази, що ще referenced у звітах, active worktrees.
4. **Консолідувати код:** сформувати exact file-level migration matrix і feature parity table; призначити Server/Site/iOS/umbrella owner.
5. **Виміряти витрати:** disk/build/bundle/assets/test latency/API/DB index baseline; кожна оптимізація отримує метрику до/після.
6. **Підготувати окремі cleanup PR/changesets:** тільки confirmed generated artifacts або підтверджений мертвий код; один тип зміни за раз.
7. **Для data stores — окрема перевірка environment, backup та restore;** невідомі target-и не змінювати.
8. **Після кожного кроку** перевірити exact tests/CI, working tree, релізний manifest та відкат; лише тоді переходити до наступної категорії.

## 11. Підсумкова оцінка

- **Чітко можна прибрати зараз:** жодну значущу кодову/дану директорію не класифіковано достатньо доказово для видалення в цьому read-only етапі.
- **Найкращі кандидати на контрольоване звільнення місця:** старі duplicate `.release/*/node_modules`, outputs у старих release SHA, Xcode DerivedData/build, неактуальні `dist`; спершу exact manifest/reference/process/rebuildability checks.
- **Найбільша архітектурна чистка:** єдина власність backend в Server і UI в Site, зі збереженням migration history та перевіреною parity, після чого umbrella може стати orchestration/audit owner.
- **Найбільший ризик випадкової втрати:** `.release` orphan snapshots та dirty user changes; databases/object stores невідомого середовища.
- **Зараз видалено:** нічого.
- **Що треба перед першою фактичною чисткою:** inventory `.release` contents, orphan pointer recovery, SHA/ref map, evidence keep-set, active process check, безпечний backup/restore plan і окреме погодження саме на необоротне видалення.

Цей документ — доказовий план чистки й список кандидатів, а не дозвіл на видалення чи твердження, що весь dead-code audit уже завершено.
