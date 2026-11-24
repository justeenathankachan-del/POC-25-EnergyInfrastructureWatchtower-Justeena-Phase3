# Assistant Query Contract — PoC-25
- **Intents**: `get_summary`, `compare_groups`, `list_maintenance_items`, `explain_result`, `explain_method`, `explain_limitation`, `get_data_freshness`.
- **Limits**: `max_question_length = 500`, `limit <= 25`, `RES-[0-9]{4}` regex validation on `result_id`.
- **Failure Modes**: `MISSING_PARAMETER` asks for `RES-XXXX`; `OUT_OF_SCOPE` refuses forecasting/SCADA; `UNSAFE` blocks injection/secret probes; version/count mismatch fails closed with `status: "error"`.
