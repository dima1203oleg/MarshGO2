# Lviv frozen-feed replay: Server PR #26 vs PR #27

Дата: 22.10.2026, Europe/Kyiv  
Static GTFS snapshot: `/tmp/marshgo-lviv-gtfs-20261022`, збережений 12.10.2026; 1,071 stops, 72 routes, 15,716 trips.  
Поточний review candidate PR #27: `30fa1cfa52621e7ed4ca47ad61794711ac484e62`.  
База PR #26: `a1961324a2a46bd062231d35720fe349d39d9d76`.

## Метод

Однаковий parser-level production пошук на обох checkout-ах: Maloholoskivska → Sykhiv, 22.10.2026, вікно старту 08:00–08:30 Europe/Kyiv, максимум дві пересадки, до 100 результатів, 6-годинний горизонт. Обидва запуски виконані локально на Node 24.19.0 із однаковим heap limit 512 MiB та тим самим незмінним snapshot. Мережеві запити, БД і production API не використовувалися.

## Результат

| Метрика | PR #26 `a1961324` | PR #27 `30fa1cf` |
|---|---:|---:|
| Результати | 100 | 100 |
| Різні route-name chains | 33 | 33 |
| `candidateGraphTruncated` | true | true |
| `searchTruncated` | true | true |
| `resultLimitReached` | true | true |
| Одноразовий час | 2,745 ms | 2,667 ms |
| FASTEST | BUS→TRAM, 4,244 s, 672 m walk | той самий itinerary |
| CHEAPEST | BUS→BUS, 4,908 s, 343 m walk, fare unknown | той самий itinerary |
| BALANCED | BUS→BUS, 4,908 s, 343 m walk, fare unknown | той самий itinerary |

У GTFS snapshot немає fare для цих маршрутів; `CHEAPEST` переможець у цьому parser-level виборі означає перший кандидат серед fare-unknown маршрутів після спільного scorer fallback, а не безкоштовну поїздку чи підтверджену ціну.

## Висновок

PR #27 same-route `transfer_type=4` виправлення не змінило результат цього OD і не внесло помітної регресії в нього. Це очікувано: frozen Lviv feed/query не містить відповідного in-seat continuation у наведених переможцях. Повнота не покращена: candidate graph і search залишаються truncated. Одне вимірювання часу не є benchmark-ом навантаження.

Наступний алгоритмічний крок залишається відкритим: bounded timetable/label/Pareto пошук, який не materialize-ить усі stop-pair сегменти. Спершу він має зберегти кожен feasible варіант і FASTEST/CHEAPEST/BALANCED переможців на exhaustive tiny-feed oracle; потім пройти ті самі frozen Lviv OD з порівнянням chain coverage, переможців, пам'яті й часу. До такого доказу production search лишається чесно поміченим як неповний.

## Повторна перевірка після checkpoint — 2026-10-22

Однаковий 6-годинний запит повторено тричі на Server PR #26 (`a1961324`) і PR #27 (`30fa1cfa`), використовуючи той самий frozen snapshot, Node 24.19.0 і однакові параметри: Maloholoskivska→Sykhiv, 08:00–08:30 Europe/Kyiv, максимум дві пересадки, `maximumWaitSeconds=14400`, `limit=100`. У кожному прогоні набори 100 itinerary ID збіглися повністю (100/100); FASTEST/BALANCED/CHEAPEST fallback winner збігався — BUS А37→А23, 4,128 с, 343 м ходьби. Ціна в цьому GTFS лишається невідомою. Усі три прапорці `candidateGraphTruncated`, `searchTruncated`, `resultLimitReached` лишилися `true` в обох версіях. Це уточнює попередню таблицю з 4,244-секундним BUS→TRAM прикладом: повторений контрольний запуск із явно зафіксованим 6-годинним горизонтом відтворювано повернув інший winner, але однаково для PR #26 і #27. Повнота не підтверджена.

Debug запуск PR #27 показав 436,570 оцінених сегментів проти ліміту 100,000; утримано 98,452, сформовано 764 кандидатні itinerary до response selection, виконано 55,066 search steps; один прогін зайняв близько 1.8 с і досягнув близько 579 MB RSS. Це одиничне локальне спостереження, не навантажувальний тест. Підняття лімітів не робилося.
