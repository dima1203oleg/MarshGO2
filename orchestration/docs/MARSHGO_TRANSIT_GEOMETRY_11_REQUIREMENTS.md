# MARSHGO Transit Geometry 11 — матриця доказів

Snapshot Site HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7` з незакоміченими змінами; окремий SHA результату відсутній. Стан release: NOT_RELEASED.

Базовий доказ: 17/17 тестів щільності та зупинок і typecheck пройшли до останніх незначних CSS-змін; це не підтверджує browser acceptance. На 7777 спостерігалася порожня ділянка до зміни висоти. zrok відповідає HTTP 200, але доступ до вкладки не встановлено.

| ID | Вимога | Місце / тест | Браузер / артефакт | Результат | Статус |
|---|---|---|---|---|---|
| SHEET-01 | Ущільнення вмісту | Site: `JourneyRouteMapScreen.tsx`, `JourneyActiveNavigation.tsx`, `routeSheetDensity.css`; 17 focused tests (не E2E) | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | PARTIAL |
| SHEET-02 | Нижній порожній простір | Site: `JourneyRouteMapScreen.tsx`, `JourneyActiveNavigation.tsx`, `routeSheetDensity.css`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | PARTIAL |
| SHEET-03 | Єдина губа деталей і навігації | Site: `JourneyRouteMapScreen.tsx`, `JourneyActiveNavigation.tsx`, `routeSheetDensity.css`; 17 focused tests (не E2E) | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | PARTIAL |
| SHEET-04 | Виміри до/після | Site: `JourneyRouteMapScreen.tsx`, `JourneyActiveNavigation.tsx`, `routeSheetDensity.css`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| SHEET-05 | Прокрутка та положення | Site: `JourneyRouteMapScreen.tsx`, `JourneyActiveNavigation.tsx`, `routeSheetDensity.css`; 17 focused tests (не E2E) | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | PARTIAL |
| GEO-01 | Пасажирська геометрія B | Site: `MapLibreAdapter.ts`, `transportVisualZones.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | PARTIAL |
| GEO-02 | Приховані A/C | `MapLibreAdapter.ts`, `transportVisualZones.ts`; `focused-passenger-zones.test.ts` | zrok: не перевірено; скриншот після зміни відсутній | Focused-шар обмежено B; A/C збережені в даних. Fixture: 2/2, суміжний набір: 25/25 | PARTIAL |
| GEO-03 | Living Route Ribbon | Site: `MapLibreAdapter.ts`, `transportVisualZones.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | PARTIAL |
| GEO-04 | Геометрія пересадок | Site: `MapLibreAdapter.ts`, `transportVisualZones.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| GEO-05 | Фокусування камери | Site: `MapLibreAdapter.ts`, `transportVisualZones.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | PARTIAL |
| GEO-06 | Унікальні піктограми | Site: `MapLibreAdapter.ts`, `transportVisualZones.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| VEH-01 | Ідентичність транспортного засобу та рейсу | Site: `transportQuality.ts`, `MapLibreAdapter.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| VEH-02 | Map matching GPS | Site: `transportQuality.ts`, `MapLibreAdapter.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| VEH-03 | Плавний рух за трасою | Site: `transportQuality.ts`, `MapLibreAdapter.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| VEH-04 | Напрямок | Site: `transportQuality.ts`, `MapLibreAdapter.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| VEH-05 | До трьох ТЗ перед посадкою | `transportVisualZones.ts`, `useFocusedFleetClock.ts`; `focused-approach-vehicles.test.ts` | zrok: live GPS не перевірено | Відібрані сервером до трьох свіжих; прострочення перевірено на fixture | PARTIAL |
| VEH-06 | Достовірний ETA | Site: `transportQuality.ts`, `MapLibreAdapter.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| VEH-07 | Яскравість наближення | Site: `transportQuality.ts`, `MapLibreAdapter.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| VEH-08 | Проходження посадки | Site: `transportQuality.ts`, `MapLibreAdapter.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| VEH-09 | USER_ONBOARD | Site: `transportQuality.ts`, `MapLibreAdapter.ts`; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| VEH-10 | Застарілі дані | `transportVisualZones.ts`, `useFocusedFleetClock.ts`; `focused-approach-vehicles.test.ts` | zrok: live GPS не перевірено | Відібрані сервером до трьох свіжих; прострочення перевірено на fixture | PARTIAL |
| MOT-01 | HyperFlight | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| MOT-02 | HyperLight Scout | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| MOT-03 | Передбачення повороту | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| MOT-04 | Точне завершення | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| MOT-05 | Route Pulse | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| MOT-06 | Перехід пересадки | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| MOT-07 | Glass Morph | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| MOT-08 | Floating Glass Info | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| MOT-09 | Чотири секунди читабельності | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| MOT-10 | Smoke Dissolve | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| MOT-11 | Переривання жестом | Site: camera/map modules; повний шлях не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| NAV-01 | Реальне GPS-ведення | Site: navigation views; контракт GPS не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| NAV-02 | Preview без зміни прогресу | Site: navigation views; контракт GPS не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| NAV-03 | Повернення до GPS | Site: navigation views; контракт GPS не підтверджено; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| QA-01 | Проміжна перевірка zrok | Site tests / браузер; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| QA-02 | Автоматизовані тести | Site tests / браузер; 17 focused tests (не E2E) | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | PARTIAL |
| QA-03 | Фінальне візуальне приймання | Site tests / браузер; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |
| QA-04 | Продуктивність | Site tests / браузер; окремий доказ не зібрано | zrok: не перевірено; скриншот після зміни відсутній | Потрібне окреме приймання | NOT_TESTED |

## 2026-11-11 — додаткові докази

- SHEET: цільова перевірка 17/17; content-fit 6/6; наступний набір route-sheet/lifecycle/map 57/57. Це fixture/source перевірки; нові розміри та жести у браузері не підтверджені.
- GEO: після обмеження A/C перевірено окремо focused-геометрію та підписи 4/4, ширший набір camera/labels/zones 34/34; типи та вибірковий lint пройшли. Непідтверджені сегменти більше не передаються карті, підтверджений набір тестів 40/40. Географічна правильність реального маршруту ще не доведена.
- VEH: focused список показує до трьох серверно підтверджених свіжих кандидатів та має таймер завершення свіжості. Тестові приклади 15/15 спільно з іншими focused тестами; фактичний GTFS-RT, таймер у React та рух уздовж дороги не перевірено.
- zrok повертає HTTP 200. Після reload попередня сторінка перейшла на стандартний вхід; запитано вхід власника. Обхід авторизації не застосовувався.
