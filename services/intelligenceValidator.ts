import type {
  IntelligenceMetadata,
  IntelligenceResult,
  IntelligenceSummary,
} from "@/types/intelligence";

const ALLOWED_STATUSES = new Set(["validated", "conditional", "rejected"]);
export const EXPECTED_DATA_VERSION = "1.0.1";
export const EXPECTED_METHOD_VERSION = "1.0.0";

export function validateIntelligenceResult(value: unknown): asserts value is IntelligenceResult {
  if (!value || typeof value !== "object") {
    throw new Error("Contract Error: Intelligence result must be a JSON object.");
  }
  const item = value as Record<string, unknown>;
  const requiredStrings = [
    "result_id",
    "result_type",
    "metric_name",
    "finding",
    "method_version",
    "data_version",
    "generated_at",
    "quality_status",
    "limitation",
  ];
  for (const field of requiredStrings) {
    if (typeof item[field] !== "string" || !item[field]) {
      throw new Error(`Contract Error: Missing or invalid mandatory string field '${field}'.`);
    }
  }
  if (!ALLOWED_STATUSES.has(String(item.quality_status))) {
    throw new Error(`Contract Error: Unsupported quality_status '${String(item.quality_status)}'.`);
  }
  if (!Array.isArray(item.evidence)) {
    throw new Error(`Contract Error: 'evidence' must be an array on ${String(item.result_id)}.`);
  }
  if (Number.isNaN(Date.parse(String(item.generated_at)))) {
    throw new Error(`Contract Error: Invalid ISO timestamp 'generated_at' on ${String(item.result_id)}.`);
  }
}

export function validateIntelligencePackage(
  summary: unknown,
  results: unknown,
  metadata?: unknown
): {
  summary: IntelligenceSummary;
  results: IntelligenceResult[];
  metadata: IntelligenceMetadata | null;
  isStale: boolean;
  staleReasons: string[];
} {
  if (!summary || typeof summary !== "object") {
    throw new Error("Contract Error: intelligence summary must be an object.");
  }
  const sum = summary as IntelligenceSummary;
  if (!sum.data_version || !sum.method_version || !sum.approved_track || !Array.isArray(sum.key_findings)) {
    throw new Error("Contract Error: intelligence summary is missing required metadata fields.");
  }
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("Contract Error: intelligence results must be a non-empty array.");
  }
  if (sum.result_count !== results.length) {
    throw new Error(
      `Contract Error: Summary result_count (${sum.result_count}) does not match loaded results (${results.length}).`
    );
  }
  if (sum.data_version !== EXPECTED_DATA_VERSION) {
    throw new Error(
      `Contract Error: Incompatible data_version '${sum.data_version}' (expected '${EXPECTED_DATA_VERSION}').`
    );
  }
  if (sum.method_version !== EXPECTED_METHOD_VERSION) {
    throw new Error(
      `Contract Error: Incompatible method_version '${sum.method_version}' (expected '${EXPECTED_METHOD_VERSION}').`
    );
  }

  const seenIds = new Set<string>();
  const validatedResults: IntelligenceResult[] = [];
  const staleReasons: string[] = [];

  for (const raw of results) {
    validateIntelligenceResult(raw);
    if (seenIds.has(raw.result_id)) {
      throw new Error(`Contract Error: Duplicate result_id '${raw.result_id}'.`);
    }
    seenIds.add(raw.result_id);
    if (raw.data_version !== sum.data_version || raw.method_version !== sum.method_version) {
      throw new Error(
        `Contract Error: Version mismatch on ${raw.result_id} (${raw.data_version}/${raw.method_version}).`
      );
    }
    if (raw.quality_status !== "rejected") {
      validatedResults.push(raw);
    }
  }

  const parsedGen = Date.parse(sum.generated_at);
  if (Number.isNaN(parsedGen)) {
    throw new Error("Contract Error: Invalid summary generated_at timestamp.");
  }
  const ageDays = (Date.now() - parsedGen) / (1000 * 60 * 60 * 24);
  if (ageDays > 30) {
    staleReasons.push(`Package is ${Math.floor(ageDays)} days old (exceeds 30-day freshness rule).`);
  }

  return {
    summary: sum,
    results: validatedResults,
    metadata: (metadata as IntelligenceMetadata) ?? null,
    isStale: staleReasons.length > 0,
    staleReasons: Array.from(new Set(staleReasons)),
  };
}
