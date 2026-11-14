# Профіль етапів пошуку GTFS — 2026-10-23

## Метод

- Чистий Server PR #30 candidate SHA `14b3abfa29baa90b84d4d0d9d61b51604dac7f1d`; код не змінювався.
- Локальний production parser і той самий frozen Lviv snapshot, SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.
- Контрольний запит Малого Голоска → Сихів: 23 жовтня 2026, 08:00–08:30 Europe/Kyiv, максимум 2 пересадки, access/egress/transfer 900/1000/400 м, горизонт 6 годин, ліміт 100 результатів.
- Runtime Node `v25.4.0`; одне read-only діагностичне виконання з `MARSHGO_GTFS_SEARCH_DEBUG=1`. Це профіль одного запиту, не pinned Node 24 benchmark, не live service level і не staging/production acceptance.
- Frozen-feed SHA, OD та параметри відповідають audit 84. Ordered itinerary digest повторився точно: `698e0e7538b5f0b9c0645ffdffd75be039ef921a2ebb79feb928237b29b6dd6f`.

## Лічильники

| Етап / показник | Спостереження |
|---|---:|
| Вибір access/egress stop-ів | 27 / 25 stop-ів; ~11 ms |
| Corridor / interchange stops | 423 / 814; ~189 ms від початку |
| Candidate segment graph | 99,054 з бюджету 100,000; оцінений попит 415,997; ~1,382 ms від початку |
| Budget поведінка | 70 route groups мають кандидатів; 41 на budget; 3 впираються в per-route cap; 946 глобальних слотів незаповнені через групування; 6,522 overflow-кандидати |
| Reachability index | 360 transfer states, 358 reachable stops; ~1,558 ms від початку |
| Itinerary expansion/ranking | 531 first legs, 101,827 search steps, 1,625 candidate results; 757 дволегових та 808 трилегових; ~2,560 ms від початку |
| Sample fill | step limit 1,000,000 не досягнутий; result limit 100; objective reservoirs уперше насичені приблизно на кроці 25,311 (2 legs) і 76,827 (3 legs) |
| Повернені результати | 100; digest збігається з базовим; `candidateGraphTruncated`, `searchBudgetTruncated`, `candidateSamplingTruncated`, `resultLimitReached` усі true |

## Висновок для наступної реалізації

Вузьке місце для якості — це не лише CPU часу генерації. Graph sampling втрачає потенційні transfer legs **до** пошуку, а candidate/objective reservoirs також позначають truncation при 101,827 кроках — задовго до жорсткого step ceiling. Тому не слід просто збільшувати межу кроків чи перебирати всі зупинки ліниво: попередній lazy-прототип уже показав, що так можна спалити CPU/heap і змінити winners без приросту повноти.

Наступний прототип має показувати окремі контрольовані результати для двох причин обрізання: (1) які feasible stop-pair/event edges втрачаються через graph retention; (2) які вже збережені feasible itinerary labels відсікаються через candidate reservoirs. Для кожного потрібна невелика еквівалентність з exhaustive oracle, ті самі три frozen OD, незмінні baseline winners, звіт по route-chain/unique-chain recall, часу, heap/RSS і чесні truncation flags. До проходження цих критеріїв production search лишається partial.
