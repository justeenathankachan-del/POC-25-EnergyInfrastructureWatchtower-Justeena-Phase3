import json
from pathlib import Path

RESULTS_PATH = Path("data-science/outputs/intelligence_results.json")
SUMMARY_PATH = Path("data-science/outputs/intelligence_summary.json")
METRICS_PATH = Path("data-science/outputs/validation_metrics.json")

def load_bundle():
    results = json.loads(RESULTS_PATH.read_text(encoding="utf-8"))
    summary = json.loads(SUMMARY_PATH.read_text(encoding="utf-8"))
    metrics = json.loads(METRICS_PATH.read_text(encoding="utf-8"))
    if summary.get("data_version") != "1.0.1" or summary.get("method_version") != "1.0.0":
        raise ValueError("Version mismatch in intelligence summary")
    if summary.get("result_count") != len(results):
        raise ValueError("Result count mismatch between summary and results")
    return results, summary, metrics

def compare_domain_groups(domain: str, limit: int = 5):
    allowed_domains = {"global_region", "global_plant_fuel", "us_2024_fuel"}
    if domain not in allowed_domains:
        raise ValueError(f"Unsupported domain: {domain}")
    limit = max(1, min(int(limit), 25))
    results, summary, _ = load_bundle()
    matched = [
        r for r in results
        if (r.get("group_key") or "").startswith(f"{domain}:") and r.get("quality_status") != "rejected"
    ]
    matched.sort(key=lambda r: (r.get("priority_rank") is None, r.get("priority_rank") or 999))
    selected = matched[:limit]
    return {
        "intent": "compare_groups",
        "parameters": {"domain": domain, "limit": limit},
        "items": selected,
        "metadata": {
            "data_version": summary["data_version"],
            "method_version": summary["method_version"],
            "generated_at": summary["generated_at"],
            "quality_status": "validated"
        },
        "limitation": selected[0]["limitation"] if selected else summary["important_limitations"][0]
    }

def get_maintenance_baseline_items(limit: int = 5):
    limit = max(1, min(int(limit), 10))
    results, summary, _ = load_bundle()
    matched = [
        r for r in results
        if (r.get("group_key") or "").startswith("maintenance_baseline:") and r.get("quality_status") != "rejected"
    ]
    matched.sort(key=lambda r: (r.get("priority_rank") is None, r.get("priority_rank") or 999))
    selected = matched[:limit]
    return {
        "intent": "list_maintenance_items",
        "parameters": {"limit": limit},
        "items": selected,
        "metadata": {
            "data_version": summary["data_version"],
            "method_version": summary["method_version"],
            "generated_at": summary["generated_at"],
            "quality_status": "conditional"
        },
        "limitation": "Maintenance baseline status is a curated static snapshot of 5 flagship stations (31,719.0 MW) and does not represent live SCADA outage telemetry."
    }

def explain_result_by_id(result_id: str):
    results, summary, _ = load_bundle()
    item = next((r for r in results if r.get("result_id") == result_id), None)
    if not item:
        return None
    return {
        "intent": "explain_result",
        "parameters": {"result_id": result_id},
        "items": [item],
        "metadata": {
            "data_version": item["data_version"],
            "method_version": item["method_version"],
            "generated_at": item["generated_at"],
            "quality_status": item["quality_status"]
        },
        "limitation": item["limitation"]
    }
