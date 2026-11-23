import type {
  IntelligenceFilterState,
  IntelligenceMetadata,
  IntelligenceResult,
  IntelligenceSummary,
} from "@/types/intelligence";
import { validateIntelligencePackage } from "./intelligenceValidator";

export interface LoadedIntelligenceBundle {
  summary: IntelligenceSummary;
  results: IntelligenceResult[];
  metadata: IntelligenceMetadata | null;
  isStale: boolean;
  staleReasons: string[];
}

export async function loadIntelligenceBundle(): Promise<LoadedIntelligenceBundle> {
  const [resultsRes, summaryRes, metadataRes] = await Promise.all([
    fetch("/data/intelligence/results.json", { cache: "no-store" }),
    fetch("/data/intelligence/summary.json", { cache: "no-store" }),
    fetch("/data/intelligence/metadata.json", { cache: "no-store" }),
  ]);

  if (!resultsRes.ok || !summaryRes.ok) {
    throw new Error(
      `Failed to load approved intelligence package (results=${resultsRes.status}, summary=${summaryRes.status}).`
    );
  }

  const [resultsJson, summaryJson, metadataJson] = await Promise.all([
    resultsRes.json(),
    summaryRes.json(),
    metadataRes.ok ? metadataRes.json() : Promise.resolve(null),
  ]);

  return validateIntelligencePackage(summaryJson, resultsJson, metadataJson);
}

export function getGroupDomain(groupKey: string | null): string {
  if (!groupKey) return "other";
  return groupKey.split(":")[0] || "other";
}

export function applyIntelligenceFilters(
  items: IntelligenceResult[],
  filters: IntelligenceFilterState
): IntelligenceResult[] {
  const q = filters.searchQuery.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.groupDomain && getGroupDomain(item.group_key) !== filters.groupDomain) {
      return false;
    }
    if (filters.resultCategory && item.result_category !== filters.resultCategory) {
      return false;
    }
    if (filters.qualityStatus && item.quality_status !== filters.qualityStatus) {
      return false;
    }
    if (q) {
      const hay = `${item.result_id} ${item.finding} ${item.group_key ?? ""} ${item.metric_name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
