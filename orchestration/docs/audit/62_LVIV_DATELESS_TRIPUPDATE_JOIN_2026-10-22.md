# Львів: безпечне зв'язування VehiclePosition без `start_date` — 2026-10-22

## Навіщо

У частині GTFS-RT VehiclePositions є `trip_id`, `route_id`, timestamp і GPS, але відсутній `TripDescriptor.start_date`. Водночас `TripUpdates` цього ж провайдера містять датовані прогнозовані часи зупинок. Попереднє правило вимагало однакову service date безпосередньо від обох повідомлень і через відсутнє поле не могло пов'язати live-позицію з точним прогнозом вибраної посадки.

## Read-only виміри

Використані лише агрегати, без друку координат, vehicle IDs, trip IDs, персональних даних або збереження live payload.

| Snapshot UTC | Показник | Результат |
|---|---|---:|
| 12:17:41 | Свіжий TripUpdates snapshot | 676 оновлень рейсів |
| 12:17:41 | TripUpdates із stop calls | 676 |
| 12:17:41 | Stop arrivals/departures у майбутньому | 7 640 |
| 12:17:41 | Свіжі VehiclePositions, без умови exact service-date join | 559 |
| 12:17:41 | VehiclePositions з прямим exact `trip_id`+`start_date` TripUpdate join | 0 |
| 12:17:56 | Свіжі VehiclePositions із exact static GTFS trip+route match | 550 |
| 12:17:56 | Матчі vehicle trip ID до TripUpdate, якщо тимчасово ігнорувати дату | 403 |
| 12:17:56 | Матчі з майбутнім stop prediction | 402 |
| 12:17:56 | Vehicle trip IDs із кількома service-date TripUpdates у цьому snapshot | 0 |

Це короткі незалежні snapshots одного дня, а не безперервний feed history чи SLA. Нуль дублікатів service date в одному snapshot не означає, що `trip_id` глобально унікальний між датами.

## Реалізоване правило прив'язки

На Server candidate `a1961324a2a46bd062231d35720fe349d39d9d76` допускається дата-less позиція лише якщо всі умови одночасно виконані:

1. Journey leg має визначені точні provider, raw `trip_id`, `route_id`, service date і boarding stop.
2. Свіжа VehiclePosition збігається за точними `trip_id` і `route_id`; static GTFS теж підтверджує, що trip належить цьому route.
3. Timestamp позиції в межах scheduled GPS window конкретного Journey leg.
4. Свіжий provider TripUpdate прив'язаний до саме Journey service date, trip і route; конкретний boarding stop збігається за sequence/ID і має майбутній arrival prediction.
5. Для невідомого/старого/canceled/skipped/no-data прогнозу акцент не ставиться. Невідповідна explicit VehiclePosition `start_date` відкидається.

Отже, service date походить з обраного Journey та підтверджується датованим TripUpdate; вона не вгадується зі свіжості GPS або лише з `trip_id`. GPS залишається спостереженням, ETA — прогнозом. До трьох найкращих підтверджених під'їздів можна виділити; невизначені машини лишаються приглушеними.

## Перевірки

- Targeted Server GPS unit: 24/24 PASS; покриті відсутній `start_date`, точний future prediction, явна неправильна дата, відсутній прогноз та позиція поза часовим вікном.
- Повний Server unit: 296 PASS / 0 FAIL / 3 opt-in integration SKIP.
- Ізольована PostGIS/Redis integration: 30/30 PASS на окремій loopback БД `marshgo_e2e_lviv_approach_20261022`, чисті міграції 001–055.
- Server PR #26 exact SHA має hosted runs `39777928826` і `39777958708` SUCCESS (audit, lint, typecheck, unit, migrations, integration).
- Release gate при цьому не змінюється: production `NOT_RELEASED`; потрібні повторні live probes/staging, погоджені deploy credentials, HTTPS smoke і фізичний пристрій.
