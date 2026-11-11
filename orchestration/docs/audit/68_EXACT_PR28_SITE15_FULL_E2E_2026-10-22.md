# Повний браузерний E2E для Server PR #28 + Site PR #15 — 2026-10-22

## Зафіксований кандидат

- Server: `dima1203oleg/MarshGO-Server`, PR #28, SHA `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe`.
- Site: `dima1203oleg/MarshGO-Site`, PR #15, SHA `1d2aaa012b88519273eae7a2b8d703ec32c212f6`.
- Node.js: `24.21.0`.
- Production PWA зібрано з точного Site SHA. E2E API запущено з окремого checkout точного Server PR #28 SHA.
- Створено окрему локальну тестову PostGIS базу `marshgo_e2e_pr28_20261022` на loopback `127.0.0.1:5434`; застосовано міграції 001–055. Redis і зовнішні map/geocoder/OSRM відповіді були локальні deterministic fixtures.
- Базу створив скрипт підготовки E2E; це тестові дані. Її не видаляли.

## Результат

Повний `npm run test:e2e` завершився **16 passed / 0 failed за 8.4 хвилини**. Перший виклик до тестового runner не стартував через те, що shell вибрав глобальний Playwright без `test` команди; продуктова перевірка тоді не виконувалася. Повторний виклик поставив локальний `node_modules/.bin` на початок `PATH` і пройшов.

Покриті сценарії:

1. Сумісність браузера.
2. Аудит 152 кліків у production UI: сторінкових runtime errors і server 5xx не виявлено. Евристика дала 15 сигналів «без видимого ефекту»; це не підтверджені дефекти, бо перевірка не має точних assertions для кожного контролу.
3. Фокус вибраного сегмента маршруту на карті.
4. Дата й час пошуку.
5. Повернення до огляду карти після вибору сегмента.
6. Дванадцять канонічних транспортних категорій.
7. Головна/вітальний екран.
8. Два незалежні користувачі: booking, переговори, чат і збереження історії.
9. Водій із двома пасажирами, послідовністю зупинок і GPS reroute.
10. Навігація на iPhone-подібному viewport.
11. Відмова в GPS-дозволі та повторна спроба.
12. Відновлення параметрів із URL після перезавантаження.
13. Попередження Journey Planner про обрізані результати.
14. Community fare і стратегія вибору.
15. Згода rendezvous і відкликання згоди.

## Межі доказу

- Це повний локальний fixture-backed браузерний прогін на двох точних PR SHA; це не live-provider, staging або production acceptance.
- Пошук маршрутів Львова все ще може повертати `searchTruncated=true`; pass сценарію попередження підтверджує чесне повідомлення про обмеження, а не повноту пошуку.
- Реальні SMS/OTP-провайдери, live GTFS/GBFS, комерційне бронювання, production API origin, HTTPS, physical iPhone, APNs і фоновий GPS не перевірялися.
- PR #28 і PR #15 відкриті, не злиті. Пов'язаний iOS PR #11 оновлено до Server PR #28; hosted iOS run `39839632165` SUCCESS на workflow commit `1d1e9763ec99d7e77b22998c4212ce71a7fa924a`.
- Реліз лишається `NOT_RELEASED`; потрібні staging credentials/origin, зовнішні інтеграції, міграційне приймання, backup/restore/rollback rehearsal та owner approval перед production rollout.

## Відтворення

Запуск виконано через root `scripts/run-e2e.sh` з `E2E_SERVER_DIR=/Users/dima1203/Desktop/MarshGO-Server-compact-search-20261022`, де `HEAD` дорівнює Server PR #28 SHA, і `E2E_DIST_DIR=/Users/dima1203/Desktop/MarshGO/.release/site-1d2aaa012b88519273eae7a2b8d703ec32c212f6/dist`, де bundle зібрано з Site PR #15 SHA. Успішний запуск відбувся з локальним Playwright runner та Node 24.21.0. Materializer передав у вивід старий manifest pin Server PR #27; E2E API для цього конкретного прогону було явно перевизначено на точний PR #28 checkout. Тому цей доказ не слід приписувати старому materialized PR #27 tuple.
