"use client";
import type { IntelligenceResult } from "@/types/intelligence";
interface Props { item: IntelligenceResult | null; }
export default function EvidencePanel({ item }: Props) {
  if (!item) {
    return (
      <aside aria-label="Evidence Inspector" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <h2 className="text-base font-semibold text-slate-100">Evidence &amp; Limitation Inspector</h2>
        <p className="mt-2 text-xs text-slate-400">Select any bar or table row to inspect supporting calculation factors and limitations.</p>
      </aside>
    );
  }
  return (
    <aside aria-label="Evidence Inspector" className="rounded-xl border border-cyan-500/40 bg-slate-900/90 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-cyan-400">{item.result_id}</span>
        <span className={`rounded px-2 py-0.5 font-mono text-xs ${item.quality_status === "validated" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>{item.quality_status}</span>
      </div>
      <h2 className="mt-2 text-base font-semibold text-slate-100">{item.finding}</h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs">
        <div><dt className="text-slate-400">Group / Entity</dt><dd className="mt-0.5 font-mono text-slate-200">{item.entity_id ?? item.group_key}</dd></div>
        <div><dt className="text-slate-400">Metric Value</dt><dd className="mt-0.5 font-mono font-semibold text-cyan-300">{item.result_value?.toLocaleString()} {item.result_unit}</dd></div>
        <div><dt className="text-slate-400">Data Version</dt><dd className="mt-0.5 font-mono text-slate-200">{item.data_version}</dd></div>
        <div><dt className="text-slate-400">Method Version</dt><dd className="mt-0.5 font-mono text-slate-200">{item.method_version}</dd></div>
      </dl>
      <div className="mt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Supporting Evidence Factors</h3>
        <ul className="mt-2 space-y-2">
          {item.evidence.map((ev, idx) => (
            <li key={idx} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs">
              <span className="font-mono text-slate-300">{ev.factor}</span>
              <span className="font-mono font-semibold text-slate-100">{typeof ev.value === "number" ? ev.value.toLocaleString() : String(ev.value)} {ev.unit ? `(${ev.unit})` : ""}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-950/25 p-3 text-xs text-amber-200">
        <p className="font-semibold">Record-Level Limitation &amp; Guidance</p>
        <p className="mt-1 text-amber-300/90">{item.limitation}</p>
      </div>
    </aside>
  );
}
