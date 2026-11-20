from datetime import datetime, timezone
from pathlib import Path
import json

RESULTS_PATH = Path("data-science/outputs/intelligence_results.json")
SUMMARY_PATH = Path("data-science/outputs/intelligence_summary.json")
METHOD_VERSION = "1.0.0"


def build_standard_results(comp: dict, data_version: str, generated_at: str) -> list[dict]:
    results = []
    idx = 1

    def next_id() -> str:
        nonlocal idx
        rid = f"RES-{idx:04d}"
        idx += 1
        return rid

    # 1. Global Plant Capacity Rankings by Region (MW)
    for row in comp["global_entity_summary"]["by_region"]:
        qual = "validated" if row["meets_min_group_size"] else "conditional"
        lim = (
            "Derived from curated 45-plant registry (app/plantsData.ts); represents flagship assets rather than total regional grid capacity."
            if row["meets_min_group_size"]
            else f"Small group size (n={row['plant_count']} < 5); interpret regional share with caution."
        )
        results.append({
            "result_id": next_id(),
            "result_type": "ranking",
            "record_id": None,
            "entity_id": None,
            "group_key": f"global_region:{row['subcategory']}",
            "period_start": "2026-01-01T00:00:00Z",
            "period_end": "2026-01-01T00:00:00Z",
            "metric_name": "regional_nameplate_capacity_mw",
            "result_value": float(row["total_capacity_mw"]),
            "result_unit": "MW",
            "result_category": "high_concentration" if row["rank"] <= 3 else "standard_concentration",
            "priority_rank": int(row["rank"]),
            "finding": (
                f"Region '{row['subcategory']}' ranks #{row['rank']} in curated global capacity with "
                f"{row['total_capacity_mw']:,.1f} MW ({row['capacity_share_pct']}% of registry total) across {row['plant_count']} facilities."
            ),
            "evidence": [
                {"factor": "plant_count", "value": int(row["plant_count"]), "unit": "plants"},
                {"factor": "mean_capacity_mw", "value": float(row["mean_capacity_mw"]), "unit": "MW"},
                {"factor": "capacity_share_pct", "value": float(row["capacity_share_pct"]), "unit": "percent"},
                {"factor": "maintenance_mw", "value": float(row["maintenance_mw"]), "unit": "MW"},
            ],
            "method_version": METHOD_VERSION,
            "data_version": data_version,
            "generated_at": generated_at,
            "quality_status": qual,
            "limitation": lim,
        })

    # 2. Global Plant Capacity Rankings by Fuel Category (MW)
    for row in comp["global_entity_summary"]["by_fuel"]:
        qual = "validated" if row["meets_min_group_size"] else "conditional"
        results.append({
            "result_id": next_id(),
            "result_type": "ranking",
            "record_id": None,
            "entity_id": None,
            "group_key": f"global_plant_fuel:{row['category']}",
            "period_start": "2026-01-01T00:00:00Z",
            "period_end": "2026-01-01T00:00:00Z",
            "metric_name": "fuel_nameplate_capacity_mw",
            "result_value": float(row["total_capacity_mw"]),
            "result_unit": "MW",
            "result_category": "dominant_fuel" if row["rank"] <= 3 else "secondary_fuel",
            "priority_rank": int(row["rank"]),
            "finding": (
                f"Fuel '{row['category']}' accounts for {row['total_capacity_mw']:,.1f} MW "
                f"({row['capacity_share_pct']}% share) across {row['plant_count']} curated global plants."
            ),
            "evidence": [
                {"factor": "plant_count", "value": int(row["plant_count"]), "unit": "plants"},
                {"factor": "median_capacity_mw", "value": float(row["median_capacity_mw"]), "unit": "MW"},
                {"factor": "capacity_share_pct", "value": float(row["capacity_share_pct"]), "unit": "percent"},
            ],
            "method_version": METHOD_VERSION,
            "data_version": data_version,
            "generated_at": generated_at,
            "quality_status": qual,
            "limitation": (
                "Static nameplate capacity in MW from curated flagship registry; cannot be summed with U.S. EIA thousand_MWh generation."
                if row["meets_min_group_size"]
                else f"Small group size (n={row['plant_count']} < 5); sensitive to individual flagship facilities."
            ),
        })

    # 3. U.S. Annual Net Generation Rankings by Fuel Category (2024 Single-Year Benchmark, thousand_MWh)
    for row in comp["us_generation_summary"]["by_fuel_2024_benchmark"]:
        qual = "validated" if row["meets_min_group_size"] else "conditional"
        results.append({
            "result_id": next_id(),
            "result_type": "ranking",
            "record_id": None,
            "entity_id": None,
            "group_key": f"us_2024_fuel:{row['category']}",
            "period_start": "2024-01-01T00:00:00Z",
            "period_end": "2024-12-31T23:59:59Z",
            "metric_name": "us_2024_net_generation_thousand_mwh",
            "result_value": float(row["total_2024_thousand_mwh"]),
            "result_unit": "thousand_MWh",
            "result_category": "top_contributor" if row["rank"] <= 3 else "moderate_contributor",
            "priority_rank": int(row["rank"]),
            "finding": (
                f"In U.S. 2024 EIA sample data, '{row['category']}' ranks #{row['rank']} with "
                f"{row['total_2024_thousand_mwh']:,.2f} thousand MWh ({row['share_2024_pct']}% of sampled 2024 generation, n={row['record_count']})."
            ),
            "evidence": [
                {"factor": "record_count_2024", "value": int(row["record_count"]), "unit": "records"},
                {"factor": "mean_2024_thousand_mwh", "value": float(row["mean_2024_thousand_mwh"]), "unit": "thousand_MWh"},
                {"factor": "median_2024_thousand_mwh", "value": float(row["median_2024_thousand_mwh"]), "unit": "thousand_MWh"},
                {"factor": "share_2024_pct", "value": float(row["share_2024_pct"]), "unit": "percent"},
            ],
            "method_version": METHOD_VERSION,
            "data_version": data_version,
            "generated_at": generated_at,
            "quality_status": qual,
            "limitation": "Derived from stratified EIA sample (seed=42); 'other' category aggregates multi-fuel/all-fuels EIA reporting codes.",
        })

    # 4. Curated Baseline Maintenance Exposure Items (Global Entities, MW)
    for row in comp["global_entity_summary"]["maintenance_baseline_queue"]:
        results.append({
            "result_id": next_id(),
            "result_type": "ranking",
            "record_id": row["record_id"],
            "entity_id": row["entity_id"],
            "group_key": f"maintenance_baseline:{row['region']}",
            "period_start": "2026-01-01T00:00:00Z",
            "period_end": "2026-01-01T00:00:00Z",
            "metric_name": "maintenance_baseline_capacity_mw",
            "result_value": float(row["capacity_mw"]),
            "result_unit": "MW",
            "result_category": "curated_maintenance_baseline",
            "priority_rank": int(row["rank"]),
            "finding": (
                f"{row['entity_name']} ({row['region']}, {row['category']}) ranks #{row['rank']} among curated maintenance "
                f"facilities with {row['capacity_mw']:,.1f} MW nameplate capacity."
            ),
            "evidence": [
                {"factor": "capacity_mw", "value": float(row["capacity_mw"]), "unit": "MW"},
                {"factor": "fuel_category", "value": row["category"], "unit": "category"},
                {"factor": "grid_region", "value": row["region"], "unit": "region"},
            ],
            "method_version": METHOD_VERSION,
            "data_version": data_version,
            "generated_at": generated_at,
            "quality_status": "conditional",
            "limitation": "Status reflects curated baseline metadata in app/plantsData.ts, not live SCADA telemetry or current grid-outage risk.",
        })

    return results


def export_results(results: list[dict], summary: dict, data_version: str) -> None:
    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    for item in results:
        item["data_version"] = data_version
        item["method_version"] = METHOD_VERSION
        item["generated_at"] = generated_at

    summary["data_version"] = data_version
    summary["method_version"] = METHOD_VERSION
    summary["generated_at"] = generated_at
    summary["result_count"] = len(results)

    RESULTS_PATH.parent.mkdir(parents=True, exist_ok=True)
    RESULTS_PATH.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    SUMMARY_PATH.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")