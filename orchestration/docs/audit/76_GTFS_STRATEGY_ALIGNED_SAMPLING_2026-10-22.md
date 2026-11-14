# GTFS-кандидати: узгодження попереднього відбору зі стратегіями — 2026-10-22

## Зміна

У робочій гілці `codex/gtfs-candidate-diversity-750-20261022` попередній відбір GTFS-кандидатів для трьох режимів тепер використовує той самий `scoreJourneys` і той самий контекст інших провайдерів, що й фінальне ранжування. До цього FASTEST/CHEAPEST частково використовували proxy-сортування лише за тривалістю/вартістю, а BALANCED — scorer із загальним контекстом; це могло розходити кандидатну квоту та фінальну логіку при нічиїх і спільних score ranges.

Окремо додано regression assertion: переможці FASTEST, CHEAPEST і BALANCED із повного змішаного пулу не губляться через обмежений GTFS sample, якщо переможець є GTFS-кандидатом.

## Валідація на точному коді

- Server commit: `e21536d5f97e7876aae0a360ed3ff4126ba5c78c`.
- PR #29: https://github.com/dima1203oleg/MarshGO-Server/pull/29 (OPEN, DRAFT; не злитий).
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: 296 PASS, 0 FAIL, 3 opt-in SKIP.
- `tests/gtfs-timetable.test.ts`: 63 PASS, 0 FAIL.
- `npm run test:integration`: 30 PASS, 0 FAIL, 0 SKIP на loopback test Postgres/PostGIS і Redis. Включено Journey schema, live-journey, booking/edit/cancel, Partner tenant isolation, navigation, Redis realtime між двома API-процесами, restart durability, shared Redis rate limit.
- GitHub exact-head CI для `e21536d...` ще був `IN_PROGRESS` під час checkpoint; CI не позначений як PASS.

## Пошуковий експеримент (не production-зміна)

На frozen Lviv GTFS replay порівняно один 30-хвилинний пошук із трьома 10-хвилинними запитами та об'єднанням. Один запит дав 100 кандидатів; три запити — 300 унікальних. Після production-відбору до 100 кандидатів усі три результати збереглися, а CHEAPEST/BALANCED знайшли інші кандидати з розширеного об'єднання. Водночас усі три підзапити лишилися `searchTruncated=true`, загальна затримка зросла приблизно у 2.2 раза. Тому часову декомпозицію в продукт не переносили: це лише напрям для оптимізації зі спільним графом, точним часом і повторною перевіркою winner-ів.

Пошук усе ще має відомі межі: оцінений графовий попит 413,764 сегменти проти bound 100,000, збережено 99,154; результатний пул обрізається. Прапор неповноти не приховується.

## Висновок

Виправлено узгодженість bounded sampling із трьома scorer-ами; повноту графа/пошуку це не доводить і не виправляє. Це локально й інтеграційно перевірений Server candidate, але не staging/production acceptance. Деплой, зовнішні фіди, фізичний пристрій і production availability не перевірялися; `NOT_RELEASED`.
