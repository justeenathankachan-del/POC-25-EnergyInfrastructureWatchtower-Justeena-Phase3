# Grounded Data Assistant — PoC-25 (Mode A: Deterministic Guided)

- **Approved Mode**: Mode A — Deterministic Guided Assistant (`DETERMINISTIC ASSISTANT SUITABLE — LLM NOT REQUIRED`)
- **Data Version**: `1.0.1` | **Method Version**: `1.0.0`
- **Pipeline**: `User Question -> Scope Guard -> Intent Classifier -> Parameter Validator -> Query Router -> Deterministic Query -> Evidence Builder -> Response Composer -> Output Validator`
- **Sources**: `/data-science/outputs/intelligence_results.json`, `/data-science/outputs/intelligence_summary.json`, `/data-science/outputs/validation_metrics.json`
