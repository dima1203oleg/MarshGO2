# GTFS спільний граф: контрольований event-label A/B — відхилено

Дата: 2026-10-23  
Статус: **відхилено як production-кандидат; production-пошук не змінено**

## Вхідні дані та межі

- Server base: `b65882584a3ad1e8dd7512d13176f52299cded51` (PR #31).
- Frozen Львівський static GTFS ZIP SHA-256: `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Node: `v25.4.0`.
- A/B побудовано на одному production candidate graph snapshot для кожного OD: baseline production traversal і альтернативний traversal бачили ті самі графові сегменти, перші посадки, successor-правила та результат production search/truncation.
- Перевірки test-only seams: GTFS suite 72/72, typecheck, ESLint, diff-check; відсутній observer і observer із snapshot дають однаковий baseline output.
- Альтернативний traversal залишився тільки у виділеному експериментальному worktree `codex/gtfs-event-label-oracle-20261023`; немає commit, push, merge чи production wiring.

## Результати frozen-feed A/B

| OD | Baseline результатів / ланцюжків | Перетин top-100 ID | Recall ланцюжків | Втримані переможці трьох стратегій | Альтернативний ліміт | Час кандидата | Heap після кандидата / процесний RSS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Мале Голоско → Сихів | 100 / 30 | 0/100 | 0/30 | 0/3 | 100,000 labels | 1.54 с | 730 / 494 MB; high-water RSS 709 MB |
| Наукова → Сихів | 100 / 37 | 0/100 | 3/37 (8.1%) | 0/3 | 100,000 labels | 1.40 с | 713 / 598 MB; high-water RSS 689 MB |
| Ринок → Дубляни | 100 / 26 | 0/100 | 1/26 (3.8%) | 0/3 | 100,000 labels | 1.69 с | 793 / 501 MB; high-water RSS 691 MB |

Baseline order-ID SHA-256 (JSON serialized IDs): `5bdd0cfe…` / `651a11ab…` / `3c4402ae…` відповідно. Кандидат не зберіг жодного з трьох strategy winners на жодному OD, тобто **0/9**. Обидва шляхи сигналізували truncation; це не повний пошук і не доказ глобально оптимальних маршрутів.

Первинний OD використовував точні координати й ліміти з audit 84. Два додаткові OD сформовані за координатами GTFS-зупинок (Наукова stop 551; Ринок stop 61 → Дубляни Школа stop 1313), тому їхні кількості не можна напряму порівнювати з історичними реплеями. Попередній digest із Server SHA `14b3abfa…` має інший набір параметрів/серіалізацію і не є контрольним для цього same-base A/B.

## Висновок і наступний технічний критерій

Observer дозволяє виконати коректне порівняння на тотожній production-кандидатурі й пройшов parity-перевірку. Проте сам event-label traversal не проходить ані якість, ані бюджет: 100k labels на кожному OD, нуль переможців і високий heap. Його не інтегрувати та не підвищувати ліміти. Зберегти чинний пошук і його чесний `searchTruncated` сигнал.

Наступний кандидат має спершу пройти exhaustive oracle на малих фідах (service calendars/exceptions, timezone, GTFS час понад 24:00, transfer rules/pathways/platforms, realtime та in-seat), а потім frozen multi-OD recall із втриманням усіх чинних strategy winners, обмеженими runtime/heap/RSS та явним truncation. Не продовжувати чергову DFS/cache варіацію, якщо вона не змінює модель стану/пошуку й не скорочує роботу без втрати коректності.

Production лишається `NOT_RELEASED`.
