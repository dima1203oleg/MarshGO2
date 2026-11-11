# ТЗ DESIGN-MOTION-1 — MARSHGO Web/PWA: дизайн і анімація кожної сторінки

Дата: 2026-11-04. Виконавець: Antigravity (агент Argon). Мова звіту й коду/коментарів: українська.
Статус продукту: NOT_RELEASED. Готовність закривається скриншотом і числом тестів, не твердженням.

---

## 0. Твоя роль і твої межі

Ти робиш візуальну та анімаційну частину редизайну канонічного PWA.

Ти НЕ робиш:
- бізнес-логіку, маршрутизацію, тарифи, API, контракт даних;
- постачання теми (`src/services/theme.ts`, `index.html`) — це інший агент, трек THEME-PERSIST-1;
- карту й модель маршруту (`src/map/**`, `src/components/MapPointPicker.tsx`) — там інший агент;
- злиття в `main`, правки `codex/*`, `git reset --hard`, `git clean`, force-push, `git add -A`;
- реліз і деплой.

Знайшов функціональний дефект (брехлива ціна, зник сценарій, ламаються дані) — не фікси в межах цього ТЗ. Внеси окремим пунктом в опис PR з файлом і рядом. Це принципова дисципліна: два агенти в одному файлі = конфлікт і втрачена робота.

---

## 1. Де працювати і що прочитати першим

Канонічний UI-репозиторій: `/Users/dima1203/Desktop/MarshGO/MarshGO-Site`

Не існує для тебе: `MarshGO2`. Не правити UI в `/Users/dima1203/Desktop/MarshGO/src/` (заморожена стара копія).

