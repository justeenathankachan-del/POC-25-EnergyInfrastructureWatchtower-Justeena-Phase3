export type ScopeClassification = "SUPPORTED" | "MISSING_PARAMETER" | "AMBIGUOUS" | "OUT_OF_SCOPE" | "UNSAFE" | "UNAVAILABLE";
export type AssistantIntent = "get_summary" | "compare_groups" | "list_maintenance_items" | "explain_result" | "explain_method" | "explain_limitation" | "get_data_freshness";

export interface EvidenceReference {
  result_id: string;
  record_id: string | null;
  group_key: string | null;
  label: string;
}

export interface KeyValueItem {
  name: string;
  value: string | number;
  unit: string;
}

export interface GroundedAssistantResponse {
  answer_id: string;
  status: "answered" | "missing_parameter" | "unsupported" | "unsafe" | "unavailable" | "error";
  classification: ScopeClassification;
  intent: AssistantIntent | null;
  answer: string;
  evidence_references: EvidenceReference[];
  key_values: KeyValueItem[];
  metadata: { data_version: string; method_version: string; generated_at: string; quality_status: string };
  limitation: string;
  suggested_follow_ups: string[];
}
