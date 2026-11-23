# Intelligence Static Integration Contract — PoC-25

## Integration Pattern
- **Pattern**: Pattern B — Static Generated JSON (`data_version: 1.0.1`, `method_version: 1.0.0`).
- **Maintained Source**: `/data-science/outputs/intelligence_results.json`, `/data-science/outputs/intelligence_summary.json`, `/data-science/outputs/validation_metrics.json`.
- **Build-Time Generator**: `python scripts/data_pipeline/publish_intelligence.py` (executed automatically inside `npm run build` before `next build`).

## Generated Static Endpoints
1. `GET /data/intelligence/results.json`: Array of 32 validated `IntelligenceResult` objects (`RES-0001` to `RES-0032`).
2. `GET /data/intelligence/summary.json`: Canonical `IntelligenceSummary` object containing executive findings, baseline metadata, and limitations.
3. `GET /data/intelligence/metadata.json`: Package identity, version numbers (`1.0.1` / `1.0.0`), `validation_status: "PASS"`, and `freshness_window_days: 30`.

## Client-Side Querying, Sorting & Pagination
- **Filtering (`services/intelligenceService.ts`)**: `groupDomain` (`global_region`, `global_plant_fuel`, `us_2024_fuel`, `maintenance_baseline`), `resultCategory`, `qualityStatus` (`validated`, `conditional`), and `searchQuery`.
- **Sorting (`PriorityOrExceptionTable.tsx`)**: Result ID (`RES-0001..`), Priority Rank (`#1` first), or Metric Value (descending).
- **Pagination**: 10 items per page (`4` pages total for 32 items).

## Validation, Caching & Security Controls
- **Caching**: Fetched with `{ cache: "no-store" }` so newly published builds are immediately reflected without stale browser cache.
- **Contract Validation (`services/intelligenceValidator.ts`)**: Rejects missing mandatory fields, duplicate `result_id`s, invalid ISO timestamps, unsupported `quality_status` values, or non-JSON payloads, rendering a safe error screen without fabricated fallback numbers.
- **Freshness & Version Guardrail**: Flags `isStale = true` if `data_version !== "1.0.1"`, `method_version !== "1.0.0"`, `summary.result_count !== results.length`, or `generated_at` exceeds 30 days.
- **Payload Safety**: Public JSON bundle is ~24 KB total; the canonical CSV (`/data/canonical/intelligence_data.csv`) is never loaded into the browser.
