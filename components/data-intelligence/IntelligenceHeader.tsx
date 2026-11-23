"use client";

import Link from "next/link";
import type { IntelligenceSummary } from "@/types/intelligence";
import DataFreshnessBadge from "./DataFreshnessBadge";

interface Props {
  summary: IntelligenceSummary;
  isStale: boolean;
  staleReasons: string[];
}

export default function IntelligenceHeader({ summary, isStale, staleReasons }: Props) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400">
              <span>{summary.project_id}</span>
              <span>•</span>
              <span>{summary.approved_track}</span>
              <span>•</span>
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                Validation: {summary.validation_result}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-100">
              Energy Infrastructure Intelligence
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-400">
              {summary.decision_to_be_supported}
            </p>
          </div>

          <nav aria-label="Workspace Navigation" className="flex items-center gap-2 self-start sm:self-center">
            <Link
              href="/"
              className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Operational View
            </Link>
            <Link
              href="/data-intelligence"
              aria-current="page"
              className="rounded-lg border border-cyan-500/60 bg-cyan-500/15 px-3.5 py-2 text-xs font-semibold text-cyan-300"
            >
              Data Intelligence
            </Link>
          </nav>
        </div>

        <div className="mt-4">
          <DataFreshnessBadge
            dataVersion={summary.data_version}
            methodVersion={summary.method_version}
            generatedAt={summary.generated_at}
            isStale={isStale}
            staleReasons={staleReasons}
          />
        </div>
      </div>
    </header>
  );
}
