# Intelligence Integration Mapping — PoC-25

| Post #3 Output Source & Field | Loader / Service Field | UI Component | Display Rule | Fallback / Error Handling |
| :--- | :--- | :--- | :--- | :--- |
| `intelligence_summary.json` -> `approved_track` | `summary.approved_track` | `IntelligenceHeader`, `MethodologyPanel` | Displayed as Track A badge in header and methodology | Fails contract validation if missing |
| `intelligence_summary.json` -> `data_version`, `method_version`, `generated_at` | `summary.data_version`, `summary.method_version`, `summary.generated_at` | `DataFreshnessBadge`, `MethodologyPanel` | Rendered in monospace badge; checked against `1.0.1` / `1.0.0` and 30-day window | Triggers Stale / Version Warning banner |
| `intelligence_summary.json` -> `key_findings[]` | `summary.key_findings` | `KeyFindingsPanel` | Rendered verbatim as indexed findings `F1`–`F4` | Fails contract validation if non-array |
| `intelligence_summary.json` -> `important_limitations[]` | `summary.important_limitations` | `LimitationsPanel` | Rendered as bulleted governance warnings | Appends explicit unsupported-use guardrails |
| `intelligence_results.json` -> `result_id`, `priority_rank`, `group_key` | `item.result_id`, `item.priority_rank`, `item.group_key` | `PrimaryIntelligenceView`, `PriorityOrExceptionTable`, `EvidencePanel` | Displayed as `#rank` and domain-formatted label | Rejects duplicate `result_id` during validation |
| `intelligence_results.json` -> `result_value`, `result_unit` | `item.result_value`, `item.result_unit` | `IntelligenceSummaryCards`, `PrimaryIntelligenceView`, `PriorityOrExceptionTable`, `EvidencePanel` | Formatted with `.toLocaleString()` and strict unit tag (`MW` or `thousand_MWh`) | Never summed across incompatible units |
| `intelligence_results.json` -> `quality_status` | `item.quality_status` | `PrimaryIntelligenceView`, `PriorityOrExceptionTable`, `EvidencePanel` | `validated` (`n >= 5`) in emerald; `conditional` (`n < 5` or baseline) in amber | `rejected` items are quarantined from normal display |
| `intelligence_results.json` -> `evidence[]` | `item.evidence` (`factor`, `value`, `unit`) | `EvidencePanel` | Rendered as key-value factor list for selected item | Fails contract validation if missing or non-array |
| `intelligence_results.json` -> `limitation` | `item.limitation` | `EvidencePanel` | Always visible inside amber guidance callout when inspecting any result | Fails contract validation if empty |
