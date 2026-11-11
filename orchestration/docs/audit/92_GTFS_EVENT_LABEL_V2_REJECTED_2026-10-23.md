# GTFS event-label v2: відхилено на frozen Lviv — 2026-10-23

## Межі експерименту

Test-only пошук у ізольованому Server worktree `/Users/dima1203/Desktop/MarshGO-Server-gtfs-event-label-oracle-20261023`, branch `codex/gtfs-event-label-oracle-20261023`, base/HEAD `b65882584a3ad1e8dd7512d13176f52299cded51`. Всі зміни лишилися незакоміченими й непушеними; production search і його ліміти не змінювалися.

Прототип зберігає `serviceDate`, trip та boarding/alighting call indexes і різні predecessor labels; розгортає boarding events ліниво; використовує спільний exact `createGtfsTransferDecisionContext`; переносить fare-v1 вартість лише у завершені ланцюги й не використовує fare-based pruning.

## Перевірки до replay

- Малий exhaustive oracle: прямі, одне- та дві пересадки, кілька predecessor-ів, loop call, календарні винятки, timezone, час після 24:00, pathway/transfer rules 2/3/4, realtime delay/skip/cancel, unknown fare, fare zones/coverage і type-4 allocation.
- Coordinate-shaped request parity на tiny feed: точні itinerary IDs, часи, тривалість, очікування, кількість/метадані пересадок, access+egress+transfer walking, fare allocations, sample і переможці FASTEST/CHEAPEST/BALANCED збіглися з production.
- GTFS suite **72/72 PASS**, TypeScript typecheck, ESLint і `git diff --check` PASS.

## Frozen Lviv A/B

- Вхід: frozen Lviv GTFS ZIP SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`; Node `v25.4.0` (не pinned `24.21.0`); ті самі 3 OD, часові вікна, walking radii, 2 пересадки й максимальні очікування, що й попередній baseline replay.
- Baseline для кожного OD повернув 100 результатів і чесно виставив `searchTruncated=true` та `candidateGraphTruncated=true`.
- V2 досяг власного обмеження 100,000 expanded labels на кожному OD. У кожному з трьох OD збіг ID з 100 baseline результатами — **0/100**; утримання трьох ranking winners — **0/3** для кожного запиту. V2 мав 66–4,581 повних path identities; матеріалізував 68,166–86,055 legs; працював 5.3–5.6 с проти 1.6–2.7 с baseline. Final heap 189–418 MB, RSS 483–547 MB. Різні лічильники traversal не є тотожними, але повна втрата baseline identities/winners однозначно відхиляє кандидат.

## Висновок і наступний крок

Причина: хоча stop sheds та exact transfer decision були звірені, v2 не відтворив production candidate graph — corridor/catchment, `interchangeStopIds` та mode/type filters. Тому він шукав інші ланцюги, а не оптимізував перебір тієї самої множини.

**Статус: FAIL / відхилено; не підключати до production.** Наступна і єдина обмежена спроба — винести поведінково незмінний shared candidate-graph context, щоб baseline і test-only пошук отримували однакові origin/destination/corridor/mode-кандидати, і спочатку довести їхню повну рівність на тестах. Лише після цього дозволений один frozen A/B replay. Якщо extraction змінює семантику або занадто широка — зупинити цей напрям без replay. Немає підстав збільшувати caps чи приховувати truncation.
