# Data Archetype Confirmation

## What One Canonical Record Represents
Each row in `/data/canonical/intelligence_data.csv` represents one of two strictly separated record structures distinguished by `record_type`:
1. **`record_type = "entity"` (`45` rows, `PLANTS_DATA_TS`):** A static infrastructure asset record describing a major global power plant's nameplate capacity (`MW`), fuel category, global grid region (`subcategory`), curated operational status (`online` or `maintenance`), and WGS84 coordinates (`latitude`, `longitude`) at the `2026-01-01T00:00:00Z` baseline.
2. **`record_type = "measurement"` (`1,787` rows, `EIA_API_v2`):** An annual utility-scale net electricity generation observation (`thousand_MWh`) for a U.S. state or national aggregate (`entity_name`) and fuel category (`category`) across reporting years `2021`–`2024`.

## Primary & Secondary Archetype
- **Confirmed Primary Archetype:** `Hybrid (Entity / Snapshot + Time-Series Measurement)`
- **Primary Component:** `Entity / Snapshot` (`45` global power plant assets with spatial coordinates and capacity attributes)
- **Secondary Component:** `Time-Series Measurement` (`1,787` annual U.S. utility generation measurements across `2021`–`2024`)

## Evidence from Populated Canonical Fields
- **Entity Behaviour:** `45` unique `PLANT-*` entities (`1` snapshot per plant), `45` unique `(latitude, longitude)` pairs, and `45` non-null `subcategory` region tags.
- **Time Behaviour:** `1,787` `EIA-*` measurements spanning `2021` (`159`), `2022` (`7`), `2023` (`172`), and `2024` (`1,449`).
- **Metric Separation:** `nameplate_capacity` (`MW`) maps 100% to `entity` records; `net_generation` (`thousand_MWh`) maps 100% to `measurement` records.

## Archetypes Considered but Rejected
- **Pure Time-Series Measurement:** Rejected because the `45` global power plant assets have only a single baseline snapshot (`2026`) and the `2022` EIA slice contains only `7` observations.
- **Event / Transaction:** Rejected because records represent annual utility aggregates and static plant capacities rather than discrete grid dispatch events or outages.
- **Simulation / Scenario:** Rejected because `is_synthetic = false` for all `1,832` rows and no parameterized simulation runs exist.
- **Text-Enriched:** Rejected because `text_value` is a deterministic summary template synthesized from structured fields.

## Final Confirmation
Confirmed as **`Hybrid (Entity / Snapshot + Time-Series Measurement)`** under `data_version: 1.0.1`. Downstream Phase 3 analytics must partition queries by `record_type` before computing aggregations or visualizations.