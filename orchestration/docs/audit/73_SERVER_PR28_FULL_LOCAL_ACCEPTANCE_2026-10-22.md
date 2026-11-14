# Server PR #28: повна локальна перевірка з PostGIS і Redis — 2026-10-22

## Точна версія

- Репозиторій: `MarshGO-Server`.
- Branch: `codex/gtfs-compact-edge-retention-20261022`.
- SHA: `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe` (PR #28).
- Node: `24.21.0`.
- PR #28 на момент перевірки: OPEN, non-draft, mergeable; exact-head GitHub CI checks обидва SUCCESS.

## Результати

- Повний локальний unit suite: **296 PASS / 0 FAIL / 3 opt-in SKIP** із 299 тестів.
- Після цього окремо повторено актуальні GTFS тести на тому самому SHA: `gtfs-timetable.test.ts` + `bounded-graph-budget.test.ts` — **68/68 PASS** (Node `25.4.0`). Вони включають exact feasible-set oracle для one-/two-transfer малих feed та узгодження всіх трьох ranking winners. Це алгоритмічні fixtures, не містова повнота.
- ESLint `server tests`: PASS.
- TypeScript `tsc --noEmit`: PASS.
- `npm run test:integration`: **30 PASS / 0 FAIL / 0 SKIP**. До результату входять міграційний/Journey schema прогін, live-journey API, booking і редагування поїздки, Partner API та tenant isolation, навігація, Redis realtime між двома API-процесами, збереження бронювання після рестарту та Redis rate limit між двома API-процесами.
- Створено окрему loopback базу `marshgo_e2e_releasecheck_20261022`; наявні бази не використовувались для запису. Застосовано **52** наявні SQL-міграції; остання — `055_provider_commercial_use_requires_license.sql`. База залишена для відтворюваності.
- Docker image побудовано з цього SHA: `marshgo-server:pr28-d83fa58`, digest `sha256:439f3701cf5964bfd695fcedb42b7bfaa29069a0bf7ae6a77c6e66179b76210d`. Контейнер запущено локально окремим ім’ям `marshgo-server-smoke-pr28-d83fa58` (restart policy `no`, порт лише `127.0.0.1:3339`); процес працює як `node` без root. `/healthz` і `/readyz` повернули HTTP 200; readiness підтвердив PostgreSQL і Redis, а Docker healthcheck став `healthy`. Після smoke-кроку контейнер зупинено, але не видалено; його можна повторно запустити.
- Використано loopback PostGIS, Redis та GTFS/OSRM fixtures у режимі розробки. Зовнішні live provider booking/API, SMS, staging, HTTPS, production data та фізичний iPhone не перевірялися.
- Повний frozen Lviv GTFS archive, використаний у попередньому replay-звіті, у поточних доступних checkout-ах відсутній. Тому ліміт графа/відбір кандидатів цього разу не змінювався і попередній replay не перевидавався як поточний.
- Після завершення тимчасовий `node_modules` symlink прибраний і тестові API-процеси зупинені скриптом. Docker-контейнери, volumes і дані не видалялися або не очищалися.

## Висновок

Це локальне Server integration acceptance та container runtime smoke для конкретного SHA. Воно підтверджує міграції, PostGIS/Redis integration, запуск зібраного образу і перелічені API сценарії, але **не** підтверджує staging/production deployment і не усуває обмеження GTFS пошуку: на щільних запитах відповідь може бути `partial`/`truncated`. Production status лишається `NOT_RELEASED`.
