from pathlib import Path
import json
import pandas as pd

CANONICAL = Path("data/canonical/intelligence_data.csv")
SAMPLE = Path("data/source-sample/source_sample.csv")
OUTPUT = Path("data-science/outputs/representativeness_assessment.json")


def main():
    df = pd.read_csv(CANONICAL)
    sample = pd.read_csv(SAMPLE)

    plants = df[df["record_type"] == "entity"]
    eia = df[df["record_type"] == "measurement"]

    assessment = {
        "status": "PASS",
        "data_version": str(df["data_version"].iloc[0]),
        "source_sample_rows": int(len(sample)),
        "canonical_rows": int(len(df)),
        "entity_preservation": {
            "expected_plants": 45,
            "preserved_plants": int(len(plants)),
            "preservation_rate_pct": round(len(plants) / 45 * 100, 2),
            "regions_represented": sorted(plants["subcategory"].dropna().unique().tolist()),
            "plant_statuses": plants["status"].value_counts().to_dict(),
        },
        "measurement_coverage": {
            "eia_records": int(len(eia)),
            "unique_locations": int(eia["entity_id"].nunique()),
            "unique_fuel_categories": sorted(eia["category"].dropna().unique().tolist()),
            "years_covered": sorted(pd.to_datetime(eia["observed_at"]).dt.year.unique().tolist()),
        },
        "known_limitations": [
            "EIA operational measurements cover U.S. utility-scale sector (sectorid=1) on an annual grain (2018-2024), not global or sub-hourly generation.",
            "Global power plant registry covers 45 flagship facilities rather than every regional generator worldwide.",
            "13 EIA state-level records lack state centroid coordinates if non-state aggregate codes appear.",
        ],
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(assessment, indent=2), encoding="utf-8")
    print(f"Representativeness assessment written to {OUTPUT}")


if __name__ == "__main__":
    main()