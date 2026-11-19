# Data Quality Assessment

## Validation Command and Result
- **Validation Command:** `python scripts/data_pipeline/validate_data.py` (`npm run data:validate`)
- **Validation Result:** `PASS` (`data_version: 1.0.1`, `0` errors)
- **Automated Quality Script:** `python data-science/scripts/assess_data_quality.py` → `PASS` (`0` blocking issues, `2` documented non-blocking analytical caveats)

## Dimension-by-Dimension Quality Evaluation

| Dimension | Status | Findings & Evidence |
|---|---|---|
| **Completeness** | PASS | `0%` nulls across all 17 core fields (`record_id`, `record_type`, `observed_at`, `entity_id`, `related_entity_id`, `entity_name`, `category`, `status`, `stage`, `metric_name`, `metric_value`, `metric_unit`, `text_value`, `source_name`, `source_record_id`, `is_synthetic`, `data_version`). `latitude`, `longitude`, and `subcategory` are `100%` populated for the `45` `entity` records and intentionally `null` for `1,787` state-level `measurement` records. |
| **Uniqueness** | PASS | `record_id` has `1,832` unique keys (`0` duplicates). All `45` global power plants have unique `entity_id` (`PLANT-1`..`PLANT-45`) and unique coordinates. |
| **Validity** | PASS | All `1,832` `observed_at` timestamps parse as strict ISO-8601 UTC; all `metric_value` entries are finite `float64`; all `45` coordinate pairs lie within valid WGS84 bounds; all categorical enums match `data/schema.json`. |
| **Consistency** | PASS | Fuel categories are normalized to 10 lowercase `snake_case` values; `nameplate_capacity` uses `MW` exclusively and `net_generation` uses `thousand_MWh` exclusively. |
| **Accuracy Against Source Sample** | PASS | `intelligence_data.csv` (`1,832` rows) matches `data/source-sample/source_sample.csv` (`1,832` rows) 1-to-1 with deterministic transformation rules. |
| **Provenance** | PASS | `100%` of records carry `source_name` (`EIA_API_v2` or `PLANTS_DATA_TS`), `source_record_id`, `is_synthetic = false`, and `data_version = 1.0.1`. |
| **Safety** | PASS | `0` PII, credentials, or sensitive fields present; `.env.local` and raw API extracts are gitignored. |
| **Reproducibility** | PASS | Verified offline regeneration directly from committed `data/source-sample/source_sample.csv` via `standardize_data.py` → `publish_data.py` → `validate_data.py` without requiring live EIA API access. |

## Blocking Issues
- **None (`0` blocking failures).**

## Corrections & Hardening Applied Through Pipeline (`v1.0.0` → `v1.0.1`)
1. **Strengthened `scripts/data_pipeline/validate_data.py`:** Added automated verification of `schema.json` key and `allowed_values` parity, `data/published/intelligence_data.json` record count and key parity, `public/data/intelligence_data.json` synchronization, and stale timestamp detection (`published` mtime vs `canonical` mtime).
2. **Verified Offline Reproducibility:** Regenerated `intelligence_data.csv` and `intelligence_data.json` offline from `data/source-sample/source_sample.csv` without live EIA API calls and incremented `data_version` to `1.0.1` in `standardize_data.py` and `manifest.json`.
3. **Documented Provenance & Status Caveats:** Clarified static status semantics in `app/plantsData.ts` (`online`/`maintenance`) versus EIA generation-derived statuses (`active`/`offline`).

## Final Quality Result
`PASS`