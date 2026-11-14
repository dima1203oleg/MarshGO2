# Повний браузерний E2E на точній парі Server/Site — 2026-10-22

## Середовище й версії

- Оркестраційний checkout: `/Users/dima1203/Desktop/MarshGO`, HEAD `f944560a3babf7423befc53741217d9281f44dab`, робоче дерево вже мало незакомічені зміни. Тест змінено в межах цього завдання; це не комітований артефакт.
- Під час повного E2E використано release-manifest пару Server PR #27 `30fa1cfa52621e7ed4ca47ad61794711ac484e62` + Site PR #15 `1d2aaa012b88519273eae7a2b8d703ec32c212f6`, точні SHA для цього прогону.
- Node `24.21.0`; повний suite запущено штатним `scripts/run-e2e.sh` із локальним Playwright у PATH. Playwright побудував pinned Site production bundle та підняв Server/API, фікстури мапи/geocoder/OSRM і loopback PostGIS/Redis.
- База `marshgo_e2e` була вже створена окремо для E2E. Інші бази, контейнери та volumes не змінювалися.

## Результат

`scripts/run-e2e.sh`: **16 PASS / 0 FAIL**, загалом **8,3 хвилини**.

Покриття включає production sign-in/home/search responsive; взаємодію кнопок; результати, стратегії й маршрутну карту; локатор/каталог 12 видів транспорту; дату/час і відновлення URL після reload; двох пасажирів, booking, переговори й persisted chat; водія, двох пасажирів, порядок зупинок і GPS reroute; iPhone viewport-и; відмову геолокації; warning обрізаного Journey Planner; Community price/strategy metadata; rendezvous consent і revocation.

### Зміни, необхідні для узгодження браузерного acceptance

- У canonical route-map E2E замінено кілька застарілих очікувань на фактичні production-контракти pinned Site: перехід назад «Назад до пошуку», текст теми «Темна (Ніч)», status-повідомлення неповного пошуку, темний токен картки `#0B1C2B`, заголовок «Карта транспорту», та ferry token `#0891B2`.
- Візуальні golden-и оновлено лише для canonical route/results screenshots цього сценарію після ручного перегляду результатів і звірки з owner-approved `MarshGO-Site/docs/design/canonical/journey-search-results/README.md` та затвердженими route-map референсами. Повторний повний suite пройшов без `--update-snapshots`.
- Перевірені кадри показують canonical ієрархію результатів та деталізовану карту обраного сегмента. Тест усе ще використовує синтетичні розклади/позиції й тестову карту, а не реальні провайдерські бронювання чи польові GPS.
- Button audit натиснув 158 елементів, повідомив 13 евристичних “no visible effect” сигналів. Це евристика без перевірки всіх input/ARIA/network змін і не є 13 підтвердженими дефектами; їх треба класифікувати окремо.

## Межі доказу й наступний крок

Цей результат закриває попередній локальний `15 PASS / 1 visual FAIL` для цього exact candidate pair на поточному тестовому дереві. Він не є GitHub exact-head CI, staging E2E, live provider acceptance, Safari на фізичному iPhone, deployment, production HTTPS smoke, backup/restore чи rollback rehearsal. Щільний frozen Lviv GTFS пошук усе ще повідомляє `searchTruncated=true`; його повнота не підтверджена.

Production статус: **`NOT_RELEASED`**. Наступне: продовжити ізольовану роботу над bounded GTFS timetable/Pareto search; далі потрібні staging host/API origin, credentials, live-provider acceptance, backup/restore/rollback rehearsal, фізичний iPhone та окреме погодження rollout.
