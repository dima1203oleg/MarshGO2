# MARSHGO: локальні checkout-и, GitHub і production

**Дата перевірки:** 18.10.2026 (Europe/Kyiv)  
**Призначення:** перша фактична модель репозиторіїв і середовищ перед очищенням.  
**Важливо:** це знімок стану, а не дозвіл видаляти гілки, checkout-и або дані.

## Висновок про production

На момент перевірки **підтвердженого постійного production deployment не знайдено**.

| Рівень | Спостереження | Висновок |
|---|---|---|
| GitHub Deployments | API deployments для MarshGO, Server, Site та iOS повертає порожній список | У GitHub немає зафіксованого deployment цих репозиторіїв |
| GitHub Environments | Для всіх чотирьох репозиторіїв список порожній | `staging`/`production` environments не налаштовані в GitHub |
| GitHub Actions secrets | Для всіх чотирьох репозиторіїв `total_count: 0` | У GitHub Actions немає repository-level секретів для deployment; це не перевіряє зовнішні хостинги |
| GitHub Pages | Endpoint налаштувань Pages повертає 404 у всіх репозиторіях | GitHub Pages не є місцем розміщення застосунку |
| Локальний Site | Vite відповідає на `127.0.0.1:4301/healthz` кодом 200 | Запущений локальний dev server, не production |
| Локальний API | Server відповідає на `127.0.0.1:3002/healthz` кодом 200; `/readyz` повідомляє `ready`, БД і realtime підключені | Локальний API готовий для розробки/перевірки, але не є production |
| Попередній staging URL | `https://0c7342d01f4706.lhr.life/healthz` і `/readyz` зараз повертають 502 | Тимчасовий тунель, записаний у старому manifest, не є доступним staging |
| Release manifest | `docs/RELEASE_MANIFEST.json` має `status: NOT_RELEASED`, `production_ready: false`, дату staging-перевірки 01.10.2026 та старі SHA | Manifest не описує актуальний deployment і не можна використовувати як поточний release pin |

Тому поточна відповідь на «де стоїть production?» така: **підтвердженої адреси production і живого production deployment наразі немає**. Перевірка GitHub не виключає вручну налаштований зовнішній хостинг, але в репозиторіях не знайдено актуального доказу такого хостингу. До появи URL, власника інфраструктури, exact SHA, конфігурації та успішних smoke-перевірок production-статус — `NOT_CONFIRMED`.

## Основні checkout-и

У workspace є цільові checkout-и трьох основних репозиторіїв і umbrella/legacy репозиторій. Додаткові директорії `*-cache`, `*-nav6`, `*-partner`, `*-rendezvous`, `*-governance`, `*-rcfix` та `.release/*` у відповідних `git worktree list` є пов’язаними Git worktree-копіями, а не підставою вважати їх зайвими чи видаляти.

| Репозиторій | Активний локальний checkout | Активна гілка / HEAD | Worktree count | Стан |
|---|---|---|---:|---|
| MarshGO | `/Users/dima1203/Desktop/MarshGO` | `codex/production-finalization-20261014` / `d75748311ae981ade2fe61113f00379fe810e68c` | 3 | Незбережені правки аудиту та E2E, untracked артефакти й дочірні worktree |
| MarshGO-Server | `MarshGO/MarshGO-Server` | `feature/transport-layer-availability` / `182c77ae4f78d576a287007d8e0864fb130f43f8` | 6 | Незбережені зміни API, GTFS/live та тестів |
| MarshGO-Site | `MarshGO/MarshGO-Site` | `codex/sync-journey-mobility-ui` / `6961afcf008e2c845c0fde68c687ce61fe744f2f` | 7 | Незбережені зміни карти, фокусу сегмента, презентації результатів і тестів |
| MarshGO-iOS | `MarshGO/MarshGO-iOS` | `codex/production-site-sync-20261014` / `4353cec3cacbaf662ceea047402f361024292b22` | 5 | Сам iOS git-root чистий, але вкладений `web/` checkout Site на `02e97d63c050ae87b0d9fa6c698c97a0b5fdfb5f` має 2 локальні зміни |

Лічильники Server та iOS зменшилися після перевірки й видалення **лише двох мертвих worktree metadata records**: їхніх директорій не існувало, а commit SHA залишалися досяжними з гілок. В umbrella `.git/info/exclude` локально додані точкові правила для семи linked worktree-каталогів: вони більше не маскуються під файли для додавання в MarshGO umbrella. Ці правила не змінюють `.gitignore` і не ховають файли всередині самих репозиторіїв.

