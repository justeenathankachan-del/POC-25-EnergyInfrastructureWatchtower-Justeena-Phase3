# Analytical Input Contract

| Canonical Field | Analytical Role | Transformation | Required? | Available at Decision Time? | Limitation |
|---|---|---|---|---|---|
| `record_id` | Identifier | Unique row key for traceability & counts | Yes | Yes | Not used as a numerical feature |
| `record_type` | Grouping dimension | Partition key (`entity` vs `measurement`) | Yes | Yes | Mandatory split to prevent `MW` vs `thousand_MWh` mixing |
| `observed_at` | Time index | Parsed to UTC `year` (`2021`–`2026`) | Yes | Yes | `2022` has only `7` rows; `2026` is a single plant snapshot |
| `entity_id` | Identifier | Entity identifier (`PLANT-*` or `EIA-*`) | Yes | Yes | EIA rows share a regional prefix; `entity_name` distinguishes states |
| `entity_name` | Evidence field | Plant or U.S. state/regional label | Yes | Yes | Naming follows source conventions |
| `category` | Grouping dimension | Standardized 10-fuel taxonomy | Yes | Yes | `'other'` aggregates multi-fuel EIA codes |
| `subcategory` | Grouping dimension | Global grid region (`10` regions) | Conditional | Yes | Populated for `45` global `entity` rows; null for `1,787` EIA rows |
| `status` | Grouping / Priority factor | Operational (`online`/`maintenance`) or reporting (`active`/`offline`) state | Yes | Yes | Plant `maintenance` is curated baseline status, not live SCADA |
| `metric_name` | Evidence field | Metric discriminator (`nameplate_capacity` vs `net_generation`) | Yes | Yes | Must match `record_type` |
| `metric_value` | Metric | Numeric `float64` aggregation value | Yes | Yes | Contains valid negative net-generation values in EIA records |
| `metric_unit` | Evidence field | Unit verification (`MW` vs `thousand_MWh`) | Yes | Yes | Strict unit separation enforced |
| `data_version` | Evidence field | Verified equal to `"1.0.1"` | Yes | Yes | Halts execution on version mismatch |