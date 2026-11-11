# Admin and Partner button-handler audit — 2026-10-24

## Method

Parsed all `.tsx` under Admin and Partner `src/` with the repositories' installed TypeScript compiler API. For each JSX `<button>`, checked for a direct `onClick` handler or an implicit/explicit submit inside a `<form>`. This is a static source audit; it does not execute the controls or prove API success.

## Results

- Admin exact head `13f4791d627badb1cfa89247a8a668b4429ecd14`: 20 buttons; 0 without a click or form submit handler. The previously inert notifications control was removed.
- Partner exact head `9a90b8833d0dc031b307d00e558ab78a251451fe`: 23 buttons; 0 without a click or form submit handler. The previously inert integration-row control was removed.
- Both scans exited 0. Their exact-head hosted Verify workflows passed: Admin `40125895481`, Partner `40126076348`.

## Limits

An event handler can still lead to a failed request, unauthorized action, or no visible state change. Authenticated Admin/Partner page workflows, API mutations, org/tenant isolation and real error/retry paths remain NOT_TESTED. Existing test suites are only 2 Admin and 3 Partner unit tests; static handler presence is not a substitute for end-to-end acceptance.
