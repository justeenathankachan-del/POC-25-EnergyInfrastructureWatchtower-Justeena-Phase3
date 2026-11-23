"use client";

import { useState } from "react";
import type { IntelligenceResult } from "@/types/intelligence";

interface Props {
  results: IntelligenceResult[];
  selectedId: string | null;
  onSelect: (item: IntelligenceResult) => void;
}

const PAGE_SIZE = 10;

export default function PriorityOrExceptionTable({ results, selectedId, onSelect }: Props) {
  const [sortBy, setSortBy] = useState<"rank" | "value" | "id">("id");
  const [page, setPage] = useState(1);

  const sorted = [...results].sort((a, b) => {
    if (sortBy === "rank") return (a.priority_rank ?? 999) - (b.priority_rank ?? 999);
    if (sortBy === "value") return (b.result_value ?? 0) - (a.result_value ?? 0);
    return a.result_id.localeCompare(b.result_id);
  });

  const totalPages = Math.max(Math.ceil(sorted.length / PAGE_SIZE), 1);
  const safePage = Math.min(page, totalPages);
  const pageItems = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section aria-label="Validated Comparative Results Table" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            Approved Intelligence Results Explorer
          </h2>
          <p className="text-xs text-slate-400">
            Select any row to inspect supporting evidence factors and record-level limitations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="sort-select" className="text-slate-400">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "rank" | "value" | "id");
              setPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-slate-100"
          >
            <option value="id">Result ID (RES-0001..)</option>
            <option value="rank">Priority Rank (#1 first)</option>
            <option value="value">Metric Value (High to Low)</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 pr-3">ID</th>
              <th className="py-2.5 pr-3">Rank</th>
              <th className="py-2.5 pr-3">Group / Entity</th>
              <th className="py-2.5 pr-3">Value &amp; Unit</th>
              <th className="py-2.5 pr-3">Quality</th>
              <th className="py-2.5 pr-3">Finding</th>
              <th className="py-2.5">Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {pageItems.map((item) => {
              const isSelected = selectedId === item.result_id;
              return (
                <tr
                  key={item.result_id}
                  onClick={() => onSelect(item)}
                  className={`cursor-pointer transition ${
                    isSelected ? "bg-cyan-950/40" : "hover:bg-slate-800/40"
                  }`}
                >
                  <td className="py-2.5 pr-3 font-mono text-cyan-300">{item.result_id}</td>
                  <td className="py-2.5 pr-3 font-mono text-slate-300">#{item.priority_rank ?? "—"}</td>
                  <td className="py-2.5 pr-3 font-mono text-slate-300">{item.group_key}</td>
                  <td className="py-2.5 pr-3 font-mono font-semibold text-slate-100">
                    {item.result_value?.toLocaleString()} {item.result_unit}
                  </td>
                  <td className="py-2.5 pr-3">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[11px] ${
                        item.quality_status === "validated"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {item.quality_status}
                    </span>
                  </td>
                  <td className="max-w-md py-2.5 pr-3 text-slate-300">{item.finding}</td>
                  <td className="py-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(item);
                      }}
                      className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 font-medium text-cyan-300 hover:bg-cyan-500/20"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>
          Page {safePage} of {totalPages} ({results.length} total items)
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded border border-slate-700 px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded border border-slate-700 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
