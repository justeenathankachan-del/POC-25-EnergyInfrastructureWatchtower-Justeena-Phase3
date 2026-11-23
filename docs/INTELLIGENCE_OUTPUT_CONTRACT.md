# Intelligence Output Contract

## Output Artifacts
1. **`/data-science/outputs/intelligence_results.json`** (`32` structured comparative intelligence items)
2. **`/data-science/outputs/intelligence_summary.json`** (Executive summary metadata for Post #4 UI integration)
3. **`/data-science/outputs/validation_metrics.json`** (Track A independent recalculation and sensitivity audit)
4. **`/data-science/outputs/weak_case_review.json`** (Structured weak-case audit log)

## Standard Record Schema (`intelligence_results.json`)
Every item strictly implements the 19-field Infocreon Phase 3 contract:
- **Identifiers & Grouping:** `result_id` (`RES-0001`..`RES-0032`), `result_type` (`"ranking"`), `record_id`, `entity_id`, `group_key` (`global_region:*`, `global_plant_fuel:*`, `us_2024_fuel:*`, `maintenance_baseline:*`)
- **Temporal Bounds:** `period_start`, `period_end` (ISO-8601 UTC)
- **Measurement & Rank:** `metric_name`, `result_value`, `result_unit` (`"MW"` or `"thousand_MWh"`), `result_category`, `priority_rank`
- **Explainability & Governance:** `finding`, `evidence` (structured factor list), `method_version` (`"1.0.0"`), `data_version` (`"1.0.1"`), `generated_at`, `quality_status` (`"validated"` or `"conditional"`), `limitation`

## UI Integration Rules for Post #4
- Render `MW` (`global_region:*`, `global_plant_fuel:*`, `maintenance_baseline:*`) and `thousand_MWh` (`us_2024_fuel:*`) in separate cards/charts.
- Display the `limitation` badge on all `quality_status == "conditional"` items.
-
