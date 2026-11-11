# GTFS query-aware graph budget: експеримент відхилено

## Базові умови

- Точний базовий Server PR #24: `27ca486d66fa9b30b8559e4b1041ccca67f1d283`.
- Runtime Node `24.21.0`; однаковий завантажений офіційний Lviv static GTFS (`3,755,976` bytes) для обох гілок.
- Шість фіксованих коридорів із report 47, 22.10.2026 08:00–08:30 за Києвом, по 20 результатів на запит.
- Варіант: під час розподілу 100,000-сегментного ліміту збільшити вагу маршруту, якщо він має рейси, що можуть посадити біля origin або висадити біля destination. Додана вага — 4× endpoint-pair opportunities. Ліміти, перевірки пересадок, sampling і response API не змінювалися.

## Результат

| Метрика | Базова версія | Query-aware вага |
|---|---:|---:|
| Унікальні ланцюги сумарно на 6 запитах | 56 | 56 |
| Ланцюги по коридорах | 11 / 8 / 7 / 9 / 10 / 11 | 10 / 8 / 7 / 10 / 10 / 11 |
| Пошуки з truncation | 6/6 | 6/6 |
| Кандидатів повернуто | 120 | 120 |
| Час одного проходу, усі 6 коридорів | 10,424 ms | 10,329 ms |

Зміна розподілила альтернативи інакше, але не збільшила сумарну різноманітність чи кількість результатів; один fastest candidate у першому коридорі змінився. Часова різниця ~0.9% не є значущим покращенням. RSS вимірювався в одноразових процесах із послідовним накопиченням шести запитів і не використовується для приймання.

Під час експерименту focused GTFS + budget suite пройшла 67/67, включно з exhaustive small-feed oracle та regression на weighted allocation. Цей тест доводить правила allocator-а на малому штучному прикладі, але не покращення реального покриття.

## Рішення

Експеримент відхилено; зміни до `boundedGraphBudget.ts`, `gtfsTimetable.ts` і тесту відкачені. Перевірений PR-кандидат лишився чистим на SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283`; baseline focused suite після відкату: 66/66 PASS. Чинний контракт зберігає явний `searchTruncated=true`.

Наступний експеримент має змінити не тільки ваги графа: потрібна query-directed label/dominance схема, яка зберігає три ranking objectives і feasible alternatives та доводить winner-equivalence на exhaustive fixture до повтору цього ж шести-коридорного набору. До такого результату не піднімати ліміти й не прибирати partial-search індикацію.

## Перевірка per-chain-length objective windows — 2026-10-22

- На тому самому чистому базовому SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283` окремо тимчасово протестовано варіант, який прибирає спільне 100,000-крокове вікно заміни кандидатів і дозволяє кожній довжині ланцюга власне вікно, залишаючи абсолютний hard cap `MAX_SEARCH_STEPS=1,000,000`.
- Фокусовані тести до польового вимірювання: **66/66 PASS**. На шести тих самих коридорах результат становив **58 унікальних ланцюгів** проти 56 у baseline, але **3-leg маршрутів у фінальному top-20 — 0/6**. Усі шість запитів досягли мільйонного hard cap, лишилися `searchTruncated=true`, а час одного пошуку був приблизно 6.2–8.0 секунди. Максимальний зафіксований RSS процесу — близько 1.28 GB.
- Рішення: зміну відхилено й відкачено. Додані два ланцюги не усувають головної помилки, тоді як витрати CPU/RAM різко зросли та пошук щоразу доходить до жорсткої межі. Повторне читання `git diff` підтвердило, що Server PR #24 worktree чистий на базовому SHA; release candidate не змінився.
- Наступний крок: дослідити dominance/label search із обмеженим числом станів на зупинку, час і transfer count; перед live-feed вимірюванням довести еквівалентність трьох переможців на exhaustive small-feed oracle. Не збільшувати ліміти та не маскувати truncation.

### Другий, обмежений per-chain варіант

- Уточнено stop condition: після заповнення спільного результатного пулу ланцюг кожної довжини має отримувати лише власне вікно objective sampling, а не працювати до абсолютного hard cap.
- Фокусовані тести знову пройшли **66/66**. Шість коридорів дали рівно ті ж **56 унікальних ланцюгів** і ті ж 1/2-leg top-20 розподіли, що й baseline; **3-leg у top-20 — 0/6**. Сумарний час — 10,591 ms проти baseline 10,424 ms (~1.6% повільніше, шумовий/негативний результат). Усі пошуки зберегли `searchTruncated=true` через обмеження графа/вибірки.
- Рішення: і цю зміну відхилено та відкачено. Вона відтворює baseline без покращення покриття. Server PR #24 worktree повернуто до чистого SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283`.

### Пер-прохідне вікно з окремим стартом для 3-leg

