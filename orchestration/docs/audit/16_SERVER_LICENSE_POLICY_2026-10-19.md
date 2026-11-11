# Server candidate: перевірка комерційних прав фідів

**Перевірено:** 2026-10-19, Europe/Kyiv  
**Репозиторій:** `MarshGO-Server`  
**Гілка:** `integration/production-20261019`  
**Commit:** `a09cce81cba6eb058fec372c79ef004d1aa93a3b`  
**PR:** [#9](https://github.com/dima1203oleg/MarshGO-Server/pull/9), відкритий; hosted checks очікувалися під час цього checkpoint.

## Зміна

У попередній міграції реєстру будь-яка непорожня назва ліцензії для відкритого джерела автоматично ставила `commercial_use=true`. Seeder також перетворював успішний health probe на доказ комерційного дозволу. Доступність фіда підтверджує лише відповідь джерела, а не право використовувати його комерційно.

У кандидата додано міграцію `055_provider_commercial_use_requires_license.sql` і парсер `commercialUseFromLicense`:

- впізнана дозволена ліцензія або явний дозвіл → `true`;
- явне non-commercial обмеження → `false`;
- невпізнаний або відсутній текст → `NULL`;
- успішний мережевий probe більше не змінює комерційний статус.

Старі застосовані міграції не переписувалися. `docs/TRANSPORT_API_REGISTRY.md` виправлений: foot-routing adapter під `WALKING_ROUTING_URL` уже існує, але без налаштованого провайдера лишаються лише позначені оцінки; веломаршрутизація не підключена.

## Перевірки на точному SHA

- `npm run typecheck` — PASS.
- `npm run lint` — PASS.
- `npm test` — 230 passed, 0 failed, 3 opt-in integration skips.
- `npm run test:integration` на новій окремій loopback БД `marshgo_e2e_goal_20261019` та Redis — 31 passed, 0 failed, 0 skipped. Перевірені Journey schema/live journey, booking/trip edits, partner tenant isolation, navigation, realtime між двома API, restart durability та rate limits.
- Застосовано всі міграції з чистої БД до 055; другий запуск не застосував нових файлів. Міграція 055 окремо перевірена на трьох тестових записах у rollback-транзакції: CC BY → `true`, CC BY-NC → `false`, невідомі умови → `NULL`; тестові записи відкотилися.
- GitHub PR #9 на `a09cce81…` мав дві перевірки `verify` у стані pending під час запису checkpoint.

## Межі доказу

Це Server-кандидат та локальні перевірки на виділеній тестовій БД, не staging і не production. Не перевірялися реальні комерційні договори кожного фіда, production database upgrade/rollback, HTTPS staging або deployed SHA. Поточні PR checks і п’ятирепозиторна container build мають бути повторно підтверджені після оновлення Server SHA.
