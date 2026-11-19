# Analytical Readiness Report

## Target User & Context
- **Target User:** Energy Infrastructure Analysts & Grid Resilience Planners
- **Canonical Data Version:** `1.0.1` (`1,832` rows × `20` columns, `0.409 MB`)
- **Confirmed Data Archetype:** `Hybrid (Entity / Snapshot + Time-Series Measurement)`

## Primary Analytical Question
> **How do electricity generation shares and capacity concentrations compare across fuel types, U.S. states (`2021`–`2024`), and global grid regions, and which high-capacity facilities currently in maintenance represent the largest regional capacity exposure?**

## Decision to Be Supported
Prioritizing regional grid resilience monitoring and clean-energy vs. fossil fuel-mix benchmarking across U.S. states and major global generation hubs without conflating static plant capacity (`MW`) with annual net generation (`thousand_MWh`).

## Data, Quality & Representativeness Summary
- **Structural & Quality Status:** `PASS` (`0` blocking failures across all 10 quality dimensions; verified offline regeneration from `source_sample.csv`).
- **Two-Population Separation:** `45` global plant entities (`MW`, coordinates, `online`/`maintenance` status) and `1,787` U.S. EIA annual generation measurements (`thousand_MWh`, `2021`–`2024`).

## Track Readiness Matrix

| Track | Status | Supporting Evidence | Missing Requirement | Recommendation |
|---|---|---|---|---|
| **Track A — Comparative Intelligence** | **Supported** | 10 fuel categories, 52 U.S. state/regional entities (`1,787` measurements), and 10 global regions (`45` plant entities) with complete `MW` and `thousand_MWh` metrics. | None (must partition by `record_type`). | **Recommended Primary Track** |
| **Track B — Trend Intelligence** | **Conditionally Supported** | `1,787` EIA measurements span ordered annual periods (`2021`–`2024`), with strong coverage in `2021` (`159`), `2023` (`172`), and `2024` (`1,449`). | `2022` has only `7` rows; global plant entities (`45`) are a single `2026` snapshot. | **Optional Supporting Track** (U.S. annual fuel-mix comparison) |
| **Track C — Risk & Priority Intelligence** | **Conditionally Supported** | `45` global plants include `nameplate_capacity` (`MW`), `status` (`online` vs `maintenance` for 5 major plants), and regional grouping. | No real-time reserve margin, load demand, or outage duration telemetry. | **Optional Supporting Track** (maintenance capacity-at-risk ranking) |
| **Track D — Anomaly Intelligence** | **Conditionally Supported** | Comparable state/fuel annual generation distributions and negative net-generation flags (`offline` status) enable outlier flagging. | Annual resolution cannot detect intraday or seasonal grid anomalies. | Secondary / Optional |
| **Track E — Segmentation Intelligence** | **Supported** | Multi-dimensional fuel, geography, capacity/generation scale, and operational status attributes support clean energy-profile grouping. | Must segment `entity` and `measurement` populations separately. | Optional Supporting Track |
| **Track F — Predictive Intelligence** | **Not Supported** | Contains annual historical aggregates and a static plant snapshot. | No forecasting target with sufficient longitudinal depth (only 4 distinct EIA years, sparse 2022), no exogenous demand/weather features, and no decision-time holdout structure. | **Rejected** (per Predictive Intelligence Checklist) |
| **Track G — Simulation & Scenario Intelligence** | **Not Supported** | All `1,832` rows are historical/curated observations (`is_synthetic = false`). | No configurable scenario parameters or dispatch simulation outputs exist. | **Rejected** |
| **Track H — Text & Theme Intelligence** | **Not Supported** | `text_value` consists of deterministic 67-char template strings formatted from structured columns. | No organic unstructured text corpus exists. | **Rejected** |

## Summary Decisions
- **Recommended Primary Track:** `Track A — Comparative Intelligence`
- **Optional Supporting Track:** `Track B — Trend Intelligence` (U.S. annual fuel-mix shifts) & `Track C — Risk & Priority Intelligence` (global maintenance capacity exposure)
- **Rejected Tracks:** `Track F — Predictive Intelligence`, `Track G — Simulation & Scenario Intelligence`, `Track H — Text & Theme Intelligence`
- **Predictive Intelligence Decision:** `REJECTED` — Insufficient longitudinal depth (`2022` sparse slice), absence of exogenous predictors, and static snapshot nature of the global plant registry make forecasting scientifically invalid.

## Important Limitations & Required Controls for Post #3
1. **Strict `record_type` Partitioning:** Post #3 analytics and UI panels must never aggregate `MW` (`entity`) and `thousand_MWh` (`measurement`) in the same sum or chart axis.
2. **Curated Registry Provenance:** Explicitly label the 45-plant layer as a curated flagship registry (`app/plantsData.ts`) with baseline `online`/`maintenance` statuses rather than live SCADA telemetry.
3. **2022 Sample Sparsity:** Disclose `n = 7` for `2022` whenever displaying multi-year U.S. EIA comparisons (`2021`–`2024`).

## Final Result
`DATA READY FOR ANALYTICAL TRACK DEVELOPMENT`