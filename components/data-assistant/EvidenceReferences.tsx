"use client";
import type { EvidenceReference } from "@/types/assistant";
interface Props { references: EvidenceReference[]; onInspectResult: (resultId: string) => void; }
export default function EvidenceReferences({ references, onInspectResult }: Props) {
  if (!references.length) return null;
  return (
    <div className="mt-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Traceable Evidence References (Click to Inspect)</p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {references.map((ref, idx) => (
          <button key={`${ref.result_id}-${idx}`} type="button" onClick={() => onInspectResult(ref.result_id)} className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 font-mono text-[11px] text-cyan-300 transition hover:bg-cyan-500/20">{ref.result_id}: {ref.label}</button>
        ))}
      </div>
    </div>
  );
}
