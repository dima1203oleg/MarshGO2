# KiwiTaxi integration status

## Implemented foundation

- Server-only client for the documented TSV catalog endpoints: URL domains, currencies, countries, regions, place types, places, routes, vehicle classes, and transfers.
- Incremental UTF-8 TSV parsing with BOM and CRLF support, `\\N` nulls, arbitrary locale columns, row/size bounds, and fail-closed schema errors.
- Request options for `payment_type` on transfer data and `white_label=1` on route data.
- Affiliate URL construction that requires `KIWITAXI_AFFILIATE_ID`, validates the selected KiwiTaxi HTTPS host, preserves query/fragment values, and adds `pap`.
- No catalog row is treated as live availability, a confirmed quote, routed road geometry, or a booking. The adapter is not yet emitting `ProviderOption`s into journey search.

## Configuration

Set these values only in the server environment or secret manager. Do not use `VITE_*` variables or commit actual values:

- `KIWITAXI_SECURITY_TOKEN` — current partner token for TSV requests.
- `KIWITAXI_AFFILIATE_ID` — approved affiliate ID for links.
- `KIWITAXI_BASE_URL` — optional, restricted to `https://kiwitaxi.com` or `https://kiwitaxi.ru`.
- `KIWITAXI_REQUEST_TIMEOUT_MS` — optional per-feed timeout; live smoke defaults to five minutes because catalogs are unfiltered and may be large.

Run `npm run acceptance:kiwitaxi-catalog` to fetch and count all catalog entities. It fails closed if the security token is missing, prints only entity counts, and never prints request URLs or response data. Transfers are requested with `payment_type=partial`; this is a catalog choice, not confirmation that the price is final.

## Current integration boundary

The CSV model supplies route/place IDs, names, polygons, approximate distance/time, and catalog transfer prices. It does not supply a verified coordinate for every pickup/dropoff, a current quote, vehicle availability for a selected date, or a booking confirmation. Therefore journey search must not fabricate a transfer leg from CSV rows alone. Before route-search integration, implement and verify polygon decoding and PostGIS matching, provider terms/license, price freshness, directed route policy, and a current quote/handoff flow. A generated affiliate deep link is a handoff, not a booking.

### Read-only live verification (19 October 2026)

The official published shared read-only token was extracted at runtime from KiwiTaxi's API instructions and was not written to disk or logged. All nine CSV endpoints responded successfully in sequence. Counts observed: 7 URL domains, 35 currencies, 224 countries, 1,461 regions, 5 place types, 32,132 places, 151,785 routes, 14 transfer types, and 811,710 transfers for `payment_type=partial`. The domain catalog lists `en`, `ru`, `de`, `es`, `fr`, `pt`, and `pl`; the domain values can contain a locale path such as `/en`.

This proves that the documented shared read-only catalog interface was reachable during that check. It does not prove use rights for a commercial product, a unique partner account, quote freshness, affiliate attribution, a bookable offer, or booking API access. `KIWITAXI_AFFILIATE_ID` remains unset, so no commission-attributed link could be verified. Data was counted in memory only and was not imported into the application database.

## Source

The provider's [CSV API instructions](https://kiwitaxi.com/en/partner/webmaster/instructions/api/) document the tab-separated export, `\\N` null marker, security token, endpoint family, payment type, and `pap` affiliate parameter. Confirm current partner credentials, usage rights, and service terms before enabling this integration for users.
