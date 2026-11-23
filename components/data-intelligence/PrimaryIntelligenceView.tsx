"use client";

import type { IntelligenceResult } from "@/types/intelligence";

interface Props {
  results: IntelligenceResult[];
  selectedId: string | null;
  onSelect: (item: IntelligenceResult) => void;
}

export default function PrimaryIntelligenceView({ results, selectedId, onSelect }: Props) {
  const globalRegions = results
    .filter((r) => r.group_key?.startsWith("global_region:"))
    .sort((a, b) => (a.priority_rank ?? 99) - (b.priority_rank ?? 99));

  const us2024Fuels = results
    .filter((r) => r.group_key?.startsWith("us_2024_fuel:"))
    .sort((a, b) => (a.priority_rank ?? 99) - (b.priority_rank ?? 99));

  const maxRegionMw = Math.max(...globalRegions.map((r) => r.result_value ?? 0), 1);
  const maxUsGen = Math.max(...us2024Fuels.map((r) => r.result_value ?? 0), 1);

  return (
    <section aria-label="Track A Comparative Intelligence Views" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="rounded bg-cyan-500/15 px-2 py-0.5 font-mono text-xs text-cyan-300">
              Unit: MW (Nameplate Capacity)
            </span>
            <h2 className="mt-2 text-base font-semibold text-slate-100">
              Global Curated Plant Capacity by Region
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-400">n = 45 entities</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Groups with fewer than 5 facilities are marked <span className="text-amber-300">conditional</span> per Track A minimum group-size control.
        </p>

        <div className="mt-4 space-y-3">
          {globalRegions.map((item) => {
            const label = (item.group_key ?? "").replace("global_region:", "").replace(/_/g, " ");
            const val = item.result_value ?? 0;
            const pctWidth = Math.max((val / maxRegionMw) * 100, 3);
            const isSelected = selectedId === item.result_id;
            return (
              <button
                key={item.result_id}
                type="button"
                onClick={() => onSelect(item)}
                className={`block w-full rounded-lg border p-2.5 text-left transition ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-950/30"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium capitalize text-slate-200">
                    #{item.priority_rank} {label}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    {item.quality_status === "conditional" && (
                      <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-300">
                        n&lt;5 conditional
                      </span>
                    )}
                    <span className="text-cyan-300">{val.toLocaleString()} MW</span>
                  </div>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      item.quality_status === "validated" ? "bg-cyan-400" : "bg-amber-400"
                    }`}
                    style={{ width: `${pctWidth}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-xs text-emerald-300">
              Unit: thousand_MWh (Net Generation)
            </span>
            <h2 className="mt-2 text-base font-semibold text-slate-100">
              U.S. 2024 Annual Net Generation Benchmark by Fuel
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-400">n = 1,449 records</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Isolated 2024 single-year benchmark (avoids 2022 sample sparsity of n=7). Never combined with MW capacity.
        </p>

        <div className="mt-4 space-y-3">
          {us2024Fuels.map((item) => {
            const label = (item.group_key ?? "").replace("us_2024_fuel:", "").replace(/_/g, " ");
            const val = item.result_value ?? 0;
            const pctWidth = Math.max((val / maxUsGen) * 100, 3);
            const isSelected = selectedId === item.result_id;
            return (
              <button
                key={item.result_id}
                type="button"
                onClick={() => onSelect(item)}
                className={`block w-full rounded-lg border p-2.5 text-left transition ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-950/30"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium capitalize text-slate-200">
                    #{item.priority_rank} {label}
                  </span>
                  <span className="font-mono text-emerald-300">
                    {val.toLocaleString(undefined, { maximumFractionDigits: 1 })} thousand_MWh
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${pctWidth}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
