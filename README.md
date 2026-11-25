# PoC-25 — Energy Infrastructure Watchtower (Phase 3 Certified)
Interactive operational energy infrastructure watchtower (`/`) integrated with a validated **Track A Comparative Intelligence** decision dashboard (`/data-intelligence`) and a **Mode A Deterministic Guided Assistant**.
- **Release Tag**: `phase3-v1.0.0` | **Canonical Data Version**: `1.0.1` | **Method Version**: `1.0.0`
- **Live Deployment URL**: https://poc-25-frontend-phase3.onrender.com
- **Routes**: `/` (Operational View), `/data-intelligence` (Decision Intelligence View), `/api/assistant/query` (Deterministic Assistant API), `/api/eia` (EIA Telemetry)
## Quickstart, Validation & Build
Run `npm ci`, `python scripts/data_pipeline/validate_data.py`, `python scripts/data_pipeline/run_track_a_analysis.py`, `node tests/run_post4_tests.mjs`, `node tests/run_post5_tests.mjs`, `node tests/run_post6_certification.mjs`, and `npm run build`.
## Certification Documentation
All 13 certification reports (`PHASE3_RELEASE_MANIFEST.md`, `CLEAN_CLONE_VALIDATION_REPORT.md`, `FINAL_ANALYTICAL_REVALIDATION.md`, `BUILD_AND_ENVIRONMENT_VALIDATION.md`, `FINAL_OPERATIONAL_REGRESSION_REPORT.md`, `FINAL_DATA_INTELLIGENCE_VALIDATION.md`, `FINAL_ASSISTANT_VALIDATION.md`, `FINAL_AUTOMATED_TEST_REPORT.md`, `PHASE3_FINAL_UAT.md`, `DEPLOYMENT_VALIDATION_REPORT.md`, `PHASE3_FINAL_ARCHITECTURE.md`, `PHASE3_COMPLETION_REPORT.md`, `PHASE3_HANDOVER_GUIDE.md`) are located in `/docs/`.
## Known Limitations & Safety Boundary
Nameplate capacity (`MW`) and U.S. 2024 utility net generation (`thousand_MWh`) are strictly partitioned and never combined. Maintenance baseline records (`31,719.0 MW` across 5 flagship stations) reflect a static snapshot rather than live SCADA telemetry. Time-series forecasting (Track F) is unsupported and refused by the assistant.
