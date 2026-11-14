# Preserved legacy Server tests

`vehicle-country-scope.test.ts` was already in the MarshGO2 snapshot, but it
imports `hasAcceptableCountryCoverage` and `filterVehiclesToCountry` APIs that
are absent from the current canonical MarshGO-Server source. It is preserved
here for provenance and follow-up; it is intentionally outside the active
`tests/*.test.ts` and `tsconfig` globs until the country-scope behavior is
reconciled with the current provider contract. This does not claim that
country filtering is implemented or verified.
