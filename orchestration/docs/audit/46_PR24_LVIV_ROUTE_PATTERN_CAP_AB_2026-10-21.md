# Lviv route-pattern stop cap A/B — rejected

Date: 2026-10-21 (Europe/Kyiv)  
Server code baseline: PR #24 exact SHA `27ca486d66fa9b30b8559e4b1041ccca67f1d283`  
Feed: official Lviv static GTFS URL `https://track.ua-gis.com/gtfs/lviv/static.zip`; downloaded archive SHA-256 `bb4ac0ce9127b4967ad889379f523b04b84a0bb033814aa8c844526b42078164`.

## Source verification

The URL is listed in the Server Ukrainian provider catalog as Lvivavtodor static GTFS. The official data.gov.ua dataset page exposes the corresponding static archive and the realtime VehiclePositions endpoint, but currently labels the dataset **“Not updated”**; the resource page says its reported last update is 2025-01-09. The live `static.zip` responded HTTP 200 with `Last-Modified: 2026-10-12 14:20:46 GMT`, size 3,755,976 bytes. The current download hash exactly matches the frozen snapshot used by previous PR #24 experiments. Attribution/ reuse terms are documented on the official dataset page; do not infer realtime feed freshness from the static archive timestamp.

Sources: [official data.gov.ua dataset](https://data.gov.ua/en/dataset/lviv-public-transport-gtfs-real-time), [static GTFS archive](https://track.ua-gis.com/gtfs/lviv/static.zip), [GTFS-Realtime VehiclePositions resource](https://data.gov.ua/en/dataset/lviv-public-transport-gtfs-real-time/resource/d45fd95a-ffc9-45b1-be05-52012707d51f).

## Method

Replayed one fixed corridor, Малоголосківська→Сихів, on 2026-10-22 08:00–08:30 local time, using the same GTFS ZIP and the exact Server PR #24 source. Compared committed `MAX_STOPS_PER_ROUTE_PATTERN = 8` with an isolated temporary worktree experiment at 12. Each setting ran three independent Node processes. The installed runtime was Node 25.4.0, not the pinned Server release runtime Node 24.21.0, so timings are diagnostic only. The experiment changed no official branch or commit.

## Results

| Setting | Returned | Unique route-name chains | Truncation | Median search time | Median process RSS |
|---|---:|---:|---|---:|---:|
| Cap 8 | 100 | 37 | `searchTruncated=true`, `candidateGraphTruncated=true` | 3,496 ms | about 825 MB |
| Cap 12 | 100 | 37 | `searchTruncated=true`, `candidateGraphTruncated=true` | 3,493 ms | about 826 MB |

Both settings selected the same FASTEST/CHEAPEST/BALANCED winner: a 69-minute BUS→TRAM journey, known fare 2,300 minor units, one transfer. The medians and RSS are effectively unchanged; route coverage and truncation did not improve.

## Decision

Reject cap 12 and keep the production constant at 8. Increasing the cap for this corridor adds resource cost without observable route recall. This one-corridor replay does not establish five-corridor recall, staging or live-service acceptance. The original search remains explicitly partial; do not remove its truncation indication.

Next investigation: isolate which stage dominates the current `candidateGraphTruncated` and `candidateSamplingTruncated` flags on the five fixed corridors, then optimize graph demand allocation or candidate exploration only when an exhaustive tiny-feed oracle proves equivalence and repeated Lviv runs show added feasible route recall within a stated memory/latency budget.
