"use client";

import type { IntelligenceResult, IntelligenceSummary } from "@/types/intelligence";

interface Props {
  summary: IntelligenceSummary;
  results: IntelligenceResult[];
}

export default function IntelligenceSummaryCards({ summary, results }: Props) {
  const topRegion = results.find((r) => r.group_key === "global_region:asia_pacific");
  const topHydro = results.find((r) => r.group_key === "global_plant_fuel:hydro");
  const validatedCount = results.filter((r) => r.quality_status === "validated").length;
  const conditionalCount = results.filter((r) => r.quality_status === "conditional").length;

  const cards = [
    {
      label: "Validated Intelligence Outputs",
      value: `${summary.result_count}`,
      sub: `${validatedCount} validated • ${conditionalCount} conditional (n<5 or baseline)`,
    },
    {
      label: "Top Global Capacity Region (MW)",
      value: topRegion ? `${topRegion.result_value?.toLocaleString()} MW` : "—",
      sub: "Asia Pacific (38.51% of 201,264 MW curated registry)",
    },
    {
      label: "Leading Global Plant Fuel (MW)",
      value: topHydro ? `${topHydro.result_value?.toLocaleString()} MW` : "—",
      sub: "Hydroelectric (47.39% of curated registry capacity)",
    },
    {
      label: "Curated Maintenance Baseline (MW)",
      value: "31,719 MW",
      sub: "5 flagship stations (static baseline status, non-SCADA)",
    },
  ];

  return (
    <section aria-label="Executive Intelligence Summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{card.label}</p>
          <p className="mt-2 font-mono text-2xl font-bold text-slate-100">{card.value}</p>
          <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
        </div>
      ))}
    </section>
  );
}
