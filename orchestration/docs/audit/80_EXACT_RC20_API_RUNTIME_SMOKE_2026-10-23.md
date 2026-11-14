# Runtime-перевірка API-образу RC.20 — 2026-10-23

## Кандидат і середовище

- API image: `marshgo/api:RC-2026-10-23-current-review.20`, image ID `b90e9a02d1c6`, з release tuple Server `e21536d5f97e7876aae0a360ed3ff4126ba5c78c`.
- Для чистої схеми створено окрему локальну БД `marshgo_rc20_smoke_20261023` у вже наявному тестовому PostGIS. Інші БД не змінювали.
- Точний API image застосував **52 SQL-міграції**, остання — `055_provider_commercial_use_requires_license.sql`. Розмір нової БД після міграції — 18 MB.
- API тимчасово запущено як контейнер у наявній dev-мережі з тестовими PostGIS та Redis. Для production-only змінних передано локальні placeholder-значення на домені `example.invalid`; реальні SMS, карти, geocoder, routing і зовнішні провайдери не викликались.

## Результат

- `GET /healthz`: **HTTP 200**, `{"status":"ok"}`.
- `GET /readyz`: **HTTP 200**, `{"status":"ready","database":"connected","realtime":"connected"}` — API під'єднався до Postgres і Redis.
- Без access token `GET /api/v1/transport/cities` і `GET /api/v1/journeys/me` відповіли **HTTP 401**. Це очікувано для точного Server SHA: обидва маршрути позначені `requireAuth`; анонімний доступ до них не перевірявся.
- Точний Web image `marshgo/web:RC-2026-10-23-current-review.20` під'єднаний через Nginx до API у тій самій локальній тестовій Docker-мережі. Через браузерний HTTP-контур пройшли `/healthz`, `/healthz-api`, `/readyz`, `/` та SPA fallback `/journeys/search`: **5/5 HTTP 200**. Захищений proxied `/api/v1/journeys/me` відповів **HTTP 401** без сесії.
- Зараз Web і API кандидати залишені доступними локально на `http://127.0.0.1:3000` і `http://127.0.0.1:3302`; обидва контейнери здорові. Вони використовують лише локальну тестову БД, локальний Redis і placeholder `.invalid` endpoints; SMS і зовнішні провайдери не викликаються. Статична сторінка й proxy health не засвідчують успішний sign-in, мапу, реальні дані чи повний користувацький flow.
- У вбудованому браузері після повного reload відкрився welcome screen. Пройдено onboarding 1/3 → 2/3 → 3/3, вибір «Не зараз» для геолокації та перехід до форми входу за телефоном; далі повернуто welcome. Геолокацію не дозволяв, телефон/OTP не вводив. Це перевірка welcome/onboarding UI, не sign-in acceptance. Сторінка залишена доступною в браузері для локального огляду.
- Створену тестову БД залишено, видалення контейнерів, образів, томів чи даних не виконувалось.

## Межі доказу

Це підтверджує старт точного API-образу, readiness з локальними інфраструктурними залежностями після чистої міграції та відхилення захищених ресурсів без сесії. Попередню підозру, що `transport/cities` мав бути публічним, відхилено: вона виникла через перегляд іншої legacy-копії; у pin-нутому SHA маршрут коректно вимагає авторизацію. Це **не** staging чи production: не перевірено OTP-доставку, live transport feeds, сторонні API/бронювання, HTTPS edge, реальний deploy, навантаження, backup/restore, rollback, фізичний iPhone або двосторонню GPS-зустріч. Release залишається `NOT_RELEASED`.
