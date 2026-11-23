"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { IntelligenceFilterState, IntelligenceResult } from "@/types/intelligence";
import { applyIntelligenceFilters, loadIntelligenceBundle, type LoadedIntelligenceBundle } from "@/services/intelligenceService";
import IntelligenceHeader from "@/components/data-intelligence/IntelligenceHeader";
import IntelligenceSummaryCards from "@/components/data-intelligence/IntelligenceSummaryCards";
import IntelligenceFilters from "@/components/data-intelligence/IntelligenceFilters";
import PrimaryIntelligenceView from "@/components/data-intelligence/PrimaryIntelligenceView";
import PriorityOrExceptionTable from "@/components/data-intelligence/PriorityOrExceptionTable";
import EvidencePanel from "@/components/data-intelligence/EvidencePanel";
import KeyFindingsPanel from "@/components/data-intelligence/KeyFindingsPanel";
import MethodologyPanel from "@/components/data-intelligence/MethodologyPanel";
import LimitationsPanel from "@/components/data-intelligence/LimitationsPanel";

const DEFAULT_FILTERS: IntelligenceFilterState = {
  groupDomain: "",
  resultCategory: "",
  qualityStatus: "",
  searchQuery: "",
};

export default function DataIntelligencePage() {
  const [bundle, setBundle] = useState<LoadedIntelligenceBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IntelligenceFilterState>(DEFAULT_FILTERS);
  const [selectedResult, setSelectedResult] = useState<IntelligenceResult | null>(null);

  const fetchBundle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await loadIntelligenceBundle();
      setBundle(loaded);
      setSelectedResult(loaded.results[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown intelligence contract error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBundle();
  }, [fetchBundle]);

  const filteredResults = useMemo(
    () => (bundle ? applyIntelligenceFilters(bundle.results, filters) : []),
    [bundle, filters]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="h-24 animate-pulse rounded-xl bg-slate-900" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-28 animate-pulse rounded-xl bg-slate-900" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-xl bg-slate-900" />
        </div>
      </main>
    );
  }

  if (error || !bundle) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
        <div className="max-w-lg rounded-xl border border-rose-500/50 bg-rose-950/20 p-6">
          <h1 className="text-lg font-bold text-rose-300">Intelligence Output Contract Failure</h1>
          <p className="mt-2 text-xs text-slate-300">
            The approved Post #3 intelligence package failed validation or could not be loaded.
          </p>
          <pre className="mt-3 overflow-x-auto rounded bg-slate-950 p-3 font-mono text-xs text-rose-200">
            {error ?? "Missing intelligence bundle"}
          </pre>
          <button
            type="button"
            onClick={fetchBundle}
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500"
          >
            Retry Loading Package
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <IntelligenceHeader
        summary={bundle.summary}
        isStale={bundle.isStale}
        staleReasons={bundle.staleReasons}
      />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <IntelligenceSummaryCards summary={bundle.summary} results={bundle.results} />
        <IntelligenceFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          totalCount={bundle.results.length}
          filteredCount={filteredResults.length}
        />
        {filteredResults.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center">
            <h2 className="text-base font-semibold text-slate-200">No Matching Intelligence Results</h2>
            <p className="mt-1 text-xs text-slate-400">
              No validated findings match your active filter combination.
            </p>
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="mt-4 rounded-lg border border-cyan-500/50 bg-cyan-500/15 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/25"
            >
              Clear Active Filters
            </button>
          </div>
        ) : (
          <>
            <PrimaryIntelligenceView
              results={bundle.results}
              selectedId={selectedResult?.result_id ?? null}
              onSelect={setSelectedResult}
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <PriorityOrExceptionTable
                  results={filteredResults}
                  selectedId={selectedResult?.result_id ?? null}
                  onSelect={setSelectedResult}
                />
              </div>
              <div>
                <EvidencePanel item={selectedResult} />
              </div>
            </div>
          </>
        )}
        <KeyFindingsPanel summary={bundle.summary} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MethodologyPanel summary={bundle.summary} />
          <LimitationsPanel summary={bundle.summary} />
        </div>
      </main>
    </div>
  );
}
