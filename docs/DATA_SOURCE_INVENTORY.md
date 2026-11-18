# Data Source Inventory

## Project
- **PoC ID:** POC-25
- **PoC Title:** Energy Infrastructure Watchtower
- **Phase:** Phase 3 — Post #1 (Canonical Data Foundation)
- **Data Version:** 1.0.0

## Existing Application Data Flow
The Phase 2 Next.js operational dashboard combines two data sources:
1. A server-side API route (`app/api/eia/route.ts`) that queries the U.S. Energy Information Administration (EIA) Open Data API v2 for electric power operational generation data.
2. A curated static registry (`app/plantsData.ts`) containing 45 major global power plants with geospatial coordinates, nameplate capacity (`MW`), fuel type, region, and operational status rendered on the interactive Leaflet map (`app/PowerPlantMap.tsx`).

| Source | Type | Access Method | Current Usage | Raw Size | Record Count | Sensitivity | Phase 3 Decision |
|---|---|---|---|---:|---:|---|---|
| EIA API v2 (`electricity/electric-power-operational-data`) | Public API | REST GET via `app/api/eia/route.ts` and `extract_data.py` | Displays U.S. utility electricity generation metrics | ~0.85 MB (5,000-row extract) | 5,000 | Public (U.S. Gov Open Data) | Use (sampled offline snapshot) |
| Global Power Plant Registry (`app/plantsData.ts`) | Static TypeScript Array | Direct file parse in `extract_data.py` | Renders 45 global infrastructure markers on map | ~0.01 MB | 45 | Public / Curated Infrastructure | Use (100% preserved) |

## Excluded Sources
- None. All application sources are safe, public, and included in the canonical package.

## Licensing or Access Notes
- **EIA API v2:** Public domain U.S. federal energy statistics provided by the U.S. Energy Information Administration. Requires an API key only during initial extraction (`extract_data.py`), which is stored in `.env.local` (gitignored) and never committed.
- **Global Power Plant Registry (`app/plantsData.ts`):** Publicly known major energy generation facilities compiled for educational/analytical visualization.

## Data Risks
- **Live API Dependency Risk:** Relying on live EIA API calls during builds or analytical runs can fail due to rate limits or missing environment variables. Mitigated by capturing an offline representative sample (`source_sample.csv`) and canonical package (`intelligence_data.csv`).
- **Personal / Restricted Data Risk:** None (`contains_personal_data: false`). Neither source contains PII, financial records, or restricted credentials.

## Selected Phase 3 Source
- Combined canonical dataset (`/data/canonical/intelligence_data.csv`, `1,832` records) unifying all `45` power plant entities (`record_type: "entity"`) and `1,787` stratified EIA operational generation observations (`record_type: "measurement"`).
-