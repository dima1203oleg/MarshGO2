# Поточне приймання release candidate — 2026-10-23

## Перевірений стан

- Root MarshGO: branch `codex/production-finalization-20261014`, committed HEAD `7ab0d8cbb1390f88fe6151e933229c0a92f2937d`. Робоче дерево містить значні раніше незакомічені зміни; наведені локальні результати отримані саме на цьому dirty working tree і не є відтворенням лише committed HEAD.
- Canonical Site: `1d2aaa012b88519273eae7a2b8d703ec32c212f6` (draft PR #15).
- Canonical Server candidate: `e21536d5f97e7876aae0a360ed3ff4126ba5c78c` (draft PR #29).
- iOS pin candidate: `1d1e9763ec99d7e77b22998c4212ce71a7fa924a`, який посилається на Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`.
- PR #29 на точному Server SHA має два успішні hosted CI runs: `39852917615`, `39852909626`.
- Root integration PR #5 зараз на SHA `b53ff7b8ddb6efa73e6c036d1d96b274ffb349d1`; окремі CodeQL/Gitleaks успішні. Новий hosted CI run `39855221314` пройшов Bun frozen install + high-severity audit, lint, typecheck, unit, migration/Postgres integration, production build і bundle gate, після чого зупинився через відсутній Actions secret `MARSHGO_REPOS_READ_TOKEN` для читання приватних MarshGO-Admin і MarshGO-Partner. Попередній run `39854554389` також показав той самий blocker. Його не обходили.

## Локальні перевірки

- На точних Server `e21536d5f97e7876aae0a360ed3ff4126ba5c78c` та Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`, з окремою БД `marshgo_e2e_rc23_20261023`, повний браузерний набір **16/16 PASS за 8,5 хв**. Додатково перевірені маршрут/карта, вибір сегмента, дата/час, 12 категорій, onboarding, два користувачі, бронювання/переговори/чат, GPS reroute, дозвіл геолокації, URL restore, partial-search та rendezvous consent. Прогін виконався локальним Node `26.7.0` (поза задекларованим Server Node `24.21.0`); це зараховується як browser-flow evidence, не як Node 24 сумісність.
- Heuristic audit: **152 кнопки/контроли натиснуто**, 0 зафіксованих JS/HTTP runtime-помилок; 14 евристичних «без видимого ефекту» сигналів, які сам тест не класифікує як FAIL. Це не 14 підтверджених дефектів; потрібні точкові asserts для вкладок, swap і MapLibre-маркерів.
- Перший запуск тестів було налаштовано неправильно: браузерний fixture proxy залишився на порту відкритого RC preview, тому OTP-запити йшли не в тестовий API. Виправлено в `playwright.config.ts`: `E2E_API_PORT` задається один раз і застосовується до health-check, API процесу та web proxy. Після цього канонічний `E2E_API_PORT=3309 npm run test:e2e` пройшов **16/16 за 8,5 хв** на ізольованій БД `marshgo_e2e_rc23_20261023`; Node 26.7.0. Це підтверджує конфігурацію та browser flow на fixtures, не Node 24 або staging.
- Окремо розібрано евристику «Поміняти місцями»: новий E2E вибирає два реальні mocked geocoder places, міняє їх і перевіряє, що `/api/v1/journeys/search` отримує зворотні назви та координати. **1/1 PASS**. Початковий audit клікав кнопку з порожніми полями, тому це був false positive, не підтверджений дефект.
- `npm run check:production`: PASS — typecheck, lint, 256 unit tests PASS, 0 FAIL, 1 opt-in integration SKIP, Vite production build і bundle budget PASS.
- Повторний `npm run check:production` на поточному dirty root checkout (Node 26.7.0): typecheck PASS, lint PASS, **256/256 unit PASS**, 0 FAIL, 1 opt-in DB integration SKIP, Vite production build PASS; 51 JS chunks у межі ≤350 KB gzip PASS. Це не перевірка Node 24, clean immutable SHA або staging.
- Exact pinned Server/Site cross-browser browser-compat + route-map suite: **6/6 PASS** (Chromium, Firefox, WebKit; обидва сценарії на кожному двигуні) за 2,6 хв. Site bundle перебудований із точного Site `1d2aaa0…` і ізольованого map fixture; Server `e21536d…`, окрема loopback E2E DB; Node 26.7.0. Це не фізичний Safari/iPhone, live provider feed чи staging.
- `npm run test:e2e`: PASS — 16/16 production-route Playwright сценаріїв за 8,5 хвилин. Перевірено browser compatibility, 158 кнопок на production екранах, маршрут/карту й фокус сегмента, 12 transport modes, onboarding, два облікові записи, бронювання/переговори/чат, GPS reroute, iPhone viewport-и, відмову геолокації, відновлення URL-пошуку, partial-search попередження та rendezvous UI.
- Кнопковий heuristic аудит записав 15 «без видимого ефекту» сигналів. Це не 15 підтверджених дефектів: серед них поточні вкладки, заголовки й неінтерактивна мітка; потрібна точкова класифікація.
- E2E використовував loopback PostGIS/Redis і детерміновані map/geocoder/OSRM fixtures. Server був локально заданий кандидатом PR #29, Site — точним pin PR #15. Живі provider API, публічний staging, реальні SMS/GPS та фізичний iPhone цими тестами не перевірені.
- Bun lock оновлено до версій, що прибирають дві High advisories; `bun install --frozen-lockfile` і `bun audit --audit-level=high` PASS локально, а hosted run `39855221314` теж пройшов цей audit. GitHub Actions після решти code/DB/build gates зупинився лише на відсутньому приватному-repo token.

## Відкриті production gates

1. Налаштувати GitHub Actions secret з read-only Contents доступом до приватних Admin/Partner репозиторіїв, щоб завершувався umbrella CI. Не публікувати token у чаті чи файлах.
2. Надати/налаштувати перевірений staging host, API origin, deploy access і секрети. На поточних доказах нема HTTPS staging/production URL, deployed SHA, smoke test чи rollback rehearsal.
3. Виправити або чесно обмежити заявлену повноту GTFS пошуку: актуальний Lviv search ще повертає `searchTruncated=true`.
4. Провести live provider acceptance, включно з реальною доступністю/цінами/бронюванням, лише для джерел із підтвердженими правами й доступом.
5. Пройти фізичний iPhone приймальний тест для GPS, background behavior, push і двохсторонньої зустрічі.
6. Підтвердити rollback, резервне копіювання/відновлення і production migration rehearsal.

## Статус

`NOT_RELEASED`. Root hosted code/DB/build gates і локальні production/web сценарії мають добрий доказовий рівень, але umbrella workflow не завершений, staging/deploy/production докази відсутні та лишаються функціональні обмеження зовнішніх даних. Ні merge, ні production deployment у цьому кроці не виконувались. Свіжа GitHub Deployments API перевірка для MarshGO, Server, Site, iOS, Admin і Partner повернула 0 deployment-записів для кожного.

## UI controls and reference review — 2026-10-23

- Corrected `e2e/button-audit.spec.ts` to compare full DOM state and address controls by accessible role/name plus duplicate occurrence. The audit now tests duplicate labels individually rather than deduplicating them.
- `npx eslint e2e/button-audit.spec.ts`: PASS. `npm run typecheck`: PASS. Isolated browser audit against manifest-pinned Server `b65882584a3ad1e8dd7512d13176f52299cded51` and Site `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae`: **1/1 PASS**, 161 clicks across 12 primary Site routes, no JS exceptions or HTTP 5xx, 10 no-visible-change outcomes. Destructive actions were skipped.
- The ten outcomes are: selected home banner; current Home/Search/Trips/Profile/Messages destinations; swap and search with empty criteria; scheduled-trips filter; and publishing a demand with empty required fields. Current destinations and empty-input no-ops are expected; the scheduled filter and submit validation still need specific state assertions. This is an interaction smoke test, not proof of every conditional action.
- Viewed all ten supplied mock images and current candidate captures of route details, map layers, and navigation. There is broad structural overlap, but visual parity is **not accepted**: the current test capture has synthetic map tiles rather than the referenced aerial/city map appearance, and its layer panel grouping and available controls differ from the mock. Matching-state captures for every reference were not produced.
- Admin/Partner authenticated actions, all nested/conditional controls, live map assets/providers, physical iPhone, and staging/production acceptance remain untested. Release status remains `NOT_RELEASED`.

## Follow-up full browser sweep — 2026-10-23

- `npm run test:e2e`: **16/18 passed** on the first complete 18-case run. After correcting both stale test expectations, the remaining browser suite ran together with **17/17 PASS**. The safe-control audit had passed separately as **1/1**, with **161 clicks across 12 primary routes** and no browser exceptions or unexpected HTTP 5xx; together all 18 scenarios are green.
- The two failed cases were test expectations rather than confirmed product regressions: partial-search warning is exposed as a `status` node; dark route segment uses current `--route-card: #0B1C2B`; both focused reruns passed after aligning assertions. Two-account marketplace rerun also passed after removing interrupted fixtures with exact `route_source='e2e_fixture'` and reserved `Rescue E2E ...` names from the loopback-only E2E database. Driver GPS/navigation long scenario passed separately.
- Root `npm run check:production`: typecheck PASS, lint PASS, **256/256 unit tests PASS**, 1 opt-in integration test SKIP, build PASS, bundle gate PASS (51 JS chunks each ≤350 KB gzip). Cross-browser compatibility for sign-in/home/search remains PASS in Chromium, Firefox, and WebKit from the prior focused run.
- No product source was changed in this sweep; only E2E assertions/fixture setup and captured route-map snapshots were modified. The 17 non-click-audit scenarios completed together after fixes; the unchanged production UI passed the separate click audit.
- This does not prove literal every-control coverage: Admin/Partner, all nested conditional flows and destructive actions were not exercised. Physical Safari/iPhone, live providers/map assets, staging and deployed production are NOT_TESTED. Reference parity is still **not accepted**: there is structural similarity, but synthetic map fixtures and missing matching-state captures prevent visual approval against all ten supplied images. Status remains `NOT_RELEASED`.

## Expanded current-tree route/control sweep — 2026-10-23

- Rebuilt current root Site to `/tmp/marshgo-current-e2e/dist` with the deterministic local map fixture and used current root Server on the loopback E2E database. This run tests the dirty working tree and is not release-artifact evidence.
- Extended `e2e/button-audit.spec.ts` to all 16 production paths declared by the current root router, including `/search`, `/navigation`, `/admin/verification`, and `/lifecycle`. Result **1/1 PASS**: 241 visible controls clicked, no browser exceptions or unexpected 5xx. Admin correctly presents 403 to the non-admin test user. Fourteen no-effect heuristics include the current banner/tab, empty form actions, and map tooltip/hints that are not clickable.
- On the manifest-pinned Site SHA `1d0f1febfd757dfcbaa3d9fbb06fef756d0c9fae`, `/lifecycle` returns **404** because this route exists only in the newer dirty root tree. The pinned-candidate audit consequently fails at that route. This is a confirmed candidate/current-tree mismatch; a new exact release SHA must include the route and pass before claiming parity.
- The current-tree smoke audit still does not exhaust every nested/conditional state, all entity deep links, Admin/Partner standalone apps, or destructive actions. Ten-reference screenshot parity remains unaccepted; live map assets/providers, physical device, staging and production remain NOT_TESTED. Status remains `NOT_RELEASED`.
