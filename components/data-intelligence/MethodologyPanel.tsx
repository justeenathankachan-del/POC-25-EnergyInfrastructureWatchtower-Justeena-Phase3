"use client";
import type { IntelligenceSummary } from "@/types/intelligence";

interface Props {
  summary: IntelligenceSummary;
}

export default function MethodologyPanel({ summary }: Props) {
  return (
    <section aria-label="Methodology and Governance" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <h2 className="text-base font-semibold text-slate-100">Methodology &amp; Validation Controls</h2>
      <dl className="mt-3 space-y-2.5 text-xs">
        <div>
          <dt className="font-medium text-slate-400">Approved Analytical Track</dt>
          <dd className="mt-0.5 text-slate-200">{summary.approved_track}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-400">Method &amp; Partitioning Rule</dt>
          <dd className="mt-0.5 text-slate-300">
            Partitioned Comparative Intelligence (method_version {summary.method_version}) strictly separating 45 global power plant entities (nameplate capacity in MW) from 1,787 U.S. EIA utility measurements (net generation in thousand_MWh), with minimum group size n &ge; 5 quality flags and dense tie-breaking.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-400">Baseline Benchmark</dt>
          <dd className="mt-0.5 text-slate-300">
            {summary.baseline_summary?.method ?? "Unstratified Category Total & Mean Ranking"} — demonstrated cross-unit conflation risk and justified record_type partitioning.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-400">Validation &amp; Versions</dt>
          <dd className="mt-0.5 font-mono text-emerald-300">
            Result: {summary.validation_result} | data_version: {summary.data_version} | method_version: {summary.method_version}
          </dd>
        </div>
      </dl>
    </section>
  );
}
