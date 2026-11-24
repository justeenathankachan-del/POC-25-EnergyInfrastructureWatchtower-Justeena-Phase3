"use client";
interface Props { questions: string[]; onSelect: (q: string) => void; disabled?: boolean; }
export default function SuggestedQuestions({ questions, onSelect, disabled }: Props) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">Approved Guided Questions:</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {questions.map((q) => (
          <button key={q} type="button" disabled={disabled} onClick={() => onSelect(q)} className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-left text-xs text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-300 disabled:opacity-50">{q}</button>
        ))}
      </div>
    </div>
  );
}
