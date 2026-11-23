# Analytical Validation Report

## Track & Versioning
- **Approved Track:** `Track A â€” Comparative Intelligence`
- **Data Version:** `1.0.1` | **Method Version:** `1.0.0`
- **Validation Script:** `data-science/scripts/validate_analytical_track.py` (`data-science/outputs/validation_metrics.json`)

## Validation Checks & Independent Recalculation
1. **Asia Pacific Curated Capacity (`MW`):** Independent sum = `77,505.0 MW` | Reported = `77,505.0 MW` â†’ **EXACT MATCH**
2. **Global Hydro Curated Capacity (`MW`):** Independent sum = `95,308.0 MW` | Reported = `95,308.0 MW` â†’ **EXACT MATCH**
3. **U.S. 2024 Solar Generation (`thousand_MWh`):** Independent sum = `357,237.562 thousand_MWh` | Reported = `357,237.562 thousand_MWh` â†’ **EXACT MATCH**
4. **Output Contract & Unit Separation:** All `32` exported items in `intelligence_results.json` contain all 19 required contract fields and strictly separate `MW` from `thousand_MWh`.

## Baseline vs. Method Comparison & Stability
- **Baseline Limitation Demonstrated:** Unstratified baseline mixes `MW` and `thousand_MWh` on a single scale. Partitioned Track A eliminates unit conflation and isolates the complete `2024` EIA year (`n = 1,449`) from the sparse `2022` slice (`n = 7`).
- **Minimum Group Size ($n \ge 5$) & Tie Handling:** Deterministic `dense` ranking is used. Groups with $n < 5$ (7 of 10 global regions and 2 of 10 global plant fuel types) are explicitly marked `quality_status: "conditional"`. Top-3 global regions (`asia_pacific` $n=12$, `europe` $n=8$, `middle_east_&_africa` $n=7$) all exceed $n \ge 5$ and remain stable.

## Final Validation Result
`PASS`

