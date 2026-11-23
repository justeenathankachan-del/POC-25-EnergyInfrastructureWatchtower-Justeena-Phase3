"use client";
import type { IntelligenceSummary } from "@/types/intelligence";

interface Props {
  summary: IntelligenceSummary;
}

export default function KeyFindingsPanel({ summary }: Props) {
  return (
    <section aria-label="Validated Key Findings" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <h2 className="text-base font-semibold text-slate-100">Approved Key Findings</h2>
      <p className="mt-1 text-xs text-slate-400">Primary Analytical Question: {summary.primary_analytical_question}</p>
      <ul className="mt-4 space-y-2.5">
        {summary.key_findings.map((finding, idx) => (
          <li key={idx} className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200">
            <span className="mt-0.5 rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">F{idx + 1}</span>
            <span>{finding}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
