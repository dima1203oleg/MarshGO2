# Release materialization і browser compatibility — 2026-10-23

## Що перевірено

- Production bundle з release manifest: Server `d83fa585e866265e83ccc3e5e0ba5d2a8c59ecfe`, Site `1d2aaa012b88519273eae7a2b8d703ec32c212f6`.
- `npm run check:production` у поточному MarshGO checkout: typecheck, lint, 256 unit tests PASS / 0 FAIL / 1 opt-in SKIP, Vite production build і bundle budget PASS.
- `npm run test:browser-compat`: Chromium 2/2, Firefox 2/2, WebKit 2/2; загалом **6/6 PASS**. Покрито login/home/search на viewport 320–1920 px і взаємодію карти, сегментів і нижньої панелі зі світлою/темною темами.
- Exact Server PR #29 commit `e21536d5f97e7876aae0a360ed3ff4126ba5c78c`: local typecheck/lint PASS, 296 unit PASS / 0 FAIL / 3 opt-in SKIP, 30 Postgres/PostGIS+Redis integration PASS. GitHub checks `39852917615` і `39852909626` обидва SUCCESS. PR #29 залишається OPEN/DRAFT, не злитий.

## Виправлений release-materializer blocker

Browser suite спершу не стартував: `materialize-release.mjs` навмисно генерує tracked `.dockerignore` у pinned Server checkout, але `assertMaterializedWorktreeClean` дозволяв лише untracked generated files. Додатково `git()` застосовував `.trim()` до porcelain `git status` і знімав початковий пробіл зі статусу ` M`.

Виправлення:

- дозволяти лише unstaged ` M` і untracked `??` у точних generated paths;
- staged зміни, видалення та сторонні файли відхиляються;
- зберігати leading spaces stdout лише для porcelain `git status`.

Перевірки: `tests/materialized-worktree.test.ts` 5/5 PASS, root lint PASS, typecheck PASS. Цей code fix лишається незакоміченим у root гілці `codex/production-finalization-20261014`; жодні сторонні зміни root checkout не staging-нулись.

## Обмеження й висновок

- Browser acceptance відтворює release manifest Server #28 + Site #15; новіший Server PR #29 має exact CI та повний локальний API integration, але цей браузерний запуск не був на його SHA.
- Локальний Node `v26.7.0` попередив про вимогу Server `24.21.0`. Браузерний набір пройшов, але точний Node-версійний паритет із CI у цьому запуску не доведений.
- Еталонне візуальне приймання власником, staging, live-provider/commercial acceptance, фізичний iPhone/APNs/background GPS, HTTPS smoke, backup/restore/rollback і production deploy не виконані.
- Dense Lviv search і далі повертає `searchTruncated=true`; результати не можна називати повними.
- **Production status: `NOT_RELEASED`.** Локальні перевірки та hosted Server CI не є доказом deployed production.
