# Нічний read-only probe GTFS-RT Львова — 2026-10-22

Перевірка о `2026-10-21T22:50:53Z` (2026-10-22, Europe/Kyiv), Server candidate `9f567960846e015d70c0c9274c4fe8fe45a3d944`, Node `24.21.0`. Endpoint-и не змінювалися, запит лише читав публічні дані.

| Endpoint | HTTP | Розмір | Protobuf entities | Час у заголовку | Висновок |
|---|---:|---:|---:|---|---|
| `/gtfs/lviv/vehicle_position` | 200 | 15 bytes | 0 | `2026-10-21T22:50:48Z` | Валідний свіжий повний protobuf snapshot, наразі без транспортних засобів |
| `/gtfs/lviv/trip_updates` | 200 | 15 bytes | 0 | `2026-10-21T22:50:44Z` | Валідний свіжий повний protobuf snapshot, наразі без оновлень рейсів |

Production decoder повернув `0` позицій; trip-update parser повернув `fresh=true`, `0` оновлень і без parser error. Обидва protobuf headers повідомили `incrementality=FULL_DATASET`. Це не stale/error fallback і не вигаданий парк: карта не має з чого малювати live-машини в цей момент.

## Межі висновку

- Це нічний одиничний знімок. Він не доводить, що денна робота фіда несправна або що транспортного руху немає в робочі години.
- Свіжий header з нульовими entities не означає свіжі позиції: фактичних координат тут немає.
- Щоб довести денну доступність, exact trip/route match і stop-progress для вибраної лінії, потрібні повторні зонди в робочі години. Попередній денний probe від 2026-10-21 зафіксований в `34_LVIV_GTFS_VEHICLE_PROGRESS_2026-10-21.md` і `35_LVIV_GTFS_RT_RECHECK_2026-10-21.md`; там були сотні свіжих позицій, але `currentStopSequence` не передавався.
- Це прямий probe feed-ів, не перевірка через production Server API, staging або фізичний пристрій.
