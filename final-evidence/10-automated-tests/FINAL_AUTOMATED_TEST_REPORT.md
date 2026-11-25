# Final Automated Test Report — PoC-25
| Test Group | Command | Passed | Failed | Skipped | Result |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Data pipeline | `python scripts/data_pipeline/validate_data.py` | 1 | 0 | 0 | PASS |
| Data readiness | `python scripts/data_pipeline/profile_and_readiness.py` | 1 | 0 | 0 | PASS |
| Analytical & publish | `python scripts/data_pipeline/publish_intelligence.py` | 1 | 0 | 0 | PASS |
| Output contract & UI | `node tests/run_post4_tests.mjs` | 1 | 0 | 0 | PASS |
| Assistant grounding & safety | `node tests/run_post5_tests.mjs` | 1 | 0 | 0 | PASS |
| End-to-end certification | `node tests/run_post6_certification.mjs` | 1 | 0 | 0 | PASS |
| Production build | `npm run build` | 1 | 0 | 0 | PASS |
