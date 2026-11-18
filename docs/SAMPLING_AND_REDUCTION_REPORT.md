# Sampling and Reduction Report

## Original Source
- `app/plantsData.ts` (45 global power plant entities) + U.S. EIA API v2 `electricity/electric-power-operational-data` (5,000 utility generation records across 2018–2024).

## Original Size
- Combined raw extract (`raw_combined_extract.csv`, gitignored): ~0.86 MB

## Original Record Count
- 5,045 total rows (45 power plant entities + 5,000 EIA operational records)

## Original Column Count
- 19 combined source columns (`id`, `name`, `fuel`, `capacityMW`, `lat`, `lng`, `region`, `status`, `period`, `location`, `stateDescription`, `sectorid`, `sectorDescription`, `fueltypeid`, `fuelTypeDescription`, `generation`, `generation-units`, `origin_source`)

## Selected Sampling Method
- **Hybrid Preservation + Stratified Sampling:** 100% preservation of all 45 global power plant entities (`PLANTS_DATA_TS`), paired with proportional stratified sampling across `(location, fueltypeid)` for the EIA operational records (`EIA_API_v2`).

## Random Seed
- `RANDOM_SEED = 42`

## Stratification Fields
- `location` (U.S. state / national code) and `fueltypeid` (fuel classification code)

## Date-Coverage Method
- Preserves multi-year operational generation coverage (2018–2024) across U.S. states and fuel types alongside the current operational baseline snapshot (`2026-01-01T00:00:00Z`) for global power plants.

## Rare-Record Preservation
- All 45 global power plant assets—including plants in `Maintenance` status (`W. A. Parish`, `Guri`, `Belchatow`, `Medupi`, `Kashiwazaki-Kariwa`) and smaller fuel classes (`Geothermal`)—are preserved at 100% without downsampling.
- Stratification with `n=max(1, round(...))` guarantees at least 1 observation per `(location, fueltypeid)` stratum in the EIA extract.

## Removed Fields
- Redundant descriptive/metadata fields (`sectorid`, `sectorDescription`, `origin_source`) were normalized or consolidated into canonical fields (`source_name`, `category`, `subcategory`).

## Removed Records
- Exact duplicate rows were deduplicated prior to sampling; 3,213 excess EIA rows were reduced via stratified sampling to stay lightweight and well under the 10,000-row / 5 MB limits.

## Text Truncation
- Generated analytical summaries in `text_value` are strictly capped at `<= 500` characters.

## Sensitive-Data Removal
- Verified zero PII, credentials, or restricted fields. Raw extract (`raw_combined_extract.csv`) is excluded via `.gitignore`.

## Final Source Sample
- **Path:** `data/source-sample/source_sample.csv`
- **Record count:** `1,832` rows (45 plant entities + 1,787 EIA operational records)
- **Column count:** `18` source columns (standardized to `20` canonical columns in `intelligence_data.csv`)

## Representativeness Checks
- Verified in `data/quality/data_profile.json`: all 10 global regions, all 45 map markers, all fuel categories (`hydro`, `nuclear`, `solar`, `wind`, `coal`, `natural_gas`, `geothermal`, `petroleum`, `biomass`, `other`), and both `online` and `maintenance` operational statuses are represented.

## Known Sampling Limitations
- EIA operational data in this extract reflects annual utility-scale (`sectorid=1`) generation rather than sub-hourly dispatch intervals.

## Reproduction Command
```bash
python scripts/data_pipeline/extract_data.py
python scripts/data_pipeline/sample_data.py
python scripts/data_pipeline/standardize_data.py
python scripts/data_pipeline/validate_data.py
python scripts/data_pipeline/publish_data.py