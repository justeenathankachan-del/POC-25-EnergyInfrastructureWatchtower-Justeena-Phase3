"use client";
import type { GroundedAssistantResponse } from "@/types/assistant";
import EvidenceReferences from "./EvidenceReferences";
import LimitationNotice from "./LimitationNotice";
import UnsupportedQuestionState from "./UnsupportedQuestionState";
interface Props { response: GroundedAssistantResponse; onInspectResult: (resultId: string) => void; onSelectFollowUp: (q: string) => void; }
export default function AnswerCard({ response, onInspectResult, onSelectFollowUp }: Props) {
  if (response.status !== "answered") return <UnsupportedQuestionState response={response} onSelectFollowUp={onSelectFollowUp} />;
  return (
    <div className="rounded-xl border border-cyan-500/40 bg-slate-950/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate-400">
        <span className="text-cyan-400">{response.answer_id} • Intent: {response.intent} • Quality: {response.metadata.quality_status}</span>
        <span>data_version: {response.metadata.data_version} | method_version: {response.metadata.method_version}</span>
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-slate-100">{response.answer}</p>
      {response.key_values.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {response.key_values.map((kv, idx) => (
            <div key={`${kv.name}-${idx}`} className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-[11px]">
              <span className="text-slate-400">{kv.name}: </span>
              <span className="font-semibold text-emerald-300">{typeof kv.value === "number" ? kv.value.toLocaleString() : kv.value}</span>
              {kv.unit && <span className="text-slate-400"> {kv.unit}</span>}
            </div>
          ))}
        </div>
      )}
      <EvidenceReferences references={response.evidence_references} onInspectResult={onInspectResult} />
      <LimitationNotice limitation={response.limitation} />
      {response.suggested_follow_ups.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400">Follow-up:</span>
          {response.suggested_follow_ups.map((q) => (
            <button key={q} type="button" onClick={() => onSelectFollowUp(q)} className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300">{q}</button>
          ))}
        </div>
      )}
    </div>
  );
}
