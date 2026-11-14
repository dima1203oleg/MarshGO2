# Server: компактний GTFS-граф і production image — 2026-10-22

## Зміна

- Server PR #28 `https://github.com/dima1203oleg/MarshGO-Server/pull/28`, branch `codex/gtfs-compact-edge-retention-20261022`, commit `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe`.
- База — PR #27 commit `30fa1cfa52621e7ed4ca47ad61794711ac484e62`; PR #28 треба зливати після #27.
- `findGtfsItinerariesWithStats` тепер тримає компактні stop-pair кандидати та створює повні `GtfsDirectJourney` тільки після bounded retention. Розклад, transfer rules, provider IDs, fare semantics, геометрію та кінцеву форму результатів збережено.
- Сценарій створення COMMUNITY handoff більше не залежить від випадкової пари автобус/трамвай у мінливому зовнішньому львівському розкладі. Для саме цього контрактного сценарію використовується контрольний fixture з реальним 300+ м пішохідним переходом і наступним трамваєм; live-перевірка міського GTFS залишилася окремо.
- Додано production Dockerfile для канонічного Server, `.dockerignore`, production dependency install, non-root runtime, readiness healthcheck та CI build/runtime smoke.
- Транзитивний `ip-address` оновлено у lockfile з вразливої версії до виправленої; це не змінює range у `package.json`.

## Докази

| Перевірка | Результат |
|---|---|
| `npm test` на Node 24.21.0 | 296 PASS, 0 FAIL, 3 opt-in SKIP |
| `npm run test:integration` | 30 PASS, 0 FAIL, 0 SKIP на локальній PostGIS/Redis інфраструктурі |
| `npm run typecheck`, `npm run lint`, `git diff --check` | PASS |
| `npm audit --audit-level=high` | 0 знайдених вразливостей; production-only audit також 0 |
| Docker production-candidate image build | PASS, приблизно 107 MB |
| Контейнерний `/readyz` | HTTP 200, `database=connected`, `realtime=connected`; запускався з локальними development/test credentials, це не production/staging acceptance |
| Exact-head GitHub CI | PASS, runs [39834123575](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39834123575) та [39834145330](https://github.com/dima1203oleg/MarshGO-Server/actions/runs/39834145330), включно з npm audit, full unit, міграціями, PostGIS/Redis integration, Docker image build і image runtime smoke |
| Base/candidate Lviv replay, той самий локальний фід і запит | Однакові 100 itinerary outputs; базовий і кандидат лишають `searchTruncated=true`. Один прохід був ~2475 ms проти ~2275 ms; це не повторний benchmark і не доказ зниження peak RAM |

Початковий integration run падав і на незміненому base SHA #27: тест вимагав конкретну зупинкову пару з поточного зовнішнього feed. Після переведення транзакційної композиції на deterministic fixture повний integration suite пройшов; вимоги до live Lviv route geometry та multimodal search лишились окремими перевірками.

## Що далі

1. Продовжити наступний алгоритмічний етап пошуку: поточний Lviv OD усе ще чесно позначений як truncated. Не знімати caps навмання; довести recall і FASTEST/CHEAPEST/BALANCED winners на tiny-feed oracle, потім повторити frozen-city replay.
2. Перевірити, що release/orchestration використовує саме новий Server image.
3. `NOT_RELEASED` лишається: немає підтвердженого staging/production deployment target, production secrets/config, HTTPS smoke, backup/restore/rollback acceptance, актуального погодженого screenshot baseline для Site та physical iPhone/live external-provider acceptance.
