# Data Intelligence UI Specification — PoC-25

## Route & Navigation
- **Route**: `/data-intelligence` (`app/data-intelligence/page.tsx`)
- **Navigation**: Persistent top navigation bar switching between `/` (**Operational View**) and `/data-intelligence` (**Data Intelligence**), supporting direct URL access and browser refresh.

## Visual & Component Hierarchy
1. **Header (`IntelligenceHeader` & `DataFreshnessBadge`)**: Project ID (`POC-25`), Track A badge, validation status (`PASS`), decision objective, and live version/freshness status bar (`data_version: 1.0.1`, `method_version: 1.0.0`).
2. **Executive Summary Cards (`IntelligenceSummaryCards`)**: 4-column responsive grid highlighting `32` validated outputs, `77,505 MW` top global region (Asia Pacific), `95,308 MW` top global plant fuel (Hydro), and `31,719 MW` curated maintenance baseline.
3. **Filter Bar (`IntelligenceFilters`)**: 4 contract-bound filters (`Comparison Domain`, `Result Category`, `Quality Status`, `Search Finding / Group`), live match counter (`Showing X / 32`), and `Clear Filters` button.
4. **Primary Track A View (`PrimaryIntelligenceView`)**: Dual-card comparative bar visualization isolating `MW` global regional nameplate capacity (`n = 45` entities, flagging `n < 5` groups as `conditional`) from `thousand_MWh` U.S. 2024 net generation (`n = 1,449` records).
5. **Results Explorer & Evidence Inspector (`PriorityOrExceptionTable` + `EvidencePanel`)**: 2/3 + 1/3 desktop split layout pairing the sortable/paginated results table with the live `EvidencePanel` displaying calculation factors, versions, and record-level limitations.
6. **Grounded Findings & Governance (`KeyFindingsPanel`, `MethodologyPanel`, `LimitationsPanel`)**: Displays approved findings `F1`–`F4`, partitioning methodology, baseline benchmark, and explicit unsupported uses.

## UI States, Responsive Layout & Accessibility
- **Loading / Error / Empty / Stale**: Animated skeleton blocks while fetching; rose-bordered contract error card with retry action on failure; clean empty-filter card with `Clear Active Filters`; amber stale-data banner on version or freshness mismatch.
- **Responsive Breakpoints**: Single-column stacked cards on mobile (`< 640px`), 2-column summary/methodology grids on tablet (`sm`/`md`), and 4-column KPI + 2/3-1/3 explorer/inspector layout on desktop (`lg`).
- **Accessibility**: Explicit `<label htmlFor="...">` bindings on all filter/sort inputs, `aria-label` landmarks on all page sections, `aria-current="page"` on active navigation, and high-contrast slate/cyan/emerald/amber palette.
