# User mockup visual acceptance — 2026-10-25

## Evidence reviewed

Current fixture snapshots reviewed from the exact Site browser suite:

- `e2e/journey-route-map.spec.ts-snapshots/journey-results-light-darwin.png`
- `e2e/journey-route-map.spec.ts-snapshots/journey-route-map-light-collapsed-darwin.png`
- `e2e/journey-route-map.spec.ts-snapshots/journey-route-map-light-half-darwin.png`
- `e2e/journey-route-map.spec.ts-snapshots/journey-route-details-light-expanded-darwin.png`
- `e2e/journey-route-map.spec.ts-snapshots/journey-route-map-dark-half-darwin.png`
- `e2e/journey-route-map.spec.ts-snapshots/navigation-light-route-darwin.png`
- `e2e/journey-route-map.spec.ts-snapshots/transport-map-layers-light-darwin.png`

The changed layer-sheet screenshot was reviewed after the control-fit fix. The full browser suite verifies route selection, sheet states, segment focus, the two color themes, search cards, and navigation fixtures.

## Comparison to the ten supplied mockups

| Mockup state | Current evidence | Visual/functional assessment |
|---|---|---|
| Dark active navigation with rich satellite imagery | `navigation-light-route-darwin.png` | NOT_ACCEPTED: current fixture shows schematic placeholder tiles, not the detailed satellite map/landmarks from the mock. Current navigation capture is light themed. |
| Dark transport map with expanded layers | `transport-map-layers-light-darwin.png` | PARTIAL: section hierarchy and all controls fit above global nav; rendering is light with schematic tiles, data-dependent toggles are honestly unavailable, and it does not match the supplied dark satellite composition. |
| Active navigation compact bottom card | `navigation-light-route-darwin.png` | PARTIAL: maneuver, ETA/distance and global nav appear; actual map layer/style and supplied dark visual remain unmatched. |
| Live rideshare route and offer card | Current rendezvous E2E covers consented participant locations and straight-line distance | NOT_ACCEPTED: no production live-car route, updated GPS ETA, driver/vehicle-rich map composition, or exact screenshot evidence. |
| Multimodal results with expanded stop timeline | `journey-route-details-light-expanded-darwin.png` | PARTIAL: ordered segments and stop details render in fixtures; map imagery and exact lower-sheet/card composition differ. |
| Selected rideshare result | Journey result fixture plus Community booking E2E | NOT_ACCEPTED visually: booking flow works against fixture/local API, but the supplied selected-car/driver/vehicle detail composition and live approach are not accepted. |
| Rideshare pickup approach | Rendezvous consent tests | NOT_ACCEPTED: consent and location pins are tested; continuous car route/progress/ETA is not. |
| Live bus focused route with approaching vehicles | Segment-focus fixture and route-map E2E | NOT_ACCEPTED: selected route focus works, but no confirmed current vehicle fleet/live motion/real ETA is shown in this local fixture. |
| Dark multimodal route details | `journey-route-map-dark-half-darwin.png` | PARTIAL: dark theme, segment colors and route details render; background is synthetic and differs substantially from the reference. |
| Repeated dark route reference | Same dark route fixture | Same limits as above; no separate full visual acceptance. |

## Conclusion

The exact current implementation has local fixture evidence for the responsive route sheet and several light/dark states. It does **not** match all ten supplied mockups closely enough to claim visual acceptance. The decisive visual gap is the map: current screenshots show synthetic vector/schematic roads, while the references depend on detailed satellite/road styles, labels and landmarks. Live vehicle states in two references also require current, authorized provider/GPS data; they cannot be represented honestly by fixture markers.

No complete 10-image matched-state visual-regression set has been accepted. The approved immutable map-style manifest and exact live-data-backed screenshot fixtures are external blockers. Production remains `NOT_RELEASED`; `production_ready=false`.
