# MARSHGO — інвентаризація сховищ даних і план безпечної чистки

**Дата:** 18.10.2026 (Europe/Kyiv)  
**Статус:** план аудиту; жодне production/staging/user data не видалялось.  
**Мета:** перед великою чисткою встановити всі сховища, власника даних, середовище, retention і залежності; не плутати очищення коду з видаленням даних.

## Короткий висновок

У MARSHGO є кілька класів сховищ, не одна база:

1. **PostgreSQL із PostGIS** — головна транзакційна БД: користувачі, ролі, автомобілі, поїздки, заявки, пропозиції, бронювання, чати, навігація, rendezvous, реєстр провайдерів і міграції.
2. **Redis** — тимчасовий та оперативний стан: realtime/WebSocket coordination, rate limits, короткоживучі ключі/кеші, ізоляція між API-процесами. Конкретні namespace, TTL, persistence і правила eviction треба інвентаризувати по коду й конфігурації кожного checkout.
3. **Firebase Authentication** — зовнішня ідентифікація/перевірка ID token; це зовнішній обліковий каталог, а не частина локальної PostgreSQL.
4. **S3-сумісне object storage** — фото автомобілів і документи верифікації; metadata може бути в PostgreSQL, але самі об’єкти живуть окремо.
5. **Браузерні Web Storage API** — `localStorage`/`sessionStorage` для теми, виборів користувача, тимчасових idempotency keys та окремих legacy/offline сервісів. Треба встановити, які ключі активний production entry справді читає.
6. **In-memory state/cache** — процесні `Map`, кеші й черги в Server/Site. Вони зникають при рестарті й не є довговічною БД, але можуть впливати на тестову поведінку.
7. **Тестові дані/середовища** — loopback PostgreSQL/PostGIS, Redis, mocks на кшталт S3Mock, fixtures і seed scripts. Їх можна чистити тільки після підтвердження конкретного endpoint/database/schema та перевірки, що це disposable середовище.

Це первинна класифікація за конфігурацією та кодом. Вона **не доводить**, які саме зовнішні production інстанси зараз існують або чи містять дані.

## Обов’язкова інвентаризація перед будь-яким очищенням

Для кожного екземпляра/бакета/зони записати:

| Поле | Що зафіксувати |
|---|---|
| Ідентифікатор | Тип, provider, host/region, назва database/schema/bucket; секрети не читати й не друкувати |
| Середовище | `local-dev`, `test`, `staging`, `production`, `unknown`; статус `unknown` забороняє мутації |
| Власник | Репозиторій, сервіс, таблиці/ключі/object prefixes або browser storage keys |
| Підключення | Які конфіги та сервіси його використовують, з якого exact SHA/branch |
| Обсяг | Тільки агреговані counts/size/last-updated; не виводити PII, токени чи вміст документів |
| Життєвий цикл | TTL, retention, deletion triggers, audit trail, backup/restore і replay після restore |
| Залежності | Міграції, API/worker jobs, foreign keys, foreign consumers, тестові fixtures |
| Рішення | `KEEP`, `ARCHIVE`, `CLEAN_CANDIDATE`, `BLOCKED_UNKNOWN`, `OWNER_APPROVAL_REQUIRED` з доказом |

Для PostgreSQL перевірити migration ledger, schema ownership, extensions (PostGIS), таблиці/індекси, FK, тригери, retention workers і backup/restore. Вміст персональних таблиць не виводити у звіти.

Для Redis перевірити role/persistence, logical DB, memory/eviction, prefixes, TTL distribution і всі writers/readers. Не запускати `FLUSHALL`/`FLUSHDB`; знеособлені key names/counts не є дозволом на видалення.

Для Firebase Auth зафіксувати проект/tenant за безпечною назвою конфігурації та залежність входу; не видаляти й не деактивувати користувачів.

Для S3 перевірити bucket privacy, versioning, lifecycle, object prefixes, metadata/counts, retention, encryption і зв’язок object key із DB rows. Не видаляти файли чи bucket objects під час інвентаризації.

Для браузерних storage та in-memory state скласти список ключів/namespace, call sites, entry-point reachability і ефект sign-out/account switch. Не робити `localStorage.clear()` глобально: це може стерти активну сесію або локальні дані.

## Порядок великої чистки

