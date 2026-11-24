# Supported Question Catalog — PoC-25
- **Approved Mode**: Mode A — Deterministic Guided | **Track**: Track A (`1.0.1` / `1.0.0`)

| Question Pattern | Intent | Parameters | Query Function | Evidence | Limitation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Which global regions have the highest curated generation capacity? | `compare_groups` | `domain="global_region", limit=5` | `compare_domain_groups` | `RES-0001`..`RES-0005` (`MW`) | Curated 45-plant registry; `n < 5` groups are `conditional`. |
| How does U.S. electricity generation compare across fuel categories? | `compare_groups` | `domain="us_2024_fuel", limit=8` | `compare_domain_groups` | `RES-0020`..`RES-0027` (`thousand_MWh`) | Isolated to 2024 (`n=1,449`); never added to `MW`. |
| How does global power plant capacity compare by fuel type? | `compare_groups` | `domain="global_plant_fuel", limit=9` | `compare_domain_groups` | `RES-0011`..`RES-0019` (`MW`) | Curated sample; `n < 5` fuels carry `conditional` status. |
| Which curated facilities are marked for maintenance? | `list_maintenance_items` | `limit=5` | `get_maintenance_baseline_items` | `RES-0028`..`RES-0032` (`31,719 MW`) | Static snapshot of 5 flagship stations; not live SCADA telemetry. |
| What evidence supports ranking RES-XXXX? | `explain_result` | `result_id` (`^RES-[0-9]{4}$`) | `explain_result_by_id` | `evidence[]` factors & units | Subject to record-level `limitation` field. |
| Summarize the approved Track A findings | `get_summary` | None | `get_executive_summary` | `RES-0001, RES-0011, RES-0020, RES-0028` | Summarizes only approved Post #3 findings. |
| What are the analytical limitations and data versions? | `explain_limitation` / `get_data_freshness` | None | `get_analytical_limitations` | `summary.json` (`1.0.1` / `1.0.0`) | 30-day freshness window; Track F forecasting unsupported. |
