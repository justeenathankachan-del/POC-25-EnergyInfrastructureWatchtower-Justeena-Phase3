"use client";
import type { GroundedAssistantResponse } from "@/types/assistant";
import LimitationNotice from "./LimitationNotice";
interface Props { response: GroundedAssistantResponse; onSelectFollowUp: (q: string) => void; }
export default function UnsupportedQuestionState({ response, onSelectFollowUp }: Props) {
  const isUnsafe = response.status === "unsafe" || response.status === "error";
  return (
    <div className={`rounded-xl border p-4 ${isUnsafe ? "border-rose-500/50 bg-rose-950/20 text-rose-200" : "border-amber-500/50 bg-amber-950/20 text-amber-200"}`}>
      <div className="flex items-center justify-between font-mono text-[11px]">
        <span>{response.answer_id} • {response.classification}</span>
        <span>data_version: {response.metadata.data_version} | method_version: {response.metadata.method_version}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed">{response.answer}</p>
      <LimitationNotice limitation={response.limitation} />
      {response.suggested_follow_ups.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-medium text-slate-300">Approved Alternatives:</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {response.suggested_follow_ups.map((q) => (
              <button key={q} type="button" onClick={() => onSelectFollowUp(q)} className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300">{q}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
