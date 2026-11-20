# Analytical Track Execution Plan

## Project & Governance
- **PoC ID:** POC-25 — Energy Infrastructure Watchtower
- **Canonical Data Version:** `1.0.1` (`/data/canonical/intelligence_data.csv`, `1,832` rows × `20` columns)
- **Confirmed Data Archetype:** `Hybrid (Entity / Snapshot + Time-Series Measurement)`
- **Target User:** Energy Infrastructure Analysts & Grid Resilience Planners
- **Approved Primary Track:** `Track A — Comparative Intelligence` (`method_version: 1.0.0`)
- **Approved Supporting Track:** `Track B — Trend Intelligence` (U.S. annual fuel-mix context) & `Track C — Risk & Priority Intelligence` (curated baseline maintenance exposure ranking)

## Primary Analytical Question & Decision
- **Primary Analytical Question:** How do electricity generation shares and capacity concentrations compare across fuel types, U.S. states (`2021`–`2024`), and global grid regions, and which high-capacity facilities currently in maintenance represent the largest regional capacity exposure?
- **Decision to Be Supported:** Prioritizing regional grid resilience monitoring and clean-energy vs. fossil fuel-mix benchmarking across U.S. states and global generation hubs without conflating static plant capacity (`MW`) with annual net generation (`thousand_MWh`).

## Scope & Field Controls
- **Input Fields:** `record_id`, `record_type`, `observed_at`, `entity_id`, `entity_name`, `category`, `subcategory`, `status`, `metric_name`, `metric_value`, `metric_unit`, `source_name`, `data_version`
- **Excluded Fields:** `text_value` (deterministic summary string), `latitude`/`longitude` (spatial display coordinates not required for group aggregation), `is_synthetic` (constant `false`), `source_record_id`
- **Missing-Value Handling:** `subcategory` is null for U.S. `measurement` rows (`1,787`) and populated for all `45` global `entity` rows; partitioning by `record_type` eliminates cross-population missingness.
- **Baseline:** Unstratified category-level totals and averages across all `1,832` rows.
- **Selected Method:** Partitioned Track A Comparative Intelligence computing totals, means, medians, percentage shares, Herfindahl-Hirschman Index (HHI) concentration, dense rankings, and minimum group size ($n \ge 5$) quality flags separately for `entity` (`MW`) and `measurement` (`thousand_MWh`) populations.
- **Validation Approach:** Independent recalculation of selected group totals, minimum group size ($n \ge 5$) sensitivity analysis, sparse-year (`2022`) sensitivity review, and weak-case review.
- **Stop Conditions:** Any `data_version != 1.0.1`, mixed-unit aggregation (`MW` + `thousand_MWh`), or schema contract mismatch halts export.
- **Known Limitations:** Curated 45-plant registry reflects flagship baseline assets rather than live SCADA telemetry; EIA `2022` slice has only `7` observations.
-