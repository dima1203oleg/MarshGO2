# Поточна перевірка GitHub і release pins

Дата: 2026-10-22, 02:56 Europe/Kyiv  
Перевірка: read-only GitHub CLI (`gh pr view`); нічого не зливалося й не розгорталося.

| Репозиторій | PR / гілка | SHA | Стан і точний доказ |
|---|---|---|---|
| MarshGO-Server | #24 / `codex/gtfs-route-oracle-20261021` | `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c` | OPEN/DRAFT, merge state CLEAN; verify runs `39689594787`, `39689590022` SUCCESS. |
| MarshGO-Site | #14 / `codex/site-vite-security-20261021` | `c50ba344b7dfde9859826363fea119d95e2cc54e` | OPEN/DRAFT; поточні Site verify checks SUCCESS. |
| MarshGO-iOS | #9 / `codex/ios-pin-site-vite-20261021` | `7df237845d8841a98a5c15082677ec4198728339` | OPEN/DRAFT; Simulator checks SUCCESS; iOS pin відповідає Site `c50ba344b7dfde9859826363fea119d95e2cc54e`. |
| MarshGO | #6 / `codex/security-dependencies-20261021` | `b2535369f4636f1f2bb63f96525f2a1b4f929f08` | OPEN/DRAFT, merge state UNSTABLE; verify run `39658734667` впав на приватному Admin/Partner materialization через відсутній `MARSHGO_REPOS_READ_TOKEN`. CodeQL і Gitleaks checks пройшли. |

## Рішення щодо manifest

Обидві копії release manifest указують на Server/Site/iOS source pins вище та лишають статус `NOT_RELEASED`. Локальна матриця приймання підтверджує exact-pair marketplace E2E **9/9** і браузерну сумісність **6/6** на Chromium/Firefox/WebKit. Це fixture-backed результат, тепер повторений на pinned Node 24.21.0; не підміняє реальний staging, live provider, фізичний iPhone чи production smoke. Strict screenshot gate лишається частковим.

## Відкриті гейти

- Відсутній read-only Actions token для завантаження приватних MarshGO-Admin і MarshGO-Partner source в umbrella CI. Не обходити цей захист.
- Немає підтвердженого staging URL/API origin, deploy pipeline access, deployed SHA або HTTPS smoke.
- Не виконані live provider acceptance, backup/restore та rollback rehearsal, фізичний iPhone acceptance.
- PR-голови не злиті; production rollout не схвалений.

Тому release залишається `NOT_RELEASED`; цей recheck фіксує поточний стан GitHub, але не є production approval.


## Новий pinned-runtime повтор

На Node 24.21.0, exact Server `d128e9b2b94cd3bc08bb3d7f5a16e1a3ea73508c` + Site `c50ba344b7dfde9859826363fea119d95e2cc54e`: marketplace **9/9 PASS** та Chromium/Firefox/WebKit **6/6 PASS**. Створена окрема loopback PostGIS база `marshgo_e2e_prodcheck_20261022`, clean migration chain `001–055` застосована. Тільки fixture geocoder/OSRM/map; production/staging status не змінено. Strict screenshot acceptance і physical device — не тестувалися.
