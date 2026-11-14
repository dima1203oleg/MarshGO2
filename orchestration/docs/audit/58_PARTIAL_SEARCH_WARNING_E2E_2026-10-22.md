# Попередження про неповний пошук — E2E acceptance

Дата: 22.10.2026, Europe/Kyiv  
Server PR #24: `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c`  
Site PR #14: `c50ba344b7dfde9859826363fea119d95e2cc54e`  
Runtime: Node `24.21.0`; локальна loopback PostGIS/Redis тестова інфраструктура.

## Перевірка

Додано E2E `Journey Planner clearly warns when candidate generation was truncated` у `e2e/marketplace.spec.ts`. Він проходить автентифікацію, задає реальний тестовий маршрут і викликає точний Server endpoint. Playwright зберігає відповідь та маршрути, змінюючи тільки поля повноти (`partial`, `candidateGenerationTruncated`, `partialReasons`), щоб стабільно перевірити рідкісний граничний стан.

Точна production-збірка Site показала видиме повідомлення: «Пошук неповний: через обмеження обробки частина маршрутів могла не потрапити до результатів…». Окремий сценарій пройшов **1 PASS / 0 FAIL**. Потім для перевірки взаємодії його прогнано разом із повним `e2e/marketplace.spec.ts`: **10 PASS / 0 FAIL** за 1 хв 36 с. Root `npm run typecheck`, ESLint на E2E-файлі й `git diff --check` пройшли.

Перший варіант перевірки впав через надто широкий `role=status` locator, бо в маршрутній картці є окремий screen-reader status. Його звузили до видимого тексту попередження; production UI не змінювався.

## Межі

Це підтверджує лише те, що користувач бачить попередження при `candidateGenerationTruncated=true`. Це не робить обрізаний пошук повним і не доводить recall усіх можливих маршрутів. Свіжий replay львівського GTFS на цьому Server кандидаті досі звітує truncation. Перевірка виконана локально на ізольованих даних, не на staging/production.

**Release status залишається `NOT_RELEASED`.**
