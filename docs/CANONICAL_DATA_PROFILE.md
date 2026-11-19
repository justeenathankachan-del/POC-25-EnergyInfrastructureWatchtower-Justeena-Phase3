# Canonical Data Profile

## Project
- **PoC ID:** POC-25 — Energy Infrastructure Watchtower
- **Canonical Dataset:** `/data/canonical/intelligence_data.csv`
- **Canonical Data Version:** `1.0.1`
- **File Size:** `0.409 MB`
- **Dataset Dimensions:** `1,832` rows × `20` columns

## Record-Type Distribution
- **`measurement` (`EIA_API_v2`):** `1,787` records (`97.54%`) — U.S. utility-scale annual net electricity generation (`metric_name: "net_generation"`, `metric_unit: "thousand_MWh"`).
- **`entity` (`PLANTS_DATA_TS`):** `45` records (`2.46%`) — Curated global flagship power plant assets (`metric_name: "nameplate_capacity"`, `metric_unit: "MW"`).

## Source & Synthetic Distribution
- **`EIA_API_v2`:** `1,787` records (`is_synthetic: false`)
- **`PLANTS_DATA_TS`:** `45` records (`is_synthetic: false`)
- **Synthetic Records:** `0` (`0.0%`) | **Non-Synthetic Records:** `1,832` (`100.0%`)

## Field Completeness

| Column | Type | Non-Null | Null | Null % | Unique | Role |
|---|---|---:|---:|---:|---:|---|
| `record_id` | `string` | 1,832 | 0 | 0.00% | 1,832 | Primary unique key |
| `record_type` | `string` | 1,832 | 0 | 0.00% | 2 | Population discriminator (`entity` vs `measurement`) |
| `observed_at` | `string` (ISO-8601 UTC) | 1,832 | 0 | 0.00% | 5 | Annual observation or snapshot timestamp |
| `entity_id` | `string` | 1,832 | 0 | 0.00% | 46 | Primary entity identifier |
| `related_entity_id` | `string` | 1,832 | 0 | 0.00% | 11 | Parent grid / national grouping |
| `entity_name` | `string` | 1,832 | 0 | 0.00% | 109 | Plant or U.S. state/regional label |
| `category` | `string` | 1,832 | 0 | 0.00% | 10 | Standardized fuel classification |
| `subcategory` | `string` | 45 | 1,787 | 97.54% | 10 | Global grid region (populated for `entity` records) |
| `status` | `string` | 1,832 | 0 | 0.00% | 4 | Operational / reporting state |
| `stage` | `string` | 1,832 | 0 | 0.00% | 2 | Grain indicator (`operational` vs `annual`) |
| `metric_name` | `string` | 1,832 | 0 | 0.00% | 2 | Standardized metric key |
| `metric_value` | `float64` | 1,832 | 0 | 0.00% | 931 | Numeric capacity or generation value |
| `metric_unit` | `string` | 1,832 | 0 | 0.00% | 2 | Explicit unit (`MW` or `thousand_MWh`) |
| `text_value` | `string` | 1,832 | 0 | 0.00% | 1,812 | Descriptive summary (`<= 500` chars) |
| `latitude` | `float64` | 45 | 1,787 | 97.54% | 45 | WGS84 latitude (populated for `entity` map assets) |
| `longitude` | `float64` | 45 | 1,787 | 97.54% | 45 | WGS84 longitude (populated for `entity` map assets) |
| `source_name` | `string` | 1,832 | 0 | 0.00% | 2 | Source system provenance |
| `source_record_id` | `string` | 1,832 | 0 | 0.00% | 49 | Source lineage identifier |
| `is_synthetic` | `bool` | 1,832 | 0 | 0.00% | 1 | Synthetic flag (`false`) |
| `data_version` | `string` | 1,832 | 0 | 0.00% | 1 | Canonical package version (`1.0.1`) |

## Numerical Coverage (Separated by Metric & Unit)
- **`nameplate_capacity` (`MW`, `n = 45` global power plants):** Min = `210.0`, Median = `2,670.0`, Mean = `4,472.53`, Max = `22,500.0`, Std = `4,554.62`
- **`net_generation` (`thousand_MWh`, `n = 1,787` U.S. EIA records):** Min = `-4,232.426`, Median = `150.064`, Mean = `15,947.88`, Max = `2,256,336.248`, Std = `82,709.05`
- **Invalid / Infinite Values:** `0`

## Date and Time Coverage
- **Parse Success Rate:** `100.0%` (strict UTC `YYYY-MM-DDTHH:MM:SSZ`)
- **Earliest:** `2021-01-01T00:00:00Z` | **Latest:** `2026-01-01T00:00:00Z`
- **Distribution by Year & Record Type:**
  - `2021` (`measurement`): `159` records
  - `2022` (`measurement`): `7` records
  - `2023` (`measurement`): `172` records
  - `2024` (`measurement`): `1,449` records (heavily concentrated in the latest complete reporting year)
  - `2026` (`entity`): `45` records (baseline asset snapshot)

## Category and Status Coverage
- **Categories (`10`):** `other` (`586`), `solar` (`339`), `coal` (`285`), `petroleum` (`149`), `natural_gas` (`133`), `hydro` (`101`), `biomass` (`94`), `wind` (`93`), `nuclear` (`43`), `geothermal` (`9`).
- **Statuses (`4`):** `active` (`1,471` EIA series with positive/non-zero generation), `offline` (`316` EIA series with zero/negative net generation), `online` (`40` global plants), `maintenance` (`5` global plants).
- **Stages (`2`):** `annual` (`1,787`), `operational` (`45`).

## Geographic & Text Coverage
- **Geographic:** `45` valid WGS84 coordinate pairs (`latitude`: `-38.0469` to `64.0375`; `longitude`: `-122.7553` to `150.9492`), 100% unique (`45` distinct coordinates), corresponding strictly to the `45` global plant entities.
- **Text (`text_value`):** `1,832` non-null strings, average length `67.38` chars, maximum length `96` chars, `0` empty/whitespace strings, `0` truncated records.

## Important Observations
1. **Two Distinct Analytical Populations:** `entity` rows (`MW` capacity) and `measurement` rows (`thousand_MWh` generation) must always be analyzed separately by `record_type`—never summed across mixed units.
2. **Negative Net Generation Values:** Negative `net_generation` values (down to `-4,232.426 thousand_MWh`) represent valid utility accounting where pumped-storage pumping energy or station auxiliary consumption exceeds gross generation.
3. **Temporal Skew in EIA Sample:** `81.1%` (`1,449 / 1,787`) of EIA measurements fall in `2024`, while `2022` has only `7` observations.
4.