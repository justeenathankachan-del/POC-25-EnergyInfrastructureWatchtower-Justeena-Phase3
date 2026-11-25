import type { AssistantIntent, EvidenceReference, GroundedAssistantResponse, KeyValueItem, ScopeClassification } from "@/types/assistant";
import type { IntelligenceResult, IntelligenceSummary } from "@/types/intelligence";
import { EXPECTED_DATA_VERSION, EXPECTED_METHOD_VERSION } from "./intelligenceValidator";

export const SUGGESTED_QUESTIONS: string[] = [
  "Which global regions have the highest curated generation capacity?",
  "How does U.S. electricity generation compare across fuel categories?",
  "Which curated facilities are marked for maintenance?",
  "What evidence supports ranking RES-0001?",
  "Summarize the approved Track A comparative intelligence findings",
  "What are the analytical limitations and data versions?",
];

const UNSAFE_TERMS = ["ignore previous instructions", "ignore your instructions", "system prompt", "environment variable", "process.env", "secret", "api_key", "all records", "dump csv", "run sql", "execute code", "eval(", "change the score", "change the rank"];
const OUT_OF_SCOPE_TERMS = ["predict", "forecast", "next year", "2025", "2026", "2030", "live outage", "scada", "grid failure", "probability", "who is responsible", "owner"];
const DEFAULT_FOLLOW_UPS = [
  "Which global regions have the highest curated generation capacity?",
  "How does U.S. electricity generation compare across fuel categories?",
  "Which curated facilities are marked for maintenance?",
];

