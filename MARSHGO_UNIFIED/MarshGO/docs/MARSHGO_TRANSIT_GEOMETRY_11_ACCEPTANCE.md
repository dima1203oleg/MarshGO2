# MARSHGO Transit Geometry 11 — acceptance

Статус: PARTIAL / NOT_RELEASED. Матриця окремих вимог: [requirements](MARSHGO_TRANSIT_GEOMETRY_11_REQUIREMENTS.md).

## Зафіксований стан

- Site worktree: `/Users/dima1203/.qoder/worktrees/app/330dd3/MarshGO-Site`, гілка `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; є незакомічені зміни. 7777 обслуговує цю робочу копію, zrok root HTTP 200.
- Site PR #121 OPEN (`e509d8fb7517c12365716a67695dc8b32f370527`), #123 MERGED (`a9d7d9a4f6eb04827567323c94ff387386e6f9e6`), #127 OPEN (`dbd670b88c47c79b6da782ca4b5e5064b8c6d5c2`), #128 OPEN (`1c2811e4e6258fef50687e3cdc1075920c4d6383`). Наявність PR не доводить присутність і працездатність у активному checkout.
- На 7777 до повторного завантаження спостерігався великий порожній простір у розгорнутій губі після згортання зупинок. Додано розрахунок висоти за вмістом та ущільнення карток; після змін візуальні виміри і перевірка жестів ще не проведені.
- 17 focused тестів губи/зупинок і typecheck пройшли до останніх мобільних CSS-поправок. Реального browser E2E, FPS, пам’яті, iPhone Safari, live vehicle або HyperFlight acceptance немає.
- `setLiveTransitPosition` має прямолінійну інтерполяцію; переглянуті виклики у двох навігаційних екранах передають null. Фактичний focused fleet малюється через GeoJSON; повноцінний рух уздовж підтвердженої траси не доведений. Не представляти це як готовий live map matching.

## Подальші гейти

Перевірити на однаковому viewport до/після висоту губи та довгі маршрути, зупинки й жести; підтвердити геометрію B і відсутність A/C на живому маршруті; встановити ідентичність/свіжість GPS та перевірити рух, ETA і HyperFlight. Немає підстав оголошувати production-ready.
