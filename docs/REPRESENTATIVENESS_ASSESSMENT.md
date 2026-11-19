# Representativeness Assessment

## Project and Case-Study Purpose
- **PoC:** POC-25 — Energy Infrastructure Watchtower
- **Purpose:** Provide an energy infrastructure intelligence view combining major global generation assets (spatial capacity & operational status) with U.S. utility-scale electricity generation across fuel types and reporting years.
- **Canonical Data Version:** `1.0.1`

## Original Sampling Method & Summary
- **Source Sample (`data/source-sample/source_sample.csv`):** `1,832` records derived from `5,045` combined extract rows using `RANDOM_SEED = 42` (`100%` preservation of all `45` power plants in `app/plantsData.ts` + proportional stratified sampling of `1,787` records from the `5,000`-row `EIA_API_v2` extract).
- **Canonical Dataset (`data/canonical/intelligence_data.csv`):** `1,832` records (`100%` retention of the source sample).

## Coverage Assessment

### Categories
- All `10` standardized fuel categories are preserved: `other` (`586`), `solar` (`339`), `coal` (`285`), `petroleum` (`149`), `natural_gas` (`133`), `hydro` (`101`), `biomass` (`94`), `wind` (`93`), `nuclear` (`43`), and `geothermal` (`9`).

### Time Periods
- **EIA Operational Measurements (`1,787` rows):** Covers `2021` (`159`), `2022` (`7`), `2023` (`172`), and `2024` (`1,449`).
- **Global Power Plant Registry (`45` rows):** Captured as a single baseline asset snapshot (`2026-01-01T00:00:00Z`).

### Geography
- **Global Power Plants:** All `10` global regions in `app/plantsData.ts` are preserved (`asia_pacific`: 12, `europe`: 8, `middle_east_&_africa`: 7, `south_america`: 4, `texas_gulf`: 3, `west`: 3, `northeast`: 3, `southwest`: 2, `southeast`: 2, `northwest`: 1) with `45` exact WGS84 coordinates.
- **EIA Measurements:** Covers `52` U.S. states/territories and national aggregates via `entity_name` (note: `entity_id` groups U.S. EIA rows under a shared prefix while `entity_name` distinguishes individual states/regions).

### Status and Process Stages
- Both operational plant statuses (`online`: 40, `maintenance`: 5) and both EIA generation statuses (`active`: 1,471, `offline`: 316) are preserved across `annual` (`1,787`) and `operational` (`45`) stages.

### Rare Records
- All `5` plants in `maintenance` (`W. A. Parish`, `Guri`, `Belchatow`, `Medupi`, `Kashiwazaki-Kariwa`) and all `9` `geothermal` observations are preserved.

## Underrepresented Areas & Sampling Bias
1. **Temporal Concentration in 2024:** `81.1%` (`1,449 / 1,787`) of EIA records occur in `2024`, whereas `2022` has only `7` observations due to API pagination order in the initial 5,000-row extract. Multi-year trend comparisons must therefore normalize or weight by state/fuel availability per year.
2. **Curated Flagship Registry Scope:** `app/plantsData.ts` is a curated list of `45` major global facilities rather than an exhaustive global census of all power plants; its `online`/`maintenance` labels reflect curated baseline states rather than live SCADA feeds.
3. **U.S.-Only Generation Telemetry:** `net_generation` measurements (`EIA_API_v2`) cover U.S. utility-scale generation only and do not measure generation output for non-U.S. plants in the 45-plant registry.

## Impact on Future Analysis
- Cross-fuel and cross-region comparative intelligence (`Track A`) and 2024 fuel-mix benchmarking are strongly supported.
- Multi-year trend analysis (`Track B`) must explicitly account for the sparse `2022` slice (`n = 7`) and restrict trend calculations to `record_type == "measurement"`.

## Representativeness Result
`PASS` (with documented temporal skew and curated-registry scope boundaries)