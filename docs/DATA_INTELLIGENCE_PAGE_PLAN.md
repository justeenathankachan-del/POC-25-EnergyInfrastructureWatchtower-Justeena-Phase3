# Data Intelligence Page Plan — PoC-25

## Existing Application & Product Boundary
- **Project**: PoC-25 — Energy Infrastructure Watchtower (`POC-25-EnergyInfrastructureWatchtower-Justeena-Phase3`)
- **Framework**: Next.js 16.4.5 (App Router), React 19, TypeScript, Tailwind CSS
- **Existing Operational Route**: `/` (Interactive Leaflet plant map, regional/fuel filters, and `/api/eia` live electricity generation telemetry — preserved unchanged)
- **New Data Intelligence Route**: `/data-intelligence`

## Approved Analytical Scope & Governance
- **Approved Analytical Track**: Track A — Comparative Intelligence (`Partitioned Comparative Intelligence`)
- **Primary Analytical Question**: How do global power plant nameplate capacities (MW) compare across grid regions and fuel types, and how does U.S. 2024 utility electricity net generation (thousand_MWh) compare across fuel types?
- **Decision to Be Supported**: Guide grid infrastructure planners and energy analysts toward high-capacity regions, dominant generation technologies, and major maintenance baselines without conflating MW capacity with MWh net generation.
- **Data Version**: `1.0.1`
- **Method Version**: `1.0.0`
- **Selected Integration Pattern**: **Pattern B — Static Generated JSON** (build-time validation and copy from `/data-science/outputs/` into `/public/data/intelligence/` via `scripts/data_pipeline/publish_intelligence.py`).

## Page Sections & Track-Specific Components
1. `IntelligenceHeader` + `DataFreshnessBadge`: Displays title, decision purpose, Track A badge, `data_version` (`1.0.1`), `method_version` (`1.0.0`), `generated_at`, validation status (`PASS`), and `Operational View | Data Intelligence` navigation.
2. `IntelligenceSummaryCards`: 4 decision KPI cards (32 validated outputs, Asia Pacific top capacity `77,505 MW`, Hydro top plant fuel `95,308 MW`, Curated maintenance baseline `31,719 MW`).
3. `IntelligenceFilters`: Contract-supported filters for Comparison Domain (`global_region`, `global_plant_fuel`, `us_2024_fuel`, `maintenance_baseline`), Result Category, Quality Status (`validated`, `conditional`), and keyword search.
4. `PrimaryIntelligenceView` (Track A): Side-by-side unit-isolated comparative ranking bars (`MW` nameplate capacity vs. `thousand_MWh` U.S. 2024 net generation) with explicit `n < 5` conditional badges.
5. `PriorityOrExceptionTable`: Sortable, paginated (`10` items/page) explorer across all 32 approved results (`RES-0001`..`RES-0032`).
6. `EvidencePanel`: Record-level factor breakdown, provenance versions, and mandatory analytical limitations.
7. `KeyFindingsPanel`: Displays the 4 approved executive findings directly from `intelligence_summary.json`.
8. `MethodologyPanel` & `LimitationsPanel`: Documents partitioning rules, baseline benchmark, `n >= 5` group threshold, 30-day freshness window, and unsupported uses.

## States, Accessibility & Performance Controls
- **States**: Skeleton loading state, safe contract-failure error screen with retry button (no fabricated fallback), empty filter state with reset button, and stale/version-mismatch banner.
- **Performance**: Never loads `/data/canonical/intelligence_data.csv` into the browser; consumes pre-validated static JSON (`results.json`, `summary.json`, `metadata.json`) with client-side pagination.
- **Accessibility & Responsiveness**: Semantic `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, ARIA labels, keyboard-focusable controls, and responsive `1 -> 2 -> 3/4` column Tailwind grid layouts.
