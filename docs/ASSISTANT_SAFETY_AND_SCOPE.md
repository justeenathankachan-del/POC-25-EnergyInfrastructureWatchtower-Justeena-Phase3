# Assistant Safety and Scope — PoC-25
- **Approved Scope**: 7 deterministic Track A comparative intents over 32 validated outputs (`1.0.1` / `1.0.0`).
- **Blocked Scope**: Forecasting (`2025`–`2030`), live SCADA outages, prompt injection (`ignore previous instructions`, `system prompt`), secret access, and raw CSV dumps.
- **Privacy & Memory**: `persistent_memory = false`; no sensitive logs persisted; source text rendered as plain React text nodes.