- Третя спроба запускала для кожної довжини ланцюга власне 100,000-крокове вікно з моменту її проходу, щойно загальний пул заповнювався. Фокусовані тести: **66/66 PASS**.
- Коридори повернули 56 → 60 унікальних ланцюгів у top-20 загалом, але **3-leg у top-20 знову 0/6**; змінилися лише 1/2-leg альтернативи. Сумарний час зріс до 13,474 ms проти baseline 10,424 ms (~29%). Пошуки все ще явно позначені truncated через граф/семплювання.
- Рішення: зміну відхилено та відкачено. Цей bounded window додатково підтверджує, що проста перероздача кроків не додає триланкових маршрутів до top-20, зате коштує ~29% часу. Потрібна інша модель пошуку з dominance/labels або чіткий доказ, що саме ці запити не мають feasible третьої ланки у фіді.

### Тимчасовий підрахунок feasible третьої ланки та якості кандидатів

- Діагностична інструментація без зміни відбору пройшла `tests/gtfs-timetable.test.ts`: **61/61 PASS**. У першому коридорі базовий третій прохід перевірив 297 продовжень, 276 пройшли часові/transfer/reachability правила, 209 дісталися точки призначення, а 169 лишилися валідними кандидатами після duration та duplicate checks. Отже, пошук справді знаходить триланкові маршрути в цьому коридорі.
- Для цього ж коридору найкращий побачений 3-leg кандидат мав 4,976 секунд загальної тривалості та 2,300 minor units fare; найкращий 2-leg — 3,780 секунд і ті самі 2,300 minor units. Найменша пішохідна відстань серед 3-leg була 366 м проти 292 м для 2-leg. Це окремі мінімальні значення за кожною метрикою, не один і той самий маршрут; вони вказують, що 3-leg кандидати не покращили час/ціну/ходьбу для поточного top-20.
- В інших п’яти запитах базовий shared reservoir завершував пошук до того, як третій прохід почав перевіряти варіанти. Тому це ще не доводить відсутність кращої 3-leg опції в тих запитах; потребує bounded top-k/objective пошуку або іншого перевірного oracle. Тимчасову інструментацію відкачено; PR-кандидат залишився незмінним.

### Виправлення інтерпретації та фінальний bounded per-pass кандидат — 2026-10-22

Попередні записи про per-pass вікна помилково прирівнювали лічильник основного `results`-пулу до остаточно повернутого top-20. Після ранжування в top-20 також входять окремо збережені objective-reservoir кандидати. Тому твердження «0/6 трисегментних у top-20» для тих вимірів не було підтверджене фактичним складом відповіді. Це виправлення не змінює історичні логи; воно уточнює їхню інтерпретацію.

На чистій базі PR #24 `27ca486d66fa9b30b8559e4b1041ccca67f1d283` було повторно протестовано незалежні вікна довжини ланцюга. Змінено лише тимчасову межу пошуку та зняття спільного глобального вікна; точніші експериментальні числа:

| Вікно на довжину | Загальний час 6 коридорів | Унікальні ланцюги | Трисегментні у top-20 | Найшвидший/найдешевший/збалансований переможці проти baseline |
|---:|---:|---:|---:|---|
| baseline | 10,223 ms | 56 | 0 | baseline |
| 10,000 кроків | 7,487 ms | 58 | 2 (перший коридор) | без змін у 6/6 |
| 25,000 кроків | 7,955–8,476 ms у трьох проходах | 59 | 10 (перший: 7; другий: 3) | без змін у 6/6 |

Окремий остаточний повтор після фіксації значення 25,000 дав 7,970 ms і ті самі 59 ланцюгів / 10 трисегментних варіантів. Усі запити все ще повертають `searchTruncated=true` і `resultLimitReached=true`: це bounded покращення різноманітності, не доказ повноти маршрутизатора. Висновки стосуються саме завантаженого офіційного static Lviv GTFS та шести контрольних коридорів, не staging чи live vehicle data.

Код кандидата в окремому Server worktree `codex/gtfs-route-oracle-20261021` обмежує objective reservoir кожного числа ланок окремим вікном до 25,000 кроків, бере старт цього вікна від моменту заповнення відповідного пулу/глобального пулу й залишає абсолютну межу `MAX_SEARCH_STEPS=1,000,000`. Експериментальні environment override та додаткові candidate diagnostics вилучені з production code. На фінальному коді: GTFS suite 61/61 PASS; Server suite 293 PASS / 0 FAIL / 3 opt-in integration SKIP; typecheck і lint PASS. Робочий diff ще не зафіксований/не опублікований, отже hosted CI та release SHA для цього кроку відсутні.

Рішення: зберегти 25,000 як review candidate для перевірки на точному контрольованому dataset/CI, оскільки на цьому наборі він одночасно швидший за baseline й повертає більше здійсненних довгих альтернатив без зміни трьох ranking winners. Не позначати маршрутний пошук повним: продовжити аналіз обрізання graph/stop/candidate pools і перевірити memory/concurrency перед прийманням. `NOT_RELEASED` без змін.

### Exact-head publication and PostGIS/Redis integration — 2026-10-22

