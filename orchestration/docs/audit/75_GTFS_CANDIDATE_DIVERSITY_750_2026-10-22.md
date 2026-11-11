# GTFS: перевірка пулу кандидатів 750

Дата: 22.10.2026, Europe/Kyiv.

## Обсяг і точний код

- Серверний checkout: `/Users/dima1203/Desktop/MarshGO-Server-query-temporal-priority-20261022`.
- База: `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe` (Server PR #28 candidate).
- Перевірена зміна: `MAX_CANDIDATES_PER_LEG_COUNT` з 500 до 750 у `server/journey/gtfsTimetable.ts`.
- Порівняння виконано на Node 24.21.0 та одному зафіксованому GTFS Львова SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.

## Результат на трьох OD

| Маршрут | Ліміт 500 | Ліміт 750 | Переможці режимів | Truncated |
|---|---:|---:|---|---|
| Малий Голоско → Сихів | 34 route chains / 56 trip chains | 38 / 60 | FASTEST, CHEAPEST, BALANCED ті самі | Так, обидва |
| Малоголосківська → Довженка | 50 / 65 | 53 / 70 | ті самі | Так, обидва |
| Північний схід → південний схід Львова | 46 / 65 | 48 / 75 | ті самі | Так, обидва |

Для першого OD п'ять окремих процесів на кожному варіанті дали повторювані digest-и в межах версії. Медіанний час становив приблизно 2,048 ms при 500 і 2,148 ms при 750 (близько 5% повільніше); малий вибірковий набір не є latency benchmark. Два інші OD були одноразовими порівняннями. В усіх трьох випадках пошук лишився позначений як частковий, тому збільшення ліміту не оголошується виправленням повноти.

## Перевірки candidate 750

- Frozen-feed replay: три OD; кількість альтернатив зросла на кожному OD, три strategy winners не змінилися.
- GTFS unit/oracle suite: **68 passed, 0 failed**.
- Server full unit suite: **296 passed, 0 failed, 3 opt-in skipped**.
- Lint: PASS.
- TypeScript typecheck: PASS.
- Повний `npm run test:integration` на новій loopback PostGIS test DB `marshgo_e2e_candidate750_verify_20261022` і локальному Redis: **30 passed, 0 failed, 0 skipped** у восьми групах (schema 2, live journey 1, bookings/trip editing 21, partner 1, navigation 2, realtime 1, restart 1, Redis rate limit 1). Усі міграції чисто застосувалися. База тестова; наявні production чи user DB не використовувались.
- `git diff --check`: PASS до інтеграційного прогону.
- Stacked draft [Server PR #29](https://github.com/dima1203oleg/MarshGO-Server/pull/29), exact head `0dc831b3b8ca1c70f69e40329d6a81532f3a58df`, targets PR #28 head. Hosted [CI run 39850929617](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39850929617) completed **success**: dependency audit, lint, typecheck, unit suite, clean migrations, PostGIS/Redis integration, production API image build, and API-image smoke all passed. PR remains draft/open and unmerged.

## Рішення та межі

Поточний candidate збільшує вибіркову різноманітність на трьох перевірених OD, лишаючи strategy winners і межу ресурсів незмінними; ціна — орієнтовно 5% гірша медіана для одного повтореного OD. Зміна не усуває `searchTruncated`, не доводить повноту маршрутів для всього Львова й не підключає live arrivals/vehicle positions. Це обмежене алгоритмічне поліпшення для рев'ю, не production release.

Зміну закомічено як `0dc831b3b8ca1c70f69e40329d6a81532f3a58df` у гілці `codex/gtfs-candidate-diversity-750-20261022` та запушено. Після тимчасового `gh` rate-limit stacked draft PR #29 створений через GitHub integration і hosted CI run `39850929617` завершився success. PR #29 базується на Server PR #28 HEAD `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe` і лишається draft/open/unmerged. До повного завершення GTFS ще потрібні oracle/completeness перевірки на більшому наборі OD, production feed freshness/coverage, сумісність Site і staging acceptance. Поточний release status лишається `NOT_RELEASED`.
