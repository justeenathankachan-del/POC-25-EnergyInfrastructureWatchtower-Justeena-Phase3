"use client";
import { useState } from "react";
import type { IntelligenceResult, IntelligenceSummary } from "@/types/intelligence";
import type { GroundedAssistantResponse } from "@/types/assistant";
import { runDeterministicAssistant, SUGGESTED_QUESTIONS } from "@/services/assistantEngine";
import AssistantStatus from "./AssistantStatus";
import SuggestedQuestions from "./SuggestedQuestions";
import QuestionInput from "./QuestionInput";
import AnswerCard from "./AnswerCard";
interface Props { summary: IntelligenceSummary; results: IntelligenceResult[]; onInspectResult: (resultId: string) => void; }
export default function AssistantPanel({ summary, results, onInspectResult }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [question, setQuestion] = useState("");
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [response, setResponse] = useState<GroundedAssistantResponse | null>(null);
  const handleAsk = (promptText?: string) => {
    const query = (promptText ?? question).trim();
    if (!query) return;
    setQuestion(query);
    setIsRetrieving(true);
    try { setResponse(runDeterministicAssistant(query, summary, results)); } finally { setIsRetrieving(false); }
  };
  return (
    <section aria-label="Grounded Data Intelligence Assistant" className="rounded-xl border border-cyan-500/30 bg-slate-900/85 p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Grounded Intelligence Assistant (Track A Deterministic Retrieval)</h2>
          <p className="mt-0.5 text-xs text-slate-400">Ask approved comparative questions grounded strictly in the 32 validated Track A findings and evidence factors.</p>
        </div>
        <div className="flex items-center gap-3">
          <AssistantStatus status={isRetrieving ? "retrieving" : response ? response.status : "ready"} dataVersion={summary.data_version} methodVersion={summary.method_version} />
          <button type="button" onClick={() => setIsOpen((v) => !v)} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700">{isOpen ? "Collapse" : "Expand"}</button>
        </div>
      </div>
      {isOpen && (
        <div className="mt-4 space-y-4">
          <SuggestedQuestions questions={SUGGESTED_QUESTIONS} onSelect={(q) => handleAsk(q)} disabled={isRetrieving} />
          <QuestionInput value={question} onChange={setQuestion} onSubmit={() => handleAsk()} disabled={isRetrieving} />
          {response && <AnswerCard response={response} onInspectResult={onInspectResult} onSelectFollowUp={(q) => handleAsk(q)} />}
        </div>
      )}
    </section>
  );
}
