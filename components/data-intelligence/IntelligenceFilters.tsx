"use client";

import type { IntelligenceFilterState } from "@/types/intelligence";

interface Props {
  filters: IntelligenceFilterState;
  onChange: (next: IntelligenceFilterState) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function IntelligenceFilters({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
}: Props) {
  return (
    <section
      aria-label="Intelligence Filters"
      className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-4">
          <div>
            <label htmlFor="filter-domain" className="block text-xs font-medium text-slate-400">
              Comparison Domain (Unit Scope)
            </label>
            <select
              id="filter-domain"
              value={filters.groupDomain}
              onChange={(e) => onChange({ ...filters, groupDomain: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
            >
              <option value="">All Domains (MW &amp; thousand_MWh)</option>
              <option value="global_region">Global Regions (MW Capacity)</option>
              <option value="global_plant_fuel">Global Plant Fuels (MW Capacity)</option>
              <option value="us_2024_fuel">U.S. 2024 Generation (thousand_MWh)</option>
              <option value="maintenance_baseline">Maintenance Baseline (MW Capacity)</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-category" className="block text-xs font-medium text-slate-400">
              Result Category
            </label>
            <select
              id="filter-category"
              value={filters.resultCategory}
              onChange={(e) => onChange({ ...filters, resultCategory: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
            >
              <option value="">All Result Categories</option>
              <option value="high_concentration">High Concentration</option>
              <option value="standard_concentration">Standard Concentration</option>
              <option value="dominant_fuel">Dominant Fuel</option>
              <option value="secondary_fuel">Secondary Fuel</option>
              <option value="top_contributor">Top Contributor (U.S. 2024)</option>
              <option value="moderate_contributor">Moderate Contributor (U.S. 2024)</option>
              <option value="curated_maintenance_baseline">Curated Maintenance Baseline</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-quality" className="block text-xs font-medium text-slate-400">
              Quality Status
            </label>
            <select
              id="filter-quality"
              value={filters.qualityStatus}
              onChange={(e) => onChange({ ...filters, qualityStatus: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
            >
              <option value="">All Quality Statuses</option>
              <option value="validated">Validated (n &ge; 5)</option>
              <option value="conditional">Conditional (n &lt; 5 or Baseline)</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-search" className="block text-xs font-medium text-slate-400">
              Search Finding / Group
            </label>
            <input
              id="filter-search"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
              placeholder="e.g. solar, asia_pacific, Guri..."
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
          <span className="font-mono text-xs text-slate-400">
            Showing {filteredCount} / {totalCount}
          </span>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </section>
  );
}
