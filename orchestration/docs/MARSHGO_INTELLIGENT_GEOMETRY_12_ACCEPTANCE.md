# MARSHGO Intelligent Geometry 12 — звіт

Статус: PARTIAL / NOT_RELEASED. [Матриця вимог](MARSHGO_INTELLIGENT_GEOMETRY_12_REQUIREMENTS.md).

Активний Site на 7777: dirty worktree `qoder/route-geometry-continuation-20261110`, HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`. zrok повертає HTTP 200. Після попереднього перезавантаження сторінка запросила звичайний вхід; власнику подано запит на вхід. Післязмінний візуальний аудит, актуальне відео та порівняння до/після не виконано.

Поточний код уже містить окремі шари контуру, основи, світіння та стрілок, обмеження focused-зони до B, відсів непідтверджених відрізків та підлаштування камери. Це не доказ якості на живій карті; коректне обрізання на петлях, HyperFlight, рух ТЗ, FPS і 3D приймання ще не підтверджено.

Цільовий набір перевірок геометрії, камери, focused-зон та допоміжних функцій: 62/62 passed. Це fixture/source-тести, не візуальна чи live-перевірка. Дані про FPS і RAM у сесії навігації відсутні.

## Попередній огляд рендерингу

`MapLibreAdapter.ts` створює окремі шари glow, casing, основної лінії та стрілок із round caps/joins. `routeGeometryTokens.ts` містить зум-залежні параметри. `interpolateLineProgress` у `cinematicRouteEngine.ts` щоразу повторно обчислює довжини всіх ребер, а `JourneyRouteMapScreen.tsx` викликає його з RAF; потенційна вартість зростає разом із кількістю точок. Це висновок із коду, не вимір FPS. До початку змін ТЗ 12 потрібен візуальний baseline після звичайного входу в zrok.

## 2026-11-11 — partial zrok checkpoint and route reveal optimization

Owner session now signed in. Through the existing zrok endpoint on port 7777, the real Сихів–Варшавська route loaded and selecting автобус А41 focused the segment on the visible map. One route and interaction only: no before/after screenshot pair or geographic correctness, live GPS, animation timing, 3D or FPS acceptance was established.

`prepareLineProgress` precomputes lengths once for the route-reveal animation. Targeted tests 22/22, typecheck, lint and diff check passed. One synthetic 3,000-point/120-frame comparison was 26.61 ms versus 0.69 ms; this is not a browser performance or device FPS measurement. Dirty Site HEAD `1c52ab315ed74d11298a4ada0aaf6704e8c28ce7`; production remains NOT_RELEASED.