### Поточні зміни, які треба зберегти під час очищення

- Umbrella: змінені `docs/audit/04_READINESS_REPORT.md`, `docs/audit/PRODUCTION_EXECUTION_CHECKPOINT.md`, `e2e/journey-route-map.spec.ts`, `package-lock.json`; є скриншоти, тимчасові скрипти та кілька linked worktree.
- Server: змінені package/test runner, API, GTFS/live vehicle та транспортні шари; додані нові source і test файли.
- Site: змінені дизайн-контракт, карта, маршрути, API-клієнт, результати, live map та тести; додані audit/spec і hit-testing файли.
- iOS: верхній git-root чистий, але його вкладений `web/` Site checkout має дві незбережені правки; їх треба зберегти й зіставити з окремим Site перед будь-якою синхронізацією.

До класифікації й прив’язки змін до PR **не виконувати** `git clean`, `reset --hard`, видалення worktree, branch deletion чи автоматичне злиття. Root бачить дочірні worktree як untracked-директорії; додавання їх рекурсивно до umbrella commit може випадково внести вкладені репозиторії та артефакти.

### Залежність iOS від Site та єдиного релізного SHA

Фактична звірка 18.10.2026 виявила три різні Site стани:

| Контекст | Site SHA | Стан |
|---|---|---|
| Активний окремий Site checkout | `6961afcf008e2c845c0fde68c687ce61fe744f2f` | Незакомічені зміни карти й результатів |
| Site checkout усередині iOS `web/` | `02e97d63c050ae87b0d9fa6c698c97a0b5fdfb5f` | Дві незакомічені зміни; remote — локальний шлях `../MarshGO-Site` |
| Site SHA у звичайному iOS CI | `be4a3f579971a981f580ff590a81166cdef0b712` | Жорстко заданий історичний SHA у `.github/workflows/ios-ci.yml` |

Додатково iOS README називає інший кандидат `dc937069e16ebb5bec5b66c674f664497c079207`. Release tag workflow використовує repository variables для Site/Server SHA й контрактів, але їхній наявний стан не дає доказу узгодженого release tuple. `scripts/checkout-site.mjs` за замовчуванням бере `main`, тоді як workflow бере жорстко закріплений SHA. Отже, **зміна Site зараз не означає, що її автоматично перевірено або включено в iOS**. Потрібен один погоджений tuple Server SHA + Site SHA + iOS SHA + API contract + DB migration version, після чого той самий exact Site SHA має бути зібраний у веб і в iOS та пройти парні перевірки. До цього UI може змінюватися в робочій гілці, але release status лишається незмінним.

За останнім fetch поточні гілки мають такі відносні відстані від локально оновленого `origin/main` (ліворуч — commits у HEAD, праворуч — тільки в `origin/main`): MarshGO `341/0`, Server `71/0`, Site `91/0`, iOS `46/0`. Це не означає, що їх слід зливати цілком: кожна гілка має власні зміни та PR-залежності, а це лише commit ancestry, не оцінка еквівалентності чи тестування.

## Стан GitHub

Читання GitHub API станом на цю перевірку показало відкриті PR:

| Репозиторій | Відкриті PR | Важливе спостереження |
|---|---:|---|
| MarshGO | 4 | Є draft PR та PR із base branch, що є іншою робочою гілкою |
| MarshGO-Server | 8 | PR утворюють ланцюги між `main`, mobility registry, cache, GTFS arrivals та transport-layer branches |
| MarshGO-Site | 8 | PR утворюють ланцюги між `main`, route map, cache та navigation branches |
| MarshGO-iOS | 6 | Кілька кандидатів послідовно pin-ять різні Site revisions |

**Разом: 26 відкритих PR.** Частина PR — draft, частина має іншу робочу гілку як base. Це не проста множина непотрібних гілок: видалення або merge без графа залежностей може загубити функції чи зламати review base.

`git fetch origin --no-tags` виконано для чотирьох репозиторіїв, щоб оновити лише локальні remote-tracking refs. Команди не змінювали віддалені гілки й не видаляли локальні refs.

### Відкриті PR та залежності

Найважливіші ланцюги з поточних `baseRefName` / `headRefName`:

```text
MarshGO:        main <- #1 production <- #2 redis-smart-cache <- #3 navigation-experience-6 <- #4 governance (draft)
MarshGO-Server: main <- #3 mobility-registry; #4 partner, #7 transport-layers depend on mobility-registry;
                mobility-registry <- #5 redis-cache <- #6 GTFS arrivals (draft)
MarshGO-Site:   main <- #3 sync-journey <- #4 redis-cache <- #5 navigation-experience;
                main <- #6 rendezvous-map <- #7 GTFS arrivals (draft)
MarshGO-iOS:    main <- #2 reliable-sync <- #3 redis-cache <- #4 navigation-experience;
                reliable-sync <- #5 pin-rendezvous; main <- #6 governance (draft)
```

Свіже читання `gh pr list` 18.10.2026 повернуло такі неготові стани: MarshGO #1 `BLOCKED`, #2 `DIRTY`; Server #1 `DIRTY`; Site #1 `DIRTY`, #2 `BEHIND`; iOS #1 і #3 `DIRTY`. Інші відкриті PR повернули `CLEAN`, але це не є рекомендацією автоматично зливати їх: їхні базові гілки утворюють стеки, а CI запускався на різних SHA й датах. Останні passing checks 18.10.2026 належать переважно документаційним ownership PR; вони не засвідчують сумісність усіх продуктних кандидатів між собою.

Повні head SHA з актуальної відповіді GitHub API (включно з PR base/head та станом merge):

| Репозиторій / PR | Base ← head | Head SHA | Draft | GitHub merge state |
|---|---|---|---:|---|
| MarshGO #1 | `main` ← `codex/marshgo-production` | `cd0b62d17585503b4a73036c0fae0b52cbcd41ed` | так | `BLOCKED` |
| MarshGO #2 | `codex/marshgo-production` ← `codex/redis-smart-cache` | `55a8f1384e55249b90c543d656ac94800f9165ef` | ні | `DIRTY` |
| MarshGO #3 | `codex/redis-smart-cache` ← `codex/navigation-experience-6` | `c02d35785c3e31ddfbec82a1c4789006bdf91cc8` | ні | `CLEAN` |
| MarshGO #4 | `codex/navigation-experience-6` ← `feature/unified-repository-governance` | `9610da5704714fb1f028e145b617eb51ec609b37` | так | `CLEAN` |
| Server #1 | `main` ← `codex/rendezvous-live-pickup` | `f788a96a5365a8a7d7f1eef416868f97217706c4` | ні | `DIRTY` |
| Server #2 | `main` ← `codex/security-parse-bearer` | `5e8cc4ce4d5e58babcc306c1cf5173f1f4600ea1` | ні | `CLEAN` |
| Server #3 | `main` ← `codex/sync-mobility-registry` | `7dda315fa5a60b3e78ba284da98a94e129cbff1b` | так | `CLEAN` |
| Server #4 | `codex/sync-mobility-registry` ← `codex/partner-platform-foundation` | `94e9f21a7a7758eaacbafbaa3034463084b04877` | ні | `CLEAN` |
| Server #5 | `codex/sync-mobility-registry` ← `codex/redis-smart-cache` | `64ed70c72fec06cb9418dc7feee67ae0acee3826` | ні | `CLEAN` |
| Server #6 | `codex/redis-smart-cache` ← `feature/gtfs-stop-arrivals` | `6307bfcd3f7c76616280fb886e3a2d4cbab199b2` | так | `CLEAN` |
| Server #7 | `codex/sync-mobility-registry` ← `feature/transport-layer-availability` | `182c77ae4f78d576a287007d8e0864fb130f43f8` | так | `CLEAN` |
| Server #8 | `main` ← `feature/codex-ownership-guidance` | `d52261e1346da4675bef76191280f66d236978d1` | так | `CLEAN` |
| Site #1 | `main` ← `codex/rendezvous-live-pickup` | `045f138bd9c31cb8bcc40231da867db7d7e8e531` | ні | `DIRTY` |
| Site #2 | `main` ← `codex/navigation-deep-link-alias` | `029aae486e164f02660c36130114527b19898001` | ні | `BEHIND` |
| Site #3 | `main` ← `codex/sync-journey-mobility-ui` | `6961afcf008e2c845c0fde68c687ce61fe744f2f` | ні | `CLEAN` |
| Site #4 | `codex/sync-journey-mobility-ui` ← `codex/redis-smart-cache` | `5a12c6fbf0b18ca479e92c93d6d9597d567734d3` | ні | `CLEAN` |
| Site #5 | `codex/redis-smart-cache` ← `codex/navigation-experience-6` | `1fafdca4f17983506d80d14a231ee35afc91b3f3` | ні | `CLEAN` |
| Site #6 | `main` ← `codex/journey-rendezvous-map` | `aff0ead39db51abfd939820530b3a874db26cfaf` | ні | `CLEAN` |
| Site #7 | `codex/journey-rendezvous-map` ← `feature/gtfs-stop-arrivals` | `02c01a609cad41f1551c1861a44122242534e37a` | так | `CLEAN` |
| Site #8 | `main` ← `feature/codex-ownership-guidance` | `78075463b5885af19d69592f63b3ac7643f0b84c` | так | `CLEAN` |
| iOS #1 | `main` ← `codex/simulator-smoke-capture` | `328d9af2b3f7095d3f9afca8fcbe4e9c5e1df0ad` | ні | `DIRTY` |
| iOS #2 | `main` ← `codex/reliable-capacitor-sync` | `4353cec3cacbaf662ceea047402f361024292b22` | ні | `CLEAN` |
| iOS #3 | `codex/reliable-capacitor-sync` ← `codex/redis-smart-cache` | `268fc48fbd8ed9dc278bb9f0b142e341bcfc5652` | ні | `DIRTY` |
| iOS #4 | `codex/redis-smart-cache` ← `codex/navigation-experience-6` | `7b9e631a99b025cb2f421dabc666360135c966fc` | ні | `CLEAN` |
| iOS #5 | `codex/reliable-capacitor-sync` ← `codex/pin-rendezvous-site` | `ecf9fd03de37595f8599be0bb951f35ca515f692` | ні | `CLEAN` |
| iOS #6 | `main` ← `feature/codex-ownership-guidance` | `3e3e03b05f91b78cc76cc24fc99edd684df14916` | так | `CLEAN` |

