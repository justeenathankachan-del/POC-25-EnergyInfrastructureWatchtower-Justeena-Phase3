# Phase 3 Handover Guide — PoC-25
- **Repository**: https://github.com/justeenathankachan-del/POC-25-EnergyInfrastructureWatchtower-Justeena-Phase3 | **Tag**: `phase3-v1.0.0` | **Live URL**: https://poc-25-energy-infrastructure-watchtower.onrender.com
- **Setup & Run**: `npm ci` -> `python scripts/data_pipeline/validate_data.py` -> `python scripts/data_pipeline/run_track_a_analysis.py` -> `node tests/run_post4_tests.mjs && node tests/run_post5_tests.mjs && node tests/run_post6_certification.mjs` -> `npm run build && npm run start`.
- **Update & Rollback**: Update `data_version`/`method_version` in `data/manifest.json` and `services/intelligenceValidator.ts`, rebuild, and push. Roll back via Render or `git checkout phase3-v1.0.0`.
