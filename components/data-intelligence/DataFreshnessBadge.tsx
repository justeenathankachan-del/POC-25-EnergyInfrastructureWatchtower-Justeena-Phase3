"use client";

interface Props {
  dataVersion: string;
  methodVersion: string;
  generatedAt: string;
  isStale: boolean;
  staleReasons: string[];
}

export default function DataFreshnessBadge({
  dataVersion,
  methodVersion,
  generatedAt,
  isStale,
  staleReasons,
}: Props) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-xs ${
        isStale
          ? "border-amber-500/50 bg-amber-950/30 text-amber-200"
          : "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 font-mono">
        <span className="font-semibold">
          {isStale ? "STALE / VERSION WARNING" : "CURRENT & VALIDATED"}
        </span>
        <span>|</span>
        <span>data_version: {dataVersion}</span>
        <span>|</span>
        <span>method_version: {methodVersion}</span>
        <span>|</span>
        <span>generated_at: {generatedAt}</span>
      </div>
      {isStale && staleReasons.length > 0 && (
        <ul className="mt-1 list-disc pl-4 text-amber-300">
          {staleReasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
