# GTFS exhaustive oracle та повторний replay Львова — 2026-10-23

## Контрольна версія

- Server branch: `codex/gtfs-lazy-event-search-20261023`.
- Exact SHA: `7e848e86f11382fa3ddd424481f53ad59e77f23d`.
- PR #30: <https://github.com/dima1203oleg/MarshGO-Server/pull/30>, відкритий draft до candidate branch PR #29; не merged і не deployed.
- У цьому checkpoint production-код та ліміти не змінювалися; попередній кодовий diff на цьому head лише синхронізував GTFS trip-event eligibility між demand estimation та graph materialization.

## Незалежна перевірка малих фідів

У `tests/gtfs-timetable.test.ts` додано незалежний exhaustive перебір пар подій для одно-пересадкових фікстур. Він перевіряє рівність повного набору здійсненних пар між перебором і production search на незрізаних малих графах. Покрито:

- transfer лише через оголошені pathways між платформами;
- station-level transfer type 2/3 і мінімальний transfer time;
- циклічний trip, де перша поява станції не дозволяє висадку;
- same-route GTFS type-4 in-seat continuation із нульовим числом пасажирських пересадок;
- GTFS-RT skipped stop і canceled trip;
- затримку, що знищує часову здійсненність пересадки.

Результати: GTFS timetable + bounded graph suite **72/72 PASS**; full unit **300 PASS / 0 FAIL / 3 opt-in SKIP** у hosted CI; typecheck, lint і diff-check **PASS**. GitHub exact-head runs `39870321680` та `39870325749` на тому самому SHA обидва завершились **SUCCESS**. Перевірка не пропускає, коли tiny fixture truncates.

Цей oracle доводить повноту лише для фідів, які повністю вміщаються в чинні межі. Він не може встановити, які саме feasible chains втрачено після sampling великого реального графа.

## Повторюваний frozen Lviv replay

- Джерело: статичний GTFS Львова, ZIP SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Запит: Малого Голоска (`24.008217, 49.864885`) → Сихів (`24.0175835, 49.8013165`), `2026-10-23` 08:00–08:30 Europe/Kyiv; горизонт 6 годин; максимум 2 пересадки; walking limits access/egress/transfer 900/1000/400 м; buffer 180 с; максимальне очікування 4 години; ліміт 100 результатів.
- Runtime: Node `24.21.0`; parser-level replay без DB, зовнішніх API, GPS чи провайдерів.
- Digest: `698e0e7538b5f0b9c0645ffdffd75be039ef921a2ebb79feb928237b29b6dd6f` — збігається з попереднім точним harness.
- Граф: 423 corridor stops, 814 interchange stops; оцінений попит 415,997 сегментів; утримано 99,054 з ліміту 100,000, 946 слотів лишилися незаповненими через per-route indivisible trip-group budgets; 101,827 search steps; 1,625 кандидатів перед поверненням 100.
- `candidateGraphTruncated=true`, `searchTruncated=true`; інші truncation signals також true. Результати не можна подавати як гарантовано найшвидші/найдешевші глобально.

Два додаткові міські OD на тому самому feed теж залишилися truncated: Наукова → Сихів повернула 100 результатів, 57 trip chains / 40 route chains, близько 5.40 с і 459 MB max RSS; площа Ринок → Дубляни — 100 результатів, 58 trip chains / 32 route chains, близько 6.66 с і 428 MB max RSS. Це по одному локальному діагностичному запуску на запит, не percentile/load benchmark; жодного нового candidate A/B поки немає.

## Причини та рішення

Є дві незалежні межі:

1. Per-route бюджет зберігає цілі trip groups і малий endpoint overflow. Через цілісність груп та обмеження конкретних маршрутів частина маршрутного бюджету залишається вільною, хоча глобальний граф переповнений.
2. Після матеріалізації, bounded candidate reservoirs і post-saturation search windows обмежують пошук. Тому зміна лише graph retention не обов'язково збільшить кількість корисних переможців.

Попередні overflow/transfer-only experiments зафіксовані як відхилені: вони не дали надійного приросту top results. У цьому checkpoint не внесено ще одну евристику без A/B доказу. Наступний безпечний напрям — спроєктувати lazy, query-directed event-index candidate source, який залишає `transferDecision` авторитетною перевіркою і порівнюється з exhaustive oracle на малих графах та з однаковими frozen-feed replay/multi-OD метриками. Збільшення caps саме по собі не є виправленням.

## Релізний наслідок

Server CI зелений, але GTFS результат повністю не приймається через truncation. Staging, live provider acceptance, HTTPS smoke, backup/restore/rollback rehearsal, фізичний iPhone GPS/APNs/background checks та production deployment не підтверджені. Release залишається `NOT_RELEASED`.

## Test-only query-directed index follow-up — 2026-10-23

- PR #30 latest SHA: `14b3abfa29baa90b84d4d0d9d61b51604dac7f1d`; only `tests/gtfs-timetable.test.ts` changed in this follow-up. The production router, graph limits and runtime behavior are unchanged.
- A test-only event index stores departure references by stop and lazily materializes route legs for stops reached by the query. For a bounded fixture containing 100 unrelated ten-stop trips, it indexed 1,004 boarding events and materialized 2 query-relevant legs vs 4,500 possible stop-pair legs while retaining the exhaustive oracle's itinerary identity.
- Local GTFS suite **68/68 PASS**; typecheck, targeted ESLint and diff check PASS. Exact Server CI runs [`39871533762`](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39871533762) and [`39871538356`](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39871538356) both **SUCCESS**; hosted unit 301 pass / 0 fail / 3 opt-in skips, migrations, PostGIS/Redis integration and API image build/smoke pass.
- iOS PR #11 head `ef8a290dfe6bb870389f104b229d69a3843801a9` pins that Server SHA and Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; exact-tuple iOS Simulator CI runs [`39871559946`](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/39871559946) and [`39871565248`](https://github.com/dima1203oleg/MarshGO-iOS/actions/runs/39871565248) both **SUCCESS**.
- This prototype is not wired into production search. A frozen-Lviv replay of the standalone helper would not measure itinerary recall or ranking, so it is not reported as an A/B. A production design must preserve exact `transferDecision`, mode/calendar/realtime rules, leg feasibility, and show a repeatable multi-OD recall/resource improvement before acceptance.
- Current review tuple is recorded as RC.23 in both release manifests, with `status=NOT_RELEASED`. Staging/production, live provider service levels, physical iPhone and operational rollback remain unverified.
