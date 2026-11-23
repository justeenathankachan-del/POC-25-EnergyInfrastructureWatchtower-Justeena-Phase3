"use client";
import type { IntelligenceSummary } from "@/types/intelligence";

interface Props {
  summary: IntelligenceSummary;
}

export default function LimitationsPanel({ summary }: Props) {
  return (
    <section aria-label="Analytical Limitations and Unsupported Uses" className="rounded-xl border border-amber-500/30 bg-slate-900/80 p-5">
      <h2 className="text-base font-semibold text-amber-200">Limitations &amp; Unsupported Uses</h2>
      <ul className="mt-3 list-disc space-y-2 pl-4 text-xs text-slate-300">
        {summary.important_limitations.map((lim, idx) => (
          <li key={idx}>{lim}</li>
        ))}
        <li>
          <strong>Unsupported Uses:</strong> Time-series forecasting (Track F rejected in Post #2), live SCADA grid-outage emergency dispatch, and cross-unit totals adding MW to thousand_MWh.
        </li>
      </ul>
    </section>
  );
}
