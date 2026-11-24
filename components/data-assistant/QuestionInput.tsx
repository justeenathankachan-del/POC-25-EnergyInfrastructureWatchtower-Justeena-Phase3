"use client";
interface Props { value: string; onChange: (val: string) => void; onSubmit: () => void; disabled?: boolean; }
export default function QuestionInput({ value, onChange, onSubmit, disabled }: Props) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="assistant-question-input" className="sr-only">Ask a grounded Track A question</label>
      <input id="assistant-question-input" type="text" maxLength={500} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} placeholder="Ask about top regions (MW), U.S. 2024 fuel generation, maintenance baseline, or RES-0001..." className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none" />
      <button type="submit" disabled={disabled || !value.trim()} className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-40">Query Evidence</button>
    </form>
  );
}
