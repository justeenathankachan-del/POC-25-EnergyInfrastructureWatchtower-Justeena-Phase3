# Canonical Data Foundation — POC-25 Energy Infrastructure Watchtower

## Single Source of Truth
All Phase 3 analysis, profiling, risk scoring, anomaly detection, and API endpoints must read exclusively from:
- `/data/canonical/intelligence_data.csv` (or `/data/published/intelligence_data.json` generated directly from it)

## Package Summary
- **Data Version:** `1.0.0`
- **Canonical Rows:** `1,832` (45 global power plant entities + 1,787 stratified U.S. EIA operational generation records)
- **Canonical Columns:** `20` (strictly following the Real Rails Phase 3 universal schema)
- **Synthetic Data:** `false` (all records come from real-world infrastructure data and official U.S. EIA API v2 telemetry)
- **Personal / Restricted Data:** `false`

## Reproducible Pipeline Execution
Run in order from the repository root:
1. `python scripts/data_pipeline/extract_data.py` — Extracts raw records from `app/plantsData.ts` and EIA API v2.
2. `python scripts/data_pipeline/sample_data.py` — Preserves all 45 plant entities and applies stratified sampling (`RANDOM_SEED = 42`) to EIA records.
3. `python scripts/data_pipeline/standardize_data.py` — Maps fields into the 20 mandatory canonical columns in ISO 8601 UTC and `snake_case`.
4. `python scripts/data_pipeline/validate_data.py` — Validates schema, sizes, IDs, dates, and manifest consistency, generating `data/quality/validation_report.json` and `data/quality/data_profile.json`.
5. `python scripts/data_pipeline/publish_data.py` — Generates `data/published/intelligence_data.json` and `public/data/intelligence_data.json`.
6.