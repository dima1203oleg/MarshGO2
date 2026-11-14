# Перевірка можливості staging/production deploy — 2026-10-23

## Результат перевірки

Перевірено GitHub metadata, workflow файли шести репозиторіїв та локальне оточення без читання чи виводу значень секретів.

| Пункт | Фактичний стан | Результат |
|---|---|---|
| GitHub Environments | 0 у MarshGO, Server, Site, iOS, Admin, Partner | Немає налаштованих environment approvals/secrets |
| GitHub Deployments | 0 у всіх шести репозиторіях | Немає підтвердженого deployment record/deployed SHA |
| CI deployment workflow | У перевірених workflow є CI/build/test; немає налаштованої хмарної цілі, deploy action чи домену | Не можна запустити реальний deploy |
| GitHub Actions secrets/variables | Немає потрібних deployment значень; root workflow очікує read-only `MARSHGO_REPOS_READ_TOKEN` для checkout приватних Admin/Partner | Umbrella candidate materialization блокується токеном; значення не запитувалось і не читалось |
| iOS release variables | `MARSHGO_SITE_SHA`, `MARSHGO_SERVER_SHA`, `MARSHGO_DATABASE_MIGRATION_VERSION`, `MARSHGO_API_CONTRACT_VERSION`, `MARSHGO_API_BASE_URL` не задані | Tag/release workflow має fail-closed gate до власницького налаштування |
| Local staging stack | `ops/staging/docker-compose.yml` піднімає тільки локальні PostGIS, Redis і S3Mock | Це база для ізольованих тестів, а не повний staging веб/API чи HTTPS |
| Local production config | Production Compose/Caddy очікує домен, HTTPS map manifests, session/Redis/SMS та інші server-side settings | Конфіг свідомо не заповнював фальшивими значеннями і не запускав |
| Deploy credentials | У поточному процесі немає релевантних deploy credential variable names; `.env.production`/`.env.staging` відсутні | Немає засобу авторизуватися в зовнішньому hosting provider |

## Що вже підготовлено

- Код, Docker image build/smoke, migration та PostGIS/Redis acceptance пройшли для окремих точних Server candidates у GitHub CI.
- Локальний review stack і browser tests раніше проходили на ізольованих fixtures; вони не називаються staging.
- iOS CI fail-closed перевіряє точний Site/Server/iOS SHA та HTTPS API URL для tagged release. Станом на наступний checkpoint RC.23 iOS PR #11 `ef8a290dfe6bb870389f104b229d69a3843801a9` pin-ить Server `14b3abfa29baa90b84d4d0d9d61b51604dac7f1d` і Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`; exact tuple Simulator runs `39871559946` і `39871565248` PASS. Це не staging чи фізичний iPhone.
- Production/release manifests лишаються `NOT_RELEASED`, доки не буде створений і перевірений власницький staging та проведені deployment gates.

## Точні зовнішні умови для реального staging

1. Власницький staging host/compute або затверджений hosting account, куди можна деплоїти.
2. Контрольований DNS hostname та HTTPS ingress/TLS для Site/API; стабільний API origin.
3. Secret/config store або окремий staging env: session/Redis, DB, SMS/OTP provider (чи затверджений реальний тестовий режим), map style/data manifests, storage/uploads, health/monitoring та резервне копіювання.
4. Погоджені provider credentials/ліцензії для тих transport capabilities, що повинні бути включені у staging; інакше відповідні категорії залишаються чесно вимкненими/`BLOCKED_EXTERNAL`.
5. Read-only GitHub token із доступом до приватних Admin і Partner репозиторіїв для root candidate orchestration; створити/встановити його має власник GitHub account. Не надсилати token у чат.
6. iOS repository variables для точного release tuple та зовнішнього HTTPS API origin; фізичний iPhone для GPS/APNs/background acceptance.

## Дозволи та статус

Не було створено cloud resource, DNS запису, тунелю, домену, deploy credential, production release чи зовнішнього запису. Для підготовки reviewable staging ще потрібні власницький hosting target та доступи. Для переходу production traffic потрібне окреме явне підтвердження власника згідно з release gate. Статус лишається **BLOCKED_EXTERNAL / NOT_RELEASED**, не «готово на X%».
