export type QualityStatus = "validated" | "conditional" | "rejected";

export interface IntelligenceEvidence {
  factor: string;
  value: string | number | boolean | null;
  unit?: string | null;
  contribution?: number | null;
  source_record_id?: string | null;
}

export interface IntelligenceResult {
  result_id: string;
  result_type: string;
  record_id: string | null;
  entity_id: string | null;
  group_key: string | null;
  period_start: string | null;
  period_end: string | null;
  metric_name: string;
  result_value: number | null;
  result_unit: string | null;
  result_category: string | null;
  priority_rank: number | null;
  finding: string;
  evidence: IntelligenceEvidence[];
  method_version: string;
  data_version: string;
  generated_at: string;
  quality_status: QualityStatus;
  limitation: string;
}

export interface IntelligenceSummary {
  project_id: string;
  project_title: string;
  approved_track: string;
  primary_analytical_question: string;
  decision_to_be_supported: string;
  data_version: string;
  method_version: string;
  result_count: number;
  baseline_summary?: {
    method: string;
    category_count: number;
    limitation: string;
  };
  key_findings: string[];
  priority_items: string[];
  validation_result: string;
  important_limitations: string[];
  generated_at: string;
}

export interface IntelligenceMetadata {
  project_id: string;
  project_title: string;
  approved_track: string;
  data_version: string;
  method_version: string;
  generated_at: string;
  quality_status: QualityStatus;
  result_count: number;
  validation_status: string;
  freshness_window_days: number;
}

export interface IntelligenceFilterState {
  groupDomain: string;
  resultCategory: string;
  qualityStatus: string;
  searchQuery: string;
}
