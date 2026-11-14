# Попередній release manifest

Дата знімка: 12.10.2026. Це контрольна відправна точка аудиту, **не release candidate** і не інструкція для deployment.

| Компонент | Репозиторій / гілка | SHA | Статус доказу |
|---|---|---|---|
| Backend | [MarshGO-Server](https://github.com/dima1203oleg/MarshGO-Server), `codex/sync-mobility-registry` | `cf82c68bc00d343f3a4e691e860259f5ca1acd04` | Локальні typecheck/lint/unit pass; CI integration pass. Не підтверджено production. |
| Frontend | [MarshGO-Site](https://github.com/dima1203oleg/MarshGO-Site), `codex/sync-journey-mobility-ui` | `570ea7b9faa3d55a7e24599657c86fb2903d4cce` | Локальні typecheck/lint/tests/build pass; CI pass. Root test manifest оновлений на цей SHA для E2E; новий повний root CI ще очікується. Не підтверджено розгортання проти цієї Server версії. |
| iOS | [MarshGO-iOS](https://github.com/dima1203oleg/MarshGO-iOS), `codex/reliable-capacitor-sync` | `68f69a32886d6db248bbac627b78f076bc7efe7a` | Simulator CI pass; workflow Site pin `1745822ce1162dcaee2728fd87f2593844960268`, не SHA audited Site. |
| Legacy integration / release material | [MarshGO](https://github.com/dima1203oleg/MarshGO), `codex/marshgo-production` | `6d4b254` + manifest update у наступному audit commit | Аудит/E2E/release матеріали ще тут; фінальний migration не виконаний. |

## Контракт і база даних

- API contract version: **не зафіксована** як кросрепозиторний release contract у перевіреному manifest.
- DB migration version: legacy містить файли до `047`, Server — до `044`; ці числа не сумісні як спільна версія через SQL-колізії `041`, `043`, `044`.
- Конфігурація staging: не включаємо секрети в manifest. Перевірений production/staging deployment target не зафіксований.
- `RELEASE_MANIFEST.json` legacy зафіксував Server `cf82c…`, Site `570ea7b…`, iOS `68f69a…`, `NOT_RELEASED`, production false. Manifest Site pin оновлюється для E2E перевірки актуального UI; iOS workflow ще pin-ить Site `1745822…`, отже набір SHA все ще не синхронізований і не можна використовувати як RC.

## Рішення

Немає узгодженого RC. Не збирати production release із цього документа. Після міграції/паритету та повного тестування створити окремий manifest із точними SHA, contract version, migration ledger hash та CI URLs.


## Перевірена актуалізація SHA

Root `RELEASE_MANIFEST.json` оновлено після passing CI точними candidate pins:

| Компонент | SHA | Перевірка |
|---|---|---|
| Server | `4e32ac3ede97aff715d0604dcf02af7fedd00547` | exact-SHA push/PR CI pass; corridors, stop arrivals, timestamp semantics |
| Site | `570ea7b9faa3d55a7e24599657c86fb2903d4cce` | Site CI pass; shared web/PWA source |
| iOS | `d9a9c4392031cb08b2ecbc31cb959d44e483ab72` | exact-SHA push/PR Simulator CI pass; pins Site above |
| API contract | `v1` | version field in manifest; cross-repo E2E rerun pending |
| Database | migration `048` in candidate Server tree | CI applied on clean PostGIS DB; no existing/staging-data rehearsal |
| Release status | `NOT_RELEASED`; `production_ready=false` | unchanged |

Manifest is a reproducible build pin, not evidence that the full release candidate or production service passed acceptance. Root browser E2E and browser-compat must pass on the exact combined release SHA before RC review.


## Актуальна контрольна точка — 21.10.2026

Release manifest у корені й `docs/RELEASE_MANIFEST.json` оновлено для review-only кортежу: Server `0d13b1b58bb1d8ba5fd2d93d14e344c7c8237521`, Site `a3cd07f56edd2eb7a4f1c1ffba52e32787a1da29`, iOS `303e368952d35f0e97a4855901cb2ce8fd4b24db` (iOS pin-ить саме цей Site SHA), API v1, міграція 055. Server PR #23 ще OPEN/DRAFT; точні CI `39635832510` і `39635839030` пройшли. Цей кортеж не злитий і не розгорнутий; staging/production лишаються NOT_TESTED / NOT_RELEASED.

### Review-only candidate refresh — 21.10.2026 20:41 UTC

Кореневий `RELEASE_MANIFEST.json` і його копія в `docs/` узгоджені на Server PR #24 SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283`, Site PR #14 SHA `c50ba344b7dfde9859826363fea119d95e2cc54e`, iOS PR #9 SHA `7df237845d8841a98a5c15082677ec4198728339` (точно pin-ить Site SHA), API v1, migration 055. Server exact-head CI `39672268416` і `39672277029` пройшли audit/lint/typecheck/unit/migrations/PostgreSQL+PostGIS/Redis. Статус лишився `NOT_RELEASED`: маршрутний пошук на щільному Львівському фіді досі truncated, а staging, live acceptance, фізичний iPhone, резервне копіювання/відновлення, rollback і production HTTPS smoke не підтверджені.


## Поточний review-only кортеж — 22.10.2026, 02:56 за Києвом

Перевірено безпосередньо через GitHub CLI. Server PR #24 — `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c` (OPEN/DRAFT, merge state CLEAN; exact-head CI runs `39689594787` і `39689590022` SUCCESS). Site PR #14 — `c50ba344b7dfde9859826363fea119d95e2cc54e` (OPEN/DRAFT, перевірки SUCCESS). iOS PR #9 — `7df237845d8841a98a5c15082677ec4198728339` (OPEN/DRAFT; Simulator checks SUCCESS і він закріплює саме Site `c50ba344b7dfde9859826363fea119d95e2cc54e`). Це узгоджені source pins у кореневому `RELEASE_MANIFEST.json` та `docs/RELEASE_MANIFEST.json`, але PR-и ще не злиті.

MarshGO integration PR #6 — `b2535369f4636f1f2bb63f96525f2a1b4f929f08` — має невдалий `verify` run `39658734667` на приватному materialization Admin/Partner через відсутній Actions secret `MARSHGO_REPOS_READ_TOKEN`. CodeQL і Gitleaks у тому запуску пройшли. Захисний gate не обходився. Потрібен авторизований read-only Contents токен для двох приватних репозиторіїв.

Поточне рішення залишається `NOT_RELEASED`. Локальне exact-pair E2E 9/9 та трибраузерна сумісність 6/6 є fixture-backed; останній прогін був на host Node 26.7.0, тоді як pinned runtime — Node 24.21.0. Немає staging origin/deploy access, HTTPS smoke/deployed SHA, live provider acceptance, фізичного iPhone, backup/restore і rollback rehearsal чи схваленого rollout. Цей розділ не є доказом deployment і не змінює історичні знімки вище.

### Review candidate refresh `.17` — 2026-10-22 13:09 UTC

Root `RELEASE_MANIFEST.json` and `docs/RELEASE_MANIFEST.json` now agree on Server `a1961324a2a46bd062231d35720fe349d39d9d76` (PR #26), Site `abae09078adea278e04bc9a4a8c86fd880de4b0d` (PR #15), and iOS `3ce07ce6be5a63709dc6c92643f03187372ccb9e` (PR #9 pins that exact Site), API v1 and DB migrations through 055. The iOS exact-pair Simulator runs `39783538900` and `39783549914` both passed. The exact Site PR #15 hosted CI passed. Cross-repository local route checks passed 4/4; Site route smoke passed 6/6 across Chromium/Firefox/WebKit with fixtures. Candidate PRs remain OPEN/DRAFT and unmerged. Status is still `NOT_RELEASED`, deployed SHA is absent, and the full root E2E rerun is still in progress; dense-feed search, staging/deploy, physical-device, backup/restore/rollback, and production smoke gates remain open.

### Review candidate refresh `.18` — 2026-10-22 16:59 UTC

Root `RELEASE_MANIFEST.json` and `docs/RELEASE_MANIFEST.json` now agree on Server PR #27 `30fa1cfa52621e7ed4ca47ad61794711ac484e62`, Site PR #15 `1d2aaa012b88519273eae7a2b8d703ec32c212f6`, and iOS PR #11 `ec586d63e1c07a4807c8991b20c35d1193e0f73d` (pins the exact Server and Site SHAs), API v1 and migrations through 055. Server exact-head CI runs `39817276374`/`39817284271` and iOS manifest/Simulator runs `39818386979`/`39818394871` passed. Local iOS Site build, Capacitor sync, Simulator launch and first-render screenshot passed. All component PRs remain open/unmerged; MarshGO PR #6 still lacks the read-only Admin/Partner token. Status remains `NOT_RELEASED`; dense-Lviv truncation, owner-approved route screenshot baseline, staging/deployment credentials, live provider/device acceptance, backups/restore/rollback, and HTTPS production smoke remain open.