У локальному списку гілок є ті самі feature branches, але кілька remote refs ще не мають локального branch pointer: MarshGO `docs/marshgo-canonical-v5-1`, `docs/marshgo-unified-audit-2026-10-18`; Server `codex/rendezvous-live-pickup` (відкритий PR #1); Site `codex/marshgo-sites-design-preview`, `codex/rendezvous-live-pickup` (відкритий PR #1); iOS `codex/simulator-smoke-capture` (відкритий PR #1). Це не означає, що їх можна видалити: для Site design preview потрібно перевірити закриті PR, теги та унікальну документацію до класифікації.

Для цільової консолідації потрібен порядок залежностей, а не видалення всіх PR одним кроком. Кожна гілка з унікальним runtime-кодом, міграціями чи тестами має бути перенесена/злита або явно відхилена лише після порівняння patch і ancestry.

## Перша цільова модель очищення

1. **Власники коду:** Server — API, база даних, бізнес-логіка й транспортні адаптери; Site — єдиний web/PWA UI; iOS — Capacitor/WKWebView і нативні можливості; MarshGO — аудит, міграційна історія та наскрізна оркестрація лише доки вона потрібна.
2. **Одна активна робоча гілка на одну зміну.** Залежні PR спочатку перебазувати/злити в правильному порядку або замінити consolidated PR; інші refs зберегти до перевірки ancestry та вмісту.
3. **Один актуальний локальний worktree на основну гілку роботи.** Додаткові linked worktree можна прибирати лише після класифікації кожного шляху, перевірки dirty state, PR ownership та резервного збереження унікальних комітів.
4. **Код видаляти лише з доказом невикористання.** Спочатку побудувати імпорти, runtime entrypoints, routes, workflows, tests, migrations і feature dependencies; позначити `dead`, `duplicate`, `active`, `legacy-only`, `blocked`; видалення — після тестового доказу еквівалентної заміни.
5. **Production candidate — окремий immutable набір SHA.** Потрібні Server/Site/iOS SHA, API contract, migration ledger, CI links, deployment target і smoke results. Поточний manifest лишається історичним до перевірки нового узгодженого кандидата.

### Що фактично запускається в кожному кодовому дереві

| Дерево | Runtime entry point | Фактична роль зараз | Ризик дублювання |
|---|---|---|---|
| MarshGO umbrella | `index.html` → `src/main.tsx` → `src/views/ProductionMarketplace.tsx`; API entry — `server/index.ts` | Окремий server-backed web app і локальний API все ще присутні в umbrella checkout; це не порожній архів | Перекривається з окремими Site та Server репозиторіями; потрібне file/module-level порівняння перед перенесенням чи видаленням |
| MarshGO-Server | `server/index.ts`; 138 оголошень Express route handlers у цьому checkout; DB зміни — `server/migrations/` | Самостійний API, БД/міграції, транспортні та journey модулі | Перекриває umbrella `server/`; окремо звірити endpoint contracts, migration history і тести |
| MarshGO-Site | `index.html` → `src/main.tsx` → `src/views/ProductionMarketplace.tsx` | Самостійний server-backed PWA/Web UI; route map/results живуть тут у своїх версіях | Точка входу схожа на umbrella, але це окремі commit history й модульні дерева; однакові назви не доводять однакову реалізацію |
| MarshGO-iOS | Xcode/Capacitor (`capacitor.config.ts`, `webDir: web/dist`) | Нативна оболонка, яка збирає вкладену копію Site | Site SHA залежить від workflow/ref; вкладений `web/` може мати власні незакомічені зміни поза iOS git-root status |

Це підтверджує, що очищення — не видалення каталогу `src/` чи `server/` за назвою. Перший безпечний результат — карта походження файлів: активний entry point, імпорти, route ownership, API contract, migration owner, CI owner, target repo та evidence SHA. Поки вона не складена, код класифікується як `UNCLASSIFIED`, а не `dead`.

### Початковий вимір фізичного дублювання файлів

Порівняно SHA-256 вмісту **відстежуваних Git файлів робочих checkout-ів** за однаковими відносними шляхами (це не порівняння поведінки чи всіх гілок):

| Пара checkout-ів | Спільні шляхи | Байтово однакові | Відрізняються |
|---|---:|---:|---:|
| Umbrella ↔ Server | 140 | 83 | 57 |
| Umbrella ↔ Site | 145 | 75 | 70 |
| Server ↔ Site | 13 | 5 | 8 |

У umbrella/Server збігаються 85 шляхів `server/`, але ця кількість включає однойменні різні файли; значення має перевірка кожного diff та імпортного графа. У umbrella/Site є 96 спільних шляхів `src/`; у загальному перетині 70 файлів мають різний вміст. Site і Server майже не перетинаються поза спільними контрактами й тестовими/конфігураційними файлами. Це підтверджує суттєве розходження кодових копій, але не доводить, що конкретна версія правильна. Наступний крок — звести per-file таблицю з git blame/commit ownership, runtime import/use, tests, API contract і migration usage, а тоді визначити джерело для кожного модуля.

### Правило контрольованих змін вебінтерфейсу

1. Зміна починається в окремій Site feature branch з пов’язаним тестом і задокументованим UI/API впливом.
2. Якщо контракт API змінюється, Server contract/tests мають бути готові або backward compatible до злиття Site; UI не маскує відсутню API-властивість локальною фікстурою.
3. Після перевірок створюється immutable release tuple: Server SHA, Site SHA, iOS SHA, API contract version, migration version. Зміна одного з них формує новий tuple, не переписує попередній.
4. Веб-кандидат і iOS-кандидат збираються з **того самого Site SHA**. CI порівнює вкладений `web/` SHA з pin і завершується помилкою при розходженні.
5. Staging smoke/E2E і rollback перевіряються на цьому tuple; лише після цього можна називати його release candidate. Production deployment залишається окремою дією власника.

Зараз цей процес не є єдиним наскрізним: iOS workflow має власний дефолтний SHA, `site:checkout` локально за замовчуванням бере `main`, активний Site має незбережені зміни, а production target не налаштований. Тому зміни UI можуть існувати паралельно, але синхронізація релізу й production rollout не підтверджені.

## Наступні фактичні кроки

1. Зібрати повний branch/PR dependency graph із точними SHA, merge-base, ancestry, CI та worktree path для всіх refs.
2. Знайти external hosting evidence: workflow deploy steps, домени й DNS/hosting-конфігурацію, без читання чи друку значень секретів.
3. Скласти inventory змінених файлів та untracked артефактів; зіставити їх із PR і тестами.
4. Побудувати карту runtime-модулів і дублювань між umbrella, Server, Site та iOS; запропонувати конкретні групи для збереження, консолідації й кандидатів на видалення.
5. Після показу точного списку кандидатів на видалення отримати окреме підтвердження власника перед незворотним видаленням remote branches або даних.
