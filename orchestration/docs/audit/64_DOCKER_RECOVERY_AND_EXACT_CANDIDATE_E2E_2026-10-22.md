# Відновлення Docker і повторний exact-candidate E2E

Дата: 22.10.2026, Europe/Kyiv

## Відновлення локального Docker

- До очищення системний Data volume мав 1,1 GiB вільного місця; Docker daemon не відповідав.
- На явне доручення видалено 11 зупинених контейнерів MARSHGO. Контейнери та дані CATL не чіпали.
- Видалено Docker build cache (**14,81 GB**) і неактивні Docker images (**8,32 GB**). Повторно завантажено потрібні PostGIS, Redis і S3Mock images.
- Docker volumes не видалялися. Після роботи `docker system df` показував 29 volumes, 5.751 GB загалом; 5.479 GB були відмічені Docker як невикористані/reclaimable, але їх збережено, щоб не втратити дані.
- Перебудовані/запущені `marshgo-server-db-1`, `marshgo-server-redis-1` і `marshgo-s3mock-1`. PostgreSQL і Redis — healthy; `pg_isready` PASS, PostGIS extensions присутні, попередня база лишилась із 85 таблицями, Redis `PONG`, S3Mock loopback HTTP відповідає.
- Після повторного завантаження базових images системний диск показав 21 GiB вільного місця (до очищення — 1.1 GiB). Запит звільнити 50 GB не досягнуто.

## Серверні перевірки після відновлення

- У локальному Server checkout `feature/transport-layer-availability`, HEAD `182c77ae4f78d576a287007d8e0864fb130f43f8`, дерево має незакомічені зміни. Повний `npm run test:integration`: **29 PASS / 0 FAIL / 0 SKIP** на окремій loopback БД `marshgo_e2e`; покрито Journey schema, live-journey API, booking/trip editing, навігацію, realtime між двома API-процесами, restart durability та Redis rate limit.
- На тому самому checkout `npm test`: **224 PASS / 0 FAIL / 1 opt-in SKIP**; `npm run lint` PASS; `npm run typecheck` PASS.
- Це локальна перевірка незакоміченого checkout, не exact-head PR #27 і не staging.

## Повний root E2E на release candidates

- `npm run test:e2e` materialized точні Server PR #27 `30fa1cfa52621e7ed4ca47ad61794711ac484e62` і Site PR #15 `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; E2E використовував loopback PostGIS/Redis, контрольовані test services та production PWA build.
- Результат **15 PASS / 1 FAIL** за 7.5 хв. Button audit натиснув 158 елементів, не знайшов page errors і зафіксував 13 підозр на відсутність видимого ефекту; евристика не перевіряє input value/ARIA state, тому ці випадки потребують класифікації.
- Пройшли два незалежні акаунти, бронювання/переговори/чат, водійський multi-rider flow, GPS reroute, iPhone viewports, відмова GPS, відновлення параметрів пошуку, Journey Planner warning/strategy metadata, дві rendezvous перевірки та інші функціональні сценарії.
- Єдиний FAIL — строгий pixel diff `journey-results-light.png`: **54,604 px / 16%**. Переглянуто actual, diff та stored snapshot. Actual має щільні картки результатів з метриками й segment tiles; stored snapshot показує інший, старіший card layout. Це підтверджує візуальну розбіжність, але не визначає, який вигляд затверджений. Snapshot не змінювали, threshold не послаблювали. Решта перевірок після цього assertion у тому ж тесті не виконалася; окремий маршрутний E2E пройшов.
- E2E runner видав `EBADENGINE`: Node `v26.7.0`, тоді як Server пакунок вимагає Node `24.21.0`. Окремий матеріалізований API під час E2E запущено Node з Hermes runtime; повний suite ще слід повторити на узгодженому Node 24 runtime.

## Повтор на точній версії Node

- З nodejs.org завантажено Node `24.21.0` для macOS arm64, SHA-256 звірено з офіційним `SHASUMS256.txt`; runtime розпаковано лише в `/tmp/marshgo-node24`.
- Root `npm run check:production` пройшов з Node `24.21.0`: typecheck, lint, unit, Vite build і bundle gate (51 JS chunks ≤350 KB gzip).
- Повторний повний E2E з тим самим Server/Site SHA, цього разу Node `24.21.0`: **15 PASS / 1 FAIL за 7.3 хв**. Зник `EBADENGINE`, але єдиний fail лишився тим самим: `journey-results-light.png`, рівно 54,604 px / 16% diff. Отже runtime mismatch не є причиною screenshot failure.
- Button audit знову клацнув 158 елементів без runtime/page errors; 15 евристичних no-visible-effect сигналів (попередній запуск — 13) показують, що саме ця евристика нестабільна й недостатня для оголошення defect. Серед сигналів є nav/tab/empty-submit та input/map контролі; для визначення дефекту потрібні точкові state assertions.
- Повторність screenshot fail підтверджена на Node 24.21.0. Golden не змінювався; до затвердження canonical expected для саме цього viewport visual gate лишається FAIL.

## Окремі Admin/Partner checks

- Admin `codex/p0-admin`, SHA `9dbf7db0a935498ac40c98b19bc36bce056d630d`: typecheck, lint, **2/2 unit**, production build PASS.
- Partner `codex/p0-partner`, SHA `c639257a7f28aeda5b378a816038b01651146b83`: typecheck, lint, **3/3 unit**, production build PASS.
- Це frontend presentation/access-state tests; live Server RBAC, tenant isolation та staging сценарії цим не доведені.

## Наступні дії

1. Зіставити route-results screen з owner-approved дизайном у `docs/design/canonical` і затвердити або виправити компонент; тільки потім оновити golden.
2. Замінити нестабільну button-audit евристику точковими перевірками change/state для виявлених controls, не послаблюючи тест.
3. Продовжити timetable/Pareto пошук: щільний Lviv пошук лишається truncated; staging/provider/physical-device gates лишаються відкритими.

Production status: `NOT_RELEASED`.