- Після успішних локальних перевірок зміни закомічено і запушено в існуючу гілку PR #24: Server SHA `6bf44d9781b6493f35a67bd01f6e8e0a3c7fc863` (`fix(journey): retain bounded multi-leg objective options`). Гілка оновлена звичайним fast-forward push; force-push не використовувався. PR лишається відкритим draft.
- На щойно створеній ізольованій базі PostGIS 17-3.5 та Redis 7.4 без Docker volumes прогнано `npm run test:integration`: **30/30 PASS / 0 FAIL / 0 SKIP**, включно з чистими міграціями, live-journey API contract, booking/concurrency/idempotency, trip editing/cancellation, Partner tenant isolation, navigation, Redis realtime між двома API процесами, API restart durability та shared rate limit. Тимчасові контейнери зупинено й автоматично видалено; постійні `marshgo-db-1` і `marshgo-redis-1` не запускали, їхні volumes не змінювали.
- Повторні локальні перевірки на Node 24.21.0: Server unit **294 PASS / 0 FAIL / 3 opt-in SKIP**, typecheck PASS, lint PASS, `git diff --check` PASS. GTFS suite включає нову перевірку щільного пулу; сама вона триває близько 30.5 s і доводить збереження трисегментного CHEAPEST кандидата при явній truncation.
- Точна GitHub `verify` перевірка для SHA `6bf44d9…` поки **PENDING** (run `39683473969`). Залишити її незавершеною в документах до фінального hosted результату. Жодного staging deploy або production rollout не виконано; release status лишається `NOT_RELEASED`.
- Exact-head GitHub run `39683473969` для SHA `6bf44d9…` завершився **SUCCESS** за 1m38s: dependency audit, lint, typecheck, повний test suite, migrations та PostGIS/Redis integration — PASS. PR #24 усе ще draft і базується на попередній routing PR; candidate не злитий у `main` і не є release.

### Global slack fill prototype — 2026-10-22

- Replayed the production GTFS parser directly against the current official archive URL. Archive size/hash matched the frozen snapshot: 3,755,976 bytes, SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`. Runtime was pinned using Node 24.21.0. Query: Maloholoskivska→Sykhiv, 2026-10-22 08:00–08:30 Europe/Kyiv; parser-level fares were unknown.
- Restored candidate SHA `9b0228dd23fdd69d59287c16d413d2a541ec601d` retained 98,418 of 100,000 allocated graph slots (1,582 remained unused), returned 100 results across 33 unique route-name chains in 2,686 ms, and marked graph/search/result truncation.
- Prototype filled global slack from endpoint overflow reservoirs while respecting total and per-route hard caps. It retained 100,000 graph segments and took 2,674 ms, but returned only 27 unique chains and changed FASTEST, CHEAPEST and BALANCED selections. Truncation remained true. More graph segments did not mean better option coverage.
- Focused GTFS suite with the prototype: 62/62 PASS. Prototype was reverted. On restored exact candidate, Server `npm test`: 294 PASS / 0 FAIL / 3 opt-in integration SKIP; typecheck/lint/diff-check PASS; worktree clean. No production code change was retained or published.
- Decision: reject global slack fill. Next candidate must make graph retention transfer-aware and be checked for all three winners and chain diversity against an exhaustive small-feed oracle before frozen-feed comparison. Do not raise limits or hide partial-search flags.

### Temporal connection-quality ranking prototype — 2026-10-22

- Compared exact Server HEAD `9b0228dd23fdd69d59287c16d413d2a541ec601d` with a temporary ranked-retention prototype. It classified transfer-only trip groups by the presence of a valid scheduled predecessor, successor, both, or neither, using the existing exact-stop transfer-rule checks. Graph/search limits and route feasibility were unchanged.
- Replayed six exploratory OD pairs at stop coordinates from the same official static Lviv archive under Node `24.21.0`: Maloholoskivska→Dovzhenko; Railway Station→Sykhiv; Rynok→Dubliany; Rynok→Bus Station; Naukova→Sykhiv; Rynok→Pidzamche. This pair set is controlled between variants but is not asserted to be byte-for-byte identical to earlier saved endpoint coordinates. Feed SHA-256 remained `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Baseline/variant unique route-name chain counts: 57/57, 32/32, 27/27, 38/39, 37/37, 63/63. FASTEST/CHEAPEST/BALANCED winner IDs were unchanged in all 6/6 queries. Every query still reported graph/search/result truncation. Total runtime increased from 13,931 ms to 16,083 ms (~15.5%). Fare remained unknown in the direct parser-level runs; these results do not claim city-tariff/planner fares.
- Rejected and reverted. Final Server worktree clean at exact HEAD `9b0228dd23fdd69d59287c16d413d2a541ec601d`; no product code was committed.
- Conclusion: binary route-group ranking is not the central bottleneck. Next candidate is explicit bounded Pareto/label search with exhaustive tiny-feed equivalence and resource limits. Keep the current honest partial-search flags.
