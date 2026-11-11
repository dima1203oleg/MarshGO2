# Production карта: фокус сегмента та iOS Site sync

Дата: 2026-10-20

## Виявлена розбіжність

У production Site `journeySegmentsForFocus` при виборі сегмента залишав лише його лінію. Поточна зведена специфікація вимагає зберігати всі лінії маршруту, підсвічувати вибрану та приглушувати інші. На UI-картках і деталях маршрут залишався, але просторовий контекст на карті втрачався.

## Виправлення

Site PR #13, commit `7e704142bd6ad07ae544e78bd569fa29718ced62`:

- Production MapLibre source тепер залишає всю геометрію сегментів.
- Вибраний сегмент має `selected=true`; інші мають `dimmed=true` та зберігають свої кольори виду транспорту.
- Список зупинок лишається сфокусованим на активному сегменті; невідомий ID не показує випадковий сегмент.
- Діагностичні атрибути відображають selected/dimmed/hidden counts.
- E2E перевіряє один активний, два приглушені й нуль прихованих сегментів на тестовому мультимодальному маршруті.

## Докази Site

- `npm run check:production`: typecheck, E2E typecheck, lint, **124/124 unit**, production build, bundle gate та **12/12 Playwright** на Chromium, Firefox і WebKit.
- Після додавання count-assertions: map focus unit **4/4** та focused Chromium E2E **1/1**.
- Hosted exact-head workflows `39355497894`, `39355501509`, `39355501591` PASS. Останній включив browser acceptance проти production build та immutable build artifact.
- Робоче середовище було Node 25.4.0 при вимозі Site Node 24.21.0; hosted workflow використовує оголошене середовище.

## Докази iOS sync

iOS PR #8 commit `fc603e5b07d818b9d9577355449a58d7b1e0cf1e` тепер жорстко перевіряє Site SHA `7e704142bd6ad07ae544e78bd569fa29718ced62`. Hosted run `39355771601` PASS: checkout exact Site SHA, Site production build, Capacitor sync, Simulator compilation. Це не фізичний iPhone, TestFlight/App Store, live API sign-in, GPS field test чи push acceptance.

## Release status і наступний крок

Site PR #13 та iOS PR #8 лишаються OPEN/unmerged. Server PR #19 і #20 є двома sibling branches від Server PR #17; однієї інтегрованої Server версії поки немає. RC.4 manifest посилається на попередні Site/iOS SHA і не є актуальним узгодженим tuple. Production/staging не підтверджені; release лишається `NOT_RELEASED`.

Наступне: звести Server #19/#20 у reviewed integration candidate без force-push, зафіксувати спільні SHA, а потім staging acceptance й rollout gate.
