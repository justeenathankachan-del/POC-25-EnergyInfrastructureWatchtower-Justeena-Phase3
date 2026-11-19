# Phase 3 Post #2 — Canonical Data Validation, Profiling & Analytical Readiness

## Source of Truth
All profiling, quality checks, representativeness assessments, and readiness evaluations in this directory read exclusively from:
- `../data/canonical/intelligence_data.csv` (`data_version: 1.0.1`, `1,832` rows × `20` columns)

## Scripts & Outputs
1. `scripts/profile_canonical_data.py` → `outputs/canonical_profile.json`
2. `scripts/assess_data_quality.py` → `outputs/quality_assessment.json`
3. `scripts/assess_representativeness.py` → `outputs/representativeness_assessment.json`
4. `scripts/assess_analytical_readiness.py` → `outputs/analytical_readiness.json`
5. `notebooks/01_canonical_data_validation_and_readiness.ipynb` — Reproducible end-to-end validation and profiling notebook.
6.