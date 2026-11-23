# Data Intelligence User Acceptance Testing (UAT) — PoC-25

| Test | Expected Result | Actual Result | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| Route access | `/data-intelligence` opens directly and via navigation from `/` | Route renders static pre-built page and supports browser refresh | PASS | `next build` route `○ /data-intelligence` |
| Summary cards | Approved Post #3 values display (`32` outputs, `77,505 MW`, `95,308 MW`, `31,719 MW`) | All 4 executive KPI cards match `intelligence_summary.json` and `intelligence_results.json` | PASS | `IntelligenceSummaryCards.tsx` |
| Filters | Domain, category, quality status, and search filters update table counts accurately | Filtering updates `Showing X / 32` and resets to empty state with `Clear Active Filters` when 0 match | PASS | `IntelligenceFilters.tsx` |
| Primary view | Track A comparative bars display separated `MW` and `thousand_MWh` rankings | Global regions (`MW`) and U.S. 2024 fuels (`thousand_MWh`) render in separate panels with `n<5 conditional` tags | PASS | `PrimaryIntelligenceView.tsx` |
| Evidence access | Clicking any bar or table `Inspect` button opens supporting factors and limitations | `EvidencePanel` displays `evidence[]` factors, `data_version`, `method_version`, and `limitation` | PASS | `EvidencePanel.tsx` |
| Methodology | Approved track, partitioning rule, baseline, and versions are visible | `MethodologyPanel` displays Track A, `1.0.1` / `1.0.0`, and baseline summary | PASS | `MethodologyPanel.tsx` |
| Limitations | Analytical limitations and unsupported uses are clearly visible | `LimitationsPanel` displays all 4 canonical limitations plus Track F / SCADA unsupported-use warnings | PASS | `LimitationsPanel.tsx` |
| Error & stale states | Invalid/missing JSON fails safely; version/age mismatch triggers warning | `validateIntelligencePackage` throws contract errors to safe error screen and flags `isStale` banner | PASS | `services/intelligenceValidator.ts` |
| Mobile layout | Layout remains readable and usable on narrow mobile viewports | Responsive `grid-cols-1` stacking and `overflow-x-auto` table wrapper prevent clipping | PASS | `app/data-intelligence/page.tsx` |
| Operational regression | Existing `/` operational dashboard remains completely functional | `/` map, EIA API (`/api/eia`), and filters remain intact and build cleanly | PASS | `docs/OPERATIONAL_PAGE_REGRESSION_REPORT.md` |
