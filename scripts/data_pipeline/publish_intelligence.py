from pathlib import Path
import json

SRC_DIR = Path("data-science/outputs")
DST_DIR = Path("public/data/intelligence")

RESULTS_SRC = SRC_DIR / "intelligence_results.json"
SUMMARY_SRC = SRC_DIR / "intelligence_summary.json"
METRICS_SRC = SRC_DIR / "validation_metrics.json"


def main():
    results = json.loads(RESULTS_SRC.read_text(encoding="utf-8"))
    summary = json.loads(SUMMARY_SRC.read_text(encoding="utf-8"))
    metrics = json.loads(METRICS_SRC.read_text(encoding="utf-8"))

    if not isinstance(results, list) or len(results) == 0:
        raise SystemExit("intelligence_results.json must be a non-empty list")
    if summary.get("result_count") != len(results):
        raise SystemExit(f"Summary result_count ({summary.get('result_count')}) != results ({len(results)})")
    if metrics.get("status") != "PASS":
        raise SystemExit("validation_metrics.json status is not PASS")

    data_version = summary["data_version"]
    method_version = summary["method_version"]
    seen_ids = set()
    for item in results:
        if item["result_id"] in seen_ids:
            raise SystemExit(f"Duplicate result_id: {item['result_id']}")
        seen_ids.add(item["result_id"])
        if item["data_version"] != data_version or item["method_version"] != method_version:
            raise SystemExit(f"Version mismatch in {item['result_id']}")

    metadata = {
        "project_id": summary["project_id"],
        "project_title": summary["project_title"],
        "approved_track": summary["approved_track"],
        "data_version": data_version,
        "method_version": method_version,
        "generated_at": summary["generated_at"],
        "quality_status": "validated",
        "result_count": len(results),
        "validation_status": metrics["status"],
        "freshness_window_days": 30,
    }

    DST_DIR.mkdir(parents=True, exist_ok=True)
    (DST_DIR / "results.json").write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    (DST_DIR / "summary.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    (DST_DIR / "metadata.json").write_text(json.dumps(metadata, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Published {len(results)} validated intelligence results to {DST_DIR} (v{data_version} / m{method_version})")


if __name__ == "__main__":
    main()
