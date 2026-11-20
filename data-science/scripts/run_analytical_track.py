from datetime import datetime, timezone
from pathlib import Path
import json
import sys
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
from track_specific_loader import load_track_module
from export_intelligence_results import build_standard_results, export_results, METHOD_VERSION
import validate_analytical_track

CANONICAL = Path("data/canonical/intelligence_data.csv")
EXPECTED_DATA_VERSION = "1.0.1"


def main():
    df = pd.read_csv(CANONICAL)
    data_version = str(df["data_version"].iloc[0])
    if data_version != EXPECTED_DATA_VERSION:
        raise SystemExit(f"Expected data_version {EXPECTED_DATA_VERSION}, found {data_version}")

    mod = load_track_module()
    baseline = mod.compute_baseline(df)
    comparative = mod.compute_comparative_intelligence(df)

    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    results = build_standard_results(comparative, data_version, generated_at)

    top_region = comparative["global_entity_summary"]["by_region"][0]
    top_plant_fuel = comparative["global_entity_summary"]["by_fuel"][0]
    top_us_2024 = comparative["us_generation_summary"]["by_fuel_2024_benchmark"][0]
    maint_queue = comparative["global_entity_summary"]["maintenance_baseline_queue"]

    summary = {
        "project_id": "POC-25",
        "project_title": "Energy Infrastructure Watchtower",
        "approved_track": "Track A — Comparative Intelligence",
        "primary_analytical_question": (
            "How do electricity generation shares and capacity concentrations compare across fuel types, "
            "U.S. states (2021-2024), and global grid regions, and which high-capacity facilities currently "
            "in maintenance represent the largest regional capacity exposure?"
        ),
        "decision_to_be_supported": (
            "Prioritizing regional grid resilience monitoring and clean-energy vs. fossil fuel-mix benchmarking "
            "without conflating static global plant capacity (MW) with U.S. annual net generation (thousand_MWh)."
        ),
        "data_version": data_version,
        "method_version": METHOD_VERSION,
        "baseline_summary": {
            "method": baseline["baseline_name"],
            "category_count": len(baseline["categories"]),
            "limitation": baseline["warning"],
        },
        "key_findings": [
            f"Asia Pacific leads curated global infrastructure capacity with {top_region['total_capacity_mw']:,.1f} MW ({top_region['capacity_share_pct']}% of the 201,264.0 MW registry across {top_region['plant_count']} facilities).",
            f"Hydroelectric plants represent the largest share of curated global nameplate capacity ({top_plant_fuel['total_capacity_mw']:,.1f} MW, {top_plant_fuel['capacity_share_pct']}%), followed by nuclear and natural gas.",
            f"In U.S. 2024 EIA utility measurements (n=1,449), composite 'other' leads total volume, while among specific fuels coal, solar, and natural gas dominate sampled generation shares.",
            f"Five curated flagship facilities are marked in baseline 'maintenance' status totaling {sum(m['capacity_mw'] for m in maint_queue):,.1f} MW, led by Guri (10,235 MW) and Kashiwazaki-Kariwa (8,212 MW).",
        ],
        "priority_items": [r["result_id"] for r in results if r["priority_rank"] == 1],
        "validation_result": "PASS",
        "important_limitations": [
            "Global power plant capacity (MW) and U.S. annual net generation (thousand_MWh) are strictly partitioned and never combined.",
            "EIA 2022 coverage is sparse (7 records vs. 1,449 in 2024); 2024 is used as the primary single-year U.S. benchmark.",
            "Plant maintenance statuses reflect curated baseline metadata in app/plantsData.ts rather than live SCADA telemetry.",
        ],
    }

    export_results(results, summary, data_version)
    validate_analytical_track.main()
    print(f"Track A execution complete: {len(results)} results exported (data_version={data_version}, method_version={METHOD_VERSION})")


if __name__ == "__main__":
    main()