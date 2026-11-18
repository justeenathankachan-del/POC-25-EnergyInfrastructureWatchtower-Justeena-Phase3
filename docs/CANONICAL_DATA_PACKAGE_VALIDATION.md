# Canonical Data Package Validation

## Validation Summary
- **Project:** POC-25 — Energy Infrastructure Watchtower
- **Data Version:** `1.0.0`
- **Validation Command:** `python scripts/data_pipeline/validate_data.py`
- **Validation Status:** `PASS`
- **Canonical Dataset:** `data/canonical/intelligence_data.csv` (`1,832` rows × `20` columns)
- **Published Dataset:** `data/published/intelligence_data.json` (and deployment copy `public/data/intelligence_data.json`)

## Automated Checks Verified
1. **Required Directory & File Structure:** All mandatory files under `/data`, `/scripts/data_pipeline`, and `/docs` exist.
2. **Program Size Limits:** Total committed `/data` directory is well below the `10 MB` limit, and each individual file (`source_sample.csv`, `intelligence_data.csv`, `intelligence_data.json`) is well below the `5 MB` limit.
3. **Row & Column Limits:** `1,832` rows (`<= 10,000`) and `20` columns (`<= 50`) in the exact mandatory column order.
4. **Identifier & Type Integrity:** `record_id` is non-null and 100% unique (`1,832` unique IDs); `observed_at` strictly follows ISO-8601 UTC (`YYYY-MM-DDTHH:MM:SSZ`); `metric_value` is strictly numeric; `is_synthetic` is boolean `false`; `text_value` is `<= 500` characters.
5. **Manifest & Published JSON Consistency:** `manifest.json` counts and version match `intelligence_data.csv`, and `intelligence_data.json` is generated programmatically by `publish_data.py`.
6. **Deployment & Application Preservation:** Existing Phase 2 operational dashboard (`app/page.tsx`, `app/PowerPlantMap.tsx`, `app/api/eia/route.ts`) remains unmodified and builds cleanly offline.
7.