function classifyScopeAndIntent(question: string): { classification: ScopeClassification; intent: AssistantIntent | null; params: Record<string, string | number>; message?: string } {
  const trimmed = question.trim();
  if (!trimmed || trimmed.length > 500) return { classification: "UNSAFE", intent: null, params: {}, message: "Question must be between 1 and 500 characters." };
  const lower = trimmed.toLowerCase();
  if (UNSAFE_TERMS.some((t) => lower.includes(t))) return { classification: "UNSAFE", intent: null, params: {}, message: "Request refused: cannot reveal prompts, access secrets, dump raw tables, or alter intelligence outputs." };
  if (OUT_OF_SCOPE_TERMS.some((t) => lower.includes(t))) return { classification: "OUT_OF_SCOPE", intent: null, params: {}, message: "Outside approved Track A scope: forecasting, live SCADA outage status, and ownership inference are unsupported." };
  const resMatch = trimmed.match(/\bRES-\d{4}\b/i);
  if (resMatch) return { classification: "SUPPORTED", intent: "explain_result", params: { result_id: resMatch[0].toUpperCase() } };
  if (/\b(explain|evidence|why|support)\b.*\b(result|ranking|rank)\b/i.test(trimmed)) return { classification: "MISSING_PARAMETER", intent: "explain_result", params: {}, message: "Please specify an approved result ID (e.g., RES-0001 through RES-0032)." };
  if (/\b(maintenance|outage|flagship|guri|taichung|ratcliffe|kashiwazaki|bruce)\b/i.test(lower)) return { classification: "SUPPORTED", intent: "list_maintenance_items", params: { limit: 5 } };
  if (/\b(u\.?s\.?|eia|2024|generation|thousand_mwh)\b/i.test(lower)) return { classification: "SUPPORTED", intent: "compare_groups", params: { domain: "us_2024_fuel", limit: 8 } };
  if (/\b(plant fuel|fuel mix|hydro|coal|nuclear|gas|wind)\b/i.test(lower) && !/\b(u\.?s\.?|eia)\b/i.test(lower)) return { classification: "SUPPORTED", intent: "compare_groups", params: { domain: "global_plant_fuel", limit: 9 } };
  if (/\b(region|asia|europe|americas|capacity|mw|highest|top|rank|compare)\b/i.test(lower)) return { classification: "SUPPORTED", intent: "compare_groups", params: { domain: "global_region", limit: 5 } };
  if (/\b(version|freshness|updated|generated|timestamp)\b/i.test(lower)) return { classification: "SUPPORTED", intent: "get_data_freshness", params: {} };
  if (/\b(method|methodology|baseline|partition|validation)\b/i.test(lower)) return { classification: "SUPPORTED", intent: "explain_method", params: {} };
  if (/\b(limitation|caveat|warning|weak|bias|unsupported)\b/i.test(lower)) return { classification: "SUPPORTED", intent: "explain_limitation", params: {} };
  if (/\b(summary|overview|key finding|findings|what requires attention)\b/i.test(lower)) return { classification: "SUPPORTED", intent: "get_summary", params: {} };
  return { classification: "OUT_OF_SCOPE", intent: null, params: {}, message: "Question does not match an approved Track A intent. Select one of the supported questions below." };
}
export function runDeterministicAssistant(question: string, summary: IntelligenceSummary, results: IntelligenceResult[]): GroundedAssistantResponse {
  const answerId = `ANS-${Date.now().toString().slice(-6)}`;
  const baseMeta = { data_version: summary.data_version, method_version: summary.method_version, generated_at: summary.generated_at, quality_status: "validated" };

  if (summary.data_version !== EXPECTED_DATA_VERSION || summary.method_version !== EXPECTED_METHOD_VERSION || summary.result_count !== results.length) {
    return { answer_id: answerId, status: "error", classification: "UNAVAILABLE", intent: null, answer: "Assistant blocked: intelligence version or result count failed contract verification.", evidence_references: [], key_values: [], metadata: baseMeta, limitation: "Contract validation must pass before grounded answers can be generated.", suggested_follow_ups: [] };
  }

  const scoped = classifyScopeAndIntent(question);
  if (scoped.classification === "UNSAFE") return { answer_id: answerId, status: "unsafe", classification: "UNSAFE", intent: null, answer: scoped.message!, evidence_references: [], key_values: [], metadata: baseMeta, limitation: "Enforces prompt-injection, secret-protection, and query-catalog boundaries.", suggested_follow_ups: DEFAULT_FOLLOW_UPS };
  if (scoped.classification === "OUT_OF_SCOPE") return { answer_id: answerId, status: "unsupported", classification: "OUT_OF_SCOPE", intent: null, answer: scoped.message!, evidence_references: [], key_values: [], metadata: baseMeta, limitation: summary.important_limitations[0], suggested_follow_ups: DEFAULT_FOLLOW_UPS };
  if (scoped.classification === "MISSING_PARAMETER") return { answer_id: answerId, status: "missing_parameter", classification: "MISSING_PARAMETER", intent: scoped.intent, answer: scoped.message!, evidence_references: [], key_values: [], metadata: baseMeta, limitation: "Requires an approved result ID (RES-0001 to RES-0032).", suggested_follow_ups: ["What evidence supports ranking RES-0001?", "What evidence supports ranking RES-0011?", "What evidence supports ranking RES-0020?"] };

  if (scoped.intent === "compare_groups") {
    const domain = String(scoped.params.domain);
    const matched = results.filter((r) => (r.group_key ?? "").startsWith(`${domain}:`) && r.quality_status !== "rejected").sort((a, b) => (a.priority_rank ?? 999) - (b.priority_rank ?? 999)).slice(0, Number(scoped.params.limit || 5));
    const refs: EvidenceReference[] = matched.map((r) => ({ result_id: r.result_id, record_id: r.record_id, group_key: r.group_key, label: `#${r.priority_rank} ${(r.group_key ?? "").split(":")[1]} (${r.quality_status})` }));
    const kvs: KeyValueItem[] = matched.map((r) => ({ name: (r.group_key ?? r.result_id).replace(`${domain}:`, ""), value: r.result_value ?? 0, unit: r.result_unit ?? "" }));
    const lines = matched.map((r) => `#${r.priority_rank} ${(r.group_key ?? "").replace(`${domain}:`, "").replace(/_/g, " ")}: ${r.result_value?.toLocaleString()} ${r.result_unit} [${r.quality_status}]`);
    return { answer_id: answerId, status: "answered", classification: "SUPPORTED", intent: "compare_groups", answer: `Top ranked ${domain.replace(/_/g, " ")}: ${lines.join("; ")}.`, evidence_references: refs, key_values: kvs, metadata: { ...baseMeta, quality_status: matched.some((m) => m.quality_status === "conditional") ? "conditional" : "validated" }, limitation: matched[0]?.limitation ?? summary.important_limitations[0], suggested_follow_ups: DEFAULT_FOLLOW_UPS };
  }

  if (scoped.intent === "list_maintenance_items") {
    const matched = results.filter((r) => (r.group_key ?? "").startsWith("maintenance_baseline:") && r.quality_status !== "rejected").sort((a, b) => (a.priority_rank ?? 999) - (b.priority_rank ?? 999));
    return { answer_id: answerId, status: "answered", classification: "SUPPORTED", intent: "list_maintenance_items", answer: `Five curated flagship stations (${matched.reduce((sum, r) => sum + (r.result_value ?? 0), 0).toLocaleString()} MW combined capacity derived from validated results) in static maintenance baseline: ${matched.map((r) => r.finding).join(" ")}`, evidence_references: matched.map((r) => ({ result_id: r.result_id, record_id: r.record_id, group_key: r.group_key, label: `${r.entity_id ?? r.group_key} (${r.result_value?.toLocaleString()} MW)` })), key_values: matched.map((r) => ({ name: (r.entity_id ?? r.group_key ?? r.result_id).replace("maintenance_baseline:", ""), value: r.result_value ?? 0, unit: "MW" })), metadata: { ...baseMeta, quality_status: "conditional" }, limitation: "Static baseline snapshot (conditional quality); not live SCADA outage telemetry.", suggested_follow_ups: DEFAULT_FOLLOW_UPS };
  }

  if (scoped.intent === "explain_result") {
    const targetId = String(scoped.params.result_id);
    const item = results.find((r) => r.result_id === targetId);
    if (!item) return { answer_id: answerId, status: "unavailable", classification: "UNAVAILABLE", intent: "explain_result", answer: `Result ${targetId} not found (valid range: RES-0001 to RES-0032).`, evidence_references: [], key_values: [], metadata: baseMeta, limitation: "Only approved IDs RES-0001 through RES-0032 are available.", suggested_follow_ups: DEFAULT_FOLLOW_UPS };
    const evSummary = item.evidence.map((ev) => `${ev.factor}=${typeof ev.value === "number" ? ev.value.toLocaleString() : String(ev.value)}${ev.unit ? ` ${ev.unit}` : ""}`).join(", ");
    return { answer_id: answerId, status: "answered", classification: "SUPPORTED", intent: "explain_result", answer: `${item.result_id} (Rank #${item.priority_rank ?? "N/A"}, ${item.quality_status}): ${item.finding} Factors: ${evSummary}.`, evidence_references: [{ result_id: item.result_id, record_id: item.record_id, group_key: item.group_key, label: `${item.result_id} — ${item.group_key ?? item.metric_name}` }], key_values: [{ name: item.metric_name, value: item.result_value ?? 0, unit: item.result_unit ?? "" }, ...item.evidence.slice(0, 4).map((ev) => ({ name: ev.factor, value: typeof ev.value === "boolean" ? String(ev.value) : (ev.value ?? "null"), unit: ev.unit ?? "" }))], metadata: { data_version: item.data_version, method_version: item.method_version, generated_at: item.generated_at, quality_status: item.quality_status }, limitation: item.limitation, suggested_follow_ups: DEFAULT_FOLLOW_UPS };
  }

  if (scoped.intent === "explain_method") {
    return { answer_id: answerId, status: "answered", classification: "SUPPORTED", intent: "explain_method", answer: `Approved Track A uses Partitioned Comparative Intelligence (method_version ${summary.method_version}) on canonical data v${summary.data_version}, separating 45 global plant entities (MW) from 1,787 U.S. EIA utility records (thousand_MWh) with n >= 5 validation flags.`, evidence_references: [{ result_id: "RES-0001", record_id: null, group_key: "global_region:asia_pacific", label: "Partitioned MW ranking (n >= 5)" }, { result_id: "RES-0020", record_id: null, group_key: "us_2024_fuel:natural_gas", label: "Isolated U.S. 2024 benchmark" }], key_values: [{ name: "validated_outputs", value: summary.result_count, unit: "results" }, { name: "min_group_threshold", value: 5, unit: "entities" }], metadata: baseMeta, limitation: summary.baseline_summary?.limitation ?? summary.important_limitations[0], suggested_follow_ups: DEFAULT_FOLLOW_UPS };
  }

  if (scoped.intent === "explain_limitation" || scoped.intent === "get_data_freshness") {
    return { answer_id: answerId, status: "answered", classification: "SUPPORTED", intent: scoped.intent, answer: `Active package: data_version ${summary.data_version}, method_version ${summary.method_version} (generated_at: ${summary.generated_at}, validation: ${summary.validation_result}). Limitations: ${summary.important_limitations.join(" ")}`, evidence_references: [{ result_id: "RES-0001", record_id: null, group_key: "global_region:asia_pacific", label: `Verified v${summary.data_version} / m${summary.method_version}` }], key_values: [{ name: "data_version", value: summary.data_version, unit: "semver" }, { name: "method_version", value: summary.method_version, unit: "semver" }, { name: "result_count", value: summary.result_count, unit: "results" }], metadata: baseMeta, limitation: summary.important_limitations.join(" | "), suggested_follow_ups: DEFAULT_FOLLOW_UPS };
  }

  return { answer_id: answerId, status: "answered", classification: "SUPPORTED", intent: "get_summary", answer: `Approved Track A Executive Summary (${summary.result_count} outputs): ${summary.key_findings.join(" ")}`, evidence_references: [{ result_id: "RES-0001", record_id: null, group_key: "global_region:asia_pacific", label: "Asia Pacific: 77,505.0 MW" }, { result_id: "RES-0011", record_id: null, group_key: "global_plant_fuel:hydro", label: "Global Hydro: 95,308.0 MW" }, { result_id: "RES-0020", record_id: null, group_key: "us_2024_fuel:natural_gas", label: "U.S. 2024 Natural Gas: 1,864,874.294 thousand_MWh" }, { result_id: "RES-0028", record_id: null, group_key: "maintenance_baseline:guri", label: "Maintenance Baseline: 31,719.0 MW" }], key_values: [{ name: "total_outputs", value: summary.result_count, unit: "results" }, { name: "asia_pacific_capacity", value: 77505.0, unit: "MW" }, { name: "global_hydro_capacity", value: 95308.0, unit: "MW" }, { name: "maintenance_baseline_capacity", value: 31719.0, unit: "MW" }], metadata: baseMeta, limitation: summary.important_limitations[0], suggested_follow_ups: DEFAULT_FOLLOW_UPS };
}