### Фаза A — read-only discovery

1. Підтвердити локальні checkout-и, exact SHA, dirty status і зв’язок із відкритими PR.
2. Зібрати список конфігів, Docker/Compose profiles, тестових launch scripts, providers і міграцій для кожного типу сховища.
3. Перевірити середовище кожного підключення без виведення секретних значень; за неможливості точно відрізнити local/test від staging/prod виставити `BLOCKED_UNKNOWN`.
4. Побудувати схему owner → reader/writer → storage → retention → backup; окремо показати дублі між umbrella, Server і Site.
5. Зібрати тільки агреговані метрики та зафіксувати evidence, SHA, час і команди.

### Фаза B — код і конфігурація без видалення даних

1. Спершу виділяти мертвий код за import/runtime reachability, не за назвою файла чи старістю.
2. Позначити повторні migration copies та seed scripts; визначити єдиного власника, зберігши всю історію схеми.
3. Прибрати дубльовані/непідключені конфіги або скрипти лише після підтвердження, що жодний CI, worktree, deploy чи документація їх не використовує.
4. Тимчасові файли, скриншоти, дампи й fixtures класифікувати окремо. Дампи можуть містити персональні дані; не переносити їх у Git.

### Фаза C — data cleanup, тільки для доведеного disposable target

Перед конкретною операцією потрібні: exact target identity, environment proof, що це disposable; перелік таблиць/ключів/object prefix; dry-run із очікуваною кількістю; резервна копія або доказ, що даних не шкода; rollback/restore plan; явне підтвердження власника на цю операцію.

Після підтвердження:

- PostgreSQL: очистити лише узгоджену тестову БД через її документований lifecycle; не виконувати `DROP DATABASE`, truncate каскадом чи reset міграцій на невідомому target.
- Redis: видаляти лише тестовий namespace/ключі з точним префіксом і перевіреним target; жодних глобальних flush-команд.
- S3: видаляти лише підтверджені тестові prefix/object versions; перевірити DB references і retention спершу.
- Firebase: користувачі/ідентичності не є кандидатами на масове очищення без окремого погодженого списку й процесу відновлення.
- Browser: очищення тестового профілю браузера відокремлювати від коду користувача та справжніх облікових сесій.

Production, невідоме staging або дані з PII автоматично отримують `OWNER_APPROVAL_REQUIRED`; вони не входять до автоматичної «великої чистки».

## Критерії завершення

- Усі типи сховищ і середовища мають власника та список читачів/писачів.
- Для всіх PostgreSQL схем відома остання застосована міграція; старі міграції не видалені й залишаються відтворюваними.
- Redis namespaces/TTL/persistence задокументовані; тестова ізоляція доведена.
- Firebase і S3 описані як зовнішні системи із власними retention/privacy правилами.
- Browser/in-memory storage ключі пов’язані з активними entrypoints.
- Кожен cleanup candidate має exact target, dry-run результат і rollback/restore план.
- Після дозволеної тестової чистки пройшли migration checks, server tests та integration smoke на disposable середовищі.
- Жодне production data не було змінене в межах аудиту.

## Заборонені широкі команди у фазі аудиту

`DROP DATABASE`, `DROP SCHEMA`, `TRUNCATE ... CASCADE`, `FLUSHALL`, `FLUSHDB`, масове видалення Firebase users, видалення S3 buckets/prefixes, глобальний `localStorage.clear()`, а також будь-який cleanup script із невідомим `DATABASE_URL`/`REDIS_URL`.

## Підтверджений стан зараз

- У документації deployment прямо вказано, що production/staging target не налаштований і не було production deployment.
- Локально раніше перевірена development пара: PostgreSQL/PostGIS + Redis та API; вона не доводить, що будь-який інший endpoint є безпечним для очищення.
- У репозиторіях знайдено 50 міграцій у standalone Server checkout станом на цю інвентаризацію; перед повним аудитом їх треба звірити з umbrella історією та migration ledger тестових БД.
- S3 adapter існує, але без конфігурації бакета/retention це не підтверджена production система.
- Firebase verify endpoint є, але сам факт коду не підтверджує чинний production Firebase project.

**Статус до завершення discovery:** нічого з database/object/auth/browser data не класифіковано як безпечне для видалення.
