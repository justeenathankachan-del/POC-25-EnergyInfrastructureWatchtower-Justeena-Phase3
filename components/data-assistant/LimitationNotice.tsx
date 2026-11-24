"use client";
export default function LimitationNotice({ limitation }: { limitation: string }) {
  return (
    <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-950/25 px-3 py-2 text-xs text-amber-200">
      <span className="font-semibold">Approved Limitation: </span>
      <span className="text-amber-300/90">{limitation}</span>
    </div>
  );
}
