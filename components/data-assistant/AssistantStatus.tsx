"use client";
interface Props { status: "ready" | "retrieving" | "answered" | "unsupported" | "unsafe" | "missing_parameter" | "unavailable" | "error"; dataVersion: string; methodVersion: string; }
export default function AssistantStatus({ status, dataVersion, methodVersion }: Props) {
  const badgeStyle = status === "answered" ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" : status === "unsafe" || status === "error" ? "border-rose-500/40 bg-rose-500/15 text-rose-300" : status === "unsupported" || status === "missing_parameter" || status === "unavailable" ? "border-amber-500/40 bg-amber-500/15 text-amber-300" : "border-cyan-500/40 bg-cyan-500/15 text-cyan-300";
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
      <span className={`rounded border px-2 py-0.5 uppercase ${badgeStyle}`}>Status: {status}</span>
      <span className="text-slate-400">Mode: Deterministic Guided</span>
      <span className="text-slate-500">|</span>
      <span className="text-slate-400">v{dataVersion} / m{methodVersion}</span>
    </div>
  );
}