Прочитати до будь-якої правки (порядок обов'язковий):
1. `/Users/dima1203/Desktop/MarshGO/.qoder/rules/production-readiness.md` — контракт проєкту.
2. `/Users/dima1203/Desktop/MarshGO/AGENTS.md` — де що живе.
3. Навички в `/Users/dima1203/Desktop/MarshGO/.agents/skills/`:
   - `marshgo-design-system/SKILL.md` — токени, поверхні, три сині, тап-таргети;
   - `marshgo-motion-engine/SKILL.md` — тривалості, їзінги, утиліти, reduced-motion;
   - `marshgo-web-ux/SKILL.md` — сценарії PWA;
   - `marshgo-map-motion/SKILL.md` — якщо зачіпаєш координацію шита з камерою.
4. Референсні кадри (еталон, а не ідею):
   - `/Users/dima1203/Desktop/MarshGO/docs/design/canonical/marshgo-premium-3-0-board.png` — закрита дошка дизайну 3.0;
   - `MarshGO-Site/docs/design/canonical/route-map-bottom-sheet/` — 8 кадрів шита (light і dark-final) + `README.md`;
   - `MarshGO-Site/docs/design/canonical/journey-search-results/` — 3 кадри списків результатів;
   - `MarshGO-Site/docs/design/canonical/marshgo-light-canonical.jpg`, `marshgo-dark-canonical.jpg`.

Джерело істини по стилі: `MarshGO-Site/src/index.css` (1549 рядків). Там уже є повний реєстр токенів. Нове літеральне значення (hex, px-радіус, тривалість, z-index) без причини «в реєстрі немає відповіді» = дефект.

Карта рядків `src/index.css` (перевірено, актуально):
- 38–62 — блок `html.dark`: темні токени;
- 79–90 — `--route-*`: власна контрастна мова карти/шита;
- 131–143 — `:root` світлі токени;
- 940–942 — глобальний guard `prefers-reduced-motion`;
- 1200–1206 — їзінги й тривалості;
- 1209–1230 — `@keyframes mg-rise|mg-fade|mg-pop|mg-shimmer|mg-breathe|mg-wait`;
- 1236–1257 — утиліти `.mg-rise .mg-pop .mg-fade .mg-stagger .mg-press .mg-live-dot`;
- 1259 — `@keyframes mg-slide-down`;
- 1476–1477 — пульс GPS-пака.

---

## 2. Виміряний стан «до» (твої передові числа, не прийми на віру)

Команди для відтворення (у `MarshGO-Site`):
```
wc -l src/index.css
grep -c '!important' src/index.css
grep -rn 'text-\[10px\]' src | wc -l
grep -rn '#[0-9A-Fa-f]\{6\}' src --include='*.tsx' | wc -l
grep -rn 'style={{' src --include='*.tsx' | wc -l
grep -rn 'mg-rise\|mg-pop\|mg-fade\|mg-stagger' src --include='*.tsx' | wc -l
grep -rno 'duration-[0-9]*' src --include='*.tsx' | cut -d: -f3 | sort | uniq -c
```

Заміряно 2026-11-04:
- `src/index.css`: 1549 рядків, 184 `!important`;
- 235 входжень `text-[10px]` у `src/`;
- 992 літеральних hex у `.tsx` (дублюють токени або фарбують dark-стан в обхід реєстру);
- 39 inline `style={{ ... }}`;
- 5 входжень entrance-утиліт на весь застосунок;
- 20 поза-токенних тривалостей: `duration-300` ×8, `duration-200` ×6, `duration-700` ×3, `duration-1000` ×2 (`src/components/DriverTrustBar.tsx:151`), `duration-500` ×1;
- токенів радіусів і z-index немає взагалі (`--mg-radius*`, `--mg-z*`: 0 входжень).

Твій перший PR має принести виміряне «після» по кожному рядку.

---

## 3. Токен-контракт: з чим працювати

Реальні значення (не вигадуй своїх):
- Світло (`:root`): `--mg-blue` #0877f9 · `--mg-blue-ink` #0B57A8 · `--mg-blue-tint` #EAF3FF · `--mg-action` #0B63D6 · `--mg-canvas` #f4f8fd · `--mg-line` #e5edf7 · `--mg-muted` #526477.
- Темно (`html.dark`): `--mg-blue` #1687FF · `--mg-blue-ink` #7FC0FF · `--mg-blue-tint` #0E2A44 · `--mg-action` #0B63D6 · `--mg-canvas` #0B0F14 · `--mg-surface-primary` #111820 · `--mg-surface-secondary` #16202B · `--mg-ink-primary` #F5F9FF · `--mg-ink-secondary` #B6C2D0 · `--mg-ink-muted` #8FA0B3 · `--mg-border-subtle` #263648 · `--mg-border-medium` #536B86 · `--mg-muted` #B6C2D0.

Три сині, три ролі (міняти місцями заборонено):
- `--mg-blue` — штрихи, іконки, великий текст;
- `--mg-blue-ink` — дрібний текст на поверхні, має тримати AA на `--mg-blue-tint`;
- `--mg-action` — залива контрол, який несе білий текст.

Поверхні: `--mg-canvas`, `--mg-surface-primary/secondary/tint`, `--mg-surface-glass` (тільки прозорий хром). Лінії: `--mg-border-subtle`, `--mg-border-medium`, `--mg-line`.

Шит маршруту й карта несуть локальний набір `--route-*` (рядок 79–90) — не виноси його в глобальні токени, він свідомо ізольований, щоб картка над темною(map-поверхнею) мала власний контракт.

Що треба створити у цьому ТЗ (Wave 1), значення взяти з фактичного вживання в коді:
```
:root {
  --mg-radius-control: 16px;   /* кнопки 14-18 за спекою */
  --mg-radius-card: 18px;      /* картки 16-18 */
  --mg-radius-sheet: 24px;     /* шити й bottom-sheet 22-26 */
  --mg-radius-pill: 999px;
  --mg-z-chrome: 30;   /* tabbar (вирізано з inline z-30) */
  --mg-z-sheet: 40;    /* меню «Створити» z-40 */
  --mg-z-overlay: 55;  /* сповіщення z-[55] */
  --mg-z-modal: 65;    /* фільтри транспорту z-[65] */
  --mg-shadow-card: /* one restrained elevation, light and dark variants */;
  --mg-shadow-sheet: /* reuse the existing sheet shadow idea from --route-sheet-shadow */;
  --mg-stagger-step: 55ms;     /* зараз захардкожено в index.css:1240 */
}
```
Правило: новий токен існує лише тоді, коли він прибирає хоча б 3 літерали. Інакше не плодь реєстр.

---

## 4. Анімаційний контракт (анімація: що можна і чого не можна)

1. Анімувати лише `transform` і `opacity`. `height`/`width`/`top` — виключно шит маршруту.
2. Тривалість і cubic-bezier лише з токенів: `--mg-dur-tap` 120 ms (тактильний фідбек), `--mg-dur-fast` 180 ms (ховер, прес, чіп), `--mg-dur-base` 260 ms (поява панелей, перемикач сегментів), `--mg-dur-slow` 420 ms (entrance екрана й карток). Їзінги: `--mg-ease-standard` (.32,.72,0,1) для станів, `--mg-ease-entrance` (.16,.84,.28,1) для входів, `--mg-ease-exit` (.4,0,1,1) для виходів.
3. Кожна анімація має відповідати на питання «навіщо»: зміна стану, безперервність або фідбек. Амбієнтний фоновий рух — відхиляється за проєктним правилом.
4. Під час drag-жесту шит примусово `transition: none` (механіка в `src/views/JourneyRouteMapScreen.tsx:331-385`). Не «поліпшуй» це анімацією — жест стане незавершеним і лагатиме.
5. Reduced-motion: глобальний guard у `src/index.css:940-942` має вигравати. Якщо потрібен виняток — дописуй у той самий блок у файлі, а не в компоненті.
6. Кнопка/чип пресу — існуючий `.mg-press` (scale .975/.98), не роби свій `active:scale-95` з іншою тривалістю.
7. Живий статус — `.mg-live-dot` (дихання 2.4 s), очікування сабміту — `.mg-wait`. Нових нескінченних анімацій не додавати.
8. Жодних бібліотек анімації (framer-motion, GSAP, Lottie). Доведи в PR, що нативний CSS не справляється — інакше не проходе.
9. 60 FPS, P95 ≤ 25 ms під час drag, LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Вимірюй, а не заявляй (див. розділ 9).

---

## 5. Матриця переходів: що додати і де

Зараз entrance-утиліти використані 5 рази на весь застосунок. Ось повний перелік місць, де перехід фізично відсутній. Кожна позиція — окремий невеликий PR.

| # | Перехід | Тригер | Що робити | Куди вставити (перевірено) |
|---|---------|--------|-----------|-----------------------------|
| M1 | Вхід екрана | монтування route | `.mg-fade` + зсув 8 px, `--mg-dur-slow`, ease-entrance | кореневі вузли екранів: `home-screen search-screen` (`src/views/ProductionMarketplace.tsx:1568`), `src/views/HomeView.tsx`, `MyTripsView.tsx`, `ProfileView.tsx` |
| M2 | Вихід/перемикання таба | `tab` змінився | тільки opacity 120→180 ms, без «сторінкового» слайду | рендер табів у `src/views/ProductionMarketplace.tsx:1884-1886` |
| M3 | Поява картки результату | новий список | `.mg-rise .mg-stagger` з `--mg-stagger-i` (уже є для одного екрана — зроби єдиним зразком для всіх) | зразок: `src/views/JourneyResultsPanel.tsx:192-193`; відсутньо в `src/views/MyTripsView.tsx`, `DemandDetailView.tsx`, `OfferDetailView.tsx`, `MessagesView.tsx` |
| M4 | Вибір картки | `data-chosen` | `transform` + рамка, `--mg-dur-fast`; без зміни висоти (щоб сусіди не стрибали, CLS) | `src/views/JourneyResultsPanel.tsx`, стилі `.journey-result-card[data-chosen="true"]` (`src/index.css:329`) |
| M5 | Розгорнення деталей плеча | tap по сегменту | ease-standard 260 ms opacity + translateY; висота лише всередині шита | `src/views/JourneyRouteMapScreen.tsx` (лист), `src/design-system/journey/CanonicalRouteLip.tsx` |
| M6 | Сегмент «вид транспорту» | press у сегмент-контролі | ковзання індикатора `--mg-dur-fast`; не анімувати фон усієї панелі | `src/components/ThemeToggle.tsx` (варіант segmented) як зразок і `TransportTypesPanel` |
| M7 | Діалог/оверлей | open/close | вхід `.mg-rise`, вихід ease-exit 180 ms; scrim тільки opacity | `src/views/ProductionMarketplace.tsx:1837` (швидкі дії), блок фільтрів транспорту `:1888`, сповіщення `:1890`, `src/components/DepartureDateTimePicker.tsx` |
| M8 | Банер офлайну/помилки | зміна статусу | `.mg-fade` + `role="status"`, без руху макета | зразок уже є: `src/views/ProductionMarketplace.tsx:1875` |
| M9 | Скелетон → дані | перший відповідь | `mg-shimmer` лише на завантаження, при заміні — stagger 1 крок | `HomeHero`/`JourneyResultsPanel`/`MyTripsView` де зараз голий текст «Завантажуємо…» |
| M10 | GPS-пак | живі дані | існуючий пульс `src/index.css:1476` — не чіпати, лише перевірити що він не анімує layout | — |

Обов'язково: для кожного переходу в PR вкажи, який із трьох сенсів він несе (стан / безперервність / фідбек). Без цього — не приймається.

---

## 6. Хвилі робіт (порядок незмінний)

Wave 0 — план. Не код. Файл-план у PR з таблицею «Сторінка → Файл → Що змінити → Тест → Ризик». Очікуй погодження власника: спека PREMIUM прямо забороняє масові правки до погодження.

Wave 1 — фундамент токенів. Додати `--mg-radius-*`, `--mg-z-*`, `--mg-shadow-*`, `--mg-stagger-step`; замінити в `index.css` і викликах відповідні літерали (радіуси 22/1.6/1.7 rem, z-30/40/[55]/[65], 55 ms). Прибрати 20 поза-токенних `duration-*`. Обсяг: ≤ 8 файлів.

Wave 2 — моушн-система. M1–M9 з матриці. Обсяг: 1 хвиля = 2–4 переходи, не всі одразу.

Wave 3 — сторінки. Таблиця розділу 7, по 1–2 екрани на PR.

Wave 4 — борг. Зменшення `!important` (184) і dark-літералів (992 hex у `.tsx`) через заміну в місцях виклику на токени, а не через нові селектори з `!important`. Дозволено зменшити, заборонено збільшити.

---

## 7. Сторінка за сторінкою (23 view-файли, перевірено `ls src/views`)

Канонічна п'ятірка та навігація:
1. `views/HomeView.tsx` + `views/HomeHero.tsx:129` — картки дій (`home-action-card`, зараз `rounded-[22px]`, `min-h-[112px]`): привести радіус до `--mg-radius-card`, витримати ієрархію (місто/напрямок читабельні, див. відкриту задачу HOME-PILLAR-1 — не змінюй дані, тільки типографіку й відступ), entrance за M1, прес за M6. Прибрати `text-[10px]` з усього, що не є мікропідписом.
2. `views/SearchView.tsx` + `views/ProductionMarketplace.tsx:1568` (`home-screen search-screen`) — картка пошуку: компактніше без втрати читабельності (рядки місця вже виправлені іншим агентом у `d7e0b39`, не відкочуй), додай стан фокус-контрасту `focus-visible:outline-2` у `--mg-blue` на всіх контролах, сегмент «Пішки» лишається сегментом, не 13-ю категорією.
3. `views/JourneyResultsPanel.tsx` — лист результатів: 4 рядки картки, один блок сортування, стан вибраної картки M4, stagger M3; не чіпай логіку цін і підписів (це мій трек).
4. `views/JourneyRouteMapScreen.tsx` — карта + шит: 4 снапи ВЖЕ існують (`src/views/routeSheet.ts:1-4`: `collapsed | half | expanded | full-itinerary`, висоти `:13-19`). Твоє завдання — не «робити чотири стани», а: плавність M5, компактність листа, щоб заголовки не зникали під safe-area (`env(safe-area-inset-bottom)`, не фіксований padding), і щоб жоден snap не робив remount MapLibre (механіка drag у `:331-385` — не зачіпай без погодження).
5. `views/MyTripsView.tsx` — «Мої поїздки»: найслабший екран. Компактні рядки, M3-stagger, стан порожньо/помилка з людською українською, прибери `text-[10px]` з дат; не вигадувати статусів яких немає в даних.
6. `views/ProfileView.tsx` + `views/ProfileSections.tsx` — секції, 44 px тап-таргети, `ThemeToggle` segmented уже є (`components/ThemeToggle.tsx`) — не перемалювати логіку теми.
7. `views/NavigationView.tsx` + `views/ProductionNavigation.tsx` — навігація: тут шит нині трирівневий (`src/navigation/navigationSheet.ts:1` = `collapsed | partial | expanded`), а за спекою треба чотири позиції. Це суттєва зміна поведінки: зроби окремим PR з планом і не чіпай супровід камери без `marshgo-map-motion`. Додати: тактильний фідбек пресу, M9 для черги підказок. Текстові стани («Лише розклад», «Немає GPS») пише інший агент — не перевизначай їх.

Водійський трек:
8. `views/DriverDashboardView.tsx` — зведення, KPI-картки з `--mg-surface-*`, жодного `duration-1000` (`components/DriverTrustBar.tsx:151` → `--mg-dur-slow`).
9. `views/DriverRequestsView.tsx`, `DriverOfferNewView.tsx`, `DriverVehicleView.tsx` — форми: стан валідації, disabled, M7 для шитів вибору.

Попутки й запити:
10. `views/DemandNewView.tsx`, `DemandDetailView.tsx`, `OfferDetailView.tsx`, `views/OfferRoutePreview.tsx` — preview-картки, M3.

Решта:
11. `views/MessagesView.tsx` — рядки чату, без нескінченних анімацій.
12. `views/TransportMapView.tsx` — карта зупинок; тільки хром і легенда, `src/map/**` не чіпати.
13. `views/AdminView.tsx`, `views/MobilityAdminPanel.tsx` — утилітарні, компактність і таблиці; преміум-декор тут зайвий.
14. `views/JourneyResultsPanel.tsx`/`HomeHero.tsx` дублікатів не створюй: нові примітиви лише в `src/design-system/**`, якщо вже є така папка (`src/design-system/journey/CanonicalRouteLip.tsx` існує).

Спільні вимоги до кожного екрана:
- Темна тема — повноцінний стан, а не другорядний: жодного стану, де текст із `--mg-ink-secondary` сідає на `--mg-surface-secondary` нижче 4.5:1. Перевіряти обидві теми, а не одну.
- Тап-таргет 44 px (`min-h-11` / `h-11 w-11`).
- Safe-area тільки через `env(safe-area-inset-bottom/top)`.
- Мінімальний шрифт: 12 px для будь-чого, що не є мікропідписом; 235 `text-[10px]` звести до одиничних випадків і виправдати в PR.
- Жодного технічного діагностичного тексту в UI (коди станів, `partialReasons`, JSON-подібні рядки) — але й не видаляй чесні пояснення («Пунктиром позначені орієнтовні піші відрізки», «Тариф невідомий»).

---

## 8. Конфлікт-склада (ці файли зараз мої — не чіпай)

- `src/services/theme.ts`, `index.html` (boot shell) — THEME-PERSIST-1;
- `src/map/**` (включно `mapConfig.ts`, `map/style/themeStyles.ts`, `journeyRouteModel.ts`, `MapAdapter.ts`, `MapLibreAdapter.ts`) — DARK-BASEMAP-1, WALK-GEOMETRY-HONESTY-1;
- `src/components/MapPointPicker.tsx`;
- `src/views/journeyResultPresentation.ts`, `src/views/journeyLegLabel.ts` — чесність цін і підписів;
- `src/index.css` рядки 79–90 (`--route-*`) — без погодження не переозначай;
- будь-що в `MarshGO-Server/**`.

Зона перетину — `src/index.css` і `src/views/ProductionMarketplace.tsx`. Домовленість: поки ти працюєш хвилю, я в `src/index.css` не пишу. Якщо обидва потрібні файл — один із вас ставить у PR мітку `BLOCKED-ON: <інший PR>` і чекає.

---

## 9. Перевірка (твій тест-контракт)

Обов'язковий гейт після кожної правки в `MarshGO-Site`:
```
npm run typecheck && npm run lint:all && npm test && npm run build && npm run check:bundle
```
Критично: `tests/canonical-design.test.ts` перевіряє текстові рядки вихідних файлів і `index.html` (приклад — твердження про boot-shell на рядку 345). Тому перейменування класів/рядків у CSS і TSX може зламати тест, який не бачить браузера. Запускати `npm test` обов'язково після кожної хвилі, а не тільки «візуально подивитись».

Візуальна процедура (обов'язково живий браузер, не уяви):
1. Viewports: 320×568, 360×640, 390×844, 430×932.
2. Кожна сторінка × (light, dark) × (до, після) = кадри; збережи у `/tmp/mg-argon/<screen>-<theme>-<before|after>.png`.
3. Прогнати сценарій: вхід → пошук → результати → вибір картки → шит → навігація; перевірити що анімація не блокує жоден крок і що при `prefers-reduced-motion: reduce` усе нерухоме.
4. Продуктивність: зняти гістограму frame-time під час drag шита й анімації списку (requestAnimationFrame-петля або Performance/longtask через DevTools); повідомити реальні числа FPS і P95. Не виміряв — пиши NOT_TESTED, не «має бути 60».
5. Нові юніт-кейси (у `tests/`, формат `node:test` + `assert/strict`): (а) жодного `duration-` поза токеном у `.tsx`; (б) `--mg-radius-*`/`--mg-z-*` визначені й використовані; (в) кожен новий entrance-клас присутній у `index.css` і захищений reduced-motion.

---

## 10. Формат PR і звітність

- Гілка `antigravity/design-motion-<wave>-<short>-20261104`, worktree, base — обговорити з власником (зазвичай `main` для чергового, `qoder/*` — для стека).
- Один PR = одна хвиля = максимум ~8 файлів. Величезний PR «увесь редизайн» не приймається.
- Опис українською, таблицею: `Проблема → Файл → Причина → Вплив → Виправлення → Тест → Ризик`.
- Обов'язково: реальні SHA, реальне `passed/failed` тестів, виміряні before/after числа боргу, кадри, числа FPS/P95 або чесне NOT_TESTED.
- Обов'язковий розділ «Чого цей PR не доводить».
- Заборонено в тексті: Chinese/Japanese characters, латино-кириличні зшивки типу `темаmust`, русизми замість української термінології. Перевір перед publish: `grep -n '[а-яА-Я]'` own files, і що жодного CJK немає.
- Фінальний рядок будь-якого опису: `Продакшн — NOT_RELEASED.`

---

## 11. Критерії прийомки (готовність оголошується лише коли виконані всі)

1. Усі гейти зелені на головному checkout, тести не зменшились (зараз 273–276 pass; точне число — з твого прогону).
2. `!important` у `src/index.css` не більше, ніж 184; `text-[10px]` не більше, ніж 235; обидва — із записом зменшення в PR.
3. Кожна з 23 view-сторінок має запис: що змінено, кадри light/dark, або явний дозвіл власника пропустити.
4. Усі M1–M9 або реалізовані, або явно відхилені власником з причиною.
5. Reduced-motion перевірений уживу й працює.
6. Жодного зниклого функціонального сценарію (це незгидна вимога спеки).
7. Темна й світла теми мають однакову ієрархію й контраст; карта в темній темі лишається придатною (підокладу робить інший агент — PR #62).
8. Немає нових залежностей.
9. Немає нових літеральних hex/px-радіусів, крім випадків «реєстр не має відповіді» з обґрунтуванням.
10. Звіт у `CODEX_PROGRESS.md` + `NEXT_ACTIONS.md` (RESUME BLOCK) з фактичним SHA й числом тестів.

---

## 12. Стоп-лист (за це я відхиляю)

- Анімація висоти/ширини будь-де, окрім шита.
- Власні тривалості, власні cubic-bezier, нові keyframes без reduced-motion.
- `!important` як «швидке виправлення» теми.
- Правки в моїх файлах із розділу 8.
- Зміна текстів цін/статусів/підписів («0 грн», «немає GPS», «лише розклад») — це мій трек чесності даних.
- Знятий на відео чи заявлений без виміру FPS.
- PR на 40 файлів.
- Реліз-мови: «готово», «залито», «в продакшені».

---

## 13. Перші три кроки просто зараз

1. Прочитати розділ 1 (файли й навігація по `src/index.css`), побачити дошку `marshgo-premium-3-0-board.png` і 8 кадрів `route-map-bottom-sheet`.
2. Прогнати команди розділу 2 і записати свої числа в план-file.
3. Подати власнику план Wave 0 (таблиця + список M-переходів + які файли чіпаєш) і чекати погодження. Код — після погодження.

Кінець ТЗ.

---

## АМЕНДМЕНТ 1 (2026-11-04, після звірки зі стеком PR) — має вищу силу за розділи 3 і 7

Цей розділ скасовує три мої помилки в оригіналі ТЗ. Чітай його ПРАВОРУЧ відповідних розділів.

1. **Реєстр токенів — не мій, а з PR #48** (`qoder/premium-8-surface-2` @ `b23b838`, index.css:152–180). Моя схема `control/card/sheet 24px` і `chrome/sheet/overlay/modal` — скасована. Фактичний реєстр:
   - радіуси: `--mg-radius-sm 8` · `md 10` · `lg 16` · `xl 20` · `2xl 24` · `3xl 28` · `sheet 32` · `pill 999`;
   - z-index: `--mg-z-base 1` · `raised 2` · `control 9` · `sticky 20` · `overlay 40` · `scrim 55` · `scrim-raised 60` · `picker-scrim 65` · `map-control 70` · `map-chip 80` · `sheet 100` · `sheet-raised 120` · `lifecycle 200` · `nav-backdrop 490` · `nav-chrome 500` · `nav-sheet 510` · `modal 1000` (тобто рівні карти 490/500/510/1000 вже покриті, ніхто їх більше не додає);
   - ВАЖЛИВО: #48 написаний на лінії `main`, а твоя база `8d6e531` цих токенів НЕ має. Переносиш лише блоки визначень у `:root`, не весь PR.
   - `--mg-shadow-*` і `--mg-stagger-step` не існують у жодній лінії (перевірено `git show` на `b23b838` і `8d6e531`). Якщо додаєш — обґрунтуй видаленням ≥3 літералів. Статус-токенів транспорту (GPS/ETA/затримка) немає; `--mode-*` (17 токенів) є, не чіпай.

2. **Список сторінок у розділі 7 був неправильним.** Живий застосунок монтує `src/main.tsx` → `<ProductionMarketplace />` (перевірено в `8d6e531`). `src/App.tsx` не імпортований ніким, тому 13 його в'ю (SearchView, OfferDetailView, DemandNewView, DemandDetailView, DriverDashboardView, DriverRequestsView, DriverOfferNewView, DriverVehicleView, NavigationView, MyTripsView, MessagesView, ProfileView, AdminView) — мертвий острів; HomeView — лише острів + текстове твердження в тесті. Правити дизайн мертвих екранів заборонено.

   Живі поверхні, придатні до полірування: 12 табів усередині `ProductionMarketplace.tsx` (`home, search, map, trips, profile, chat, admin, navigation, offer-new, demand, requests, my-demands`) + окремі живі модулі: `HomeHero.tsx`, `JourneyResultsPanel.tsx`, `JourneyRouteMapScreen.tsx`, `ProfileSections.tsx`, `ProductionNavigation.tsx`, `TransportMapView.tsx`, `MobilityAdminPanel.tsx`, `OfferRoutePreview.tsx`, `components/TransportTypesPanel.tsx`, `components/DepartureDateTimePicker.tsx`, `design-system/journey/*`.

3. **Ключове правило файлу для анімацій.** Нові `@keyframes` і їх reduced-motion-винятки — у `src/styles/motion.css` (створений PR #54, `4a796a8`), а не в `index.css`: його власний коментар каже, що файл isolated саме через конфлікти навколо `index.css`. Глобальний guard `prefers-reduced-motion` лишається в `index.css` і виграє.

4. **Номери рядків `index.css` у розділі 1 — лише для лінії `8d6e531`.** У `main` це 2006 рядків / 201 `!important`, у `b23b838` — 2131 / 41, у `8d6e531` — 1549 / 199. Орієнтуйся на імена токенів і селекторів, не на номери рядків.

5. **Чотири позиції шита.** Карта-шит у твоїй базі має 4 снапи (`routeSheet.ts`: `collapsed | half | expanded | full-itinerary`), а PR #46 на лінії `release-integration` перепиcав той самий файл на 3 (`collapsed | half | expanded`). Шит навігації — 3 (`navigationSheet.ts`). Перехід навігаційного шита на 4 позиції = мій трек (чипає камеру й стан), твоя частина — візуальне оформлення й снап-показ. Це підтверджений конфлікт: `routeSheet.ts` і `JourneyRouteMapScreen.tsx` правимо по черзі, не одночасно.
