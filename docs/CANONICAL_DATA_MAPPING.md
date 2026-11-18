# Canonical Data Mapping

## Project
- **PoC ID:** POC-25 — Energy Infrastructure Watchtower
- **Canonical Dataset:** `/data/canonical/intelligence_data.csv`
- **Data Version:** `1.0.0`

## Field Mapping Table

| Source Field | Canonical Field | Transformation | Required? | Example | Notes |
|---|---|---|---|---|---|
| Derived (`id` / row index) | `record_id` | Formatted as `PLANT-{id:04d}` or `EIA-{idx:05d}` | Yes | `PLANT-0001` | Stable, unique primary key |
| Derived from `origin_source` | `record_type` | `"entity"` for plants, `"measurement"` for EIA records | Yes | `entity` | Conforms to allowed enum |
| `period` (or snapshot date) | `observed_at` | Converted year `YYYY` to ISO 8601 UTC `YYYY-01-01T00:00:00Z` | Yes | `2023-01-01T00:00:00Z` | UTC ISO-8601 format |
| `id` / `location` | `entity_id` | Prefixed `PLANT-{id}` or `US-{location}` (`US` for national) | Yes | `PLANT-1` | Primary entity identifier |
| `region` / `location` | `related_entity_id` | Lowercase `snake_case` region slug or parent `US` code | No | `southwest` | Links assets/states to parent grid |
| `name` / `stateDescription` | `entity_name` | Trimmed string | No | `Palo Verde Generating Station` | Human-readable label |
| `fuel` / `fuelTypeDescription` | `category` | Normalized to lowercase `snake_case` fuel taxonomy | Yes | `nuclear` | Standardized across both sources |
| `region` / `fueltypeid` | `subcategory` | Lowercase `snake_case` region slug or EIA fuel code | No | `southwest` | Secondary grouping dimension |
| `status` / `generation` | `status` | Lowercase plant status (`online`, `maintenance`) or derived (`active`/`offline`) | No | `online` | Operational state |
| Derived from source grain | `stage` | `"operational"` for plant assets, `"annual"` for EIA series | No | `operational` | Lifecycle / reporting stage |
| Derived from source metric | `metric_name` | `"nameplate_capacity"` (plants) or `"net_generation"` (EIA) | Yes | `nameplate_capacity` | Standardized metric key |
| `capacityMW` / `generation` | `metric_value` | Cast to numeric float; symbols stripped | No | `3937.0` | Pure numeric value |
| `generation-units` / fixed `MW` | `metric_unit` | Standardized to `"MW"` or `"thousand_MWh"` | Yes | `MW` | Explicit measurement unit |
| Composite summary fields | `text_value` | Formatted descriptive summary truncated to `<= 500` chars | No | `Palo Verde Generating Station (Southwest): 3937.0 MW Nuclear facility` | Capped at 500 chars |
| `lat` / state centroid lookup | `latitude` | Numeric decimal latitude (`-90` to `90`) | No | `33.3965` | Enables geospatial analysis |
| `lng` / state centroid lookup | `longitude` | Numeric decimal longitude (`-180` to `180`) | No | `-112.8677` | Enables geospatial analysis |
| `origin_source` | `source_name` | `"PLANTS_DATA_TS"` or `"EIA_API_v2"` | Yes | `PLANTS_DATA_TS` | Provenance tracking |
| `id` / composite key | `source_record_id` | Original `id` or `{period}_{location}_{fueltypeid}` | No | `1` | Traceability back to source |
| Constant boolean | `is_synthetic` | Fixed `false` | Yes | `false` | Both sources are real-world data |
| Constant version string | `data_version` | Fixed `"1.0.0"` | Yes | `1.0.0` | Matches `manifest.json` |

## Additional Standardization Notes
- **Removed Fields:** `sectorid` and `sectorDescription` (constant electric utility filter `sectorid=1`) were omitted from canonical columns to avoid redundancy.
- **Null Handling:** Missing numeric values coerce to `NaN` in pandas, writing as blank strings in CSV and `null` in `intelligence_data.json`.
- **Category Normalization:** Source fuel labels (`"Natural Gas"`, `"NG"`, `"Hydro"`, `"WAT"`, etc.) map deterministically via `normalize_fuel()` to lowercase `snake_case` values.