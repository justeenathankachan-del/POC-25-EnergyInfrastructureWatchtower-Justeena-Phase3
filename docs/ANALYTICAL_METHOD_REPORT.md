# Analytical Method Report

## Project & Versioning
- **PoC ID:** POC-25 — Energy Infrastructure Watchtower
- **Canonical Data Version:** `1.0.1` | **Method Version:** `1.0.0`
- **Approved Track:** `Track A — Comparative Intelligence`
- **Target User:** Energy Infrastructure Analysts & Grid Resilience Planners

## Analytical Question & Decision Supported
- **Question:** How do electricity generation shares and capacity concentrations compare across fuel types, U.S. states (`2021`–`2024`), and global grid regions, and which high-capacity facilities currently in maintenance represent the largest regional capacity exposure?
- **Decision:** Prioritizing regional grid resilience monitoring and clean-energy vs. fossil fuel-mix benchmarking across U.S. states and global generation hubs.

## Baseline vs. Selected Method
- **Baseline (`Unstratified Category Total & Mean Ranking`):** Aggregates `metric_value` by `category` across all `1,832` rows without separating `record_type`. While fast, it adds megawatts (`MW`) to thousand megawatt-hours (`thousand_MWh`), distorting category rankings.
- **Selected Method (`Partitioned Track A Comparative Intelligence v1.0.0`):** Implemented in `data-science/scripts/track-specific/comparative_intelligence.py`. Partitions `entity` (`45` plants, `MW`) from `measurement` (`1,787` U.S. EIA observations, `thousand_MWh`), enforces minimum group size $n \ge 5$ (`quality_status: "validated"` vs `"conditional"`), computes dense rankings, percentage shares, HHI concentration indices, a dedicated `2024` U.S. single-year benchmark ($n = 1,449$), and a curated baseline maintenance queue.

## Data Leakage Assessment
- **Decision-Time Availability:** All grouping dimensions (`category`, `subcategory`, `status`, `year`) and metrics (`metric_value`) represent historical or baseline observations available at analysis time.
- **Outcome & Future Information Control:** No predictive target or future-looking field is used; `2026` plant snapshots are never mixed into `2021`–`2024` EIA generation comparisons.
- **Identifier Control:** `record_id` and `entity_id` are used strictly for traceability and distinct entity counting, never as numerical predictors.

## Explainability, Limitations & Unsupported Uses
- **Explainability:** Every ranked output in `intelligence_results.json` exposes exact counts, means, medians, totals, shares, and unit labels in its `evidence` array.
- **Limitations:** Curated 45-plant registry represents flagship assets rather than an exhaustive global census; plant `maintenance` status is static baseline metadata; EIA `2022` slice has `7` records.
- **Unsupported Uses:** Do not use outputs for time-series forecasting (`Track F`), real-time outage dispatch alerts, or cross-unit (`MW` + `thousand_MWh`) sums.
-